import React, { useState } from 'react';
import { Container } from '@mui/material';
import AdminDashboard from '../components/AdminDashboard';
import Reports from '../components/Reports';
import Settings from '../components/Settings';
import AdminNavigation from '../components/AdminNavigation';
import ExaminerRegisterPage from "../components/ExaminerRegisterPage";

function AdminPage() {
    const [tabValue, setTabValue] = useState(0);

    // This function might be used directly from AdminNavigation if passed as a prop to control tab changes
    const handleChange = (index) => {
        setTabValue(index);
    };

    return (
        <Container maxWidth="lg">
            {/* Pass the handleChange function to AdminNavigation to manage navigation */}
            <AdminNavigation onChange={handleChange} />
            {tabValue === 0 && <AdminDashboard />}
            {tabValue === 1 && <Reports />}
            {tabValue === 2 && <ExaminerRegisterPage />}
            {tabValue === 3 && <Settings />}
        </Container>
    );
}

export default AdminPage;
