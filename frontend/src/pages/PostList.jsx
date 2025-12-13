import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Post from "../component/Post";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function PostList({
    disableProfileClick,
    Ssrc,
    onPostClick,
    activeIndex,
    setActiveIndex,
    ExploreTailwind,
}) {
    const { postData } = useSelector((state) => state.post);
    const [randomPosts, setRandomPosts] = useState([]);
const navigate = useNavigate()
    const getRandomPosts = (posts) => [...posts].sort(() => 0.5 - Math.random());

    useEffect(() => {
        if (postData.length && randomPosts.length === 0) {
            setRandomPosts(getRandomPosts(postData));
        }
    }, [postData]);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    
    if (isMobile && activeIndex !== null) {
        return (
            <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
                
                {randomPosts.map((post, index) => (
                    <div
                        key={index}
                        className="w-full h-screen text-[var(--text)] bg-[var(--bg)]/80  snap-start flex items-center justify-center"
                    >
<div
  className="
    top-[12%] absolute left-4 z-50
    w-10 h-10
    flex items-center justify-center
    bg-black/50 backdrop-blur-md
    rounded-full
    shadow-md shadow-black/60
    border border-white/10
    cursor-pointer
  "
>
                                <MdOutlineKeyboardBackspace onClick={() => setActiveIndex(null)}
                                    className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />
                                
                            </div>
                        
                        <Post
                            post={post}
                            ExploreTailwind={false}
                            active={index === activeIndex}
                        
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            className={`w-full ${
                !ExploreTailwind
                    ? "overflow-y-scroll h-[calc(100vh-80px)] p-4"
                    : ""
            }`}
        >
            <div
                className={`${
                    ExploreTailwind
                        ? "columns-2 sm:columns-3 gap-2"
                        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4"
                }`}
            >
                {randomPosts.map((post, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`${
                            ExploreTailwind ? "mb-1 break-inside-avoid rounded-2xl " : ""
                        }`}
                    >
                        <Post
                            key={post._id || index}
                            post={post}
                            disableProfileClick={disableProfileClick}
                            Ssrc={Ssrc}
                            onPostClick={onPostClick}
                            ExploreTailwind={true}
                        />
                    </div>
                ))}
            </div>

            {activeIndex !== null && !isMobile && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-500">
                    <button
                        onClick={() => setActiveIndex(null)}
                        className="absolute top-5 right-5 cursor-dot1 text-[var(--text)] text-3xl"
                    >
                        ✕
                    </button>

                    {activeIndex > 0 && (
                        <button
                            onClick={() => setActiveIndex((prev) => prev - 1)}
                            className="absolute left-5 cursor-dot1 text-[var(--text)] text-3xl"
                        >
                            ‹
                        </button>
                    )}

                    <div className="w-full max-w-[500px] h-screen flex items-center  justify-center px-4">
                        <div className="w-full max-h-[90vh] overflow-y-auto ">
                            <Post
                                post={
                                    postData.find(
                                        (p) =>
                                            p._id ===
                                            randomPosts[activeIndex]._id
                                    ) || randomPosts[activeIndex]
                                }
                                ExploreTailwind={false}
                                active={true}
                            />
                        </div>
                    </div>

                    {activeIndex < randomPosts.length - 1 && (
                        <button
                            onClick={() => setActiveIndex((prev) => prev + 1)}
                            className="absolute right-5 cursor-dot1 text-[var(--text)] text-3xl"
                        >
                            ›
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostList;
