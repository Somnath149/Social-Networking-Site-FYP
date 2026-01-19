import { createSlice } from "@reduxjs/toolkit";

const loopSlice = createSlice({
    name: "loop",
    initialState: {
        loopData: [],     
        feedData: [],    
        feedSeed: null,  
        feedPage: 1,      
        hasMore: true     
    },
    reducers: {
        
        setLoopData: (state, action) => {
            state.loopData = action.payload;
         
        },

        setFeedInitial: (state, action) => {
            state.feedData = action.payload.loops;
            state.feedSeed = action.payload.seed;
            state.feedPage = 1;
            state.hasMore = action.payload.loops.length > 0;
        },

        addFeedData: (state, action) => {
            state.feedData = [...state.feedData, ...action.payload.loops];
            state.feedPage += 1;
            if (action.payload.loops.length === 0) {
                state.hasMore = false;
            }
        },

        resetFeed: (state) => {
            state.feedData = [];
            state.feedPage = 1;
            state.feedSeed = null;
            state.hasMore = true;
        },

        updateLoopInFeed: (state, action) => {
            const updated = action.payload;
            if (Array.isArray(updated)) {
  
                state.feedData = state.feedData.map(loop =>
                    updated.find(u => u._id === loop._id) || loop
                );
            } else {

                state.feedData = state.feedData.map(loop =>
                    loop._id === updated._id ? updated : loop
                );
            }
        }

    }
});

export const {
    setLoopData,
    setFeedInitial,
    addFeedData,
    resetFeed,
    updateLoopInFeed
} = loopSlice.actions;

export default loopSlice.reducer;
