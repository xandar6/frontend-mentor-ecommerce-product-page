// Product data
// The gallery is generated from this array, so image details live in one place.
const productImages = [
  {
    id: 1,
    thumbnail: "images/image-product-1-thumbnail.jpg",
    full: "images/image-product-1.jpg",
    alt: "Fall Limited Edition Sneakers, product image 1",
  },
  {
    id: 2,
    thumbnail: "images/image-product-2-thumbnail.jpg",
    full: "images/image-product-2.jpg",
    alt: "Fall Limited Edition Sneakers, product image 2",
  },
  {
    id: 3,
    thumbnail: "images/image-product-3-thumbnail.jpg",
    full: "images/image-product-3.jpg",
    alt: "Fall Limited Edition Sneakers, product image 3",
  },
  {
    id: 4,
    thumbnail: "images/image-product-4-thumbnail.jpg",
    full: "images/image-product-4.jpg",
    alt: "Fall Limited Edition Sneakers, product image 4",
  },
];

const product = {
  id: 1,
  name: "Fall Limited Edition Sneakers",
  price: 125,
  thumbnail: productImages[0].thumbnail,
  thumbnailAlt: productImages[0].alt,
};

const cartProducts = [];

// State
// This is the single source of truth for the gallery.
// The DOM should reflect this value, not decide it.
let activeImageId = 1;

// DOM elements
const quantityControlEls = document.querySelectorAll(".custom-num-input");
const productThumbnailsEl = document.querySelector(".product-images");
const lightboxThumbnailsEl = document.querySelector(".lightbox-thumbnails");

const previewButtonEl = document.querySelector(".btn-image-preview");
const previewImageEl = document.querySelector(".image-preview img");

const lightboxEl = document.querySelector(".lightbox");
const lightboxImageEl = document.querySelector(".lightbox-img");
const lightboxCloseButtonEl = document.querySelector(".lightbox-close");
const lightboxPreviousButtonEl = document.querySelector(
  ".lightbox-control__previous",
);
const lightboxNextButtonEl = document.querySelector(".lightbox-control__next");

const cartPanelEl = document.querySelector(".cart-panel");
const cartContentEl = document.querySelector(".cart-content");
const openCartButtonEl = document.querySelector(".open-cart");
const addToCartButtonEl = document.querySelector(".btn-add-to-cart");
const cartCounterEl = document.querySelector(".cart-counter");
const cartStatusEl = document.querySelector(".cart-status");

const openSidebarButtonEl = document.querySelector(".open-sidebar-button");
const closeSidebarButtonEl = document.querySelector(".close-sidebar-button");
const sidebarLinksEl = document.querySelector(".links-container");
const sidebarOverlayEl = document.querySelector("#overlay");

const quantityInput = document.getElementById("quantity");

let lastFocusedElement = null;

initQuantityControls();
initProductGallery();
initCart();
initMobileMenu();

function initQuantityControls() {
  quantityControlEls.forEach((controlEl) => {
    const quantityInput = controlEl.querySelector("input[type='number']");
    const decreaseButton = controlEl.querySelector(".btn-minus");
    const increaseButton = controlEl.querySelector(".btn-plus");

    decreaseButton.addEventListener("click", () => quantityInput.stepDown());
    increaseButton.addEventListener("click", () => quantityInput.stepUp());
  });
}

function initProductGallery() {
  renderThumbnailButtons(productThumbnailsEl);
  renderThumbnailButtons(lightboxThumbnailsEl);

  // After the thumbnails exist, sync the UI with the initial state.
  setActiveImage(activeImageId);

  productThumbnailsEl.addEventListener("click", handleThumbnailClick);
  lightboxThumbnailsEl.addEventListener("click", handleThumbnailClick);
  previewButtonEl.addEventListener("click", openLightbox);
  lightboxCloseButtonEl.addEventListener("click", closeLightbox);
  lightboxPreviousButtonEl.addEventListener("click", showPreviousImage);
  lightboxNextButtonEl.addEventListener("click", showNextImage);
  document.addEventListener("keydown", handleLightboxKeydown);
}

function renderThumbnailButtons(containerEl) {
  containerEl.innerHTML = productImages
    .map((image) => createThumbnailButton(image))
    .join("");
}

function createThumbnailButton(image) {
  return `<button
    type="button"
    class="btn-thumbnail"
    data-image-id="${image.id}"
    aria-label="View product image ${image.id}"
    aria-pressed="false"
  >
    <img src="${image.thumbnail}" alt="" />
  </button>`;
}

function handleThumbnailClick(event) {
  const thumbnailButton = event.target.closest(".btn-thumbnail");
  if (!thumbnailButton) return;

  const imageId = Number(thumbnailButton.dataset.imageId);
  setActiveImage(imageId);
}

function setActiveImage(imageId) {
  const activeImage = getImageById(imageId);
  if (!activeImage) return;

  activeImageId = activeImage.id;
  updateImageElement(previewImageEl, activeImage);
  updateImageElement(lightboxImageEl, activeImage);
  syncActiveThumbnailButtons(activeImage.id);
}

function getImageById(imageId) {
  return productImages.find((image) => image.id === imageId);
}

function updateImageElement(imageEl, image) {
  imageEl.src = image.full;
  imageEl.alt = image.alt;
  imageEl.dataset.imageId = image.id;
}

function syncActiveThumbnailButtons(imageId) {
  const thumbnailButtons = document.querySelectorAll(".btn-thumbnail");

  thumbnailButtons.forEach((button) => {
    const isActive = Number(button.dataset.imageId) === imageId;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function showNextImage() {
  setActiveImage(getImageIdByStep(1));
}

function showPreviousImage() {
  setActiveImage(getImageIdByStep(-1));
}

function getImageIdByStep(step) {
  const currentIndex = productImages.findIndex(
    (image) => image.id === activeImageId,
  );

  if (currentIndex === -1) return productImages[0].id;

  // Adding productImages.length before the modulo keeps negative offsets safe.
  const nextIndex =
    (currentIndex + step + productImages.length) % productImages.length;

  return productImages[nextIndex].id;
}

function openLightbox() {
  lastFocusedElement = document.activeElement;
  setActiveImage(activeImageId);
  lightboxEl.setAttribute("role", "dialog");
  lightboxEl.setAttribute("aria-modal", "true");
  lightboxEl.setAttribute("aria-label", "Product image gallery");
  lightboxEl.classList.add("is-open");
  lightboxCloseButtonEl.focus();
}

function closeLightbox() {
  lightboxEl.classList.remove("is-open");
  lightboxEl.removeAttribute("role");
  lightboxEl.removeAttribute("aria-modal");
  lightboxEl.removeAttribute("aria-label");
  lastFocusedElement?.focus();
}

function handleLightboxKeydown(event) {
  if (!isLightboxOpen()) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNextImage();
  if (event.key === "ArrowLeft") showPreviousImage();
  if (event.key === "Tab") trapLightboxFocus(event);
}

function isLightboxOpen() {
  return lightboxEl.classList.contains("is-open");
}

function trapLightboxFocus(event) {
  const focusableEls = lightboxEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];

  if (event.shiftKey && document.activeElement === firstFocusableEl) {
    event.preventDefault();
    lastFocusableEl.focus();
  }

  if (!event.shiftKey && document.activeElement === lastFocusableEl) {
    event.preventDefault();
    firstFocusableEl.focus();
  }
}

function initCart() {
  renderCartContent();
  renderCartCount();

  openCartButtonEl.addEventListener("click", toggleCartPanel);
  addToCartButtonEl.addEventListener("click", handleAddToCart);
  cartContentEl.addEventListener("click", handleCartContentClick);
  document.addEventListener("click", handleOutsideCartClick);
}

function toggleCartPanel() {
  renderCartContent();

  if (cartPanelEl.hidden) {
    openCartPanel();
  } else {
    closeCartPanel();
  }
}

function openCartPanel() {
  cartPanelEl.hidden = false;
  openCartButtonEl.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => {
    cartPanelEl.classList.add("open");
  });
}

function closeCartPanel() {
  if (cartPanelEl.hidden) return;

  cartPanelEl.classList.remove("open");
  openCartButtonEl.setAttribute("aria-expanded", "false");
  cartPanelEl.addEventListener(
    "transitionend",
    () => {
      cartPanelEl.hidden = true;
    },
    { once: true },
  );
}

function handleOutsideCartClick(event) {
  const clickedCartButton = openCartButtonEl.contains(event.target);
  const clickedCartPanel = cartPanelEl.contains(event.target);

  if (cartPanelEl.hidden || clickedCartButton || clickedCartPanel) return;

  closeCartPanel();
}

function updateCartProducts(productId, quantity) {
  const existingProduct = cartProducts.find(
    (product) => product.productId === productId,
  );
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cartProducts.push({ productId, quantity });
  }

  renderCartContent();
  renderCartCount();
}

function renderCartContent() {
  if (cartProducts.length === 0) {
    cartContentEl.classList.add("cart-empty");
    cartContentEl.innerHTML = "Cart is empty...";
    return;
  }

  cartContentEl.classList.remove("cart-empty");
  const cartProductsMarkup = cartProducts
    .map((cartProduct) => createCartProductMarkup(cartProduct))
    .join("");

  cartContentEl.innerHTML = `${cartProductsMarkup}
    <button class="button btn-checkout" type="button">Checkout</button>`;
}

function renderCartCount() {
  const totalQuantity = cartProducts.reduce(
    (total, product) => total + product.quantity,
    0,
  );
  cartCounterEl.textContent = totalQuantity;
  cartCounterEl.hidden = totalQuantity === 0;
  cartStatusEl.textContent =
    totalQuantity === 0
      ? "Cart is empty"
      : `${totalQuantity} item${totalQuantity === 1 ? "" : "s"} in cart`;
  openCartButtonEl.setAttribute(
    "aria-label",
    totalQuantity === 0
      ? "Open cart"
      : `Open cart, ${totalQuantity} item${totalQuantity === 1 ? "" : "s"} in cart`,
  );
}

function createCartProductMarkup(cartProduct) {
  const cartProductDetails = getProductById(cartProduct.productId);
  if (!cartProductDetails) return "";

  const totalPrice = cartProductDetails.price * cartProduct.quantity;

  return `<div class="product-row">
    <img
      class="product-img"
      src="${cartProductDetails.thumbnail}"
      alt="${cartProductDetails.thumbnailAlt}"
    />

    <div class="product-details">
      <p>${cartProductDetails.name}</p>

      <div class="price-details">
        <span class="unit-price">${formatCurrency(cartProductDetails.price)}</span>
        <span>x</span>
        <span class="quantity"><strong>${cartProduct.quantity}</strong></span>
        <span class="total">${formatCurrency(totalPrice)}</span>
      </div>
    </div>

    <button
      class="btn-remove-cart-item"
      type="button"
      data-product-id="${cartProduct.productId}"
      aria-label="Remove item"
    >
      <img src="images/icon-delete.svg" alt="" />
    </button>
  </div>`;
}

function getProductById(productId) {
  return product.id === productId ? product : null;
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function handleAddToCart() {
  const productQuantity = Number(quantityInput.value);
  if (!Number.isFinite(productQuantity) || productQuantity <= 0) return;

  updateCartProducts(product.id, productQuantity);
}

function handleCartContentClick(event) {
  const removeButton = event.target.closest(".btn-remove-cart-item");
  if (!removeButton) return;

  removeCartProduct(Number(removeButton.dataset.productId));
}

function removeCartProduct(productId) {
  const productIndex = cartProducts.findIndex(
    (cartProduct) => cartProduct.productId === productId,
  );

  if (productIndex === -1) return;

  cartProducts.splice(productIndex, 1);
  renderCartContent();
  renderCartCount();
}

function initMobileMenu() {
  openSidebarButtonEl.addEventListener("click", openMobileMenu);
  closeSidebarButtonEl.addEventListener("click", closeMobileMenu);
  sidebarOverlayEl.addEventListener("click", closeMobileMenu);
  document.addEventListener("keydown", handleMobileMenuKeydown);
}

function openMobileMenu() {
  sidebarLinksEl.classList.add("is-open");
  sidebarOverlayEl.classList.add("is-open");
  openSidebarButtonEl.setAttribute("aria-expanded", "true");
  closeSidebarButtonEl.focus();
}

function closeMobileMenu() {
  sidebarLinksEl.classList.remove("is-open");
  sidebarOverlayEl.classList.remove("is-open");
  openSidebarButtonEl.setAttribute("aria-expanded", "false");
  openSidebarButtonEl.focus();
}

function handleMobileMenuKeydown(event) {
  if (event.key === "Escape" && sidebarLinksEl.classList.contains("is-open")) {
    closeMobileMenu();
  }
}
