import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        selectedUser: null,
        messages: [],
        prevChatUsers: []
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setPrevChatUsers: (state, action) => {
            state.prevChatUsers = action.payload;
        },
    }
});

export const { setSelectedUser, setMessages, addMessage, setPrevChatUsers } = messageSlice.actions;
export default messageSlice.reducer;
