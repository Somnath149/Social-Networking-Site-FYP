import React from "react";

export default function Preloader() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <h1 className="relative w-full xl:text-9xl md:text-8xl text-5xl sm:tracking-[17px] tracking-[10px]
       uppercase text-center leading-[0.7em] outline-none glow-text box-reflect">
        Loading...
      </h1>
    </div>
  );
}
