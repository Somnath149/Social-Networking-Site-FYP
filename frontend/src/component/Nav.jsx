import React from 'react';
import { FaSearch, FaPlusSquare, FaFilm } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dp1 from "../assets/dp1.jpeg";

function Nav() {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);
    const  previewThread  = useSelector(state => state.thread.previewThread)

    return (
        <>
        {
            previewThread === null && 
             <div className='
            w-[90%] lg:w-[40%] h-[80px] flex justify-around items-center
            fixed bottom-[20px] rounded-full
             shadow-blue-400/50 z-111
             bg-gradient-to-b from-gray-900/40 via-black/60 to-gray-900/40
            backdrop-blur-2xl 
            border border-white/10
        '>

            <div className='relative flex flex-col items-center group cursor-pointer' onClick={() => navigate(`/`)}>
                <FiHome className='text-white w-[20px] h-[20px] transition-all duration-300 transform
                    group-hover:scale-125 group-hover:-translate-y-1 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_10px_#1DA1F2]'/>
                <span className='absolute -top-8 text-xs text-white bg-black/70 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200'>
                    Home
                </span>
            </div>


            <div className='relative flex flex-col items-center group cursor-pointer' onClick={() => navigate(`/search`)}>
                <FaSearch className='text-white w-[20px] h-[20px] transition-all duration-300 transform
                    group-hover:scale-125 group-hover:-translate-y-1 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_10px_#1DA1F2]'/>
                <span className='absolute -top-8 text-xs text-white bg-black/70 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200'>
                    Search
                </span>
            </div>

            <div className='relative flex flex-col items-center group cursor-pointer' onClick={() => navigate(`/threads`)}>
                <div
                    className="
    w-12 h-12
    bg-white         
    transition-all duration-300
    group-hover:bg-blue-400
    group-hover:scale-125
    group-hover:-translate-y-1
    group-hover:drop-shadow-[0_0_10px_#1DA1F2]
    mask-[url('/yibely.png')]
    mask-no-repeat mask-center mask-contain
  "
                />

                <span className='absolute -top-5 text-xs text-white bg-black/70 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200'>
                    Yibely
                </span>
            </div>

            <div className='relative flex flex-col items-center group cursor-pointer' onClick={() => navigate(`/loops`)}>
                <FaFilm className='text-white w-[20px] h-[20px] transition-all duration-300 transform
                    group-hover:scale-125 group-hover:-translate-y-1 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_10px_#1DA1F2]'/>
                <span className='absolute -top-8 text-xs text-white bg-black/70 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200'>
                    Loops
                </span>
            </div>

            <div className='w-[40px] h-[40px] border-2 border-blue-400/40 rounded-full cursor-pointer overflow-hidden transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_15px_rgba(29,161,242,0.7)]'
                onClick={() => navigate(`/profile/${userData.userName}`)}>
                <img src={userData.profileImage || dp1} alt="Profile" className='w-full h-full object-cover' />
            </div>
        </div>
        
        
        }
       </>
    );
}

export default Nav;
