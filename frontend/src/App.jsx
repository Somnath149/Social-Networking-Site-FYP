import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SignUp from './pages/signup'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser'
import getSuggestedUser from './hooks/getSuggestedUser'
import Profile from './pages/Profile'
import { useTransition, animated } from '@react-spring/web'
import { addNotification, setFollowing, setNotificationData, setUserData } from './redux/userSlice'
import { useDispatch } from 'react-redux'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import getAllpost from './hooks/getAllpost'
import getAllLoops from './hooks/getAllLoops'
import axios from "axios";
import Loops from './pages/Loops'
import Story from './pages/Story'
import getAllStories from './hooks/getAllStories'
import Messages from './pages/Messages'
import MessageArea from './pages/MessageArea'
import { io } from "socket.io-client"
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import Search from './pages/Search'
import getAllNotifications from './hooks/getAllNotifications'
import Notifications from './pages/Notifications'
import getAllThreads from './hooks/getAllThreads'
import ThreadHome from './pages/ThreadHome'
import ForYou from './pages/ForYou'
import Preloader from './pages/Preloader'
import ThemeChanger from './pages/ThemeChanger'
import AdvancedCursor from '../public/AdvancedCursor'
import useLoopFeed from './hooks/useLoopFeed'
import { useTrendingPost } from './hooks/useTrendingPost'
import PostLoopTag from './pages/PostLoopTag'
import TrendingPostLoop from './component/TrendingPostLoop'
import useFollowingList from './hooks/getfollowingList'
import usePrevChatUsers from './hooks/usePrevChatUsers'
import useAllUserScore from './hooks/useAllUserScore'
import Settings from './pages/Setting'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addMessage } from './redux/messageSlice'
import useFollowPost from './hooks/useFollowPost'
import NotFound from './pages/NotFound'


export const serverUrl = "http://localhost:8000"
function App() {
  const { socket } = useSelector(state => state.socket)
  const { userData, notificationData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const location = useLocation()

  getCurrentUser()
  getSuggestedUser()
  useFollowingList()
  getAllStories()
  getAllpost()
  getAllLoops()
  getAllNotifications()
  getAllThreads()
  useFollowPost()
  useTrendingPost()

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "theme-default";
    document.documentElement.className = savedTheme;

    const resetVars = () => {
      ["--bg", "--text", "--primary", "--secondary", "--cursor"].forEach(v =>
        document.documentElement.style.removeProperty(v)
      );
    };

    if (savedTheme === "theme-default") {
      resetVars();
      return;
    }

    const savedCustomThemes = JSON.parse(
      localStorage.getItem("customThemes") || "[]"
    );

    const match = savedCustomThemes.find(t => t.class === savedTheme);

    if (match?.variables) {
      Object.entries(match.variables).forEach(([key, val]) => {
        document.documentElement.style.setProperty(key, val);
      });
    } else {
      resetVars();
    }
  }, []);


  useEffect(() => {
    if (!userData?._id) return;

    const socketIo = io("http://localhost:8000", {
      query: { userId: userData._id },
    });

    socketIo.on("connect", () => {
      console.log("Socket connected:", socketIo.id);
    });

    dispatch(setSocket(socketIo));

    socketIo.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
      console.log("Online users:", users);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [userData?._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/me`, {
          withCredentials: true,
        });

        dispatch(setUserData(res.data));
        dispatch(setFollowing(res.data.following))
      } catch (error) {
        dispatch(setUserData(null));
        dispatch(setFollowing([]));
      }
      finally {
        setLoading(false);
      }
      return () => clearTimeout(timer);
    };

    fetchUser();
  }, []);



  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (noti) => {
      dispatch(addNotification(noti));
      toast.info(`${noti.sender?.userName}: ${noti.message}`);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, dispatch]);

  const location1 = useLocation();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (mess) => {
      dispatch(addMessage(mess));

      if (location1.pathname !== "/messageArea") {
        let toastText = "";

        if (mess?.message) {
          const limit = 30;
          toastText =
            mess.message.length > limit
              ? mess.message.slice(0, limit) + "..."
              : mess.message;
        }
        else if (mess?.post) {
          toastText = "Shared a post";
        }
        else if (mess?.loop) {
          toastText = "Shared a loop";
        }
        else {
          toastText = "Sent a message";
        }

        toast.info(`${mess?.sender?.userName}: ${toastText}`);
      }
    };

    socket.on("newMessage", handleMessage);
    return () => socket.off("newMessage", handleMessage);

  }, [socket, dispatch, location1.pathname]);


  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <Preloader />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">

      <AdvancedCursor />
      <Routes location={location}>
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
        <Route path='*' element={userData ? <NotFound /> : <Navigate to={"/signin"} />} />
        <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
        <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to={"/signin"} />} />
        <Route path='/story/:userName' element={userData ? <Story /> : <Navigate to={"/signin"} />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/signin"} />} />
        <Route path='/upload' element={userData ? <Upload /> : <Navigate to={"/signin"} />} />
        <Route path='/loops' element={userData ? <Loops /> : <Navigate to={"/signin"} />} />
        <Route path='/messages' element={userData ? <Messages /> : <Navigate to={"/signin"} />} />
        <Route path='/messageArea' element={userData ? <MessageArea /> : <Navigate to={"/signin"} />} />
        <Route path='/search' element={userData ? <Search /> : <Navigate to={"/signin"} />} />
        <Route path='/notifications' element={userData ? <Notifications /> : <Navigate to={"/signin"} />} />
        <Route path='/threads' element={userData ? <ThreadHome /> : <Navigate to={"/signin"} />} />
        <Route path='/ForYou' element={userData ? <ForYou /> : <Navigate to={"/signin"} />} />
        <Route path="/theme" element={userData ? <ThemeChanger /> : <Navigate to={"/signin"} />} />
        <Route path="/plhashtag/:tag" element={userData ? <PostLoopTag /> : <Navigate to={"/signin"} />} />
        <Route path="/trendingpage" element={userData ? <TrendingPostLoop /> : <Navigate to={"/signin"} />} />
        <Route path="/setting" element={userData ? <Settings /> : <Navigate to={"/signin"} />} />
        {/* <Route path="/admin" element={userData ? <Admin /> : <Navigate to={"/signin"} />} /> */}
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        draggable
        theme="dark"
      />

    </div>
  )
}

export default App