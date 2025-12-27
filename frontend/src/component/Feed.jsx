import React, { useState } from 'react'
import { FaRegHeart } from "react-icons/fa6";
import logo from "../assets/logo.png"
import StoryCard from './StoryDp';
import Nav from './Nav';
import Post from './Post';
import { useSelector } from 'react-redux';
import StoryDp from './StoryDp';
import { BiMessageAltDetail } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import PostList from '../pages/PostList';
import WeeklyKing from './WeeklyKing';
function Feed({ theme }) {

  const { postData } = useSelector(state => state.post)
  const { userData } = useSelector(state => state.user)
  const { notificationData } = useSelector(state => state.user)
  const { storyList, currentUserStory } = useSelector(state => state.story)
  const [showFeed, setShowFeed] = useState(true)
  const [showExplore, setShowExplore] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null);
  const king = useSelector(state => state.user.weeklyKing);
  const navigate = useNavigate()

  return (
    <div className={`lg:w-[50%] w-full h-full bg-[var(--bg)] h-screen ${!theme ? "overflow-y-scroll" : ""} `}
    
    >

<WeeklyKing  king={king}/>

      <div className='w-[full] h-[100px] flex items-center justify-between p-[20px] lg:hidden'>

        <img src={logo} alt="" className='w-[40px]' />

        <div className='flex items-center gap-[10px]'>
          <div className='relative' onClick={() => navigate("/notifications")}>

            <FaRegHeart className='text-[var(--text)] w-[25px] h-[25px]' />
            {notificationData?.length > 0 && notificationData.some((noti) => noti.isRead == false) &&
              (<div className='w-[10px] h-[10px] bg-[var(--bg)] rounded-full absolute top-0 right-[-5px]'></div>)}

          </div>
          <BiMessageAltDetail className='text-[var(--text)] w-[25px] h-[25px]' onClick={() => navigate("/messages")} />
        </div>
      </div>

      <div className='flex w-full overflow-auto gap-[10px]  items-center p-[20px]'>
        <StoryDp userName={'Your Story'} profileImage={userData.profileImage} story={currentUserStory} />
        {storyList?.map((story, index) => (
          <StoryDp userName={story.author.userName} profileImage={story.author.profileImage}
            story={story} key={index} />
        ))}
      </div>

      <div className='w-full min-h-screen flex flex-col items-center gap-[20px] 
                      p-[10px] pt-[40px] bg-[var(--primary)] rounded-t-[60px] relative pb-[120px]' >

        {!activeIndex && !theme && <Nav />}

        <div className='flex justify-around gap-25'>
          <div className={` cursor-dot1 text-xl font-bold text-[var(--text)] cursor-pointer mb-3 
          ${showFeed ? "border-b-4 border-[var(--secondary)]" : ""} `}
            onClick={() => {
              setShowFeed(true)
              setShowExplore(false)
            }}>Feed</div>

          <div className={` cursor-dot1 text-xl font-bold text-[var(--text)] cursor-pointer mb-3
           ${showExplore ? "border-b-4 border-[var(--secondary)]" : ""} `}
            onClick={() => {
              setShowExplore(true)
              setShowFeed(false)
            }}
            onDoubleClick={
              ()=> setActiveIndex(null)
            }
            >Explore</div>
        </div>

        {showFeed &&
          <>
            {postData?.length === 0 && (
              <p className="text-[var(--text)] z-100 text-center mt-10 mb-20">
                {
                  "haven't any posts yet..."}
              </p>
            )}

            {postData?.map((post, index) =>
              !theme && <Post post={post} key={index} feed={true} />
            )}

          </>
        }

        {showExplore &&
          <>
            {postData?.length === 0 && (
              <p className="text-[var(--text)] z-100 text-center mt-10 mb-20">
                {
                  "haven't any posts yet..."}
              </p>
            )}

            {
              !theme && <PostList ExploreTailwind={true}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            }

          </>}

      </div>
    </div>

  )
}

export default Feed
