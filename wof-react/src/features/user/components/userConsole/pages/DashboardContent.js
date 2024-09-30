import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider,
    Grid,
    IconButton, ListItem, ListItemText, TextField,
    Typography,
} from '@mui/material';
import {ArrowLeft, ArrowRight} from '@mui/icons-material';
import {viewVehicle} from "../../../../../services/vehicleService";
import {useNavigate} from "react-router-dom";
import {getWOFSByToken} from "../../../../../services/wofService";
import {
    deleteAppointment,
    editAppointment,
    getUserAppointments,
    getVehicles
} from "../../../../../services/AppointmentService";
import {format} from "date-fns";
import {getUserByToken} from "../../../../../services/userService";
import List from "@mui/material/List";
import ReplaySharpIcon from '@mui/icons-material/ReplaySharp';

const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
};

function VehicleWidget({ userName }) {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const vehicleListRef = useRef(null);
    const [allInspections, setAllInspections] = useState([]);
    const [error, setError] = useState(null);

    const fetchVehicles = useCallback(async () => {
        try {
            const data = await viewVehicle();
            if (data && Array.isArray(data.vehicles)) {
                const formattedVehicles = data.vehicles.map(vehicle => ({
                    ...vehicle,
                    mfd: vehicle.mfd ? vehicle.mfd.split('T')[0] : '',
                    reg: vehicle.reg ? vehicle.reg.split('T')[0] : ''
                }));
                setVehicles(formattedVehicles);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    useEffect(() => {
        const fetchAllInspections = async () => {
            setLoading(true);
            try {
                const inspectionsData = await getWOFSByToken();
                setAllInspections(inspectionsData);
            } catch (err) {
                setError('Unable to fetch WOF records. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllInspections();
    }, []);

    const scrollLeft = () => {
        vehicleListRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
        vehicleListRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'ArrowLeft') {
            scrollLeft();
        } else if (event.key === 'ArrowRight') {
            scrollRight();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const isCenterAligned = vehicles.length <= 3;

    if (loading) {
        return (
            <Card sx={{ padding: 2, mb: 3, boxShadow: 4, borderRadius: 3, width: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Vehicle Stack
                    </Typography>
                    <Typography variant="body2">Loading...</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ padding: 2, mb: 3, boxShadow: 4, borderRadius: 3, position: 'relative', width: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Vehicle Stack
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCenterAligned ? 'center' : 'flex-start',
                        position: 'relative',
                    }}
                >
                    <IconButton onClick={scrollLeft} sx={{ position: 'absolute', left: 0, zIndex: 1 }}>
                        <ArrowLeft />
                    </IconButton>
                    <Box
                        ref={vehicleListRef}
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 2,
                            flexDirection: 'row',
                            width: 'calc(100% - 60px)',
                            justifyContent: isCenterAligned ? 'center' : 'flex-start',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                            scrollbarWidth: 'none',
                        }}
                    >
                        {vehicles.map(vehicle => {
                            const vehicleInspections = allInspections.filter(inspection => inspection.vehicle._id === vehicle._id);
                            const latestInspection = vehicleInspections.length
                                ? vehicleInspections.reduce((latest, current) => {
                                    return new Date(latest.inspectionDate) > new Date(current.inspectionDate) ? latest : current;
                                })
                                : null;

                            const nextInspectionDate = latestInspection && latestInspection.nextInspectionDate
                                ? new Date(latestInspection.nextInspectionDate).toLocaleDateString()
                                : 'N/A';


                            return (
                                <Card
                                    key={vehicle._id}
                                    sx={{
                                        flex: '0 0 auto',
                                        padding: 2,
                                        borderRadius: 2,
                                        minWidth: 200,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'gray',
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                {vehicle.make.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body1" color="text.primary">
                                                {vehicle.make} {vehicle.model} - {new Date(vehicle.mfd).getFullYear()}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Registration: {vehicle.registrationNumber}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Next Inspection: {nextInspectionDate}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                    <IconButton onClick={scrollRight} sx={{ position: 'absolute', right: 0, zIndex: 1 }}>
                        <ArrowRight />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}

//Appointment Overview
function AppointmentOverviewWidget() {
    const [appointments, setAppointments] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    const filterAppointmentsWithinOneMonth = (appointments) => {
        const now = new Date();
        const oneMonthLater = new Date(now.setMonth(now.getMonth() + 1));
        return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= new Date() && appointmentDate <= oneMonthLater;
        });
    };

    const fetchAppointmentsAndVehicles = async () => {
        setLoading(true);
        try {
            const userAppointments = await getUserAppointments();
            const userVehicles = await getVehicles();

            const filteredAppointments = filterAppointmentsWithinOneMonth(userAppointments);
            setAppointments(filteredAppointments);
            setVehicles(userVehicles);
        } catch (err) {
            console.error('Error fetching appointments or vehicles', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointmentsAndVehicles();
    }, []);

    const findVehicleDetails = (registrationNumber) => {
        const vehicle = vehicles.find(v => v.registrationNumber === registrationNumber);
        return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
    };

    const openRescheduleModal = (appointment) => {
        setSelectedAppointment(appointment);
        setNewDate(format(new Date(appointment.date), 'yyyy-MM-dd'));
        setNewTime(appointment.time);
        setOpenModal(true);
    };

    const handleReschedule = async () => {
        if (newDate && newTime) {
            try {
                await editAppointment(selectedAppointment._id, newDate, newTime);
                alert('Appointment rescheduled successfully.');
                setOpenModal(false);
                const updatedAppointments = await getUserAppointments();
                const filteredAppointments = filterAppointmentsWithinOneMonth(updatedAppointments);
                setAppointments(filteredAppointments);
            } catch (error) {
                console.error('Failed to reschedule appointment:', error);
                setError('Failed to reschedule the appointment.');
            }
        }
    };

    const confirmDelete = (appointmentId) => {
        setAppointmentToDelete(appointmentId);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (appointmentToDelete) {
            await handleCancel(appointmentToDelete);
            setAppointmentToDelete(null);
            setOpenDeleteDialog(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        if (confirmDelete) {
            try {
                await deleteAppointment(appointmentId);
                alert('Appointment canceled successfully.');
                setOpenDeleteDialog(false);
                const updatedAppointments = await getUserAppointments();
                const filteredAppointments = filterAppointmentsWithinOneMonth(updatedAppointments);
                setAppointments(filteredAppointments);
            } catch (error) {
                console.error('Failed to cancel appointment:', error);
                setError('Failed to cancel the appointment.');
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Card
            sx={{
                padding: 2,
                mb: 3,
                boxShadow: 4,
                borderRadius: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Appointment Overview
                </Typography>

                {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body1" color="text.primary">
                                Vehicle: {findVehicleDetails(appointment.registrationNumber)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Registration: {appointment.registrationNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Appointment Date: {format(new Date(appointment.date), 'MMMM do, yyyy')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Time: {appointment.time}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => openRescheduleModal(appointment)}
                                >
                                    Reschedule
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => confirmDelete(appointment._id)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        No upcoming appointments within the next month.
                    </Typography>
                )}
            </CardContent>

            {/* Reschedule Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Please select a new date and time for your appointment.
                    </Typography>
                    <TextField
                        label="New Date"
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="New Time"
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleReschedule}>
                        Save
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        Yes, Cancel
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(false)}>
                        No, Go Back
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}



//Vehicle Health and Issue Overview
function VehicleHealthOverviewWidget() {
    const [loading, setLoading] = useState(true);
    const [allInspections, setAllInspections] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllInspections = async () => {
            setLoading(true);
            try {
                const inspectionsData = await getWOFSByToken();
                setAllInspections(inspectionsData);
            } catch (err) {
                setError('Unable to fetch WOF records. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllInspections();
    }, []);

    const getCriticalIssues = () => {
        return allInspections
            .filter(inspection => inspection.highCriticalConcerns.some(issue => issue.severity === 'High'))
            .map(inspection => ({
                vehicle: inspection.vehicle,
                highCriticalConcerns: inspection.highCriticalConcerns.filter(issue => issue.severity === 'High'),
                inspectionDate: inspection.inspectionDate
            }));
    };

    const handleViewMoreClick = () => {
        navigate('/dashboard/vehicle-test');
    };

    const criticalIssues = getCriticalIssues();

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Card
            sx={{
                padding: 2,
                mb: 3,
                boxShadow: 4,
                borderRadius: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Vehicle Issue Overview
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {criticalIssues.length > 0 ? (
                        criticalIssues.map((vehicle, index) => (
                            <Box key={index}>
                                <Typography variant="body1" color="text.primary">
                                    Vehicle: {vehicle.vehicle.make} {vehicle.vehicle.model} ({vehicle.vehicle.registrationNumber || 'Unknown Registration'})
                                </Typography>
                                {vehicle.highCriticalConcerns.map((issue, issueIndex) => (
                                    <Typography key={issueIndex} variant="body2" color="error">
                                        Issue #{issueIndex + 1}: {issue.parameter} - Severity: {issue.severity}
                                    </Typography>
                                ))}
                                <Divider sx={{ mt: 2, mb: 2 }} />
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No critical issues found for your vehicles.
                        </Typography>
                    )}
                    <Button variant="contained" size="small" color="primary" onClick={handleViewMoreClick}>
                        View More
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

// Recent Issue Reports Widget
function RecentIssueReportsWidget() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/dashboard/reports');
    };

    return (
        <Card
            sx={{
                padding: 2,
                mb: 3,
                boxShadow: 4,
                borderRadius: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Recent Issue Reports
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <Typography variant="body1" color="text.primary">
                        Issue: Brake inspection delay
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Status: Pending | Reported: August 10th, 2024
                    </Typography>
                    <Divider/>
                    <Button variant="contained" size="small" color="primary" onClick={handleButtonClick}>
                        Submit New Report
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

//Inspection tracker
function InspectionStatusTrackerWidget() {
    const [vehicles, setVehicles] = useState([]);
    const [allInspections, setAllInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            try {
                const vehiclesData = await getVehicles();
                setVehicles(vehiclesData);
            } catch (err) {
                setError('Unable to load vehicles. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    useEffect(() => {
        const fetchAllInspections = async () => {
            setLoading(true);
            try {
                const inspectionsData = await getWOFSByToken();
                setAllInspections(inspectionsData);
            } catch (err) {
                setError('Unable to fetch WOF records. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllInspections();
    }, []);

    const getLatestInspection = (vehicleId) => {
        const inspections = allInspections.filter(inspection =>
            inspection.vehicle._id === vehicleId
        );
        return inspections.length > 0 ? inspections[0] : null;
    };

    const getInspectionStatus = (outcome) => {
        return outcome === 1 ? 'Passed' : 'Failed';
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Card
            sx={{
                padding: 2,
                mb: 3,
                boxShadow: 4,
                borderRadius: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Inspection Status Tracker
                </Typography>
                <List sx={{ maxHeight: 300, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}> {/* Hides scrollbar */}
                    {vehicles.map((vehicle) => {
                        const latestInspection = getLatestInspection(vehicle._id);
                        const inspectionStatus = latestInspection ? getInspectionStatus(latestInspection.outcome) : 'No inspections available';
                        const inspectionDate = latestInspection && latestInspection.inspectionDate
                            ? new Date(latestInspection.inspectionDate).toLocaleDateString()
                            : 'No inspection date available';

                        return (
                            <div key={vehicle._id}>
                                <ListItem>
                                    <ListItemText
                                        primary={`Vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`}
                                        secondary={
                                            <>
                                                <div>Latest Inspection Status: {inspectionStatus}</div>
                                                <div>Inspection Date: {inspectionDate}</div>
                                                {latestInspection && latestInspection.outcome !== 1 && (
                                                    <Button
                                                        onClick={() => navigate('/dashboard/appointments')}
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{ borderRadius: 1, marginTop: 1 }}
                                                    >
                                                        <ReplaySharpIcon />
                                                    </Button>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </div>
                        );
                    })}
                </List>
            </CardContent>


        </Card>
    );
}


// Interactive Appointment Booking
function InteractiveAppointmentBooking() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/dashboard/appointments');
    };

    return (
        <Card
            sx={{
                padding: 2,
                mb: 3,
                boxShadow: 4,
                borderRadius: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Book an Appointment
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Choose an available slot:
                </Typography>
                <Button variant="contained" color="primary" size="small" sx={{mt: 2}}  onClick={handleButtonClick}>
                    Select Date & Time
                </Button>
            </CardContent>
        </Card>
    );
}

function ProfileCompletion() {
    const [completionPercentage, setCompletionPercentage] = useState(75);
    const totalSteps = 5; // Total number of steps
    const completedSteps = 3; // Number of completed steps
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/dashboard/customers');
    };

    return (
        <Card
            sx={{
                padding: 2,
                mb: 3,
                boxShadow: 4,
                borderRadius: 3,
                height: 320,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Profile Completion
                </Typography>
                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" align="left">
                        Steps Completed: {completedSteps}/{totalSteps}
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <Box position="relative" display="inline-flex">
                        <CircularProgress
                            variant="determinate"
                            value={completionPercentage}
                            size={100}
                            thickness={4}
                            sx={{
                                color: completionPercentage === 100 ? 'success.main' : 'info.main',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <Typography variant="caption" component="div" color="text.secondary">
                                {`${completionPercentage}%`}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider sx={{mb: 2}}/>
                <Button variant="contained" size="small" color="primary" onClick={handleButtonClick}>
                    Complete the profile
                </Button>
            </CardContent>
        </Card>
    );
}

// Main Dashboard Layout
export default function DashboardContent() {
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const customerData = await getUserByToken();
                setUserName(customerData.username);
            } catch (err) {
                setError('Unable to load data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="xl" sx={{mt: 4, mb: 4, width: '100%', overflow: 'hidden'}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                {`${getTimeOfDay()} ${userName ? userName : 'User'}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Manage your vehicles efficiently with the options below.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <VehicleWidget userName={userName}/>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <AppointmentOverviewWidget/>
                    <VehicleHealthOverviewWidget/>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <RecentIssueReportsWidget/>
                    <InspectionStatusTrackerWidget/>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                    <InteractiveAppointmentBooking/>
                    <ProfileCompletion/>
                </Grid>
            </Grid>
        </Container>
    );
}