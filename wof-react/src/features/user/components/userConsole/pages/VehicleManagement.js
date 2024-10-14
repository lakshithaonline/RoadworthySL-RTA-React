import React, { useEffect, useState } from 'react';
import {
    Alert, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import { Add, Delete, Edit } from '@mui/icons-material';
import { deleteVehicle, registerVehicle, updateVehicle, viewVehicle } from '../../../../../services/vehicleService';

export default function VehicleManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [addForm, setAddForm] = useState({
        registrationNumber: '',
        make: '',
        model: '',
        vinNumber: '',
        mfd: '',
        reg: '',
        mileage: ''
    });
    const [editForm, setEditForm] = useState({
        registrationNumber: '',
        make: '',
        model: '',
        vinNumber: '',
        mfd: '',
        reg: '',
        mileage: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await viewVehicle();
            if (data && Array.isArray(data.vehicles)) {
                const formattedVehicles = data.vehicles.map(vehicle => ({
                    registrationNumber: vehicle.registrationNumber || 'N/A',
                    make: vehicle.make || 'Unknown Make',
                    model: vehicle.model || 'Unknown Model',
                    vinNumber: vehicle.vinNumber || 'N/A',
                    mfd: vehicle.mfd ? vehicle.mfd.split('T')[0] : 'N/A',
                    reg: vehicle.reg ? vehicle.reg.split('T')[0] : 'N/A',
                    mileage: vehicle.mileage || '0'
                }));
                setVehicles(formattedVehicles);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleAddChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerVehicle(addForm);
            setSnackbar({ open: true, message: 'Vehicle added successfully', severity: 'success' });
            await fetchVehicles();
            setAddForm({ registrationNumber: '', make: '', model: '', vinNumber: '', mfd: '', reg: '', mileage: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setSnackbar({ open: true, message: 'Error submitting form', severity: 'error' });
        }
    };

    const handleEditOpen = (vehicle) => {
        setEditForm({
            ...vehicle,
            mfd: vehicle.mfd ? vehicle.mfd.split('T')[0] : '',
            reg: vehicle.reg ? vehicle.reg.split('T')[0] : ''
        });
        setIsEditing(true);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setIsEditing(false);
        setEditOpen(false);
        setEditForm({ registrationNumber: '', make: '', model: '', vinNumber: '', mfd: '', reg: '', mileage: '' });
    };

    const handleUpdate = async () => {
        try {
            await updateVehicle(editForm.registrationNumber, editForm);
            setSnackbar({ open: true, message: 'Vehicle updated successfully', severity: 'success' });
            await fetchVehicles();
            handleEditClose();
        } catch (error) {
            console.error('Error updating vehicle:', error);
            setSnackbar({ open: true, message: 'Error updating vehicle', severity: 'error' });
        }
    };

    const handleDeleteOpen = (registrationNumber) => {
        setVehicleToDelete(registrationNumber);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setVehicleToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (vehicleToDelete) {
            try {
                await deleteVehicle(vehicleToDelete);
                await fetchVehicles();
                setSnackbar({ open: true, message: 'Vehicle deleted successfully', severity: 'success' });
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                setSnackbar({ open: true, message: 'Error deleting vehicle', severity: 'error' });
            } finally {
                handleDeleteClose();
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Grid item xs={12} md={8}>
            <Box padding="20px">
            <Typography variant="h4" component="h1" gutterBottom>
                Vehicle Management
            </Typography>

            {/* Add Vehicle Form */}
            <form onSubmit={handleAddSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="registrationNumber"
                            label="Registration Number"
                            value={addForm.registrationNumber}
                            onChange={handleAddChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="make"
                            label="Make"
                            value={addForm.make}
                            onChange={handleAddChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="model"
                            label="Model"
                            value={addForm.model}
                            onChange={handleAddChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="vinNumber"
                            label="VIN Number"
                            value={addForm.vinNumber}
                            onChange={handleAddChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="mfd"
                            label="Manufactured Date"
                            type="date"
                            value={addForm.mfd}
                            onChange={handleAddChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="reg"
                            label="Registration Date"
                            type="date"
                            value={addForm.reg}
                            onChange={handleAddChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="mileage"
                            label="Mileage"
                            value={addForm.mileage}
                            onChange={handleAddChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" startIcon={<Add />}>
                            Add Vehicle
                        </Button>
                    </Grid>
                </Grid>
            </form>
            </Box>

            {/* Vehicle List */}
            <List>
                {vehicles.map((vehicle) => (
                    <ListItem key={vehicle.registrationNumber}>
                        <ListItemText
                            primary={`${vehicle.make} ${vehicle.model}`}
                            secondary={`Reg: ${vehicle.registrationNumber}, VIN: ${vehicle.vinNumber}, Mfd: ${vehicle.mfd}, Mileage: ${vehicle.mileage}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditOpen(vehicle)}>
                                <Edit />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteOpen(vehicle.registrationNumber)}>
                                <Delete />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            {/* Edit Vehicle Popup */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Vehicle</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="make"
                                label="Make"
                                value={editForm.make}
                                onChange={handleEditChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="model"
                                label="Model"
                                value={editForm.model}
                                onChange={handleEditChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="vinNumber"
                                label="VIN Number"
                                value={editForm.vinNumber}
                                onChange={handleEditChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="mfd"
                                label="Manufactured Date"
                                type="date"
                                value={editForm.mfd}
                                onChange={handleEditChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="reg"
                                label="Registration Date"
                                type="date"
                                value={editForm.reg}
                                onChange={handleEditChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="mileage"
                                label="Mileage"
                                value={editForm.mileage}
                                onChange={handleEditChange}
                                fullWidth
                                disabled={editForm.mileage}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} variant="outlined">Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained">Update Vehicle</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the vehicle with registration number: <strong>{vehicleToDelete}</strong>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} variant="outlined">Cancel</Button>
                    <Button onClick={handleDeleteConfirm}  variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            </Grid>
        </Box>
    );
}
