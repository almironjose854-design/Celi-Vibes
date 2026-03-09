const STORAGE_KEYS = {
  cart: "celi-vibes-cart",
  filters: "celi-vibes-filters",
  newsletterSubscribers: "celi-vibes-newsletter-subscribers",
  checkoutDraft: "celi-vibes-checkout-draft",
};
const STORE_BOOTSTRAP_ENDPOINT = "/api/store/bootstrap";
const STORE_ORDERS_ENDPOINT = "/api/store/orders";

const CHECKOUT_MIN_DEFAULT = 120000;
const DELIVERY_METHOD_LABELS = {
  delivery: "Delivery",
  pickup: "Retiro en local",
  meeting: "Punto de encuentro",
};
const PAYMENT_METHOD_LABELS = {
  transferencia: "Transferencia",
  qr: "QR",
  tarjeta: "Tarjeta",
  efectivo: "Efectivo",
};
const DELIVERY_METHOD_SET = new Set(Object.keys(DELIVERY_METHOD_LABELS));
const PAYMENT_METHOD_SET = new Set(Object.keys(PAYMENT_METHOD_LABELS));

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

let products = cloneDefaultProducts();
const persistedFilters = loadFilterState();

const state = {
  search: persistedFilters.search,
  category: persistedFilters.category,
  sort: persistedFilters.sort,
  maxPrice: persistedFilters.maxPrice,
  cart: loadCart(),
  content: { ...defaultStoreContent },
};

const productGrid = document.querySelector("#productGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const searchInput = document.querySelector("#searchInput");
const sortFilter = document.querySelector("#sortFilter");
const priceRange = document.querySelector("#priceRange");
const rangeValue = document.querySelector("#rangeValue");
const emptyState = document.querySelector("#emptyState");
const resultsCount = document.querySelector("#resultsCount");
const activeFilters = document.querySelector("#activeFilters");
const clearFiltersBtn = document.querySelector("#clearFiltersBtn");
const categoryQuickFilters = document.querySelector("#categoryQuickFilters");
const cartButton = document.querySelector("#cartButton");
const cartDrawer = document.querySelector("#cartDrawer");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("#cartCount");
const cartMinOrderHint = document.querySelector("#cartMinOrderHint");
const checkoutBtn = document.querySelector("#checkoutBtn");
const overlay = document.querySelector("#overlay");
const productModal = document.querySelector("#productModal");
const modalBody = document.querySelector("#modalBody");
const closeModal = document.querySelector("#closeModal");
const lookbookModal = document.querySelector("#lookbookModal");
const openLookbook = document.querySelector("#openLookbook");
const closeLookbook = document.querySelector("#closeLookbook");
const newsletterForm = document.querySelector("#newsletterForm");
const newsletterMsg = document.querySelector("#newsletterMsg");
const checkoutModal = document.querySelector("#checkoutModal");
const closeCheckoutModal = document.querySelector("#closeCheckoutModal");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutName = document.querySelector("#checkoutName");
const checkoutPhone = document.querySelector("#checkoutPhone");
const checkoutEmail = document.querySelector("#checkoutEmail");
const checkoutAddress = document.querySelector("#checkoutAddress");
const checkoutAddressLabel = document.querySelector('label[for="checkoutAddress"]');
const checkoutDeliveryMethod = document.querySelector("#checkoutDeliveryMethod");
const checkoutPaymentMethod = document.querySelector("#checkoutPaymentMethod");
const checkoutPreferredDate = document.querySelector("#checkoutPreferredDate");
const checkoutPreferredTime = document.querySelector("#checkoutPreferredTime");
const checkoutNotes = document.querySelector("#checkoutNotes");
const checkoutSummaryItems = document.querySelector("#checkoutSummaryItems");
const checkoutSummaryTotal = document.querySelector("#checkoutSummaryTotal");
const checkoutMinOrderHint = document.querySelector("#checkoutMinOrderHint");
const checkoutAndWhatsAppBtn = document.querySelector("#checkoutAndWhatsAppBtn");
const checkoutMsg = document.querySelector("#checkoutMsg");
const floatingWhatsApp = document.querySelector("#floatingWhatsApp");

const shippingMsg = document.querySelector("#shippingMsg");
const supportMsg = document.querySelector("#supportMsg");
const heroKicker = document.querySelector("#heroKicker");
const heroTitle = document.querySelector("#heroTitle");
const heroDescription = document.querySelector("#heroDescription");
const heroImage = document.querySelector("#heroImage");
const heroPrimaryBtn = document.querySelector("#heroPrimaryBtn");
const promoTag = document.querySelector("#promoTag");
const promoTitle = document.querySelector("#promoTitle");
const promoButton = document.querySelector("#promoButton");
const newsletterTitle = document.querySelector("#newsletterTitle");
const newsletterDescription = document.querySelector("#newsletterDescription");

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function apiFetchJson(url, options = {}) {
  const response = await fetch(url, {
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

function formatCategory(value) {
  return value
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");
}

function sanitizeCategory(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
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

function cloneDefaultProducts() {
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

  if (!isValid) return null;

  normalized.rating = Math.min(5, Math.max(0, normalized.rating));
  return normalized;
}

function applyStoreSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }

  const normalizedProducts = Array.isArray(snapshot.products)
    ? snapshot.products.map(normalizeProduct).filter(Boolean)
    : [];
  products = normalizedProducts.length ? normalizedProducts : cloneDefaultProducts();
  state.content = normalizeContent(snapshot.content);
}

function loadCart() {
  const raw = localStorage.getItem(STORAGE_KEYS.cart);
  if (!raw) return [];

  const parsed = parseJson(raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const id = String(item.id ?? "").trim();
      const name = String(item.name ?? "").trim();
      const image = String(item.image ?? "").trim();
      const price = Math.round(Number(item.price));
      const qty = Math.max(1, Math.round(Number(item.qty)));

      if (!id || !name || !image || !Number.isFinite(price) || price <= 0) {
        return null;
      }

      return { id, name, image, price, qty };
    })
    .filter(Boolean);
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
}

function loadFilterState() {
  const raw = localStorage.getItem(STORAGE_KEYS.filters);
  const parsed = raw ? parseJson(raw) : null;
  const source = parsed && typeof parsed === "object" ? parsed : {};

  const search =
    typeof source.search === "string" ? source.search.trim().toLowerCase() : "";
  const category =
    typeof source.category === "string" && source.category.trim()
      ? source.category.trim()
      : "all";
  const sortCandidate =
    typeof source.sort === "string" && source.sort.trim()
      ? source.sort.trim()
      : "featured";
  const sort = ["featured", "price-asc", "price-desc", "rating-desc"].includes(sortCandidate)
    ? sortCandidate
    : "featured";
  const maxPrice = Number(source.maxPrice);

  return {
    search,
    category,
    sort,
    maxPrice: Number.isFinite(maxPrice) ? Math.round(maxPrice) : 450000,
  };
}

function saveFilterState() {
  localStorage.setItem(
    STORAGE_KEYS.filters,
    JSON.stringify({
      search: state.search,
      category: state.category,
      sort: state.sort,
      maxPrice: state.maxPrice,
    })
  );
}

function loadNewsletterSubscribers() {
  const raw = localStorage.getItem(STORAGE_KEYS.newsletterSubscribers);
  const parsed = raw ? parseJson(raw) : null;
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
}

function saveNewsletterSubscribers(entries) {
  localStorage.setItem(STORAGE_KEYS.newsletterSubscribers, JSON.stringify(entries));
}

function normalizeDeliveryMethod(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return DELIVERY_METHOD_SET.has(normalized) ? normalized : "delivery";
}

function normalizePaymentMethod(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return PAYMENT_METHOD_SET.has(normalized) ? normalized : "transferencia";
}

function formatDeliveryMethod(value) {
  const key = normalizeDeliveryMethod(value);
  return DELIVERY_METHOD_LABELS[key];
}

function formatPaymentMethod(value) {
  const key = normalizePaymentMethod(value);
  return PAYMENT_METHOD_LABELS[key];
}

function loadCheckoutDraft() {
  const raw = localStorage.getItem(STORAGE_KEYS.checkoutDraft);
  const parsed = raw ? parseJson(raw) : null;
  const source = parsed && typeof parsed === "object" ? parsed : {};

  const preferredDate = String(source.preferredDate ?? "").trim();
  const preferredTime = String(source.preferredTime ?? "").trim();

  return {
    name: String(source.name ?? "").trim(),
    phone: String(source.phone ?? "").trim(),
    email: String(source.email ?? "").trim(),
    address: String(source.address ?? "").trim(),
    deliveryMethod: normalizeDeliveryMethod(source.deliveryMethod),
    paymentMethod: normalizePaymentMethod(source.paymentMethod),
    preferredDate: /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ? preferredDate : "",
    preferredTime,
    notes: String(source.notes ?? "").trim(),
  };
}

function saveCheckoutDraft() {
  if (!checkoutForm) return;

  localStorage.setItem(
    STORAGE_KEYS.checkoutDraft,
    JSON.stringify({
      name: checkoutName.value.trim(),
      phone: checkoutPhone.value.trim(),
      email: checkoutEmail.value.trim(),
      address: checkoutAddress.value.trim(),
      deliveryMethod: normalizeDeliveryMethod(checkoutDeliveryMethod?.value),
      paymentMethod: normalizePaymentMethod(checkoutPaymentMethod?.value),
      preferredDate: String(checkoutPreferredDate?.value || "").trim(),
      preferredTime: String(checkoutPreferredTime?.value || "").trim(),
      notes: checkoutNotes.value.trim(),
    })
  );
}

function clearCheckoutDraft() {
  localStorage.removeItem(STORAGE_KEYS.checkoutDraft);
}

function applyCheckoutDraft() {
  if (!checkoutForm) return;

  const draft = loadCheckoutDraft();
  checkoutName.value = draft.name;
  checkoutPhone.value = draft.phone;
  checkoutEmail.value = draft.email;
  checkoutAddress.value = draft.address;
  if (checkoutDeliveryMethod) checkoutDeliveryMethod.value = draft.deliveryMethod;
  if (checkoutPaymentMethod) checkoutPaymentMethod.value = draft.paymentMethod;
  if (checkoutPreferredDate) checkoutPreferredDate.value = draft.preferredDate;
  if (checkoutPreferredTime) checkoutPreferredTime.value = draft.preferredTime;
  checkoutNotes.value = draft.notes;
}

function syncCheckoutAddressField() {
  if (!checkoutAddress || !checkoutDeliveryMethod) return;

  const deliveryMethod = normalizeDeliveryMethod(checkoutDeliveryMethod.value);
  const requiresAddress = deliveryMethod === "delivery";

  checkoutAddress.required = requiresAddress;
  checkoutAddress.placeholder = requiresAddress
    ? "Barrio, calle, referencia"
    : "Ciudad o referencia (opcional)";

  if (checkoutAddressLabel) {
    checkoutAddressLabel.textContent = requiresAddress
      ? "Ciudad o direccion de entrega"
      : "Ciudad o direccion (opcional)";
  }
}

function normalizeContent(content) {
  const source = content && typeof content === "object" ? content : {};
  return {
    shippingMsg:
      typeof source.shippingMsg === "string" && source.shippingMsg.trim()
        ? source.shippingMsg.trim()
        : defaultStoreContent.shippingMsg,
    supportMsg:
      typeof source.supportMsg === "string" && source.supportMsg.trim()
        ? source.supportMsg.trim()
        : defaultStoreContent.supportMsg,
    heroKicker:
      typeof source.heroKicker === "string" && source.heroKicker.trim()
        ? source.heroKicker.trim()
        : defaultStoreContent.heroKicker,
    heroTitle:
      typeof source.heroTitle === "string" && source.heroTitle.trim()
        ? source.heroTitle.trim()
        : defaultStoreContent.heroTitle,
    heroDescription:
      typeof source.heroDescription === "string" && source.heroDescription.trim()
        ? source.heroDescription.trim()
        : defaultStoreContent.heroDescription,
    heroImage:
      typeof source.heroImage === "string" && source.heroImage.trim()
        ? source.heroImage.trim()
        : defaultStoreContent.heroImage,
    heroPrimaryBtnText:
      typeof source.heroPrimaryBtnText === "string" && source.heroPrimaryBtnText.trim()
        ? source.heroPrimaryBtnText.trim()
        : defaultStoreContent.heroPrimaryBtnText,
    promoTag:
      typeof source.promoTag === "string" && source.promoTag.trim()
        ? source.promoTag.trim()
        : defaultStoreContent.promoTag,
    promoTitle:
      typeof source.promoTitle === "string" && source.promoTitle.trim()
        ? source.promoTitle.trim()
        : defaultStoreContent.promoTitle,
    promoButtonText:
      typeof source.promoButtonText === "string" && source.promoButtonText.trim()
        ? source.promoButtonText.trim()
        : defaultStoreContent.promoButtonText,
    newsletterTitle:
      typeof source.newsletterTitle === "string" && source.newsletterTitle.trim()
        ? source.newsletterTitle.trim()
        : defaultStoreContent.newsletterTitle,
    newsletterDescription:
      typeof source.newsletterDescription === "string" && source.newsletterDescription.trim()
        ? source.newsletterDescription.trim()
        : defaultStoreContent.newsletterDescription,
  };
}

function applyStoreContent() {
  if (shippingMsg) shippingMsg.textContent = state.content.shippingMsg;
  if (supportMsg) supportMsg.textContent = state.content.supportMsg;
  if (heroKicker) heroKicker.textContent = state.content.heroKicker;
  if (heroTitle) heroTitle.textContent = state.content.heroTitle;
  if (heroDescription) heroDescription.textContent = state.content.heroDescription;
  if (heroImage) heroImage.src = state.content.heroImage;
  if (heroPrimaryBtn) heroPrimaryBtn.textContent = state.content.heroPrimaryBtnText;
  if (promoTag) promoTag.textContent = state.content.promoTag;
  if (promoTitle) promoTitle.textContent = state.content.promoTitle;
  if (promoButton) promoButton.textContent = state.content.promoButtonText;
  if (newsletterTitle) newsletterTitle.textContent = state.content.newsletterTitle;
  if (newsletterDescription) {
    newsletterDescription.textContent = state.content.newsletterDescription;
  }

  updateWhatsAppShortcut();
  renderCart();
  renderCheckoutSummary();
}

async function fetchStoreSnapshot() {
  const snapshot = await apiFetchJson(STORE_BOOTSTRAP_ENDPOINT);
  applyStoreSnapshot(snapshot);
  return snapshot;
}
function initCategories() {
  const categories = [...new Set(products.map((item) => item.category))];
  categoryFilter.innerHTML = '<option value="all">Todas</option>';

  categories.sort((a, b) => a.localeCompare(b, "es")).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = formatCategory(category);
    categoryFilter.appendChild(option);
  });

  if (state.category !== "all" && !categories.includes(state.category)) {
    state.category = "all";
  }

  categoryFilter.value = state.category;
}

function renderQuickCategoryFilters() {
  if (!categoryQuickFilters) return;

  const countsByCategory = products.reduce((map, product) => {
    const key = product.category;
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());
  const categories = [...countsByCategory.keys()].sort((a, b) => a.localeCompare(b, "es"));
  const currentCategory = state.category;

  const chips = [
    {
      value: "all",
      label: "Todas",
      count: products.length,
    },
    ...categories.map((category) => ({
      value: category,
      label: formatCategory(category),
      count: countsByCategory.get(category) || 0,
    })),
  ];

  categoryQuickFilters.innerHTML = chips
    .map(
      (chip) => `
        <button
          type="button"
          class="category-chip ${currentCategory === chip.value ? "active" : ""}"
          data-category="${escapeHtml(chip.value)}"
        >
          <span>${escapeHtml(chip.label)}</span>
          <strong>${escapeHtml(String(chip.count))}</strong>
        </button>
      `
    )
    .join("");
}

function syncPriceRangeBounds() {
  const baseMin = Number(priceRange.min) || 60000;
  const maxProductPrice = products.reduce(
    (max, product) => Math.max(max, product.price),
    baseMin
  );
  const roundedMax = Math.max(450000, Math.ceil(maxProductPrice / 10000) * 10000);

  priceRange.max = String(roundedMax);

  if (state.maxPrice < baseMin || state.maxPrice > roundedMax) {
    state.maxPrice = roundedMax;
  }

  priceRange.value = String(state.maxPrice);
  rangeValue.textContent = state.maxPrice.toLocaleString("es-PY");
}

function syncFilterInputs() {
  const categoryExists = [...categoryFilter.options].some(
    (option) => option.value === state.category
  );
  if (!categoryExists) state.category = "all";

  searchInput.value = state.search;
  categoryFilter.value = state.category;
  sortFilter.value = state.sort;
  priceRange.value = String(state.maxPrice);
  rangeValue.textContent = state.maxPrice.toLocaleString("es-PY");
}

function hasActiveFilters() {
  const maxRange = Number(priceRange.max) || 450000;
  return (
    Boolean(state.search) ||
    state.category !== "all" ||
    state.sort !== "featured" ||
    state.maxPrice < maxRange
  );
}

function renderActiveFilters() {
  if (!activeFilters) return;

  const chips = [];
  const maxRange = Number(priceRange.max) || 450000;

  if (state.search) {
    chips.push({
      key: "search",
      text: `Busqueda: ${state.search}`,
    });
  }

  if (state.category !== "all") {
    chips.push({
      key: "category",
      text: `Categoria: ${formatCategory(state.category)}`,
    });
  }

  if (state.sort !== "featured") {
    const sortLabel = sortFilter.options[sortFilter.selectedIndex]?.textContent || "Orden";
    chips.push({
      key: "sort",
      text: sortLabel,
    });
  }

  if (state.maxPrice < maxRange) {
    chips.push({
      key: "price",
      text: `Max: ${gs(state.maxPrice)}`,
    });
  }

  if (!chips.length) {
    activeFilters.innerHTML = "";
    activeFilters.classList.add("hidden");
    return;
  }

  activeFilters.classList.remove("hidden");
  activeFilters.innerHTML = chips
    .map(
      (chip) => `
        <button type="button" class="filter-chip" data-filter="${escapeHtml(chip.key)}">
          ${escapeHtml(chip.text)}
          <span aria-hidden="true">x</span>
        </button>
      `
    )
    .join("");
}

function resetFilters() {
  state.search = "";
  state.category = "all";
  state.sort = "featured";
  state.maxPrice = Number(priceRange.max) || 450000;
  saveFilterState();
  syncFilterInputs();
  renderProducts();
}

function getFilteredProducts() {
  const filtered = products.filter((product) => {
    const term = state.search;
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);
    const matchesCategory =
      state.category === "all" || product.category === state.category;
    const matchesPrice = product.price <= state.maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (state.sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sort === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  const totalProducts = products.length;

  productGrid.innerHTML = "";
  emptyState.classList.toggle("hidden", filteredProducts.length > 0);

  if (resultsCount) {
    resultsCount.textContent = `${filteredProducts.length} de ${totalProducts} productos`;
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.disabled = !hasActiveFilters();
  }

  renderActiveFilters();
  renderQuickCategoryFilters();

  filteredProducts.forEach((product) => {
    const outOfStock = product.stock <= 0;
    const isLowStock = !outOfStock && product.stock <= 5;
    const isMediumStock = !outOfStock && product.stock > 5 && product.stock <= 12;
    const stockLevel = outOfStock ? 0 : Math.min(100, Math.max(8, (product.stock / 15) * 100));
    const stockLabel = outOfStock
      ? "Sin stock"
      : isLowStock
        ? "Ultimas unidades"
        : isMediumStock
          ? `Stock limitado (${product.stock})`
          : `Disponible (${product.stock})`;

    const card = document.createElement("article");
    card.className = `product-card ${
      outOfStock ? "is-out-of-stock" : isLowStock ? "is-low-stock" : ""
    }`.trim();
    card.innerHTML = `
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(
      product.name
    )}" loading="lazy" />
      <div class="product-content">
        <div class="product-head">
          <h3>${escapeHtml(product.name)}</h3>
          <span class="chip">${escapeHtml(product.badge)}</span>
        </div>
        <div class="meta">
          <span>${escapeHtml(formatCategory(product.category))}</span>
          <span>${product.rating.toFixed(1)} / 5</span>
        </div>
        <div class="meta">
          <span>${escapeHtml(stockLabel)}</span>
          <strong class="price">${gs(product.price)}</strong>
        </div>
        <div class="stock-meter ${outOfStock ? "out" : isLowStock ? "low" : "ok"}">
          <span style="width:${stockLevel.toFixed(2)}%"></span>
        </div>
        <div class="card-actions">
          <button class="small-btn detail-btn" data-id="${escapeHtml(product.id)}">
            Ver detalle
          </button>
          <button class="btn btn-primary add-btn" data-id="${escapeHtml(
            product.id
          )}" ${outOfStock ? "disabled" : ""}>
            ${outOfStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function syncCartWithProducts() {
  const productMap = new Map(products.map((product) => [product.id, product]));

  state.cart = state.cart
    .map((item) => {
      const product = productMap.get(item.id);
      if (!product || product.stock <= 0) return null;

      const qty = Math.min(item.qty, product.stock);
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

  saveCart();
}

function addToCart(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product || product.stock <= 0) {
    alert("Este producto no tiene stock disponible.");
    return;
  }

  const existing = state.cart.find((item) => item.id === productId);

  if (existing) {
    if (existing.qty >= product.stock) {
      alert("No hay mas stock disponible para este producto.");
      return;
    }
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    });
  }

  saveCart();
  renderCart();
  openCart();
}

function updateQty(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  const product = products.find((entry) => entry.id === productId);
  if (!product || product.stock <= 0) {
    removeFromCart(productId);
    return;
  }

  const nextQty = item.qty + delta;

  if (nextQty > product.stock) {
    alert("No hay mas stock disponible para este producto.");
    return;
  }

  item.qty = nextQty;

  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((entry) => entry.id !== productId);
  saveCart();
  renderCart();
}

function cartTotals() {
  const items = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const total = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  return { items, total };
}

function renderCart() {
  const { items, total } = cartTotals();
  const minimumAmount = getMinimumCheckoutAmount();
  const missingForMinimum = Math.max(0, minimumAmount - total);

  cartCount.textContent = String(items);
  cartTotal.textContent = gs(total);
  checkoutBtn.disabled = items === 0 || missingForMinimum > 0;

  if (cartMinOrderHint) {
    if (items === 0) {
      cartMinOrderHint.textContent = `Compra minima: ${gs(minimumAmount)}.`;
      cartMinOrderHint.classList.remove("error");
    } else if (missingForMinimum > 0) {
      cartMinOrderHint.textContent = `Te faltan ${gs(
        missingForMinimum
      )} para alcanzar la compra minima (${gs(minimumAmount)}).`;
      cartMinOrderHint.classList.add("error");
    } else {
      cartMinOrderHint.textContent = `Compra minima alcanzada (${gs(minimumAmount)}).`;
      cartMinOrderHint.classList.remove("error");
    }
  }

  if (state.cart.length === 0) {
    cartItems.innerHTML = "<p class='empty'>Tu carrito aun esta vacio.</p>";
    renderCheckoutSummary();
    return;
  }

  cartItems.innerHTML = "";

  state.cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);

    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />
      <div>
        <h4>${escapeHtml(item.name)}</h4>
        <p>${gs(item.price)}</p>
        <p>${product ? `Stock: ${product.stock}` : "No disponible"}</p>
        <div class="qty-row">
          <button data-action="minus" data-id="${escapeHtml(item.id)}">-</button>
          <span>${item.qty}</span>
          <button data-action="plus" data-id="${escapeHtml(item.id)}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-action="remove" data-id="${escapeHtml(item.id)}">
        Quitar
      </button>
    `;

    cartItems.appendChild(row);
  });

  renderCheckoutSummary();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

function openProductModal(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;

  modalBody.innerHTML = `
    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />
    <div>
      <p class="chip">${escapeHtml(product.badge)}</p>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.description)}</p>
      <p><strong>Categoria:</strong> ${escapeHtml(formatCategory(product.category))}</p>
      <p><strong>Disponible:</strong> ${product.stock} unidades</p>
      <p><strong>Precio:</strong> ${gs(product.price)}</p>
      <button class="btn btn-primary" id="modalAddButton" ${
        product.stock <= 0 ? "disabled" : ""
      }>${product.stock <= 0 ? "Sin stock" : "Agregar al carrito"}</button>
    </div>
  `;

  productModal.showModal();

  const addBtn = document.querySelector("#modalAddButton");
  addBtn?.addEventListener("click", () => {
    addToCart(product.id);
    productModal.close();
  });
}

function extractDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function parseGsAmount(value) {
  const source = String(value || "");
  const match = source.match(/(\d[\d.,]*)/);
  if (!match) return NaN;

  const normalized = match[1].replace(/\./g, "").replace(/,/g, ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount) : NaN;
}

function getMinimumCheckoutAmount() {
  const fromContent = parseGsAmount(state.content.shippingMsg);
  if (Number.isFinite(fromContent) && fromContent > 0) return fromContent;

  const fromDefault = parseGsAmount(defaultStoreContent.shippingMsg);
  if (Number.isFinite(fromDefault) && fromDefault > 0) return fromDefault;

  return CHECKOUT_MIN_DEFAULT;
}

function extractOwnerWhatsApp() {
  const source = String(state.content.supportMsg || defaultStoreContent.supportMsg);
  const match = source.match(/(\+?\d[\d\s-]{7,}\d)/);
  if (!match) return "";
  return extractDigits(match[1]);
}

function updateWhatsAppShortcut() {
  if (!floatingWhatsApp) return;

  const ownerPhone = extractOwnerWhatsApp();
  if (!ownerPhone) {
    floatingWhatsApp.classList.add("hidden");
    floatingWhatsApp.removeAttribute("href");
    return;
  }

  floatingWhatsApp.classList.remove("hidden");
  floatingWhatsApp.href = `https://wa.me/${ownerPhone}`;
}

function readCheckoutCustomer() {
  const name = checkoutName.value.trim();
  const phone = checkoutPhone.value.trim();
  const phoneDigits = extractDigits(phone);
  const email = checkoutEmail.value.trim();
  const address = checkoutAddress.value.trim();
  const deliveryMethod = normalizeDeliveryMethod(checkoutDeliveryMethod?.value);
  const paymentMethod = normalizePaymentMethod(checkoutPaymentMethod?.value);
  const preferredDate = String(checkoutPreferredDate?.value || "").trim();
  const preferredTime = String(checkoutPreferredTime?.value || "").trim();
  const notes = checkoutNotes.value.trim();

  if (name.length < 3) {
    return { error: "Ingresa el nombre completo para continuar." };
  }

  if (phoneDigits.length < 8) {
    return { error: "Ingresa un telefono/WhatsApp valido." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "El email no parece valido." };
  }

  if (!DELIVERY_METHOD_SET.has(deliveryMethod)) {
    return { error: "Selecciona un metodo de entrega valido." };
  }

  if (!PAYMENT_METHOD_SET.has(paymentMethod)) {
    return { error: "Selecciona un metodo de pago valido." };
  }

  if (deliveryMethod === "delivery" && address.length < 5) {
    return { error: "Para delivery, agrega una direccion o ciudad mas completa." };
  }

  if (preferredDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return { error: "La fecha preferida no tiene un formato valido." };
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    if (preferredDate < todayKey) {
      return { error: "La fecha preferida no puede ser anterior a hoy." };
    }
  }

  return {
    customer: {
      name,
      phone,
      phoneDigits,
      email,
      address,
      deliveryMethod,
      paymentMethod,
      preferredDate,
      preferredTime,
      notes,
    },
  };
}

function renderCheckoutSummary() {
  if (!checkoutSummaryItems || !checkoutSummaryTotal) return;

  const minimumAmount = getMinimumCheckoutAmount();

  const updateMinimumHint = (total) => {
    const missing = Math.max(0, minimumAmount - total);
    const isBlocked = state.cart.length === 0 || missing > 0;

    if (checkoutMinOrderHint) {
      if (state.cart.length === 0) {
        checkoutMinOrderHint.textContent = `Compra minima: ${gs(minimumAmount)}.`;
        checkoutMinOrderHint.classList.remove("error");
      } else if (missing > 0) {
        checkoutMinOrderHint.textContent = `Faltan ${gs(
          missing
        )} para poder finalizar el pedido.`;
        checkoutMinOrderHint.classList.add("error");
      } else {
        checkoutMinOrderHint.textContent = "Pedido listo para finalizar.";
        checkoutMinOrderHint.classList.remove("error");
      }
    }

    if (checkoutAndWhatsAppBtn) checkoutAndWhatsAppBtn.disabled = isBlocked;
    const submitButton = checkoutForm?.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = isBlocked;
    }
  };

  if (state.cart.length === 0) {
    checkoutSummaryItems.innerHTML = "<p class='empty'>No hay productos en el carrito.</p>";
    checkoutSummaryTotal.textContent = gs(0);
    updateMinimumHint(0);
    return;
  }

  const deliveryLabel = formatDeliveryMethod(checkoutDeliveryMethod?.value);
  const paymentLabel = formatPaymentMethod(checkoutPaymentMethod?.value);

  checkoutSummaryItems.innerHTML = [
    ...state.cart.map(
      (item) => `
        <article class="checkout-line">
          <p>${escapeHtml(item.qty)}x ${escapeHtml(item.name)}</p>
          <strong>${gs(item.qty * item.price)}</strong>
        </article>
      `
    ),
    `
      <article class="checkout-line checkout-line-meta">
        <p>Entrega: ${escapeHtml(deliveryLabel)}</p>
        <strong>Pago: ${escapeHtml(paymentLabel)}</strong>
      </article>
    `,
  ].join("");

  const { total } = cartTotals();
  checkoutSummaryTotal.textContent = gs(total);
  updateMinimumHint(total);
}

function openCheckoutModal() {
  const { items, total } = cartTotals();

  if (items === 0) {
    alert("Tu carrito esta vacio.");
    return;
  }

  const minimumAmount = getMinimumCheckoutAmount();
  if (total < minimumAmount) {
    alert(
      `La compra minima es ${gs(minimumAmount)}. Agrega ${gs(
        minimumAmount - total
      )} para continuar.`
    );
    openCart();
    return;
  }

  const unavailable = state.cart.filter((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return !product || product.stock < item.qty;
  });

  if (unavailable.length > 0) {
    syncCartWithProducts();
    renderCart();
    renderProducts();
    alert("Algunos productos cambiaron de stock. Revisamos tu carrito automaticamente.");
    return;
  }

  applyCheckoutDraft();
  syncCheckoutAddressField();
  if (checkoutPreferredDate) {
    checkoutPreferredDate.min = new Date().toISOString().slice(0, 10);
  }

  renderCheckoutSummary();
  if (checkoutMsg) checkoutMsg.textContent = "";
  closeCartDrawer();
  checkoutModal.showModal();
}

function closeCheckoutModalDialog() {
  if (checkoutMsg) checkoutMsg.textContent = "";
  if (checkoutModal.open) checkoutModal.close();
}

function buildWhatsAppMessage(order) {
  const lines = order.items.map(
    (item, index) => `${index + 1}. ${item.qty}x ${item.name} - ${gs(item.subtotal)}`
  );
  const deliveryLabel = formatDeliveryMethod(order.customer.deliveryMethod);
  const paymentLabel = formatPaymentMethod(order.customer.paymentMethod);
  const message = [
    `Hola Celi Vibes, quiero confirmar el pedido ${order.id}.`,
    "",
    `Cliente: ${order.customer.name}`,
    `Telefono: ${order.customer.phone}`,
    `Entrega: ${deliveryLabel}`,
    `Pago: ${paymentLabel}`,
  ];

  if (order.customer.email) message.push(`Email: ${order.customer.email}`);
  if (order.customer.address) message.push(`Direccion: ${order.customer.address}`);
  if (order.customer.preferredDate) message.push(`Fecha preferida: ${order.customer.preferredDate}`);
  if (order.customer.preferredTime) message.push(`Horario preferido: ${order.customer.preferredTime}`);

  message.push("", "Detalle del pedido:", ...lines, "", `Total: ${gs(order.total)}`);

  if (order.customer.notes) {
    message.push("", `Notas: ${order.customer.notes}`);
  }

  return message.join("\n");
}

function openWhatsAppWithOrder(order) {
  const ownerPhone = extractOwnerWhatsApp();
  if (!ownerPhone) return false;

  const text = encodeURIComponent(buildWhatsAppMessage(order));
  const url = `https://wa.me/${ownerPhone}?text=${text}`;
  window.open(url, "_blank", "noopener");
  return true;
}

async function processCheckout(sendToWhatsApp = false) {
  const { items, total } = cartTotals();

  if (items === 0) {
    alert("Tu carrito esta vacio.");
    return;
  }

  const minimumAmount = getMinimumCheckoutAmount();
  if (total < minimumAmount) {
    if (checkoutMsg) {
      checkoutMsg.textContent = `La compra minima es ${gs(minimumAmount)}.`;
    }
    return;
  }

  const { customer, error } = readCheckoutCustomer();
  if (error) {
    if (checkoutMsg) checkoutMsg.textContent = error;
    return;
  }
  if (checkoutMsg) checkoutMsg.textContent = "";

  const unavailable = state.cart.filter((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return !product || product.stock < item.qty;
  });

  if (unavailable.length > 0) {
    syncCartWithProducts();
    renderCart();
    renderProducts();
    alert("Algunos productos cambiaron de stock. Revisamos tu carrito automaticamente.");
    return;
  }

  try {
    const result = await apiFetchJson(STORE_ORDERS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        customer,
        items: state.cart.map((item) => ({
          id: item.id,
          qty: item.qty,
        })),
      }),
    });

    applyStoreSnapshot({
      products: result?.products,
      content: state.content,
    });

    const order = result?.order;
    state.cart = [];
    saveCart();

    initCategories();
    syncPriceRangeBounds();
    syncFilterInputs();
    renderProducts();
    renderCart();
    closeCartDrawer();
    closeCheckoutModalDialog();
    checkoutForm.reset();
    clearCheckoutDraft();
    syncCheckoutAddressField();
    renderCheckoutSummary();

    if (sendToWhatsApp) {
      const opened = order ? openWhatsAppWithOrder(order) : false;
      if (!opened) {
        alert(
          `Pedido ${order?.id || ""} registrado. No encontramos un numero de WhatsApp valido en el mensaje de soporte.`
        );
        return;
      }
      alert(`Pedido ${order.id} registrado y enviado por WhatsApp.`);
      return;
    }

    alert(`Pedido ${order?.id || ""} registrado. Te contactaremos para confirmar el pago.`);
  } catch (error) {
    try {
      await fetchStoreSnapshot();
      initCategories();
      syncPriceRangeBounds();
      syncFilterInputs();
      syncCartWithProducts();
      renderProducts();
      renderCart();
      renderCheckoutSummary();
    } catch {}

    const text = error instanceof Error ? error.message : "No se pudo registrar el pedido.";
    if (checkoutMsg) {
      checkoutMsg.textContent = text;
    }
  }
}
function initReveal() {
  const sections = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  sections.forEach((section) => observer.observe(section));
}

function attachEvents() {
  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    saveFilterState();
    renderProducts();
  });

  categoryFilter.addEventListener("change", (event) => {
    state.category = event.target.value;
    saveFilterState();
    renderProducts();
  });

  sortFilter.addEventListener("change", (event) => {
    state.sort = event.target.value;
    saveFilterState();
    renderProducts();
  });

  priceRange.addEventListener("input", (event) => {
    state.maxPrice = Number(event.target.value);
    rangeValue.textContent = state.maxPrice.toLocaleString("es-PY");
    saveFilterState();
    renderProducts();
  });

  clearFiltersBtn?.addEventListener("click", () => {
    resetFilters();
  });

  activeFilters?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const chip = target.closest(".filter-chip");
    if (!(chip instanceof HTMLElement)) return;

    const filter = chip.dataset.filter;
    if (!filter) return;

    if (filter === "search") state.search = "";
    if (filter === "category") state.category = "all";
    if (filter === "sort") state.sort = "featured";
    if (filter === "price") state.maxPrice = Number(priceRange.max) || 450000;

    saveFilterState();
    syncFilterInputs();
    renderProducts();
  });

  categoryQuickFilters?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const chip = target.closest(".category-chip");
    if (!(chip instanceof HTMLButtonElement)) return;

    const nextCategory = chip.dataset.category || "all";
    state.category = nextCategory;
    saveFilterState();
    syncFilterInputs();
    renderProducts();
  });

  productGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains("add-btn")) {
      const id = target.dataset.id;
      if (id) addToCart(id);
    }

    if (target.classList.contains("detail-btn")) {
      const id = target.dataset.id;
      if (id) openProductModal(id);
    }
  });

  cartItems.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    if (action === "plus") updateQty(id, 1);
    if (action === "minus") updateQty(id, -1);
    if (action === "remove") removeFromCart(id);
  });

  cartButton.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartDrawer);
  overlay.addEventListener("click", closeCartDrawer);

  closeModal.addEventListener("click", () => productModal.close());
  productModal.addEventListener("click", (event) => {
    const rect = productModal.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) productModal.close();
  });

  openLookbook.addEventListener("click", () => lookbookModal.showModal());
  closeLookbook.addEventListener("click", () => lookbookModal.close());

  checkoutBtn.addEventListener("click", openCheckoutModal);

  closeCheckoutModal.addEventListener("click", closeCheckoutModalDialog);
  checkoutModal.addEventListener("click", (event) => {
    const rect = checkoutModal.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) closeCheckoutModalDialog();
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCheckoutDraft();
    void processCheckout(false);
  });

  checkoutAndWhatsAppBtn.addEventListener("click", () => {
    saveCheckoutDraft();
    void processCheckout(true);
  });

  const checkoutInputsForDraft = [
    checkoutName,
    checkoutPhone,
    checkoutEmail,
    checkoutAddress,
    checkoutDeliveryMethod,
    checkoutPaymentMethod,
    checkoutPreferredDate,
    checkoutPreferredTime,
    checkoutNotes,
  ];

  checkoutInputsForDraft.forEach((input) => {
    if (!input) return;
    input.addEventListener("input", saveCheckoutDraft);
    input.addEventListener("change", saveCheckoutDraft);
  });

  checkoutDeliveryMethod?.addEventListener("change", () => {
    syncCheckoutAddressField();
    renderCheckoutSummary();
  });

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#newsletterEmail");
    const normalizedEmail =
      email instanceof HTMLInputElement ? email.value.trim().toLowerCase() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      newsletterMsg.textContent = "Ingresa un email valido.";
      return;
    }

    const subscribers = loadNewsletterSubscribers();
    if (subscribers.includes(normalizedEmail)) {
      newsletterMsg.textContent = "Este email ya esta registrado en el Club Celi Vibes.";
      return;
    }

    subscribers.push(normalizedEmail);
    saveNewsletterSubscribers(subscribers);
    newsletterMsg.textContent = "Listo, te uniste al Club Celi Vibes.";
    email.value = "";
  });

  window.addEventListener("storage", (event) => {
    if (event.storageArea !== localStorage) return;

    if (event.key === STORAGE_KEYS.cart) {
      state.cart = loadCart();
      syncCartWithProducts();
      renderCart();
      return;
    }

    if (event.key === STORAGE_KEYS.filters) {
      const nextFilters = loadFilterState();
      state.search = nextFilters.search;
      state.category = nextFilters.category;
      state.sort = nextFilters.sort;
      state.maxPrice = nextFilters.maxPrice;
      syncPriceRangeBounds();
      syncFilterInputs();
      renderProducts();
      return;
    }

    if (event.key === STORAGE_KEYS.checkoutDraft && checkoutModal.open) {
      applyCheckoutDraft();
      syncCheckoutAddressField();
      renderCheckoutSummary();
    }
  });

  window.addEventListener("focus", () => {
    void fetchStoreSnapshot()
      .then(() => {
        applyStoreContent();
        initCategories();
        syncPriceRangeBounds();
        syncFilterInputs();
        syncCartWithProducts();
        renderProducts();
        renderCart();
        if (checkoutModal.open) {
          renderCheckoutSummary();
        }
      })
      .catch(() => {});
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeCartDrawer();
    if (lookbookModal.open) lookbookModal.close();
    if (productModal.open) productModal.close();
    if (checkoutModal.open) closeCheckoutModalDialog();
  });
}

async function init() {
  applyCheckoutDraft();
  syncCheckoutAddressField();
  if (checkoutPreferredDate) {
    checkoutPreferredDate.min = new Date().toISOString().slice(0, 10);
  }

  initCategories();
  syncPriceRangeBounds();
  syncFilterInputs();
  saveFilterState();

  syncCartWithProducts();
  attachEvents();
  initReveal();

  try {
    await fetchStoreSnapshot();
  } catch (error) {
    console.error(error);
  }

  applyStoreContent();
  syncCartWithProducts();
  renderProducts();
  renderCart();
}

void init();
