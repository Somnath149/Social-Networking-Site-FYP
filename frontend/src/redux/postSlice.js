import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        postData: [],
        todayTrending: [],
        allTrending: [],
        tagPosts: [],
    },
    reducers: {
        setPostData: (state, action) => {
            state.postData = action.payload
        },
        setTodayTrending: (state, action) => {
            state.todayTrending = action.payload;
        },

        setAllTrending: (state, action) => {
            state.allTrending = action.payload;
        },
        setTagPosts: (state, action) => {
            state.tagPosts = action.payload;

        },
    }
})

export const { setPostData, setTodayTrending,
    setAllTrending,
    setTagPosts } = postSlice.actions
export default postSlice.reducer