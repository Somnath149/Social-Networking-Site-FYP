import React, { useState } from 'react'
import { FaRegHeart } from "react-icons/fa6";
import Nav from './Nav';
import Post from './Post';
import { useSelector } from 'react-redux';
import StoryDp from './StoryDp';
import { BiMessageAltDetail } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import PostList from '../pages/PostList';
import WeeklyKing from './WeeklyKing';
import PsyIncLogo from '../../public/PsyIncLogo';
function Feed({ }) {

  const { postData } = useSelector(state => state.post)
    const { loopData } = useSelector(state => state.loop)
  const { userData } = useSelector(state => state.user)
  const { notificationData } = useSelector(state => state.user)
  const { storyList, currentUserStory } = useSelector(state => state.story)
  const [showFeed, setShowFeed] = useState(true)
  const [showExplore, setShowExplore] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null);
  const king = useSelector(state => state.user.weeklyKing);
  const navigate = useNavigate()

  return (
    <div className={`lg:w-[50%] w-full h-full bg-[var(--bg)] h-screen  "overflow-y-scroll"   `}

    >

      <WeeklyKing king={king} />

      <div className='w-[full] h-[100px] flex items-center justify-between p-[20px] lg:hidden'>

        <div className='text-[40px] font-bold text-gray-400'>
          <PsyIncLogo />
        </div>

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

        {activeIndex === null && <Nav />}


        <div className="relative flex justify-center gap-12 border-b border-gray-700 mb-4">
          <span
            className={`absolute bottom-0 h-[3px] w-20 bg-[var(--secondary)] rounded-full
    transition-all duration-300 ease-in-out
    ${showFeed ? "left-[calc(50%-6.5rem)]" : "left-[calc(50%+1.5rem)]"}`}
          />

          <button
            className={`cursor-dot1 text-xl font-semibold px-4 pb-3 active:scale-95 transition-all duration-300
      ${showFeed
                ? "text-[var(--secondary)]"
                : "text-[var(--text)] opacity-60 hover:opacity-100"
              }`}
            onClick={() => {
              setShowFeed(true);
              setShowExplore(false);
            }}
          >
            Feed
          </button>

          <button
            className={`cursor-dot1 text-xl font-semibold px-4 pb-3 active:scale-95 transition-all duration-300
      ${showExplore
                ? "text-[var(--secondary)]"
                : "text-[var(--text)] opacity-60 hover:opacity-100"
              }`}
            onClick={() => {
              setShowExplore(true);
              setShowFeed(false);
            }}
            onDoubleClick={() => setActiveIndex(null)}
          >
            Explore
          </button>

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
               <Post post={post} key={index} feed={true} />
            )}

          </>
        }

        {showExplore &&
          <>
            {postData?.length === 0 || loopData?.length === 0  && (
              <p className="text-[var(--text)] z-100 text-center mt-10 mb-20">
                {
                  "haven't any loops and loops yet..."}
              </p>
            )}

            {
              <PostList ExploreTailwind={true}
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
