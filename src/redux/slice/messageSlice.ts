import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation } from '../../pages/chat/Messenger';
import { getConversations } from '../../services/messageApi';

interface MessagesState {
  lstConvers: Conversation[];
}

const initialState: MessagesState = {
  lstConvers: [],
};

const messagesSlice = createSlice({
  name: 'messageReducers',
  initialState,
  reducers: {
    updateConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.lstConvers = action.payload;
    },
    clearConversations: (state) => {
      state.lstConvers = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.fulfilled, (state, action) => {
        state.lstConvers = action.payload?.response ?? [];
      })
      .addCase(getConversations.rejected, (state) => {
        state.lstConvers = [];
      });
  }
});

export const { updateConversations, clearConversations } = messagesSlice.actions;
export default messagesSlice.reducer;
