import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dp1 from "../assets/dp1.jpeg"
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { FaSearch, FaPlusSquare, FaFilm } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { serverUrl } from '../App'
import { setSearchData } from '../redux/userSlice'
import dp from "../assets/dp.png"
import axios from 'axios'
function Search() {
    const { userData, searchData } = useSelector(state => state.user)

    const [input, setInput] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSearch = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyWord=${input}`, { withCredentials: true })

            dispatch(setSearchData(result.data))
        } catch (error) {
            console.error("Search failed:", error)
        }
    }

    useEffect(() => {
        handleSearch()

    }, [input])

    return (
        <div className='w-full min-h-[100vh]  bg-[var(--bg)] flex items-center flex-col gap-[20px]'>
            <div className='w-full h-[80px] flex left-[20px] items-center gap-[20px] px-[20px] absolute top-0 z-10'>

                <MdOutlineKeyboardBackspace onClick={() => navigate(-1)}
                    className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-[var(--text)] text-[20px] font-semibold'>Search</h1>
            </div>
            <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>

                <form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] px-[20px] flex  items-center'>
                    <FiSearch className='w-[20px] h-[20px] text-white' />
                    <input type="text" placeholder='Search...' className='text-white w-full h-full outline-0 rounded-full px-[20px]'
                        onChange={(e) => setInput(e.target.value)} value={input} />
                </form>
            </div>

            {input &&
                searchData?.map((user) => (
                    <div className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex
                     cursor-pointer items-center gap-[20px] px-[5px] hover:bg-gray-200'
                        onClick={() => navigate(`/profile/${user?.userName}`)}>
                        <div className='w-[50px] h-[50px] border-2 border-black rounded-full overflow-hidden'
                        >

                            <img src={user?.profileImage || dp} alt="" className='w-full object-cover' />
                        </div>
                        <div className='font-semibold text-black text-[18px]'>
                            <div className='  text-black text-[18px]'>{user.userName}</div>
                            <div className='text-[14px] text-gray-400'>{user.name}</div>
                        </div>


                    </div>
                ))
            }

            {!input &&
                <div className='text-[30px] text-gray-700'>
                    Search Here...
                </div>
            }
        </div>
    )
}

export default Search
