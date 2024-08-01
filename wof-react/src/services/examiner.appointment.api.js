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