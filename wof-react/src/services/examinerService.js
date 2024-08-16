import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthToken = () => {
    const examiner = JSON.parse(localStorage.getItem('examinerToken'));
    return examiner ? examiner.token : null;
};

export const getAllBookedSlots = async () => {
    const response = await fetch(`${API_URL}/examiner/bookedSlots`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
    return response.json();
};

export const getAllUsers = async () => {
    const response = await fetch(`${API_URL}/examiner/get-all-users`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
    return response.json();
};

export const getAllVehiclesWithOwners = async () => {
    const response = await fetch(`${API_URL}/examiner/get-all-vehicles-users`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
    }
    return response.json();
};

export const getAllUsersWithVehicles = async () => {
    const response = await fetch(`${API_URL}/examiner/get-all-users-with-vehicles`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users with vehicles');
    }
    return response.json();
};

export const submitRatings = async (ratings) => {
    try {
        const response = await axios.post(`${API_URL}/examiner/predict`, ratings, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to submit ratings');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

export const getExaminerDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/examiner/details`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error retrieving examiner details:', error.message);
        throw error;
    }
};