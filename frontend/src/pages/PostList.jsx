import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Post from "../component/Post";
import LoopCard from "../component/LoopCard";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function PostList({
    disableProfileClick,
    Ssrc,
    activeIndex,
    setActiveIndex
}) {
    const { postData } = useSelector((state) => state.post);
    const { loopData } = useSelector((state) => state.loop);
    const [combinedData, setCombinedData] = useState([]);
    const shuffledOnce = useRef(false);


const touchStartY = useRef(null);
const touchEndY = useRef(null);

const handleTouchStart = (e) => {
  touchStartY.current = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  touchEndY.current = e.touches[0].clientY;
};

const handleTouchEnd = () => {
  if (touchStartY.current === null || touchEndY.current === null) return;

  const diff = touchStartY.current - touchEndY.current;

  if (diff > 50 && activeIndex < combinedData.length - 1) {
    setActiveIndex(prev => prev + 1);
  }

  if (diff < -50 && activeIndex > 0) {
    setActiveIndex(prev => prev - 1);
  }

  touchStartY.current = null;
  touchEndY.current = null;
};

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const activeItem = combinedData[activeIndex];

const activePost =
  activeItem?.contentType === "post"
    ? postData.find(p => p._id === activeItem._id)
    : activeItem;

    useEffect(() => {
        if (shuffledOnce.current) return;

        const combined = [
            ...postData.map(p => ({ ...p, contentType: "post" })),
            ...loopData.map(l => ({ ...l, contentType: "loop" }))
        ];

        setCombinedData(combined.sort(() => 0.5 - Math.random()));
        shuffledOnce.current = true;
    }, [postData.length, loopData.length]);

useEffect(() => {
    setCombinedData(prev =>
        prev.map(item => {
            if (item.contentType === "post") {
    const updatedPost = postData.find(p => p._id === item._id);
    if (!updatedPost) return item;
    return { ...item, ...updatedPost, contentType: "post" }; 
}


            if (item.contentType === "loop") {
    const updatedLoop = loopData.find(l => l._id === item._id);
    if (!updatedLoop) return item;
    return { ...item, ...updatedLoop, contentType: "loop" }; 
}
            return item;
        })
    );
}, [postData, loopData]);

    const renderContent = (item, fullscreen) => {
  if (!item) return null;

  if (item.contentType === "loop") {
    return <LoopCard loop={item} active={fullscreen} />;
  }

  const freshPost = postData.find(p => p._id === item._id);

  return (
    <Post
      post={freshPost || item}
      fullscreen={fullscreen} 
      active={fullscreen}    
      disableProfileClick={disableProfileClick}
      Ssrc={Ssrc}
    />
  );
};



if (isMobile && activeIndex !== null) {
  const item = combinedData[activeIndex];

  return (
    <div
      className="fixed inset-0 w-full h-screen bg-black z-[999]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
  
      <div className="absolute top-0 left-0 w-full p-5 flex items-center gap-4 z-[1001]
                      bg-gradient-to-b from-black/60 to-transparent">
        <MdOutlineKeyboardBackspace
          onClick={() => setActiveIndex(null)}
          className="text-white w-8 h-8 cursor-pointer active:scale-90"
        />
        <span className="text-white font-bold text-lg">
          {item?.contentType === "loop" ? "Loops" : "Explore"}
        </span>
      </div>

      <div className="w-full h-full  flex items-center overflow-y-auto justify-center">
        {renderContent(item, true)}
      </div>


      <div className="absolute bottom-0 left-0 w-full h-32
                      bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}

   
    return (
        <div className="w-full z-99">
           <div className="columns-2 sm:columns-3 gap-2">
                {combinedData.map((item, index) => (
                    <div
                        key={item._id}
                        onClick={() => setActiveIndex(index)}
                        className="mb-2 break-inside-avoid cursor-pointer"
                    >
                        {!item.contentType === "loop" ? (
                          
                           <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden relative group">
    <img
        src={item.thumbnail || item.coverImage}
        alt=""
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">

            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white
             border-b-[8px] border-b-transparent ml-1" />
        </div>
    </div>
</div>
                        ) : (
                            <Post post={item} ExploreTailwind />
                        )}
                    </div>
                ))}
            </div>

            {activeIndex !== null && !isMobile && (
<div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[111] pointer-events-auto">
                    <button
                        onClick={() => setActiveIndex(null)}
                        className="absolute top-5 right-5 text-white text-3xl"
                    >
                        <FaTimes />
                    </button>

                    {activeIndex > 0 && (
                        <button
                            onClick={() => setActiveIndex(p => p - 1)}
                            className="absolute left-5 text-white"
                        >
                            <FiChevronLeft size={40} />
                        </button>
                    )}

                  <div className="max-h-[90vh] overflow-y-auto pointer-events-auto" key={activePost._id}>
  {renderContent(activePost, activeIndex, true)}
</div>

                    {activeIndex < combinedData.length - 1 && (
                        <button
                            onClick={() => setActiveIndex(p => p + 1)}
                            className="absolute right-5 text-white"
                        >
                            <FiChevronRight size={40} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostList;