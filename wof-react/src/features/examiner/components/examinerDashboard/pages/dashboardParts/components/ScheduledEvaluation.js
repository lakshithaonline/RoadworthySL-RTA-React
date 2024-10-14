import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import {
    getAllVehiclesWithOwners,
    getExaminerDetails,
    submitRatings
} from "../../../../../../../services/examinerService";
import {createWOF} from "../../../../../../../services/wofService";
import {completeAppointment} from "../../../../../../../services/AppointmentService";


export default function ScheduledEvaluation({open, handleClose, vehicleId, _id}) {
    const [ratings, setRatings] = useState({
        tyres: 5,
        brakes: 5,
        suspension: 5,
        bodyAndChassis: 5,
        lights: 5,
        glazing: 5,
        wipers: 5,
        doors: 5,
        seatBelts: 5,
        airbags: 5,
        speedometer: 5,
        exhaustSystem: 5,
        fuelSystem: 5,
    });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [submitted, setSubmitted] = useState(false);
    const [completeButtonEnabled, setCompleteButtonEnabled] = useState(false);
    const [examinerDetails, setExaminerDetails] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    useEffect(() => {
        const storedRatings = JSON.parse(localStorage.getItem('vehicleRatings'));
        if (storedRatings) {
            setRatings(storedRatings);
        }

        const fetchExaminerDetails = async () => {
            try {
                const details = await getExaminerDetails();
                setExaminerDetails(details);
            } catch (error) {
                console.error('Error fetching examiner details:', error);
            }
        };

        fetchExaminerDetails();
    }, []);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehiclesData = await getAllVehiclesWithOwners();
                const vehicle = vehiclesData.find(v => v._id === vehicleId);
                if (vehicle) {
                    setSelectedVehicle(vehicle);
                } else {
                    console.error('Vehicle not found');
                }
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchVehicles();
    }, [vehicleId]);


    const parameters = [
        'tyres', 'brakes', 'suspension', 'bodyAndChassis', 'lights', 'glazing',
        'wipers', 'doors', 'seatBelts', 'airbags', 'speedometer', 'exhaustSystem', 'fuelSystem'
    ];

    const handleRatingChange = (param, value) => {
        const numberValue = Number(value);
        if (numberValue >= 1 && numberValue <= 10) {
            const newRatings = {
                ...ratings,
                [param]: numberValue
            };
            setRatings(newRatings);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [param]: ''
            }));
            localStorage.setItem('vehicleRatings', JSON.stringify(newRatings));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [param]: 'Value must be between 1 and 10'
            }));
        }
    };

    const handleSubmit = async () => {
        if (!selectedVehicle) {
            setSnackbarMessage('Please select a vehicle before submitting.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        setLoading(true);
        try {
            // Pre-processing
            const formattedRatings = {
                "Tyres": ratings.tyres,
                "Brakes": ratings.brakes,
                "Suspension": ratings.suspension,
                "Body and Chassis": ratings.bodyAndChassis,
                "Lights": ratings.lights,
                "Glazing": ratings.glazing,
                "Wipers": ratings.wipers,
                "Doors": ratings.doors,
                "Seat Belts": ratings.seatBelts,
                "Airbags": ratings.airbags,
                "Speedometer": ratings.speedometer,
                "Exhaust System": ratings.exhaustSystem,
                "Fuel System": ratings.fuelSystem,
            };

            const data = await submitRatings(formattedRatings);

            // Post-processing
            setResults(data);
            setSubmitted(true);
            setSnackbarMessage('Ratings submitted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setCompleteButtonEnabled(true);
        } catch (error) {
            // Handle errors
            if (error.response) {
                console.error('Error response:', error.response.data);
                setSnackbarMessage(error.response.data.message || 'An error occurred');
                setSnackbarSeverity('error');
            } else if (error.request) {
                console.error('Error request:', error.request);
                setSnackbarMessage('No response received from server');
                setSnackbarSeverity('error');
            } else {
                console.error('Error message:', error.message);
                setSnackbarMessage('An unexpected error occurred');
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteJob = async (_id) => {
        try {
            if (!results) {
                setSnackbarMessage('Please complete the ratings submission first.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            if (!_id) {
                setSnackbarMessage('Appointment ID is required to complete the job.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            await completeAppointment(_id, { completed: true });

            setSnackbarMessage('Job completed successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('An error occurred while completing the job.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSave = async () => {
        if (!selectedVehicle) {
            setSnackbarMessage('Please select a vehicle before saving.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!submitted) {
            setSnackbarMessage('Please Complete the WOF test before reporting.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            const inspectionDate = new Date();
            const vehicleData = selectedVehicle ? selectedVehicle : {};
            const ownerId = vehicleData.owner?._id;
            const vehicleMFD = new Date(vehicleData.mfd);

            const vehicleAge = inspectionDate.getFullYear() - vehicleMFD.getFullYear();
            let nextInspectionDate = new Date(inspectionDate);

            if (vehicleAge < 6) {
                nextInspectionDate.setFullYear(inspectionDate.getFullYear() + 1);
            } else if (vehicleAge <= 10) {
                nextInspectionDate.setMonth(inspectionDate.getMonth() + 9);
            } else {
                nextInspectionDate.setMonth(inspectionDate.getMonth() + 6);
            }

            // Prepare data for WOF inspection
            const wofData = {
                vehicleId: vehicleData._id,
                ownerId: ownerId,
                ratings: {
                    "Tyres": ratings.tyres,
                    "Brakes": ratings.brakes,
                    "Suspension": ratings.suspension,
                    "Body and Chassis": ratings.bodyAndChassis,
                    "Lights": ratings.lights,
                    "Glazing": ratings.glazing,
                    "Wipers": ratings.wipers,
                    "Doors": ratings.doors,
                    "Seat Belts": ratings.seatBelts,
                    "Airbags": ratings.airbags,
                    "Speedometer": ratings.speedometer,
                    "Exhaust System": ratings.exhaustSystem,
                    "Fuel System": ratings.fuelSystem,
                },
                inspectionDate: inspectionDate.toISOString(),
                nextInspectionDate: nextInspectionDate.toISOString(),
                finalScore: results?.final_score,
                outcome: results.outcome,
                highCriticalConcerns: results?.high_critical_concern || [],
                examinerId: examinerDetails?._id,
            };

            const requiredFields = [
                'fuelSystem', 'exhaustSystem', 'speedometer', 'airbags',
                'seatBelts', 'doors', 'wipers', 'glazing', 'lights',
                'bodyAndChassis', 'suspension', 'brakes', 'tyres'
            ];
            requiredFields.forEach(field => {
                if (!wofData.ratings[field]) {
                    wofData.ratings[field] = 5;
                }
            });

            const data = await createWOF(wofData);

            setResults(data);
            setSnackbarMessage('WOF inspection saved successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setSnackbarMessage(error.response.data.message || 'An error occurred');
                setSnackbarSeverity('error');
            } else if (error.request) {
                console.error('Error request:', error.request);
                setSnackbarMessage('No response received from server');
                setSnackbarSeverity('error');
            } else {
                console.error('Error message:', error.message);
                setSnackbarMessage('An unexpected error occurred');
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };


    const handleReset = () => {
        const defaultRatings = {
            tyres: 5,
            brakes: 5,
            suspension: 5,
            bodyAndChassis: 5,
            lights: 5,
            glazing: 5,
            wipers: 5,
            doors: 5,
            seatBelts: 5,
            airbags: 5,
            speedometer: 5,
            exhaustSystem: 5,
            fuelSystem: 5,
        };
        setRatings(defaultRatings);
        localStorage.removeItem('vehicleRatings');
        setResults(null);
        setErrors({});
        setSubmitted(false);
    };

    const Reset = () => {
        setSelectedVehicle(null);
        handleClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogContent>
                <Container maxWidth="lg" sx={{padding: 2}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Scheduled Inspection Console
                    </Typography>
                    <Grid container spacing={2} sx={{marginTop: 2}}>
                        {/* Left Side: Vehicle Selection */}
                        <Grid item xs={12} md={3}>
                            {selectedVehicle ? (
                                <>
                                    <Typography variant="h6" gutterBottom component="h2" sx={{
                                        marginBottom: 1,
                                        color: '#333',
                                        borderBottom: '1px solid black',
                                        paddingBottom: 1
                                    }}>
                                        Vehicle Data
                                    </Typography>

                                    <Box sx={{marginTop: '20px'}}>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>Registration Number:</strong> {selectedVehicle.registrationNumber}
                                        </Typography>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>Owner:</strong> {selectedVehicle.owner?.username}
                                        </Typography>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>Make:</strong> {selectedVehicle.make}
                                        </Typography>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>Model:</strong> {selectedVehicle.model}
                                        </Typography>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>VIN Number:</strong> {selectedVehicle.vin}
                                        </Typography>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>Manufacturing
                                                Date:</strong> {new Date(selectedVehicle.mfd).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>Registration
                                                Date:</strong> {new Date(selectedVehicle.reg).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body1" sx={{marginBottom: 1}}>
                                            <strong>Mileage:</strong> {selectedVehicle.mileage} km
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body1" sx={{color: '#777'}}>
                                    Please select a vehicle before starting the inspection.
                                </Typography>
                            )}
                        </Grid>

                        {/* Middle Section: Testing Environment */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom
                                        sx={{borderBottom: '1px solid black', paddingBottom: 1}}>
                                Testing Environment
                            </Typography>
                            <Box
                                sx={{
                                    marginTop: '20px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                    justifyContent: 'space-between',
                                    maxHeight: '530px',
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        display: 'none',
                                    },
                                    '&': {
                                        scrollbarWidth: 'none',
                                    },
                                }}
                            >
                                {parameters.map((param) => (
                                    <Box
                                        key={param}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            p: 2,
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9',
                                            flex: '1 1 calc(33% - 16px)',
                                        }}
                                    >
                                        <Typography variant="subtitle1" gutterBottom>
                                            {param.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + param.replace(/([A-Z])/g, ' $1').slice(1).toLowerCase()}
                                        </Typography>
                                        <TextField
                                            type="number"
                                            value={ratings[param]}
                                            onChange={(e) => handleRatingChange(param, e.target.value)}
                                            inputProps={{min: 1, max: 10, step: 1}}
                                            error={!!errors[param]}
                                            helperText={errors[param]}
                                            fullWidth
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        {/* Right Side: Results */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom
                                        sx={{borderBottom: '1px solid black', paddingBottom: 1}}>
                                Results
                            </Typography>
                            {loading ? (
                                <Box sx={{
                                    marginTop: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%'
                                }}>
                                    <CircularProgress/>
                                    <Typography variant="subtitle1" sx={{marginTop: 2}}>
                                        Calculating Results...
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                    {results && (
                                        <>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Final Score: {results.final_score}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Outcome: {results.outcome === 1 ? 'Pass' : 'Fail'}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                High Critical Concerns:
                                            </Typography>
                                            {results.high_critical_concern && results.high_critical_concern.length > 0 ? (
                                                results.high_critical_concern.map((concern) => (
                                                    <Box key={concern.parameter} sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        p: 2,
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#f9f9f9'
                                                    }}>
                                                        <Typography variant="body2">
                                                            Parameter: {concern.parameter}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Score: {concern.score}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Severity: {concern.severity}
                                                        </Typography>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body2">
                                                    No critical concerns
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                    <Box sx={{display: 'flex', gap: 2, marginTop: 2}}>
                                        <Button variant="outlined" onClick={handleReset}>
                                            Reset
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                                            TEST
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleSave}>
                                            Submit
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    {/* Snackbar Component */}
                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => handleCompleteJob(_id)}
                    color="success"
                    variant="contained"
                    disabled={!completeButtonEnabled} // Button enabled only after results submission
                >
                    Complete Job
                </Button>
                <Button onClick={Reset} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>

    );
}
