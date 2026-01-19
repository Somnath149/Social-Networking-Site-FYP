import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import storySlice from "./storySlice";
import loopSlice from "./loopSlice";
import messageSlice from "./messageSlice";
import socketSlice from "./socketSlice";
import threadSlice from "./threadSlice";
import adminSlice from "./adminSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    loop: loopSlice,
    message: messageSlice,
    socket: socketSlice,
    thread: threadSlice,
    admin: adminSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.socket"],
      },
    }),
});

export default store;
