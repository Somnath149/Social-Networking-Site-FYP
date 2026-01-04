import React from "react";
import WeeklyKing from "./WeeklyKing";
import useAllUserScore from "../hooks/useAllUserScore";
import { useSelector } from "react-redux";
import dp1 from "../assets/dp1.jpeg";
import { useNavigate } from "react-router-dom";

const Kings = ({threadTailwind}) => {
  const { users, loading } = useAllUserScore(); // ✅ call hook
  const allUsers = useSelector(state => state.user.allUsers); // ✅ get updated users
const navigate = useNavigate()


  return (
    <div className={`${threadTailwind ? "lg:w-[60%] w-full bg-[var(--bg)] h-screen overflow-y-scroll p-4" : 
    "w-full h-[100vh] bg-[var(--bg)] overflow-auto p-4"} `}>

  {/* 🏆 Leaderboard */}
  <div>
    <h2 className="text-2xl font-bold text-white mb-5 border-b border-gray-700 pb-2">
      🏆 Weekly Leaderboard
    </h2>

    {allUsers?.length === 0 ? (
      <p className="text-gray-500 text-center py-6">No active users this week</p>
    ) : (
      <div className="space-y-4">
        {[...allUsers]
          ?.filter(user => user.weeklyKingScore > 0)
          .sort((a, b) => b.weeklyKingScore - a.weeklyKingScore)
          .slice(0, 10)
          .map((user, index) => (
            <div
              key={user._id}
               onClick={() => navigate(`/profile/${user.userName}`)}
              className={`flex items-center gap-4 p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]
                ${index === 0 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-xl"
                  : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
            >
              {/* Rank */}
              <span className="text-lg font-bold w-6 text-center">{index + 1}</span>

              {/* Avatar */}
              <img
                src={user?.profileImage || dp1}
                alt={user?.userName}
                className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
              />

              {/* User Info */}
              <div className="flex-1">
                <p className="font-semibold text-lg">@{user?.userName}</p>
                <p className="text-sm opacity-80">{user?.weeklyKingScore} points</p>
              </div>

              {/* Crown for top 1 */}
              {index === 0 && <span className="text-3xl animate-bounce">👑</span>}
            </div>
          ))}
      </div>
    )}
  </div>
</div>

  );
};

export default Kings;
