import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import OtherUsers from './OtherUsers';
import { useNavigate } from 'react-router-dom';

function RightSideThread({ setCenterView, setShowOtherUsers, setShowTrends, showOtherUsers, showTrends }) {
  const [randomUsers, setRandomUsers] = useState([]);
  const { userData, suggestedUser } = useSelector(state => state.user);
  const { todayTrending, allTrending } = useSelector(state => state.post);
  const getRandomUsers = (users, count) => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (suggestedUser && randomUsers.length === 0) {
      const usersNotFollowed = suggestedUser.filter(
        u => !userData.following.includes(u._id) && u._id !== userData._id
      );
      setRandomUsers(getRandomUsers(usersNotFollowed, 3));
    }
  }, [suggestedUser, userData]);


  const navigate = useNavigate()

  return (
    <>
      <div className="hidden lg:block h-screen w-[45%] bg-[var(--bg)] overflow-hidden border-l border-gray-800">
        <div className="h-full sticky top-0 overflow-y-auto px-4 py-6 space-y-6">
          {showTrends && (
            <div className="bg-[var(--primary)] rounded-2xl p-4">
              <h2 className={`text-[var(--text)] text-lg font-semibold mb-3`}>
                What's Happening
              </h2>
              {
                todayTrending.length === 0 && <h2 className="text-[var(--text)] text-lg font-semibold mt-3">
                  No Trends
                </h2>
              }

              {(todayTrending ? [...todayTrending] : [])
  .sort((a, b) => b.count - a.count)
  .slice(0, 5).map((t, i) => (
                  <div key={i} className="mb-3 cursor-pointer mt-[18px]">
                    <p className="text-[var(--text)]  font-semibold"
                      onClick={() => navigate(`/plhashtag/${(t.tag || t._id).replace("#", "")}`)}>{t.tag || t._id}</p>
                    <span className="text-sm text-[var(--text)] ">
                      {t.count} posts
                    </span>
                    <hr className="border-gray-700 my-3" />
                  </div>
                ))}


              <button
                className="text-white font-bold mt-3 cursor-dot1"
                onClick={() => {
                  setCenterView("trends");
                  setShowTrends(false);
                  setShowOtherUsers(true);
                }}
              >
                Show more
              </button>
            </div>
          )}

          {showOtherUsers &&
            (
              <div className="bg-[var(--primary)] rounded-2xl p-4">
                <h2 className="text-[var(--text)] text-lg font-semibold mb-3">
                  Suggested Users
                </h2>

                <div className="flex flex-col gap-3">
                  {randomUsers.map((user, index) => (
                    <OtherUsers key={index} user={user} t={true} />
                  ))}
                </div>

                <button
                  className="text-white mt-3 cursor-dot1"
                  onClick={() => {
                    setCenterView("users");
                    setShowOtherUsers(false);
                    setShowTrends(true);
                  }}
                >
                  Show more
                </button>
              </div>
            )}

        </div>
      </div>
    </>

  );

}

export default RightSideThread;
