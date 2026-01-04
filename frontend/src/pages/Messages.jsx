import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import OnlineUser from '../component/OnlineUser'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../redux/messageSlice'
import dp1 from "../assets/dp1.jpeg"
import { MdForum } from "react-icons/md";
import ThreadTitle from '../../public/ThreadTitle'
import { div } from 'framer-motion/client'
import TrendingPostLoop from '../component/TrendingPostLoop'
import usePrevChatUsers from '../hooks/usePrevChatUsers'

function Messages({ mwidth, m }) {
  const navigate = useNavigate()
  usePrevChatUsers();
  const { userData } = useSelector(state => state.user)
  const { onlineUsers } = useSelector(state => state.socket)
  const { prevChatUsers, selectedUser } = useSelector(state => state.message)
  const dispatch = useDispatch()


  return (

    <div className={`${mwidth ? "lg:w-[60%] w-full min-h-[100vh] flex flex-col bg-[var(--bg)] gap-[20px] p-[10px]" :
      "w-full min-h-[100vh] flex flex-col bg-[var(--bg)] gap-[20px] p-[10px]"}`}>

      {!mwidth && !prevChatUsers?.length ? (<TrendingPostLoop tp={true} />) : (
        <>
          {!m && <div className={`w-full lg:w-[25%] h-[80px] fixed top-0 ${mwidth ? "right-[50%]" : "right-0"} 
           z-50 flex items-center justify-between px-4 bg-[var(--bg)]`}>

            <MdOutlineKeyboardBackspace
              onClick={() => navigate(`/`)}
              className="text-[var(--text)] cursor-pointer w-[30px] h-[30px] lg:hidden"
            />

            <h1 className="text-[var(--text)] text-[20px] font-semibold text-center flex-1 lg:text-left lg:flex-none">
              Messages
            </h1>

            {!mwidth && <div
             
              className="hidden lg:flex w-[25%] justify-end text-[30px] font-bold text-gray-400 gap-1 select-none"
            >
              {["Y", "I", "B", "E", "L", "Y"].map((l, i) => (
                <span
                  key={i}
                  className="transition-all duration-300 hover:text-cyan-400 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-[0_0_10px_#0ff] active:scale-95"
                >
                  {l}
                </span>
              ))}
            </div>}

            <div
              onClick={() => navigate(`/threads`)}
              className="lg:hidden text-[30px] font-bold text-gray-400"
            >
              THREAD
            </div>
          </div>}

          <hr className='
  w-full h-[80px] 
  border-b-2 border-[var(--border)]
'>
          </hr>

          <div className="h-[calc(100vh-160px)]  flex flex-col">

            <div className="flex-1 overflow-y-auto  flex flex-col gap-[20px]">

              {prevChatUsers
                ?.filter(user => onlineUsers.includes(user._id))
                .map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-[20px] p-2 cursor-pointer
          ${mwidth ? "lg:w-[50%] w-full" : "w-full"}`}
                    onClick={() => {
                      dispatch(setSelectedUser(user));
                      navigate("/messageArea");
                    }}
                  >
                    <OnlineUser user={user} />
                    <div className="flex flex-col">
                      <div className="text-[var(--text)] text-[18px] font-semibold">{user.userName}</div>
                      <div className="text-[var(--text)] text-[15px]">Active Now</div>
                    </div>
                  </div>
                ))}

              {/* Offline users next */}
              {prevChatUsers
                ?.filter(user => !onlineUsers.includes(user._id))
                .map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-[20px] p-2 cursor-pointer
          ${mwidth ? "lg:w-[50%] w-full" : "w-full"}`}
                    onClick={() => {
                      dispatch(setSelectedUser(user));
                      navigate("/messageArea");
                    }}
                  >
                    <div
                      className="w-[50px] h-[50px] border-2 border-black rounded-full overflow-hidden cursor-dot1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${user.userName}`);
                      }}
                    >
                      <img
                        src={user.profileImage || dp1}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="text-[var(--text)] text-[18px] font-semibold">{user.userName}</div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </>
      )}


    </div>
  )


}

export default Messages
