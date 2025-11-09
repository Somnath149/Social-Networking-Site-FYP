import React from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import LoopCard from '../component/LoopCard'
import { useSelector } from 'react-redux'
import { div } from 'framer-motion/client'
function Loops() {
    const navigate = useNavigate()
    const { loopData } = useSelector(state => state.loop)
    return (
        <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>
            <div className='w-full h-[80px] flex fixed left-[20px] top-[20px] items-center gap-[20px] px-[20px] z-[100]'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                    className='text-white cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-white text-[20px] font-semibold'>Loops</h1>
            </div>

            <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
                {loopData.map((loop, index) => (
                    <div className='h-screen snap-start'>
                        <LoopCard loop={loop} key={indexedDB} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Loops
