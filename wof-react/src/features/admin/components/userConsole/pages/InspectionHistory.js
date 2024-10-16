import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Container,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableBody,
    Grid,
    Divider
} from '@mui/material';
import { getAllWOFsADB } from '../../../../../services/wofService';
import { getAllExaminers } from '../../../../../services/examinerService';

export default function WOFInspectionHistory() {
    const [wofs, setWOFs] = useState([]);
    const [examiners, setExaminers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWOF, setSelectedWOF] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        const fetchWOFs = async () => {
            try {
                const response = await getAllWOFsADB();
                setWOFs(response);
            } catch (error) {
                console.error("Error fetching WOFs:", error);
            }
        };

        const fetchExaminers = async () => {
            try {
                const response = await getAllExaminers();
                setExaminers(response);
            } catch (error) {
                console.error("Error fetching examiners:", error);
            }
        };

        fetchWOFs();
        fetchExaminers();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredWOFs = wofs.filter(wof =>
        wof.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wof.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wof.vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredWOFs.length / rowsPerPage);
    const currentWOFs = filteredWOFs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleViewMore = (wof) => {
        setSelectedWOF(wof);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedWOF(null);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const getExaminerNameById = (examinerId) => {
        const examiner = examiners.find(ex => ex._id === examinerId);
        return examiner ? `${examiner.firstname} ${examiner.lastname}` : 'Unknown';
    };

    return (
        <Container maxWidth="md" sx={{ padding: 4 }}>
            {/* Page Heading */}
            <Typography variant="h4" gutterBottom>
                Inspection History
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

            {/* WOFs Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white' }}>Vehicle</TableCell>
                            <TableCell style={{ color: 'white' }}>Registration Number</TableCell>
                            <TableCell style={{ color: 'white' }}>Inspection Date</TableCell>
                            <TableCell style={{ color: 'white' }}>Next Inspection Date</TableCell>
                            <TableCell style={{ color: 'white' }}>Outcome</TableCell>
                            <TableCell style={{ color: 'white' }}>Examiner Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentWOFs.length > 0 ? (
                            currentWOFs.map((wof) => (
                                <TableRow key={wof._id}>
                                    <TableCell>{`${wof.vehicle.make} ${wof.vehicle.model}`}</TableCell>
                                    <TableCell>{wof.vehicle.registrationNumber}</TableCell>
                                    <TableCell>{new Date(wof.inspectionDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(wof.nextInspectionDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{wof.outcome === 1 ? 'Passed' : 'Failed'}</TableCell>
                                    <TableCell>{getExaminerNameById(wof.examiner)}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleViewMore(wof)}>
                                            View More
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No WOF records found
                                </TableCell>
                            </TableRow>
                        )}
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

            {/* View More Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>WOF Details</DialogTitle>
                <DialogContent>
                    {selectedWOF && (
                        <div>
                            {/* Vehicle Information */}
                            <Typography variant="h6" gutterBottom>
                                Vehicle Information:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>Make:</Typography>
                                    <Typography>{selectedWOF.vehicle.make}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Model:</Typography>
                                    <Typography>{selectedWOF.vehicle.model}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Registration Number:</Typography>
                                    <Typography>{selectedWOF.vehicle.registrationNumber}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>VIN:</Typography>
                                    <Typography>{selectedWOF.vehicle.vinNumber}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>MFD:</Typography>
                                    <Typography>{new Date(selectedWOF.vehicle.mfd).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Mileage:</Typography>
                                    <Typography>{selectedWOF.vehicle.mileage} km</Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ marginY: 2 }} />

                            {/* Owner Information */}
                            <Typography variant="h6" gutterBottom>
                                Owner Information:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>Username:</Typography>
                                    <Typography>{selectedWOF.owner.username}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Email:</Typography>
                                    <Typography>{selectedWOF.owner.email}</Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ marginY: 2 }} />

                            {/* Inspection Details */}
                            <Typography variant="h6" gutterBottom>
                                Inspection Details:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>Final Score:</Typography>
                                    <Typography>{selectedWOF.finalScore}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Outcome:</Typography>
                                    <Typography>{selectedWOF.outcome === 0 ? 'Passed' : 'Failed'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Inspection Date:</Typography>
                                    <Typography>{new Date(selectedWOF.inspectionDate).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Next Inspection Date:</Typography>
                                    <Typography>{new Date(selectedWOF.nextInspectionDate).toLocaleDateString()}</Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ marginY: 2 }} />

                            {/* High Critical Concerns */}
                            <Typography variant="h6" gutterBottom>
                                High Critical Concerns:
                            </Typography>
                            {selectedWOF.highCriticalConcerns.length > 0 ? (
                                selectedWOF.highCriticalConcerns.map((concern) => (
                                    <Typography key={concern._id}>
                                        {concern.parameter}: Score {concern.score} (Severity: {concern.severity})
                                    </Typography>
                                ))
                            ) : (
                                <Typography>No critical concerns</Typography>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
