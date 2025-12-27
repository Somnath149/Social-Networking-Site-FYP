import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UploadThread from './UploadThread';
import { addComment, addQuoteThread, addRetweet, setThreads, updateLikes } from '../redux/threadSlice';
import { FaHeart, FaRegComment, FaRegHeart, FaRocket, FaStar, FaTrash } from 'react-icons/fa6';
import axios from 'axios';
import { serverUrl } from '../App';
import { useState } from 'react';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
import ThreadPreview from './ThreadPreview';
import { FiMoreVertical, FiStar, FiTarget } from 'react-icons/fi';
import { RiHome7Fill, RiMessage2Line, RiPulseLine, RiUser3Line } from 'react-icons/ri';
import { IoNotificationsOutline, IoSearchOutline } from 'react-icons/io5';

import { BiMessageAltDetail } from 'react-icons/bi';
import ThreadTitle from '../../public/ThreadTitle';
import { MdAutoAwesome, MdStar } from 'react-icons/md';
import { LuDiamond, LuSparkles, LuTrendingUp } from 'react-icons/lu';
import OtherUsers from './OtherUsers';
import ForYou from '../pages/ForYou';
import TrendingPostLoop from './TrendingPostLoop';

function Threads({ mythreads, mythreadTailwind, HashTailwind, externalThreads }) {

    const { threads } = useSelector((state) => state.thread);
    const { userData } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket)
    const [commentText, setCommentText] = useState({});
    const [quoteContent, setQuoteContent] = useState({});
    const [isQuoting, setIsQuoting] = useState({});
    const [previewThread, setPreviewThread] = useState(null);
    const [showDelete, setShowDelete] = useState(false)
    const [showTrends, setShowTrends] = useState(false)
    const [showForYou, setShowForYou] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch();

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

    const handleRetweet = async (threadId) => {
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


    const filteredThreads = externalThreads
        ? externalThreads.map(thread => threads.find(t => t._id === thread._id) || thread)
        : threads.filter(thread => mythreads ? thread.author._id === mythreads : true);


    // const filteredThreads = externalThreads
    //     ? externalThreads.map(thread => {
    //         // Agar Redux me update hua thread hai to merge karo
    //         const reduxThread = threads.find(t => t._id === thread._id);
    //         return reduxThread ? reduxThread : thread;
    //     })
    //     : threads.filter(thread =>
    //         mythreads ? thread.author._id === mythreads : true
    //     );

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

                    {!mythreadTailwind && !HashTailwind && <UploadThread />}
{
    mythreadTailwind && <h1 className="text-black text-xl font-bold mb-4">
                        {mythreads === userData._id ? "Your Threads" : "Threads"}
                    </h1>
}
                    

                    <div className="mt-4 w-full flex flex-col items-center gap-4">

                        {filteredThreads.length === 0 ? (
                            <p className="text-gray-400 text-center mt-10 mb-20">
                                {mythreads === userData._id ? "You haven't post thread yet..." : "haven't post any thread yet..."}
                            </p>
                        ) : (
                            filteredThreads.map((thread) => (
                                <div
                                    onClick={() => setPreviewThread(thread)}
                                    key={thread._id}
                                    className="w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] hover:scale-101 bg-[var(--bg)] text-[var(--text)] rounded-2xl
                        shadow-lg border border-gray-700 p-5 flex flex-col sm:flex-row gap-4"
                                >

                                    {/* Profile */}
                                    <img
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/profile/${thread.author?.userName}`)
                                        }}
                                        src={thread.author?.profileImage}
                                        alt="profile"
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover  cursor-dot1 border border-gray-600"
                                    />

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col gap-2">

                                        <div className='flex justify-between items-start'>
                                            <h3 className="font-semibold text-sm sm:text-base">
                                                {thread.author?.name}
                                                <span className="text-xs sm:text-sm text-gray-400 ml-2">@{thread.author?.userName}</span>
                                            </h3>

                                            <span className='relative'>
                                                <FiMoreVertical
                                                    className="text-[var(--text)] w-6 h-6  cursor-dot1 rounded-full
                                                     hover:bg-gray-300 p-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowDelete(prev => !prev)
                                                    }}
                                                />

                                                {showDelete && thread.author?._id === userData._id && (
                                                    <div className="absolute right-0 mt-2 bg-[var(--secondary)] border border-gray-700 rounded-xl shadow-lg px-3 py-2 z-20"
                                                        onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteThread(thread._id); }}
                                                            className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-xl flex items-center gap-1"
                                                        >
                                                            <FaTrash className="w-4 h-4" /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-[var(--text)] text-sm sm:text-base">{thread.caption || thread.content}</p>

                                        {/* IMAGES */}
                                        {thread.images?.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                className="rounded-xl mt-3 w-full sm:max-w-full h-auto object-cover border border-gray-600"
                                            />
                                        ))}

                                        {/* VIDEO */}
                                        {thread.mediaType === "video" && thread.video && (
                                            <video
                                                src={thread.video}
                                                controls
                                                className="w-full sm:max-w-full h-auto rounded-xl mt-3 border border-gray-600"
                                            />
                                        )}

                                        {/* QUOTED THREAD */}
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
                                                        controls
                                                        className="w-full sm:max-w-full h-auto rounded-xl mt-3 border border-gray-600"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* ACTION BUTTONS */}
                                        <div className="flex flex-wrap gap-4 mt-3 text-[var(--text)] text-lg">

                                            {/* LIKE */}
                                            <div className="flex items-center gap-2  cursor-dot1" onClick={(e) => { e.stopPropagation(); handleLike(thread._id) }}>
                                                {!thread.likes?.includes(userData._id) ? <FaRegHeart className="hover:text-red-500" /> : <FaHeart className="text-red-600" />}
                                                <span className="text-sm">{thread.likes?.length}</span>
                                            </div>

                                            {/* COMMENT */}
                                            <div className="flex items-center gap-2  cursor-dot1">
                                                <FaRegComment className="hover:text-blue-400" />
                                                <span className="text-sm">{thread.comments?.length}</span>
                                            </div>

                                            {/* RETWEET */}
                                            <div className="flex items-center gap-2  cursor-dot1" onClick={(e) => { e.stopPropagation(); handleRetweet(thread._id) }}>
                                                <span className={`${thread.isRetweeted ? "text-green-500" : "text-gray-300"}`}>🔁</span>
                                                <span className="text-sm">{thread.retweetsCount}</span>
                                            </div>

                                            {/* QUOTE */}
                                            <div className="flex items-center gap-2  cursor-dot1" onClick={(e) => { e.stopPropagation(); setIsQuoting(prev => ({ ...prev, [thread._id]: !prev[thread._id] })) }}>
                                                ❝ <span className="text-sm">Quote</span>
                                            </div>
                                        </div>

                                        {/* QUOTE INPUT */}
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

                                        {/* COMMENTS */}
                                        <div className="mt-2">
                                            {thread.comments?.slice(0, 2).map((c) => (
                                                <p key={c._id} className="text-sm text-[var(--text)] mt-1">
                                                    <span className="font-semibold text-[var(--text)]">@{c.author?.userName}</span> {c.content}
                                                </p>
                                            ))}
                                        </div>

                                        {/* COMMENT INPUT */}
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

                        {/* Nab Bar */}

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
                                {/* <div className="flex text-[var(--text)] justify-start  cursor-dot1 gap-4">
                                           <PiSparkleFill className='text-[white] w-[25px] h-[25px]  cursor-dot1'
                                               onClick={() => navigate(`/threads`)} />Grok</div> */}
                                <div className="flex  text-[var(--text)] justify-start  cursor-dot1 gap-4" onClick={() => navigate(`/profile/${userData.userName}`)}>
                                    <RiUser3Line className='text-[white] w-[25px] h-[25px]  cursor-dot1'
                                    /></div>
                            </div>
                        </div>
                    </div>  </>}

            {previewThread && (
                <ThreadPreview
                    thread={previewThread}
                    onClose={() => setPreviewThread(null)}
                />
            )}
        </div>

    );
}

export default Threads;
