import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Grid,
    Divider,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    CircularProgress,
    Alert,
    Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { getUserByToken, updateUser } from '../../../../../services/userService';

export default function CustomerProfile() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        profilePicture: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const customerData = await getUserByToken();
                setCustomer(customerData);
                setEditData(customerData);
            } catch (err) {
                setError('Unable to load data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleOpenEditDialog = () => {
        setEditData({ ...customer });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setEditData({ firstName: '', lastName: '', email: '', phone: '', address: '', profilePicture: '' }); // Reset editData
        setOpenEditDialog(false);
    };

    const handleSaveChanges = async () => {
        try {
            await updateUser(editData);
            setCustomer(editData);
            handleCloseEditDialog();
        } catch (err) {
            setError('Unable to update customer data. Please try again.');
            console.error(err);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditData({ ...editData, [name]: value });
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="md" sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Customer Profile</Typography>

            <Card sx={{ borderRadius: 2, overflow: 'visible' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        {/* Profile Picture Section */}
                        <Grid item xs={12} md={3} textAlign="center">
                            <Avatar
                                alt="Customer Profile Picture"
                                src={customer.profilePicture || "https://via.placeholder.com/150"}
                                sx={{ width: 120, height: 120, margin: '0 auto' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {`${customer.firstName} ${customer.lastName}`}
                            </Typography>
                            <Divider sx={{ marginY: 2 }} />
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                <strong>Email:</strong> {customer.email}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                <strong>Phone:</strong> {customer.phone}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                <strong>Address:</strong> {customer.address}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={1} textAlign="right">
                            <IconButton color="primary" onClick={handleOpenEditDialog} aria-label="edit profile">
                                <EditIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Edit Customer Details Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
                <DialogTitle>Edit Customer Details</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="First Name"
                        variant="outlined"
                        name="firstName"
                        value={editData.firstName || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        variant="outlined"
                        name="lastName"
                        value={editData.lastName || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={editData.email || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        variant="outlined"
                        name="phone"
                        value={editData.phone || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        variant="outlined"
                        name="address"
                        value={editData.address || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Profile Picture URL"
                        variant="outlined"
                        name="profilePicture"
                        value={editData.profilePicture || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<CancelIcon />} onClick={handleCloseEditDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveChanges}
                        variant="contained"
                        color="primary"
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
