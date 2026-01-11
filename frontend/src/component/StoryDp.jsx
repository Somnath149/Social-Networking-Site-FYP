import React from 'react'
import dp1 from "../assets/dp1.jpeg"
import { FiPlusCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setStoryData } from '../redux/storySlice'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

function StoryDp({ profileImage, userName, story }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const { storyData, storyList } = useSelector(state => state.story)
    const [viewed, setViewed] = useState(false)

    useEffect(() => {
      if(story?.viewers?.some((viewer)=> 
        viewer?._id?.toString() === userData._id.toString() || viewer?.toString() == userData._id.toString()
    )){
        setViewed(true)
    }else{
        setViewed(false)
    }
    }, [story,userData,storyData,storyList])
    

    const handleViewers = async () => {
        dispatch(setStoryData(null))
        try {
            const result = await axios.get(`${serverUrl}/api/story/view/${story._id}`, { withCredentials: true })
            dispatch(setStoryData(result.data));
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = () => {
        if (!story && userName == "Your Story") {
            navigate("/upload")
        }
        else if (story && userName == "Your Story") {
            handleViewers()
            navigate(`/story/${userData?.userName}`)

        } else {
            handleViewers()
            navigate(`/story/${userName}`)

        }
    }
    return (
        <div className='flex flex-col w-[80px]'>
            <div className={`w-[80px] h-[80px] cursor-dot1
            ${!story?null:!viewed? "bg-gradient-to-b from-blue-500 to-blue-950" : "bg-gradient-to-b from-gray-500 to-black-800"}
              rounded-full flex justify-center items-center relative`} onClick={handleClick}>
                <div className='w-[70px] h-[70px] border-1 border-[var(--primary)] rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileImage || dp1} alt="" className='w-full object-cover' />
                    {!story && userName == "Your Story" && <div>
                        <FiPlusCircle className='text-[var(--text)] absolute bottom-[8px]
                         bg-[var(--primary)] right-[10px] rounded-full w-[22px] h-[22px]' />

                    </div>}

                </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-[var(--text)]'>{userName}</div>
        </div>
    )

}

export default StoryDp
