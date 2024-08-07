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
import { getAllBookedSlots, getAllUsers } from "../../../../../services/examinerService";

export default function Appointments() {
    const [bookedSlots, setBookedSlots] = useState([]);
    const [ setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElUA, setAnchorElUA] = useState(null);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const slotsPerPage = 5;

    useEffect(() => {
        const fetchBookedSlotsAndUsers = async () => {
            try {
                const slotsData = await getAllBookedSlots();
                const usersData = await getAllUsers();

                // Create a mapping of userId to username
                const userMap = usersData.reduce((map, user) => {
                    map[user._id] = user.username;
                    return map;
                }, {});

                // Add username to each booked slot
                const updatedSlots = slotsData.map(slot => ({
                    ...slot,
                    username: userMap[slot.userId] || 'Unknown'
                }));

                setBookedSlots(updatedSlots);
                setUsers(usersData);

            } catch (error) {
                console.error('Error fetching booked slots or users:', error);
            }
        };

        fetchBookedSlotsAndUsers();
    }, []);

    const handleActionClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedSlotId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page on search
    };

    const filteredSlots = bookedSlots.filter(slot =>
        slot.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const indexOfLastSlot = currentPage * slotsPerPage;
    const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
    const currentSlots = filteredSlots.slice(indexOfFirstSlot, indexOfLastSlot);
    const totalPages = Math.ceil(filteredSlots.length / slotsPerPage);

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

    const now = new Date();
    const nowDateString = now.toDateString();

    const upcomingSlots = bookedSlots.filter(slot => {
        const slotDate = new Date(slot.date);
        const slotDateString = slotDate.toDateString();

        const timeDifference = slotDate.getTime() - now.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        const isWithin24Hours = hoursDifference <= 24 && hoursDifference >= 0;
        return slotDateString === nowDateString || isWithin24Hours;
    });

    const handleAction = (action, slotId) => {
        // Implement action handlers (e.g., start inspection, reschedule, cancel)
        console.log(`Action ${action} for slot ${slotId}`);
    };

    const handleMenuClick = (event, id) => {
        setAnchorElUA(event.currentTarget); // Set the anchor element for the menu
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Grid container spacing={2}>

                {/* Main Table for All Records */}
                <Grid item xs={12} md={8}>
                    <Box padding="20px">
                        <Typography variant="h4" component="h1" gutterBottom>
                            Appointments Overview
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Here you can view and manage all booked slots. Use the search bar below to filter the appointments.
                        </Typography>
                        <TextField
                            label="Search by Registration Number or Username"
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
                                        <TableCell style={{ color: 'white' }}>Registration Number</TableCell>
                                        <TableCell style={{ color: 'white' }}>Username</TableCell>
                                        <TableCell style={{ color: 'white' }}>Date</TableCell>
                                        <TableCell style={{ color: 'white' }}>Time</TableCell>
                                        <TableCell style={{ color: 'white' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentSlots.map((slot) => (
                                        <TableRow key={slot._id}>
                                            <TableCell>{slot.registrationNumber}</TableCell>
                                            <TableCell>{slot.username}</TableCell>
                                            <TableCell>{new Date(slot.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{slot.time}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={(event) => handleActionClick(event, slot._id)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && selectedSlotId === slot._id}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={handleClose}>View</MenuItem>
                                                    <MenuItem onClick={handleClose}>Edit</MenuItem>
                                                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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

                {/* Card for Upcoming Appointments (Within 24 Hours) */}
                <Grid item xs={12} md={4}>
                    <Box padding="20px">
                        <Typography variant="h5" component="h2" gutterBottom style={{ marginBottom: '30px' }}>
                            Upcoming Appointments
                        </Typography>
                        {upcomingSlots.map((slot) => (
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
                                <CardContent sx={{ padding: '8px' }}>
                                    <Typography variant="h6" component="div" sx={{ color: '#000000', marginBottom: '4px' }}>
                                        {slot.registrationNumber}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#000000', marginBottom: '4px' }}>
                                        Username: {slot.username}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#000000', marginBottom: '4px' }}>
                                        Date: {new Date(slot.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#000000' }}>
                                        Time: {slot.time}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '8px' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"  // Action: Start Inspection
                                        onClick={() => handleAction('start inspection', slot._id)}
                                        sx={{ fontSize: '0.75rem', color: '#fff', backgroundColor: '#000000' }}
                                    >
                                        Start Inspection
                                    </Button>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            aria-label="more options"
                                            size="small"
                                            onClick={(event) => handleMenuClick(event, slot._id)}
                                            sx={{ color: '#000000' }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorElUA}
                                            open={Boolean(anchorElUA)}
                                            onClose={() => setAnchorElUA(null)}
                                            sx={{ mt: '40px' }}
                                        >
                                            <MenuItem onClick={() => handleAction('reschedule', slot._id)}>Reschedule</MenuItem>
                                            <MenuItem onClick={() => handleAction('cancel', slot._id)}>Cancel</MenuItem>
                                        </Menu>
                                    </Box>
                                </CardActions>

                            </Card>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
