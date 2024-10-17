import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
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
import moment from 'moment';
import {getAllAppointment} from "../../../../../services/AppointmentService"; // If you want to format date

export default function AppointmentsManagement() {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(10); // Number of appointments per page

    // Fetch appointments when the component mounts
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAllAppointment();
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    // Filter appointments based on search term
    const filteredAppointments = appointments.filter(appointment =>
        appointment.vehicleId.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate current appointments to display
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    // Pagination
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

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

    return (
        <Container maxWidth="md" sx={{padding: 4}}>
            {/* Heading */}
            <Typography variant="h4" component="h1" gutterBottom>
                All Appointments
            </Typography>

            {/* Search Bar */}
            <TextField
                label="Search by Registration Number"
                variant="outlined"
                fullWidth
                sx={{marginBottom: '20px'}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Appointments Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{backgroundColor: 'black'}}>
                            <TableCell style={{color: 'white'}}>Registration Number</TableCell>
                            <TableCell style={{color: 'white'}}>Date</TableCell>
                            <TableCell style={{color: 'white'}}>Time</TableCell>
                            <TableCell style={{color: 'white'}}>Status</TableCell>
                            <TableCell style={{color: 'white'}}>Examiner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentAppointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                                <TableCell>{appointment.registrationNumber}</TableCell>
                                <TableCell>{moment(appointment.date).format('YYYY-MM-DD')}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>{appointment.approved ? 'Approved' : 'Pending'}</TableCell>
                                <TableCell>
                                    {appointment.examinerId ? `${appointment.examinerId.firstname} ${appointment.examinerId.lastname}` : 'Pending'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    sx={{marginRight: '10px'}}
                >
                    Previous
                </Button>
                <Typography variant="body1" sx={{display: 'flex', alignItems: 'center'}}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    sx={{marginLeft: '10px'}}
                >
                    Next
                </Button>
            </Box>
        </Container>
    );
}
