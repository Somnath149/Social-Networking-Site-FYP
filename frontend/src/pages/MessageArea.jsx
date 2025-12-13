import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dp1 from "../assets/dp1.jpeg"
import { LuImage } from "react-icons/lu"
import { IoMdSend } from "react-icons/io"
import SenderMessage from '../component/SenderMessage'
import { serverUrl } from '../App'
import axios from 'axios'
import { addMessage, setMessages } from '../redux/messageSlice'
import ReceiverMessage from '../component/ReceiverMessage'
import { FaRegSmile } from 'react-icons/fa'
import EmojiPicker from 'emoji-picker-react'
import { MdCall, MdVideoCall } from "react-icons/md";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

function MessageArea() {

    const { selectedUser, messages } = useSelector(state => state.message)
    const { userData } = useSelector(state => state.user)
    const { socket } = useSelector(state => state.socket)
    const [input, setInput] = useState("")
    const imageInput = useRef()
    const navigate = useNavigate()
    const [frontendMedia, setFrontendMedia] = useState(null)
    const [backendMedia, setBackendMedia] = useState(null)
    const [showPicker, setShowPicker] = useState(false)
    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendMedia(file)
        setFrontendMedia(URL.createObjectURL(file))
    }
    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("message", input);
            if (backendMedia) formData.append("image", backendMedia);
            const result = await axios.post(
                `${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true, }
            );

            dispatch(setMessages([...messages, result.data]));
            console.log(result);

            setInput("");
            setFrontendMedia(null);
            setBackendMedia(null);
        } catch (error) {
            console.log("Send message error:", error);
        }
    };

    const getAllMessages = async (e) => {

        try {

            const result = await axios.get(
                `${serverUrl}/api/message/getAll/${selectedUser._id}`,
                { withCredentials: true }
            );

            dispatch(setMessages(result.data || []));

            console.log(result);

        } catch (error) {
            console.log("Send message error:", error);
        }
    };

    useEffect(() => {
        if (selectedUser?._id) {
            getAllMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (mess) => {
            dispatch(addMessage(mess));
        };

        socket.on("newMessage", handleMessage);

        return () => socket.off("newMessage", handleMessage);

    }, [socket]);


    const onEmojiClick = (emojiData) => {
        setInput((prev) => prev + emojiData.emoji)
    }

    return (
        <div className='w-full h-[100vh] bg-[var(--bg)] relative'>
            <div className='w-full flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-[var(--primary)]/80 backdrop-blur-md
'>
                <div className=' h-[80px] flex items-center gap-[20px] px-[20px]'>
                    <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                        className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />

                </div>


                <div className='w-[40px] h-[40px] border-2 border-[var(--primary)] rounded-full cursor-pointer overflow-hidden'
                    onClick={() => { navigate(`/profile/${selectedUser.userName}`) }}>
                    <img src={selectedUser?.profileImage || dp1} alt="" className='w-full object-cover' />
                </div>

                <div className='text-[var(--text)] text-[16px] font-semibold'>
                    <div>{selectedUser?.userName}</div>
                    <div className='text-[12px] text-gray-400'>{selectedUser?.name}</div>
                </div>

            </div>

            <div className='w-full h-[90%] pt-[100px] lg:pb-[120px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-[var(--bg)]'>
               

                {messages && messages.map((mess, index) => (
                    <div key={index}>
                        {mess?.sender == userData._id ?
                            <SenderMessage message={mess} /> :
                            <ReceiverMessage message={mess} />
                        }

                    </div>
                ))}


            </div>

            <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-[var(--bg)] z-[100]'>
                <form
                    onSubmit={handleSendMessage}
                    className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative'>

                    {frontendMedia && <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
                        <img src={frontendMedia} alt="" className='h-full object-cover' />
                    </div>}

                    <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage} />
                    <input type="text" placeholder='Message' className='w-full h-full px-[20px] text-[18px]
                     text-white outline-0'
                        value={input} onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type='button'
                        aria-label='Toggle emoji picker'
                        onClick={() => setShowPicker(prev => !prev)}
                        className='flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition'>
                        <FaRegSmile className='cursor-pointer text-white w-[20px] h-[20px]' />
                    </button>

                    {
                        showPicker &&
                      
                        <div className='absolute bottom-[70px] right-4 w-[370px] max-w-[90vw] bg-[#1a1c1d] 
                            rounded-2xl shadow-xl border border-white/10 p-3 z-50sm:right-0 
                            z-50'>

                            <div className='flex items-center justify-between mb-2'>
                                <div className='text-sm text-gray-300 font-medium'>Emoji</div>
                                <button
                                    type='button'
                                    onClick={() => setShowPicker(false)}
                                    className='text-gray-400 hover:text-gray-200 text-sm'>Close</button>
                            </div>

                            <div className='rounded-xl overflow-hidden'>
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        </div>

                    }

                    <div onClick={() => imageInput.current.click()}> <LuImage className='w-[28px] h-[28px] text-white' /> </div>
                    {(input || frontendMedia) && <button className='w-[60px] h-[40px] 
                    rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex justify-center
                     items-center cursor-pointer'><IoMdSend
                            className='w-[28px] h-[28px] text-white' /></button>}

                </form>
            </div >
        </div >
    )

}

export default MessageArea
