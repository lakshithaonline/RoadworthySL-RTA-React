import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateUserRoute = ({ children }) => {
    const examinerToken = localStorage.getItem('user');
    return examinerToken ? children : <Navigate to="/user-login" />;
};

export default PrivateUserRoute;
