import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
    const examinerToken = localStorage.getItem('adminToken');
    return examinerToken ? children : <Navigate to="/admin" />;
};

export default PrivateAdminRoute;
