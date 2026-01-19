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
import { addMessage } from '../redux/messageSlice';
import { FiMoreVertical } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa6';
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { toast } from 'react-toastify';

function Post({ post, disableProfileClick, Ssrc, onPostClick, ExploreTailwind, active, feed, disableDelete, posts,
    setPosts, }) {

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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const navigate = useNavigate()

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const onEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, { withCredentials: true });
            const updatedPost = result.data;

            const updatedPosts = postData.map(p =>
                p._id === post._id
                    ? {
                        ...p, // keep old data
                        likes: updatedPost.likes, // update only likes
                        shares: updatedPost.shares, // optional: update shares if needed
                    }
                    : p
            );

            dispatch(setPostData(updatedPosts));
        } catch (error) {
            console.error("Like failed:", error);
        }
    };


    const handleComment = async () => {
        if (!message.trim()) return;
        try {
            const result = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, { message }, { withCredentials: true })
            const updatedPost = result.data
            setMessage("");
            if (posts && setPosts) {
                const updatedPosts = posts.map(p =>
                    p._id === post._id ? { ...updatedPost, mediaType: p.mediaType } : p
                );
                setPosts(updatedPosts);
            }

            else {
                const updatedPosts = postData.map(p =>
                    p._id === post._id
                        ? {
                            ...p,
                            comments: updatedPost.comments // update comments if needed
                        }
                        : p
                );

                dispatch(setPostData(updatedPosts));
            }
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
        if (!socket) return;

        const onLike = (updatedData) => {
            const updatedPosts = postData.map(p =>
                p._id === updatedData._id ? { ...p, likes: updatedData.likes } : p
            );
            dispatch(setPostData(updatedPosts));
        };

        const onComment = (updatedData) => {
            const updatedPosts = postData.map(p =>
                p._id === updatedData._id ? { ...p, comments: updatedData.comments } : p
            );
            dispatch(setPostData(updatedPosts));
        };

        socket.on("likedPost", onLike);
        socket.on("commentPost", onComment);

        return () => {
            socket?.off("likedPost", onLike);
            socket?.off("commentPost", onComment);
        };
    }, [socket, postData, dispatch]);


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
        if (!socket) return;

        const onShare = (updatedData) => {
            const updatedPosts = postData.map(p =>
                p._id === updatedData._id ? { ...p, shares: updatedData.shares } : p
            );
            dispatch(setPostData(updatedPosts));
            setShares(updatedData.shares);
        };

        socket.on("sharedPost", onShare);

        return () => {
            socket?.off("sharedPost", onShare);
        };
    }, [socket, postData, dispatch]);


    const fetchFollowingUsers = async () => {
        const res = await axios.get(`${serverUrl}/api/user/followingList`, { withCredentials: true });
        setFollowingUsers(res.data);
    };

    useEffect(() => {
        fetchFollowingUsers();
    }, []);

    const renderCaption = (text) => {
        return text.split(" ").map((word, index) => {
            if (word.startsWith("#")) {
                return (
                    <span
                        key={index}
                        className="text-blue-500 cursor-pointer hover:underline mr-1"
                        onClick={() => navigate(`/plhashtag/${word.substring(1)}`)}
                    >
                        {word}
                    </span>
                );
            }
            return (
                <span key={index} className="mr-1">
                    {word}
                </span>
            );
        });
    };

    const reportHandler = async (id, type) => {
        await axios.post(
            `${serverUrl}/api/user/report`,
            {
                contentId: id,
                contentType: type,
                reason: "Inappropriate content"
            }, { withCredentials: true });

        toast.success("Reported successfully");
    };

    return (
        <div className={`
    ${ExploreTailwind
                ? "w-full mb-2 break-inside-avoid bg-[var(--secondary)] rounded-2xl "
                : "w-[90%] max-w-[500px] items-center  relative shadow-[#00000030] bg-[var(--bg)] shadow-lg min-h-[450px] pb-[20px] flex flex-col rounded-2xl"
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

                            <span className="font-semibold text-[var(--text)] truncate">
                                {post.author.userName}
                            </span>


                        </div>
                    </div>



                    <div className='flex items-center gap-3'>


                        {userData._id != post.author._id &&
                            <FollowButton tailwind={'px-4 md:px-5 py-1 md:py-2 rounded-2xl text-sm md:text-base bg-black text-white hover:bg-gray-800 transition'}
                                targetUserId={post.author._id} />}

                        <span className="relative z-112">
                         
                            <FiMoreVertical
                                className="w-8 h-8 text-[var(--text)] cursor-pointer rounded-full hover:bg-gray-500/10 transition-all p-1.5"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDelete((prev) => !prev);
                                }}
                            />

                            {showDelete && (
                                <>
                                
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowDelete(false)}
                                    />

                                    <div className="absolute right-0 mt-2 w-48 bg-[var(--bg)] border border-white/10 
                                    rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in 
                                    fade-in zoom-in-95 duration-200 origin-top-right">

                                        <button
                                            onClick={() => {
                                                reportHandler(post._id, "Post");
                                                setShowDelete(false);
                                            }}
                                            className="w-full px-4 py-3.5 flex items-center gap-3 text-sm font-medium
           text-[var(--text)] hover:bg-[var(--bg)]/5 transition-all active:bg-[var(--bg)]/10"
                                        >
                                            <span className="text-lg">🚩</span>
                                            Report Post
                                        </button>

                                        <div className="h-[1px] bg-white/5 mx-2" />

                                        {
                                            userData?._id === post?.author?._id && <button
                                                onClick={() => {
                                                    handleDeletePost();
                                                    setShowDelete(false);
                                                }}
                                                className="w-full px-4 py-3.5 flex items-center gap-3 text-sm font-bold
                                                 text-red-500 hover:bg-red-500/10 transition-all active:bg-red-500/20"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                                Delete Post
                                            </button>
                                        }


                                    </div>
                                </>
                            )}
                        </span>
                    </div>
                </div>

            </>}

            <div className="w-full flex items-center justify-center">
                {post.media && (
                    <>
                        {post.media.endsWith(".mp4") ? (
                            <div className="w-full max-w-[500px] flex items-center justify-center">
                                <VideoPlayer media={post.media} active={active} feed={feed} ExploreTailwind={ExploreTailwind} />
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
                        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-99">
                            <div className="bg-white w-[300px] rounded-2xl p-4">
                                <h2 className="text-lg font-bold mb-3">Share Loop To</h2>

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
                                                <div className="font-semibold text-black">{user.userName}</div>
                                                <div className="text-sm text-gray-500">{user.name}</div>
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

                <div className="w-full px-[20px] mt-2 text-[var(--text)]">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold truncate max-w-[60%]">
                                {post.author.userName}
                            </span>
                            <span className="text-xs text-gray-400">
                                {formatTimeAgo(post.createdAt)}
                            </span>
                        </div>
                        {post.caption && (
                            <p className="text-sm break-words w-full">
                                {renderCaption(
                                    showFullCaption
                                        ? post.caption
                                        : post.caption.length > 100
                                            ? post.caption.slice(0, 100) + "..."
                                            : post.caption
                                )}

                                {post.caption.length > 100 && (
                                    <span
                                        className="text-gray-400 ml-2 cursor-pointer"
                                        onClick={() => setShowFullCaption(prev => !prev)}
                                    >
                                        {showFullCaption ? "Read less" : "Read more"}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {showComment &&
                    <div className='w-full text-[var(--text)] flex flex-col gap-[30px] pb-[20px]'>
                        <div className="w-full h-[80px] flex items-center gap-3 px-[20px] relative">

                            <div className="w-[40px] h-[40px] md:w-14 md:h-14 border-2 border-gray-300 rounded-full overflow-hidden">
                                <img
                                    src={post.author?.profileImage || dp}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <input
                                type="text"
                                className="flex-1 px-3 border-b-2 border-gray-500 outline-none h-[40px] bg-transparent"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write a comment..."
                            />
                            <button
                                type="button"
                                className="text-xl cursor-dot1"
                                onClick={() => setShowEmojiPicker(prev => !prev)}
                            >
                                <BsEmojiSmile />
                            </button>

                            <button
                                type="button"
                                onClick={handleComment}
                                className="text-xl cursor-dot1"
                            >
                                <FaRegPaperPlane />
                            </button>

                            {showEmojiPicker && (
                                <div className="absolute bottom-[90px] right-5 z-50">
                                    <EmojiPicker
                                        theme="dark"
                                        onEmojiClick={onEmojiClick}
                                        height={350}
                                        width={300}
                                    />
                                </div>
                            )}
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
                                    <div className={`${active ? "text-[var(--text)]" : ""}`}>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{com.message}</span>
                                            <span className="text-xs text-gray-400">
                                                {formatTimeAgo(com.createdAt)}
                                            </span>
                                        </div>
                                    </div>

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
