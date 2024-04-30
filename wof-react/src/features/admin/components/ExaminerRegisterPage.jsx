import React from 'react';
import {Container, TextField, Button, Typography, Grid, Box, Paper, Snackbar} from '@mui/material';
import {useExaminerRegisterForm} from '../hooks/useExaminerRegistration'
import Alert from "@mui/material/Alert";

const ExaminerRegisterPage = () => {
    const { formData,handleChange, handleSubmit, error, open, handleClose } = useExaminerRegisterForm();

    return (
        <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" align="center">Examiner Registration</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="First Name"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="date"
                                label="Date of Birth"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Branch"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Sex"
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                </Box>
            </Paper>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ExaminerRegisterPage;
