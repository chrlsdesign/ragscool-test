document.addEventListener("DOMContentLoaded", function () {
  // Attach custom logic to quantity controls
  document
    .querySelectorAll(".w-commerce-commerceaddtocartform")
    .forEach((form) => {
      const quantityInput = form.querySelector(
        ".w-commerce-commerceaddtocartquantityinput"
      );
      const decreaseButton = form.querySelector(".is--decrease");
      const increaseButton = form.querySelector(".is--increase");

      // Decrease quantity
      decreaseButton.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });

      // Increase quantity
      increaseButton.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentValue + 1;
      });
    });
});
