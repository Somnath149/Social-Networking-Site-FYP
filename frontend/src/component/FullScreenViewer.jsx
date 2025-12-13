import React, { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

export default function FullScreenViewer({ media, type, onClose }) {

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[999] select-none transition-all duration-300"
        >
             (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-6 right-6 text-white text-3xl z-[10000] p-2 bg-black/40 rounded-full"
                >
                    <FaTimes size={24} />
                </button>
            )

            <div
                className="w-full max-w-[500px] h-full bg-black/60 flex items-center justify-center"
    
            >
                {type === "image" ? (
                    <img
                        src={media}
                        className="max-w-full max-h-full object-contain"
                       
                    />
                ) : (
                    <video
                        src={media}
                        autoPlay
                        controls
                        className="max-w-full max-h-full object-contain"
                       
                    />

                )}

                
            </div>
        </div>
    );
}
