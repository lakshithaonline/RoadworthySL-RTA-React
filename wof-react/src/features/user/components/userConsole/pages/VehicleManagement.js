import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import {deleteVehicle, registerVehicle, updateVehicle, viewVehicle} from '../../../../../services/vehicleService';

export default function VehicleManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        registrationNumber: '',
        make: '',
        model: '',
        vinNumber: '',
        mfd: '',
        reg: '',
        mileage: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await viewVehicle();
            if (data && Array.isArray(data.vehicles)) {
                const formattedVehicles = data.vehicles.map(vehicle => ({
                    ...vehicle,
                    mfd: vehicle.mfd ? vehicle.mfd.split('T')[0] : '',
                    reg: vehicle.reg ? vehicle.reg.split('T')[0] : ''
                }));
                setVehicles(formattedVehicles);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateVehicle(form.registrationNumber, form);
                setSnackbar({open: true, message: 'Vehicle updated successfully', severity: 'success'});
            } else {
                await registerVehicle(form);
                setSnackbar({open: true, message: 'Vehicle added successfully', severity: 'success'});
            }
            await fetchVehicles();
            setForm({registrationNumber: '', make: '', model: '', vinNumber: '', mfd: '', reg: '', mileage: ''});
            setIsEditing(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSnackbar({open: true, message: 'Error submitting form', severity: 'error'});
        }
    };

    const handleEdit = (vehicle) => {
        setForm({
            ...vehicle,
            mfd: vehicle.mfd ? vehicle.mfd.split('T')[0] : '',
            reg: vehicle.reg ? vehicle.reg.split('T')[0] : ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (registrationNumber) => {
        try {
            await deleteVehicle(registrationNumber);
            await fetchVehicles();
            setSnackbar({open: true, message: 'Vehicle deleted successfully', severity: 'success'});
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            setSnackbar({open: true, message: 'Error deleting vehicle', severity: 'error'});
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Vehicle Management</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="registrationNumber"
                            label="Registration Number"
                            value={form.registrationNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isEditing}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="make"
                            label="Make"
                            value={form.make}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="model"
                            label="Model"
                            value={form.model}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="vinNumber"
                            label="VIN Number"
                            value={form.vinNumber}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="mfd"
                            label="Manufactured Date"
                            type="date"
                            value={form.mfd}
                            onChange={handleChange}
                            InputLabelProps={{shrink: true}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="reg"
                            label="Registration Date"
                            type="date"
                            value={form.reg}
                            onChange={handleChange}
                            InputLabelProps={{shrink: true}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="mileage"
                            label="Mileage"
                            value={form.mileage}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary"
                                startIcon={isEditing ? <Edit/> : <Add/>}>
                            {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <List>
                {vehicles.map((vehicle) => (
                    <ListItem key={vehicle.registrationNumber}>
                        <ListItemText
                            primary={`${vehicle.make} ${vehicle.model}`}
                            secondary={`Reg: ${vehicle.registrationNumber}, VIN: ${vehicle.vinNumber}, Mfd: ${vehicle.mfd}, Mileage: ${vehicle.mileage}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(vehicle)}>
                                <Edit/>
                            </IconButton>
                            <IconButton edge="end" aria-label="delete"
                                        onClick={() => handleDelete(vehicle.registrationNumber)}>
                                <Delete/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}
                       sx={{width: '100%', bgcolor: 'black', color: 'white'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
