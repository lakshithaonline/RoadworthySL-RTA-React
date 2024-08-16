const API_URL = process.env.REACT_APP_BACKEND_URL;

const userToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

export const downloadInspectionReport = async (inspectionId) => {
    try {
        const response = await fetch(`${API_URL}/user/inspection/${inspectionId}/download`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken()}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Inspection_Report_${inspectionId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            console.error('Failed to download report:', response.statusText);
        }
    } catch (error) {
        console.error('Error downloading report:', error);
    }
};
