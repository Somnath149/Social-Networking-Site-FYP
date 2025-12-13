// components/PsyncTitle.jsx
import React from "react";

export default function ThreadTitle({ className = "", width = "100%", height = "40px" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Thread"
    >
      <defs>
        <linearGradient id="psyncGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.2"/>
        </filter>
      </defs>

      <text
        x="40%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="32"
        fill="url(#psyncGradient)"
        filter="url(#dropShadow)"
      >
        Thread
      </text>
    </svg>
  );
}
