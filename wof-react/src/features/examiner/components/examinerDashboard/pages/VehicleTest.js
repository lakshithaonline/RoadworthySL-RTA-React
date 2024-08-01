import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Paper,
    Container
} from '@mui/material';

export default function VehicleTests() {
    const [selectedVehicle, setSelectedVehicle] = useState('');
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

    const handleVehicleChange = (event) => {
        setSelectedVehicle(event.target.value);
    };

    const handleRatingChange = (param) => (event, newValue) => {
        setRatings({ ...ratings, [param]: newValue });
    };

    const parameters = [
        'tyres', 'brakes', 'suspension', 'bodyAndChassis', 'lights', 'glazing',
        'wipers', 'doors', 'seatBelts', 'airbags', 'speedometer', 'exhaustSystem', 'fuelSystem'
    ];

    return (
        <Container maxWidth="lg" sx={{ padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Vehicle Testing
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {/* Left Side: Vehicle Selection */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '20%' }}>
                        <Typography variant="h6" gutterBottom>
                            Vehicle Selection
                        </Typography>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="vehicle-select-label">Select Vehicle</InputLabel>
                            <Select
                                labelId="vehicle-select-label"
                                id="vehicle-select"
                                value={selectedVehicle}
                                onChange={handleVehicleChange}
                                label="Select Vehicle"
                            >
                                <MenuItem value="vehicle1">Vehicle 1</MenuItem>
                                <MenuItem value="vehicle2">Vehicle 2</MenuItem>
                                <MenuItem value="vehicle3">Vehicle 3</MenuItem>
                                <MenuItem value="vehicle4">Vehicle 4</MenuItem>
                                <MenuItem value="vehicle5">Vehicle 5</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>
                    <Paper sx={{ padding: 2, marginTop: 2, display: 'flex', flexDirection: 'column', height: '20%' }}>
                        <Typography variant="h6" gutterBottom>
                            Optional
                        </Typography>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="optional-select-label">Optional</InputLabel>
                            <Select
                                labelId="optional-select-label"
                                id="optional-select"
                                value={selectedVehicle}
                                onChange={handleVehicleChange}
                                label="Optional"
                            >
                                <MenuItem value="vehicle1">Vehicle 1</MenuItem>
                                <MenuItem value="vehicle2">Vehicle 2</MenuItem>
                                <MenuItem value="vehicle3">Vehicle 3</MenuItem>
                                <MenuItem value="vehicle4">Vehicle 4</MenuItem>
                                <MenuItem value="vehicle5">Vehicle 5</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>
                </Grid>

                {/* Middle Section: Testing Environment */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper sx={{ padding: 2, flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Testing Environment
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 120px)', // Adjust height based on overall view
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
                                        backgroundColor: '#f9f9f9'
                                    }}
                                >
                                    <Typography variant="subtitle1" gutterBottom>
                                        {param.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                    </Typography>
                                    <Slider
                                        value={ratings[param]}
                                        onChange={handleRatingChange(param)}
                                        aria-labelledby={`${param}-slider`}
                                        min={1}
                                        max={10}
                                        step={1}
                                        valueLabelDisplay="auto"
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Side: Results */}
                <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper sx={{ padding: 2, flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Results
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 120px)', // Adjust height based on overall view
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
                                        backgroundColor: '#f9f9f9'
                                    }}
                                >
                                    <Typography variant="subtitle1" gutterBottom>
                                        {param.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Rating: {ratings[param]}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
