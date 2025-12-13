import { motion } from "framer-motion";
import { useState } from "react";

const letters = ["P", "s", "y", "n", "c"];

export default function PsyIncLogo({ navigate }) {
  const [colors, setColors] = useState(
    letters.map(() => "text-gray-400")
  );

  const randomColor = () => {
    const colors = [
      "text-red-500", "text-blue-500", "text-green-500",
      "text-yellow-500", "text-purple-500", "text-pink-500",
      "text-orange-500", "text-teal-500"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleHoverStart = (index) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? randomColor() : c))
    );
  };

  const handleHoverEnd = (index) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? "text-gray-400 transition-colors duration-700" : c))
    );
  };

  return (
    <div
      
      className="text-[40px] font-bold flex gap-1 cursor-pointer"
    >
      {letters.map((char, i) => (
        <motion.span 
          key={i}
          onHoverStart={() => handleHoverStart(i)}
          onHoverEnd={() => handleHoverEnd(i)}
          whileHover={{
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.4 }
          }}
          className={`${colors[i]} inline-block `}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
