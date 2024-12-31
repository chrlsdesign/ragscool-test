/**
 * Without Trail effect
 */
const canvas = document.getElementById("dotsCanvas");
const ctx = canvas.getContext("2d");

let mouseX = -Infinity;
let mouseY = -Infinity;
const dotSize = 1.5;
const hoverRadius = 150;
const spacing = 24;
let dots = [];

// Set canvas size to full document width and height
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
  generateDots();
}

// Generate dots based on the canvas size
function generateDots() {
  dots = [];
  for (let y = spacing / 2; y < canvas.height; y += spacing) {
    for (let x = spacing / 2; x < canvas.width; x += spacing) {
      dots.push({ x, y, originalSize: dotSize, currentSize: dotSize });
    }
  }
}

// Update mouse position
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY + window.scrollY; // Account for page scroll
});

// Reset dot sizes on mouse leave
document.addEventListener("mouseleave", () => {
  mouseX = -Infinity; // Move cursor out of bounds
  mouseY = -Infinity;
});

// Draw dots with hover effect
function drawDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach((dot) => {
    const distance = Math.hypot(dot.x - mouseX, dot.y - mouseY);
    if (distance < hoverRadius) {
      dot.currentSize = dot.originalSize + (hoverRadius - distance) * 0.02;
    } else {
      dot.currentSize = dot.originalSize;
    }

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.currentSize, 0, Math.PI * 2);
    ctx.fillStyle = "#a0a0a0";
    ctx.fill();
  });

  requestAnimationFrame(drawDots);
}

// Resize and regenerate dots on window resize
window.addEventListener("resize", resizeCanvas);

// Initialize
resizeCanvas();
drawDots();
