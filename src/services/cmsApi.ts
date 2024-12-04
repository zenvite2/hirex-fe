import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosIns from './axiosIns';

// Fetch all notification templates
export const fetchNotificationTemplates = createAsyncThunk<any>(
  'notification/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosIns.get('/cms/pattern');
      return { response: response.data };
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

export const GetAllNotiParttern = createAsyncThunk<any>(
    'notification/fetchTemplates',
    async () => {
        return axiosIns.get('/cms/pattern', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Save a notification template
export const saveNotificationTemplate = createAsyncThunk<any, { type: string; subject: string; content: string }>(
    'notification/saveTemplate',
    async (templateData, { rejectWithValue }) => {
      try {
        const response = await axiosIns.post('/api/notifications/patterns', templateData);
        return { response: response.data };
      } catch (error: any) {
        console.error('Error saving template:', error);
        return rejectWithValue(error.response?.data || 'Unknown error');
      }
    }
  );

// Send a notification
export const sendNotification = createAsyncThunk<any, { title: string; content: string; sendTo: number }>(
  'notification/send',
  async (notificationData: { title: string; content: string; sendTo: number }, { rejectWithValue }) => {
    try {
      const response = await axiosIns.post('/api/notifications/send', notificationData);
      return { response: response.data };
    } catch (error: any) {
      console.error('Error sending notification:', error);
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);
