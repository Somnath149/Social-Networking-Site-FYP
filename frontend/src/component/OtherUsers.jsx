import React, { useState } from 'react'
import dp from "../assets/dp.png"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dp1 from "../assets/dp1.jpeg"
import FollowButton from './FollowButton'
function OtherUsers({ user, t,showbio }) {

    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)

    return (
        <div className='w-full h-[80px] flex items-center justify-between border-b-2 border-[var(--primary)] cursor-dot1'>
            <div className='flex items-center gap-[10px]'>
                <div className='w-[40px] h-[40px] border-2 border-[var(--primary)] rounded-full cursor-pointer overflow-hidden'
                    onClick={() => { navigate(`/profile/${user.userName}`) }}>
                    <img src={user.profileImage || dp1} alt="" className='w-full object-cover' />
                </div>
                <div>
                    <div className='text-[14px] text-[var(--text)] text-[var(--text)]  font-semibold'>
                        {user.name}
                    </div>
                    <div className='text-[12px] text-gray-400 font-semibold'>
                        {user.userName || userData.userName}
                    </div>
                    {showbio && <div className='text-[12px] text-gray-400 font-semibold'>
                        {user.bio}
                    </div>}

                </div>
            </div>
            <FollowButton 
            tailwind={`px-[10px] w-[100px] cursor-pointer py-[5px] h-[40px] rounded-2xl
                 transition-colors duration-300 ${t ? "bg-white hover:bg-black" 
                    : "bg-white hover:bg-black"}  text-black hover:text-white
                  transition-all`}
             targetUserId={user._id} />

        </div>
    )

}

export default OtherUsers
