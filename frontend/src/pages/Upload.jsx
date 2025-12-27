import React, { useEffect, useState } from 'react'
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
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const mediaInput = useRef()


    const onEmojiClick = (emojiData) => {
        setCaption(prev => prev + emojiData.emoji);
    };

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

    useEffect(() => {
        const handleClickOutside = () => setShowEmojiPicker(false);
        if (showEmojiPicker) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [showEmojiPicker]);


    return (
       <div className="w-full h-screen overflow-y-auto bg-[var(--bg)] relative flex flex-col items-center">

            <div className='w-full h-20 flex fixed left-5 items-center gap-5 px-5'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(-1)}
                    className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-[var(--text)] text-[20px] font-semibold'>Upload</h1>
            </div>

            <div className='w-[90%] absolute max-w-[600px] h-20  mt-[100px] bg-[white] rounded-full flex justify-around 
            items-center gap-2.5'>

                <div className={`${uploadType == "post" ? "bg-[var(--bg)] text-[var(--text)] shadow-2xl shadow-black" : ""} 
                w-[28%] h-[80%]
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
            items-center justify-center gap-[8px] mt-60 rounded-2xl cursor-pointer hover:bg-[var(--secondary)]'
                onClick={() => mediaInput.current.click()}>
                <input type="file" accept={`${uploadType == "reel" ? "video/*" : "image/*, video/* "}`}
                    hidden ref={mediaInput} onChange={handleMedia} />


                <div><FaPlusSquare className='text-[white] w-[25px] h-[25px] cursor-pointer' onClick={() => navigate(`/upload`)} /></div>
                <div className='text-[var(--text)] text-[19px] font-semibold'>Upload {uploadType}</div>
            </div>}

            {frontendMedia && (
                <div className="w-[80%] max-w-[500px] mt-60 flex flex-col items-center gap-4">

                    {/* Media */}
                    {mediaType === "image" ? (
                        <img
                            src={frontendMedia}
                            alt=""
                            className="w-full max-h-[320px] object-cover rounded-3xl shadow-xl"
                        />
                    ) : (
                        <div className="w-full rounded-3xl overflow-hidden shadow-xl">
                            <VideoPlayer media={frontendMedia} />
                        </div>
                    )}

                    {/* EDIT CARD (Post & Reel) */}
                    {uploadType !== "story" && (
                        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 relative">

                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-gray-700">
                                    Write a caption ✨
                                </p>

                                <button
                                    className="text-xl text-gray-600 hover:scale-110 transition"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowEmojiPicker(prev => !prev)
                                    }}
                                >
                                    <BsEmojiSmile />
                                </button>
                            </div>

                            <textarea
                                rows={3}
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full resize-none rounded-xl border border-gray-300
                p-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                            />

                            {showEmojiPicker && (
                                <div
                                    className="absolute bottom-full right-0 mb-3 z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <EmojiPicker
                                        theme="dark"
                                        onEmojiClick={onEmojiClick}
                                        height={350}
                                        width={300}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        disabled={isUploading}
                        onClick={handleUpload}
                        className={`w-full h-12 rounded-2xl font-semibold transition
              ${isUploading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-white hover:scale-[1.02]"
                            }`}
                    >
                        {isUploading ? "Uploading..." : `Upload ${uploadType}`}
                    </button>
                </div>
            )}
        </div>
    )

}

export default Upload
