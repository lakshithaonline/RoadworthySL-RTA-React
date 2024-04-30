import React, { useState } from 'react';
import { login } from '../../../services/ApiService';
import { Box, Button, TextField, Typography, CircularProgress, Snackbar  } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Checking if any field is empty before making the API call
        if (!username || !password) {
            setLoading(false);
            setSnackbarMessage('Please fill in all required fields.');
            setOpen(true);
            return;
        }

        try {
            await login(username, password);
            setTimeout(() => {
                setLoading(false);
                navigate('/admin-dashboard');
            }, 2000);
        } catch (error) {
            setLoading(false);
            if (error.message.includes('User not found')) {
                setSnackbarMessage('Incorrect username.');
            } else if (error.message.includes('Invalid password')) {
                setSnackbarMessage('Incorrect password.');
            } else {
                setSnackbarMessage('Login failed. Please try again.');
            }
            setOpen(true);
        }
    };

    return (
        <Box
            component="form"
            sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #121212, #333333 90%)',
            }}
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
        >
            <Box
                sx={{p: 3, boxShadow: 3, borderRadius: 2, background: '#fff', maxWidth: 300, alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%', '& .MuiTextField-root': { m: 1 },
                }}
            >
                <Typography variant="h6" sx={{ textAlign: 'center', m: 2, fontWeight: 'bold' }}>
                    Admin Login
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
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
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
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
                        sx={{mt: 4, mb: 2, width: '100%', background: 'linear-gradient(45deg, #333333, #fffff)', boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)', color: 'black',
                            '&:hover': { background: 'linear-gradient(65deg, #333333, #FF8E53)', fontColor: 'white', transform: 'scale(1.05)',}
                        }}
                    >
                        Login
                    </Button>
                )}
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={snackbarMessage}
            />
        </Box>
    );
}

export default AdminLoginPage;
