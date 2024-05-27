const BASE_URL = process.env.REACT_APP_BACKEND_URL;
export const adminLogin = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Ensure cookies are included with requests if needed for session management
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Assuming the token is returned under a key named 'token'
        localStorage.setItem('adminToken', data.token); // Store the token in localStorage

        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};
