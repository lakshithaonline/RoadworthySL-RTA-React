import React, { useEffect, useState } from 'react';
import {
    Box,
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
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getAllUsersWithVehicles } from "../../../../../services/examiner.appointment.api";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserVehicles, setSelectedUserVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsersWithVehicles();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users with vehicles:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleActionClick = (event, userId) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserId(userId);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleDialogOpen = (user) => {
        setSelectedUserVehicles(user.vehicles || []);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        <Box sx={{ flexGrow: 1, display: 'flex', padding: '20px' }}>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Management
                </Typography>
                <Typography variant="body1" paragraph>
                    Manage all users and view their associated vehicles. Use the search bar to filter users by username or email.
                </Typography>
                <TextField
                    label="Search by Username or Email"
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
                                <TableCell style={{ color: 'white' }}>Username</TableCell>
                                <TableCell style={{ color: 'white' }}>Email</TableCell>
                                <TableCell style={{ color: 'white' }}>Role</TableCell>
                                <TableCell style={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email || 'Unknown'}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => handleActionClick(event, user._id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl) && selectedUserId === user._id}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={() => handleDialogOpen(user)}>View Vehicles</MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Typography variant="body1">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </Box>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Associated Vehicles</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: 'black' }}>
                                    <TableCell style={{ color: 'white' }}>Registration Number</TableCell>
                                    <TableCell style={{ color: 'white' }}>Make</TableCell>
                                    <TableCell style={{ color: 'white' }}>Model</TableCell>
                                    <TableCell style={{ color: 'white' }}>VIN Number</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedUserVehicles.map((vehicle) => (
                                    <TableRow key={vehicle._id}>
                                        <TableCell>{vehicle.registrationNumber}</TableCell>
                                        <TableCell>{vehicle.make}</TableCell>
                                        <TableCell>{vehicle.model}</TableCell>
                                        <TableCell>{vehicle.vinNumber}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
