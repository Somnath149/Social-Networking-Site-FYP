import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUsers from './OtherUsers';
import dp1 from "../assets/dp1.jpeg"
import { useNavigate } from 'react-router-dom';
import Notifications from '../pages/Notifications';
import PsyIncLogo from '../../public/PsyIncLogo';
import { FaPlusSquare } from 'react-icons/fa';

function LeftSide() {
    const [showNotifications, setShowNotifications] = useState(false)
    const [randomUsers, setRandomUsers] = useState([]);
    const { userData, suggestedUser, notificationData } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
    const getRandomUsers = (users, count) => {
        const shuffled = [...users].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    useEffect(() => {
        if (suggestedUser && randomUsers.length === 0) {
            setRandomUsers(getRandomUsers(suggestedUser, 7));
        }
    }, [suggestedUser]);

    return (
        <div className={`w-[25%] hidden lg:block h-[100vh] bg-[var(--bg)] border-r-2 border-gray-900 
        ${showNotifications ? "overflow-auto" : ""}`}>
            <div className='w-[full] h-[100px] flex items-center justify-between p-[20px]'>

                <div  onClick={() => navigate("/theme")} className='text-[40px] font-bold text-gray-400'>
                    <PsyIncLogo />
                </div>

<div className='flex gap-3 items-center'>

 <div className='relative flex flex-col items-center group cursor-pointer' onClick={() => navigate(`/upload`)}>
                <FaPlusSquare className='text-[var(--text)] cursor-dot1 w-[20px] h-[20px] transition-all duration-300 transform
                    group-hover:scale-125 group-hover:-translate-y-1 group-hover:text-blue-400 
                    group-hover:drop-shadow-[0_0_10px_#1DA1F2]'/>
               
            </div>

                <div className='relative ' onClick={() => setShowNotifications(prev => !prev)}>
                    <FaRegHeart
                        className=" cursor-dot1 text-[var(--text)] w-[25px] h-[25px] cursor-pointer hover:text-red-500
                         hover:animate-[beat_0.3s_ease-in-out]"
                    />
                    {notificationData?.length > 0 && notificationData.some((noti) => noti.isRead == false) &&
                        (<div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px] tiny-bounce'></div>)
                    }
                </div>
</div>
            </div>

            {!showNotifications && <>
                <div className='flex items-center w-full justify-between gap-[10px] px-[10px]'>
                    <div className='flex items-center gap-[10px]'>
                        <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                            <img src={userData.profileImage || dp1} alt="" className='w-full object-cover' />
                        </div>
                        <div>
                            <div className='text-[18px] text-[var(--text)] font-semibold'>
                                {userData.user?.name || userData.name}
                            </div>
                            <div className='text-[15px] text-gray-400 font-semibold'>
                                {userData.user?.userName || userData.userName}
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={handleLogOut}
                        className="text-[var(--text)] bg-[var(--primary)] hover:bg-[var(--secondary)] active:bg-[var(--primary)]
                        font-semibold px-4 py-2 rounded-lg shadow-md cursor-pointer 
                        transition-colors duration-200 ease-in-out select-none text-center cursor-dot1">
                        Log Out
                    </div>
                </div>

                <div className='w-full h-full flex flex-col gap-[20px] p-[20px]'>
                    <h1 className='text-[var(--text)] text-[19px]'>Suggested Users</h1>
<div className='max-h-[500px] overflow-y-auto'>
 {randomUsers.map((user, index) => (
                        <OtherUsers key={index} user={user} />
                    ))}
</div>
                   

                </div>
            </>}
            {showNotifications && <Notifications />}
        </div>
    )

}

export default LeftSide
