import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, Conversation } from '../../pages/chat/Messenger';
import { getConversations } from '../../services/messageApi';
import { RootState } from '../store';

interface MessagesState {
  lstConvers: Conversation[];
  showMessenger: boolean;
  currentIndex: number;
}

const initialState: MessagesState = {
  lstConvers: [],
  showMessenger: false,
  currentIndex: 0,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ converId: number; msg: ChatMessage; avtUrl?: string; name?: string; openMessenger?: boolean }>) => {
      const { converId, msg, openMessenger, avtUrl, name } = action.payload;
      const existed = state.lstConvers.some(item => item.userId == converId);
      if (existed) {
        state.lstConvers = state.lstConvers.map(conver => {
          if (conver.userId === converId) {
            const updatedMessages = [...conver.last10Messages, msg].filter((value, index, self) =>
              index === self.findIndex((t) => (
                t?.id === value?.id
              ))
            );
            return {
              ...conver,
              last10Messages: updatedMessages,
            };
          }
          return conver;
        });
      } else {
        const newConversation: Conversation = { avtUrl: avtUrl, last10Messages: [msg], name, userId: converId };
        const exists = state.lstConvers.some(item => item.userId === newConversation.userId);
        if (!exists) {
          state.lstConvers = [...state.lstConvers, newConversation];
        }
      }
      if (openMessenger) {
        state.showMessenger = true
      };
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    clearLstConvers: (state) => {
      state.lstConvers = [];
    },
    openMessenger: (state) => {
      state.showMessenger = true;
    },
    closeMessenger: (state) => {
      state.showMessenger = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.fulfilled, (state, action) => {
        state.lstConvers = action.payload?.response ?? [];
      })
      .addCase(getConversations.rejected, (state) => {
        state.lstConvers = [];
      });
  },
});

export const selectCurrentConver = createSelector(
  [(state: RootState) => state.messageReducer.lstConvers,
  (state: RootState) => state.messageReducer.currentIndex],
  (lstConvers, currentIndex) => {
    return lstConvers.find(conver => conver.userId === currentIndex) || null;
  }
);

export const {
  clearLstConvers,
  addMessage,
  setCurrentIndex,
  openMessenger,
  closeMessenger,
} = messagesSlice.actions;

export default messagesSlice.reducer;
