import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toggleFollow } from '../redux/userSlice'
import axios from 'axios'

function FollowButton({ targetUserId, tailwind, onFollowChange }) {

    const following = useSelector(
        state => state.user.userData?.following || []
    )

    const dispatch = useDispatch()

    const isFollowing = useSelector(
  state => state.user.userData?.following?.includes(targetUserId)
)


    const handleFollow = async () => {
        try {
            await axios.get(
                `${serverUrl}/api/user/follow/${targetUserId}`,
                { withCredentials: true }
            )

            dispatch(toggleFollow(targetUserId))

            onFollowChange?.()
        } catch (error) {
            console.error("Follow failed:", error)
        }
    }

    return (
        <button className={tailwind} onClick={handleFollow}>
            {isFollowing ? "Following" : "Follow"}
        </button>
    )
}

export default FollowButton
