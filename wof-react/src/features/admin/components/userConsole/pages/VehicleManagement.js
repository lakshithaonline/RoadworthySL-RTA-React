import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Typography,
    TextField,
    Container,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { getAllVehiclesWithDetails } from "../../../../../services/vehicleService";

export default function VehicleManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await getAllVehiclesWithDetails();
                setVehicles(response);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };

        fetchVehicles();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const currentVehicles = filteredVehicles.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleMenuClick = (event, vehicle) => {
        setAnchorEl(event.currentTarget);
        setSelectedVehicle(vehicle);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        console.log("Edit vehicle:", selectedVehicle);
    };

    const handleDelete = () => {
        handleMenuClose();
        console.log("Delete vehicle:", selectedVehicle);
    };

    const open = Boolean(anchorEl);

    return (
        <Container maxWidth="md" sx={{ padding: 4 }}>
            {/* Page Heading */}
            <Typography variant="h4" gutterBottom>
                Vehicle Management
            </Typography>

            {/* Search Bar */}
            <TextField
                label="Search by Vehicle Make, Model, or Registration"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '20px' }}
                value={searchQuery}
                onChange={handleSearchChange}
            />

            {/* Vehicles Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white' }}>Vehicle Make</TableCell>
                            <TableCell style={{ color: 'white' }}>Vehicle Model</TableCell>
                            <TableCell style={{ color: 'white' }}>Registration Number</TableCell>
                            <TableCell style={{ color: 'white' }}>Owner Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Owner Email</TableCell>
                            <TableCell style={{ color: 'white' }}>Actions</TableCell> {/* Action Column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentVehicles.length > 0 ? (
                            currentVehicles.map((vehicle) => (
                                <TableRow key={vehicle._id}>
                                    <TableCell>{vehicle.make}</TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell>{vehicle.registrationNumber}</TableCell>
                                    <TableCell>{`${vehicle.owner.firstName} ${vehicle.owner.lastName}`}</TableCell>
                                    <TableCell>{vehicle.owner.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => handleMenuClick(event, vehicle)}>
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No vehicles found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Menu for Edit and Delete Actions */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

            {/* Custom Pagination */}
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
        </Container>
    );
}
