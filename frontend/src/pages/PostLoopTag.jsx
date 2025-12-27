import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import Threads from "../component/Threads";
import { setTagPosts } from "../redux/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Post from "../component/Post";
import Loops from "./Loops";
import LoopCard from "../component/LoopCard";
import { div } from "framer-motion/client";

function PostLoopTag() {
    const [showPost, setShowPost] = useState(true)
    const [showLoop, setShowLoop] = useState(false)
    const [showThread, setShowThread] = useState(false)
    const { tag } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tagPosts } = useSelector(state => state.post);

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`${serverUrl}/api/post/tag/${tag}`, {
                withCredentials: true
            });
            dispatch(setTagPosts(res.data));
        };
        fetch();
    }, [tag, dispatch]);

    return (
        <div className="bg-[var(--bg)]
        
                min-h-screen w-full 
                flex justify-center
                overflow-y-scroll scrollbar-none">


            <div className='w-full h-20 flex fixed left-5 items-center gap-5 px-5'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                    className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-[var(--text)] text-[20px] font-semibold'>HashTag Posts</h1>
            </div>



            <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[55%] 
                        border-x border-gray-700">


                <div className="sticky top-0 backdrop-blur-lg z-20
                            px-5 py-3 border-b border-gray-700 
                            bg-[var(--primary)] flex flex-col gap-1">

                    <h1 className="text-2xl font-extrabold tracking-wide 
                               bg-gradient-to-r from-purple-500 to-blue-500 
                               text-transparent bg-clip-text drop-shadow-lg">
                        #{tag}
                    </h1>

                    <p className="text-[var(--text)] font-bold text-sm">
                        Trending Posts ✨
                    </p>
                </div>

                <div className="px-4 mt-3 h-[calc(100vh-90px)]  overflow-y-scroll scrollbar-none">

                    <div className="flex justify-around text-sm sm:text-lg">

                        <div
                            className={`font-bold text-[var(--text)] cursor-pointer mb-3
                                        text-base sm:text-xl px-3 sm:px-5
                                         ${showPost ? "border-b-4 border-blue-500" : ""}
                                        `}
                            onClick={() => {
                                setShowPost(true)
                                setShowLoop(false)
                                setShowThread(false)
                            }}
                        >
                            Trending Posts
                        </div>


                        <div
                            className={`font-bold text-[var(--text)] cursor-pointer mb-3
                                        text-base sm:text-xl px-3 sm:px-5
                                         ${showLoop ? "border-b-4 border-blue-500" : ""}
                                        `}
                            onClick={() => {
                                setShowPost(false)
                                setShowLoop(true)
                                setShowThread(false)
                            }}
                        >
                            Trending Loops
                        </div>

                        <div
                            className={`font-bold text-[var(--text)] cursor-pointer mb-3
                                     text-base sm:text-xl px-3 sm:px-5
                                     ${showThread ? "border-b-4 border-blue-500" : ""}
                                        `}
                            onClick={() => {
                                setShowThread(true)
                                setShowPost(false)
                                setShowLoop(false)
                            }}
                        >
                            Trending Threads
                        </div>
                    </div>


                    {showPost &&
                        tagPosts.filter(item => item.mediaType === "post").length === 0 ? (
                            <div className="flex flex-col items-center mt-20 text-gray-400">
                                <span className="text-5xl mb-2">🎥</span>
                                <p className="text-sm sm:text-base">
                                    No Posts found for <span className="text-blue-500">#{tag}</span>
                                </p>
                            </div>) : (
                            <div className="flex flex-col justify-center items-center">

                                {showPost &&
                                    <>
                                        {/* Posts */}
                                        {tagPosts
                                            .filter(item => item.mediaType === "post")
                                            .map((p) => (
                                                <div className="mt-5">
                                                    <Post
                                                    key={p._id}
                                                    post={p}
                                                    posts={tagPosts}
                                                    setPosts={(data) => dispatch(setTagPosts(data))}
                                                    active={true}
                                                    disableDelete={false}
                                                />
                                                </div>
                                            ))}
                                    </>
                                }
                            </div>
                        )
                    }


                    {
                        showLoop && <>
                            {tagPosts.filter(item => item.mediaType === "loop").length === 0 ?

                                (<div className="flex flex-col items-center mt-20 text-gray-400">
                                    <span className="text-5xl mb-2">🎥</span>
                                    <p className="text-sm sm:text-base">
                                        No loops found for <span className="text-blue-500">#{tag}</span>
                                    </p>
                                </div>
                                )
                                :
                                (
                                    <div className="flex flex-col justify-center items-center">
                                        {tagPosts
                                            .filter(item => item.mediaType === "loop")
                                            .map((l) => (
                                                <LoopCard
                                                    key={l._id}
                                                    loop={l}
                                                    loops={tagPosts}
                                                    setLoops={(data) => dispatch(setTagPosts(data))}

                                                    fromHashTag={true}
                                                    active={true}
                                                    disableDelete={true}
                                                />
                                            ))}
                                    </div>
                                )

                            }



                        </>
                    }

                    {showThread &&
                    tagPosts.filter(item => item.mediaType === "thread").length === 0 ? (

                        <div className="flex flex-col items-center mt-20 text-gray-400">
                            <span className="text-5xl mb-2">🎥</span>
                            <p className="text-sm sm:text-base">
                                No Threads found for <span className="text-blue-500">#{tag}</span>
                            </p>
                        </div>

                        ) :
                        <div className="flex flex-col justify-center items-center">



                            {showThread &&
                                <div className="flex flex-col justify-center items-center">
                                    <Threads
                                        externalThreads={tagPosts.filter(item => item.mediaType === "thread")}
                                        HashTailwind={true} />

                                </div>
                            }

                        </div>
                    }

                </div>
            </div>

            <div className="hidden lg:flex items-center pr-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 
                             animate-pulse text-white px-4 py-1 text-xs 
                             rounded-full shadow-lg">
                    🔥 Trending Now
                </span>
            </div>
        </div>
    );

}

export default PostLoopTag