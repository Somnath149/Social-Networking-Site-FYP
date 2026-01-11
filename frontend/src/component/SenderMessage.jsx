import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FullScreenViewer from "./FullScreenViewer";

function SenderMessage({ message }) {
  const { userData } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);
  const scroll = useRef();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMedia, setViewerMedia] = useState(null);
  const [viewerType, setViewerType] = useState("image");

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.message, messages.image]);

  const openViewer = (media, type) => {
    setViewerMedia(media);
    setViewerType(type);
    setViewerOpen(true);
  };

  return (
    <>
      <div
        ref={scroll}
        className="w-fit max-w-[60%] bg-gradient-to-br from-[#9500ff] to-[#ff0095] rounded-t-2xl rounded-bl-2xl rounded-br-0 px-[10px] py-[10px] relative ml-auto flex flex-col gap-[10px]"
      >

        {message.image && (
          <img
            src={message.image}
            onClick={() => openViewer(message.image, "image")}
            alt=""
            className="h-[200px] object-cover rounded-2xl cursor-pointer"
          />
        )}

       {message?.post && (
  <div className="w-full max-w-[320px] bg-black/30 rounded-2xl overflow-hidden border border-white/10">
    
    <div className="relative w-full aspect-[4/5] bg-black">
      {message.post.media.endsWith(".mp4") ? (
        <video
          src={message.post.media}
          onClick={() => openViewer(message.post.media, "video")}
          className="w-full h-full object-cover cursor-pointer"
        />
      ) : (
        <img
          src={message.post.media}
          onClick={() => openViewer(message.post.media, "image")}
          className="w-full h-full object-cover cursor-pointer"
          alt="shared-post"
        />
      )}
    </div>

    {message.post.caption && (
      <div className="p-3">
        <p className="text-white text-sm leading-snug line-clamp-3">
          {message.post.caption}
        </p>
      </div>
    )}
  </div>
)}


        {message?.loop && (
          <div className="bg-black/20 rounded-xl overflow-hidden">
            {message.loop?.media?.endsWith(".mp4") ? (
              <video
                src={message.loop.media}
                onClick={() => openViewer(message.loop.media, "video")}
                className="w-full max-w-[300px] max-h-[300px] object-cover rounded-xl cursor-pointer"
              ></video>
            ) : (
              <img
                src={message.loop.media}
                onClick={() => openViewer(message.loop.media, "image")}
                className="w-full max-w-[300px] max-h-[300px] object-cover rounded-xl cursor-pointer"
                alt="shared-loop"
              />
            )}

            {message.loop.caption && (
              <p className="p-2 text-white text-[14px]">
                {message.loop.caption}
              </p>
            )}
          </div>
        )}

        {message.message && (
          <div className="text-[18px] text-white wrap-break-word">
            {message.message}
          </div>
        )}

        <div className="w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-25px] bottom-[-40px]">
          <img src={userData.profileImage} alt="" className="w-full object-cover" />
        </div>
      </div>

      {viewerOpen && (
        <FullScreenViewer
          media={viewerMedia}
          type={viewerType}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

export default SenderMessage;
