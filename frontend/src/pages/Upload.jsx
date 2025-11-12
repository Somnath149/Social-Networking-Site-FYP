import React, { useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaPlusSquare, FaFilm } from 'react-icons/fa'
import { useRef } from 'react'
import { button, div } from 'framer-motion/client'
import VideoPlayer from '../component/VideoPlayer'
import { serverUrl } from '../App'
import axios from 'axios'
import { setPostData } from '../redux/postSlice'
import { setCurrentUserStory, setStoryData } from '../redux/storySlice'
import { setLoopData } from '../redux/loopSlice'
import { setUserData } from '../redux/userSlice'

function Upload() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { postData } = useSelector(state => state.post)
    const { storyData } = useSelector(state => state.story)
    const { loopData } = useSelector(state => state.loop)
    const { userData } = useSelector(state => state.user)
    const [uploadType, setUploadType] = useState("post")
    const [frontendMedia, setFrontendMedia] = useState("")
    const [backendMedia, setBackendMedia] = useState("")
    const [mediaType, setMediaType] = useState("")
    const [caption, setCaption] = useState("")
    const mediaInput = useRef()

    const handleMedia = (e) => {
        const file = e.target.files[0]
        if (file.type.includes("image")) {
            setMediaType("image")
        } else {
            setMediaType("video")
        }
        setBackendMedia(file)
        setFrontendMedia(URL.createObjectURL(file))
    }

    const uploadPost = async () => {
        try {
            const formData = new FormData()
            formData.append("caption", caption)
            formData.append("mediaType", mediaType)
            formData.append("media", backendMedia)
            const result = await axios.post(`${serverUrl}/api/post/upload`, formData, { withCredentials: true })
            console.log(result)
            const newPost = result.data.post; // adjust based on your backend response shape
            // Option 1: Replace the entire postData with the latest data (no duplicates)
            dispatch(setPostData([newPost]));
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const uploadStory = async () => {
        try {
            const formData = new FormData()
            formData.append("mediaType", mediaType)
            formData.append("media", backendMedia)
            const result = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true })
            dispatch(setCurrentUserStory(result.data))
            console.log(result)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const uploadReel = async () => {
        try {
            const formData = new FormData()
            formData.append("caption", caption)
            formData.append("media", backendMedia)
            const result = await axios.post(`${serverUrl}/api/loop/upload`, formData, { withCredentials: true })
            console.log(result)
            dispatch(setLoopData([...loopData, result.formData]))
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpload = async () => {
        if (uploadType == "post") {
            uploadPost()
        }
        else if (uploadType == "story") {
            uploadStory()
        }
        else {
            uploadReel()
        }
    }

    return (
        <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
            <div className='w-full h-[80px] flex fixed left-[20px] items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                    className='text-white cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-white text-[20px] font-semibold'>Upload</h1>
            </div>

            <div className='w-[90%] max-w-[600px] h-[80px] mt-4 bg-[white] rounded-full flex justify-around items-center gap-[10px]'>

                <div className={`${uploadType == "post" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full
                 hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setUploadType("post")}>Post</div>

                <div className={`${uploadType == "story" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full
                 hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setUploadType("story")}>Story</div>

                <div className={`${uploadType == "reel" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full
                 hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setUploadType("reel")}>Reel</div>
            </div>

            {!frontendMedia && <div className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col
            items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]'
                onClick={() => mediaInput.current.click()}>
                <input type="file" accept={uploadType == "loop"? "video/*" : ""} hidden ref={mediaInput} onChange={handleMedia} />
                <div><FaPlusSquare className='text-[white] w-[25px] h-[25px] cursor-pointer' onClick={() => navigate(`/upload`)} /></div>
                <div className='text-white text-[19px] font-semibold'>Upload {uploadType}</div>
            </div>}

            {frontendMedia &&
                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
                    {mediaType == "image" && <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                        <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl' />
                        {uploadType != "story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
                            placeholder='write caption' onChange={(e) => setCaption(e.target.value)} value={caption} />}
                    </div>}

                    {mediaType == "video" && <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                        <VideoPlayer media={frontendMedia} />
                        {uploadType != "story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
                            placeholder='write caption' onChange={(e) => setCaption(e.target.value)} value={caption} />}
                    </div>}
                </div>
            }

            {frontendMedia &&
                <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white] mt-[50px] cursor-pointer
                rounded-2xl' onClick={handleUpload}>Upload {uploadType}</button>
            }

        </div>
    )
}

export default Upload
