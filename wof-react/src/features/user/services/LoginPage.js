import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Snackbar, Link  } from '@mui/material';
import AuthService from '../../../services/AuthService';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await AuthService.userLogin(formData);
            setTimeout(() => {
                setLoading(false);
                navigate('/');
            }, 2000);
            console.log('User logged in:', user);
        } catch (error) {
            setLoading(false);
            if (error.response?.data?.message.includes('User not found')) {
                setSnackbarMessage('Incorrect username.');
            } else if (error.response?.data?.message.includes('Invalid password')) {
                setSnackbarMessage('Incorrect password.');
            } else {
                setSnackbarMessage('Login failed. Please try again.');
            }
            setOpen(true);
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
                    Login
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
                {loading ? (
                    <CircularProgress sx={{ mt: 4, color: '#FF8E53' }} />
                ) : (
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 4, mb: 2, width: '100%' }}
                    >
                        Login
                    </Button>
                )}
                <Link href="/user-reg" variant="body2" sx={{ mt: 2, color: 'black' }}>
                    {"Don't have an account? Register here"}
                </Link>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
                <Link
                    href="/examiner-login"
                    variant="body2"
                    sx={{
                        color: 'black',
                        mr: 2,
                        textDecoration: 'none',
                        backgroundColor: '#FBC02E',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        boxShadow: 'none', // Initial state
                        transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
                        '&:hover': {
                            backgroundColor: '#fd8f60', // Darker shade on hover
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Shadow effect on hover
                        },
                    }}
                >
                    Examiner Login
                </Link>
                <Link
                    href="/admin"
                    variant="body2"
                    sx={{
                        color: 'black',
                        textDecoration: 'none',
                        backgroundColor: '#FBC02E',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        boxShadow: 'none', // Initial state
                        transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
                        '&:hover': {
                            backgroundColor: '#fd8f60', // Darker shade on hover
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Shadow effect on hover
                        },
                    }}
                >
                    Admin Login
                </Link>
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

export default LoginPage;
