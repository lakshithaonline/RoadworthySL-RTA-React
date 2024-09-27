import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, CircularProgress, Grid, Snackbar, Typography, TextField } from '@mui/material';
import { getAllBookedSlots } from "../../../../../services/examinerService";
import { approveAppointment, getExaminerAppointments } from "../../../../../services/AppointmentService";

const AppointmentManager = () => {
    const [appointments, setAppointments] = useState([]);
    const [approvedAppointments, setApprovedAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const bookedSlots = await getAllBookedSlots();
            const unapprovedSlots = bookedSlots.filter(slot => !slot.approved);
            setAppointments(unapprovedSlots);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApprovedAppointments = async () => {
        try {
            setLoading(true);
            const approvedSlots = await getExaminerAppointments();
            setApprovedAppointments(approvedSlots);
        } catch (error) {
            console.error('Error fetching approved appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (appointmentId) => {
        try {
            setApproving(true);
            await approveAppointment(appointmentId);
            setSnackbarMessage('Appointment approved successfully!');
            setSnackbarOpen(true);
            fetchAppointments();
            fetchApprovedAppointments();
        } catch (error) {
            console.error('Error approving appointment:', error);
            setSnackbarMessage('Error approving appointment');
            setSnackbarOpen(true);
        } finally {
            setApproving(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        fetchAppointments();
        fetchApprovedAppointments();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header style={{ padding: '10px', textAlign: 'left' }}>
                <Typography variant="h4">Appointment Management</Typography>
            </header>

                <main style={{  padding: '10px', flexGrow: 1 }}>
                    <div style={{ marginBottom: '20px' }}>
                        <TextField
                            label="Search by Registration Number"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                        />
                    </div>

                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Typography variant="h6">Pending Appointments</Typography>
                            <Grid container spacing={2}>
                                {appointments.length === 0 ? (
                                    <Typography>No appointments available.</Typography>
                                ) : (
                                    appointments
                                        .filter(appointment =>
                                            appointment.registrationNumber.includes(searchTerm)
                                        )
                                        .map((appointment) => (
                                            <Grid item xs={12} sm={6} md={4} key={appointment._id}>
                                                <Card style={{ borderColor: 'red', borderWidth: 2 }}>
                                                    <CardContent>
                                                        <Typography><strong>Registration Number:</strong> {appointment.registrationNumber}</Typography>
                                                        <Typography><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</Typography>
                                                        <Typography><strong>Time:</strong> {appointment.time}</Typography>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            disabled={approving}
                                                            onClick={() => handleApprove(appointment._id)}
                                                            style={{ marginTop: 10 }}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))
                                )}
                            </Grid>

                            <Typography variant="h6" style={{ marginTop: 30 }}>Approved Appointments</Typography>
                            <Grid container spacing={2}>
                                {approvedAppointments.length === 0 ? (
                                    <Typography>No approved appointments yet.</Typography>
                                ) : (
                                    approvedAppointments.map((appointment) => (
                                        <Grid item xs={12} sm={6} md={4} key={appointment._id}>
                                            <Card style={{ borderColor: 'green', borderWidth: 2 }}>
                                                <CardContent>
                                                    <Typography><strong>Registration Number:</strong> {appointment.registrationNumber}</Typography>
                                                    <Typography><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</Typography>
                                                    <Typography><strong>Time:</strong> {appointment.time}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        </>
                    )}

                    {/* Snackbar for success/failure messages */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('Error') ? 'error' : 'success'}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </main>
        </div>
    );
};

export default AppointmentManager;