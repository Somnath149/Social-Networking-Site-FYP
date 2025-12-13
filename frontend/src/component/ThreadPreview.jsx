import React from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ThreadPreview({ thread, onClose }) {
    if (!thread) return null;

    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-[var(--bg)] bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-3xl bg-[var(--primary)] text-[var(--text)] text-[var(--text1)] rounded-2xl p-5 relative border border-[var(--secondary)] overflow-y-auto max-h-[90vh]">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500"
                >
                    <FaTimes size={24} />
                </button>

                <div className="flex gap-3 items-center cursor-pointer mb-4"
                   
                >
                    <img
                        src={thread.author?.profileImage}
                         onClick={() => navigate(`/profile/${thread.author?.userName}`)}
                        className="w-12 h-12 rounded-full border border-gray-600 object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-[var(--text)] text-lg">{thread.author?.name}</h3>
                        <p className="text-sm text-gray-400">@{thread.author?.userName}</p>
                    </div>
                </div>

                <p className="mt-2 text-base md:text-lg whitespace-pre-wrap text-[var(--text)] leading-relaxed">
                    {thread.caption || thread.content}
                </p>

                {thread.images?.length > 0 && (
                    <div className="mt-3 flex flex-col gap-3">
                        {thread.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                className="rounded-xl w-full max-h-[600px] object-contain border border-gray-700"
                            />
                        ))}
                    </div>
                )}

                {thread.mediaType === "video" && thread.video && (
                    <video
                        src={thread.video}
                        controls
                        className="w-full max-h-[400px] rounded-xl mt-3 border border-gray-700 object-contain"
                    />
                )}

                {thread.quoteThread && (
                    <div className="bg-[#181818] mt-5 p-4 rounded-lg border border-gray-800">
                        <p
                            className="text-sm font-semibold text-gray-300 cursor-pointer"
                            onClick={() => navigate(`/profile/${thread.quoteThread.author?.userName}`)}
                        >
                            @{thread.quoteThread.author?.userName}
                        </p>

                        <p className="text-gray-200 text-sm mt-1">{thread.quoteThread.content}</p>

                        {thread.quoteThread?.images?.length > 0 && (
                            <div className="mt-2 flex flex-col gap-2">
                                {thread.quoteThread.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        className="rounded-xl w-full max-h-[500px] object-contain border border-gray-700"
                                    />
                                ))}
                            </div>
                        )}

                        {thread.quoteThread.mediaType === "video" && thread.quoteThread.video && (
                            <video
                                src={thread.quoteThread.video}
                                controls
                                className="w-full max-h-[300px] rounded-xl mt-2 border border-gray-700 object-contain"
                            />
                        )}
                    </div>
                )}

                <div className="mt-5">
                    <h4 className="font-semibold border-gray-800 text-[var(--text)] mb-2 text-sm md:text-base">Comments</h4>
                    {thread.comments?.length === 0 ? (
                        <p className="text-[var(--text)] text-sm">No comments yet…</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {thread.comments.map((c) => (
                                <div key={c._id} className="py-2 border-b text-[var(--text)] border-gray-800 flex gap-2 items-start">
                                    <span
                                        onClick={() => navigate(`/profile/${c.author?.userName}`)}
                                        className="font-semibold cursor-pointer hover:underline text-sm md:text-base"
                                    >
                                        @{c.author?.userName}
                                    </span>
                                    <span className="text-[var(--text1)] text-[var(--text)] text-sm md:text-base">{c.content}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default ThreadPreview;
