import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

function VideoPlayer({ media, active, feed }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef()
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          if (video.paused) {
            video.currentTime = 0
            video.play().catch(() => { });
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
      {feed && !active &&
        <div className='absolute top-[20px] z-[100] right-[20px]' onClick={() => setIsMuted(prev => !prev)}>
          {!isMuted ? <FiVolume2 className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' /> :
            <FiVolumeX className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' />}
        </div>
      }

      <video ref={videoRef}
        src={media}
        playsInline
        muted={!active && isMuted}
        onClick={handleClick}
        loop
        onLoadStart={() => setIsLoading(true)}     
        onLoadedData={() => setIsLoading(false)}    
        onCanPlay={() => setIsLoading(false)}       
        onWaiting={() => setIsLoading(true)}     
        onPlaying={() => setIsLoading(false)}      
        onStalled={() => setIsLoading(true)}
        preload="auto" className='h-[100%] cursor-pointer w-full object-cover rounded-2xl'></video>

        {isLoading && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )


}

export default VideoPlayer
