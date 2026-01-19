import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUser: null,
    profileData: null,
    searchData: null,
    notificationData: [],
    weeklyKing: null,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    
    }
    ,
    clearAllNotifications: (state) => {
      state.notificationData = [];
    }
    ,
    setSuggestedUser: (state, action) => {
      state.suggestedUser = action.payload
     
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload
     
    },
    setFollowing: (state, action) => {
      state.following = action.payload
    
    },
    toggleFollow: (state, action) => {
      const targetUserId = action.payload;
      if (!state.userData) return;

      const following = state.userData.following || [];

      const index = following.indexOf(targetUserId);
      if (index !== -1) {
        following.splice(index, 1);
      } else {
        following.push(targetUserId);
      }

      state.userData.following = following;
    }
    ,
    setSearchData: (state, action) => {
      state.searchData = action.payload
    
    },
    setNotificationData: (state, action) => {
      state.notificationData = action.payload;
    },

    addNotification: (state, action) => {
      state.notificationData.unshift(action.payload);
    },

    setWeeklyKing: (state, action) => {
      state.weeklyKing = action.payload;
     
    },

  }
})

export const { setUserData, setIssues,
  resolveIssueRedux, setWeeklyKing, setReports, setContentPreview, blockUserRedux, clearAllNotifications,
  unblockUserRedux, clearContentPreview, setStats, setAllUsers, updateUserInList, addNotification, setNotificationData,
  setSuggestedUser, setProfileData, setFollowing, toggleFollow, setSearchData } = userSlice.actions
export default userSlice.reducer