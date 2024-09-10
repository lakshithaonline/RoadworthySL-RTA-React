import * as React from 'react';
import {
    Container, Grid, Typography, Card, CardContent, Button, Divider, Box, Avatar, IconButton, CircularProgress,
} from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import {useEffect, useRef, useState} from "react";

// Utility function to get the current time of day
const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
};

function VehicleWidget({ userName }) {
    const vehicleListRef = useRef(null);

    const scrollLeft = () => {
        if (vehicleListRef.current) {
            vehicleListRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (vehicleListRef.current) {
            vehicleListRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowLeft') {
            scrollLeft();
        } else if (event.key === 'ArrowRight') {
            scrollRight();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const vehicles = [
        { id: 1, make: 'Toyota', model: 'Corolla 2021', reg: 'ABC123', nextInspection: 'September 15th, 2024' },
        { id: 2, make: 'Honda', model: 'Civic 2020', reg: 'XYZ456', nextInspection: 'October 5th, 2024' },
        { id: 3, make: 'Ford', model: 'Focus 2019', reg: 'LMN789', nextInspection: 'November 20th, 2024' },
        { id: 4, make: 'Chevrolet', model: 'Malibu 2018', reg: 'OPQ012', nextInspection: 'December 10th, 2024' }
    ];

    return (
        <Card
            sx={{
                padding: 2,
                mb: 3,
                boxShadow: 4,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
                width: '100%',
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Vehicle stack
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={scrollLeft} sx={{ position: 'absolute', left: 0, zIndex: 1 }}>
                        <ArrowLeft />
                    </IconButton>
                    <Box
                        ref={vehicleListRef}
                        sx={{
                            display: 'flex',
                            overflowX: 'hidden',
                            gap: 2,
                            flexDirection: 'row',
                            width: 'calc(100% - 60px)', // Adjust width to account for the scroll buttons
                        }}
                    >
                        {vehicles.map(vehicle => (
                            <Card
                                key={vehicle.id}
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
                                            {vehicle.make} {vehicle.model}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Registration: {vehicle.reg}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Next Inspection: {vehicle.nextInspection}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                    <IconButton onClick={scrollRight} sx={{ position: 'absolute', right: 0, zIndex: 1 }}>
                        <ArrowRight />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}



// Appointment Overview Widget
function AppointmentOverviewWidget() {
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
                <Typography variant="body1" color="text.secondary">
                    Next appointment: August 25th, 2024
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Status: Confirmed
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                        Reschedule
                    </Button>
                    <Button variant="outlined" color="error" size="small">
                        Cancel
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

// Vehicle Management Widget
function VehicleManagementWidget() {
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
                    Vehicle Management
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="body1" color="text.primary">
                            Vehicle: Toyota Corolla 2021
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Registration: ABC123 | Next Inspection: September 15th, 2024
                        </Typography>
                        <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                            Update Info
                        </Button>
                    </Box>
                    <Divider />
                    <Button variant="contained" size="small" color="primary">
                        Book New Appointment
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}



// Recent Issue Reports Widget
function RecentIssueReportsWidget() {
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1" color="text.primary">
                        Issue: Brake inspection delay
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Status: Pending | Reported: August 10th, 2024
                    </Typography>
                    <Divider />
                    <Button variant="contained" size="small" color="primary">
                        Submit New Report
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

// Next Inspection Prediction Widget
function NextInspectionPredictionWidget() {
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
                    Next Inspection Prediction
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Based on your vehicle's history, the next inspection is likely required by:
                </Typography>
                <Typography variant="h5" color="text.primary" sx={{ mt: 1 }}>
                    September 10th, 2024
                </Typography>
            </CardContent>
        </Card>
    );
}


// Interactive Appointment Booking
function InteractiveAppointmentBooking() {
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
                <Button variant="contained" color="primary" size="small" sx={{ mt: 2 }}>
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
                <Divider sx={{ mb: 2 }} />
                <Button variant="contained" size="small" color="primary">
                    Complete the profile
                </Button>
            </CardContent>
        </Card>
    );
}

// Main Dashboard Layout
export default function DashboardContent() {
    // Simulate fetching user data
    const [userName, setUserName] = useState('Lakshitha');

    useEffect(() => {
        // You can replace this with real authentication logic to get the user's name
        setUserName('Lakshitha'); // Example username
    }, []);

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                {`${getTimeOfDay()} ${userName}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Manage your vehicles efficiently with the options below.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <VehicleWidget userName={userName} />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <AppointmentOverviewWidget />
                    <VehicleManagementWidget />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <RecentIssueReportsWidget />
                    <NextInspectionPredictionWidget />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                    <InteractiveAppointmentBooking />
                    <ProfileCompletion/>
                </Grid>
            </Grid>
        </Container>
    );
}