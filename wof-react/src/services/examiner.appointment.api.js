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