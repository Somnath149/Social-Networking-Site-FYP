import React from "react";
import ThreadNav from "../component/ThreadNav";
import Threads from "../component/Threads";
import RightSideThread from "../component/RightSideThread";
import ForYou from "./ForYou";
import { useState } from "react";
import Messages from "./Messages";
import Notifications from "./Notifications";
import TrendingPostLoop from "../component/TrendingPostLoop";
import Kings from "../component/Kings";
import FollowingThreads from "../component/FollowingThreads";

function ThreadHome() {

  const [centerView, setCenterView] = useState("threads");
  const [showOtherUsers, setShowOtherUsers] = useState(true);
  const [showTrends, setShowTrends] = useState(true);

  return (
    <div className='w-full flex justify-center items-center '>
      <ThreadNav setCenterView={setCenterView} setShowOtherUsers={setShowOtherUsers} setShowTrends={setShowTrends} />
      {centerView === "threads" && <Threads />}
      {centerView === "trends" && <TrendingPostLoop show={true} />}
      {centerView === "users" && <ForYou />}
      {centerView === "foryou" && <FollowingThreads />}
      {centerView === "messages" && <Messages mwidth={true} />}
      {centerView === "king" && <Kings threadTailwind={true} />}
      {centerView === "notifications" && <Notifications threadTailwind={true} />}
      <RightSideThread setCenterView={setCenterView} setShowOtherUsers={setShowOtherUsers} setShowTrends={setShowTrends}
        showOtherUsers={showOtherUsers} showTrends={showTrends}
      />
    </div>
  );
}

export default ThreadHome;
