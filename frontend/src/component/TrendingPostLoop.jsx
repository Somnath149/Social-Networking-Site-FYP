import React from 'react'
import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { setAllTrending, setTodayTrending } from '../redux/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

function TrendingPostLoop({ tp, show }) {
    const [input, setInput] = useState("")
    const navigate = useNavigate()
    const loadTrending = () => async (dispatch) => {
        try {
            const today = await axios.get("/api/post/trending/today");
            dispatch(setTodayTrending(today.data));

            const all = await axios.get("/api/post/trending/all");
            dispatch(setAllTrending(all.data));
        } catch (err) {
            console.log("Trending post and loop fetch error", err);
        }
    };

    const dispatch = useDispatch();
    const { todayTrending, allTrending } = useSelector(state => state.post);
    const [showToday, setshowToday] = useState(true)
    const [showAllTime, setShowAllTime] = useState(false)
    const [filteredToday, setFilteredToday] = useState([]);
    const [filteredAll, setFilteredAll] = useState([]);
    const [allLimit, setAllLimit] = useState(10);

    useEffect(() => {
        dispatch(loadTrending());
    }, []);

    useEffect(() => {
        const search = input.trim().toLowerCase();

        const ft = todayTrending.filter(t =>
            (t.tag || t._id).toLowerCase().includes(search)
        );
        setFilteredToday(ft);

        const fa = allTrending.filter(t =>
            (t.tag || t._id).toLowerCase().includes(search)
        );
        setFilteredAll(fa);

    }, [input, todayTrending, allTrending]);


    return (
        <div
            className={
                tp
                    ? "lg:w-[50%] w-full max-h-[100vh] flex flex-col bg-[var(--bg)] gap-[20px] p-[10px]"
                    : `${show ? "w-full lg:w-[50%] bg-[var(--bg)] h-screen overflow-y-scroll" : "w-full bg-[var(--bg)] h-screen overflow-y-scroll"}`
            }
        >

            {tp ? (<div className='w-full h-full  relative'>
                <div className='w-[25%] h-[80px] absolute hidden sm:hidden md:flex top-0  flex
                     items-center justify-between px-4 bg-[var(--bg)] gap-5 z-50'>

                    <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                        className='text-[var(--text)] cursor-pointer lg:hidden w-[30px] h-[30px]' />

                    <h1 className='text-[var(--text)] text-[20px] font-semibold'>Trending Tags</h1>

                    <div
                        onClick={() => navigate(`/threads`)}
                        className="text-[25px] mr-0 font-bold text-gray-400 flex gap-0.5 select-none"
                    >
                        {["T", "H", "R", "E", "A", "D"].map((l, i) => (
                            <span
                                key={i}
                                className="transition-all duration-300 shake-hover
                 hover:text-cyan-400 hover:scale-125 hover:-translate-y-1 
                 hover:drop-shadow-[0_0_10px_#0ff]
                 active:scale-95"
                            >
                                {l}
                            </span>
                        ))}
                    </div>
                </div>

                <div className='pt-20 flex flex-col gap-5'>
                    <div className="w-75 max-h-[50vh] overflow-y-auto pr-2">

                        {filteredToday && (
                            <div className="bg-[var(--primary)] rounded-2xl p-4">
                                <h2 className={`text-[var(--text)] text-lg font-semibold mb-3`}>
                                    Today's Trending
                                </h2>

                                {filteredToday?.length === 0 && (
                                    <p className="text-[var(--text)]">No trending hashtags</p>
                                )}

                                {filteredToday?.map((t, i) => (
                                    <div key={i} className="mb-3 cursor-pointer mt-[18px]">

                                        <p className="text-[var(--text)]  font-semibold"
                                            onClick={() => navigate(`/plhashtag/${(t.tag || t._id).replace("#", "")}`)}>{t.tag || t._id}</p>
                                        <span className="text-sm text-gray-500">
                                            {t.count} posts
                                        </span>
                                        <hr className="border-gray-700 my-3" />
                                    </div>
                                ))}


                                <button
                                    className="text-white font-bold mt-3"
                                    onClick={() => navigate("/trendingpage")}
                                >
                                    Show more
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="w-75 max-h-[50vh] pr-2">




                        {filteredAll && (
                            <div className="bg-[var(--primary)] rounded-2xl p-4">
                                <h2 className={`text-[var(--text)] text-lg font-semibold mb-3`}>
                                    All Time Trending
                                </h2>

                        {filteredAll?.length === 0 && (
                            <p className="text-[var(--text)]">No trending hashtags</p>
                        )}
                                {filteredAll?.map((t, i) => (
                                    <div key={i} className="mb-3 cursor-pointer mt-[18px]">
                                        <p className="text-[var(--text)]  font-semibold"
                                            onClick={() => navigate(`/plhashtag/${(t.tag || t._id).replace("#", "")}`)}>{t.tag || t._id}</p>
                                        <span className="text-sm text-gray-500">
                                            {t.count} posts
                                        </span>
                                        <hr className="border-gray-700 my-3" />
                                    </div>
                                ))}


                                <button
                                    className="text-white font-bold mt-3"
                                    onClick={() => navigate("/trendingpage")}
                                >
                                    Show more
                                </button>
                            </div>
                        )}
                    </div>
                </div>



            </div>) :

                (
                    <>
                        <div className='w-[100%] flex justify-center items-center px-5 mt-[10px]'>
                            {!show &&
                                <MdOutlineKeyboardBackspace onClick={() => navigate(-1)}
                                    className='text-[var(--text)]  cursor-pointer  w-[26px] h-[26px]' />}
                            <form className='w-full h-[40px] bg-[var(--primary)] rounded-full px-[15px] flex items-center gap-[10px]' >
                                <FiSearch className='w-[20px] h-[20px] text-[var(--text)]' />
                                <input
                                    type="text"
                                    placeholder='Search...'
                                    className='text-[var(--text)] w-full h-full outline-0 bg-transparent'
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                />
                            </form>
                        </div>

                        <div className="bg-[var(--primary)] p-4 rounded-2xl mt-4 w-full sm:w-[96%] mx-auto">
                            <div className="flex justify-around text-sm sm:text-lg">
                                <div
                                    className={`font-bold text-[var(--text)] cursor-pointer mb-3
        text-base sm:text-xl px-3 sm:px-5
        ${showToday ? "border-b-4 border-blue-500" : ""}
      `}
                                    onClick={() => {
                                        setshowToday(true)
                                        setShowAllTime(false)
                                    }}
                                >
                                    Today’s Trending
                                </div>


                                <div
                                    className={`font-bold text-[var(--text)] cursor-pointer mb-3
        text-base sm:text-xl px-3 sm:px-5
        ${showAllTime ? "border-b-4 border-blue-500" : ""}
      `}
                                    onClick={() => {
                                        setShowAllTime(true)
                                        setshowToday(false)
                                    }}
                                >
                                    All Time Trending
                                </div>
                            </div>

                            {showToday && filteredToday?.length === 0 && (
                                <p className="text-[var(--text)] text-center mt-4">No trending hashtags today.</p>
                            )}

                            {showToday && filteredToday?.map((t, i) => (
                                <div
                                    key={i}
                                    className="mb-4 cursor-pointer mt-5"
                                    onClick={() => navigate(`/plhashtag/${(t.tag || t._id).replace("#", "")}`)}
                                >
                                    <p className="text-[var(--text)] font-semibold text-base sm:text-lg">{t.tag || t._id}</p>
                                    <span className="text-sm text-[var(--text)]">{t.count} posts</span>
                                    <hr className="border-gray-700 my-3" />
                                </div>
                            ))}

                            {showAllTime && filteredAll?.slice(0, allLimit).map((t, i) => (
                                <div
                                    key={i}
                                    className="mb-4 cursor-pointer mt-5"
                                    onClick={() => navigate(`/plhashtag/${(t.tag || t._id).replace("#", "")}`)}
                                >
                                    <p className="text-[var(--text)] font-semibold text-base sm:text-lg">{t.tag || t._id}</p>
                                    <span className="text-sm text-[var(--text)]">{t.count} posts</span>
                                    <hr className="border-gray-700 my-3" />
                                </div>
                            ))}

                            {!showToday && filteredAll.length > 0   && allLimit < filteredAll.length && (
                                <button onClick={() => setAllLimit(allLimit + 10)} className="text-[var(--text)] font-bold">
                                    Show more
                                </button>
                            )}
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default TrendingPostLoop
