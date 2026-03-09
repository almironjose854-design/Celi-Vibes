"use strict";

const crypto = require("crypto");
const fs = require("fs");
const fsp = require("fs/promises");
const http = require("http");
const path = require("path");

const { StoreRepository } = require("./lib/store-repository");

const ROOT_DIR = __dirname;
loadEnvFile(path.join(ROOT_DIR, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const MAX_JSON_BODY_BYTES = 1024 * 1024;
const SESSION_COOKIE_NAME = "cv_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 8;
const CLOUDINARY_CONFIG = {
  cloudName: String(process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  apiKey: String(process.env.CLOUDINARY_API_KEY || "").trim(),
  apiSecret: String(process.env.CLOUDINARY_API_SECRET || "").trim(),
};
const CLOUDINARY_FOLDER = String(
  process.env.CLOUDINARY_FOLDER || "celi-vibes/productos"
).trim();
const storeRepository = new StoreRepository({
  rootDir: ROOT_DIR,
  defaultUsername: process.env.ADMIN_USERNAME,
  defaultPassword: process.env.ADMIN_PASSWORD,
});

const STATIC_ROUTES = new Map([
  ["/", "index.html"],
  ["/admin", "admin.html"],
]);
const PUBLIC_FILES = new Set([
  "admin.css",
  "admin.html",
  "admin.js",
  "index.html",
  "script.js",
  "styles.css",
]);
const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};
const loginAttempts = new Map();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      return;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      return;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

function isCloudinaryReady() {
  return (
    Boolean(CLOUDINARY_CONFIG.cloudName) &&
    Boolean(CLOUDINARY_CONFIG.apiKey) &&
    Boolean(CLOUDINARY_CONFIG.apiSecret)
  );
}

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  response.end(body);
}

function sendNoContent(response, statusCode = 204, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Length": 0,
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  response.end();
}

function sendText(response, statusCode, message, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(message),
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  response.end(message);
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getCloudinarySignaturePayload() {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = {
    folder: CLOUDINARY_FOLDER,
    overwrite: "false",
    timestamp,
    unique_filename: "true",
    use_filename: "true",
  };

  const toSign = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(`${toSign}${CLOUDINARY_CONFIG.apiSecret}`, "utf8")
    .digest("hex");

  return {
    apiKey: CLOUDINARY_CONFIG.apiKey,
    cloudName: CLOUDINARY_CONFIG.cloudName,
    folder: params.folder,
    maxUploadMb: MAX_UPLOAD_MB,
    overwrite: params.overwrite,
    signature,
    timestamp,
    uniqueFilename: params.unique_filename,
    uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      CLOUDINARY_CONFIG.cloudName
    )}/image/upload`,
    useFilename: params.use_filename,
  };
}

function getStaticPath(requestPath) {
  if (STATIC_ROUTES.has(requestPath)) {
    return STATIC_ROUTES.get(requestPath);
  }

  const cleanedPath = requestPath.replace(/^\/+/, "");
  if (!cleanedPath || cleanedPath.includes("\0")) {
    return cleanedPath ? null : "index.html";
  }

  if (path.extname(cleanedPath)) {
    return cleanedPath;
  }

  return `${cleanedPath}.html`;
}

function isPublicPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");

  if (normalized.startsWith(".") || normalized.includes("/.") || normalized.includes("..")) {
    return false;
  }

  return normalized.startsWith("assets/") || PUBLIC_FILES.has(normalized);
}

async function tryServeStatic(requestPath, response, method) {
  const relativePath = getStaticPath(requestPath);
  if (!relativePath || !isPublicPath(relativePath)) {
    return false;
  }

  const normalizedPath = path.normalize(path.join(ROOT_DIR, relativePath));
  const rootWithSeparator = `${ROOT_DIR}${path.sep}`;
  if (normalizedPath !== ROOT_DIR && !normalizedPath.startsWith(rootWithSeparator)) {
    sendText(response, 403, "Acceso denegado.");
    return true;
  }

  try {
    const stats = await fsp.stat(normalizedPath);
    if (!stats.isFile()) {
      return false;
    }

    const extension = path.extname(normalizedPath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    response.writeHead(200, {
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600",
      "Content-Length": stats.size,
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    });

    if (method === "HEAD") {
      response.end();
      return true;
    }

    const stream = fs.createReadStream(normalizedPath);
    stream.on("error", () => {
      if (!response.headersSent) {
        sendText(response, 500, "No se pudo leer el archivo.");
      } else {
        response.destroy();
      }
    });
    stream.pipe(response);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }

    sendText(response, 500, "Error interno del servidor.");
    return true;
  }
}

function getRequestPath(request) {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    return decodeURIComponent(url.pathname);
  } catch {
    return "/";
  }
}

function parseCookies(headerValue) {
  const cookies = new Map();
  String(headerValue || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex <= 0) {
        return;
      }

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();
      cookies.set(key, decodeURIComponent(value));
    });

  return cookies;
}

function buildCookie(name, value, options = {}) {
  const segments = [`${name}=${encodeURIComponent(value)}`];
  segments.push(`Path=${options.path || "/"}`);

  if (options.httpOnly !== false) {
    segments.push("HttpOnly");
  }

  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }

  if (options.maxAge !== undefined) {
    segments.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  if (options.secure) {
    segments.push("Secure");
  }

  return segments.join("; ");
}

function shouldUseSecureCookies(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "").toLowerCase();
  return process.env.NODE_ENV === "production" || forwardedProto.includes("https");
}

function signValue(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function createSessionToken(identity) {
  const payload = Buffer.from(
    JSON.stringify({
      u: identity.username,
      v: identity.sessionVersion,
      exp: Date.now() + SESSION_TTL_MS,
    }),
    "utf8"
  ).toString("base64url");
  const signature = signValue(payload, identity.sessionSecret);
  return `${payload}.${signature}`;
}

function isValidSignature(left, right) {
  const leftBuffer = Buffer.from(String(left || ""), "utf8");
  const rightBuffer = Buffer.from(String(right || ""), "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifySessionToken(token, identity) {
  if (!token || !identity) {
    return false;
  }

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex <= 0) {
    return false;
  }

  const payload = token.slice(0, separatorIndex);
  const providedSignature = token.slice(separatorIndex + 1);
  const expectedSignature = signValue(payload, identity.sessionSecret);

  if (!isValidSignature(providedSignature, expectedSignature)) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return (
      parsed &&
      parsed.u === identity.username &&
      Number(parsed.v) === Number(identity.sessionVersion) &&
      Number(parsed.exp) > Date.now()
    );
  } catch {
    return false;
  }
}

function getClientIp(request) {
  const forwarded = String(request.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return forwarded || String(request.socket?.remoteAddress || "unknown");
}

function checkLoginRateLimit(request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 8;
  const record = loginAttempts.get(ip);

  if (!record || now - record.startedAt > windowMs) {
    loginAttempts.set(ip, { startedAt: now, attempts: 0 });
    return { allowed: true, ip };
  }

  if (record.attempts >= maxAttempts) {
    return { allowed: false, ip };
  }

  return { allowed: true, ip };
}

function registerFailedLogin(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const current = loginAttempts.get(ip);

  if (!current || now - current.startedAt > windowMs) {
    loginAttempts.set(ip, { startedAt: now, attempts: 1 });
    return;
  }

  current.attempts += 1;
  loginAttempts.set(ip, current);
}

function clearFailedLogin(ip) {
  if (ip) {
    loginAttempts.delete(ip);
  }
}

async function readJsonBody(request, maxBytes = MAX_JSON_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    request.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        reject(createHttpError(413, "La solicitud supera el tamano permitido."));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }

      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve(JSON.parse(body));
      } catch {
        reject(createHttpError(400, "El cuerpo JSON no es valido."));
      }
    });

    request.on("error", reject);
  });
}

async function getAdminSession(request) {
  const identity = await storeRepository.getAdminIdentity();
  const cookies = parseCookies(request.headers.cookie);
  const token = cookies.get(SESSION_COOKIE_NAME);

  return verifySessionToken(token, identity) ? identity : null;
}

async function requireAdminSession(request, response) {
  const identity = await getAdminSession(request);
  if (identity) {
    return identity;
  }

  sendJson(response, 401, {
    error: { message: "Tu sesion expiro o no es valida. Inicia sesion nuevamente." },
  });
  return null;
}

function buildSessionCookie(request, token) {
  return buildCookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
    sameSite: "Strict",
    secure: shouldUseSecureCookies(request),
  });
}

function buildClearedSessionCookie(request) {
  return buildCookie(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "Strict",
    secure: shouldUseSecureCookies(request),
  });
}

async function handleApiRequest(request, response, method, requestPath) {
  if (method === "GET" && requestPath === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      service: "celi-vibes-api",
      timestamp: new Date().toISOString(),
      cloudinaryReady: isCloudinaryReady(),
      storageReady: true,
    });
    return true;
  }

  if (method === "GET" && requestPath === "/api/store/bootstrap") {
    const store = await storeRepository.getPublicStore();
    sendJson(response, 200, store);
    return true;
  }

  if (method === "POST" && requestPath === "/api/store/orders") {
    const payload = await readJsonBody(request);
    const result = await storeRepository.placeOrder({
      customer: payload.customer,
      items: payload.items,
    });
    sendJson(response, 201, result);
    return true;
  }

  if (method === "GET" && requestPath === "/api/uploads/product-image/signature") {
    if (!isCloudinaryReady()) {
      throw createHttpError(
        500,
        "Cloudinary no esta configurado en el servidor. Revisa variables de entorno."
      );
    }

    sendJson(response, 200, getCloudinarySignaturePayload());
    return true;
  }

  if (method === "GET" && requestPath === "/api/admin/session") {
    const identity = await getAdminSession(request);
    sendJson(response, 200, {
      authenticated: Boolean(identity),
      username: identity ? identity.username : "",
    });
    return true;
  }

  if (method === "POST" && requestPath === "/api/admin/login") {
    const rateLimitState = checkLoginRateLimit(request);
    if (!rateLimitState.allowed) {
      throw createHttpError(429, "Demasiados intentos. Espera unos minutos e intenta otra vez.");
    }

    const payload = await readJsonBody(request);
    const username = String(payload.username ?? "").trim();
    const password = String(payload.password ?? "");
    const authenticated = await storeRepository.verifyAdminCredentials(username, password);

    if (!authenticated) {
      registerFailedLogin(rateLimitState.ip);
      throw createHttpError(401, "Credenciales invalidas.");
    }

    clearFailedLogin(rateLimitState.ip);
    const identity = await storeRepository.getAdminIdentity();
    const snapshot = await storeRepository.getAdminSnapshot();
    const token = createSessionToken(identity);

    sendJson(
      response,
      200,
      snapshot,
      {
        "Set-Cookie": buildSessionCookie(request, token),
      }
    );
    return true;
  }

  if (method === "POST" && requestPath === "/api/admin/logout") {
    sendNoContent(response, 204, {
      "Set-Cookie": buildClearedSessionCookie(request),
    });
    return true;
  }

  if (requestPath.startsWith("/api/admin/")) {
    const identity = await requireAdminSession(request, response);
    if (!identity) {
      return true;
    }

    if (method === "GET" && requestPath === "/api/admin/bootstrap") {
      const snapshot = await storeRepository.getAdminSnapshot();
      sendJson(response, 200, snapshot);
      return true;
    }

    if (method === "PUT" && requestPath === "/api/admin/store") {
      const payload = await readJsonBody(request);
      const saved = await storeRepository.saveStoreSnapshot(payload);
      sendJson(response, 200, saved);
      return true;
    }

    if (method === "GET" && requestPath === "/api/admin/export") {
      const exported = await storeRepository.exportStoreSnapshot();
      sendJson(response, 200, exported, {
        "Content-Disposition": 'attachment; filename="celi-vibes-backup.json"',
      });
      return true;
    }

    if (method === "POST" && requestPath === "/api/admin/import") {
      const payload = await readJsonBody(request);
      const imported = await storeRepository.importStoreSnapshot(payload);
      sendJson(response, 200, imported);
      return true;
    }

    if (method === "POST" && requestPath === "/api/admin/reset") {
      const reset = await storeRepository.resetStore();
      sendJson(response, 200, reset);
      return true;
    }

    if (method === "POST" && requestPath === "/api/admin/credentials") {
      const payload = await readJsonBody(request);
      const updated = await storeRepository.updateCredentials({
        currentUsername: payload.currentUsername,
        currentPassword: payload.currentPassword,
        newUsername: payload.newUsername,
        newPassword: payload.newPassword,
      });
      const token = createSessionToken(updated);
      sendJson(
        response,
        200,
        { username: updated.username },
        {
          "Set-Cookie": buildSessionCookie(request, token),
        }
      );
      return true;
    }
  }

  if (requestPath.startsWith("/api/")) {
    sendJson(response, 404, { error: { message: "Endpoint no encontrado." } });
    return true;
  }

  return false;
}

async function handleRequest(request, response) {
  const method = request.method || "GET";
  const requestPath = getRequestPath(request);

  const apiHandled = await handleApiRequest(request, response, method, requestPath);
  if (apiHandled) {
    return;
  }

  if (method !== "GET" && method !== "HEAD") {
    sendText(response, 405, "Metodo no permitido.");
    return;
  }

  const served = await tryServeStatic(requestPath, response, method);
  if (!served) {
    sendText(response, 404, "Archivo no encontrado.");
  }
}

function createServer() {
  return http.createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      const statusCode = Number(error?.statusCode || 500);
      const publicMessage =
        statusCode >= 500
          ? "Error interno del servidor."
          : String(error?.message || "Error en la solicitud.");
      sendJson(response, statusCode, { error: { message: publicMessage } });
    });
  });
}

async function startServer(port = PORT) {
  await storeRepository.init();

  const server = createServer();
  await new Promise((resolve) => {
    server.listen(port, resolve);
  });

  const mode = process.env.NODE_ENV === "production" ? "production" : "development";
  console.log(`[celi-vibes] server running on http://localhost:${port} (${mode})`);
  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  createServer,
  startServer,
};
