import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setWeeklyKing } from "../redux/userSlice";
import { serverUrl } from "../App";
import dp1 from "../assets/dp1.jpeg";
import { useNavigate } from "react-router-dom";

const WeeklyKing = ({king}) => {
  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const fetchKing = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/user/getKing`, { withCredentials: true });
      if (data.message) dispatch(setWeeklyKing(null));
      else dispatch(setWeeklyKing(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKing();
  }, []);

  const hasSeenToday = () => {
  const today = new Date().toDateString();
  return localStorage.getItem("weeklyKingSeenDate") === today;
};

const [show, setShow] = useState(() => {
  return !hasSeenToday();
});


  if (!king || !show) return null;

  return (

 <div className="fixed inset-0 z-[222] flex items-center justify-center 
                    bg-black/80 backdrop-blur-lg">

      <div className="relative w-[90%] max-w-sm rounded-3xl p-6
        bg-[#0f0f0f] border border-white/10
        shadow-[0_0_80px_rgba(255,215,0,0.35)]
        animate-throne">

        <button
          onClick={() => {
    localStorage.setItem(
      "weeklyKingSeenDate",
      new Date().toDateString()
    );
    setShow(false);
  }}
          className="
            absolute top-4 right-4
            w-10 h-10 flex items-center justify-center
            rounded-full
            bg-white/10 backdrop-blur
            text-white text-xl font-bold
            transition-all duration-500
            hover:rotate-180 hover:scale-110
            hover:bg-red-500 hover:shadow-[0_0_25px_rgba(255,0,0,0.8)]
            active:scale-95
          "
        >
          ✕
        </button>

        <div className="flex justify-center mb-2">
          <span className="text-5xl animate-crown-glow animate-float-crown">
            👑
          </span>
        </div>

        <div className="relative flex justify-center mt-3">
          <div className="absolute -inset-3 rounded-full 
                          bg-yellow-400/20 blur-2xl animate-pulse"></div>

          <img
            src={king.profileImage || dp1}
            className="relative w-28 h-28 rounded-full 
                       border-4 border-yellow-400 object-cover"
          />

          <div className="absolute -bottom-1 -right-1 
                          bg-yellow-400 text-black 
                          text-xs font-bold px-2 py-1 rounded-full shadow">
            🏆 KING
          </div>
        </div>

        <h2 className="mt-5 text-center text-2xl font-extrabold text-white">
          @{king.userName}
        </h2>

        <p className="mt-1 text-center text-sm uppercase tracking-widest text-white/60">
          Weekly King
        </p>

        <p className="mt-4 text-center text-xl font-bold text-yellow-400">
          {king.weeklyKingScore} Points
        </p>

        <button
           onClick={() => {
   localStorage.setItem(
      "weeklyKingSeenDate",
      new Date().toDateString()
    );
    setShow(false);
    navigate("/kings");
  }}
          className="
            mt-6 w-full py-3 rounded-xl
            bg-gradient-to-r from-yellow-400 to-orange-500
            text-black font-bold tracking-wide
            shadow-lg
            hover:scale-[1.03]
            active:scale-95
            transition
          "
        >
          🔥 View Weekly Leaderboard
        </button>

        <p className="mt-4 text-center text-xs italic text-white/40">
          “Only one rules the week.”
        </p>

        <div className="absolute inset-0 rounded-3xl 
          bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-500/10 
          pointer-events-none" />
      </div>
    </div>

  );
};

export default WeeklyKing;
