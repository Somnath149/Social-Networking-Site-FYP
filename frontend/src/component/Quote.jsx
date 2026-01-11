import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { updateLikes, addComment, setPreview } from "../redux/threadSlice";
import { useNavigate } from "react-router-dom";
import ThreadPreview from "./ThreadPreview";
import renderCaption from "../hooks/useRenderCaption";

function Quote({ userId, mythreadTailwind }) {
    const { userData } = useSelector(state => state.user);
    const { threads } = useSelector(state => state.thread);
    const [commentText, setCommentText] = useState({});
    const [previewThread, setPreviewThread] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quoteThreads = threads.filter(
        thread => thread.author?._id === userId && thread.quoteThread
    );

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
        } catch (err) {
            console.log("LIKE ERROR:", err);
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

    return (
        <div className={`lg:w-[50%] w-full ${!mythreadTailwind ? "h-screen overflow-y-scroll bg-black" : ""}`}>

            <h1 className="text-xl font-bold mb-4 text-black">
                {userId === userData._id ? "Your Quotes" : "Quotes"}
            </h1>

            {quoteThreads.length === 0 ? (
                <p className="text-gray-400 text-center mt-10 mb-20">
                    No quoted posts yet...
                </p>
            ) : (
                quoteThreads.map(thread => (
                    <div
                        key={thread._id}
                        onClick={() => {
                            setPreviewThread(thread)
                            dispatch(setPreview(thread))
                        }}
                        className="bg-[var(--bg)] text-[var(--text)] mt-3 mb-8 p-4 rounded-xl shadow flex gap-4 cursor-pointer"
                    >

                        <img
                            src={thread?.author?.profileImage}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${thread?.author?.userName}`);
                            }}
                            className="w-12 h-12 rounded-full border  border-[var(--border)] object-cover"
                        />

                        <div className="w-full">

                            <h1 className="font-semibold">
                                {thread?.author?.name}
                                <span className="text-sm  ml-2">
                                    @{thread?.author?.userName}
                                </span>
                            </h1>

                            <p className="text-sm  mt-1">
                                {renderCaption( thread?.caption || thread?.content, navigate)}
                            </p>

                            {thread.quoteThread && (
                                <div
                                    className="bg-[var(--primary)] p-3 rounded mt-2 border-l-4  border-[var(--border)]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p
                                        className="text-sm font-semibold cursor-pointer"
                                        onClick={() =>
                                            navigate(`/profile/${thread.quoteThread.author?.userName}`)
                                        }
                                    >
                                        @{thread.quoteThread.author?.userName}
                                    </p>

                                    <p className="text-sm mt-1">
                                        {renderCaption(thread?.quoteThread?.content, navigate)}
                                    </p>

                                    {thread?.quoteThread?.images?.map((img, i) => (
                                        <img key={i} src={img} className="rounded mt-2" />
                                    ))}

                                    {thread?.quoteThread?.mediaType === "video" && (
                                        <video
                                            src={thread.quoteThread.video}
                                            className="w-full max-h-[400px] rounded mt-2"
                                        />
                                    )}
                                </div>
                            )}

                            <div className="flex gap-6 mt-4 ">

                                <div
                                    className="flex items-center gap-1"
                                    onClick={(e) => handleLike(thread._id, e)}
                                >
                                    {thread.likes?.includes(userData._id)
                                        ? <FaHeart className="text-red-600" />
                                        : <FaRegHeart />}
                                    <span>{thread.likes?.length}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <FaRegComment />
                                    <span>{thread.comments?.length}</span>
                                </div>

                            </div>

                            {thread.comments?.slice(0, 2).map(c => (
                                <p key={c._id} className="text-sm mt-1">
                                    <b>@{c.author?.userName}</b> {c.content}
                                </p>
                            ))}

                            <div className="flex gap-2 mt-3">
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
                                    className="flex-1 border-b  border-[var(--border)] outline-none p-1"
                                />
                                <button
                                    onClick={(e) => handleComment(thread._id, e)}
                                    className="px-3 bg-blue-600 text-white rounded"
                                >
                                    Send
                                </button>
                            </div>

                        </div>
                    </div>
                ))
            )}

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

export default Quote;
