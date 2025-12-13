import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { addRetweet, updateLikes, setThreads } from "../redux/threadSlice";
import { useNavigate } from "react-router-dom";

function Retweets({ userId, mythreadTailwind }) {
    const { userData } = useSelector(state => state.user);
    const { threads } = useSelector(state => state.thread);
    const dispatch = useDispatch();
    const navigate = useNavigate()
   
    const retweets = threads.filter(t => t.retweets.includes(userId));

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

    const handleLike = async (threadId) => {
        try {
            const res = await axios.get(`${serverUrl}/api/thread/like/${threadId}`, {
                withCredentials: true
            });

            dispatch(updateLikes({
                threadId: res.data._id,
                likes: res.data.likes
            }));

        } catch (error) {
            console.log("LIKE ERROR:", error);
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

    return (
        <div className={`lg:w-[50%] w-full ${!mythreadTailwind ? "h-screen overflow-y-scroll bg-black" : ""}`}>
            <h1 className="text-black text-xl font-bold mb-4">
                {userId === userData._id ? "Your Retweets" : "Retweets"}
            </h1>

            {retweets.length === 0 && (
                <p className="text-gray-400 text-center mt-10 mb-20">
                    {userId === userData._id ? "You haven't retweeted any posts yet..." : "haven't retweeted any posts yet..."}
                </p>
            )}

            {retweets.map(thread => (
                <div
                    key={thread._id}
                    className="bg-white mt-3 mb-8 p-4 rounded-xl shadow flex gap-4"
                >
                    {/* Profile Image */}
                    <img
                        src={thread.author.profileImage}
                        onClick={() => navigate(`/profile/${thread.author?.userName}`)}
                        className="w-12 h-12 rounded-full object-cover border"
                        alt="profile"
                    />

                    <div className="w-full">

                        {/* Author */}
                        <h1 className="font-semibold">
                            {thread.author.name}{" "}
                            <span className="text-sm text-gray-500">
                                @{thread.author.userName}
                            </span>
                        </h1>

                        {/* Caption */}
                        <p className="text-gray-900 text-sm mt-1">
                            {thread.caption || thread.content}
                        </p>

                        {/* Images / Video */}
                        {thread.images?.length > 0 &&
                            thread.images.map((img, i) => (
                                <img key={i} src={img} className="rounded-xl mt-2" alt="thread-media" />
                            ))
                        }

                        {thread.mediaType === "video" && thread.video && (
                            <video src={thread.video} controls className="w-full rounded-xl mt-2 border" />
                        )}

                        {/* Quoted Thread */}
                        {thread.quoteThread && (
                            <div className="border-l-4 border-gray-300 pl-4 mt-3 rounded-xl bg-gray-50">
                                <h1 className="font-semibold">
                                    {thread.quoteThread.author.name}{" "}
                                    <span className="text-sm text-gray-500">
                                        @{thread.quoteThread.author.userName}
                                    </span>
                                </h1>
                                <p className="text-gray-900 text-sm mt-1">
                                    {thread.quoteThread.caption || thread.quoteThread.content}
                                </p>

                                {thread.quoteThread.images?.length > 0 &&
                                    thread.quoteThread.images.map((img, i) => (
                                        <img key={i} src={img} className="rounded-xl mt-2" alt="quoted-media" />
                                    ))
                                }

                                {thread.quoteThread.mediaType === "video" && thread.quoteThread.video && (
                                    <video src={thread.quoteThread.video} controls className="w-full rounded-xl mt-2 border" />
                                )}
                            </div>
                        )}

                        {/* Count */}
                        <div className="flex gap-6 mt-3 text-gray-600">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleLike(thread._id)}>
                                {thread.likes?.includes(userData._id) ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
                                <span>{thread.likes?.length}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <FaRegComment />
                                <span>{thread.comments?.length}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <span className="cursor-pointer" onClick={() => handleRetweet(thread._id)}>🔁</span>
                                <span>{thread.retweets?.length}</span>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );


}

export default Retweets;
