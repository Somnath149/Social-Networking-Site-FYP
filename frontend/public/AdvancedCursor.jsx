import { useEffect, useRef, useState } from "react";

export default function AdvancedCursor() {
  const cursor = useRef(null);
  const follower = useRef(null);
  const [label, setLabel] = useState(""); // Hover par text dikhane ke liye

  useEffect(() => {
    const c = cursor.current;
    const f = follower.current;

    let x = 0, y = 0;   // Mouse position
    let cx = 0, cy = 0; // Dot position
    let fx = 0, fy = 0; // Follower position

    const move = (e) => {
  x = e.clientX;
  y = e.clientY;

  const target = e.target;
  // Yeh line check karegi ki kya wo element .cursor-dot1 hai, ya koi link hai, ya button hai
  const hoverEl = target.closest(".cursor-dot1, a, button"); 

  if (hoverEl) {
    f.classList.add("is-active");
    // Text dikhane ke liye element par data-cursor-text="Read" likh sakte hain
    setLabel(hoverEl.getAttribute("data-cursor-text") || "");
  } else {
    f.classList.remove("is-active");
    setLabel("");
  }
};

    const animate = () => {
      // Dot speed
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      // Follower speed
      fx += (x - fx) * 0.12;
      fy += (y - fy) * 0.12;

      c.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      f.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", move);
    
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div className="hidden lg:block">
        {/* Main Dot */}
        <div ref={cursor} className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full z-[1111] pointer-events-none mix-blend-difference" />
        
        {/* Large Follower */}
        <div 
          ref={follower} 
          className="fixed top-0 left-0 w-7 h-7 border border-white/30 rounded-full z-[1111] pointer-events-none transition-[width,height,background-color] duration-300 flex items-center justify-center overflow-hidden"
          style={{ mixBlendMode: 'difference' }}
        >
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-white animate-fade-in">
              {label}
            </span>
          )}
        </div>
      </div>

      <style jsx global>{`
        body { cursor: none !important; }
        a, button { cursor: none !important; }
        
        /* Hover State Classes */
        .is-active {
          width: 40px !important;
          height: 40px !important;
          background-color: white !important;
          border-color: white !important;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}