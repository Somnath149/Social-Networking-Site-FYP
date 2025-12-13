import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OtherUsers from '../component/OtherUsers';
import { FiSearch } from 'react-icons/fi';
import { setSearchData } from '../redux/userSlice';
import { serverUrl } from '../App';
import axios from 'axios';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function ForYou() {
    const dispatch = useDispatch();
 const navigate = useNavigate()
    const [randomUsers, setRandomUsers] = useState([]);
    const { userData, suggestedUser, searchData } = useSelector(state => state.user);
    const [input, setInput] = useState("");

    const getRandomUsers = (users, count) => {
        const shuffled = [...users].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const handleSearch = async () => {
        if (!input.trim()) {
            dispatch(setSearchData([]));
            return;
        }

        try {
            const result = await axios.get(
                `${serverUrl}/api/user/search?keyWord=${input}`,
                { withCredentials: true }
            );

            dispatch(setSearchData(result.data));
        } catch (error) {
            console.error("Search failed:", error)
        }
    };

    useEffect(() => {
        handleSearch();
    }, [input]);

    useEffect(() => {
        if (suggestedUser && randomUsers.length === 0) {
            const usersNotFollowed = suggestedUser.filter(
                u => !userData.following.includes(u._id) && u._id !== userData._id
            );

            setRandomUsers(getRandomUsers(usersNotFollowed, 15));
        }
    }, [suggestedUser, userData]);

    return (
        <div className='lg:w-[50%] w-full bg-[var(--primary)] h-screen overflow-y-scroll p-3'>

            {/* SEARCH INPUT */}
            <div className='w-full mb-4 flex items-center'>
                 <MdOutlineKeyboardBackspace onClick={() => navigate(`/threads`)}
                          className='text-[var(--text)] lg:hidden cursor-pointer lg:hidden w-[26px] h-[26px]' />
                <div className='w-full h-[40px] bg-[var(--bg)] rounded-full px-4 flex items-center gap-3'>
                    <FiSearch className='text-[var(--text)] w-[20px] h-[20px]' />
                    <input
                        type="text"
                        placeholder='Search...'
                        className='text-[var(--text)] w-full h-full bg-transparent outline-none'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                </div>
            </div>

            <h2 className="text-[var(--text)] text-xl font-bold pt-3 pb-2 border-t border-gray-700">
                Who to follow
            </h2>

            {input.trim() && (
                <div className="flex flex-col gap-3 mt-3">

                    {searchData.filter(u => u._id !== userData._id).length === 0 ? (
                   
                        <div className="w-full flex justify-center items-center py-10">
                            <p className="text-[var(--text)] text-center text-lg opacity-70">
                                No User Exist
                            </p>
                        </div>

                    ) : (
                     
                        searchData
                            .filter(u => u._id !== userData._id)
                            .map((user, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-[var(--bg)] hover:bg-[var(--secondary)] transition rounded-xl p-3">
                                    <OtherUsers user={user} showbio={true} />
                                </div>
                            ))
                    )}

                </div>
            )}

            {!input.trim() && (
                <div className="flex flex-col gap-3 mt-3">
                    {randomUsers.map((user, index) => (
                        <div
                            key={index}
                           
                            className="flex items-center bg-[var(--bg)]  hover:bg-[var(--secondary)] transition rounded-xl p-3"
                        >
                            <OtherUsers user={user} showbio={true} />
                        </div>
                    ))}
                </div>
            )}

        </div>
    );

}

export default ForYou;
