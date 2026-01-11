import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UploadThread from './UploadThread';
import { addComment, addQuoteThread, addRetweet, setPreview, setThreads, updateLikes, updateVerdict } from '../redux/threadSlice';
import { FaHeart, FaRegComment, FaRegHeart, FaRocket, FaStar, FaTrash } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../App';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreadPreview from './ThreadPreview';
import { FiMoreVertical, FiRefreshCw } from 'react-icons/fi';
import { RiHome7Fill, RiMessage2Line, RiPulseLine, RiUser3Line } from 'react-icons/ri';
import { IoSearchOutline } from 'react-icons/io5';
import ThreadTitle from '../../public/ThreadTitle';
import { MdAutoAwesome } from 'react-icons/md';
import TrendingPostLoop from './TrendingPostLoop';
import { div } from 'framer-motion/client';
import { toast } from 'react-toastify';
import renderCaption from '../hooks/useRenderCaption';

function Threads({ mythreads, mythreadTailwind, HashTailwind, externalThreads, followuser }) {

    const { threads } = useSelector((state) => state.thread);
    const { userData } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket)
    const [commentText, setCommentText] = useState({});
    const [quoteContent, setQuoteContent] = useState({});
    const [isQuoting, setIsQuoting] = useState({});
    const [previewThread, setPreviewThread] = useState(null);
    const [showDelete, setShowDelete] = useState({})
    const [showTrends, setShowTrends] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const videoRef = useRef()
    const navigate = useNavigate()
    const dispatch = useDispatch();

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

    const handleLike = async (threadId) => {
        try {
            const res = await axios.get(`${serverUrl}/api/thread/like/${threadId}`, { withCredentials: true });

            dispatch(updateLikes({
                threadId: res.data._id,
                likes: res.data.likes
            }));

        } catch (error) {
            console.log("LIKE ERROR:", error);
        }
    };

    const handleComment = async (threadId) => {
        try {
            const message = commentText[threadId];
            if (!message) return;

            const res = await axios.post(
                `${serverUrl}/api/thread/comment/${threadId}`,
                { message },
                { withCredentials: true }
            );

            dispatch(addComment({ threadId, updatedThread: res.data }));
            setCommentText((prev) => ({ ...prev, [threadId]: "" }));

        } catch (err) {
            console.log("COMMENT ERROR:", err);
        }
    };

    const handleRetweet = async (threadId,thread) => {
        if (thread?.verdict === "FALSE") return(
         toast.warning("This thread contain misleading information can't retweet", {
  containerId: "warningTop"
}))

        try {
            const res = await axios.post(
                `${serverUrl}/api/thread/retweet/${threadId}`,
                {},
                { withCredentials: true }
            );

            dispatch(addRetweet({
                _id: threadId,
                retweets: res.data.retweets,
                retweetsCount: res.data.retweetsCount,
                isRetweeted: res.data.isRetweeted
            }));

        } catch (error) {
            console.log("RETWEET ERROR:", error);
        }
    };

    const handleQuote = async (threadId) => {

        try {
            const message = quoteContent[threadId] || "";
            const res = await axios.post(
                `${serverUrl}/api/thread/quote/${threadId}`,
                { content: message },
                { withCredentials: true }
            );

            dispatch(addQuoteThread(res.data));

            setQuoteContent(prev => ({ ...prev, [threadId]: "" }));
            setIsQuoting(prev => ({ ...prev, [threadId]: false }));


        } catch (error) {
            console.log("QUOTE TWEET ERROR:", error);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("likedThread", ({ _id, likes }) => {
            dispatch(updateLikes({ threadId: _id, likes }));
        });

        socket.on("newComment", ({ parentThread, updatedThread }) => {
            dispatch(addComment({ threadId: parentThread, updatedThread }));
        });

        socket.on("threadDeleted", ({ threadId }) => {
            dispatch(setThreads(threads.filter(t => t._id !== threadId)));
        });

        return () => {
            socket.off("likedThread");
            socket.off("newComment");
            socket.off("threadDeleted");
        };
    }, [socket, dispatch]);

    const filteredThreads = useMemo(() => {
        if (externalThreads) {
            return externalThreads.map(thread => {
                const reduxThread = threads.find(t => t._id === thread._id);
                return reduxThread
                    ? { ...thread, ...reduxThread }
                    : thread;
            });
        }

        return threads.filter(thread =>
            mythreads ? thread.author._id === mythreads : true
        );
    }, [threads, externalThreads, mythreads]);


    const handleDeleteThread = async (threadId) => {
        try {
            const result = await axios.delete(
                `${serverUrl}/api/thread/delete/${threadId}`,
                { withCredentials: true }
            );

            const updated = threads.filter(t => t._id !== threadId);
            dispatch(setThreads(updated));

        } catch (error) {
            console.error("Delete thread failed:", error);
        }
    };

    const toggleDeleteMenu = (threadId, e) => {
        e.stopPropagation();
        setShowDelete(prev => ({
            ...prev,
            [threadId]: !prev[threadId]
        }));
    };


    const handleClick = () => {
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    const VerdictBadge = ({ verdict }) => {
        if (!verdict) return null;

        if (verdict === "FALSE") {
            return (
                <span className="text-xs text-red-500 flex items-center gap-1">
                    ❌ Incorrect information
                </span>
            );
        }

        return null;
    };

    useEffect(() => {
        if (!socket) return;

        const handleFactCheck = (thread) => {
            dispatch(updateVerdict(thread));
        };

        socket.on("factCheckUpdate", handleFactCheck);

        return () => {
            socket.off("factCheckUpdate", handleFactCheck);
        };
    }, [socket, dispatch]);



    return (
        <div className={`w-full ${!HashTailwind && !mythreadTailwind ? "h-screen overflow-y-scroll bg-[var(--primary)]" : ""} 
    flex flex-col items-center pb-20`}>

            {showTrends ? <TrendingPostLoop setShowTrends={setShowTrends} /> :
                <>
                    {
                        !HashTailwind && !mythreadTailwind && <div className='w-full h-[80px] flex items-center justify-between px-[20px] lg:hidden'>

                            <ThreadTitle
                                className='w-27 h-27  cursor-dot1' />
                            <div className='flex items-center justify-between '>
                                <div className='relative' onClick={() => navigate("/ForYou")}>
                                    <MdAutoAwesome className="text-[var(--text)] w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    }

                    {!mythreadTailwind && !HashTailwind && !followuser && <UploadThread />}



                    <div className="mt-10 w-full flex flex-col  items-center gap-4">

                        {filteredThreads.length === 0 ? (
                            <p className="text-gray-400 text-center mt-10 mb-20">
                                {mythreads === userData._id ? "You haven't post thread yet..." : "haven't post any thread yet..."}
                            </p>
                        ) : (
                            filteredThreads.map((thread) => (
                                <div
                                    onClick={() => {
                                        setPreviewThread(thread)
                                        dispatch(setPreview(thread))
                                    }
                                    }
                                    key={thread._id}
                                    className="w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] hover:scale-101 bg-[var(--bg)] text-[var(--text)] rounded-2xl
                        shadow-lg border border-gray-700 p-5  sm:flex-row gap-4"
                                >

                                    <div className='flex flex-col'>
                                        <div>
                                            {thread.retweetedBy && (
                                                <div className="text-xs text-green-400 mb-1 flex items-center gap-1">
                                                    <FiRefreshCw /> Retweeted by
                                                    <span
                                                        className="font-semibold cursor-dot1 hover:underline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/profile/${thread.retweetedBy.userName}`);
                                                        }}
                                                    >
                                                        @{thread.retweetedBy.userName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex justify-between items-center'>

                                            <div className='flex gap-2'>
                                                <img
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/profile/${thread.author?.userName}`)
                                                    }}
                                                    src={thread.author?.profileImage}
                                                    alt="profile"
                                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover  cursor-dot1 border border-gray-600"
                                                />
                                                <div className='flex flex-col'>
                                                    <h3 className="font-semibold text-sm sm:text-base">
                                                        {thread.author?.name}
                                                        <span className="text-xs sm:text-sm text-gray-400 ml-2">@{thread.author?.userName}</span>
                                                    </h3>
                                                    <span className="text-xs text-gray-400">
                                                        {formatTimeAgo(thread?.createdAt)}
                                                    </span>
                                                    <VerdictBadge verdict={thread?.verdict} />

                                                </div>
                                            </div>
                                            <div>
                                                {mythreads && thread.author?._id === userData._id && (
                                                    <span>
                                                        <FiMoreVertical
                                                            className="text-[var(--text)] w-6 h-6  cursor-dot1 rounded-full hover:bg-[var(--text)]/60 p-1"
                                                            onClick={(e) => toggleDeleteMenu(thread._id, e)}
                                                        />

                                                        {showDelete[thread._id] && (
                                                            <div
                                                                className="absolute mt-2 bg-[var(--primary)] border
                                                                 border-gray-700 rounded-xl shadow-lg px-3 py-2 z-20"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteThread(thread._id);
                                                                    }}
                                                                    className="px-3 py-1 text-sm text-red-500
                                                                     rounded-xl flex items-center bold gap-1"
                                                                >
                                                                    <FaTrash className="w-4 h-4" /> Delete
                                                                </button>
                                                            </div>
                                                        )}

                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-2">

    <p className={` ${thread?.verdict === "FALSE" ? "text-red-500" : "text-[var(--text)]"} " text-sm sm:text-base"`}>{renderCaption(thread.caption || thread.content, navigate)}</p>
                                        {thread.images?.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                className="
    mt-3
    w-full
    object-cover
    rounded-xl
    border border-gray-700
    bg-black
  "
                                            />

                                        ))}

                                        {thread.mediaType === "video" && thread.video && (
                                            <div>
                                                <video
                                                    src={thread.video}
                                                    playsInline

                                                    preload="metadata"
                                                    className="
    mt-3
    w-full
    max-h-[450px]
    object-cover
    rounded-xl
    border border-gray-700
    bg-black
  "
                                                />

                                            </div>
                                        )}

                                        {thread.quoteThread && (
                                            <div className="bg-[var(--primary)] brightness-105 p-3 rounded-xl mt-3 border border-gray-700">
                                                <p className="text-sm font-semibold  cursor-dot1"
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/profile/${thread.quoteThread.author?.userName}`) }}>
                                                    @{thread.quoteThread.author?.userName}
                                                </p>
                                                <p className="text-[var(--text)] text-sm mt-1">{thread.quoteThread.content}</p>

                                                {thread.quoteThread.images?.map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img}
                                                        className="rounded-xl mt-2 w-full sm:max-w-full h-auto object-cover border border-gray-700"
                                                    />
                                                ))}

                                                {thread.quoteThread.mediaType === "video" && thread.quoteThread.video && (
                                                    <video
                                                        src={thread.quoteThread.video}
                                                        className="
    mt-3
    w-full
     max-h-[450px]
    object-cover
    rounded-xl
    border border-gray-700
    bg-black
  "
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4 mt-3 text-[var(--text)] text-lg">

                                            <div className="flex items-center gap-2  cursor-dot1" onClick={(e) => { e.stopPropagation(); handleLike(thread._id) }}>
                                                {!thread.likes?.includes(userData._id) ? <FaRegHeart className="hover:text-red-500" /> : <FaHeart className="text-red-600" />}
                                                <span className="text-sm">{thread.likes?.length}</span>
                                            </div>

                                            <div className="flex items-center gap-2  cursor-dot1">
                                                <FaRegComment className="hover:text-blue-400" />
                                                <span className="text-sm">{thread.comments?.length}</span>
                                            </div>

                                            <div className="flex items-center gap-2  cursor-dot1"
                                             onClick={(e) => {
                                                
                                                e.stopPropagation(); handleRetweet(thread._id, thread) }}>
                                                
                                                <span className={`${thread.isRetweeted ? "text-green-500" : "text-gray-300"}`}>
                                                <FiRefreshCw
  className="hover:rotate-180 transition-transform duration-300 active:animate-spin"
/>

 </span>
                                                <span className="text-sm">{thread.retweetsCount}</span>
                                            </div>

                                            <div className="flex items-center gap-2  cursor-dot1" onClick={(e) => { e.stopPropagation(); setIsQuoting(prev => ({ ...prev, [thread._id]: !prev[thread._id] })) }}>
                                                ❝ <span className="text-sm">Quote</span>
                                            </div>
                                        </div>

                                        {isQuoting[thread._id] && (
                                            <div className="mt-3">
                                                <textarea
                                                    className="w-full bg-[var(--bg)] border border-gray-700 rounded-lg p-2 text-[var(--text)]"
                                                    placeholder="Add something..."
                                                    value={quoteContent[thread._id] || ""}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => {
                                                        setQuoteContent(prev => ({ ...prev, [thread._id]: e.target.value }))
                                                    }}
                                                />
                                                <button
                                                    className="px-4 py-1 mt-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                                                    onClick={(e) => { e.stopPropagation(); handleQuote(thread._id) }}
                                                >
                                                    Quote
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-2">
                                            {thread.comments?.slice(0, 2).map((c) => (
                                                <p key={c._id} className="text-sm text-[var(--text)] mt-1">
                                                    <span className="font-semibold text-[var(--text)]">@{c.author?.userName}</span> {c.content}
                                                </p>
                                            ))}
                                        </div>

                                        <div className="flex gap-2 mt-3">
                                            <input
                                                type="text"
                                                placeholder="Reply..."
                                                className="flex-1 bg-[var(--bg)] border-b border-gray-600 outline-none p-1 text-[var(--text)]"
                                                value={commentText[thread._id] || ""}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => setCommentText(prev => ({ ...prev, [thread._id]: e.target.value }))}
                                            />
                                            <button
                                                className="px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                                                onClick={(e) => { e.stopPropagation(); handleComment(thread._id) }}
                                            >
                                                Send
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            )))

                        }

                        <div className='
            w-[90%] lg:hidden h-[80px] flex justify-around items-center
            fixed bottom-[7px] rounded-full z-[100]
            backdrop-blur-xl bg-gradient-to-r from-gray-900/80 via-black/50 to-gray-900/80
            shadow-lg shadow-blue-400/50 border border-blue-400/30
        '>

                            <div className="flex gap-8 text-lg">

                                <div className="flex text-[var(--text)] justify-start  cursor-dot1 gap-4">
                                    <RiHome7Fill className='text-[white] w-[25px] h-[25px]  cursor-dot1'
                                        onClick={() => navigate("/threads")} /></div>
                                <div className="flex text-[var(--text)] justify-start  cursor-dot1 gap-4">
                                    <IoSearchOutline className='text-[white] w-[25px] h-[25px]  cursor-dot1'
                                        onClick={() => navigate(`/Search`)} /></div>
                                <div className="flex text-[var(--text)] justify-start  cursor-dot1 gap-4">
                                    < RiPulseLine className='text-[white] w-[25px] h-[25px]  cursor-dot1'
                                        onClick={() => setShowTrends(true)} /></div>
                                <div className="flex text-[var(--text)] justify-start  cursor-dot1 gap-4">
                                    <RiMessage2Line className='text-[white] w-[25px] h-[25px]  cursor-dot1'
                                        onClick={() => navigate(`/messages`)} /></div>

                                <div className="flex  text-[var(--text)] justify-start  cursor-dot1 gap-4" onClick={() => navigate(`/profile/${userData.userName}`)}>
                                    <RiUser3Line className='text-[white] w-[25px] h-[25px]  cursor-dot1'
                                    /></div>
                            </div>
                        </div>
                    </div>  </>}

            {previewThread && (
                <ThreadPreview
                    thread={previewThread}
                    onClose={() => {
                        setPreviewThread(null)
                        dispatch(setPreview(null))
                    }}
                />
            )}


        </div>

    );
}

export default Threads;
