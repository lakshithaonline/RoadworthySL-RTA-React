import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Link as MUILink,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import {getWOFSByToken} from '../../../../../services/wofService';
import {getVehicles} from '../../../../../services/AppointmentService';
import {downloadInspectionReport} from "../../../../../services/reportService";

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

    // Function to handle downloading the report
    const handleDownloadReport = async (inspectionId) => {
        await downloadInspectionReport(inspectionId);
    };

    return (
        <Container maxWidth="md" sx={{padding: 4}}>
            <Typography variant="h4" gutterBottom>Inspection History</Typography>
            <Card sx={{marginBottom: 4}}>
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
                            <TextField {...params} label="Select Vehicle" variant="outlined"/>
                        )}
                        onChange={handleVehicleChange}
                        fullWidth
                        disabled={loading}
                    />
                </CardContent>
            </Card>

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{height: '200px'}}>
                    <CircularProgress/>
                </Box>
            )}

            {!loading && !selectedVehicle && (
                <Box sx={{textAlign: 'center', marginTop: 4}}>
                    <Typography variant="body1" color="textSecondary">
                        Please select a vehicle from the dropdown above to view its inspection history.
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        If you do not have any vehicles listed, please contact support.
                    </Typography>

                    {/* Widget Section */}
                    <Box sx={{marginTop: 4}}>
                        <Paper sx={{padding: 2}}>
                            <Typography variant="h6" gutterBottom>Helpful Tips</Typography>
                            <Typography variant="body2">
                                - Regularly check your vehicle’s maintenance schedule.
                            </Typography>
                            <Typography variant="body2">
                                - Ensure your WOF is up to date to avoid penalties.
                            </Typography>
                            <Typography variant="body2">
                                - Keep an eye on common issues such as tire wear and brake condition.
                            </Typography>
                        </Paper>

                        <Paper sx={{padding: 2, marginTop: 2}}>
                            <Typography variant="h6" gutterBottom>Frequently Asked Questions</Typography>
                            <Typography variant="body2">
                                <strong>Q:</strong> How often should I have my vehicle inspected?<br/>
                                <strong>A:</strong> It is recommended to inspect your vehicle annually.
                            </Typography>
                            <Typography variant="body2">
                                <strong>Q:</strong> What happens if my vehicle fails the inspection?<br/>
                                <strong>A:</strong> You will need to address the issues and have a re-inspection done.
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            )}

            {!loading && selectedVehicle && (
                <>
                    <Typography variant="h6" gutterBottom sx={{marginTop: 2, fontWeight: 'bold'}}>
                        Vehicle Details
                    </Typography>
                    <Paper sx={{padding: 2, marginBottom: 4, boxShadow: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"><strong>Registration
                                    Number:</strong> {selectedVehicle.registrationNumber}</Typography>
                                <Typography variant="body1"><strong>Make:</strong> {selectedVehicle.make}</Typography>
                                <Typography variant="body1"><strong>Model:</strong> {selectedVehicle.model}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"><strong>VIN Number:</strong> {selectedVehicle.vinNumber}
                                </Typography>
                                <Typography
                                    variant="body1"><strong>Mileage:</strong> {selectedVehicle.mileage} km</Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {error && (
                        <Alert severity="error" sx={{marginBottom: 2}}>{error}</Alert>
                    )}

                    {!error && filteredInspections.length === 0 && (
                        <Typography variant="body1" align="center" color="textSecondary">
                            No WOF inspections found for this vehicle.
                        </Typography>
                    )}

                    {filteredInspections.length > 0 && (
                        <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>
                            Inspection Reports
                        </Typography>
                    )}

                    {filteredInspections.map((inspection, index) => (
                        <Accordion key={index} sx={{marginBottom: 2, boxShadow: 2}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="subtitle1">
                                    Inspection Date: {new Date(inspection.inspectionDate).toLocaleDateString()}
                                    <Chip
                                        label={inspection.outcome === 1 ? 'Pass' : 'Fail'}
                                        color={inspection.outcome === 1 ? 'success' : 'error'}
                                        size="small"
                                        sx={{marginLeft: 2}}
                                    />
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Divider sx={{marginBottom: 2}}/>
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
                                        <Typography variant="body2"><strong>Final
                                            Score:</strong> {inspection.finalScore}</Typography>
                                        <Typography
                                            variant="body2"><strong>Outcome:</strong> {inspection.outcome === 1 ? 'Pass' : 'Fail'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2"><strong>High Critical
                                            Concerns:</strong></Typography>
                                        {inspection.highCriticalConcerns && inspection.highCriticalConcerns.length > 0 ? (
                                            <ul>
                                                {inspection.highCriticalConcerns.map((concern, idx) => (
                                                    <li key={idx}>{concern.parameter} (Score: {concern.score},
                                                        Severity: {concern.severity})</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">No critical
                                                concerns</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2">
                                            <strong>Next Inspection Date: </strong>
                                            {inspection.nextInspectionDate ?
                                                new Date(inspection.nextInspectionDate).toLocaleDateString()
                                                : ' N/A - '}
                                            {!inspection.nextInspectionDate && (
                                                <MUILink href="/dashboard/reports" underline="hover" color="primary">
                                                    contact support
                                                </MUILink>
                                            )}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {/* Download Button */}
                                <Box mt={2} textAlign="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DownloadIcon/>}
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
