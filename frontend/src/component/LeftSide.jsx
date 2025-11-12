import React from 'react'
import axios from 'axios'
import { FaRegHeart } from "react-icons/fa6";
import logo from "../assets/logo.png"
import dp from "../assets/dp.png"
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUsers from './OtherUsers';
import dp1 from "../assets/dp1.jpeg"
function LeftSide() {
    const { userData, suggestedUser } = useSelector(state => state.user)
    const dispatch= useDispatch()
    const handleLogOut= async () => {
        try {
            const result= await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true})
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='w-[25%] hidden lg:block min-h-[100vh] bg-[black] border-r-2 border-gray-900'>
            <div className='w-[full] h-[100px] flex items-center justify-between p-[20px]'>
                <img src={logo} alt="" className='w-[40px]' />
                <div>
                    <FaRegHeart className='text-[white] w-[25px] h-[25px]' />
                </div>
            </div>
            <div className='flex items-center w-full justify-between gap-[10px] px-[10px]'>
                <div className='flex items-center gap-[10px]'>
                    <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={userData.profileImage || dp1} alt="" className='w-full object-cover' />
                    </div>
                    <div>
                        <div className='text-[18px] text-white font-semibold'>
                            {userData.user?.name || userData.name}
                        </div>
                        <div className='text-[15px] text-gray-400 font-semibold'>
                            {userData.user?.userName || userData.userName}
                        </div>
                    </div>
                </div>
                <div className='text-blue-500 font-semibold cursor-pointer' onClick={handleLogOut}>Log Out</div>
            </div>



            <div className='w-full flex flex-col gap-[20px] p-[20px]'>
                <h1 className='text-[white] text-[19px]'>Suggested Users</h1>
                {suggestedUser && suggestedUser.slice(0,3).map((user,index)=>{
                    return <OtherUsers key={index} user={user}/>
                })}
            </div>
        </div>
    )
}

export default LeftSide
