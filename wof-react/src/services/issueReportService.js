import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const userToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

// Create a new issue report
export const createIssueReport = async (issueReportData) => {
    try {
        const response = await axios.post(`${API_URL}/user/issue-report`, issueReportData, {
            headers: {
                'Authorization': `Bearer ${userToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to create issue report');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Fetch a specific issue report by its ID
export const getIssueReportById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/user/issue-report/${id}`, {
            headers: {
                'Authorization': `Bearer ${userToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch issue report');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Fetch all issue reports created by the logged-in user
export const getAllIssueReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/issue-reports`, {
            headers: {
                'Authorization': `Bearer ${userToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch issue reports');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};
