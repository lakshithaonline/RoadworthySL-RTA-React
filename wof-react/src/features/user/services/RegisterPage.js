import React, { useState, useCallback } from 'react';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import AuthService from '../../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import {
    validateEmail,
    validateUsername,
    validateAge,
    sanitizeInput,
} from '../../../utils/validationUtils';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
        firstName: '',
        lastName: '',
        profilePicture: '',
        dateOfBirth: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);

        setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));

        if (name === 'password' || name === 'passwordConfirmation') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordConfirmation: sanitizedValue === formData.password ? '' : 'Passwords do not match',
            }));
        }
    }, [formData.password]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const tempErrors = validateForm();

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }
        try {
            const newUser = await AuthService.userRegister(formData);
            console.log('User registered:', newUser);
            navigate('/user-login');
        } catch (error) {
            console.error('Registration failed:', error);
            setErrors({ form: 'Registration failed. Please try again.' });
        }
    }, [formData, navigate]);

    const validateForm = () => {
        const tempErrors = {};
        if (!formData.username || !validateUsername(formData.username)) {
            tempErrors.username = 'Username must be at least 3 characters long and alphanumeric';
        }
        if (!formData.email || !validateEmail(formData.email)) {
            tempErrors.email = 'Invalid email format';
        }
        if (!formData.password || formData.password !== formData.passwordConfirmation) {
            tempErrors.passwordConfirmation = 'Passwords do not match';
        }
        if (!formData.dateOfBirth || !validateAge(formData.dateOfBirth)) {
            tempErrors.dateOfBirth = 'You must be at least 18 years old';
        }
        return tempErrors;
    };

    return (
        <Box
            component="form"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(45deg, #121212, #333333 90%)',
                padding: 2,
            }}
            onSubmit={handleSubmit}
            noValidate
        >
            <Box
                sx={{
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    background: '#fff',
                    maxWidth: 400,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" sx={{ textAlign: 'center', m: 2, fontWeight: 'bold' }}>
                    Register
                </Typography>

                <Grid container spacing={2}>
                    {/* First Name and Last Name */}
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            sx={inputStyles}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            sx={inputStyles}
                        />
                    </Grid>

                    {/* Username and Email */}
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            sx={inputStyles}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={inputStyles}
                        />
                    </Grid>

                    {/* Password and Confirm Password */}
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={inputStyles}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Confirm Password"
                            name="passwordConfirmation"
                            type="password"
                            value={formData.passwordConfirmation}
                            onChange={handleChange}
                            error={!!errors.passwordConfirmation}
                            helperText={errors.passwordConfirmation}
                            sx={inputStyles}
                        />
                    </Grid>

                    {/* Profile Picture and Date of Birth */}
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Profile Picture URL"
                            name="profilePicture"
                            value={formData.profilePicture}
                            onChange={handleChange}
                            error={!!errors.profilePicture}
                            helperText={errors.profilePicture}
                            sx={inputStyles}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth}
                            sx={inputStyles}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 2, width: '100%' }}
                >
                    Register
                </Button>
                <Link href="/user-login" variant="body2" sx={{ mt: 2, color: 'black' }}>
                    Already have an account? Login here
                </Link>
            </Box>
        </Box>
    );
};

// Input styles
const inputStyles = {
    input: { color: '#333' },
    '& .MuiInputLabel-root': {
        color: 'black',
        '&.Mui-focused': {
            color: 'black',
        },
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black',
        },
        '&:hover fieldset': {
            borderColor: 'black',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
    },
};

export default RegisterPage;
