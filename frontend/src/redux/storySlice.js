import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name: "story",
    initialState: {
        storyData: null,
        storyList: null,
        currentUserStory: null
    },
    reducers: {
        setStoryData: (state, action) => {
            state.storyData = action.payload
            console.log("Inside reducer - Story data:", action.payload);
        },
        setStoryList: (state, action) => {
            state.storyList = action.payload
            console.log("Inside reducer - Story List:", action.payload);
        },
        setCurrentUserStory: (state, action) => {
            state.currentUserStory = action.payload
            console.log("Inside reducer - Story current user story:", action.payload);
        }
    }
})

export const { setStoryData , setStoryList, setCurrentUserStory } = storySlice.actions
export default storySlice.reducer