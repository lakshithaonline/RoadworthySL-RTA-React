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
    DialogTitle,
    Grid,
    Paper,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import {
    getAllVehiclesWithOwners,
    getExaminerDetails,
    registerVehicleByExaminer,
    submitRatings
} from "../../../../../services/examinerService";
import {Autocomplete} from "@mui/lab";
import {createWOF} from "../../../../../services/wofService";

export default function VehicleTests() {
    const [selectedVehicle, setSelectedVehicle] = useState(null);
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
    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [submitted, setSubmitted] = useState(false);
    const [examinerDetails, setExaminerDetails] = useState(null);
    const [newVehicle, setNewVehicle] = useState({
        registrationNumber: '',
        make: '',
        model: '',
        vinNumber: '',
        mfd: '',
        reg: '',
        mileage: ''
    });
    const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);


    //TODO: add select inspection period: for 3month, 6 month 12 months: this will decide the inspection report validation and cost for WOF
    useEffect(() => {
        const storedRatings = JSON.parse(localStorage.getItem('vehicleRatings'));
        if (storedRatings) {
            setRatings(storedRatings);
        }

        const fetchVehicles = async () => {
            try {
                const vehiclesData = await getAllVehiclesWithOwners();
                setVehicles(vehiclesData);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        const fetchExaminerDetails = async () => {
            try {
                const details = await getExaminerDetails();
                setExaminerDetails(details);
            } catch (error) {
                console.error('Error fetching examiner details:', error);
            }
        };

        fetchVehicles();
        fetchExaminerDetails();
    }, []);

    const handleVehicleChange = (event, value) => {
        setSelectedVehicle(value);
    };

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

            const updatedVehicles = await getAllVehiclesWithOwners();
            setVehicles(updatedVehicles);
            handleCloseAddVehicleModal();
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setSnackbarMessage('Failed to add vehicle.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    return (
        <Container maxWidth="lg" sx={{padding: 2}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Vehicle Testing
            </Typography>
            <Grid container spacing={2} sx={{marginTop: 2}}>
                {/* Left Side: Vehicle Selection */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{padding: 2, display: 'flex', flexDirection: 'column'}}>
                        <Typography variant="h6" gutterBottom component="h2"
                                    sx={{marginBottom: 1, color: '#333', fontWeight: 'bold'}}>
                            Vehicle Selection
                        </Typography>
                        <Autocomplete
                            id="vehicle-select"
                            options={vehicles}
                            getOptionLabel={(vehicle) => vehicle.registrationNumber}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Vehicle"
                                    variant="outlined"
                                />
                            )}
                            onChange={handleVehicleChange}
                            fullWidth
                        />
                    </Paper>
                    <Paper sx={{marginTop: 2, padding: 2, display: 'flex', flexDirection: 'column', borderRadius: 1}}>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                marginBottom: 1,
                                color: '#333',
                                fontWeight: 'bold',
                                borderBottom: '2px solid #ddd',
                                paddingBottom: 1,
                            }}
                        >
                            Vehicle Data
                        </Typography>
                        {selectedVehicle ? (
                            <Box>
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
                        ) : (
                            <Typography variant="body1" sx={{color: '#777'}}>
                                Please select a vehicle before start the inspection.
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{marginTop: 2}}
                            onClick={handleOpenAddVehicleModal}
                        >
                            Add New Vehicle
                        </Button>
                    </Paper>
                    {/* Add Vehicle Modal */}
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
                            <Button onClick={handleCloseAddVehicleModal} color="primary" variant="outlined">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveNewVehicle} color="primary" variant="contained">
                                Add Vehicle
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>

                {/* Middle Section: Testing Environment */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{padding: 2}}>
                        <Typography variant="h6" gutterBottom>
                            Testing Environment
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                maxHeight: 'calc(80vh)',
                                justifyContent: 'space-between',
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
                                        flex: '1 1 auto',
                                        maxWidth: 'calc(100% / 3 - 16px)'
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
                    </Paper>
                </Grid>

                {/* Right Side: Results */}
                <Grid item xs={12} md={3} sx={{display: 'flex', flexDirection: 'column'}}>
                    <Paper sx={{padding: 2, flexGrow: 1}}>
                        <Typography variant="h6" gutterBottom>
                            Results
                        </Typography>
                        {loading ? (
                            <Box sx={{
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    overflowY: 'auto',
                                    maxHeight: 'calc(80vh)',
                                }}
                            >
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
                                                <Box
                                                    key={concern.parameter}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        p: 2,
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#f9f9f9'
                                                    }}
                                                >
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
                    </Paper>
                </Grid>
            </Grid>
            {/* Snackbar Component */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
