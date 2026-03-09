"use strict";

const crypto = require("crypto");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const {
  createDefaultOrderStatusHistory,
  createDefaultStoreSnapshot,
  createOrderId,
  normalizeStoreSnapshot,
  normalizeRequestedCartItems,
  validateCheckoutCustomer,
} = require("./store-data");

function clone(value) {
  return structuredClone(value);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const actualHash = crypto.scryptSync(String(password), String(salt), 64);
  const expected = Buffer.from(String(expectedHash), "hex");

  if (actualHash.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualHash, expected);
}

function normalizeUsername(value, fallback = "admin") {
  const normalized = String(value ?? "").trim();
  return normalized.length >= 3 ? normalized : fallback;
}

function normalizeAdminState(admin, options = {}) {
  const source = admin && typeof admin === "object" ? admin : {};
  const username = normalizeUsername(source.username, options.defaultUsername);
  const passwordHash = String(source.passwordHash ?? "").trim();
  const passwordSalt = String(source.passwordSalt ?? "").trim();
  const sessionVersion = Math.max(1, Math.round(Number(source.sessionVersion) || 1));
  const sessionSecret =
    String(source.sessionSecret ?? "").trim() || crypto.randomBytes(32).toString("hex");

  if (passwordHash && passwordSalt) {
    return {
      username,
      passwordHash,
      passwordSalt,
      sessionSecret,
      sessionVersion,
      passwordUpdatedAt: String(source.passwordUpdatedAt ?? "").trim() || new Date().toISOString(),
    };
  }

  const seeded = hashPassword(options.defaultPassword || "celi2026");
  return {
    username,
    passwordHash: seeded.hash,
    passwordSalt: seeded.salt,
    sessionSecret,
    sessionVersion,
    passwordUpdatedAt: new Date().toISOString(),
  };
}

class StoreRepository {
  constructor({ rootDir, dataDir, dataFileName = "store.json", defaultUsername, defaultPassword }) {
    this.dataDir = dataDir ? path.resolve(dataDir) : path.join(rootDir, "data");
    this.dataFilePath = path.join(this.dataDir, dataFileName);
    this.defaultUsername = normalizeUsername(defaultUsername || "admin", "admin");
    this.defaultPassword = String(defaultPassword || "celi2026");
    this.state = null;
    this.writeChain = Promise.resolve();
  }

  async init() {
    await fsp.mkdir(this.dataDir, { recursive: true });

    if (!fs.existsSync(this.dataFilePath)) {
      const seededState = this.createInitialState();
      this.state = seededState;
      await this.writeStateFile(seededState);
      return;
    }

    const raw = await fsp.readFile(this.dataFilePath, "utf8");
    const parsed = JSON.parse(raw);
    const normalizedState = this.normalizeFullState(parsed);
    this.state = normalizedState;
    await this.writeStateFile(normalizedState);
  }

  createInitialState() {
    return {
      ...createDefaultStoreSnapshot(),
      admin: normalizeAdminState(null, {
        defaultUsername: this.defaultUsername,
        defaultPassword: this.defaultPassword,
      }),
    };
  }

  normalizeFullState(rawState) {
    const normalizedStore = normalizeStoreSnapshot(rawState);
    const admin = normalizeAdminState(rawState?.admin, {
      defaultUsername: this.defaultUsername,
      defaultPassword: this.defaultPassword,
    });

    return {
      ...normalizedStore,
      admin,
    };
  }

  async writeStateFile(state) {
    const serialized = JSON.stringify(state, null, 2);
    const tempFilePath = `${this.dataFilePath}.tmp`;
    await fsp.writeFile(tempFilePath, serialized, "utf8");
    await fsp.rename(tempFilePath, this.dataFilePath);
  }

  async update(mutator) {
    const operation = this.writeChain.then(async () => {
      if (!this.state) {
        await this.init();
      }

      const current = clone(this.state);
      const next = await mutator(current);
      const normalized = this.normalizeFullState(next);
      this.state = normalized;
      await this.writeStateFile(normalized);
      return clone(normalized);
    });

    this.writeChain = operation.catch(() => {});
    return operation;
  }

  async getState() {
    if (!this.state) {
      await this.init();
    }

    return clone(this.state);
  }

  async getPublicStore() {
    const state = await this.getState();
    return {
      products: state.products,
      content: state.content,
    };
  }

  async getAdminSnapshot() {
    const state = await this.getState();
    return {
      username: state.admin.username,
      products: state.products,
      content: state.content,
      orders: state.orders,
    };
  }

  async getAdminIdentity() {
    const state = await this.getState();
    return {
      username: state.admin.username,
      sessionSecret: state.admin.sessionSecret,
      sessionVersion: state.admin.sessionVersion,
    };
  }

  async verifyAdminCredentials(username, password) {
    const state = await this.getState();
    const normalizedUsername = String(username ?? "").trim();

    if (normalizedUsername !== state.admin.username) {
      return false;
    }

    if (!String(password ?? "")) {
      return false;
    }

    return verifyPassword(password, state.admin.passwordSalt, state.admin.passwordHash);
  }

  async saveStoreSnapshot(snapshot) {
    const nextState = await this.update((current) => ({
      ...current,
      ...normalizeStoreSnapshot(snapshot),
      admin: current.admin,
    }));

    return {
      products: nextState.products,
      content: nextState.content,
      orders: nextState.orders,
    };
  }

  async importStoreSnapshot(snapshot) {
    return this.saveStoreSnapshot(snapshot);
  }

  async resetStore() {
    const nextState = await this.update((current) => ({
      ...current,
      ...createDefaultStoreSnapshot(),
      admin: current.admin,
    }));

    return {
      products: nextState.products,
      content: nextState.content,
      orders: nextState.orders,
    };
  }

  async exportStoreSnapshot() {
    const state = await this.getState();
    return {
      exportedAt: new Date().toISOString(),
      products: state.products,
      content: state.content,
      orders: state.orders,
    };
  }

  async updateCredentials({ currentUsername, currentPassword, newUsername, newPassword }) {
    const nextUsername = normalizeUsername(newUsername, "");
    const nextPasswordValue = String(newPassword ?? "");

    if (nextUsername.length < 3) {
      throw createRepositoryError(400, "El nuevo usuario debe tener al menos 3 caracteres.");
    }

    if (nextPasswordValue.length < 6) {
      throw createRepositoryError(400, "La nueva clave debe tener al menos 6 caracteres.");
    }

    const verified = await this.verifyAdminCredentials(currentUsername, currentPassword);
    if (!verified) {
      throw createRepositoryError(401, "Usuario o clave actual incorrectos.");
    }

    const nextState = await this.update((current) => {
      const password = hashPassword(nextPasswordValue);
      return {
        ...current,
        admin: {
          ...current.admin,
          username: nextUsername,
          passwordHash: password.hash,
          passwordSalt: password.salt,
          sessionVersion: current.admin.sessionVersion + 1,
          passwordUpdatedAt: new Date().toISOString(),
        },
      };
    });

    return {
      username: nextState.admin.username,
      sessionSecret: nextState.admin.sessionSecret,
      sessionVersion: nextState.admin.sessionVersion,
    };
  }

  async placeOrder({ customer, items }) {
    const { customer: normalizedCustomer, error } = validateCheckoutCustomer(customer);
    if (error) {
      throw createRepositoryError(400, error);
    }

    const requestedItems = normalizeRequestedCartItems(items);
    if (!requestedItems.length) {
      throw createRepositoryError(400, "El carrito no tiene productos validos.");
    }

    let createdOrder = null;

    const nextState = await this.update((current) => {
      const productMap = new Map(current.products.map((product) => [product.id, product]));
      const selectedItems = requestedItems.map((item) => {
        const product = productMap.get(item.id);
        if (!product) {
          throw createRepositoryError(409, "Uno de los productos ya no esta disponible.");
        }

        if (product.stock < item.qty) {
          throw createRepositoryError(
            409,
            `No hay stock suficiente para "${product.name}". Actualiza tu carrito e intenta de nuevo.`
          );
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: item.qty,
          subtotal: product.price * item.qty,
        };
      });

      const existingIds = new Set(current.orders.map((order) => order.id));
      const createdAt = new Date().toISOString();
      const order = {
        id: createOrderId(existingIds),
        createdAt,
        status: "pendiente",
        statusHistory: createDefaultOrderStatusHistory(createdAt),
        customer: normalizedCustomer,
        items: selectedItems,
        total: selectedItems.reduce((sum, item) => sum + item.subtotal, 0),
      };
      createdOrder = order;

      current.products = current.products.map((product) => {
        const soldItem = selectedItems.find((item) => item.id === product.id);
        if (!soldItem) {
          return product;
        }

        return {
          ...product,
          stock: Math.max(0, product.stock - soldItem.qty),
        };
      });

      current.orders.unshift(order);
      return current;
    });

    return {
      order: createdOrder,
      products: nextState.products,
    };
  }
}

function createRepositoryError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  StoreRepository,
  createRepositoryError,
};
