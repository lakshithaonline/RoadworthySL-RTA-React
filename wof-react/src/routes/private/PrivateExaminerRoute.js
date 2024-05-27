import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateExaminerRoute = ({ children }) => {
    const examinerToken = localStorage.getItem('examinerToken');
    return examinerToken ? children : <Navigate to="/examiner-login" />;
};

export default PrivateExaminerRoute;
