import React from 'react';
import dp from "../assets/dp.png";
import { Heart, UserPlus, MessageCircle, MoreHorizontal } from 'lucide-react';

function NotificationCard({ noti }) {

  const getIcon = (message) => {
    const msg = message?.toLowerCase();
    if (msg?.includes("liked")) return <Heart size={14} className="fill-red-500 text-red-500" />;
    if (msg?.includes("started following")) return <UserPlus size={14} className="text-blue-500" />;
    if (msg?.includes("commented")) return <MessageCircle size={14} className="text-emerald-500" />;
    return null;
  };

  return (
    <div className="group w-full p-4 flex gap-4 items-center bg-[var(--primary)] hover:bg-[var(--secondary)]
     border-b border-[var(--border)] transition-all duration-200">
      
      <div className="relative flex-shrink-0 cursor-pointer">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100
         group-hover:ring-[var(--primary)] transition-all">
          <img
            src={noti.sender?.profileImage || dp}
            alt={noti.sender?.userName}
            className="w-full h-full object-cover"
          />
        </div>
     
        <div className="absolute -bottom-1 -right-1 bg-[var(--bg)] p-1 rounded-full shadow-sm border border-gray-100">
          {getIcon(noti.message)}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[15px] font-bold text-[var(--text)] hover:underline cursor-pointer">
            {noti.sender?.userName || "Someone"}
          </span>
          <p className="text-[14px] text-[var(--text)] leading-tight">
            {noti?.message}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[12px] text-[var(--text)] font-medium">
            {noti.createdAt ? new Date(noti.createdAt).toLocaleDateString() : "Just now"}
          </span>
       
          {noti.message?.includes("follow") && (
            <button className="text-[12px] font-bold text-blue-600 hover:text-blue-700">
              Follow Back
            </button>
          )}
        </div>
      </div>

      {(noti.message?.includes("liked") || noti.message?.includes("commented")) && noti.postImage && (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
          <img src={noti.postImage} className="w-full h-full object-cover" alt="post" />
        </div>
      )}

    </div>
  );
}

export default NotificationCard;