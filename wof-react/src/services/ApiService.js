const BASE_URL = process.env.REACT_APP_BACKEND_URL;
export const adminLogin = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('adminToken', JSON.stringify(data));

        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};
