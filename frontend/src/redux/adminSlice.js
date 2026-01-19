import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        allUsers: [],
        reports: [],
        stats: {
            users: 0,
            posts: 0,
            loops: 0,
            threads: 0
        },
        issues: []
        ,
        contentPreview: null,
    },

    reducers: {

        setIssues: (state, action) => {
            state.issues = action.payload;
        },
        resolveIssueRedux: (state, action) => {
            state.issues = state.issues.filter(
                (i) => i._id !== action.payload
            );
        },

        setReports: (state, action) => {
            state.reports = action.payload
       
        },
        setStats: (state, action) => {
            state.stats = action.payload
      
        },
        setContentPreview: (state, action) => {
            state.contentPreview = action.payload;
        },
        clearContentPreview: (state) => {
            state.contentPreview = null;
        }
        ,

        blockUserRedux: (state, action) => {
            const userId = action.payload;
            const index = state.allUsers.findIndex(u => u._id === userId);

            if (index !== -1) {
                state.allUsers[index].isBlocked = true;
            }
        },

        unblockUserRedux: (state, action) => {
            const userId = action.payload;
            const index = state.allUsers.findIndex(u => u._id === userId);

            if (index !== -1) {
                state.allUsers[index].isBlocked = false;
            }
        },

        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
           
        },
        updateUserInList: (state, action) => {
            const { userId, role } = action.payload;
            const index = state.allUsers.findIndex(u => u._id === userId);
            if (index !== -1) {
                state.allUsers[index].role = role;
            }
        }
    }
})

export const { setIssues,
    resolveIssueRedux, setReports, setContentPreview, blockUserRedux,
    unblockUserRedux, clearContentPreview, setStats, setAllUsers, updateUserInList } = adminSlice.actions
export default adminSlice.reducer