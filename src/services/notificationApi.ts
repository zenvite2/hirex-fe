import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    setNotifications,
    markAsRead,
    markAllAsRead,
    NotificationType,
    setUnreadCount
} from '../redux/slice/notificationSlice';
import axiosIns from './axiosIns';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetch',
    async (userId: number, { dispatch }) => {
        try {
            const response = await axiosIns.get(`/notifications/${userId}`);
            const notifications: NotificationType[] = response.data.data
            dispatch(setNotifications(notifications));
            const unreadCount = notifications.filter(notification => !notification.read).length;
            dispatch(setUnreadCount(unreadCount));
        } catch (error) {
            console.error(error);
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async ({ userId, notificationId }: { userId: number; notificationId: number }, { dispatch }) => {
        try {
            await axiosIns.patch(`/notifications/mark-read/${userId}`);
            dispatch(markAsRead(notificationId));
        } catch (error) {
            console.error(error);
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (userId: number, { dispatch }) => {
        try {
            await axiosIns.patch(`/notifications/mark-read/${userId}`);
            dispatch(markAllAsRead());
        } catch (error) {
            console.error(error);
        }
    }
);