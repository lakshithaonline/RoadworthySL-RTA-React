import React, { useEffect, useState } from 'react';
import {
    Box,
    IconButton,
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
    DialogTitle,
    DialogContent,
    Card,
    CardContent,
    Grid,
    Link as MUILink,
    Accordion,
    AccordionSummary,
    AccordionDetails, DialogActions
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAllVehiclesWithOwners } from "../../../../../services/examinerService";
import { getAllWOFs } from '../../../../../services/wofService';

export default function VehicleManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [wofReports, setWofReports] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Added this
    const [currentVehicleWOFs, setCurrentVehicleWOFs] = useState([]);

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

    useEffect(() => {
        const fetchWOFReports = async () => {
            try {
                const wofs = await getAllWOFs();
                setWofReports(wofs.wofs);  // Assuming wofs.wofs contains the array of WOF reports
            } catch (error) {
                console.error('Error fetching WOF reports:', error);
            }
        };

        fetchWOFReports();
    }, []);

    const handleActionClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedVehicleId(id);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleWOFHistoryClick = (vehicleId) => {
        const vehicleWOFs = wofReports.filter(wof => wof.vehicle._id === vehicleId);
        setCurrentVehicleWOFs(vehicleWOFs);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setCurrentVehicleWOFs([]);
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.owner?.username || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                {/* WOF History Dialog */}
                <Dialog
                    open={isDialogOpen}
                    onClose={handleDialogClose}
                    fullWidth
                    maxWidth="md"
                    aria-labelledby="wof-history-dialog-title"
                    sx={{ boxShadow: 'none' }}
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                        WOF History
                    </DialogTitle>
                    <DialogContent dividers sx={{ padding: '16px 24px' }}>
                        {currentVehicleWOFs.length > 0 ? (
                            currentVehicleWOFs.map((wof) => (
                                <Card key={wof._id}  sx={{ boxShadow: 'none', marginBottom: '-20px' }}>
                                    <CardContent >
                                        <Accordion >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="h6">
                                                    Inspection Date: {new Date(wof.inspectionDate).toLocaleDateString()}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="body2">
                                                            <strong>Mileage: </strong>{wof.vehicle.mileage}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="body2">
                                                            <strong>Final Score: </strong>{wof.finalScore}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="body2">
                                                            <strong>Outcome: </strong>{wof.outcome === 1 ? 'Pass' : 'Fail'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="body2">
                                                            <strong>Next Inspection Date: </strong>
                                                            {wof.nextInspectionDate
                                                                ? new Date(wof.nextInspectionDate).toLocaleDateString()
                                                                : 'N/A - '}
                                                            {!wof.nextInspectionDate && (
                                                                <MUILink href="/dashboard/reports" underline="hover" color="primary">
                                                                    contact support
                                                                </MUILink>
                                                            )}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2">
                                                            <strong>High Critical Concerns: </strong>
                                                        </Typography>
                                                        {wof.highCriticalConcerns && wof.highCriticalConcerns.length > 0 ? (
                                                            <ul>
                                                                {wof.highCriticalConcerns.map((concern, idx) => (
                                                                    <li key={idx}>
                                                                        <Typography variant="body2">
                                                                            Parameter: {concern.parameter}, Score: {concern.score}, Severity: {concern.severity}
                                                                        </Typography>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <Typography variant="body2">None</Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body1">No WOF history found for this vehicle.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ padding: '16px 24px' }}>
                        <Button variant="outlined" onClick={handleDialogClose}>Close</Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
}
