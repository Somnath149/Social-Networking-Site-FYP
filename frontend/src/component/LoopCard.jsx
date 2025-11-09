import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2 } from 'react-icons/fi'
import { FiVolumeX } from 'react-icons/fi'
import dp from "../assets/dp.png"
import FollowButton from './FollowButton'
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaBookmark, FaRegPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setLoopData } from '../redux/loopSlice'
import axios from 'axios'
function LoopCard({ loop }) {
  const videoRef = useRef()
const dispatch = useDispatch()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [message, setMessage] = useState("")
  const [progress, setProgress] = useState(0)
  const { userData } = useSelector(state => state.user)
  const { loopData } = useSelector(state => state.loop)
  const HandleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }
  }

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (entry.isIntersecting) {
        video.play()
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }, { threshold: 0.6 })
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

 const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, { withCredentials: true })
            const updatedLoop = result.data

            const updatedLoops = loopData.map(p =>
                p._id === loop._id ? updatedLoop : p
            )

            dispatch(setLoopData(updatedLoops))
        } catch (error) {
            console.error("Like failed:", error)
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`, { message }, { withCredentials: true })
            const updatedLoop = result.data

            const updatedLoops = loopData.map(p =>
                p._id === loop._id ? updatedLoop : p
            )

            dispatch(setLoopData(updatedLoops))
        } catch (error) {
            console.error("Comment failed:", error)
        }
    }

  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative'>
      <video ref={videoRef} autoPlay muted={isMuted} loop src={loop?.media} className='w-full max-h-full'
        onClick={handleClick} onTimeUpdate={HandleTimeUpdate}></video>

      <div className='absolute top-[20px] z-[100] right-[20px]' onClick={() => setIsMuted(prev => !prev)}>
        {!isMuted ? <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold' /> : <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold' />}
      </div>

      <div className='absolute bottom-0 w-full h-[3px] bg-gray-900'>
        <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>

        </div>
      </div>

      <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]'>
        <div className='flex items-center gap-4'>
          <div className='w-[30px] h-[30px] md:w-10 md:h-10 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
            <img src={loop.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
          </div>
          <div className='font-semibold truncate text-white max-w-[120px] md:max-w-[150px]'>
            {loop?.author?.userName}
          </div>

          <FollowButton targetUserId={loop.author?._id}
            tailwind={"px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"} />
        </div>
        <div className='text-white p-[10px]'>
          {loop.caption}
        </div>

        <div className='absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center p-[10px]'>
          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={handleLike}>
              {!loop.likes.includes(userData._id) && <FaRegHeart className="w-[25px] cursor-pointer h-[25px]" />}
              {loop.likes.includes(userData._id) && <FaHeart className="w-[25px] cursor-pointer h-[25px] text-red-600" />}</div>
            <div>{loop.likes.length}</div>
          </div>

          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={handleComment}><FaRegComment className="w-[25px] cursor-pointer h-[25px]" />
            </div>
            <div>
              <span>{loop.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoopCard
