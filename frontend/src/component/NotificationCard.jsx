import React from 'react'
import dp1 from "../assets/dp1.jpeg"
import dp from "../assets/dp.png"
function NotificationCard({ noti }) {
  return (
<div className="
  w-full h-[50px] flex justify-between items-center p-[5px] min-h-[50px]
  bg-[var(--secondary)] rounded-full 
  transition-transform duration-150 ease-in
  hover:scale-[1.02]
">
            <div className='flex gap-[10px] items-start'>
                <div className='w-[40px] h-[40px] border-2 border-[var(--primary)] rounded-full cursor-pointer overflow-hidden'>
                    <img
                        src={noti.sender?.profileImage || dp}
                        alt=""
                        className='w-full h-full object-cover'
                    />
                </div>

                <div className='flex flex-col'>
                    <h1 className='text-[16px] text-[var(--text)] font-semibold'>
                        {noti.sender?.userName}
                    </h1>
                    <div className='text-[15px] text-gray-700'>
                        {noti?.message}
                    </div>
                </div>
            </div>

            <div className='w-[40px] h-[40px] rounded-full overflow-hidden border-4 border-[var(--primary)]'>
                {noti.loop ? (
                    <video
                        src={noti.loop.media}
                        muted
                        loop
                        className='h-full w-full object-cover'
                    />
                ) : noti.post?.mediaType === "image" ? (
                    <img
                        src={noti.post.media}
                        className='h-full w-full object-cover'
                        alt=""
                    />
                ) : noti.post ? (
                    <video
                        src={noti.post.media}
                        muted
                        loop
                        className='h-full w-full object-cover'
                    />
                ) : null}
            </div>
        </div>
    );
}




export default NotificationCard
