import React from "react";
import {
    RiHome7Fill,
    RiMessage2Line,
    RiUser3Line,
} from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import dp1 from "../assets/dp1.jpeg"
import axios from "axios";
import { FaCrown } from "react-icons/fa6";
import { RiSparkling2Line } from "react-icons/ri";

function ThreadNav({ setCenterView, setShowOtherUsers, setShowTrends }) {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const [showLogout, setShowLogout] = useState(false)
    const logout = useRef(null)
    const dispatch = useDispatch()
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showLogout && logout.current && !logout.current.contains(e.target)) {
                setShowLogout(false)
            }
        }

        if (showLogout) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showLogout])

    const handleLogOut = async () => {
        const ok = confirm("Do you want to logout?");
        if (!ok) return;
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="w-[30%] px-[20px] hidden lg:block h-[100vh] bg-[var(--bg)] border-r-2 border-gray-900 ">
            <div className='w-full h-[80px] flex   items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                    className='text-[var(--text)] cursor-dot1 cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-[var(--text)] text-[20px] font-semibold'>Threads</h1>
            </div>

            <div className="px-[20px] mt-3.5">

                <div className="flex flex-col gap-10 text-lg">

                    <div className="flex text-[var(--text)] justify-start cursor-pointer cursor-dot1 gap-4" onClick={() => {
                        setCenterView("threads")
                        setShowTrends(true)
                        setShowOtherUsers(true)
                    }}>
                        <RiHome7Fill className='text-[var(--text)] w-[25px] h-[25px] cursor-dot1 cursor-pointer  transition-transform
                        duration-150
                        hover:scale-110'
                        />Home</div>
                  
                  <div className="flex text-[var(--text)] justify-start cursor-dot1 cursor-pointer gap-4" 
                    onClick={() => setCenterView("foryou")}>
                        <RiSparkling2Line  className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer  transition-transform
                        duration-150
                        hover:scale-110'
                        /> For You</div>

                    <div className="flex text-[var(--text)] justify-start cursor-dot1 cursor-pointer gap-4"
                     onClick={() => navigate(`/Search`)}>
                        <IoSearchOutline className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer  transition-transform
                        duration-150
                        hover:scale-110'
                        /> Search</div>
                    
                    <div className="flex text-[var(--text)] justify-start cursor-dot1 cursor-pointer gap-4" 
                    onClick={() => setCenterView("notifications")}>
                        <IoNotificationsOutline className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer  transition-transform
                        duration-150
                        hover:scale-110'
                        />Notifications</div>

                    <div className="flex text-[var(--text)] justify-start cursor-dot1 cursor-pointer gap-4" 
                    onClick={() => setCenterView("messages")}>
                        <RiMessage2Line className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer  transition-transform
                        duration-150
                        hover:scale-110'
                        />Messages</div>

                    <div className="flex text-[var(--text)] justify-start cursor-pointer gap-4" 
                    onClick={() => setCenterView("king")}>
                        <FaCrown className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer  transition-transform
                        duration-150
                        hover:scale-110'
                            onClick={() => navigate(`/threads`)} />Kings</div>

                    <div className="flex  text-[var(--text)] justify-start cursor-dot1 cursor-pointer gap-4"
                     onClick={() => navigate(`/profile/${userData.userName}`)}>
                        <RiUser3Line className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer  transition-transform
                        duration-150
                        hover:scale-110'
                        />Profile</div>
                </div>

            </div>

            {showLogout &&
                <div ref={logout}
                    onClick={handleLogOut}
                    className="absolute pl-3.5 border-2 cursor-pointer bg-[var(--primary)] hover:bg-[var(--secondary)] border-gray-700
                 text-[var(--text)] w-[15%] rounded-2xl flex flex-col justify-center h-[10%]">
                    <span>Log Out</span>
                    <span>{userData.userName}</span>
                </div>}

            <div className="flex items-center cursor-dot1 gap-3 p-5 mt-18 hover:bg-[var(--secondary)] rounded-xl cursor-pointer duration-200"
                onClick={() => setShowLogout(true)}>
                <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'
                >
                    <img src={userData.profileImage || dp1} alt="" className='w-full object-cover' />
                </div>
                <div>
                    <p className="text-[var(--text)] font-semibold text-sm">{userData.name}</p>
                    <p className="text-xs text-gray-400">{userData.userName}</p>
                </div>
            </div>
        </div>
    );

}

export default ThreadNav;
