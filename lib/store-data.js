"use strict";

const crypto = require("crypto");

const ORDER_STATUS_VALUES = ["pendiente", "confirmado", "enviado", "completado", "cancelado"];
const ORDER_STATUS_SET = new Set(ORDER_STATUS_VALUES);
const DELIVERY_METHOD_VALUES = ["delivery", "pickup", "meeting"];
const DELIVERY_METHOD_SET = new Set(DELIVERY_METHOD_VALUES);
const PAYMENT_METHOD_VALUES = ["transferencia", "qr", "tarjeta", "efectivo"];
const PAYMENT_METHOD_SET = new Set(PAYMENT_METHOD_VALUES);

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

function clone(value) {
  return structuredClone(value);
}

function sanitizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function extractDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function generateId(prefix = "") {
  return `${prefix}${crypto.randomBytes(5).toString("hex")}`;
}

function cloneDefaultProducts() {
  return clone(defaultProducts);
}

function cloneDefaultStoreContent() {
  return { ...defaultStoreContent };
}

function createDefaultStoreSnapshot() {
  return {
    products: cloneDefaultProducts(),
    content: cloneDefaultStoreContent(),
    orders: [],
  };
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return null;
  }

  const normalized = {
    id: String(product.id ?? "").trim(),
    name: String(product.name ?? "").trim(),
    category: sanitizeCategory(product.category),
    price: Math.round(Number(product.price)),
    rating: Number(product.rating),
    badge: String(product.badge ?? "").trim(),
    stock: Math.max(0, Math.round(Number(product.stock))),
    image: String(product.image ?? "").trim(),
    description: String(product.description ?? "").trim(),
  };

  const isValid =
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

  if (!isValid) {
    return null;
  }

  normalized.rating = Math.min(5, Math.max(0, normalized.rating));
  return normalized;
}

function normalizeContent(content) {
  const result = cloneDefaultStoreContent();
  const source = content && typeof content === "object" ? content : {};

  Object.keys(defaultStoreContent).forEach((key) => {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim();
    }
  });

  return result;
}

function normalizeOrderStatusHistoryEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const status = String(entry.status ?? "").trim();
  if (!ORDER_STATUS_SET.has(status)) {
    return null;
  }

  const changedAt = new Date(entry.changedAt || entry.createdAt || Date.now());
  if (!Number.isFinite(changedAt.getTime())) {
    return null;
  }

  return {
    status,
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

function normalizeCustomer(customer) {
  const source = customer && typeof customer === "object" ? customer : {};
  const name = String(source.name ?? "").trim();
  const phone = String(source.phone ?? "").trim();
  const phoneDigits = extractDigits(source.phoneDigits || phone);

  return {
    name: name || "Sin datos",
    phone,
    phoneDigits,
    email: String(source.email ?? "").trim(),
    address: String(source.address ?? "").trim(),
    deliveryMethod: normalizeDeliveryMethod(source.deliveryMethod),
    paymentMethod: normalizePaymentMethod(source.paymentMethod),
    preferredDate: normalizePreferredDate(source.preferredDate),
    preferredTime: String(source.preferredTime ?? "").trim(),
    notes: String(source.notes ?? "").trim(),
  };
}

function normalizePreferredDate(value) {
  const normalized = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

function normalizeDeliveryMethod(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return DELIVERY_METHOD_SET.has(normalized) ? normalized : "delivery";
}

function normalizePaymentMethod(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return PAYMENT_METHOD_SET.has(normalized) ? normalized : "transferencia";
}

function normalizeOrder(order) {
  if (!order || typeof order !== "object") {
    return null;
  }

  const id = String(order.id ?? "").trim();
  const createdAt = new Date(order.createdAt || Date.now());
  const rawStatus = String(order.status ?? "pendiente").trim() || "pendiente";
  const status = ORDER_STATUS_SET.has(rawStatus) ? rawStatus : "pendiente";

  const items = Array.isArray(order.items)
    ? order.items
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const itemId = String(item.id ?? "").trim();
          const name = String(item.name ?? "").trim();
          const price = Math.round(Number(item.price));
          const qty = Math.max(1, Math.round(Number(item.qty)));
          const subtotalRaw = Number(item.subtotal);
          const subtotal = Number.isFinite(subtotalRaw) ? Math.round(subtotalRaw) : price * qty;

          if (!itemId || !name || !Number.isFinite(price) || price <= 0) {
            return null;
          }

          return {
            id: itemId,
            name,
            price,
            qty,
            subtotal,
          };
        })
        .filter(Boolean)
    : [];

  if (!id || !Number.isFinite(createdAt.getTime()) || items.length === 0) {
    return null;
  }

  const totalRaw = Number(order.total);
  const itemsTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = Number.isFinite(totalRaw) ? Math.round(totalRaw) : itemsTotal;
  const createdAtIso = createdAt.toISOString();

  let statusHistory = Array.isArray(order.statusHistory)
    ? order.statusHistory
        .map(normalizeOrderStatusHistoryEntry)
        .filter(Boolean)
        .sort((left, right) => new Date(left.changedAt).getTime() - new Date(right.changedAt).getTime())
    : [];

  if (statusHistory.length === 0) {
    statusHistory = createDefaultOrderStatusHistory(createdAtIso);
  }

  const latest = statusHistory[statusHistory.length - 1];
  if (!latest || latest.status !== status) {
    statusHistory.push({
      status,
      changedAt: createdAtIso,
      changedBy: "sistema",
      note: "Estado sincronizado",
    });
  }

  return {
    id,
    createdAt: createdAtIso,
    status,
    customer: normalizeCustomer(order.customer),
    items,
    total,
    statusHistory,
  };
}

function normalizeStoreSnapshot(snapshot) {
  const source = snapshot && typeof snapshot === "object" ? snapshot : {};
  const products = Array.isArray(source.products)
    ? source.products.map(normalizeProduct).filter(Boolean)
    : [];
  const orders = Array.isArray(source.orders)
    ? source.orders.map(normalizeOrder).filter(Boolean)
    : [];

  return {
    products: products.length ? products : cloneDefaultProducts(),
    content: normalizeContent(source.content),
    orders,
  };
}

function normalizeRequestedCartItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const id = String(item.id ?? "").trim();
      const qty = Math.max(1, Math.round(Number(item.qty)));

      if (!id || !Number.isFinite(qty)) {
        return null;
      }

      return { id, qty };
    })
    .filter(Boolean);
}

function validateCheckoutCustomer(customer) {
  const normalized = normalizeCustomer(customer);

  if (normalized.name.length < 3) {
    return { error: "Ingresa el nombre completo para continuar." };
  }

  if (normalized.phoneDigits.length < 8) {
    return { error: "Ingresa un telefono/WhatsApp valido." };
  }

  if (normalized.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    return { error: "El email no parece valido." };
  }

  if (!DELIVERY_METHOD_SET.has(normalized.deliveryMethod)) {
    return { error: "Selecciona un metodo de entrega valido." };
  }

  if (!PAYMENT_METHOD_SET.has(normalized.paymentMethod)) {
    return { error: "Selecciona un metodo de pago valido." };
  }

  if (normalized.deliveryMethod === "delivery" && normalized.address.length < 5) {
    return { error: "Para delivery, agrega una direccion o ciudad mas completa." };
  }

  if (normalized.preferredDate) {
    const todayKey = new Date().toISOString().slice(0, 10);
    if (normalized.preferredDate < todayKey) {
      return { error: "La fecha preferida no puede ser anterior a hoy." };
    }
  }

  return { customer: normalized };
}

function createOrderId(existingIds) {
  const now = new Date();
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = crypto.randomBytes(3).toString("base64url").slice(0, 5).toUpperCase();
    const id = `ORD-${day}-${code}`;
    if (!existingIds.has(id)) {
      return id;
    }
  }

  return `ORD-${day}-${generateId("").slice(0, 6).toUpperCase()}`;
}

module.exports = {
  ORDER_STATUS_SET,
  ORDER_STATUS_VALUES,
  PAYMENT_METHOD_SET,
  defaultProducts,
  defaultStoreContent,
  cloneDefaultProducts,
  cloneDefaultStoreContent,
  createDefaultOrderStatusHistory,
  createDefaultStoreSnapshot,
  createOrderId,
  extractDigits,
  normalizeContent,
  normalizeCustomer,
  normalizeDeliveryMethod,
  normalizeOrder,
  normalizePaymentMethod,
  normalizeProduct,
  normalizeRequestedCartItems,
  normalizeStoreSnapshot,
  sanitizeCategory,
  validateCheckoutCustomer,
};
