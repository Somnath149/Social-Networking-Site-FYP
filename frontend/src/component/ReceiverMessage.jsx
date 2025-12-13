import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import FullScreenViewer from "./FullScreenViewer"; 

function ReceiverMessage({ message }) {
  const { selectedUser, messages } = useSelector(state => state.message)
  const scroll = useRef()

  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerMedia, setViewerMedia] = useState(null)
  const [viewerType, setViewerType] = useState("image")

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }, [messages.message, messages.image])

  const openViewer = (media, type) => {
    setViewerMedia(media)
    setViewerType(type)
    setViewerOpen(true)
  }

  return (
    <>
      <div ref={scroll} className='w-fit max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-br-2xl
          rounded-bl-0 px-[10px] py-[10px] relative left-0 flex flex-col gap-[10px]'>

        {message.image && (
          <img
            src={message.image}
            alt=""
            className='h-[200px] object-cover rounded-2xl cursor-pointer'
            onClick={() => openViewer(message.image, "image")}
          />
        )}

        {message?.post && (
          <div className="bg-black/20 rounded-xl overflow-hidden">
            {message.post.media.endsWith(".mp4") ? (
              <video
                src={message.post.media}
                className="w-full max-h-[300px] object-cover rounded-xl cursor-pointer"
                onClick={() => openViewer(message.post.media, "video")}
              ></video>
            ) : (
              <img
                src={message.post.media}
                alt="shared-post"
                className="w-full max-h-[300px] object-cover rounded-xl cursor-pointer"
                onClick={() => openViewer(message.post.media, "image")}
              />
            )}
            {message.post.caption && (
              <p className="p-2 text-white text-[14px]">{message.post.caption}</p>
            )}
          </div>
        )}

        {message?.loop && (
          <div className="bg-black/20 rounded-xl overflow-hidden">
            {message.loop?.media ? (
              message.loop.media.endsWith(".mp4") ? (
                <video
                  src={message.loop.media}
                  className="w-full max-h-[300px] object-cover rounded-xl cursor-pointer"
                  onClick={() => openViewer(message.loop.media, "video")}
                ></video>
              ) : (
                <img
                  src={message.loop.media}
                  alt="shared-loop"
                  className="w-full max-h-[300px] object-cover rounded-xl cursor-pointer"
                  onClick={() => openViewer(message.loop.media, "image")}
                />
              )
            ) : null}
            {message.loop?.caption && (
              <p className="p-2 text-white text-[14px]">{message.loop.caption}</p>
            )}
          </div>
        )}

        {message.message && (
          <div className='text-[18px] text-white wrap-break-word'>
            {message.message}
          </div>
        )}

        <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-40px]'>
          <img src={selectedUser.profileImage} alt="" className='w-full object-cover' />
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
  )
}

export default ReceiverMessage
