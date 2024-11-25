import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationType {
    id: number;
    title: string;
    content: string;
    read: boolean;
}

export interface NotificationState {
    notifications: NotificationType[];
    unreadCount: number;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<NotificationType[]>) => {
            state.notifications = action.payload;
        },
        setUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
        addNotification: (state, action: PayloadAction<NotificationType>) => {
            state.notifications = [action.payload, ...state.notifications];
            state.unreadCount += 1;
        },
        markAsRead: (state, action: PayloadAction<number>) => {
            state.notifications = state.notifications.map(noti =>
                noti.id === action.payload ? { ...noti, read: true } : noti
            );
            state.unreadCount = state.notifications.filter(noti => !noti.read).length;
        },
        markAllAsRead: (state) => {
            state.notifications = state.notifications.map(noti => ({ ...noti, read: true }));
            state.unreadCount = 0;
        }
    },
});

export const {
    setNotifications,
    setUnreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
} = notificationSlice.actions;

export default notificationSlice.reducer;