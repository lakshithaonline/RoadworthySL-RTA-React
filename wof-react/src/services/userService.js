import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Retrieve the authentication token from local storage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

const AdminToken = () => {
    const admin = JSON.parse(localStorage.getItem('adminToken'));
    return admin ? admin.token : null;
};

export const getAllUsers = async () => {
    const token = AdminToken();
    try {
        const response = await axios.get(`${API_URL}/admin/get-all-users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch users');
        }
    }
};

export const getUserByToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/by-token`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        return response.data.user;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch user records');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

export const updateUser = async (updateData) => {
    const token = getAuthToken();
    try {
        const response = await axios.put(`${API_URL}/user/update`, updateData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw new Error('Unable to update user data');
    }
};

export const deleteUser = async () => {
    const token = getAuthToken();
    try {
        const response = await axios.delete(`${API_URL}/user/delete`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Unable to delete user');
    }
};