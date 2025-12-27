import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { serverUrl } from '../App'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setSearchData, setUserData } from '../redux/userSlice'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import dp from "../assets/dp.png"
import Nav from '../component/Nav'
import dp1 from "../assets/dp1.jpeg"
import FollowButton from '../component/FollowButton'
import Post from '../component/Post'
import { setSelectedUser } from '../redux/messageSlice'
import Search from './Search'
import { FiSearch } from 'react-icons/fi'
import { div } from 'framer-motion/client'
import ThreadNav from '../component/ThreadNav'
import Threads from '../component/Threads'
import { setThreads } from '../redux/threadSlice'
import Retweets from '../component/Retweets'
import Comment from '../component/Comment'
import Quote from '../component/Quote'
import LoopCard from '../component/LoopCard'
import { Settings } from "lucide-react";

function Profile() {
  const [PostType, setPostType] = useState("allPost")
  const [input, setInput] = useState("")
  const followersRef = useRef(null);
  const followingRef = useRef(null);
  const navigate = useNavigate()
  const { userName } = useParams()
  const dispatch = useDispatch()
  const { profileData, userData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.post)
  const { loopData } = useSelector(state => state.loop)
  const { searchData } = useSelector(state => state.user)
  const { threads } = useSelector((state) => state.thread);
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [showRetweet, setShowRetweet] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [showPost, setShowPost] = useState(true)
  const [replies, setReplies] = useState(false)
  const { weeklyKing } = useSelector(state => state.user);
const [showWeeklyCard, setShowWeeklyCard] = useState(true);

  const handleProfile = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true })
      dispatch(setProfileData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (showFollowing && followingRef.current && !followingRef.current.contains(e.target)) {
        setShowFollowing(false);
      }

      if (showFollowers && followersRef.current && !followersRef.current.contains(e.target)) {
        setShowFollowers(false);
      }
    };

    if (showFollowing || showFollowers) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFollowing, showFollowers]);


  useEffect(() => {
    handleProfile()
  }, [userName, dispatch])

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

  const a = profileData?.loops.length + profileData?.posts.length

  return (
    <>
      <div className={`w-full h-screen bg-[var(--bg)] ${showFollowers || showFollowing ? "blur-sm" : "overflow-y-auto"}`}>
        <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-[var(--text)]'>
          <div className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer'
            onClick={() => navigate("/")}><MdOutlineKeyboardBackspace
              className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' /></div>
          <div className='font-semibold text-[20px]'>{profileData?.userName}</div>

          <div className='flex items-center gap-2'>
            <Settings size={24} className="text-[var(--text)] drop-shadow  hover:rotate-180 duration-700"
              onClick={() => navigate("/setting")}
            />
            <div className='font-semibold cursor-pointer text-[20px]' onClick={() => handleLogOut()}>Log out</div>
          </div>

        </div>

        <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px]  justify-center'>

{/* 🏆 Weekly Score Card */}

{showWeeklyCard && userData?._id === profileData?._id && profileData.weeklyKingScore > 0 && (
   <div
    className={`fixed inset-0 flex items-center justify-center z-111 
      bg-black/50 backdrop-blur-sm transition-opacity duration-500
      ${showWeeklyCard ? 'opacity-100' : 'opacity-0'}`}
  >
    <div
      className={`bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600
        p-6 rounded-2xl shadow-2xl border-2 border-yellow-300 w-[300px] md:w-[400px]
        transform transition-all duration-500
        ${showWeeklyCard ? 'scale-100' : 'scale-90 opacity-0'}`}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl drop-shadow-lg animate-bounce">👑</span>
        <h2 className="text-xl md:text-2xl font-bold text-black">{profileData.name}</h2>
        <p className="text-sm md:text-base text-black/80">Weekly Score</p>
        <div className="text-3xl md:text-4xl font-extrabold text-black">{profileData.weeklyKingScore || 0} pts</div>
        <div className="mt-3">
          <button
            className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
            onClick={() => setShowWeeklyCard(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      
          {weeklyKing?._id === profileData?._id ? (

            <div className="relative w-[140px] h-[140px] flex items-center justify-center">

              <div className="
    absolute inset-0 rounded-full
    bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600
    blur-[6px] opacity-70
  " />

              <div className="
    absolute inset-[6px] rounded-full
    bg-gradient-to-br from-[#3a2a00] via-[#1a1400] to-[#000]
    shadow-[0_0_40px_rgba(255,200,0,0.8)]
  " />

              <div className="relative w-[120px] h-[120px]">

                <div className="
    absolute inset-0 rounded-full
    bg-gradient-to-tr from-yellow-300 via-orange-500 to-yellow-300
    animate-spin-slow
  " />

                <div className="absolute inset-[5px] rounded-full bg-black" />

                <div className="absolute inset-[8px] rounded-full overflow-hidden">
                  <img
                    src={profileData?.profileImage || dp1}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="
  absolute -bottom-1 -right-1
  z-50
  bg-gradient-to-r from-yellow-400 to-orange-500
  text-black text-[11px] font-extrabold
  px-2 py-[2px]
  rounded-full
  shadow-[0_4px_12px_rgba(255,180,0,0.9)]
  border border-yellow-300
">
                  👑 KING
                </div>

              </div>


              <span className="
    absolute -top-8 text-5xl
    drop-shadow-[0_10px_20px_rgba(255,215,0,0.8)]
    animate-float-crown
  ">
                👑
              </span>

            </div>

          ) : (

            /* 🙂 NORMAL USER DP */
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-gray-600">
              <img
                src={profileData?.profileImage || dp1}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <div className='font-semibold text-[22px] text-[var(--text)]'>{profileData?.name}</div>
            <div className='text-[17px] text-[var(--text)]'>{profileData?.profession || "new User"}</div>
            <div className='text-[17px] text-[var(--text)]'>{profileData?.bio}</div>
          </div>
        </div>

        <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-[var(--text)]'>
          <div>
            <div className='text-[var(--text)] text-[22px] md:text-[30px] font-semibold'>{a}</div>
            <div className='text-[18px] md:text-[22px] text-[var(--text)]'>Posts</div>
          </div>




          <div className='cursor-pointer' onClick={() => setShowFollowing(true)}>
            <div className='flex items-center justify-center gap-8'>

              <div className='flex relative w-[35px] h-10'>
                {
                  profileData?.following?.slice(0, 3).map((user, index) => (
                    <div
                      key={user._id}
                      className={`w-10 h-10 rounded-full border-2 border-black overflow-hidden cursor-pointer absolute`}
                      style={{ left: `${index * 12}px` }} // spacing adjustable
                    >
                      <img src={user.profileImage || dp1} alt="" className='w-full object-cover' />
                    </div>
                  ))
                }
              </div>

              <div className='text-[var(--text)] text-[22px] md:text-[30px] font-semibold'>{profileData?.following.length}</div>
            </div>
            <div className='text-[18px] md:text-[22px] text-[var(--text)]'>Following</div>
          </div>



          <div className='cursor-pointer' onClick={() => setShowFollowers(true)}>
            <div className='flex items-center justify-center gap-8'>

              <div className="flex relative w-[35px] h-10">
                {profileData?.followers?.slice(0, 3).map((user, index) => (
                  <div
                    key={user._id}
                    className={`w-10 h-10 rounded-full border-2 border-black overflow-hidden cursor-pointer absolute`}
                    style={{ left: `${index * 12}px` }} // spacing adjustable
                  >
                    <img
                      src={user.profileImage || dp1}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className='text-[var(--text)] text-[22px] md:text-[30px] font-semibold'>{profileData?.followers.length}</div>
            </div>

            <div className='text-[18px] md:text-[22px] text-[var(--text)]'>Followers</div>
          </div>

        </div>

        <div className='w-full h-[80px] flex justify-center items-center gap-[20px]'>
          {profileData?._id == userData._id
            &&
            <button className='px-[10px] min-w-[150px] py-[5px] h-940px] bg-[white] cursor-pointer rounded-2xl' onClick={() => navigate("/editprofile")}>Edit Profile</button>
          }

          {profileData?._id != userData._id
            &&
            <>
              <FollowButton tailwind={'px-[10px] min-w-[150px] py-[5px] h-940px] bg-[white] cursor-pointer rounded-2xl'}
                targetUserId={profileData?._id} onFollowChange={handleProfile} />
              <button className='px-[10px] min-w-[150px] py-[5px] h-940px] bg-[white] cursor-pointer rounded-2xl'
                onClick={() => {
                  dispatch(setSelectedUser(profileData))
                  navigate("/messageArea")
                }}>Message</button>
            </>
          }
        </div>

        <div className='w-full min-h-max flex justify-center'>
          <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]'>

            <div className='w-[90%] max-w-[500px] h-[80px] mt-4 bg-[white] rounded-full flex justify-center items-center gap-[10px]'>

              <div
                className={`${PostType === "allPost" ? "bg-[var(--secondary)] text-[var(--text)] shadow-2xl shadow-black" : ""}
      w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold
      hover:bg-[var(--bg)] hover:text-[var(--text)] cursor-pointer rounded-full`}
                onClick={() => {
                  setPostType("allPost");
                  setShowPost(true);
                  setShowRetweet(false);
                  setShowQuote(false);
                  setReplies(false)
                }}>
                Posts
              </div>

              <div
                className={`${PostType === "allLoop" ? "bg-[var(--secondary)] text-[var(--text)] shadow-2xl shadow-black" : ""}
      w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold
      hover:bg-[var(--bg)] hover:text-[var(--text)] cursor-pointer rounded-full`}
                onClick={() => {
                  setPostType("allLoop");
                  setShowPost(true);
                  setShowRetweet(false);
                  setShowQuote(false);
                  setReplies(false)
                }}>
                Loop
              </div>

              {profileData?._id === userData._id && (
                <div
                  className={`${PostType === "Saved" ? "bg-[var(--secondary)] text-[var(--text)] shadow-2xl shadow-black" : ""} 
      w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold
      hover:bg-[var(--bg)] hover:text-[var(--text)] cursor-pointer rounded-full`}
                  onClick={() => setPostType("Saved")}>
                  Saved
                </div>
              )}

              <div
                className={`${PostType === "Threads" ? "bg-[var(--secondary)] text-[var(--text)] shadow-2xl shadow-black" : ""} 
      w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold
      hover:bg-[var(--bg)] hover:text-[var(--text)] cursor-pointer rounded-full`}
                onClick={() => setPostType("Threads")}>
                Threads
              </div>
            </div>

            <Nav />
            {PostType === "allPost" &&
              (
                profileData?.posts.length === 0 ? (
                  <p className="text-center text-gray-500 text-lg sm:text-xl font-semibold mt-10 mb-10">
                    Don't have any posts yet...
                  </p>
                ) :
                  (
                    postData.map((post, index) =>
                      post.author?._id === profileData?._id && (
                        <Post post={post} key={index} disableDelete={true} />
                      )
                    )
                  )
              )}

            <div className={` ${profileData?.loops.length === 0 ? "" : "bg-white"} flex flex-col gap-8`}>
              {PostType === "allLoop" && (
                profileData?.loops.length === 0 ? (
                  <p className="text-center text-gray-500 text-lg sm:text-xl font-semibold mt-10 mb-10">
                    Don't have any loops yet...
                  </p>
                ) : (<>
                  <div className='flex flex-col gap-23 snap-y snap-mandatory scrollbar-hide'>

                    <div className="w-full grid grid-cols-3 gap-[2px] sm:gap-[4px]">
                      {loopData
                        .filter(loop => loop.author?._id === profileData?._id)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((loop) => (
                          <div
                            key={loop._id}
                            className="group relative w-full aspect-square bg-black cursor-pointer overflow-hidden"
                            onClick={() =>
                              navigate(`/loops?user=${profileData._id}&start=${loop._id}`)
                            }
                          >
                            <video
                              src={loop.media}
                              muted
                              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white text-sm sm:text-base font-semibold">
                              <div className="flex items-center gap-1">
                                ❤️ {loop.likes?.length || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                💬 {loop.comments?.length || 0}
                              </div>
                            </div>

                            {/* Video Icon */}
                            <div className="absolute top-2 right-2 bg-black/40 px-2 py-1 rounded-md text-white text-xs">
                              🎥<span className='font-semibold'>{loop?.views || 0}</span>
                            </div>
                          </div>

                        ))}
                    </div>
                  </div>
                </>
                )
              )}

            </div>

            {
              PostType === "Saved" &&
              (
                profileData?.saved.length === 0 ? (
                  <p className="text-center text-gray-500 text-lg sm:text-xl font-semibold mt-10 mb-10">
                    You don't have any saved posts yet...
                  </p>

                )
                  : (
                    userData.saved
                      .map(item => (item._id ? item : postData.find(p => p._id === item)))
                      .filter(Boolean)
                      .map(post => (
                        <Post post={post} key={post._id} Ssrc={post.author?.profileImage} disableProfileClick={true}
                          onPostClick={() => navigate(`/profile/${post.author?.userName}`)} />
                      ))
                  ))
            }

            {PostType === "Threads" && (
              <>

                <div className="flex gap-4 sm:gap-10 overflow-x-auto scrollbar-none py-0">
                  <div
                    className={`flex-shrink-0 text-lg sm:text-xl font-bold cursor-pointer pb-1 ${showPost ? "border-b-4 border-blue-500 text-blue-500" : "text-black"
                      }`}
                    onClick={() => {
                      setShowPost(true);
                      setShowRetweet(false);
                      setReplies(false);
                      setShowQuote(false);
                    }}
                  >
                    Posts
                  </div>

                  <div
                    className={`flex-shrink-0 text-lg sm:text-xl font-bold cursor-pointer pb-1 ${replies ? "border-b-4 border-blue-500 text-blue-500" : "text-black"
                      }`}
                    onClick={() => {
                      setShowPost(false);
                      setReplies(true);
                      setShowRetweet(false);
                      setShowQuote(false);
                    }}
                  >
                    Replies
                  </div>

                  <div
                    className={`flex-shrink-0 text-lg sm:text-xl font-bold cursor-pointer pb-1 ${showRetweet ? "border-b-4 border-blue-500 text-blue-500" : "text-black"
                      }`}
                    onClick={() => {
                      setShowPost(false);
                      setShowQuote(false);
                      setShowRetweet(true);
                      setReplies(false);
                    }}
                  >
                    Retweets
                  </div>

                  <div
                    className={`flex-shrink-0 text-lg sm:text-xl font-bold cursor-pointer pb-1 ${showQuote ? "border-b-4 border-blue-500 text-blue-500" : "text-black"
                      }`}
                    onClick={() => {
                      setShowPost(false);
                      setShowRetweet(false);
                      setShowQuote(true);
                      setReplies(false);
                    }}
                  >
                    Quotes
                  </div>
                </div>

                <div className="w-full flex justify-center  mt-3">
                  {showPost && <Threads mythreads={profileData?._id} mythreadTailwind={true} />}
                  {replies && <Comment userId={profileData?._id} mythreadTailwind={true} />}
                  {showRetweet && <Retweets userId={profileData?._id} mythreadTailwind={true} />}
                  {showQuote && <Quote userId={profileData?._id} mythreadTailwind={true} />}
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {(showFollowing || showFollowers) && (
        <div ref={showFollowing ? followingRef : followersRef} className='w-[90vw] max-w-[450px] h-[70vh]   rounded-2xl flex
           flex-col items-center fixed inset-0 backdrop-blur-sm bg-[var(--bg)]/90 mt-[45px] left-1/2 -translate-x-1/2 z-[100] border border-gray-700 overflow-hidden'>

          <div className='w-full py-[15px] border-b border-gray-700 flex flex-col items-center'>
            <div className='text-[16px] md:text-[20px] text-[var(--text)] font-semibold'>
              {`${showFollowing ? "Followings" : "Followers"}`}
            </div>

            <div className='w-[90%] mt-[10px]'>
              <form className='w-full h-[40px] bg-[#1b1f22] rounded-full px-[15px] flex items-center gap-[10px]'>
                <FiSearch className='w-[20px] h-[20px] text-gray-300' />
                <input
                  type="text"
                  placeholder='Search...'
                  className='text-white w-full h-full outline-0 bg-transparent'
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />
              </form>
            </div>
          </div>

          {showFollowing &&
            <div className='w-full flex-1 overflow-auto mt-[10px]'>
              {profileData?.following
                ?.filter(user =>
                  user?.userName?.toLowerCase().includes(input.toLowerCase()) ||
                  user?.name?.toLowerCase().includes(input.toLowerCase())
                ).map((user, index) => (
                  <div
                    key={index}
                    className='w-full  h-[65px] flex items-center justify-between gap-[15px] px-[15px] hover:bg-[var(--bg)] cursor-pointer'
                    onClick={() => {
                      setShowFollowing(false)

                    }}
                  >

                    <div className='flex gap-4'>
                      <div
                        onClick={() => navigate(`/profile/${user?.userName}`)}
                        className='w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-600'>
                        <img
                          src={user?.profileImage || dp}
                          alt=""
                          className='w-full h-full object-cover'
                        />
                      </div>

                      <div className='flex flex-col'>
                        <div className='text-[var(--text)] text-[17px] font-semibold'>
                          {user?.userName}
                        </div>
                        <div className='text-gray-400 text-[14px]'>
                          {user?.name}
                        </div>

                      </div>
                    </div>

                    {userData._id != user._id &&
                      <div onClick={(e) => e.stopPropagation}>

                        <FollowButton
                          tailwind="px-4 md:px-5 py-1 md:py-2 rounded-2xl text-sm md:text-base bg-[var(--primary)]
                         text-[var(--text)] hover:bg-[var(--secondary)] transition"
                          targetUserId={user._id}
                        />
                      </div>
                    }
                  </div>
                ))}

            </div>
          }

          {
            showFollowers &&
            <div className='w-full flex-1 overflow-auto mt-[10px]'>
              {profileData?.followers
                ?.filter(user =>
                  user?.userName?.toLowerCase().includes(input.toLowerCase()) ||
                  user?.name?.toLowerCase().includes(input.toLowerCase())
                ).map((user, index) => (
                  <div
                    key={index}
                    className='w-full  h-[65px] flex items-center justify-between gap-[15px] px-[15px] hover:bg-[var(--bg)] cursor-pointer'
                    onClick={() => {
                      setShowFollowers(false)
                      navigate(`/profile/${user?.userName}`)
                    }}
                  >

                    <div className='flex gap-4'>
                      <div className='w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-600'>
                        <img
                          src={user?.profileImage || dp}
                          alt=""
                          className='w-full h-full object-cover'
                        />
                      </div>

                      <div className='flex flex-col'>
                        <div className='text-[var(--text)] text-[17px] font-semibold'>
                          {user?.userName}
                        </div>
                        <div className='text-gray-400 text-[14px]'>
                          {user?.name}
                        </div>
                      </div>
                    </div>

                    {userData._id != user._id &&
                      <div onClick={(e) => e.stopPropagation}>

                        <FollowButton
                          tailwind="px-4 md:px-5 py-1 md:py-2 rounded-2xl text-sm md:text-base bg-[var(--primary)]
                         text-[var(--text)] hover:bg-[var(--secondary)] transition"
                          targetUserId={user._id}
                        />
                      </div>
                    }

                  </div>
                ))}
            </div>
          }
        </div>
      )}
    </>
  )

}

export default Profile
