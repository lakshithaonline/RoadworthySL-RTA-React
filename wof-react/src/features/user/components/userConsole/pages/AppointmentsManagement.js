import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getUserAppointments } from "../../../../../services/AppointmentService";
import {viewVehicle} from "../../../../../services/vehicleService"; // Update the import to include viewVehicle

export default function AppointmentsManagement() {
    const [appointments, setAppointments] = useState([]);
    const [vehicles, setVehicles] = useState([]); // State to store vehicles
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const slotsPerPage = 5;

    useEffect(() => {
        const fetchAppointmentsAndVehicles = async () => {
            try {
                setLoading(true);
                const bookedSlots = await getUserAppointments();
                const vehicleData = await viewVehicle();

                if (Array.isArray(bookedSlots)) {
                    setAppointments(bookedSlots); // Set all appointments, both approved and unapproved
                } else {
                    console.error("Expected an array, but got:", bookedSlots);
                }

                // Check if the response has the vehicles array
                if (vehicleData && Array.isArray(vehicleData.vehicles)) {
                    setVehicles(vehicleData.vehicles);
                } else {
                    console.error("Expected an array of vehicles, but got:", vehicleData);
                }
            } catch (error) {
                console.error('Error fetching appointments or vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentsAndVehicles();
    }, []);


    const handleActionClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedAppointmentId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page on search
    };

    const filteredAppointments = appointments.filter(slot =>
        slot.vehicleId && vehicles.find(vehicle => vehicle._id === slot.vehicleId)?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const indexOfLastSlot = currentPage * slotsPerPage;
    const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
    const currentSlots = filteredAppointments.slice(indexOfFirstSlot, indexOfLastSlot);
    const totalPages = Math.ceil(filteredAppointments.length / slotsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Check for upcoming approved appointments (within 24 hours)
    const now = new Date();
    const upcomingAppointments = appointments.filter(appointment => {
        if (appointment.approved) { // Only approved appointments
            const appointmentDate = new Date(appointment.date);
            const timeDifference = appointmentDate.getTime() - now.getTime();
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            return hoursDifference <= 24 && hoursDifference >= 0; // Upcoming in the next 24 hours
        }
        return false;
    });

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Grid container spacing={2}>
                {/* Main Table for All Appointments (Approved & Unapproved) */}
                <Grid item xs={12} md={8}>
                    <Box padding="20px">
                        <Typography variant="h4" component="h1" gutterBottom>
                            All Appointments
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Below are all the appointments. Use the search bar to filter the appointments by vehicle make and model.
                        </Typography>
                        <TextField
                            label="Search by Vehicle Make and Model"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ marginBottom: '20px' }}
                        />

                        <TableContainer component={Paper} style={{ padding: '20px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ backgroundColor: 'black' }}>
                                        <TableCell style={{ color: 'white' }}>Vehicle Make & Model</TableCell>
                                        <TableCell style={{ color: 'white' }}>Date</TableCell>
                                        <TableCell style={{ color: 'white' }}>Time</TableCell>
                                        <TableCell style={{ color: 'white' }}>Status</TableCell>
                                        <TableCell style={{ color: 'white' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentSlots.map((slot) => {
                                        // Find the vehicle associated with this appointment
                                        const vehicle = vehicles.find(vehicle => vehicle._id === slot.vehicleId);
                                        const vehicleMakeModel = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
                                        return (
                                            <TableRow key={slot._id}>
                                                <TableCell>{vehicleMakeModel}</TableCell>
                                                <TableCell>{new Date(slot.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{slot.time}</TableCell>
                                                <TableCell>
                                                    {slot.approved ? (
                                                        <Typography variant="body2" color="green">Approved</Typography>
                                                    ) : (
                                                        <Typography variant="body2" color="orange">Pending</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <IconButton onClick={(event) => handleActionClick(event, slot._id)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl) && selectedAppointmentId === slot._id}
                                                        onClose={handleClose}
                                                    >
                                                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                                                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination Controls */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                sx={{ marginRight: '10px' }}
                            >
                                Previous
                            </Button>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                Page {currentPage} of {totalPages}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                sx={{ marginLeft: '10px' }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Card for Upcoming Approved Appointments */}
                <Grid item xs={12} md={4}>
                    <Box padding="20px">
                        <Typography variant="h5" component="h2" gutterBottom style={{ marginBottom: '30px' }}>
                            Upcoming Approved Appointments
                        </Typography>
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((slot) => {
                                const vehicle = vehicles.find(vehicle => vehicle._id === slot.vehicleId);
                                const vehicleMakeModel = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
                                return (
                                    <Card
                                        key={slot._id}
                                        sx={{
                                            marginBottom: '10px',
                                            maxWidth: 260,
                                            backgroundColor: '#adadad',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6">{vehicleMakeModel}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Date: {new Date(slot.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Time: {slot.time}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Status: Approved
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary">
                                                View
                                            </Button>
                                            <Button size="small" color="error">
                                                Cancel
                                            </Button>
                                        </CardActions>
                                    </Card>
                                );
                            })
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No upcoming approved appointments.
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
