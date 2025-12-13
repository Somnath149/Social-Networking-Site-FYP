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
            //console.log("Inside reducer - post data:", action.payload);
        },
        setTodayTrending: (state, action) => {
            state.todayTrending = action.payload;
            //console.log("Inside reducer - today trending Data:", action.payload);
        },

        setAllTrending: (state, action) => {
            state.allTrending = action.payload;
            //console.log("Inside reducer - All trending Data:", action.payload);
        },
        setTagPosts: (state, action) => {
            state.tagPosts = action.payload;
           // console.log("Inside reducer - tag post Data:", action.payload);
        },
    }
})

export const { setPostData , setTodayTrending,
    setAllTrending,
    setTagPosts } = postSlice.actions
export default postSlice.reducer