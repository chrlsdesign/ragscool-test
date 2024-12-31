// Select all images with data-img="reveal-grid"
const images = document.querySelectorAll('[data-img="reveal-grid"]');

// Initialize grid mask effect for each image
images.forEach((image) => {
  const container = document.createElement("div");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const style = getComputedStyle(image);

  // Set up the container
  container.style.position = "relative";
  container.style.width = style.width;
  container.style.height = style.height;
  container.style.overflow = "hidden";

  // Configure canvas
  canvas.width = parseFloat(style.width);
  canvas.height = parseFloat(style.height);
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "2";

  // Configure image
  image.style.position = "absolute";
  image.style.top = "0";
  image.style.left = "0";
  image.style.width = "100%";
  image.style.height = "100%";
  image.style.objectFit = "cover";
  image.style.zIndex = "1";

  // Replace image with the container
  image.parentNode.insertBefore(container, image);
  container.appendChild(canvas);
  container.appendChild(image);

  // Grid properties
  const itemWidth = parseInt(image.getAttribute("data-item-width")) || 50;
  const itemHeight = parseInt(image.getAttribute("data-item-height")) || 50;
  const gridItems = [];

  // Generate the grid
  function createGrid() {
    gridItems.length = 0;
    const cols = Math.ceil(canvas.width / itemWidth);
    const rows = Math.ceil(canvas.height / itemHeight);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        gridItems.push({
          x: col * itemWidth,
          y: row * itemHeight,
          width: itemWidth,
          height: itemHeight,
          opacity: 0, // Start fully masked
        });
      }
    }
  }

  // Draw the grid mask
  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gridItems.forEach((item) => {
      ctx.globalAlpha = 1 - item.opacity; // Invert opacity for masking effect
      ctx.fillStyle = "#f0f0e6"; // Black mask
      ctx.fillRect(item.x, item.y, item.width, item.height);
    });
  }

  // Initialize the grid
  createGrid();
  drawGrid();

  // Use ScrollTrigger for reveal animation
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(gridItems, {
    opacity: 1,
    duration: 0.1, // Reveal the grid cells
    stagger: {
      each: ".015", // Spread the animation over time
      from: "random", // Animate in random order
    },
    onUpdate: drawGrid, // Redraw the grid on updates
    scrollTrigger: {
      trigger: container,
      start: "20% bottom", // Start when the container is in the viewport
    },
  });
});
