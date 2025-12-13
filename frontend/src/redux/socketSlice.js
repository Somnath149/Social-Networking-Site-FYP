import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        socket: null,
        onlineUsers: []
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload
            //console.log("Inside reducer - Socket:", action.payload);
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
           // console.log("Inside reducer - Online Uses:", action.payload);
        },
        
    }
})

export const { setSocket, setOnlineUsers } = socketSlice.actions
export default socketSlice.reducer