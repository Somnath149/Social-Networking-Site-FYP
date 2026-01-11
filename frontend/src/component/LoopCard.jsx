import React, { useEffect, useRef, useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { FiMoreVertical, FiVolume2 } from 'react-icons/fi'
import { FiVolumeX } from 'react-icons/fi'
import dp from "../assets/dp.png"
import FollowButton from './FollowButton'
import { FaHeart, FaRegHeart, FaRegComment,FaRegPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setLoopData, updateLoopInFeed } from '../redux/loopSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaShare } from 'react-icons/fa6';
import { addMessage } from '../redux/messageSlice';
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";


function LoopCard({ loop,  loops,setLoops,fromHashTag = false , active}) {

  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const viewTimerRef = useRef(null);
  const viewAddedRef = useRef(false);
  const videoRef = useRef()
  const commentRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [message, setMessage] = useState("")
  const [showComment, setShowComment] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showHeart, setShowHeart] = useState(false)
  const { userData } = useSelector(state => state.user)
  const { loopData } = useSelector(state => state.loop)
  const { socket } = useSelector(state => state.socket)
  const [showDelete, setShowDelete] = useState(false)
  const [followingUsers, setFollowingUsers] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const handleSharePost = async (selectedUser) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/message/sendLoop/${selectedUser._id}`,
        { loopId: loop._id },
        { withCredentials: true }
      );

      dispatch(addMessage(result.data));
      setShowShareModal(false);
    } catch (error) {
      console.error("Share loop failed:", error);
    }
  };

  const fetchFollowingUsers = async () => {
    const res = await axios.get(`${serverUrl}/api/user/followingList`, { withCredentials: true });
    setFollowingUsers(res.data); 
  };

  useEffect(() => {
    fetchFollowingUsers();
  }, []);

  const HandleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }
  }

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false)
      }
    }

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showComment])


  const addView = async () => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/loop/view/${loop._id}`,
        {},
        { withCredentials: true }
      );

      const updatedLoop = res.data;

      const updatedLoops = loopData.map(p =>
        p._id === updatedLoop._id ? updatedLoop : p
      );

      dispatch(setLoopData(updatedLoops));
      dispatch(updateLoopInFeed(updatedLoops));
    } catch (error) {
      console.error("Add view failed:", error);
    }
  };

  useEffect(() => {

    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current;
      if (!video) return;
      if (entry.isIntersecting) {
        video.currentTime = 0;
        if (video.paused) {
          video.play();
          setIsPlaying(true);
        }
        if (!viewAddedRef.current) {
          viewTimerRef.current = setTimeout(() => {
            addView();
            viewAddedRef.current = true;
          }, 2000);
        }
      }
      else {
        video.pause();
        setIsPlaying(false);
        if (viewTimerRef.current) {
          clearTimeout(viewTimerRef.current);
        }
      }
    },
      { threshold: 0.6 });
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);


  const handleLike = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/loop/like/${loop._id}`,
        { withCredentials: true }
      );

      const updatedLoop = res.data;

      if (fromHashTag && loops && setLoops) {
        const updated = loops.map(l =>
          l._id === loop._id
            ? { ...l, ...updatedLoop }
            : l
        );
        setLoops(updated);
      }

      else {
        const updated = loopData.map(l =>
          l._id === loop._id
            ? { ...l, ...updatedLoop }
            : l
        );
        dispatch(setLoopData(updated));
        dispatch(updateLoopInFeed(updated));
      }

    } catch (err) {
      console.error("Like failed:", err);
    }
  };


  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);

    if (!loop.likes?.includes(userData._id)) {
      handleLike();
    }

    setTimeout(() => {
      setShowHeart(false);
    }, 600);
  };

  const handleComment = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        { withCredentials: true }
      );

      setMessage("");
      const updatedLoop = res.data;

      if (fromHashTag && loops && setLoops) {
        const updated = loops.map(l =>
          l._id === loop._id
            ? { ...l, ...updatedLoop }
            : l
        );
        setLoops(updated);
      } else {
        const updated = loopData.map(l =>
          l._id === loop._id
            ? { ...l, ...updatedLoop }
            : l
        );
        dispatch(setLoopData(updated));
        dispatch(updateLoopInFeed(updated));
      }

      setMessage("");

    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  useEffect(() => {
    socket?.on("likedLoop", (updatedLoop) => {
      const newLoops = loopData.map(p =>
        p._id == updatedLoop._id ? updatedLoop : p
      )
      dispatch(setLoopData(newLoops))
    })

    socket?.on("commentLoop", (updatedLoop) => {
      const newLoops = loopData.map(p =>
        p._id == updatedLoop._id ? updatedLoop : p
      )
      dispatch(setLoopData(newLoops))
    })

    return () => {
      socket?.off("likedLoop")
      socket?.off("commentLoop")
    }
  }, [socket, loopData, dispatch])


  const handleDeleteComment = async (commentId) => {
    try {
      const result = await axios.delete(`${serverUrl}/api/loop/comment/${loop._id}/${commentId}`, { withCredentials: true })


      const updatedLoop = result.data;

      const updatedLoops = loopData.map(p =>
        p._id === updatedLoop._id ? updatedLoop : p
      );

      dispatch(setLoopData(updatedLoops));
      dispatch(updateLoopInFeed(updatedLoops))

    } catch (error) {
      console.error("Delete comment failed:", error);
    }
  };

  const handleDeleteLoop = async () => {
    try {
      const result = await axios.delete(`${serverUrl}/api/loop/delete/${loop._id}`, { withCredentials: true });

      const updatedLoops = loopData.filter(p => p._id !== loop._id);
      dispatch(setLoopData(updatedLoops));
      dispatch(updateLoopInFeed(updatedLoops))

    } catch (error) {
      console.error("Delete loop failed:", error);
    }
  };

  useEffect(() => {
    socket?.on("loopViewed", (updatedLoop) => {
      const updatedLoops = loopData.map(p =>
        p._id === updatedLoop._id ? updatedLoop : p
      );

      dispatch(setLoopData(updatedLoops));
      dispatch(updateLoopInFeed(updatedLoops));
    });

    return () => {
      socket?.off("loopViewed");
    };
  }, [socket, loopData, dispatch]);


useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  if (active) {
    video.currentTime = 0;
    video.play().catch(() => {
    });
    setIsPlaying(true);
  } else {
    video.pause();
    setIsPlaying(false);
  }
}, [active]);


  const renderCaption = (text) => {
    return text.split(" ").map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <span
            key={index}
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/plhashtag/${word.substring(1)}`)}
          >
            {word}{" "}
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };


  return (

    <div className='w-full  lg:w-[480px] h-[100vh] bg-black flex flex-col items-center justify-center border-l-2 border-r-2
     border-gray-800 relative overflow-hidden'>

      {showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
        <FaHeart className="w-[100px] h-[100px] drop-shadow-2xl text-white" />
      </div>}

      {loop.author?._id === userData._id && <span className='absolute top-[20px] z-[100] left-[10px] '>
        <FiMoreVertical
          className="text-white cursor-dot1 w-6 h-6 cursor-pointer rounded-full hover:bg-gray-300 p-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowDelete(prev => !prev)
          }}
        />

        {showDelete && loop.author?._id === userData._id && (
          <div className="absolute left-5px mt-2 bg-[#111] border border-gray-700 rounded-xl shadow-lg px-3 py-2 z-20"
          >
            <button
              onClick={handleDeleteLoop}
              className="px-3 py-1 text-sm text-red-500 rounded-xl flex items-center gap-1"
            >
              <FaTrash className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </span>}


      <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] shadow-2xl shadow-black
                  p-[10px] rounded-t-4xl bg-[#0e1718] transform transition-transform duration-500 ease-in-out left-0
                  ${showComment ? "translate-y-0" : "translate-y-[100%] "}`}>

        <h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>

        <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>
          {loop?.comments?.length == 0 &&
            <div className='text-center text-white text-[20px] font-semibold mt-[50px]'> No Comments Yet </div>}

          {loop?.comments?.map((com, index) => (
            <div className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]' key={index}>
              <div className='flex justify-start items-center gap-[10px]'>
                <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                  <img src={com.author?.profileImage || dp}
                    onClick={() => { navigate(`/profile/${com.author?.userName}`) }}
                    alt="" className='w-full h-full object-cover' />
                </div>
                <div onClick={() => { navigate(`/profile/${com.author?.userName}`) }}
                  className='font-semibold text-white truncate max-w-[120px] md:max-w-[150px]'>
                  {com?.author?.userName}
                </div>

                {com.author?._id === userData._id && (
                  <button onClick={() => handleDeleteComment(com._id)}
                    className='ml-auto text-red-500 text-sm'>
                    <FaTrash className="w-5 h-5" />
                  </button>
                )}

              </div>


              <div className="flex flex-col">
                <span className="font-semibold text-white pl-[60px] max-w-[120px] md:max-w-[150px]"
                  onClick={() => navigate(`/profile/${loop.author?.userName}`)}>
                  {com?.message}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(com?.createdAt)}
                </span>
              </div>
            </div>
          ))}


        </div>

        <div className="w-full h-[80px] flex text-[var(--text)] items-center gap-3 px-[20px] relative">

          <div className="w-[40px] h-[40px] md:w-14 md:h-14 border-2 border-gray-300 rounded-full overflow-hidden">
            <img
              src={loop.author?.profileImage || dp}
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="text"
            className="flex-1 px-3 border-b-2 border-gray-500 outline-none h-[40px] bg-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
          />

          <button
            type="button"
            className="text-xl cursor-dot1"
            onClick={() => setShowEmojiPicker(prev => !prev)}
          >
            <BsEmojiSmile />
          </button>

          <button
            type="button"
            onClick={handleComment}
            className="text-xl cursor-dot1"
          >
            <FaRegPaperPlane />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-[90px] right-5 z-50">
              <EmojiPicker
                theme="dark"
                onEmojiClick={onEmojiClick}
                height={350}
                width={300}
              />
            </div>
          )}
        </div>


      </div>

      <video
        ref={videoRef}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        src={loop.media}
        onClick={handleClick}
        onTimeUpdate={HandleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
        onLoadStart={() => setIsLoading(true)}     
        onLoadedData={() => setIsLoading(false)}    
        onCanPlay={() => setIsLoading(false)}      
        onWaiting={() => setIsLoading(true)}       
        onPlaying={() => setIsLoading(false)}       
        onStalled={() => setIsLoading(true)}
      />

      {isLoading && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}


      <div className='absolute top-[20px] z-[100] right-[20px]' onClick={() => setIsMuted(prev => !prev)}>
        {!isMuted ? <FiVolume2 className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' /> :
          <FiVolumeX className='w-[20px] h-[20px] cursor-pointer  text-white font-semibold' />}
      </div>

      <div className='absolute bottom-0 w-full h-[3px] bg-gray-900'>
        <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>

        </div>
      </div>

      <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]'>



        <div className="absolute bottom-5 left-3 z-[50] max-w-[75%]">

          <div className='flex items-center gap-4'>
            <div
              onClick={() => { navigate(`/profile/${loop.author?.userName}`) }}
              className='w-[20px] h-[20px] md:w-[40px] md:h-[40px] border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
              <img src={loop?.author?.profileImage || dp} alt="" className='w-full h-full object-cover shrink-0' />
            </div>



            <div className="flex flex-col">
              <span className="font-semibold truncate text-white cursor-pointer max-w-[120px] md:max-w-[150px]"
                onClick={() => navigate(`/profile/${loop.author?.userName}`)}>
                {loop.author?.userName}
              </span>
              <span className="text-xs text-gray-400">
                {formatTimeAgo(loop.createdAt)}
              </span>
            </div>


            {userData._id !== loop.author._id && (
              <FollowButton
                tailwind="px-[10px] py-[5px] text-white cursor-pointer border-2 text-[14px] rounded-2xl border-white"
                targetUserId={loop.author._id}
              />
            )}

          </div>


          <div className="text-white mt-2 leading-relaxed whitespace-pre-line">

            {loop.caption?.length > 100 ? (
              <>
                {showFullCaption ? loop.caption : loop.caption.slice(0, 100) + "..."}

                <span
                  className="text-gray-400 ml-2 cursor-pointer hover:underline"
                  onClick={() => setShowFullCaption(!showFullCaption)}
                >
                  {showFullCaption ? "Read less" : "Read more"}
                </span>
              </>
            ) : (
              renderCaption(loop.caption)
            )}


          </div>

        </div>

        <div className='absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center p-[10px]'>
          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={handleLike}>
              {!loop?.likes?.includes(userData._id) && <FaRegHeart className="w-[25px] cursor-pointer h-[25px]" />}
              {loop?.likes?.includes(userData._id) && <FaHeart className="w-[25px] cursor-pointer h-[25px] text-red-600" />}</div>
            <div>{loop?.likes?.length}</div>
          </div>

          {
            showShareModal && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white w-[300px] rounded-2xl p-4">
                  <h2 className="text-lg font-bold text-black mb-3">Share Loop To</h2>

                  {followingUsers.length === 0 && (
                    <p className="text-gray-600 text-center py-4">
                      You are not following anyone.
                    </p>
                  )}

                  <div className="max-h-[250px] overflow-auto">
                    {followingUsers.map(user => (
                      <div key={user._id} className="flex items-center gap-3 p-2"
                        onClick={() => handleSharePost(user)}
                      >
                        <img
                          src={user.profileImage || dp}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-[var(--text)]">{user.userName}</div>
                          <div className="text-sm text-[var(--text)]">{user.name}</div>
                        </div>
                      </div>
                    ))}

                  </div>

                  <button
                    className="mt-4 w-full bg-red-500 cursor-dot1 text-[var(--text)] rounded-xl py-2"
                    onClick={() => setShowShareModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )
          }


          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={() => setShowComment(true)}><FaRegComment className="w-[25px] cursor-pointer h-[25px]" />
            </div>
            <div>
              <span>{loop?.comments?.length}</span>
            </div>
          </div>

          <div className='flex justify-center items-center gap-[5px] cursor-dot1' onClick={() => setShowShareModal(true)}>
            <FaShare className={`w-[25px] cursor-pointer h-[25px]`} />
          </div>

        </div>

      </div>
    </div>

  )
}

export default LoopCard
