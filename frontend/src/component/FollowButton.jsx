import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

function FollowButton({ targetUserId, tailwind, onFollowChange }) {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    // FOLLOW STATUS — backend se correct value
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (userData?.following) {
            setIsFollowing(userData.following.includes(targetUserId));
        }
    }, [userData, targetUserId]);

    const handleFollow = async () => {
        try {
            // OPTIMISTIC UI UPDATE
            setIsFollowing((prev) => !prev);

            const res = await axios.get(
                `${serverUrl}/api/user/follow/${targetUserId}`,
                { withCredentials: true }
            );

            // backend says true/false
            const status = res.data.following;
            setIsFollowing(status);

            const updatedUser = await axios.get(
                `${serverUrl}/api/user/currentuser`,
                { withCredentials: true }
            );

            dispatch(setUserData(updatedUser.data));
if (onFollowChange) {
      onFollowChange()
    }
        } catch (error) {
            console.log("Follow error:", error);

            // rollback optimistic update
            setIsFollowing(userData.following.includes(targetUserId));
        }
    };

    return (
        <button 
            onClick={handleFollow}
            className={tailwind}
            style={{ fontFamily: "var(--font)" }}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    );
}

export default FollowButton;


// import React from "react"
// import { useDispatch, useSelector } from "react-redux"
// import axios from "axios"
// import { serverUrl } from "../App"
// import { toggleFollow } from "../redux/userSlice"

// function FollowButton({ targetUserId, tailwind, onFollowChange }) 
//  {
//   const dispatch = useDispatch()
//   const { following } = useSelector((state) => state.user)

//   const isFollowing = following?.includes(targetUserId)
// const handleFollow = async () => {
//   try {
//     await axios.get(
//       `${serverUrl}/api/user/follow/${targetUserId}`,
//       { withCredentials: true }
//     )

//     dispatch(toggleFollow(targetUserId))

//     // 🔥 PROFILE DATA RE-FETCH
//     if (onFollowChange) {
//       onFollowChange()
//     }

//   } catch (error) {
//     console.error("Follow failed:", error)
//   }
// }


//   return (
//     <button onClick={handleFollow} className={tailwind}>
//       {isFollowing ? "Following" : "Follow"}
//     </button>
//   )
// }

// export default FollowButton
