import React, { useEffect, useState } from 'react'
import LeftSide from '../component/LeftSide'
import Feed from '../component/Feed'
import RightSide from '../component/RightSide'

const Home = () => {

  // const [homeLoading, setHomeLoading] = useState(true)

  // useEffect(() => {
  //   // jab Feed + data ready ho jaye
  //   const timer = setTimeout(() => {
  //     setHomeLoading(false)
  //   }, 1200) // realistic feel

  //   return () => clearTimeout(timer)
  // }, [])

  //   if (homeLoading) {
  //   return (
  //     <div className="w-full flex justify-center">
  //       <section
  //         className="w-full h-screen  p-4 sm:p-6 
  //         bg-[var(--bg)] border border-[var(--primary)] overflow-y-hidden"
  //       >
  //         {/* Header Skeleton */}
  //         <div className="h-6 w-56 bg-gray-400/20 rounded-md mb-6 animate-pulse"></div>

  //         <div className="w-full flex flex-col lg:flex-row gap-4">

  //           {/* Left Skeleton */}
  //           <div className="hidden lg:block w-[260px] space-y-4 animate-pulse">
  //             <div className="h-10 w-40 bg-gray-400/20 rounded"></div>
  //             {[1,2,3].map(i => (
  //               <div key={i} className="flex items-center gap-3">
  //                 <div className="w-10 h-10 rounded-full bg-gray-400/20"></div>
  //                 <div className="flex-1 space-y-2">
  //                   <div className="h-3 w-24 bg-gray-400/20 rounded"></div>
  //                   <div className="h-3 w-16 bg-gray-400/20 rounded"></div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>

  //           {/* Feed Skeleton */}
  //           <div className="flex-1 max-w-xl w-full space-y-6 animate-pulse">
  //             <div className="flex gap-3">
  //               {[1,2,3,4,5].map(i => (
  //                 <div key={i} className="w-14 h-14 rounded-full bg-gray-400/20"></div>
  //               ))}
  //             </div>

  //             <div className="bg-gray-400/10 rounded-2xl p-4 space-y-4">
  //               <div className="flex items-center gap-3">
  //                 <div className="w-10 h-10 rounded-full bg-gray-400/20"></div>
  //                 <div className="h-4 w-32 bg-gray-400/20 rounded"></div>
  //               </div>
  //               <div className="w-full h-64 bg-gray-400/20 rounded-xl"></div>
  //             </div>
  //           </div>

  //           {/* Right Skeleton */}
  //           <div className="hidden lg:block w-[260px] space-y-4 animate-pulse">
  //             <div className="h-6 w-32 bg-gray-400/20 rounded"></div>
  //             {[1,2].map(i => (
  //               <div key={i} className="flex items-center gap-3">
  //                 <div className="w-10 h-10 rounded-full bg-gray-400/20"></div>
  //                 <div className="h-3 w-24 bg-gray-400/20 rounded"></div>
  //               </div>
  //             ))}
  //           </div>

  //         </div>
  //       </section>
  //     </div>
  //   )
  // }


  return (
    <div className='w-full flex justify-center items-center'>
     
      <LeftSide/>
      <Feed/>
      <RightSide/>
    </div>
  )
}

export default Home
