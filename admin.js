const STORAGE_KEYS = {
  cart: "celi-vibes-cart",
};

const CLOUDINARY_SIGNATURE_ENDPOINT = "/api/uploads/product-image/signature";
const ADMIN_LOGIN_ENDPOINT = "/api/admin/login";
const ADMIN_LOGOUT_ENDPOINT = "/api/admin/logout";
const ADMIN_SESSION_ENDPOINT = "/api/admin/session";
const ADMIN_BOOTSTRAP_ENDPOINT = "/api/admin/bootstrap";
const ADMIN_STORE_ENDPOINT = "/api/admin/store";
const ADMIN_EXPORT_ENDPOINT = "/api/admin/export";
const ADMIN_IMPORT_ENDPOINT = "/api/admin/import";
const ADMIN_RESET_ENDPOINT = "/api/admin/reset";
const ADMIN_CREDENTIALS_ENDPOINT = "/api/admin/credentials";
const ORDER_STATUS_VALUES = ["pendiente", "confirmado", "enviado", "completado", "cancelado"];
const ORDER_STATUS_SET = new Set(ORDER_STATUS_VALUES);
const ORDER_STATUS_META = {
  pendiente: { label: "Pendiente", color: "#e9a65b" },
  confirmado: { label: "Confirmado", color: "#5c9edb" },
  enviado: { label: "Enviado", color: "#7d7be8" },
  completado: { label: "Completado", color: "#4ca474" },
  cancelado: { label: "Cancelado", color: "#cf6660" },
};

const defaultProducts = [
  {
    id: "cv-001",
    name: "Set Aura Dorada",
    category: "joyeria",
    price: 189000,
    rating: 4.9,
    badge: "Top ventas",
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
    description:
      "Collar + aretes en tono dorado suave. Liviano, elegante y perfecto para elevar cualquier outfit.",
  },
  {
    id: "cv-002",
    name: "Neceser Velvet Glow",
    category: "belleza",
    price: 132000,
    rating: 4.8,
    badge: "Nuevo",
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
    description:
      "Neceser premium con compartimentos inteligentes para skincare y maquillaje de viaje.",
  },
  {
    id: "cv-003",
    name: "Pack Scrunchies Premium",
    category: "cabello",
    price: 76000,
    rating: 4.7,
    badge: "3x2",
    stock: 42,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    description:
      "Set de 6 scrunchies satinados que cuidan el cabello y combinan con looks casuales o formales.",
  },
  {
    id: "cv-004",
    name: "Tote Bag Celi Studio",
    category: "accesorios",
    price: 158000,
    rating: 4.9,
    badge: "Edicion limitada",
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=700&q=80",
    description:
      "Bolso tote amplio, resistente y minimalista para oficina, estudio o salidas de fin de semana.",
  },
  {
    id: "cv-005",
    name: "Set Skincare Soft Rose",
    category: "belleza",
    price: 249000,
    rating: 5,
    badge: "Best Seller",
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    description:
      "Rutina completa de limpieza e hidratacion para piel luminosa y fresca todos los dias.",
  },
  {
    id: "cv-006",
    name: "Pulsera Luna Cristal",
    category: "joyeria",
    price: 97000,
    rating: 4.6,
    badge: "Favorito",
    stock: 31,
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=700&q=80",
    description:
      "Pulsera delicada con cristales luminosos para usar sola o combinar con capas.",
  },
  {
    id: "cv-007",
    name: "Planner Blossom 2026",
    category: "lifestyle",
    price: 116000,
    rating: 4.8,
    badge: "Organizacion",
    stock: 26,
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80",
    description:
      "Planner femenino con metas mensuales, seguimiento de habitos y seccion de gratitud.",
  },
  {
    id: "cv-008",
    name: "Kit Self Care Night",
    category: "lifestyle",
    price: 289000,
    rating: 4.9,
    badge: "Regalo ideal",
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=700&q=80",
    description:
      "Incluye vela aromatica, mascara de descanso y body mist para una noche de autocuidado total.",
  },
];

const defaultStoreContent = {
  shippingMsg: "Envios a todo Paraguay | Compra minima Gs. 120.000",
  supportMsg: "Atencion por WhatsApp: +595 981 000 000",
  heroKicker: "Boutique online para la mujer actual",
  heroTitle: "Accesorios, estilo y vibra femenina en un solo lugar",
  heroDescription:
    "Descubri colecciones exclusivas pensadas para potenciar tu look diario, regalar con amor y sentirte increible.",
  heroImage:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  heroPrimaryBtnText: "Comprar ahora",
  promoTag: "Flash Sale Marzo 2026",
  promoTitle: "3x2 en scrunchies premium y 20% off en sets de skincare",
  promoButtonText: "Aprovechar promo",
  newsletterTitle: "Recibi lanzamientos y descuentos privados",
  newsletterDescription: "Suscribite y obtene 10% en tu primera compra.",
};

const defaultAdminCredentials = {
  username: "admin",
};

const state = {
  products: cloneDefaults(),
  content: { ...defaultStoreContent },
  orders: [],
  credentials: { ...defaultAdminCredentials },
  sessionActive: false,
  editingProductId: "",
  productSearch: "",
  productCategoryFilter: "all",
  productStockFilter: "all",
  orderSearch: "",
  orderStatusFilter: "all",
  orderDateFrom: "",
  orderDateTo: "",
  reportRange: "30",
  reportRevenueMode: "completed",
  isUploadingImage: false,
  productPreviewObjectUrl: "",
};

const loginView = document.querySelector("#loginView");
const panelView = document.querySelector("#panelView");
const loginForm = document.querySelector("#loginForm");
const loginUser = document.querySelector("#loginUser");
const loginPassword = document.querySelector("#loginPassword");
const loginMsg = document.querySelector("#loginMsg");
const logoutBtn = document.querySelector("#logoutBtn");
const sessionLabel = document.querySelector("#sessionLabel");
const panelNav = document.querySelector("#panelNav");
const panelSections = [...document.querySelectorAll(".panel-section")];

const metricProducts = document.querySelector("#metricProducts");
const metricCategories = document.querySelector("#metricCategories");
const metricLowStock = document.querySelector("#metricLowStock");
const metricPendingOrders = document.querySelector("#metricPendingOrders");
const metricOrders = document.querySelector("#metricOrders");
const metricRevenue = document.querySelector("#metricRevenue");

const productForm = document.querySelector("#productForm");
const productId = document.querySelector("#productId");
const productName = document.querySelector("#productName");
const productCategory = document.querySelector("#productCategory");
const productPrice = document.querySelector("#productPrice");
const productRating = document.querySelector("#productRating");
const productBadge = document.querySelector("#productBadge");
const productStock = document.querySelector("#productStock");
const productImage = document.querySelector("#productImage");
const productImageFile = document.querySelector("#productImageFile");
const productImagePreviewWrap = document.querySelector("#productImagePreviewWrap");
const productImagePreview = document.querySelector("#productImagePreview");
const uploadImageMsg = document.querySelector("#uploadImageMsg");
const productDescription = document.querySelector("#productDescription");
const saveProductBtn = document.querySelector("#saveProductBtn");
const cancelEditBtn = document.querySelector("#cancelEditBtn");
const productMsg = document.querySelector("#productMsg");
const productSearch = document.querySelector("#productSearch");
const productCategoryFilter = document.querySelector("#productCategoryFilter");
const productStockFilter = document.querySelector("#productStockFilter");
const productTableMeta = document.querySelector("#productTableMeta");
const productTable = document.querySelector("#productTable");
const bulkPriceForm = document.querySelector("#bulkPriceForm");
const bulkPricePercent = document.querySelector("#bulkPricePercent");

const contentForm = document.querySelector("#contentForm");
const contentShippingMsg = document.querySelector("#contentShippingMsg");
const contentSupportMsg = document.querySelector("#contentSupportMsg");
const contentHeroKicker = document.querySelector("#contentHeroKicker");
const contentHeroTitle = document.querySelector("#contentHeroTitle");
const contentHeroDescription = document.querySelector("#contentHeroDescription");
const contentHeroImage = document.querySelector("#contentHeroImage");
const contentHeroButton = document.querySelector("#contentHeroButton");
const contentPromoTag = document.querySelector("#contentPromoTag");
const contentPromoTitle = document.querySelector("#contentPromoTitle");
const contentPromoButton = document.querySelector("#contentPromoButton");
const contentNewsletterTitle = document.querySelector("#contentNewsletterTitle");
const contentNewsletterDescription = document.querySelector("#contentNewsletterDescription");
const contentMsg = document.querySelector("#contentMsg");

const ordersList = document.querySelector("#ordersList");
const ordersSearch = document.querySelector("#ordersSearch");
const ordersStatusFilter = document.querySelector("#ordersStatusFilter");
const ordersDateFrom = document.querySelector("#ordersDateFrom");
const ordersDateTo = document.querySelector("#ordersDateTo");
const ordersResetFilters = document.querySelector("#ordersResetFilters");
const ordersExportCsv = document.querySelector("#ordersExportCsv");
const ordersMsg = document.querySelector("#ordersMsg");
const ordersStatusSummary = document.querySelector("#ordersStatusSummary");
const clearCompletedOrders = document.querySelector("#clearCompletedOrders");
const reportRange = document.querySelector("#reportRange");
const reportRevenueMode = document.querySelector("#reportRevenueMode");
const exportReportsBtn = document.querySelector("#exportReportsBtn");
const reportOrdersCount = document.querySelector("#reportOrdersCount");
const reportRevenueTotal = document.querySelector("#reportRevenueTotal");
const reportAvgTicket = document.querySelector("#reportAvgTicket");
const reportCompletionRate = document.querySelector("#reportCompletionRate");
const reportTrendHint = document.querySelector("#reportTrendHint");
const reportSalesChart = document.querySelector("#reportSalesChart");
const reportTopProductsChart = document.querySelector("#reportTopProductsChart");
const reportStatusDonut = document.querySelector("#reportStatusDonut");
const reportStatusLegend = document.querySelector("#reportStatusLegend");
const reportsMsg = document.querySelector("#reportsMsg");

const securityForm = document.querySelector("#securityForm");
const currentUser = document.querySelector("#currentUser");
const currentPassword = document.querySelector("#currentPassword");
const newUser = document.querySelector("#newUser");
const newPassword = document.querySelector("#newPassword");
const securityMsg = document.querySelector("#securityMsg");

const exportDataBtn = document.querySelector("#exportDataBtn");
const importDataInput = document.querySelector("#importDataInput");
const resetStoreBtn = document.querySelector("#resetStoreBtn");
const dataMsg = document.querySelector("#dataMsg");

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function apiFetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorText =
      payload?.error?.message || "No se pudo completar la solicitud al servidor.";
    throw new Error(errorText);
  }

  return payload;
}

function gs(amount) {
  return `Gs. ${amount.toLocaleString("es-PY")}`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function sanitizeCategory(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function formatCategory(value) {
  return value
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === '"') return "&quot;";
    return "&#39;";
  });
}

function extractDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function setMessage(node, text, isError = false) {
  if (!node) return;
  node.textContent = text;
  node.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function formatDateTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "-";
  return date.toLocaleString("es-PY", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatOrderStatus(status) {
  return capitalize(String(status || "").trim() || "pendiente");
}

function normalizeOrderStatusHistoryEntry(entry) {
  if (!entry || typeof entry !== "object") return null;

  const rawStatus = String(entry.status ?? "").trim();
  if (!ORDER_STATUS_SET.has(rawStatus)) return null;

  const changedAt = new Date(entry.changedAt || entry.createdAt || Date.now());
  if (!Number.isFinite(changedAt.getTime())) return null;

  return {
    status: rawStatus,
    changedAt: changedAt.toISOString(),
    changedBy: String(entry.changedBy ?? "sistema").trim() || "sistema",
    note: String(entry.note ?? "").trim(),
  };
}

function createDefaultOrderStatusHistory(createdAtIso) {
  const fallbackDate = new Date(createdAtIso);
  const changedAtIso = Number.isFinite(fallbackDate.getTime())
    ? fallbackDate.toISOString()
    : new Date().toISOString();

  return [
    {
      status: "pendiente",
      changedAt: changedAtIso,
      changedBy: "cliente",
      note: "Pedido creado",
    },
  ];
}

function appendOrderStatusHistory(order, nextStatus, changedBy = "admin", note = "") {
  if (!order || typeof order !== "object") return false;
  if (!ORDER_STATUS_SET.has(nextStatus)) return false;

  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  const latest = history[history.length - 1];

  if (latest && latest.status === nextStatus) {
    return false;
  }

  history.push({
    status: nextStatus,
    changedAt: new Date().toISOString(),
    changedBy: String(changedBy || "admin").trim() || "admin",
    note: String(note || "").trim(),
  });

  order.statusHistory = history;
  return true;
}

function cloneDefaults() {
  return defaultProducts.map((product) => ({ ...product }));
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") return null;

  const normalized = {
    id: String(product.id ?? "").trim(),
    name: String(product.name ?? "").trim(),
    category: sanitizeCategory(String(product.category ?? "")),
    price: Math.round(Number(product.price)),
    rating: Number(product.rating),
    badge: String(product.badge ?? "").trim(),
    stock: Math.max(0, Math.round(Number(product.stock))),
    image: String(product.image ?? "").trim(),
    description: String(product.description ?? "").trim(),
  };

  const valid =
    normalized.id &&
    normalized.name &&
    normalized.category &&
    normalized.badge &&
    normalized.image &&
    normalized.description &&
    Number.isFinite(normalized.price) &&
    normalized.price > 0 &&
    Number.isFinite(normalized.rating) &&
    Number.isFinite(normalized.stock);

  if (!valid) return null;

  normalized.rating = Math.min(5, Math.max(0, normalized.rating));
  return normalized;
}

function normalizeContent(content) {
  if (!content || typeof content !== "object") return { ...defaultStoreContent };

  const result = { ...defaultStoreContent };

  Object.keys(defaultStoreContent).forEach((key) => {
    const value = content[key];
    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim();
    }
  });

  return result;
}

function normalizeCustomer(customer) {
  const source = customer && typeof customer === "object" ? customer : {};
  const name = String(source.name ?? "").trim();
  const phone = String(source.phone ?? "").trim();
  const phoneDigits = extractDigits(source.phoneDigits || phone);
  const email = String(source.email ?? "").trim();
  const address = String(source.address ?? "").trim();
  const notes = String(source.notes ?? "").trim();

  return {
    name: name || "Sin datos",
    phone,
    phoneDigits,
    email,
    address,
    notes,
  };
}

function normalizeOrder(order) {
  if (!order || typeof order !== "object") return null;

  const id = String(order.id ?? "").trim();
  const createdAt = new Date(order.createdAt || Date.now());
  const rawStatus = String(order.status ?? "pendiente").trim() || "pendiente";
  const status = ORDER_STATUS_SET.has(rawStatus) ? rawStatus : "pendiente";

  const items = Array.isArray(order.items)
    ? order.items
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const itemId = String(item.id ?? "").trim();
          const name = String(item.name ?? "").trim();
          const price = Math.round(Number(item.price));
          const qty = Math.max(1, Math.round(Number(item.qty)));
          const subtotalRaw = Number(item.subtotal);
          const subtotal = Number.isFinite(subtotalRaw) ? Math.round(subtotalRaw) : price * qty;

          if (!itemId || !name || !Number.isFinite(price) || price <= 0) return null;
          return { id: itemId, name, price, qty, subtotal };
        })
        .filter(Boolean)
    : [];

  if (!id || !Number.isFinite(createdAt.getTime()) || items.length === 0) {
    return null;
  }

  const itemsTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalRaw = Number(order.total);
  const total = Number.isFinite(totalRaw) ? Math.round(totalRaw) : itemsTotal;
  const normalizedCreatedAt = createdAt.toISOString();

  let statusHistory = Array.isArray(order.statusHistory)
    ? order.statusHistory
        .map(normalizeOrderStatusHistoryEntry)
        .filter(Boolean)
        .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime())
    : [];

  if (statusHistory.length === 0) {
    statusHistory = createDefaultOrderStatusHistory(normalizedCreatedAt);
  }

  const latestHistory = statusHistory[statusHistory.length - 1];
  if (!latestHistory || latestHistory.status !== status) {
    statusHistory.push({
      status,
      changedAt: normalizedCreatedAt,
      changedBy: "sistema",
      note: "Estado sincronizado",
    });
  }

  return {
    id,
    createdAt: normalizedCreatedAt,
    status,
    customer: normalizeCustomer(order.customer),
    items,
    total,
    statusHistory,
  };
}

function applyAdminSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }

  state.products = Array.isArray(snapshot.products)
    ? snapshot.products.map(normalizeProduct).filter(Boolean)
    : cloneDefaults();
  if (!state.products.length) {
    state.products = cloneDefaults();
  }

  state.content = normalizeContent(snapshot.content);
  state.orders = Array.isArray(snapshot.orders)
    ? snapshot.orders.map(normalizeOrder).filter(Boolean)
    : [];

  if (typeof snapshot.username === "string" && snapshot.username.trim()) {
    state.credentials.username = snapshot.username.trim();
  }
}

async function fetchAdminSnapshot() {
  return apiFetchJson(ADMIN_BOOTSTRAP_ENDPOINT);
}

async function persistAdminStoreSnapshot() {
  const saved = await apiFetchJson(ADMIN_STORE_ENDPOINT, {
    method: "PUT",
    body: JSON.stringify({
      products: state.products,
      content: state.content,
      orders: state.orders,
    }),
  });

  applyAdminSnapshot({
    ...saved,
    username: state.credentials.username,
  });
}

async function syncAdminStateFromServer() {
  const snapshot = await fetchAdminSnapshot();
  applyAdminSnapshot(snapshot);
}

async function handleStorePersistence(messageNode, successMessage) {
  try {
    await persistAdminStoreSnapshot();
    cleanCartAgainstProducts();
    refreshAll();
    if (successMessage) {
      setMessage(messageNode, successMessage);
    }
    return true;
  } catch (error) {
    try {
      await syncAdminStateFromServer();
      refreshAll();
    } catch {}

    const text =
      error instanceof Error ? error.message : "No se pudo guardar el cambio en el servidor.";
    if (messageNode) {
      setMessage(messageNode, text, true);
    }
    return false;
  }
}

function isSessionActive() {
  return state.sessionActive;
}

function setSession(isActive) {
  state.sessionActive = Boolean(isActive);
}

function cleanCartAgainstProducts() {
  const raw = localStorage.getItem(STORAGE_KEYS.cart);
  const parsed = raw ? parseJson(raw) : null;
  if (!Array.isArray(parsed)) return;

  const productMap = new Map(state.products.map((product) => [product.id, product]));

  const nextCart = parsed
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const product = productMap.get(String(item.id ?? ""));
      if (!product || product.stock <= 0) return null;

      const qty = Math.min(Math.max(1, Number(item.qty) || 1), product.stock);
      if (qty <= 0) return null;

      return {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      };
    })
    .filter(Boolean);

  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(nextCart));
}
function createProductId() {
  return `cv-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function updateSaveButtonLabel() {
  if (state.isUploadingImage) {
    saveProductBtn.textContent = "Guardando...";
    return;
  }

  saveProductBtn.textContent = state.editingProductId
    ? "Actualizar producto"
    : "Guardar producto";
}

function clearProductPreviewObjectUrl() {
  if (!state.productPreviewObjectUrl) return;
  URL.revokeObjectURL(state.productPreviewObjectUrl);
  state.productPreviewObjectUrl = "";
}

function setProductImagePreview(src) {
  if (!productImagePreviewWrap || !productImagePreview) return;

  const normalizedSrc = String(src ?? "").trim();
  if (!normalizedSrc) {
    productImagePreview.src = "";
    productImagePreviewWrap.classList.add("hidden");
    return;
  }

  productImagePreview.src = normalizedSrc;
  productImagePreviewWrap.classList.remove("hidden");
}

function updateProductImagePreview() {
  if (!productImageFile || !productImage) return;

  const file = productImageFile.files?.[0];

  if (file) {
    clearProductPreviewObjectUrl();
    state.productPreviewObjectUrl = URL.createObjectURL(file);
    setProductImagePreview(state.productPreviewObjectUrl);
    return;
  }

  clearProductPreviewObjectUrl();
  setProductImagePreview(productImage.value);
}

function resetProductForm() {
  state.editingProductId = "";
  productId.value = "";
  productForm.reset();
  if (productImageFile) productImageFile.value = "";
  updateProductImagePreview();
  setMessage(uploadImageMsg, "");
  updateSaveButtonLabel();
  cancelEditBtn.classList.add("hidden");
}

function readProductForm({ allowEmptyImage = false } = {}) {
  const payload = {
    name: productName.value.trim(),
    category: sanitizeCategory(productCategory.value),
    price: Math.round(Number(productPrice.value)),
    rating: Number(productRating.value),
    badge: productBadge.value.trim(),
    stock: Math.max(0, Math.round(Number(productStock.value))),
    image: productImage.value.trim(),
    description: productDescription.value.trim(),
  };

  if (
    !payload.name ||
    !payload.category ||
    !payload.badge ||
    !payload.description
  ) {
    return { error: "Completa todos los campos del producto." };
  }

  if (!allowEmptyImage && !payload.image) {
    return { error: "Completa todos los campos del producto." };
  }

  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    return { error: "El precio debe ser mayor a 0." };
  }

  if (!Number.isFinite(payload.rating) || payload.rating < 0 || payload.rating > 5) {
    return { error: "El rating debe estar entre 0 y 5." };
  }

  if (!Number.isFinite(payload.stock) || payload.stock < 0) {
    return { error: "El stock debe ser un numero valido." };
  }

  if (payload.image) {
    try {
      new URL(payload.image);
    } catch {
      return { error: "La URL de imagen no es valida." };
    }
  }

  return { payload };
}

function fillProductForm(product) {
  state.editingProductId = product.id;
  productId.value = product.id;
  productName.value = product.name;
  productCategory.value = product.category;
  productPrice.value = String(product.price);
  productRating.value = String(product.rating);
  productBadge.value = product.badge;
  productStock.value = String(product.stock);
  productImage.value = product.image;
  if (productImageFile) productImageFile.value = "";
  productDescription.value = product.description;

  updateProductImagePreview();
  updateSaveButtonLabel();
  cancelEditBtn.classList.remove("hidden");
}

function setUploadBusyState(isBusy) {
  state.isUploadingImage = isBusy;
  saveProductBtn.disabled = isBusy;
  productImage.disabled = isBusy;
  productImageFile.disabled = isBusy;
  updateSaveButtonLabel();
}

async function getCloudinaryUploadConfig() {
  const response = await fetch(CLOUDINARY_SIGNATURE_ENDPOINT, {
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.signature || !payload?.uploadUrl) {
    const errorText =
      payload?.error?.message ||
      "No se pudo preparar la subida de imagen. Verifica la configuracion de Cloudinary.";
    throw new Error(errorText);
  }

  return payload;
}

async function uploadImageWithCloudinary(file) {
  if (!(file instanceof File)) {
    throw new Error("Selecciona una imagen para subir.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen valida.");
  }

  const config = await getCloudinaryUploadConfig();
  const maxBytes = Number(config.maxUploadMb || 0) * 1024 * 1024;
  if (maxBytes > 0 && file.size > maxBytes) {
    throw new Error(`La imagen supera el limite permitido (${config.maxUploadMb}MB).`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", String(config.apiKey));
  formData.append("folder", String(config.folder));
  formData.append("overwrite", String(config.overwrite));
  formData.append("signature", String(config.signature));
  formData.append("timestamp", String(config.timestamp));
  formData.append("unique_filename", String(config.uniqueFilename));
  formData.append("use_filename", String(config.useFilename));

  const response = await fetch(config.uploadUrl, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload || !payload.secure_url) {
    const errorText =
      payload?.error?.message ||
      "No se pudo subir la imagen a Cloudinary.";
    throw new Error(errorText);
  }

  return String(payload.secure_url);
}

async function resolveProductImageForSave() {
  const file = productImageFile.files?.[0];
  const imageUrl = productImage.value.trim();

  if (!file) {
    if (!imageUrl) {
      return {
        error:
          "Agrega la URL de imagen o selecciona una imagen para subir.",
      };
    }

    return { imageUrl };
  }

  setMessage(uploadImageMsg, "Subiendo imagen...");
  setUploadBusyState(true);

  try {
    const uploadedUrl = await uploadImageWithCloudinary(file);
    productImage.value = uploadedUrl;
    productImageFile.value = "";
    updateProductImagePreview();
    setMessage(
      uploadImageMsg,
      "Imagen subida correctamente y vinculada al producto."
    );
    return { imageUrl: uploadedUrl };
  } catch (error) {
    const rawText =
      error instanceof Error ? error.message : "No se pudo subir la imagen.";
    const text =
      /fetch failed|failed to fetch|networkerror/i.test(rawText)
        ? "No hay conexion con el servidor o con Cloudinary. Inicia el servidor e intenta de nuevo."
        : rawText;
    return { error: text };
  } finally {
    setUploadBusyState(false);
  }
}

function renderMetrics() {
  const categories = new Set(state.products.map((product) => product.category));
  const lowStock = state.products.filter((product) => product.stock <= 5).length;
  const pendingOrders = state.orders.filter((order) => order.status === "pendiente").length;
  const revenue = state.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  metricProducts.textContent = String(state.products.length);
  metricCategories.textContent = String(categories.size);
  metricLowStock.textContent = String(lowStock);
  metricPendingOrders.textContent = String(pendingOrders);
  metricOrders.textContent = String(state.orders.length);
  metricRevenue.textContent = gs(revenue);
}

function renderProductCategoryFilter() {
  if (!productCategoryFilter) return;

  const categories = [...new Set(state.products.map((product) => product.category))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
  const current = state.productCategoryFilter;

  productCategoryFilter.innerHTML = '<option value="all">Todas</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = formatCategory(category);
    productCategoryFilter.appendChild(option);
  });

  const availableValues = new Set(["all", ...categories]);
  if (!availableValues.has(current)) {
    state.productCategoryFilter = "all";
  }

  productCategoryFilter.value = state.productCategoryFilter;
}

function syncProductFilterInputs() {
  if (productSearch) productSearch.value = state.productSearch;
  renderProductCategoryFilter();

  if (productStockFilter) {
    const allowed = new Set(["all", "low", "out"]);
    if (!allowed.has(state.productStockFilter)) {
      state.productStockFilter = "all";
    }
    productStockFilter.value = state.productStockFilter;
  }
}

function getFilteredProductsForTable() {
  const term = state.productSearch.trim().toLowerCase();
  const selectedCategory = state.productCategoryFilter;
  const stockFilter = state.productStockFilter;

  return [...state.products]
    .filter((product) => {
      if (term) {
        const matchesTerm =
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term);
        if (!matchesTerm) return false;
      }

      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      if (stockFilter === "low" && !(product.stock > 0 && product.stock <= 5)) {
        return false;
      }

      if (stockFilter === "out" && product.stock !== 0) {
        return false;
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function renderProductTable() {
  syncProductFilterInputs();
  const rows = getFilteredProductsForTable();

  if (productTableMeta) {
    const hasFiltersApplied =
      Boolean(state.productSearch.trim()) ||
      state.productCategoryFilter !== "all" ||
      state.productStockFilter !== "all";
    productTableMeta.textContent = hasFiltersApplied
      ? `Mostrando ${rows.length} de ${state.products.length} productos.`
      : `Total de productos: ${state.products.length}.`;
  }

  if (rows.length === 0) {
    productTable.innerHTML = "<p class='msg'>No hay productos para mostrar.</p>";
    return;
  }

  productTable.innerHTML = "";

  rows.forEach((product) => {
    const element = document.createElement("article");
    const stockClass =
      product.stock === 0 ? "is-out-of-stock" : product.stock <= 5 ? "is-low-stock" : "";
    element.className = `product-row ${stockClass}`.trim();

    element.innerHTML = `
      <h4>${product.name}</h4>
      <p>${formatCategory(product.category)} | ${gs(product.price)} | ${product.rating.toFixed(
      1
    )} / 5</p>
      <p>Stock: ${product.stock} ${product.stock <= 5 ? "(bajo)" : ""}</p>
      <div class="row-actions">
        <button type="button" data-action="edit" data-id="${product.id}">Editar</button>
        <button type="button" data-action="duplicate" data-id="${product.id}">Duplicar</button>
        <button type="button" data-action="stock-plus" data-id="${product.id}">+1 stock</button>
        <button type="button" data-action="stock-minus" data-id="${product.id}">-1 stock</button>
        <button type="button" data-action="delete" data-id="${product.id}">Eliminar</button>
      </div>
    `;

    productTable.appendChild(element);
  });
}

function buildAdminContactMessage(order) {
  const lines = order.items.map((item) => `- ${item.qty}x ${item.name} (${gs(item.subtotal)})`);
  const message = [
    `Hola ${order.customer.name}, te escribimos desde Celi Vibes por tu pedido ${order.id}.`,
    `Estado actual: ${order.status}.`,
    "",
    "Detalle:",
    ...lines,
    "",
    `Total: ${gs(order.total)}`,
  ];

  if (order.customer.notes) {
    message.push("", `Notas registradas: ${order.customer.notes}`);
  }

  return message.join("\n");
}

function contactCustomer(order) {
  if (!order.customer.phoneDigits) {
    alert("Este pedido no tiene telefono valido para contacto.");
    return;
  }

  const text = encodeURIComponent(buildAdminContactMessage(order));
  const url = `https://wa.me/${order.customer.phoneDigits}?text=${text}`;
  window.open(url, "_blank", "noopener");
}

function getOrdersDateRange() {
  const fromDate = state.orderDateFrom ? new Date(`${state.orderDateFrom}T00:00:00`) : null;
  const toDate = state.orderDateTo ? new Date(`${state.orderDateTo}T23:59:59.999`) : null;

  if (fromDate && !Number.isFinite(fromDate.getTime())) {
    return { error: "La fecha 'Desde' no es valida.", fromDate: null, toDate: null };
  }

  if (toDate && !Number.isFinite(toDate.getTime())) {
    return { error: "La fecha 'Hasta' no es valida.", fromDate: null, toDate: null };
  }

  if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
    return {
      error: "La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.",
      fromDate: null,
      toDate: null,
    };
  }

  return { error: "", fromDate, toDate };
}

function getOrderSearchIndex(order) {
  const customer = order.customer || {};
  const products = Array.isArray(order.items) ? order.items.map((item) => item.name).join(" ") : "";

  return [
    order.id,
    customer.name,
    customer.phone,
    customer.phoneDigits,
    customer.email,
    customer.address,
    customer.notes,
    products,
  ]
    .join(" ")
    .toLowerCase();
}

function getFilteredOrders() {
  const term = state.orderSearch.trim().toLowerCase();
  const statusFilter = ORDER_STATUS_SET.has(state.orderStatusFilter)
    ? state.orderStatusFilter
    : "all";
  const { error, fromDate, toDate } = getOrdersDateRange();

  if (error) {
    return { rows: [], error };
  }

  const rows = state.orders
    .filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      if (term && !getOrderSearchIndex(order).includes(term)) {
        return false;
      }

      const createdAtMs = new Date(order.createdAt).getTime();
      if (fromDate && createdAtMs < fromDate.getTime()) {
        return false;
      }

      if (toDate && createdAtMs > toDate.getTime()) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { rows, error: "" };
}

function getOrderHistoryRows(order) {
  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  return [...history].sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
}

function syncOrdersFilterInputs() {
  if (ordersSearch) ordersSearch.value = state.orderSearch;
  if (ordersStatusFilter) {
    ordersStatusFilter.value = ORDER_STATUS_SET.has(state.orderStatusFilter)
      ? state.orderStatusFilter
      : "all";
  }
  if (ordersDateFrom) ordersDateFrom.value = state.orderDateFrom;
  if (ordersDateTo) ordersDateTo.value = state.orderDateTo;
}

function resetOrdersFilters() {
  state.orderSearch = "";
  state.orderStatusFilter = "all";
  state.orderDateFrom = "";
  state.orderDateTo = "";
  syncOrdersFilterInputs();
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date, days) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function toDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function syncReportInputs() {
  if (reportRange) {
    const allowedRanges = new Set(["7", "30", "90", "365", "all"]);
    reportRange.value = allowedRanges.has(state.reportRange) ? state.reportRange : "30";
  }

  if (reportRevenueMode) {
    const allowedModes = new Set(["completed", "active", "all"]);
    reportRevenueMode.value = allowedModes.has(state.reportRevenueMode)
      ? state.reportRevenueMode
      : "completed";
  }
}

function getReportRangeStart() {
  if (state.reportRange === "all") {
    return null;
  }

  const days = Math.max(1, Number(state.reportRange) || 30);
  const now = startOfDay(new Date());
  return addDays(now, -(days - 1));
}

function getOrdersForReportRange() {
  const start = getReportRangeStart();
  const rows = start
    ? state.orders.filter((order) => new Date(order.createdAt).getTime() >= start.getTime())
    : [...state.orders];

  return rows.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function isOrderIncludedInRevenue(order) {
  if (state.reportRevenueMode === "completed") {
    return order.status === "completado";
  }

  if (state.reportRevenueMode === "active") {
    return order.status !== "cancelado";
  }

  return true;
}

function buildDailySalesSeries(orders, days) {
  const safeDays = Math.max(1, Number(days) || 30);
  const step = safeDays > 14 ? 2 : 1;
  const start = getReportRangeStart() || startOfDay(new Date());
  const buckets = [];

  for (let index = 0; index < safeDays; index += step) {
    const bucketStart = addDays(start, index);
    const bucketEnd = addDays(bucketStart, step);
    const total = orders.reduce((sum, order) => {
      const time = new Date(order.createdAt).getTime();
      return time >= bucketStart.getTime() && time < bucketEnd.getTime()
        ? sum + Number(order.total || 0)
        : sum;
    }, 0);

    const dayLabel = bucketStart.toLocaleDateString("es-PY", {
      day: "2-digit",
      month: "2-digit",
    });
    const endLabel = addDays(bucketEnd, -1).toLocaleDateString("es-PY", {
      day: "2-digit",
      month: "2-digit",
    });

    buckets.push({
      label: step === 1 ? dayLabel : `${dayLabel} - ${endLabel}`,
      value: total,
    });
  }

  return buckets;
}

function buildMonthlySalesSeries(orders) {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let months = 12;

  if (state.reportRange !== "all") {
    const days = Math.max(1, Number(state.reportRange) || 30);
    months = Math.min(12, Math.max(3, Math.ceil(days / 30)));
  } else if (orders.length > 0) {
    const oldest = orders.reduce((min, order) => {
      const time = new Date(order.createdAt).getTime();
      return time < min ? time : min;
    }, Date.now());
    const oldestDate = new Date(oldest);
    const diffMonths =
      (currentMonthStart.getFullYear() - oldestDate.getFullYear()) * 12 +
      (currentMonthStart.getMonth() - oldestDate.getMonth()) +
      1;
    months = Math.min(12, Math.max(3, diffMonths));
  }

  const buckets = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const start = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - i, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const total = orders.reduce((sum, order) => {
      const time = new Date(order.createdAt).getTime();
      return time >= start.getTime() && time < end.getTime() ? sum + Number(order.total || 0) : sum;
    }, 0);

    buckets.push({
      label: capitalize(
        start
          .toLocaleDateString("es-PY", { month: "short" })
          .replace(".", "")
          .trim()
      ),
      value: total,
    });
  }

  return buckets;
}

function buildSalesSeries(orders) {
  if (state.reportRange === "7" || state.reportRange === "30") {
    return buildDailySalesSeries(orders, Number(state.reportRange));
  }

  return buildMonthlySalesSeries(orders);
}

function getTopProductsForReport(orders, limit = 6) {
  const rows = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!rows.has(item.id)) {
        rows.set(item.id, {
          id: item.id,
          name: item.name,
          qty: 0,
          revenue: 0,
        });
      }

      const current = rows.get(item.id);
      current.qty += Number(item.qty || 0);
      current.revenue += Number(item.subtotal || item.price * item.qty || 0);
    });
  });

  return [...rows.values()]
    .sort((a, b) => {
      if (b.qty !== a.qty) return b.qty - a.qty;
      return b.revenue - a.revenue;
    })
    .slice(0, limit);
}

function getStatusDistribution(orders) {
  return ORDER_STATUS_VALUES.map((status) => {
    const count = orders.filter((order) => order.status === status).length;
    const meta = ORDER_STATUS_META[status] || { label: capitalize(status), color: "#999" };
    return {
      status,
      count,
      label: meta.label,
      color: meta.color,
    };
  });
}

function getReportRangeLabel() {
  if (state.reportRange === "all") return "Todo el historial";
  if (state.reportRange === "365") return "Ultimos 12 meses";
  return `Ultimos ${Number(state.reportRange) || 30} dias`;
}

function getReportModeLabel() {
  if (state.reportRevenueMode === "completed") return "Ingresos: solo completados";
  if (state.reportRevenueMode === "active") return "Ingresos: no cancelados";
  return "Ingresos: todos los pedidos";
}

function getReportsSnapshot() {
  const ordersInRange = getOrdersForReportRange();
  const revenueOrders = ordersInRange.filter(isOrderIncludedInRevenue);
  const revenueTotal = revenueOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const avgTicket = revenueOrders.length > 0 ? revenueTotal / revenueOrders.length : 0;
  const completedCount = ordersInRange.filter((order) => order.status === "completado").length;
  const completionRate =
    ordersInRange.length > 0 ? (completedCount / ordersInRange.length) * 100 : 0;

  return {
    ordersInRange,
    revenueOrders,
    revenueTotal,
    avgTicket,
    completionRate,
    salesSeries: buildSalesSeries(revenueOrders),
    topProducts: getTopProductsForReport(revenueOrders),
    statusDistribution: getStatusDistribution(ordersInRange),
  };
}

function renderSalesChart(series) {
  if (!reportSalesChart) return;

  if (!series.length) {
    reportSalesChart.innerHTML = "<p class='msg'>No hay datos para graficar.</p>";
    return;
  }

  const maxValue = Math.max(...series.map((row) => row.value), 0);

  reportSalesChart.innerHTML = series
    .map((row) => {
      const height = maxValue > 0 ? Math.max((row.value / maxValue) * 100, row.value > 0 ? 8 : 2) : 2;
      return `
        <article class="chart-col" title="${escapeHtml(row.label)} | ${escapeHtml(gs(Math.round(row.value)))}">
          <div class="chart-col-track">
            <span class="chart-col-fill" style="height: ${height.toFixed(2)}%"></span>
          </div>
          <small>${escapeHtml(row.label)}</small>
          <strong>${escapeHtml(gs(Math.round(row.value)))}</strong>
        </article>
      `;
    })
    .join("");
}

function renderTopProductsChart(rows) {
  if (!reportTopProductsChart) return;

  if (!rows.length) {
    reportTopProductsChart.innerHTML = "<p class='msg'>Sin productos vendidos en este rango.</p>";
    return;
  }

  const maxQty = Math.max(...rows.map((row) => row.qty), 1);

  reportTopProductsChart.innerHTML = rows
    .map((row) => {
      const width = Math.max((row.qty / maxQty) * 100, 8);
      return `
        <article class="hbar-row">
          <div class="hbar-head">
            <strong>${escapeHtml(row.name)}</strong>
            <span>${escapeHtml(`${row.qty} u.`)}</span>
          </div>
          <div class="hbar-track">
            <span style="width: ${width.toFixed(2)}%"></span>
          </div>
          <p>${escapeHtml(gs(Math.round(row.revenue)))}</p>
        </article>
      `;
    })
    .join("");
}

function renderStatusChart(rows) {
  if (!reportStatusDonut || !reportStatusLegend) return;

  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const nonZero = rows.filter((row) => row.count > 0);

  if (total === 0 || nonZero.length === 0) {
    reportStatusDonut.style.background = "conic-gradient(#ecd8cc 0 100%)";
    reportStatusDonut.innerHTML = `
      <div class="status-donut-center">
        <strong>0</strong>
        <span>Pedidos</span>
      </div>
    `;
    reportStatusLegend.innerHTML = "<li class='msg'>Sin pedidos en este rango.</li>";
    return;
  }

  let accumulated = 0;
  const segments = nonZero.map((row) => {
    const start = accumulated;
    const percentage = (row.count / total) * 100;
    accumulated += percentage;
    return `${row.color} ${start.toFixed(2)}% ${accumulated.toFixed(2)}%`;
  });

  reportStatusDonut.style.background = `conic-gradient(${segments.join(", ")})`;
  reportStatusDonut.innerHTML = `
    <div class="status-donut-center">
      <strong>${total}</strong>
      <span>Pedidos</span>
    </div>
  `;

  reportStatusLegend.innerHTML = rows
    .map((row) => {
      const percentage = total > 0 ? (row.count / total) * 100 : 0;
      return `
        <li>
          <span class="dot" style="background: ${row.color}"></span>
          <p>${escapeHtml(row.label)}</p>
          <strong>${escapeHtml(`${row.count} (${percentage.toFixed(1)}%)`)}</strong>
        </li>
      `;
    })
    .join("");
}

function renderReports() {
  if (
    !reportOrdersCount ||
    !reportRevenueTotal ||
    !reportAvgTicket ||
    !reportCompletionRate ||
    !reportTrendHint
  ) {
    return;
  }

  const snapshot = getReportsSnapshot();

  reportOrdersCount.textContent = String(snapshot.ordersInRange.length);
  reportRevenueTotal.textContent = gs(Math.round(snapshot.revenueTotal));
  reportAvgTicket.textContent = gs(Math.round(snapshot.avgTicket));
  reportCompletionRate.textContent = `${snapshot.completionRate.toFixed(1)}%`;
  reportTrendHint.textContent = `${getReportRangeLabel()} | ${getReportModeLabel()}`;

  renderSalesChart(snapshot.salesSeries);
  renderTopProductsChart(snapshot.topProducts);
  renderStatusChart(snapshot.statusDistribution);

  setMessage(
    reportsMsg,
    snapshot.ordersInRange.length
      ? `Reporte actualizado (${snapshot.ordersInRange.length} pedidos analizados).`
      : "No hay pedidos para el rango seleccionado."
  );
}

function exportReportsCsvFile() {
  if (!requireSession()) return;

  const snapshot = getReportsSnapshot();
  if (!snapshot.ordersInRange.length) {
    setMessage(reportsMsg, "No hay datos para exportar en este rango.", true);
    return;
  }

  const lines = [["tipo", "concepto", "valor"]];

  lines.push(["resumen", "periodo", getReportRangeLabel()]);
  lines.push(["resumen", "modo_ingresos", getReportModeLabel()]);
  lines.push(["resumen", "pedidos_en_rango", String(snapshot.ordersInRange.length)]);
  lines.push(["resumen", "ingresos_total_gs", String(Math.round(snapshot.revenueTotal))]);
  lines.push(["resumen", "ticket_promedio_gs", String(Math.round(snapshot.avgTicket))]);
  lines.push(["resumen", "tasa_completados_pct", snapshot.completionRate.toFixed(1)]);

  snapshot.salesSeries.forEach((row) => {
    lines.push(["tendencia", row.label, String(Math.round(row.value))]);
  });

  snapshot.topProducts.forEach((row) => {
    lines.push(["producto", `${row.name} (cantidad)`, String(row.qty)]);
    lines.push(["producto", `${row.name} (ingresos_gs)`, String(Math.round(row.revenue))]);
  });

  snapshot.statusDistribution.forEach((row) => {
    lines.push(["estado", row.label, String(row.count)]);
  });

  const csv = `\uFEFF${lines.map((row) => row.map(toCsvCell).join(",")).join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = toDateKey(new Date());
  anchor.href = url;
  anchor.download = `celi-vibes-reporte-ventas-${date}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  setMessage(reportsMsg, "Reporte CSV exportado.");
}

function renderOrdersStatusSummary() {
  if (!ordersStatusSummary) return;

  const total = state.orders.length;
  const rows = ORDER_STATUS_VALUES.map((status) => {
    const count = state.orders.filter((order) => order.status === status).length;
    const meta = ORDER_STATUS_META[status] || { label: capitalize(status), color: "#999" };
    return {
      status,
      label: meta.label,
      color: meta.color,
      count,
    };
  });

  const chips = [
    {
      status: "all",
      label: "Todos",
      color: "#8f7a72",
      count: total,
    },
    ...rows,
  ];

  ordersStatusSummary.innerHTML = chips
    .map(
      (row) => `
        <button
          type="button"
          class="status-pill ${state.orderStatusFilter === row.status ? "active" : ""}"
          data-status="${escapeHtml(row.status)}"
          style="--status-color:${escapeHtml(row.color)}"
        >
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(String(row.count))}</strong>
        </button>
      `
    )
    .join("");
}

function renderOrders() {
  renderOrdersStatusSummary();
  const { rows, error } = getFilteredOrders();

  if (error) {
    setMessage(ordersMsg, error, true);
    ordersList.innerHTML = "<p class='msg'>Corrige el rango de fechas para continuar.</p>";
    return;
  }

  if (!state.orders.length) {
    setMessage(ordersMsg, "No hay pedidos registrados.");
    ordersList.innerHTML = "<p class='msg'>No hay pedidos registrados.</p>";
    return;
  }

  if (rows.length === 0) {
    setMessage(ordersMsg, "No hay pedidos que coincidan con los filtros.");
    ordersList.innerHTML = "<p class='msg'>No hay pedidos que coincidan con los filtros aplicados.</p>";
    return;
  }

  const hasFiltersApplied =
    Boolean(state.orderSearch.trim()) ||
    state.orderStatusFilter !== "all" ||
    Boolean(state.orderDateFrom) ||
    Boolean(state.orderDateTo);

  setMessage(
    ordersMsg,
    hasFiltersApplied
      ? `Mostrando ${rows.length} de ${state.orders.length} pedidos.`
      : `Total de pedidos: ${state.orders.length}.`
  );

  ordersList.innerHTML = "";

  rows.forEach((order) => {
    const orderEl = document.createElement("article");
    orderEl.className = "order-row";

    const createdAt = formatDateTime(order.createdAt);

    const itemsHtml = order.items
      .map(
        (item) => `
          <li>
            <span>${escapeHtml(`${item.qty}x ${item.name}`)}</span>
            <strong>${gs(Number(item.subtotal || 0))}</strong>
          </li>
        `
      )
      .join("");

    const hasContact = Boolean(order.customer.phoneDigits);
    const historyRows = getOrderHistoryRows(order);
    const historyHtml = historyRows
      .map(
        (entry) => `
          <li>
            <div>
              <strong>${escapeHtml(formatOrderStatus(entry.status))}</strong>
              <small>${escapeHtml(formatDateTime(entry.changedAt))}</small>
            </div>
            <p>
              ${escapeHtml(capitalize(entry.changedBy || "sistema"))}
              ${entry.note ? ` | ${escapeHtml(entry.note)}` : ""}
            </p>
          </li>
        `
      )
      .join("");

    orderEl.innerHTML = `
      <div class="order-head">
        <strong>${escapeHtml(order.id)}</strong>
        <p>${createdAt} | Total: ${gs(Number(order.total || 0))}</p>
      </div>
      <div class="order-customer">
        <p><strong>Cliente:</strong> ${escapeHtml(order.customer.name)}</p>
        <p>
          <strong>Telefono:</strong> ${escapeHtml(order.customer.phone || "Sin datos")}
          ${order.customer.email ? ` | <strong>Email:</strong> ${escapeHtml(order.customer.email)}` : ""}
        </p>
        ${
          order.customer.address
            ? `<p><strong>Direccion:</strong> ${escapeHtml(order.customer.address)}</p>`
            : ""
        }
        ${
          order.customer.notes
            ? `<p><strong>Notas:</strong> ${escapeHtml(order.customer.notes)}</p>`
            : ""
        }
      </div>
      <ul class="order-items">${itemsHtml}</ul>
      <div class="order-history">
        <h5>Historial de estado</h5>
        <ul>${historyHtml}</ul>
      </div>
      <div class="order-actions">
        <select data-action="status" data-id="${order.id}">
          <option value="pendiente" ${order.status === "pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="confirmado" ${order.status === "confirmado" ? "selected" : ""}>Confirmado</option>
          <option value="enviado" ${order.status === "enviado" ? "selected" : ""}>Enviado</option>
          <option value="completado" ${order.status === "completado" ? "selected" : ""}>Completado</option>
          <option value="cancelado" ${order.status === "cancelado" ? "selected" : ""}>Cancelado</option>
        </select>
        ${
          hasContact
            ? `<button type="button" class="ghost" data-action="contact-order" data-id="${order.id}">Contactar cliente</button>`
            : ""
        }
        <button type="button" data-action="delete-order" data-id="${order.id}">Eliminar</button>
      </div>
    `;

    ordersList.appendChild(orderEl);
  });
}

function fillContentForm() {
  contentShippingMsg.value = state.content.shippingMsg;
  contentSupportMsg.value = state.content.supportMsg;
  contentHeroKicker.value = state.content.heroKicker;
  contentHeroTitle.value = state.content.heroTitle;
  contentHeroDescription.value = state.content.heroDescription;
  contentHeroImage.value = state.content.heroImage;
  contentHeroButton.value = state.content.heroPrimaryBtnText;
  contentPromoTag.value = state.content.promoTag;
  contentPromoTitle.value = state.content.promoTitle;
  contentPromoButton.value = state.content.promoButtonText;
  contentNewsletterTitle.value = state.content.newsletterTitle;
  contentNewsletterDescription.value = state.content.newsletterDescription;
}

function fillSecurityForm() {
  currentUser.value = state.credentials.username;
  currentPassword.value = "";
  newUser.value = state.credentials.username;
  newPassword.value = "";
}

function updatePanelNavActive() {
  if (!panelNav || !panelSections.length) return;

  let activeId = panelSections[0]?.id || "";
  panelSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 180) {
      activeId = section.id;
    }
  });

  const buttons = panelNav.querySelectorAll(".panel-nav-btn");
  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    button.classList.toggle("active", button.dataset.target === activeId);
  });
}

function scrollToPanelSection(sectionId) {
  if (!sectionId) return;
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupPanelNav() {
  if (!panelNav) return;

  panelNav.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const button = target.closest(".panel-nav-btn");
    if (!(button instanceof HTMLButtonElement)) return;

    const sectionId = button.dataset.target;
    if (!sectionId) return;

    scrollToPanelSection(sectionId);
  });

  window.addEventListener("scroll", updatePanelNavActive, { passive: true });
  updatePanelNavActive();
}

function refreshAll() {
  renderMetrics();
  renderProductTable();
  syncOrdersFilterInputs();
  syncReportInputs();
  renderOrders();
  renderReports();
  fillContentForm();
  fillSecurityForm();
  sessionLabel.textContent = `Sesion activa: ${state.credentials.username}`;
  updatePanelNavActive();
}

function showPanel() {
  loginView.classList.add("hidden");
  panelView.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  refreshAll();
}

function showLogin() {
  panelView.classList.add("hidden");
  loginView.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
}

function requireSession() {
  if (isSessionActive()) return true;
  showLogin();
  setMessage(loginMsg, "Inicia sesion para continuar.", true);
  return false;
}

async function handleProductAction(action, id) {
  if (!requireSession()) return;

  const index = state.products.findIndex((product) => product.id === id);
  if (index === -1) {
    setMessage(productMsg, "No se encontro el producto.", true);
    return;
  }

  const product = state.products[index];

  if (action === "edit") {
    fillProductForm(product);
    setMessage(productMsg, "Editando producto.");
    return;
  }

  if (action === "duplicate") {
    state.products.unshift({
      ...product,
      id: createProductId(),
      name: `${product.name} (copia)`,
    });
    await handleStorePersistence(productMsg, "Producto duplicado.");
    return;
  }

  if (action === "stock-plus") {
    product.stock += 1;
    await handleStorePersistence(productMsg, "Stock incrementado.");
    return;
  }

  if (action === "stock-minus") {
    product.stock = Math.max(0, product.stock - 1);
    await handleStorePersistence(productMsg, "Stock actualizado.");
    return;
  }

  if (action === "delete") {
    const confirmed = confirm(`Eliminar \"${product.name}\"?`);
    if (!confirmed) return;

    state.products = state.products.filter((entry) => entry.id !== id);
    if (state.editingProductId === id) {
      resetProductForm();
    }

    await handleStorePersistence(productMsg, "Producto eliminado.");
  }
}

function toCsvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function buildOrderItemsCsv(order) {
  return order.items
    .map((item) => `${item.qty}x ${item.name} (${gs(Number(item.subtotal || 0))})`)
    .join(" | ");
}

function buildOrderHistoryCsv(order) {
  return getOrderHistoryRows(order)
    .map(
      (entry) =>
        `${formatDateTime(entry.changedAt)}: ${formatOrderStatus(entry.status)} (${entry.changedBy})${
          entry.note ? ` - ${entry.note}` : ""
        }`
    )
    .join(" | ");
}

function exportOrdersCsvFile() {
  if (!requireSession()) return;

  const { rows, error } = getFilteredOrders();

  if (error) {
    setMessage(ordersMsg, error, true);
    return;
  }

  if (!rows.length) {
    setMessage(ordersMsg, "No hay pedidos para exportar con los filtros actuales.", true);
    return;
  }

  const headers = [
    "id_pedido",
    "fecha_creacion",
    "estado_actual",
    "cliente_nombre",
    "cliente_telefono",
    "cliente_email",
    "cliente_direccion",
    "cliente_notas",
    "total_gs",
    "detalle_productos",
    "historial_estados",
  ];

  const lines = [headers.map(toCsvCell).join(",")];

  rows.forEach((order) => {
    lines.push(
      [
        order.id,
        formatDateTime(order.createdAt),
        formatOrderStatus(order.status),
        order.customer.name,
        order.customer.phone || "",
        order.customer.email || "",
        order.customer.address || "",
        order.customer.notes || "",
        Number(order.total || 0),
        buildOrderItemsCsv(order),
        buildOrderHistoryCsv(order),
      ]
        .map(toCsvCell)
        .join(",")
    );
  });

  const csv = `\uFEFF${lines.join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `celi-vibes-pedidos-${date}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  setMessage(ordersMsg, `CSV generado con ${rows.length} pedido(s).`);
}

async function exportData() {
  if (!requireSession()) return;

  try {
    const payload = await apiFetchJson(ADMIN_EXPORT_ENDPOINT);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `celi-vibes-backup-${date}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setMessage(dataMsg, "Respaldo exportado.");
  } catch (error) {
    const text = error instanceof Error ? error.message : "No se pudo exportar el respaldo.";
    setMessage(dataMsg, text, true);
  }
}

async function importData(file) {
  if (!requireSession()) return;
  if (!file) return;

  try {
    const parsed = parseJson(await file.text());

    if (!parsed || typeof parsed !== "object") {
      setMessage(dataMsg, "Archivo invalido.", true);
      return;
    }

    const imported = await apiFetchJson(ADMIN_IMPORT_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(parsed),
    });

    applyAdminSnapshot({
      ...imported,
      username: state.credentials.username,
    });
    cleanCartAgainstProducts();
    resetProductForm();
    refreshAll();
    setMessage(dataMsg, "Datos importados correctamente.");
  } catch (error) {
    const text = error instanceof Error ? error.message : "No se pudo importar el respaldo.";
    setMessage(dataMsg, text, true);
  }
}

async function resetStore() {
  if (!requireSession()) return;

  const confirmed = confirm(
    "Se restableceran productos, contenido y pedidos. Esta accion no se puede deshacer."
  );
  if (!confirmed) return;

  try {
    const reset = await apiFetchJson(ADMIN_RESET_ENDPOINT, {
      method: "POST",
    });

    applyAdminSnapshot({
      ...reset,
      username: state.credentials.username,
    });
    state.editingProductId = "";
    state.productSearch = "";
    state.productCategoryFilter = "all";
    state.productStockFilter = "all";
    state.orderSearch = "";
    state.orderStatusFilter = "all";
    state.orderDateFrom = "";
    state.orderDateTo = "";
    state.reportRange = "30";
    state.reportRevenueMode = "completed";

    cleanCartAgainstProducts();
    productSearch.value = "";
    resetOrdersFilters();
    resetProductForm();
    refreshAll();
    setMessage(dataMsg, "Tienda restablecida a valores iniciales.");
  } catch (error) {
    const text = error instanceof Error ? error.message : "No se pudo restablecer la tienda.";
    setMessage(dataMsg, text, true);
  }
}

function attachEvents() {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const snapshot = await apiFetchJson(ADMIN_LOGIN_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          username: loginUser.value.trim(),
          password: loginPassword.value,
        }),
      });

      applyAdminSnapshot(snapshot);
      setSession(true);
      loginForm.reset();
      setMessage(loginMsg, "");
      showPanel();
    } catch (error) {
      const text = error instanceof Error ? error.message : "No se pudo iniciar sesion.";
      setMessage(loginMsg, text, true);
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await apiFetchJson(ADMIN_LOGOUT_ENDPOINT, {
        method: "POST",
      });
    } catch {}

    setSession(false);
    showLogin();
  });

  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireSession()) return;
    if (state.isUploadingImage) return;

    const { payload, error } = readProductForm({ allowEmptyImage: true });
    if (error) {
      setMessage(productMsg, error, true);
      return;
    }

    const { imageUrl, error: imageError } = await resolveProductImageForSave();
    if (imageError) {
      setMessage(uploadImageMsg, imageError, true);
      return;
    }

    payload.image = imageUrl;
    const successMessage = state.editingProductId ? "Producto actualizado." : "Producto creado.";

    if (state.editingProductId) {
      const index = state.products.findIndex(
        (product) => product.id === state.editingProductId
      );

      if (index === -1) {
        setMessage(productMsg, "No se encontro el producto a editar.", true);
        resetProductForm();
        return;
      }

      state.products[index] = {
        ...state.products[index],
        ...payload,
      };
    } else {
      state.products.unshift({ id: createProductId(), ...payload });
    }

    resetProductForm();
    await handleStorePersistence(productMsg, successMessage);
  });

  cancelEditBtn.addEventListener("click", () => {
    if (!requireSession()) return;
    resetProductForm();
    setMessage(productMsg, "Edicion cancelada.");
  });

  productImage.addEventListener("input", updateProductImagePreview);
  productImageFile.addEventListener("change", updateProductImagePreview);
  window.addEventListener("beforeunload", clearProductPreviewObjectUrl);

  productSearch.addEventListener("input", (event) => {
    state.productSearch = event.target.value;
    renderProductTable();
  });

  if (productCategoryFilter) {
    productCategoryFilter.addEventListener("change", (event) => {
      state.productCategoryFilter = event.target.value;
      renderProductTable();
    });
  }

  if (productStockFilter) {
    productStockFilter.addEventListener("change", (event) => {
      state.productStockFilter = event.target.value;
      renderProductTable();
    });
  }

  productTable.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    await handleProductAction(action, id);
  });

  bulkPriceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireSession()) return;

    const percent = Number(bulkPricePercent.value);

    if (!Number.isFinite(percent) || percent <= -95 || percent > 500) {
      setMessage(productMsg, "Ingresa un porcentaje valido (mayor a -95 y menor o igual a 500).", true);
      return;
    }

    const factor = 1 + percent / 100;

    state.products = state.products.map((product) => {
      const nextPrice = Math.max(1000, Math.round((product.price * factor) / 1000) * 1000);
      return {
        ...product,
        price: nextPrice,
      };
    });

    const persisted = await handleStorePersistence(productMsg, "Precios actualizados en bloque.");
    if (persisted) {
      bulkPriceForm.reset();
    }
  });

  contentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireSession()) return;

    const nextContent = normalizeContent({
      shippingMsg: contentShippingMsg.value,
      supportMsg: contentSupportMsg.value,
      heroKicker: contentHeroKicker.value,
      heroTitle: contentHeroTitle.value,
      heroDescription: contentHeroDescription.value,
      heroImage: contentHeroImage.value,
      heroPrimaryBtnText: contentHeroButton.value,
      promoTag: contentPromoTag.value,
      promoTitle: contentPromoTitle.value,
      promoButtonText: contentPromoButton.value,
      newsletterTitle: contentNewsletterTitle.value,
      newsletterDescription: contentNewsletterDescription.value,
    });

    state.content = nextContent;
    await handleStorePersistence(contentMsg, "Contenido actualizado.");
  });

  if (reportRange) {
    reportRange.addEventListener("change", (event) => {
      state.reportRange = event.target.value;
      renderReports();
    });
  }

  if (reportRevenueMode) {
    reportRevenueMode.addEventListener("change", (event) => {
      state.reportRevenueMode = event.target.value;
      renderReports();
    });
  }

  if (exportReportsBtn) {
    exportReportsBtn.addEventListener("click", exportReportsCsvFile);
  }

  if (ordersSearch) {
    ordersSearch.addEventListener("input", (event) => {
      state.orderSearch = event.target.value;
      renderOrders();
    });
  }

  if (ordersStatusFilter) {
    ordersStatusFilter.addEventListener("change", (event) => {
      state.orderStatusFilter = event.target.value;
      renderOrders();
    });
  }

  if (ordersDateFrom) {
    ordersDateFrom.addEventListener("change", (event) => {
      state.orderDateFrom = event.target.value;
      renderOrders();
    });
  }

  if (ordersDateTo) {
    ordersDateTo.addEventListener("change", (event) => {
      state.orderDateTo = event.target.value;
      renderOrders();
    });
  }

  if (ordersResetFilters) {
    ordersResetFilters.addEventListener("click", () => {
      if (!requireSession()) return;
      resetOrdersFilters();
      renderOrders();
    });
  }

  if (ordersExportCsv) {
    ordersExportCsv.addEventListener("click", exportOrdersCsvFile);
  }

  if (ordersStatusSummary) {
    ordersStatusSummary.addEventListener("click", (event) => {
      if (!requireSession()) return;

      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const button = target.closest(".status-pill");
      if (!(button instanceof HTMLButtonElement)) return;

      const nextStatus = button.dataset.status || "all";
      state.orderStatusFilter = ORDER_STATUS_SET.has(nextStatus) ? nextStatus : "all";
      syncOrdersFilterInputs();
      renderOrders();
    });
  }

  ordersList.addEventListener("change", async (event) => {
    if (!requireSession()) return;

    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;

    if (target.dataset.action !== "status") return;

    const id = target.dataset.id;
    if (!id) return;

    const order = state.orders.find((entry) => entry.id === id);
    if (!order) return;

    const nextStatus = ORDER_STATUS_SET.has(target.value) ? target.value : order.status;
    if (nextStatus === order.status) return;

    order.status = nextStatus;
    appendOrderStatusHistory(order, nextStatus, "admin", "Estado actualizado desde panel");
    await handleStorePersistence(ordersMsg, "Estado del pedido actualizado.");
  });

  ordersList.addEventListener("click", async (event) => {
    if (!requireSession()) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    if (!action) return;

    const id = target.dataset.id;
    if (!id) return;

    const order = state.orders.find((entry) => entry.id === id);
    if (!order) return;

    if (action === "contact-order") {
      contactCustomer(order);
      return;
    }

    if (action !== "delete-order") return;

    const confirmed = confirm("Eliminar este pedido?");
    if (!confirmed) return;

    state.orders = state.orders.filter((order) => order.id !== id);
    await handleStorePersistence(ordersMsg, "Pedido eliminado.");
  });

  clearCompletedOrders.addEventListener("click", async () => {
    if (!requireSession()) return;

    const previous = state.orders.length;
    state.orders = state.orders.filter((order) => order.status !== "completado");

    if (state.orders.length === previous) {
      setMessage(ordersMsg, "No hay pedidos completados para limpiar.");
      return;
    }

    await handleStorePersistence(ordersMsg, "Pedidos completados eliminados.");
  });

  securityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireSession()) return;

    const oldUser = currentUser.value.trim();
    const oldPass = currentPassword.value;
    const nextUser = newUser.value.trim();
    const nextPass = newPassword.value;

    if (nextUser.length < 3) {
      setMessage(securityMsg, "El nuevo usuario debe tener al menos 3 caracteres.", true);
      return;
    }

    if (nextPass.length < 6) {
      setMessage(securityMsg, "La nueva clave debe tener al menos 6 caracteres.", true);
      return;
    }

    try {
      const updated = await apiFetchJson(ADMIN_CREDENTIALS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          currentUsername: oldUser,
          currentPassword: oldPass,
          newUsername: nextUser,
          newPassword: nextPass,
        }),
      });

      state.credentials.username = String(updated?.username || nextUser).trim() || nextUser;
      loginUser.value = state.credentials.username;
      fillSecurityForm();
      sessionLabel.textContent = `Sesion activa: ${state.credentials.username}`;
      setMessage(securityMsg, "Credenciales actualizadas.");
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "No se pudieron actualizar las credenciales.";
      setMessage(securityMsg, text, true);
    }
  });

  exportDataBtn.addEventListener("click", () => {
    void exportData();
  });

  importDataInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    void importData(file);
    importDataInput.value = "";
  });

  resetStoreBtn.addEventListener("click", () => {
    void resetStore();
  });

  window.addEventListener("focus", () => {
    if (!isSessionActive()) return;

    void syncAdminStateFromServer()
      .then(() => {
        if (state.editingProductId && !state.products.some((product) => product.id === state.editingProductId)) {
          resetProductForm();
        }
        refreshAll();
      })
      .catch(() => {});
  });
}

async function init() {
  setUploadBusyState(false);
  updateProductImagePreview();
  syncProductFilterInputs();
  syncOrdersFilterInputs();
  syncReportInputs();
  loginUser.value = state.credentials.username;
  attachEvents();
  setupPanelNav();

  try {
    const session = await apiFetchJson(ADMIN_SESSION_ENDPOINT);
    if (session?.authenticated) {
      const snapshot = await fetchAdminSnapshot();
      applyAdminSnapshot(snapshot);
      setSession(true);
      showPanel();
      return;
    }

    if (typeof session?.username === "string" && session.username.trim()) {
      state.credentials.username = session.username.trim();
      loginUser.value = state.credentials.username;
    }

    setSession(false);
    showLogin();
  } catch (error) {
    setSession(false);
    showLogin();
    const text =
      error instanceof Error ? error.message : "No se pudo conectar con el servidor.";
    setMessage(loginMsg, text, true);
  }
}

void init();
