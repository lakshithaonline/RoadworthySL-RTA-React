import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
    IconButton,
    ListItem,
    ListItemText,
    Divider,
    Collapse,
    List
} from '@mui/material';
import { getAllUsers } from "../../../../../services/userService";
import { getAllVehicles } from "../../../../../services/vehicleService";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CustomerManagement() {
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [expanded, setExpanded] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getAllUsers();
                const vehicleData = await getAllVehicles();
                setUsers(userData);
                setVehicles(vehicleData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleOpenVehicles = (userId) => {
        const userVehicles = vehicles.filter(vehicle => vehicle.owner === userId);
        setSelectedVehicles(userVehicles);
        setOpenVehicleDialog(true);
    };

    const handleCloseVehicleDialog = () => {
        setOpenVehicleDialog(false);
        setExpanded({});
    };

    const handleExpandClick = (vehicleId) => {
        setExpanded((prev) => ({
            ...prev,
            [vehicleId]: !prev[vehicleId],
        }));
    };

    return (
        <Container maxWidth="md" sx={{ padding: 4 }}>
            {/* Page Heading */}
            <Typography variant="h4" gutterBottom>
                Customer Management
            </Typography>

            {/* Search Bar */}
            <TextField
                label="Search by User Name or Email"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '20px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Users Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white' }}>Full Name</TableCell>
                            <TableCell style={{ color: 'white' }}>User Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Email</TableCell>
                            <TableCell style={{ color: 'white' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleOpenVehicles(user._id)}
                                    >
                                        View Vehicles
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
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

            {/* Dialog for displaying user's vehicles */}
            <Dialog open={openVehicleDialog} onClose={handleCloseVehicleDialog} fullWidth>
                <DialogTitle>Vehicle Information</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The following vehicles are registered for this user:
                    </DialogContentText>
                    <List>
                        {selectedVehicles.length > 0 ? (
                            selectedVehicles.map(vehicle => (
                                <div key={vehicle._id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${vehicle.make} ${vehicle.model} - ${vehicle.registrationNumber}`}
                                            secondary={`VIN: ${vehicle.vinNumber}`}
                                        />
                                        <IconButton onClick={() => handleExpandClick(vehicle._id)}>
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </ListItem>
                                    <Collapse in={expanded[vehicle._id]} timeout="auto" unmountOnExit>
                                        <div style={{ paddingLeft: '20px' }}>
                                            <Typography variant="body2"><strong>Mileage:</strong> {vehicle.mileage} km</Typography>
                                            <Typography variant="body2"><strong>MFD:</strong> {new Date(vehicle.mfd).toLocaleDateString()}</Typography>
                                            <Typography variant="body2"><strong>Registration Date:</strong> {new Date(vehicle.reg).toLocaleDateString()}</Typography>
                                        </div>
                                    </Collapse>
                                    <Divider />
                                </div>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No vehicles found for this user." />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVehicleDialog} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
