import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setThreads } from '../redux/threadSlice'

function getAllThreads() {
    const dispatch= useDispatch()
    const {userData} = useSelector(state=>state.user)

     useEffect(() => {
        if (!userData?._id) return;
        const fetchThreads = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/thread/getAllthreads`,{ withCredentials: true }
                );

                dispatch(setThreads(result.data));
            } catch (error) {
                console.log(error);
            }
        };

        fetchThreads();
    }, [dispatch, userData]);
}

export default getAllThreads