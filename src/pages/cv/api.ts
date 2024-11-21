import axios from 'axios';
import { Resume } from './types';
import axiosIns from '../../services/axiosIns';

const API_BASE_URL = 'http://localhost:8080/resumes';

export const fetchResume = async () => {
    try {
        const response = await axiosIns.get('/resumes/2', { includeToken: true });

        // Ensure we have a valid response structure
        return response.data;


    } catch (error) {
        console.error('Error fetching resume:', error);
        throw error;
    }
};

export const saveResume = async (resumeData: Resume) => {
    try {
        let response;

        if (resumeData.id) {
            // Update existing resume
            response = await axios.put(
                `${API_BASE_URL}/${resumeData.id}`,
                resumeData
            );
        } else {
            // Create new resume
            response = await axios.post(API_BASE_URL, resumeData);
        }

        return response.data;
    } catch (error) {
        console.error('Error saving resume:', error);
        throw error;
    }
};

export const deleteProject = async (resumeId: number, projectId: number) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/${resumeId}/projects/${projectId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};