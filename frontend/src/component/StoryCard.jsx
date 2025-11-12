import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.png"
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import { FaEye } from 'react-icons/fa6'
import { div } from 'framer-motion/client'
function StoryCard({ storyData }) {

    const [showViewers, setShowViewers] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [progress, setProgress] = useState(0)
    const { userData } = useSelector(state => state.user)
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    navigate("/")
                    return 100
                }
                return prev + 1
            })
        }, 150);

        return () => clearInterval(interval)
    }, [navigate])


    return (
        <div className='w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center'>

            <div className='flex items-center gap-[10px] absolute top-[30px] px-[10px]'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                    className='text-white cursor-pointer w-[25px] h-[25px]' />
                <div className='w-[20px] h-[20px] md:w-[40px] md:h-[40px] border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                    <img src={storyData?.author?.profileImage || dp} alt="" className='w-full h-full object-cover shrink-0' />
                </div>
                <div className='font-semibold truncate text-white max-w-[120px] md:max-w-[150px]'>
                    {storyData?.author?.userName}
                </div>
            </div>

            {!showViewers && <>

                <div className="w-full h-[90vh] flex items-center justify-center">
                    {storyData?.mediaType == "image" && (
                        <div className="w-full  flex items-center justify-center">
                            <img
                                src={storyData.media}
                                alt=""
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                    )}

                    {storyData?.mediaType == "video" && (
                        <div className="w-full max-w-[500px] flex items-center justify-center">
                            <VideoPlayer media={storyData.media} />
                        </div>
                    )}
                </div>

                <div className='absolute top-[10px] w-full h-[3px] bg-gray-900'>
                    <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>

                    </div>
                </div>
                {storyData?.author?.userName == userData?.userName && 
                <div className='absolute flex items-center gap-[10px] w-full cursor-pointer text-white h-[70px] bottom-0 p-2 left-0'
                 onClick={()=>setShowViewers(true)}>
                    <div className='text-white flex items-center gap-[5px]'> <FaEye /> {storyData?.viewers?.length || 0}</div>
                    <div className='flex relative'>

                        {
                            storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                                <div className={`w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden
                                   ${index > 0 ? `absolute left-[${index * 9}px]` : ""}`}>
                                    <img src={viewer?.profileImage || dp1} alt="" className='w-full object-cover' />
                                </div>
                            ))
                        }
                    </div>
                </div>}
            </>}

            {showViewers && <>  <div className="w-[full] h-[30%] flex items-center justify-center mt-[100px] py-[30px] cursor-pointer overflow-hidden"
            onClick={()=>setShowViewers(false)}>
                {storyData?.mediaType == "image" && (
                    <div className="h-[full] flex items-center justify-center">
                        <img
                            src={storyData?.media}
                            alt=""
                            className="h-full object-cover rounded-2xl"
                        />
                    </div>
                )}

                {storyData?.mediaType == "video" &&
                    <div className="h-full max-w-[500px] flex items-center justify-center">
                        <VideoPlayer media={storyData.media} />
                    </div>
                }
            </div>

                <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]'>
                    <div className='text-white flex items-center gap-[10px]'> <FaEye /> {storyData?.viewers?.length || 0} <span>Viewers</span></div>
                    <div className='w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]'>
                        {storyData?.viewers?.map((viewer, index) => {
                            <div className='w-full flex items-center gap-[20px]'>
                                <div className='w-[20px] h-[20px] md:w-[40px] md:h-[40px] border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                                    <img src={viewer?.profileImage || dp} alt="" className='w-full h-full object-cover shrink-0' />
                                </div>
                                <div className='font-semibold truncate text-white max-w-[120px] md:max-w-[150px]'>
                                    {viewer?.userName}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </>}


        </div>
    )
}

export default StoryCard
