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
  <div className="w-full flex items-center justify-between gap-3 px-3 py-3
                  border-b border-[var(--primary)] cursor-dot1">

    <div className="flex items-center gap-3 min-w-0">
   
      <div
        className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0
                   border border-[var(--primary)]
                   rounded-full overflow-hidden cursor-pointer"
        onClick={() => navigate(`/profile/${user.userName}`)}
      >
        <img
          src={user.profileImage || dp1}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm md:text-base font-semibold
                         text-[var(--text)] truncate">
          {user.name}
        </span>

        <span className="text-xs md:text-sm
                         text-gray-400 truncate">
          @{user.userName || userData.userName}
        </span>

        {showbio && (
          <span className="text-xs text-gray-500 line-clamp-1">
            {user.bio}
          </span>
        )}
      </div>
    </div>

    <FollowButton
      tailwind="
        min-w-[90px] md:min-w-[110px]
        h-9 md:h-10 px-4
        text-sm font-medium
        rounded-full
        border border-black
        bg-white text-black
        hover:bg-black hover:text-white
        transition-all duration-300
        flex-shrink-0
      "
      targetUserId={user._id}
    />
  </div>
);


}

export default OtherUsers
