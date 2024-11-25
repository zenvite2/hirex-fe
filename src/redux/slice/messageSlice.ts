import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, Conversation } from '../../pages/chat/Messenger';
import { getConversations } from '../../services/messageApi';
import { RootState } from '../store';

interface MessagesState {
  lstConvers: Conversation[];
  showMessenger: boolean;
  currentIndex: number;
  toCaller: {
    id: string;
    fullname: string;
  };
}

const initialState: MessagesState = {
  lstConvers: [],
  showMessenger: false,
  currentIndex: 0,
  toCaller: null
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ converId: number; msg: ChatMessage; avtUrl?: string; name?: string; openMessenger?: boolean }>) => {
      const { converId, msg, openMessenger, avtUrl, name } = action.payload;

      const existingConversationIndex = state.lstConvers.findIndex(item => item.userId === converId);

      if (existingConversationIndex !== -1) {
        const existingConversation = state.lstConvers[existingConversationIndex];
        const updatedMessages = [...existingConversation.last10Messages, msg]
          .filter((value, index, self) =>
            index === self.findIndex((t) => t?.id === value?.id)
          )
          .slice();

        state.lstConvers = state.lstConvers.map((conver, index) =>
          index === existingConversationIndex
            ? { ...conver, last10Messages: updatedMessages }
            : conver
        );
      } else {
        const newConversation: Conversation = {
          avtUrl: avtUrl,
          last10Messages: [msg],
          name,
          userId: converId
        };

        state.lstConvers = [...state.lstConvers, newConversation];
      }

      if (openMessenger) {
        state.showMessenger = true;
      }
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    clearLstConvers: () => initialState,
    openMessenger: (state) => {
      state.showMessenger = true;
    },
    closeMessenger: (state) => {
      state.showMessenger = false;
    },
    setToCaller: (state, action: PayloadAction<{ id: string, fullname: string }>) => {
      state.toCaller = { ...state.toCaller, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.fulfilled, (state, action) => {
        state.lstConvers = action.payload?.response ?? [];
      })
      .addCase(getConversations.rejected, () => ({
        ...initialState,
        lstConvers: []
      }));
  }
});

export const selectCurrentConver = createSelector(
  [
    (state: RootState) => state.messageReducer.lstConvers,
    (state: RootState) => state.messageReducer.currentIndex
  ],
  (lstConvers, currentIndex) =>
    lstConvers.find(conver => conver.userId === currentIndex) || null
);

export const {
  clearLstConvers,
  addMessage,
  setCurrentIndex,
  openMessenger,
  closeMessenger,
  setToCaller
} = messagesSlice.actions;

export default messagesSlice.reducer;