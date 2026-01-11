import React, { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { setPreview } from "../redux/threadSlice";
import { useDispatch } from "react-redux";

function ThreadPreview({ thread, onClose }) {
    if (!thread) return null;

    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)
    const dispatch = useDispatch()
    const videoRef = useRef()
    const navigate = useNavigate();
    const handleClick = () => {
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

const renderCaption = (text) => {
        return text.split(" ").map((word, index) => {
            if (word.startsWith("#")) {
                return (
                    <span
                        key={index}
                        className="text-blue-500 cursor-pointer hover:underline mr-1"
                        onClick={() =>{ navigate(`/plhashtag/${word.substring(1)}`)
                    dispatch(setPreview(null))
                    }}
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
                    {renderCaption(thread.caption || thread.content)}
                    
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
                    <div>
                        <div className='absolute top-35 z-[100] right-70' onClick={() => setIsMuted(prev => !prev)}>
                            {!isMuted ? <FiVolume2 className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' /> :
                                <FiVolumeX className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' />}
                        </div>
                        <video
                            src={thread.video}
                            ref={videoRef}
                            onClick={handleClick}
                            playsInline
                            autoPlay
                            muted={isMuted}
                            loop
                            onLoadStart={() => setIsLoading(true)}
                            onLoadedData={() => setIsLoading(false)}
                            onCanPlay={() => setIsLoading(false)}
                            onWaiting={() => setIsLoading(true)}
                            onPlaying={() => setIsLoading(false)}
                            onStalled={() => setIsLoading(true)}
                            className="w-full max-h-[400px] rounded-xl mt-3 border border-gray-700 object-contain"
                        />
                        {isLoading && (
                            <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40">
                                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

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
                            <div>
                                <div className='absolute top-53 z-[100] right-76' onClick={() => setIsMuted(prev => !prev)}>
                            {!isMuted ? <FiVolume2 className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' /> :
                                <FiVolumeX className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' />}
                        </div>
                                <video
                                    src={thread.quoteThread.video}
                                    ref={videoRef}
                                    onClick={handleClick}
                                    playsInline
                                    autoPlay
                                    loop
                                    muted = {isMuted}
                                    onLoadStart={() => setIsLoading(true)}
                                    onLoadedData={() => setIsLoading(false)}
                                    onCanPlay={() => setIsLoading(false)}
                                    onWaiting={() => setIsLoading(true)}
                                    onPlaying={() => setIsLoading(false)}
                                    onStalled={() => setIsLoading(true)}
                                    className="w-full max-h-[300px] rounded-xl mt-2 border border-gray-700 object-contain"
                                />

                                {isLoading && (
                                    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40">
                                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
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
