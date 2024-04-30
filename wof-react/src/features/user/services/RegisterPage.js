import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Snackbar } from '@mui/material';
import AuthService from '../../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'User',
    });
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = await AuthService.register(formData);
            setTimeout(() => {
                navigate('/user-login');
            }, 2000);
            console.log('User registered:', newUser);
        } catch (error) {
            if (error.response?.data?.message) {
                setSnackbarMessage(error.response.data.message);
                setOpen(true);
            }
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Box
            component="form"
            sx={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #121212, #333333 90%)',
            }}
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
        >
            <Box
                sx={{ p: 3, boxShadow: 3, borderRadius: 2, background: '#fff', maxWidth: 300, alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%', '& .MuiTextField-root': { m: 1 },
                }}
            >
                <Typography variant="h6" sx={{ textAlign: 'center', m: 2, fontWeight: 'bold' }}>
                    Register
                </Typography>
                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    sx={{
                        input: { color: '#333' },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                            '&.Mui-focused': {
                                color: 'black',
                            }
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
                        }
                    }}
                />
                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{
                        input: { color: '#333' },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                            '&.Mui-focused': {
                                color: 'black',
                            }
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
                        }
                    }}
                />
                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                        input: { color: '#333' },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                            '&.Mui-focused': {
                                color: 'black',
                            }
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
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 4, mb: 2, width: '100%' }}
                >
                    Register
                </Button>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default RegisterPage;
