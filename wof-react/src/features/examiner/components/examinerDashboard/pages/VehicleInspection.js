import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {getWOFsByLoggedInExaminer} from "../../../../../services/wofService";
import {getExaminerAppointments} from "../../../../../services/AppointmentService";
import {registerVehicleByExaminer} from "../../../../../services/examinerService";
import ManualEvaluation from "./dashboardParts/components/ManualEvaluation";
import ScheduledEvaluation from "./dashboardParts/components/ScheduledEvaluation";

export default function VehicleTests() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [slotsPerPage] = useState(5);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedInspection, setSelectedInspection] = useState(null);
    const [scheduledInspections, setScheduledInspections] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        registrationNumber: '',
        make: '',
        model: '',
        vinNumber: '',
        mfd: '',
        reg: '',
        mileage: ''
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isManualEvOpen, setIsManualEvOpen] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const fetchScheduledInspections = async () => {
        try {
            const appointments = await getExaminerAppointments();
            const filteredAppointments = appointments.filter(appointment => !appointment.completed);

            const sortedAppointments = filteredAppointments.sort((a, b) =>
                new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time)
            );

            setScheduledInspections(sortedAppointments);
        } catch (error) {
            console.error("Error fetching scheduled inspections:", error);
        }
    };

    useEffect(() => {
        fetchScheduledInspections();
    }, []);

    const fetchWOFRecords = async () => {
        try {
            const wofs = await getWOFsByLoggedInExaminer();
            setFilteredSlots(wofs);
        } catch (error) {
            console.error("Error fetching WOF records:", error);
        }
    };

    useEffect(() => {
        fetchWOFRecords();
    }, []);

    const handleActionClick = (event, slotId) => {
        setAnchorEl(event.currentTarget);
        setSelectedSlotId(slotId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedSlotId(null);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedInspection(null);
    };

    const handleViewClick = (slot) => {
        setSelectedInspection(slot);
        setOpenDialog(true);
        handleClose();
    };

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

    const handleOpenAddVehicleModal = () => {
        setOpenAddVehicleModal(true);
    };

    const handleCloseAddVehicleModal = () => {
        setOpenAddVehicleModal(false);
    };

    const handleVehicleInputChange = (e) => {
        const {name, value} = e.target;
        setNewVehicle(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveNewVehicle = async () => {
        try {
            const response = await registerVehicleByExaminer(newVehicle);
            setSnackbarMessage('Vehicle added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseAddVehicleModal();
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setSnackbarMessage('Failed to add vehicle. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleOpenPopup = (vehicleId, appointmentId) => {
        setSelectedVehicleId(vehicleId);
        setSelectedAppointmentId(appointmentId);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleOpenManualEv = () => {
        setIsManualEvOpen(true);
    };

    const handleCloseManualEv = () => {
        setIsManualEvOpen(false);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
            <html>
                <head>
                    <title>Inspection Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h1, h2, h3, h4, h5, h6 { font-weight: bold; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Inspection Report</h1>
                    <h2>Inspection ID: ${selectedInspection._id}</h2>
                    <p><strong>Final Score:</strong> ${selectedInspection.finalScore}</p>
                    <p><strong>Outcome:</strong> ${selectedInspection.outcome === 1 ? "Passed" : "Failed"}</p>
                    <p><strong>Inspection Date:</strong> ${new Date(selectedInspection.inspectionDate).toLocaleDateString()}</p>
                    <p><strong>Next Inspection Date:</strong> ${new Date(selectedInspection.nextInspectionDate).toLocaleDateString()}</p>
                    <h3>WOF Inspected Level out of 10:</h3>
                    <p>${selectedInspection.finalScore} / 10</p>
                    <h3>Detailed Ratings:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Rating Type</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(selectedInspection.ratings).map(([key, value]) => `
                                <tr>
                                    <td>${key}</td>
                                    <td>${value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
            printWindow.document.close(); // Close the document to render it
            printWindow.print(); // Trigger the print dialog
        }
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
                {/* Left Side: Inspection Console and History Table */}
                <Grid item xs={12} md={8}>
                    <Box padding="20px">
                        <Typography variant="h4" component="h1" gutterBottom>
                            Inspection Console
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Here you can view and manage all approved slots. Use the search bar below to filter the
                            appointments.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            Inspection History Table
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Search inspection history..."
                            variant="outlined"
                            sx={{marginBottom: '20px'}}
                        />
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{backgroundColor: 'black'}}>
                                        <TableCell style={{color: 'white'}}>Inspection ID</TableCell>
                                        <TableCell style={{color: 'white'}}>Inspection Date</TableCell>
                                        <TableCell style={{color: 'white'}}>Final Score</TableCell>
                                        <TableCell style={{color: 'white'}}>Status</TableCell>
                                        <TableCell style={{color: 'white'}}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentSlots.map((slot) => (
                                        <TableRow key={slot._id}>
                                            <TableCell>{slot._id || "N/A"}</TableCell>
                                            <TableCell>
                                                {new Date(slot.inspectionDate).toLocaleDateString()} {/* Correctly format the date */}
                                            </TableCell>

                                            <TableCell>{slot.finalScore || "N/A"}</TableCell>
                                            <TableCell>{slot.outcome === 1 ? "Passed" : "Failed"}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={(event) => handleActionClick(event, slot._id)}>
                                                    <MoreVertIcon/>
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && selectedSlotId === slot._id}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={() => handleViewClick(slot)}>View</MenuItem>
                                                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                    </Box>
                </Grid>

                {/* Right Side: Buttons and Scheduled Inspections */}
                <Grid item xs={12} md={4}>
                    <Box padding="20px">
                        <Button variant="contained" fullWidth sx={{marginBottom: 1}} onClick={handleOpenManualEv}>
                            + Manual TEST
                        </Button>
                        <ManualEvaluation
                            open={isManualEvOpen}
                            handleClose={handleCloseManualEv}
                        />
                        <Button variant="outlined" color="primary" fullWidth onClick={handleOpenAddVehicleModal}>
                            Add Vehicle
                        </Button>

                        <Typography sx={{marginTop: 5}} variant="h6" gutterBottom>Scheduled Inspections</Typography>
                        <Typography variant="body2" sx={{marginBottom: 2}}>
                            Listing based on time: nearest schedules at the top.
                        </Typography>
                        <List>
                            {scheduledInspections.map((inspection) => (
                                <ListItem key={inspection._id}>
                                    <ListItemText
                                        primary={inspection.registrationNumber}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    Date: {new Date(inspection.date).toLocaleDateString()}
                                                </Typography>
                                                <br/>
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    Time: {new Date(`1970-01-01T${inspection.time}:00`).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <Button variant="contained" onClick={() => {
                                        console.log("Shared vehicleId:", inspection.vehicleId, "Shared _id:", inspection._id);
                                        handleOpenPopup(inspection.vehicleId, inspection._id);
                                    }}>
                                        Start Inspection
                                    </Button>
                                    <ScheduledEvaluation
                                        open={isPopupOpen}
                                        handleClose={handleClosePopup} // Pass the function to close the popup
                                        vehicleId={selectedVehicleId}
                                        _id={selectedAppointmentId}
                                    />
                                </ListItem>
                            ))}
                        </List>


                    </Box>
                </Grid>
            </Grid>
            {/* Dialog for Add vehicle */}
            <Dialog open={openAddVehicleModal} onClose={handleCloseAddVehicleModal}>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="registrationNumber"
                        label="Registration Number"
                        type="text"
                        fullWidth
                        value={newVehicle.registrationNumber}
                        onChange={handleVehicleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="make"
                        label="Make"
                        type="text"
                        fullWidth
                        value={newVehicle.make}
                        onChange={handleVehicleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="model"
                        label="Model"
                        type="text"
                        fullWidth
                        value={newVehicle.model}
                        onChange={handleVehicleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="vinNumber"
                        label="VIN Number"
                        type="text"
                        fullWidth
                        value={newVehicle.vinNumber}
                        onChange={handleVehicleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="mfd"
                        label="Manufacturing Date"
                        type="date"
                        fullWidth
                        value={newVehicle.mfd}
                        onChange={handleVehicleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="reg"
                        label="Registration Date"
                        type="date"
                        fullWidth
                        value={newVehicle.reg}
                        onChange={handleVehicleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="mileage"
                        label="Mileage"
                        type="number"
                        fullWidth
                        value={newVehicle.mileage}
                        onChange={handleVehicleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddVehicleModal} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveNewVehicle} variant="contained">
                        Add Vehicle
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Inspection Details */}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                PaperProps={{
                    style: {maxHeight: '75vh', overflowY: 'auto'} // Set max height to 75% of viewport height
                }}
            >
                <DialogTitle>Inspection Details</DialogTitle>
                <DialogContent>
                    {selectedInspection && (
                        <Box>
                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                Inspection ID: {selectedInspection._id}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Final Score:</strong> {selectedInspection.finalScore}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Outcome:</strong> {selectedInspection.outcome === 1 ? "Passed" : "Failed"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Inspection
                                    Date:</strong> {new Date(selectedInspection.inspectionDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Next Inspection
                                    Date:</strong> {new Date(selectedInspection.nextInspectionDate).toLocaleDateString()}
                            </Typography>
                            <Divider sx={{marginY: 2}}/>
                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                WOF Inspected Level out of 10:
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center', marginY: 1}}>
                                <Box sx={{flexGrow: 1, mr: 1}}>
                                    <LinearProgress variant="determinate" value={selectedInspection.finalScore}/>
                                </Box>
                                <Typography variant="body1">{`${selectedInspection.finalScore} / 10`}</Typography>
                            </Box>
                            <Divider sx={{marginY: 1}}/>
                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                Detailed Ratings:
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Rating Type</strong></TableCell>
                                        <TableCell><strong>Score</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(selectedInspection.ratings).map(([key, value]) => (
                                        <TableRow key={key}>
                                            <TableCell>{key}</TableCell>
                                            <TableCell>{value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePrint} variant="contained">
                        Print
                    </Button>
                    <Button onClick={handleDialogClose} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}