import { createSlice } from "@reduxjs/toolkit";

const threadSlice = createSlice({
    name: "thread",
    initialState: {
        threads: [],
        commentedThreads: [],
        followThread: [],
        previewThread: null,
    },
    reducers: {
        setThreads: (state, action) => {
            state.threads = action.payload;
        },

        setPreview: (state, action) => {
    state.previewThread = action.payload; 
},


        addThread: (state, action) => {
            state.threads.unshift(action.payload);
        },

        updateVerdict: (state, action) => {
  const updatedThread = action.payload;

  const thread = state.threads.find(t => t._id === updatedThread._id);
  if (thread) thread.verdict = updatedThread.verdict;

  const commentedThread = state.commentedThreads.find(t => t._id === updatedThread._id);
  if (commentedThread) commentedThread.verdict = updatedThread.verdict;

  const followThread = state.followThread.find(t => t._id === updatedThread._id);
  if (followThread) followThread.verdict = updatedThread.verdict;
}
,

        setFollowThreads: (state, action) => {
            state.followThread = action.payload;
          
        },

        updateLikes: (state, action) => {
            const { threadId, likes } = action.payload;

            const thread = state.threads.find(t => t._id === threadId);
            if (thread) thread.likes = likes;

            const commentedThread = state.commentedThreads.find(t => t._id === threadId);
            if (commentedThread) commentedThread.likes = likes;
        },

        addComment: (state, action) => {
            const { threadId, updatedThread } = action.payload;
            const index = state.threads.findIndex(t => t._id === threadId);
            if (index !== -1) {
                state.threads[index] = {
                    ...state.threads[index],
                    comments: updatedThread.comments
                };
            }
        },

        setCommentedThreads: (state, action) => {
            state.commentedThreads = action.payload;
   
        },


        addRetweet: (state, action) => {
            const { _id, retweets, retweetsCount, isRetweeted } = action.payload;

            const thread = state.threads.find(t => t._id === _id);

            if (thread) {
                thread.retweets = retweets;
                thread.retweetsCount = retweetsCount;
                thread.isRetweeted = isRetweeted;
            }
            console.log("Inside reducer - retweet Data:", action.payload);
        }

        ,

        addQuoteThread: (state, action) => {
            const { _id, quoteThread } = action.payload;
            const thread = state.threads.find(t => t._id === _id);
            if (thread) {
                thread.quoteThread = quoteThread;
            } else {
                state.threads.unshift(action.payload);
            }
  
        },

    }
});

export const {
    setThreads,
    addThread,
    updateLikes,
    addComment,
    addRetweet,
    setCommentedThreads,
    addQuoteThread,
    setFollowThreads,
    updateVerdict,
    setPreview
} = threadSlice.actions;

export default threadSlice.reducer;
