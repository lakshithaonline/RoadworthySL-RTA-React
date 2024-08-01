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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HistoryIcon from '@mui/icons-material/History';
import {getAllVehiclesWithOwners} from "../../../../../services/examiner.appointment.api";


export default function VehicleManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const vehiclesPerPage = 5;

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehiclesData = await getAllVehiclesWithOwners();
                setVehicles(vehiclesData);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchVehicles();
    }, []);

    const handleActionClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedVehicleId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.owner?.username || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (action, vehicleId) => {
        console.log(`Action ${action} for vehicle ${vehicleId}`);
    };

    const handleWOFHistoryClick = (vehicleId) => {
        console.log(`View WOF history for vehicle ${vehicleId}`);
    };

    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

    const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

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
                    Vehicle Management
                </Typography>
                <Typography variant="body1" paragraph>
                    Manage all registered vehicles. Use the search bar to filter the vehicles by registration number or owner.
                </Typography>
                <TextField
                    label="Search by Registration Number or Owner"
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
                                <TableCell style={{ color: 'white' }}>Owner</TableCell>
                                <TableCell style={{ color: 'white' }}>Make</TableCell>
                                <TableCell style={{ color: 'white' }}>Model</TableCell>
                                <TableCell style={{ color: 'white' }}>VIN Number</TableCell>
                                <TableCell style={{ color: 'white' }}>Action</TableCell>
                                <TableCell style={{ color: 'white' }}>WOF History</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentVehicles.map((vehicle) => (
                                <TableRow key={vehicle._id}>
                                    <TableCell>{vehicle.registrationNumber}</TableCell>
                                    <TableCell>{vehicle.owner?.username || 'Unknown'}</TableCell>
                                    <TableCell>{vehicle.make}</TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell>{vehicle.vinNumber}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => handleActionClick(event, vehicle._id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl) && selectedVehicleId === vehicle._id}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={() => handleAction('view', vehicle._id)}>View</MenuItem>
                                            <MenuItem onClick={() => handleAction('edit', vehicle._id)}>Edit</MenuItem>
                                            <MenuItem onClick={() => handleAction('delete', vehicle._id)}>Delete</MenuItem>
                                        </Menu>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleWOFHistoryClick(vehicle._id)}>
                                            <HistoryIcon />
                                        </IconButton>
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
        </Box>
    );
}
