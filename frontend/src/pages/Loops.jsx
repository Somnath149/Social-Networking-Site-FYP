import React, { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import LoopCard from "../component/LoopCard";
import useLoopFeed from "../hooks/useLoopFeed";

function Loops() {
    const navigate = useNavigate();
    const location = useLocation();
const hasScrolledRef = useRef(false);

    const query = new URLSearchParams(location.search);
    const userId = query.get("user");
    const startLoopId = query.get("start");

    const { feedData, hasMore, loopData } = useSelector(s => s.loop);
    const { loadInitialFeed, loadMoreFeed } = useLoopFeed();

    const observer = useRef();

    // user feed
    const userFeed = userId
        ? loopData.filter(l => l.author?._id === userId)
         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

    // global feed
    const uniqueFeed = Array.from(
        new Map(feedData.map(item => [item._id, item])).values()
    );

    // active feed
    const activeFeed = userId ? userFeed : uniqueFeed;

    const lastRef = useCallback(node => {
        if (userId) return;          
        if (!hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) loadMoreFeed();
        });

        if (node) observer.current.observe(node);
    }, [hasMore, userId]);

    // first load
    useEffect(() => {
        if (!userId) loadInitialFeed();
    }, [userId]);

    useEffect(() => {
  if (!startLoopId) return;
  if (hasScrolledRef.current) return;

  const el = document.getElementById(startLoopId);
  if (el) {
    el.scrollIntoView({ behavior: "instant" });
    hasScrolledRef.current = true;
  }
}, [startLoopId]);


    return (
        <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center">

            <div className="w-full h-[80px] flex fixed left-[20px] top-[20px] gap-[20px] px-[20px] z-[100]">
                <MdOutlineKeyboardBackspace
                    onClick={() => navigate(-1)}
                    className="text-white cursor-pointer w-[25px] h-[25px]"
                />
                <h1 className="text-white text-[20px] font-semibold">Loops</h1>
            </div>

            <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                {activeFeed.map((loop, i) => (
                    <div
                        key={loop._id}
                        id={loop._id}       
                        ref={i === activeFeed.length - 1 ? lastRef : null} 
                        className="h-screen snap-start"
                    >
                        <LoopCard loop={loop} />
                    </div>
                ))}

                {!userId && hasMore && (
                    <div className="text-center text-white py-4 text-lg">
                        Loading more...
                    </div>
                )}
            </div>
        </div>
    );
}

export default Loops;
