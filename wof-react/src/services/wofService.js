import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ExaminerToken = () => {
    const examiner = JSON.parse(localStorage.getItem('examinerToken'));
    return examiner ? examiner.token : null;
};

const userToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

const AdminToken = () => {
    const admin = JSON.parse(localStorage.getItem('adminToken'));
    return admin ? admin.token : null;
};

export const getAllWOFsADB = async () => {
    const token = AdminToken();
    try {
        const response = await axios.get(`${API_URL}/admin/get-all-wofs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.wofs;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch wofs');
        }
    }
};

// Fetch all WOF records for the logged-in user
export const getAllWOFs = async () => {
    try {
        const response = await axios.get(`${API_URL}/examiner/wof`, {
            headers: {
                'Authorization': `Bearer ${ExaminerToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch WOF records');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Fetch WOF records by the logged-in user's token
export const getWOFSByToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/wofs-by-token`, {
            headers: {
                'Authorization': `Bearer ${userToken()}`
            }
        });

        return response.data.wofs;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch WOF records');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Fetch a specific WOF record by its ID
export const getWOFById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/examiner/wof/${id}`, {
            headers: {
                'Authorization': `Bearer ${userToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch WOF record');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Get WOF records for the logged-in examiner
export const getWOFsByLoggedInExaminer = async () => {
    try {
        const response = await axios.get(`${API_URL}/examiner/wof-by-logged-in-examiner`, {
            headers: {
                'Authorization': `Bearer ${ExaminerToken()}`
            }
        });
        return response.data.wofs;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch WOFs');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

export const getWOFsByExaminerId = async (examinerId) => {
    try {
        const response = await axios.get(`${API_URL}/examiner/wof-by-examiner/${examinerId}`, {
            headers: {
                'Authorization': `Bearer ${ExaminerToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch WOFs by examiner ID');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Create a new WOF record
export const createWOF = async (wofData) => {
    try {
        const response = await axios.post(`${API_URL}/examiner/create-wof`, wofData, {
            headers: {
                'Authorization': `Bearer ${ExaminerToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to create WOF record');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Update a specific WOF record by its ID
export const updateWOF = async (id, wofData) => {
    try {
        const response = await axios.put(`${API_URL}/examiner/wof/${id}`, wofData, {
            headers: {
                'Authorization': `Bearer ${ExaminerToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to update WOF record');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Delete a specific WOF record by its ID
export const deleteWOF = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/examiner/wof/${id}`, {
            headers: {
                'Authorization': `Bearer ${ExaminerToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to delete WOF record');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

// Fetch all WOF records for a specific vehicle by its ID
export const getWOFInspectionsByVehicleId = async (vehicleId) => {
    try {
        const response = await axios.get(`${API_URL}/user/get-all-wof-by-vehicle/${vehicleId}`, {
            headers: {
                'Authorization': `Bearer ${userToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch WOF inspections');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};


export const getExaminerDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/details`, {
            headers: {
                Authorization: `Bearer ${userToken()}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error retrieving examiner details:', error.message);
        throw error;
    }
};

