import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addRetweet, updateLikes } from "../redux/threadSlice";
import { useNavigate } from "react-router-dom";

function Quote({ userId, mythreadTailwind }) {
    const { userData } = useSelector(state => state.user);
    const [retweets, setRetweets] = useState([]);
    const { threads } = useSelector((state) => state.thread);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const quoteThreads = threads.filter(
        thread => thread.author?._id === userId && thread.quoteThread
    );
    const handleLike = async (threadId) => {
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

    return (
        <div className={`lg:w-[50%] w-full  ${!mythreadTailwind ? "h-screen overflow-y-scroll bg-black" : ""}`}>

            <h1 className="text-xl font-bold mb-4">
                {userId === userData._id ? "Your Quotes" : "Quotes"}
            </h1>

            {quoteThreads.length === 0 ? (
                <p className="text-gray-400 text-center mt-10 mb-20">
                    {userId === userData._id
                        ? "You haven't quoted any posts yet..."
                        : "haven't quoted any posts yet..."}
                </p>
            ) : (
                quoteThreads.map(thread => (
                    <div key={thread._id} className="bg-white mt-3 mb-8 p-4 rounded-xl shadow flex gap-4">
                        <img

                            src={thread.author.profileImage}
                            className="w-12 h-12 rounded-full object-cover border"
                            alt="profile"
                        />

                        <div className="w-full">
                            <h1 className="font-semibold">
                                {thread.author.name}{" "}
                                <span className="text-sm text-gray-500">@{thread.author.userName}</span>
                            </h1>
                            
                            <p className="text-gray-900 text-sm mt-1">{thread.content}</p>

                            {thread.quoteThread && (
                                <div className="bg-gray-100 p-2 rounded mt-2 border-l-4 border-gray-400"
                                >
                                    <p
                                        onClick={() => navigate(`/profile/${thread.quoteThread.author?.userName}`)}
                                        className="text-sm font-medium">@{thread.quoteThread.author?.userName}</p>
                                    <p className="text-sm">{thread.quoteThread.content}</p>

                                    {thread.quoteThread.images && thread.quoteThread.images.length > 0
                                        ? thread.quoteThread.images.map((img, i) => (
                                            <img key={i} src={img} className="rounded mt-1" alt="quote-img" />
                                        ))
                                        : null
                                    }

                                    {thread.quoteThread.mediaType === "video" && thread.quoteThread.video && (
                                        <video src={thread.quoteThread.video} controls className="w-full rounded mt-1" />
                                    )}
                                </div>
                            )}

                            <div className="flex justify-start gap-8 text-gray-600 mt-4 text-lg">

                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition"
                                    onClick={() => handleLike(thread._id)}
                                >
                                    {!thread.likes?.includes(userData._id)
                                        ? <FaRegHeart className="w-[22px] h-[22px]" />
                                        : <FaHeart className="w-[22px] h-[22px] text-red-600" />
                                    }
                                    <span className="text-[15px]">{thread.likes?.length}</span>
                                </div>

                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition">
                                    <FaRegComment className="w-[21px] h-[21px]" />
                                    <span className="text-[15px]">{thread.comments?.length}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );


}

export default Quote;
