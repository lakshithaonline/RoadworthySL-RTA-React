import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Autocomplete,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Divider,
    Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import { getWOFSByToken } from '../../../../../services/wofService';
import { getVehicles } from '../../../../../services/AppointmentService';

export default function WOFInspectionHistory() {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [allInspections, setAllInspections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            try {
                const vehiclesData = await getVehicles();
                setVehicles(vehiclesData);
            } catch (err) {
                setError('Unable to load vehicles. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    useEffect(() => {
        const fetchAllInspections = async () => {
            setLoading(true);
            try {
                const inspectionsData = await getWOFSByToken();
                setAllInspections(inspectionsData);
            } catch (err) {
                setError('Unable to fetch WOF records. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllInspections();
    }, []);

    const handleVehicleChange = useCallback((event, value) => {
        setSelectedVehicle(value);
        setError(null);
    }, []);

    const filteredInspections = useMemo(() => {
        if (!selectedVehicle) return [];
        return allInspections.filter(
            inspection => inspection.vehicle.registrationNumber === selectedVehicle.registrationNumber
        );
    }, [selectedVehicle, allInspections]);

    const userToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    // Function to handle downloading the report
    const handleDownloadReport = async (inspectionId) => {
        try {
            const token = userToken(); // Retrieve the token using the provided function

            if (!token) {
                console.error('No authentication token found.');
                return;
            }

            const response = await fetch(`http://localhost:5000/user/inspection/${inspectionId}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Inspection_Report_${inspectionId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Failed to download report:', response.statusText);
            }
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Inspection History</Typography>
            <Card sx={{ marginBottom: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Select Your Vehicle
                    </Typography>
                    <Autocomplete
                        options={vehicles}
                        getOptionLabel={(vehicle) =>
                            `${vehicle.registrationNumber} - ${vehicle.make || ''} ${vehicle.model || ''}`
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Select Vehicle" variant="outlined" />
                        )}
                        onChange={handleVehicleChange}
                        fullWidth
                        disabled={loading}
                    />
                </CardContent>
            </Card>

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px' }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && selectedVehicle && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
                        Vehicle Details
                    </Typography>
                    <Paper sx={{ padding: 2, marginBottom: 4, boxShadow: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"><strong>Registration Number:</strong> {selectedVehicle.registrationNumber}</Typography>
                                <Typography variant="body1"><strong>Make:</strong> {selectedVehicle.make}</Typography>
                                <Typography variant="body1"><strong>Model:</strong> {selectedVehicle.model}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"><strong>VIN Number:</strong> {selectedVehicle.vinNumber}</Typography>
                                <Typography variant="body1"><strong>Mileage:</strong> {selectedVehicle.mileage} km</Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>
                    )}

                    {!error && filteredInspections.length === 0 && (
                        <Typography variant="body1" align="center" color="textSecondary">
                            No WOF inspections found for this vehicle.
                        </Typography>
                    )}

                    {filteredInspections.length > 0 && (
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Inspection Reports
                        </Typography>
                    )}

                    {filteredInspections.map((inspection, index) => (
                        <Accordion key={index} sx={{ marginBottom: 2, boxShadow: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">
                                    Inspection Date: {new Date(inspection.inspectionDate).toLocaleDateString()}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Divider sx={{ marginBottom: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2">
                                            <strong>Examiner:</strong> {inspection.examiner ? inspection.examiner.firstname : 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Email:</strong> {inspection.examiner ? inspection.examiner.email : 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2"><strong>Final Score:</strong> {inspection.finalScore}</Typography>
                                        <Typography variant="body2"><strong>Outcome:</strong> {inspection.outcome === 1 ? 'Pass' : 'Fail'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2"><strong>High Critical Concerns:</strong></Typography>
                                        {inspection.highCriticalConcerns && inspection.highCriticalConcerns.length > 0 ? (
                                            <ul>
                                                {inspection.highCriticalConcerns.map((concern, idx) => (
                                                    <li key={idx}>{concern.parameter} (Score: {concern.score}, Severity: {concern.severity})</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">No critical concerns</Typography>
                                        )}
                                    </Grid>
                                </Grid>
                                {/* Download Button */}
                                <Box mt={2} textAlign="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DownloadIcon />}
                                        onClick={() => handleDownloadReport(inspection._id)}
                                    >
                                        Download Detailed Report
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </>
            )}
        </Container>
    );
}
