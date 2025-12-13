import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationData } from '../redux/userSlice'

function getAllNotifications() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, { withCredentials: true })
                dispatch(setNotificationData(result.data))
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchNotification()
    }, [dispatch, userData])
}

export default getAllNotifications