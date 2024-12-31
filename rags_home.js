document.addEventListener("DOMContentLoaded", function () {
  // Elements
  let ragsLogo = document.querySelector(".rags_logo.is_h-hero"),
    ragsHolder = document.querySelector(".rags_logo-holder"),
    navLogo = document.querySelector(".nav_logo"),
    flipCtx;

  // Create Flip animation
  const createFlip = () => {
    // Revert the previous Flip context to avoid conflicts
    flipCtx && flipCtx.revert();

    flipCtx = gsap.context(() => {});
  };

  // Initialize Flip animation
  createFlip();

  // Reinitialize on resize
  window.addEventListener("resize", () => {
    flipCtx && flipCtx.revert(); // Clean up existing context
    createFlip(); // Recreate the Flip animations
  });
});
