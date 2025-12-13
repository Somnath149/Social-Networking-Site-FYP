import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.png"
import VideoPlayer from './VideoPlayer';
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaBookmark, FaRegPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
import { FaShare } from "react-icons/fa";
import getFollowingList from '../hooks/getfollowingList';
import { addMessage } from '../redux/messageSlice';
import { FiMoreVertical } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa6';

function Post({ post, disableProfileClick, Ssrc, onPostClick, ExploreTailwind, active, feed, disableDelete }) {

    const dispatch = useDispatch()
    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const { socket } = useSelector(state => state.socket)
    const [showComment, setshowComment] = useState(false)
    const [shares, setShares] = useState(post.shares || []);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [message, setMessage] = useState("")
    const [showDelete, setShowDelete] = useState(false)
    const navigate = useNavigate()

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

    useEffect(() => {
        socket?.on("likedPost", (updatedData) => {
            const updatedPosts = postData.map(p =>
                p._id == updatedData._id ? { ...p, likes: updatedData.likes } : p
            )
            dispatch(setPostData(updatedPosts))
        })

        socket?.on("commentPost", (updatedData) => {
            const updatedPosts = postData.map(p =>
                p._id == updatedData._id ? { ...p, comments: updatedData.comments } : p
            )
            dispatch(setPostData(updatedPosts))
        })
        return () => {
            socket.off("likedPost")
            socket.off("commentPost")
        }
    }, [socket, postData, dispatch])

    const handleDeletePost = async () => {
        try {
            await axios.delete(`${serverUrl}/api/post/delete/${post._id}`, { withCredentials: true });
            const updatedPosts = postData.filter(p => p._id !== post._id);
            dispatch(setPostData(updatedPosts));
        } catch (error) {
            console.error("Delete post failed:", error);
        }
    };



    const handleSharePost = async (selectedUser) => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/message/sendPost/${selectedUser._id}`,
                { postId: post._id },
                { withCredentials: true }
            );

            dispatch(addMessage(result.data));
            setShowShareModal(false);
        } catch (error) {
            console.error("Share post failed:", error);
        }
    };




    useEffect(() => {
        socket?.on("sharedPost", (updatedData) => {
            const updatedPosts = postData.map(p =>
                p._id === updatedData._id ? { ...p, shares: updatedData.shares } : p
            );
            dispatch(setPostData(updatedPosts));
            setShares(updatedData.shares);
        });

        return () => {
            socket?.off("sharedPost");
        };
    }, [socket, postData, dispatch]);

    const fetchFollowingUsers = async () => {
        const res = await axios.get(`${serverUrl}/api/user/followingList`, { withCredentials: true });
        setFollowingUsers(res.data); 
    };

    useEffect(() => {
        fetchFollowingUsers();
    }, []);



    return (
        <div className={`
    ${ExploreTailwind
                ? "w-full mb-2 break-inside-avoid bg-[var(--secondary)] rounded-2xl "        // Masonry ke liye
                : "w-[90%] max-w-[500px] items-center   shadow-[#00000030] bg-[var(--bg)] shadow-lg min-h-[450px] pb-[20px] flex flex-col rounded-2xl"
            }
  `}>

            {!ExploreTailwind && <>
                <div className='w-full flex justify-between items-center px-4 py-3'>
                    <div
                        className={`text-[var(--text)]  cursor-dot1 flex justify-between items-center gap-4`}
                        onClick={() => navigate(`/profile/${post.author?.userName}`)}>

                        <div className='w-12 h-12 md:w-14 md:h-14 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                            <img src={post?.author?.profileImage || dp} />
                            <div>{post?.author?.userName || "Unknown"}</div>
                        </div>
                        
                        <div
                            className={`
                                 ${active ? "text-[var(--text)] font-semibold truncate max-w-[120px] md:max-w-[150px]" : "font-semibold text-[var(--text)] truncate max-w-[120px] md:max-w-[150px]"} `} >
                            {post?.author?.userName}
                        </div>
                    </div>

                    {disableDelete && <span className='relative mr-0'>
                        <FiMoreVertical
                            className="text-[var(--text)]  cursor-dot1 w-6 h-6 cursor-pointer rounded-full hover:bg-gray-300 p-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDelete(prev => !prev)
                            }}
                        />

                        {showDelete && post.author?._id === userData._id && (
                            <div className="absolute right-0 mt-2 bg-[#111] border border-gray-700 rounded-xl shadow-lg px-3 py-2 z-20"
                            >
                                <button
                                    onClick={handleDeletePost}
                                    className="px-3 py-1 text-sm text-red-500 rounded-xl flex items-center gap-1"
                                >
                                    <FaTrash className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        )}
                    </span>}


                    {active && <>
                        {userData._id != post.author._id &&
                            <FollowButton tailwind={'px-4 md:px-5 py-1 md:py-2 rounded-2xl text-sm md:text-base bg-black text-[var(--text)] hover:bg-gray-800 transition'}
                                targetUserId={post.author._id} />}
                    </>}

                </div>

            </>}

            {/* <div className="w-full flex items-center  justify-center">
                {post.mediaType === "image" && (
                    <div className="w-full h-auto flex items-center justify-center">
                        <img
                            src={post.media}
                            alt=""
                            className={`w-full min-w-full h-auto object-cover rounded-2xl 
                                ${!ExploreTailwind ? "" : ""}
                                `}
                        />
                    </div>
                )}

                {post.mediaType === "video" && (
                    <div className={`w-full max-w-[500px] flex items-center justify-center 
                                
                                `}>
                        <VideoPlayer media={post.media} active={active} feed={feed} />
                    </div>
                )}
            </div> */}


            <div className="w-full flex items-center justify-center">
  {post.media && (
    <>
      {post.media.endsWith(".mp4") ? (
        <div className="w-full max-w-[500px] flex items-center justify-center">
          <VideoPlayer media={post.media} active={active} feed={feed} />
        </div>
      ) : (
        <div className="w-full h-auto flex items-center justify-center">
          <img
            src={post.media}
            alt=""
            className={`w-full min-w-full h-auto object-cover rounded-2xl`}
          />
        </div>
      )}
    </>
  )}
</div>


            {!ExploreTailwind && <>


                <div className='w-full h-[60px]  flex justify-between items-center px-[20px] mt-[10px]'>
                    <div className='flex justify-center items-center gap-[10px]'>
                        <div className='flex justify-center items-center gap-[5px] cursor-dot1' onClick={handleLike}>
                            {!post.likes.includes(userData._id) && <FaRegHeart className={`w-[25px] text-[var(--text)] cursor-pointer h-[25px]
                                 ${active ? "text-[var(--text)]" : "text-[var(--text)]"} `} />}
                            {post.likes.includes(userData._id) && <FaHeart className="w-[25px] text-[var(--text)] cursor-pointer h-[25px] text-[var(--text)]" />}
                            <span className={`
                                 ${active ? "text-[var(--text)]" : "text-[var(--text)]"} `}>{post.likes.length}</span>
                        </div>

                        <div className='flex justify-center items-center gap-[5px] cursor-dot1' onClick={() => setshowComment(prev => !prev)}>
                            <FaRegComment className={`w-[25px]  cursor-pointer h-[25px]
                                 ${active ? "text-[var(--text)]" : "text-[var(--text)]"} `} />
                            <span className={`
                                 ${active ? "text-[var(--text)]" : "text-[var(--text)]"} `}>{post.comments.length}</span>
                        </div>

                        <div className='flex justify-center items-center gap-[5px] cursor-dot1' onClick={() => setShowShareModal(true)}>
                            <FaShare className={`w-[25px] cursor-pointer h-[25px] ${active ? "text-[var(--text)]" : "text-[var(--text)]"}`} />

                        </div>


                    </div>

                    <div onClick={handleSaved} className='cursor-dot1'>
                        {!userData?.saved?.some(item => (item._id || item) === post._id) &&
                            <FaRegBookmark className={`w-[25px] cursor-pointer h-[25px]
                                 ${active ? "text-[var(--text)]" : "text-[var(--text)]"} `} />}
                        {userData?.saved?.some(item => (item._id || item) === post._id) &&
                            <FaBookmark className={`w-[25px] cursor-pointer h-[25px]
                                 ${active ? "text-[var(--text)]" : ""} `} />}
                    </div>
                </div>

                {
                    showShareModal && (
                        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                            <div className="bg-white w-[300px] rounded-2xl p-4">
                                <h2 className="text-lg font-bold mb-3">Share Loop To</h2>

                                {/* If no following users */}
                                {followingUsers.length === 0 && (
                                    <p className="text-gray-600 text-center py-4">
                                        You are not following anyone.
                                    </p>
                                )}

                                <div className="max-h-[250px] overflow-auto">
                                    {followingUsers.map(user => (
                                        <div key={user._id} className="flex items-center gap-3 p-2"
                                            onClick={() => handleSharePost(user)}
                                        >
                                            <img
                                                src={user.profileImage || dp}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <div className="font-semibold text-[var(--text)]">{user.userName}</div>
                                                <div className="text-sm text-[var(--text)]">{user.name}</div>
                                            </div>
                                        </div>
                                    ))}

                                </div>

                                <button
                                    className="mt-4 w-full bg-red-500 cursor-dot1 text-[var(--text)] rounded-xl py-2"
                                    onClick={() => setShowShareModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )
                }

                {post.caption && <div className={`w-full px-[20px] gap-[10px] flex justify-start items-center
                                 ${active ? "text-[var(--text)]" : "text-[var(--text)]"} `}>
                    <h1>{post.author.userName}</h1>
                    <div>{post.caption}</div>
                </div>}

                {showComment &&
                    <div className='w-full text-[var(--text)] flex flex-col gap-[30px] pb-[20px]'>
                        <div className={`w-full h-[80px] flex items-center justify-between px-[20px] relative
                             ${active ? "text-[var(--text)]" : "text-[var(--text)]"}`}>
                            <div className='w-[40px] h-[40px] md:w-14 md:h-14 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                                <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                            </div>

                            <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]'
                                onChange={(e) => setMessage(e.target.value)} value={message}
                                placeholder='write comment...' />
                            <button onClick={handleComment}> <FaRegPaperPlane className=" cursor-dot1 cursor-pointer w-[20px] h-[20px]" /></button>
                        </div>

                        <div className='w-full max-h-[300px] overflow-auto'>

                            {post.comments?.map((com, index) => (
                                <div key={index} className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200'>
                                    <div className='w-[40px] h-[40px] md:w-14 md:h-14 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                                        <img src={`${!disableProfileClick ? com.author?.profileImage || dp : Ssrc}`}
                                            onClick={() => {
                                                if (!disableProfileClick) navigate(`/profile/${com.author?.userName}`);
                                                else onPostClick && onPostClick();
                                            }} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <div className={`${active ? "text-[var(--text)]" : ""}`}>{com.message}</div>

                                    {userData._id === com.author?._id && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await axios.delete(`${serverUrl}/api/post/comment/${post._id}/${com._id}`, { withCredentials: true });
                                                    const updatedPosts = postData.map(p =>
                                                        p._id === post._id ? res.data : p
                                                    );
                                                    dispatch(setPostData(updatedPosts));
                                                } catch (error) {
                                                    console.error("Delete comment failed:", error);
                                                }
                                            }}
                                            className="ml-auto px-2 py-1 bg-red-600 text-[var(--text)] rounded hover:bg-red-700 text-xs"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </>}
        </div>
    )
}

export default Post
