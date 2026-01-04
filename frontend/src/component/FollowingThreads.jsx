import React, { useState } from 'react'
import Threads from './Threads'
import Retweets from './Retweets'
import Quote from './Quote'
import Comment from './Comment'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useFollowPost from '../hooks/useFollowPost'

function FollowingThreads() {

  const threads = useSelector(state => state.thread.followThread);

  if (!threads || threads.length === 0) {
    return (
      <div className="mt-20 text-center text-gray-500">
        <p className="text-sm">
          Follow people to see their posts here.
        </p>
      </div>

    );
  }

  return (
    <div className="
  w-full h-screen overflow-y-auto
  bg-[var(--bg)]
  border-l border-r border-gray-200
">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="
      sticky top-0 z-20
      bg-[var(--bg)]/95 backdrop-blur
      border-b border-gray-200
      px-4 py-3
    ">
          <h1 className="text-lg font-semibold text-[var(--text)]">
            Following
          </h1>
          <p className="text-xs text-gray-500">
            Posts from people you follow
          </p>
        </div>

        {/* FEED */}
        <div className="py-4">
          <Threads externalThreads={threads} followuser={true} />
        </div>

      </div>
    </div>

  );
}



export default FollowingThreads
