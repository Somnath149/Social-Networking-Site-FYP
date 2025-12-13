import { useEffect, useRef } from "react";

export default function AdvancedCursor() {
  const cursor = useRef(null);
  const follower = useRef(null);

  useEffect(() => {
    const c = cursor.current;
    const f = follower.current;

    let x = 0, y = 0;
    let fx = 0, fy = 0;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;

      c.style.transform = `translate(${x}px, ${y}px)`;

      checkHover(x, y);
      applyMagnetic(x, y);
    };

    const animate = () => {
      fx += (x - fx) * 0.18; // faster
fy += (y - fy) * 0.18;

      f.style.transform = `translate(${fx}px, ${fy}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ---------- HOVER DETECT ----------
  const checkHover = (mouseX, mouseY) => {
    const hoverEls = document.querySelectorAll(".cursor-dot1");

    let isHovering = false;

    hoverEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (
        mouseX > rect.left &&
        mouseX < rect.right &&
        mouseY > rect.top &&
        mouseY < rect.bottom
      ) {
        isHovering = true;
      }
    });

    if (isHovering) {
      cursor.current.classList.add("cursor-hover-active");
      follower.current.classList.add("cursor-hover-active-follower");
    } else {
      cursor.current.classList.remove("cursor-hover-active");
      follower.current.classList.remove("cursor-hover-active-follower");
    }
  };

  // ---------- MAGNETIC PULL ----------
  const applyMagnetic = (mouseX, mouseY) => {
    const magneticEls = document.querySelectorAll("[data-magnetic]");

    magneticEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.hypot(dx, dy);

      const threshold = 150;     // distance in px
      const maxMove = 18;        // px movement

      if (dist < threshold) {
        const pull = (1 - dist / threshold) * maxMove;

        const tx = (-dx / dist) * pull;
        const ty = (-dy / dist) * pull;

        el.style.transform = `translate(${tx}px, ${ty}px)`;
        el.style.transition = "transform 0.15s ease-out";

        // cursor expand
        cursor.current.style.scale = 1.3;
        follower.current.style.scale = 1.15;
      } else {
        el.style.transform = "";
        cursor.current.style.scale = 1;
        follower.current.style.scale = 1;
      }
    });
  };

  return (
    <>
       <div ref={cursor} className="cursor-dot "></div>
      <div ref={follower} className="cursor-follower border-[var(--primary)] bg-[var(--cursor)]"></div>
    </>
  );
}
