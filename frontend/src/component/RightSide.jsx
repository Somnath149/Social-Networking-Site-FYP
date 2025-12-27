import React from 'react'
import Messages from '../pages/Messages'

function RightSide({m}) {
  return (
    <div className='w-[25%] hidden lg:block h-screen bg-[var(--bg)] border-l-2 border-gray-900 overflow-hidden'>
      
      {/* Scroll only inside the messages area */}
      <div className='h-full overflow-y-auto'>
        <Messages m={m}/>
      </div>

    </div>
  )
}

export default RightSide
