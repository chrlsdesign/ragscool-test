document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(Flip, ScrollTrigger, TextPlugin, ScrambleTextPlugin);
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis();

  // Listen for the 'scroll' event and log the event data to the console
  lenis.on("scroll", (e) => {});

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.normalizeScroll(true);

  const canvas = document.getElementById("dotsCanvas");
  const ctx = canvas.getContext("2d");

  let mouseX = -Infinity;
  let mouseY = -Infinity;
  let lastMouseX = -Infinity;
  let lastMouseY = -Infinity;
  let lastMoveTime = 0;
  const idleThreshold = 200; // Milliseconds to consider mouse as idle
  const dotSize = 1.5;
  const maxDotSize = 3; // Maximum dot size near cursor
  const hoverRadius = 100;
  const spacing = 32;
  let dots = [];
  let offscreenCanvas, offscreenCtx;

  // Set canvas size to full document width and height
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;

    // Create an offscreen canvas for static dots
    offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx = offscreenCanvas.getContext("2d");

    generateDots();
    drawStaticDots();
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

  // Draw static dots on the offscreen canvas
  function drawStaticDots() {
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.fillStyle = "#cacac3";

    dots.forEach((dot) => {
      offscreenCtx.beginPath();
      offscreenCtx.arc(dot.x, dot.y, dot.originalSize, 0, Math.PI * 2);
      offscreenCtx.fill();
    });
  }

  // Update mouse position with interpolation
  document.addEventListener("mousemove", (event) => {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = event.clientX;
    mouseY = event.clientY + window.scrollY;
    lastMoveTime = Date.now();
  });

  // Reset mouse position on leave
  document.addEventListener("mouseleave", () => {
    mouseX = -Infinity;
    mouseY = -Infinity;
  });

  let lastTime = 0;
  const fps = 60; // Target frames per second
  const frameDuration = 1000 / fps;

  function drawDots() {
    const now = Date.now();
    if (now - lastTime >= frameDuration) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvas, 0, 0); // Draw static dots

      const isIdle = Date.now() - lastMoveTime > idleThreshold;

      ctx.fillStyle = "#cacac3";
      ctx.beginPath();

      dots.forEach((dot) => {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distanceSquared = dx * dx + dy * dy;
        const hoverRadiusSquared = hoverRadius * hoverRadius;

        if (!isIdle && distanceSquared < hoverRadiusSquared) {
          const distance = Math.sqrt(distanceSquared);
          dot.currentSize = dot.originalSize + (hoverRadius - distance) * 1.5;
          dot.currentSize = Math.min(dot.currentSize, maxDotSize);
        } else {
          dot.currentSize = Math.max(dot.currentSize - 0.05, dot.originalSize);
        }

        if (dot.currentSize > dot.originalSize) {
          ctx.moveTo(dot.x + dot.currentSize, dot.y);
          ctx.arc(dot.x, dot.y, dot.currentSize, 0, Math.PI * 2);
        }
      });

      ctx.fill();
      lastTime = now;
    }

    requestAnimationFrame(drawDots);
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  drawDots();

  /* // Select all canvas elements with data-canvas="grid"
  const canvases = document.querySelectorAll('[data-canvas="grid"]');

  // Initialize grid effect on each canvas
  canvases.forEach((canvas, index) => {
    const ctx = canvas.getContext("2d");
    const canvasId = canvas.getAttribute("data-canvas-id");
    const triggerType = canvas.getAttribute("data-trigger"); // "click" or "scroll"
    const itemWidth = parseInt(canvas.getAttribute("data-item-width")) || 50;
    const itemHeight = parseInt(canvas.getAttribute("data-item-height")) || 50;
    const initialVisibility = canvas.hasAttribute("data-visible")
      ? canvas.getAttribute("data-visible") === "true"
      : true;
    let isGridVisible = initialVisibility; // Track visibility for each grid
    const gridItems = [];

    // Synchronize canvas resolution with CSS
    function synchronizeCanvasSize() {
      const style = getComputedStyle(canvas);
      canvas.width = parseFloat(style.width);
      canvas.height = parseFloat(style.height);
    }

    // Generate the grid
    function createGrid() {
      gridItems.length = 0; // Clear existing grid data
      const columns = Math.ceil(canvas.width / itemWidth);
      const rows = Math.ceil(canvas.height / itemHeight);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          gridItems.push({
            x: col * itemWidth,
            y: row * itemHeight,
            opacity: isGridVisible ? 1 : 0, // Initial visibility state
            color: `rgba(33,54,201, 1)`, // Random color
          });
        }
      }
    }

    // Draw the grid
    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      gridItems.forEach((item) => {
        ctx.fillStyle = item.color;
        ctx.globalAlpha = item.opacity;
        ctx.fillRect(item.x, item.y, itemWidth, itemHeight);
      });
    }

    // Animate grid with staggered show/hide
    function toggleGrid() {
      gsap.killTweensOf(gridItems); // Kill ongoing animations

      if (isGridVisible) {
        // Hide animation
        gsap.to(gridItems, {
          opacity: 0,
          duration: 0,
          stagger: {
            amount: 1,
            from: "random",
          },
          onUpdate: drawGrid,
        });
      } else {
        // Show animation
        gsap.to(gridItems, {
          opacity: 1,
          duration: 0,
          stagger: {
            amount: 1,
            from: "random",
          },
          onUpdate: drawGrid,
        });
      }

      isGridVisible = !isGridVisible; // Toggle state
    }

    // Handle window resize
    function handleResize() {
      gsap.killTweensOf(gridItems); // Kill any ongoing animations
      synchronizeCanvasSize(); // Update canvas dimensions
      createGrid(); // Recreate the grid
      drawGrid(); // Redraw the grid
    }

    // Initialize canvas
    synchronizeCanvasSize();
    createGrid();
    drawGrid();

    // Attach behavior based on the trigger type
    if (triggerType === "scroll") {
      isGridVisible = true;
      // Add ScrollTrigger for GSAP
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: canvas,
        start: "top center",
        end: "bottom top",
        onEnter: () => {
          isGridVisible = true; // Ensure the grid starts visible
          toggleGrid(); // Trigger show animation
        },
      });
    }

    // Attach the toggle function to the correct button
    const buttons = document.querySelectorAll(
      `[data-target-canvas="${canvasId}"]`
    );
    buttons.forEach((button) => button.addEventListener("click", toggleGrid));

    // Handle window resize for this canvas
    window.addEventListener("resize", handleResize);
  });*/

  $(".collab_item").hover(
    function () {
      $(this).find(".collab_img").css("display", "block");
      $(this).find(".collab_title").addClass("hover");
      $(this).siblings().css("opacity", ".2");
    },
    function () {
      $(this).find(".collab_img").css("display", "none");
      $(this).find(".collab_title").removeClass("hover");
      $(this).siblings().css("opacity", "1");
    }
  );

  let aboutCardTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper.about",
      start: "bottom bottom",
    },
  });
  gsap.set(".about_holder.card", { yPercent: 100 });

  aboutCardTl.to(".about_holder.card", {
    yPercent: 0,
    stagger: 0.5,
    duration: 0.5,
    onComplete: () => {
      gsap.to(".card.left", {
        rotation: "-5%",
      });
      gsap.to(".card.right", {
        rotation: "5%",
      });
    },
  });

  const $card1 = $(".card.left");
  const $card2 = $(".card.right");
  let topCard = $card1; // Track which card is on top

  // Function to animate the card stack
  function animateCard($hoveredCard, $backCard, direction) {
    // Only animate if the hovered card is NOT the top card
    if (
      $hoveredCard.is(topCard) ||
      gsap.isTweening($hoveredCard) ||
      gsap.isTweening($backCard)
    ) {
      return;
    }

    // Bring the hovered card to the top
    gsap.to($hoveredCard, {
      xPercent: direction === "left" ? -50 : 50,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      ease: "power1.inOut",
      onUpdate: function () {
        const progress = this.progress();
        const zIndex = Math.round(progress * 10);
        setTimeout(function () {
          $hoveredCard.css("z-index", 10 + zIndex);
        }, 400);
      },
      onComplete: function () {
        // Ensure the hovered card is fully on top
        $hoveredCard.css("z-index", 2);
        $backCard.css("z-index", 1);
        // Update the topCard reference
        topCard = $hoveredCard;
      },
    });

    // Animate the back card slightly in the opposite direction
    gsap.to($backCard, {
      xPercent: direction === "left" ? 50 : -50,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      ease: "power1.inOut",
    });
  }

  // Hover events
  $card1.hover(function () {
    animateCard($card1, $card2, "left");
  });

  $card2.hover(function () {
    animateCard($card2, $card1, "right");
  });

  // Target all .collab_title elements
  const collabTitles = $(".collab_title");

  // Create the animation
  gsap.to(collabTitles, {
    duration: 2, // Duration for each animation
    text: {
      value: function (index, target) {
        return target.dataset.finalText || target.textContent; // Scramble to final text
      },
      scramble: true, // Enables scramble effect
    },
    stagger: {
      each: 0.5, // Delay between starting each animation
      overlap: 0.25, // Creates overlap
    },
    ease: "power1.inOut", // Smooth easing
    scrollTrigger: {
      trigger: "#futurecollab", // Start animation when .collab_titles enters viewport
      start: "top center", // Trigger when the top of .collab_titles hits the center of the viewport
      end: "bottom top", // Animation end when bottom leaves the top of the viewport
      toggleActions: "play none none none", // Play animation on scroll
    },
  });

  $("[data-animation-text='scramble']").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(this);

    let oriText = $(this).html();

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        // trigger element - viewport
        start: "top bottom",
      },
    });

    tl.to(targetElement, {
      scrambleText: {
        text: oriText,
        revealDelay: 0.75,
        tweenLength: false,
      },
      duration: 1,
    });
  });
});
