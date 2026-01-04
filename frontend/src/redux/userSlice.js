import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        suggestedUser: null,
        profileData: null,
        following: [],
        toggleFollow:[],
        searchData:null,
        notificationData:[],
        weeklyKing: null,
        allUsers:[],
         notificationsEnabled: true,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
           // console.log("Inside reducer - User data:", action.payload);
        },
        setSuggestedUser: (state, action) => {
            state.suggestedUser = action.payload
         //   console.log("Inside reducer - Suggested data:", action.payload);
        },
        setProfileData: (state, action) => {
            state.profileData = action.payload
          //  console.log("Inside reducer - Profile data:", action.payload);
        },
        setFollowing: (state, action) => {
            state.following = action.payload
          //  console.log("Inside reducer - Following data:", action.payload);
        },
        toggleFollow: (state, action) => {
            const targetUserId = action.payload;

            if (!state.userData) return;

            const index = state.userData.following.indexOf(targetUserId);

            if (index !== -1) {
                // UNFOLLOW
                state.userData.following.splice(index, 1);
            } else {
                // FOLLOW
                state.userData.following.push(targetUserId);
            }
        },
        setSearchData: (state, action) => {
            state.searchData = action.payload
          //  console.log("Inside reducer - Search Data:", action.payload);
        },
        setNotificationData: (state, action) => {
  state.notificationData = action.payload;
},

addNotification: (state, action) => {
  state.notificationData.unshift(action.payload);
},
 setNotificationsEnabled: (state, action) => {
    state.notificationsEnabled = action.payload;
  },
        setWeeklyKing: (state, action) => {
            state.weeklyKing = action.payload;
          //  console.log("Inside reducer - notification Data:", action.payload);
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
          //  console.log("Inside reducer - all user Data:", action.payload);
        },
    }
})

export const { setUserData, setWeeklyKing, setAllUsers,addNotification,setNotificationsEnabled, setNotificationData, setSuggestedUser, setProfileData, setFollowing, toggleFollow, setSearchData } = userSlice.actions
export default userSlice.reducer