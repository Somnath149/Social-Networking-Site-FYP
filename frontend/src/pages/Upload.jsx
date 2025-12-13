import React, { useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaPlusSquare, FaFilm } from 'react-icons/fa'
import { useRef } from 'react'
import VideoPlayer from '../component/VideoPlayer'
import { serverUrl } from '../App'
import axios from 'axios'
import { setPostData } from '../redux/postSlice'
import { setCurrentUserStory, setStoryData } from '../redux/storySlice'
import { setLoopData } from '../redux/loopSlice'


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
    const [isUploading, setIsUploading] = useState(false)
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
            setIsUploading(true)
            const formData = new FormData()
            formData.append("caption", caption)
            formData.append("mediaType", mediaType)
            formData.append("media", backendMedia)
            const result = await axios.post(`${serverUrl}/api/post/upload`, formData, { withCredentials: true })
            const newPost = result.data;
            dispatch(setPostData([newPost, ...postData]));
            navigate("/")
        } catch (error) {
            console.log(error)
        } finally {
            setIsUploading(false)
        }
    }

    const uploadStory = async () => {
        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append("mediaType", mediaType)
            formData.append("media", backendMedia)
            const result = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true })
            dispatch(setCurrentUserStory(result.data))
            navigate("/")
        } catch (error) {
            console.log(error)
        } finally {
            setIsUploading(false)
        }
    }

    const uploadReel = async () => {
        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append("caption", caption)
            formData.append("media", backendMedia)
            const result = await axios.post(`${serverUrl}/api/loop/upload`, formData, { withCredentials: true })
            const newReel = result.data;
            dispatch(setLoopData([newReel, ...loopData]));
            navigate("/")
        } catch (error) {
            console.log(error)
        } finally {
            setIsUploading(false)
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
        <div className='w-full h-screen bg-[var(--bg)] flex flex-col items-center'>
            <div className='w-full h-20 flex fixed left-5 items-center gap-5 px-5'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(-1)}
                    className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-[var(--text)] text-[20px] font-semibold'>Upload</h1>
            </div>

            <div className='w-[90%] max-w-[600px] h-20  mt-[100px] bg-[white] rounded-full flex justify-around items-center gap-2.5'>

                <div className={`${uploadType == "post" ? "bg-[var(--bg)] text-[var(--text)] shadow-2xl shadow-black" : ""} w-[28%] h-[80%]
                 flex justify-center items-center text-[19px] font-semibold hover:bg-[var(--bg)] rounded-full
                 hover:text-[var(--text)] cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => {
                        setFrontendMedia(null)
                        setUploadType("post")
                    }}>Post</div>

                <div className={`${uploadType == "story" ? "bg-[var(--bg)] text-[var(--text)] shadow-2xl shadow-black" : ""} w-[28%] h-[80%]
                 flex justify-center items-center text-[19px] font-semibold hover:bg-[var(--bg)] rounded-full
                 hover:text-[var(--text)] cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => {
                        setFrontendMedia(null)
                        setUploadType("story")
                    }}>Story</div>

                <div className={`${uploadType == "reel" ? "bg-[var(--bg)] text-[var(--text)] shadow-2xl shadow-black" : ""} w-[28%] h-[80%]
                 flex justify-center items-center text-[19px] font-semibold hover:bg-[var(--bg)] rounded-full
                 hover:text-[var(--text)] cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => {
                        setFrontendMedia(null)
                        setUploadType("reel")
                    }}>Reel</div>
            </div>

            {!frontendMedia && <div className='w-[80%] max-w-[500px] h-[250px] bg-[var(--primary)] border-[var(--primary)] border-2 flex flex-col
            items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[var(--secondary)]'
                onClick={() => mediaInput.current.click()}>
                <input type="file" accept={`${uploadType == "reel" ? "video/*" : "image/*, video/* "}`}
                    hidden ref={mediaInput} onChange={handleMedia} />


                <div><FaPlusSquare className='text-[white] w-[25px] h-[25px] cursor-pointer' onClick={() => navigate(`/upload`)} /></div>
                <div className='text-[var(--text)] text-[19px] font-semibold'>Upload {uploadType}</div>
            </div>}

            {frontendMedia &&
                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
                    {mediaType == "image" && <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                        <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl' />
                        {uploadType != "story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-[var(--text)] mt-[20px]'
                            placeholder='write caption' onChange={(e) => setCaption(e.target.value)} value={caption} />}
                    </div>}

                    {mediaType == "video" && <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                        <VideoPlayer media={frontendMedia} />
                        {uploadType != "story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-[var(--text)] mt-[20px]'
                            placeholder='write caption' onChange={(e) => setCaption(e.target.value)} value={caption} />}
                    </div>}
                </div>
            }

            {frontendMedia &&
                <button
                    disabled={isUploading}
                    className={`px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] rounded-2xl mt-[50px]
            ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-white cursor-pointer"}`}
                    onClick={handleUpload}
                >
                    {isUploading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        `Upload ${uploadType}`
                    )}
                </button>
            }
        </div>
    )

}

export default Upload
