console.clear();
gsap.registerPlugin(ScrollTrigger, Flip);

let ball = document.querySelector(".ball"),
  parentSection = document.querySelector(".section.first"),
  content = document.querySelector(".content"),
  flipCtx;

const createTween = () => {
  flipCtx && flipCtx.revert();

  flipCtx = gsap.context(() => {
    let state = Flip.getState(ball); // grab the state so we can record where the ball is
    content.appendChild(ball); // reparent
    Flip.fit(ball, state); // apply transforms to fit the ball visually where it was previously when we captured the state

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: parentSection,
          start: "bottom 85%",
          end: "bottom 25%",
          scrub: 1,
          immediateRender: false,
        },
      })
      .to(ball, { y: 0, ease: "none" });
    return () => {
      // when the context reverts, return the ball to the original parentSection and clear the inline styles
      parentSection.appendChild(ball);
      gsap.set(ball, { clearProps: "all" });
    };
  });
};

createTween();

window.addEventListener("resize", createTween);
