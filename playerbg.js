const canvas = document.getElementById("playerbg");
const ctx = canvas.getContext("2d");
const container = document.querySelector(".canvas-container");

// Read values from canvas attributes, with fallback defaults if not specified
const circleRadius = parseFloat(canvas.getAttribute("data-circle-radius")) || 5;
const circleMargin =
  parseFloat(canvas.getAttribute("data-circle-margin")) || 10;
const rows = parseInt(canvas.getAttribute("data-rows")) || 5;
const emptyProbability =
  parseFloat(canvas.getAttribute("data-empty-probability")) || 0.3;
const fillColor = canvas.getAttribute("data-fill-color") || "#FFF";

function resizeCanvas() {
  // Set canvas resolution to match the container’s size
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  // Redraw the grid after resizing
  drawGrid();
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fillColor;

  const columns = Math.floor(canvas.width / (circleRadius * 2 + circleMargin));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (Math.random() < emptyProbability) continue;

      const x = col * (circleRadius * 2 + circleMargin) + circleRadius;
      const y = row * (circleRadius * 2 + circleMargin) + circleRadius;

      ctx.beginPath();
      ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Initial setup
resizeCanvas();

// Redraw grid on window resize
window.addEventListener("resize", resizeCanvas);
