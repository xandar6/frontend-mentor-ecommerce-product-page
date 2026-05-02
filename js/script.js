// Number Counter Button
const customNumInput = document.querySelectorAll(".custom-num-input");
customNumInput.forEach((el) => {
  const numInput = el.querySelector("#quantity");
  const btnMinus = el.querySelector(".btn-minus");
  const btnPlus = el.querySelector(".btn-plus");

  btnMinus.addEventListener("click", () => numInput.stepDown());
  btnPlus.addEventListener("click", () => numInput.stepUp());
});

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

const productImagesEl = document.querySelector(".product-images");
const lightboxThumbnailsEl = document.querySelector(".lightbox-thumbnails");

const lightbox = document.querySelector(".lightbox");

const imagePreviewImg = document.querySelector(".image-preview img");
const lightboxImg = document.querySelector(".lightbox-img");

const imagePreviewBtn = document.querySelector(".btn-image-preview");
const lightboxCloseBtn = document.querySelector(".lightbox-close");
const lightboxPreviousBtn = document.querySelector(
  ".lightbox-control__previous",
);
const lightboxNextBtn = document.querySelector(".lightbox-control__next");

imagePreviewBtn.addEventListener("click", handleImagePreviewBtn);
lightboxCloseBtn.addEventListener("click", handleLightboxCloseBtn);
productImagesEl.addEventListener("click", handleBtnThumbnail);
lightboxThumbnailsEl.addEventListener("click", handleBtnThumbnail);
// lightboxPreviousBtn.addEventListener("click", handleLightboxPrevBtn);
// lightboxNextBtn.addEventListener("click", handleLightboxNextBtn);

populateProductImages();

function populateProductImages() {
  const productImageButtons = productImages
    .map(
      (image) =>
        `<button
          type="button"
          class="btn-thumbnail ${image.id === 1 ? "is-active" : ""}"
          data-preview-src="${image.full}"
          data-preview-alt="${image.alt}"
          data-image-id="${image.id}"
        >
          <img
              src="${image.thumbnail}"
              alt="${image.alt}"
          />
      </button>`,
    )
    .join("");
  productImagesEl.innerHTML = productImageButtons;
  lightboxThumbnailsEl.innerHTML = productImageButtons;
}

function handleBtnThumbnail(e) {
  console.log("#Handling thumbnailBtn...");
  const thumbnailBtn = e.target.closest(".btn-thumbnail");
  if (!thumbnailBtn) return;
  const imageId = Number(thumbnailBtn.dataset.imageId);
  setActiveImage(imageId);

  // const thumbnailBtn = e.target.closest(".btn-thumbnail");
  // if (!thumbnailBtn) return;
  // const previewSrc = thumbnailBtn.dataset.previewSrc;
  // const previewAlt = thumbnailBtn.dataset.previewAlt;
  // if (e.target.closest(".product-images")) {
  //   resetProductThumbnails();
  //   imagePreviewImg.src = previewSrc;
  //   imagePreviewImg.alt = previewAlt;
  // } else if (e.target.closest(".lightbox-thumbnails")) {
  //   resetlightboxThumbnailsEl();
  //   lightboxImg.src = previewSrc;
  //   lightboxImg.alt = previewAlt;
  // }
  // thumbnailBtn.classList.toggle("is-active");
}

function setActiveImage(imageId) {
  const activeImageId = imageId;
  const activeImage = productImages.find(
    (imgObj) => imgObj.id === activeImageId,
  );
  updatePreviewImage(activeImage);
  updateActiveThumbnail(imageId);
}

function updatePreviewImage(activeImage) {
  imagePreviewImg.src = activeImage.full;
  imagePreviewImg.alt = activeImage.thumbnail;
  lightboxImg.src = activeImage.full;
  lightboxImg.alt = activeImage.thumbnail;
}

function updateActiveThumbnail(imageId) {
  resetProductThumbnails();
  resetlightboxThumbnailsEl();
  const productThumbnail = [...getProductThumbnails()].find(
    (el) => Number(el.dataset.imageId) === imageId,
  );
  const lightboxThumbnail = [...getLightboxThumbnails()].find(
    (el) => Number(el.dataset.imageId) === imageId,
  );
  productThumbnail.classList.add("is-active");
  lightboxThumbnail.classList.add("is-active");
}

function showNextImage(imageId) {}

function handleImagePreviewBtn(e) {
  console.log("#Handling imagePreviewBtn...");
  // const matchingThumbnail = [...getLightboxThumbnails()].find(
  //   (el) =>
  //     el.dataset.previewSrc === getActiveProdThumbnail().dataset.previewSrc,
  // );
  // resetlightboxThumbnailsEl();
  // matchingThumbnail.classList.add("is-active");
  // lightboxImg.src = imagePreviewImg.src;
  lightbox.classList.add("is-open");
}

function handleLightboxCloseBtn(e) {
  console.log("Handling lightboxCloseBtn...");
  lightbox.classList.remove("is-open");
}

function resetProductThumbnails() {
  console.log("#Resetting Product Thumbnails...");
  getProductThumbnails().forEach((button) =>
    button.classList.remove("is-active"),
  );
}

function resetlightboxThumbnailsEl() {
  console.log("#Resetting Lightbox Thumbnails...");
  getLightboxThumbnails().forEach((button) =>
    button.classList.remove("is-active"),
  );
}

// function handleLightboxPrevBtn() {
//   console.log("Handling lightboxPrevBtn");
//   let currentIndex = [...getLightboxThumbnails()].findIndex((el) =>
//     el.classList.contains("is-active"),
//   );
//   [...getLightboxThumbnails()][currentIndex].classList.remove("is-active");
//   if (currentIndex === 0) currentIndex = [...getLightboxThumbnails()].length;
//   [...getLightboxThumbnails()][currentIndex - 1].classList.add("is-active");
//   lightboxImg.src = [...getLightboxThumbnails()][
//     currentIndex - 1
//   ].dataset.previewSrc;
// }

// function handleLightboxNextBtn() {
//   console.log("Handling lightboxNextBtn");
//   let currentIndex = [...getLightboxThumbnails()].findIndex((el) =>
//     el.classList.contains("is-active"),
//   );
//   console.log("currIndex", currentIndex);

//   [...getLightboxThumbnails()][currentIndex].classList.remove("is-active");
//   if (currentIndex === [...getLightboxThumbnails()].length - 1)
//     currentIndex = -1;
//   [...getLightboxThumbnails()][currentIndex + 1].classList.add("is-active");
//   lightboxImg.src = [...getLightboxThumbnails()][
//     currentIndex + 1
//   ].dataset.previewSrc;
// }

function getLightboxThumbnails() {
  return lightboxThumbnailsEl.querySelectorAll(".btn-thumbnail");
}
function getProductThumbnails() {
  return productImagesEl.querySelectorAll(".btn-thumbnail");
}

function getActiveProdThumbnail() {
  const productThumbnails = productImagesEl.querySelectorAll(".btn-thumbnail");
  return [...productThumbnails].find((el) =>
    el.classList.contains("is-active"),
  );
}
