import React, { useEffect } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NotificationCard from '../component/NotificationCard'
import { serverUrl } from '../App'
import { setNotificationData } from '../redux/userSlice'
import axios from 'axios'
import { motion } from "framer-motion"

function Notifications({ threadTailwind }) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { notificationData } = useSelector(state => state.user)
    const ids = notificationData.map((n) => n._id)

    const markAsRead = async () => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/user/markAsRead`,
                { notificationId: ids },
                { withCredentials: true }
            )
            await fetchNotification()
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNotification = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/user/getAllNotifications`,
                { withCredentials: true }
            )
            dispatch(setNotificationData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        markAsRead()
    }, [])

    return (
        <div className={`${threadTailwind ? "lg:w-[50%] w-full bg-[var(--bg)] h-screen overflow-y-scroll" : "w-full h-[100vh] bg-[var(--bg)] overflow-auto"} `}>
            <div className='w-full h-[80px] flex left-[20px] items-center gap-[20px] px-[20px] lg:hidden'>
                <MdOutlineKeyboardBackspace
                    onClick={() => navigate(`/`)}
                    className='text-white cursor-pointer w-[25px] h-[25px]'
                />
                <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
            </div>

            {threadTailwind && <h1 className='text-white text-[20px] p-[20px] font-semibold'>Notifications</h1>}
            <motion.div
                className="w-full flex flex-col gap-[20px] h-[100%] p-[10px]"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.12,
                        },
                    },
                }}
            >
                {notificationData?.map((noti, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <NotificationCard noti={noti} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )


}

export default Notifications
