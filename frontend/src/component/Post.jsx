import React, { useState } from 'react'
import dp from "../assets/dp.png"
import VideoPlayer from './VideoPlayer';
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaBookmark, FaRegPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { div } from 'framer-motion/client';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';

function Post({ post }) {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const [showComment, setshowComment] = useState(false)
    const [message, setMessage] = useState("")
    const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, { withCredentials: true })
            const updatedPost = result.data

            const updatedPosts = postData.map(p =>
                p._id === post._id ? updatedPost : p
            )

            dispatch(setPostData(updatedPosts))
        } catch (error) {
            console.error("Like failed:", error)
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, { message }, { withCredentials: true })
            const updatedPost = result.data

            const updatedPosts = postData.map(p =>
                p._id === post._id ? updatedPost : p
            )

            dispatch(setPostData(updatedPosts))
        } catch (error) {
            console.error("Comment failed:", error)
        }
    }

        const handleSaved = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/post/saved/${post._id}`, { withCredentials: true })
            dispatch(setUserData(result.data))
        } catch (error) {
            console.error("Saved failed:", error)
        }
    }

    

    return (
        <div className='w-[90%] min-h-[450px] pb-[20px] max-w-[500px] flex flex-col gap-4 bg-white items-center shadow-lg shadow-[#00000030] rounded-2xl overflow-y-scroll'>


            <div className='w-full flex justify-between items-center px-4 py-3'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 md:w-14 md:h-14 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                        <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                    </div>
                    <div className='font-semibold text-gray-800 truncate max-w-[120px] md:max-w-[150px]'>
                        {post?.author?.userName}
                    </div>
                </div>
                {userData._id != post.author._id && <FollowButton tailwind={'px-4 md:px-5 py-1 md:py-2 rounded-2xl text-sm md:text-base bg-black text-white hover:bg-gray-800 transition'}
                 targetUserId={post.author._id}/>}
                
            </div>


            <div className="w-full flex items-center justify-center">
                {post.mediaType === "image" && (
                    <div className="w-full  flex items-center justify-center">
                        <img
                            src={post.media}
                            alt=""
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                )}

                {post.mediaType === "video" && (
                    <div className="w-full max-w-[500px] flex items-center justify-center">
                        <VideoPlayer media={post.media} />
                    </div>
                )}
            </div>

            <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
                <div className='flex justify-center items-center gap-[10px]'>
                    <div className='flex justify-center items-center gap-[5px]' onClick={handleLike}>
                        {!post.likes.includes(userData._id) && <FaRegHeart className="w-[25px] cursor-pointer h-[25px]" />}
                        {post.likes.includes(userData._id) && <FaHeart className="w-[25px] cursor-pointer h-[25px] text-red-600" />}
                        <span>{post.likes.length}</span>
                    </div>

                    <div className='flex justify-center items-center gap-[5px]' onClick={()=> setshowComment(prev=>!prev)}>
                        <FaRegComment className="w-[25px] cursor-pointer h-[25px]" />
                        <span>{post.comments.length}</span>
                    </div>
                </div>

                <div onClick={handleSaved}>
                    {!userData.saved.includes(post?._id) && <FaRegBookmark className="w-[25px] cursor-pointer h-[25px]" />}
                    {userData.saved.includes(post?._id) && <FaBookmark className="w-[25px] cursor-pointer h-[25px]" />}
                </div>
            </div>

            {post.caption && <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
                <h1>{post.author.userName}</h1>
                <div>{post.caption}</div>
            </div>}

            {showComment &&
                <div className='w-full flex flex-col gap-[30px] pb-[20px]'>
                    <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>
                        <div className='w-[40px] h-[40px] md:w-14 md:h-14 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                            <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                        </div>

                        <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]'
                            onChange={(e) => setMessage(e.target.value)} value={message}
                            placeholder='write comment...' />
                        <button onClick={handleComment}> <FaRegPaperPlane className="cursor-pointer w-[20px] h-[20px]" /></button>
                    </div>

                    <div className='w-full max-h-[300px] overflow-auto'>
                        {post.comments?.map((com, index) => (
                            <div key={index} className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200'>
                                <div className='w-[40px] h-[40px] md:w-14 md:h-14 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                                    <img src={com.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                                </div>
                                <div>{com.message}</div>
                            </div>
                        ))}

                    </div>

                </div>

            }
        </div>
    )
}

export default Post
