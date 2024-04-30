import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';

export const useExaminerRegisterForm = () => {
    const navigateAdmin = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        branch: '',
        dob: '',
        sex: '',
        role: 'Examiner',
    });
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            navigateAdmin('/admin');
        }
    }, [navigateAdmin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('Authorization token is missing');
            setOpen(true);
            return;
        }
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            setOpen(true);
            return;
        }
        try {
            const response = await AuthService.examinerRegister(formData);
            console.log('Examiner registered:', response);
            console.log('Token used for registration:', token);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Registration failed due to an unexpected error');
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        error,
        open,
        handleClose
    };
};
