import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import {
    addRetweet,
    updateLikes,
    setThreads,
    addComment,
    setPreview
} from "../redux/threadSlice";
import { useNavigate } from "react-router-dom";
import ThreadPreview from "./ThreadPreview";
import { FiRefreshCw } from "react-icons/fi";
import renderCaption from "../hooks/useRenderCaption";

function Retweets({ userId, mythreadTailwind }) {
    const { userData } = useSelector(state => state.user);
    const { threads } = useSelector(state => state.thread);
    const [commentText, setCommentText] = useState({});
    const [previewThread, setPreviewThread] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const retweets = threads.filter(t =>
        t.retweets?.some(u => u._id === userId)
    );

    useEffect(() => {
        const loadThreads = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/thread/all`, {
                    withCredentials: true
                });
                dispatch(setThreads(res.data));
            } catch (err) {
                console.log("LOAD THREADS ERROR:", err);
            }
        };

        if (threads.length === 0) loadThreads();
    }, [dispatch, threads.length]);

    const handleLike = async (threadId, e) => {
        e.stopPropagation();
        try {
            const res = await axios.get(
                `${serverUrl}/api/thread/like/${threadId}`,
                { withCredentials: true }
            );

            dispatch(updateLikes({
                threadId: res.data._id,
                likes: res.data.likes
            }));
        } catch (error) {
            console.log("LIKE ERROR:", error);
        }
    };

    const handleComment = async (threadId, e) => {
        e.stopPropagation();
        try {
            const message = commentText[threadId];
            if (!message) return;

            const res = await axios.post(
                `${serverUrl}/api/thread/comment/${threadId}`,
                { message },
                { withCredentials: true }
            );

            dispatch(addComment({ threadId, updatedThread: res.data }));
            setCommentText(prev => ({ ...prev, [threadId]: "" }));
        } catch (err) {
            console.log("COMMENT ERROR:", err);
        }
    };

    /* RETWEET */
    const handleRetweet = async (threadId, e) => {
        e.stopPropagation();
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

    return (
        <div className={`lg:w-[50%] w-full ${!mythreadTailwind ? "h-screen overflow-y-scroll bg-black" : ""}`}>

            <h1 className="text-black text-xl font-bold mb-4">
                {userId === userData._id ? "Your Retweets" : "Retweets"}
            </h1>

            {retweets.length === 0 && (
                <p className="text-gray-400 text-center mt-10 mb-20">
                    No retweets yet...
                </p>
            )}

            {retweets.map(thread => (
                <div
                    key={thread._id}
                    onClick={() =>{ setPreviewThread(thread)
                      dispatch(setPreview(thread))
                    }}
                    className="bg-[var(--bg)] text-[var(--text)] mt-3 mb-8 p-4 rounded-xl shadow flex flex-col gap-4 cursor-pointer"
                >

                    <div className="flex items-center gap-2">
                        <img
                            src={thread.author.profileImage}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${thread.author.userName}`);
                            }}
                            className="w-12 h-12 rounded-full border border-[var(--border)]"
                        />
                        <h1 className="font-semibold">
                            {thread.author.name}
                            <span className="text-sm  ml-2">
                                @{thread.author.userName}
                            </span>
                        </h1>
                    </div>

                    <p className="text-sm ">
                        {renderCaption( thread.caption || thread.content, navigate)}
                    </p>

                    {thread.images?.map((img, i) => (
                        <img key={i} src={img} className="rounded-xl" />
                    ))}

                    {thread.mediaType === "video" && (
                        <video src={thread.video} controls className="rounded-xl" />
                    )}

                    <div className="flex gap-6 items-center">
                        <div onClick={(e) => handleLike(thread._id, e)} className="flex gap-1">
                            {thread.likes?.includes(userData._id)
                                ? <FaHeart className="text-red-600" />
                                : <FaRegHeart />}
                            {thread.likes?.length}
                        </div>

                        <div className="flex gap-1">
                            <FaRegComment />
                            {thread.comments?.length}
                        </div>

                        <div onClick={(e) => handleRetweet(thread._id, e)} className="flex gap-1">
                            <FiRefreshCw /> {thread.retweets?.length}
                        </div>
                    </div>

                    {thread.comments?.slice(0, 2).map(c => (
                        <p key={c._id} className="text-sm">
                            <b>@{c.author?.userName}</b> {c.content}
                        </p>
                    ))}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Reply..."
                            value={commentText[thread._id] || ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                                setCommentText(prev => ({
                                    ...prev,
                                    [thread._id]: e.target.value
                                }))
                            }
                            className="flex-1  border-b  border-[var(--border)] outline-none"
                        />
                        <button
                            onClick={(e) => handleComment(thread._id, e)}
                            className="px-3 bg-blue-600 text-white rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            ))}

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

export default Retweets;
