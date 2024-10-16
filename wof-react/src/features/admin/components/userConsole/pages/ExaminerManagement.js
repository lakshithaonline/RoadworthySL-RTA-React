import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Typography,
    TextField,
    Container,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Snackbar,
    Alert, Grid, Select, InputLabel, FormControl, Autocomplete
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import {CreateExaminer, getAllExaminers, deleteExaminer, editExaminer} from "../../../../../services/examinerService";

const sriLankanCities = ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna", "Anuradhapura", "Trincomalee", "Batticaloa", "Nuwara Eliya", "Matara"];

export default function ExaminerManagement() {
    const [examiners, setExaminers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedExaminer, setSelectedExaminer] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [examinerData, setExaminerData] = useState({
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        branch: '',
        dob: '',
        sex: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchExaminers = async () => {
            try {
                const response = await getAllExaminers();
                setExaminers(response);
            } catch (error) {
                console.error("Error fetching examiners:", error);
            }
        };

        fetchExaminers();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredExaminers = examiners.filter(examiner =>
        examiner.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        examiner.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        examiner.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        examiner.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredExaminers.length / rowsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const currentExaminers = filteredExaminers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Menu Handling
    const handleMenuClick = (event, examiner) => {
        setAnchorEl(event.currentTarget);
        setSelectedExaminer(examiner);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditOpen = () => {
        setExaminerData(selectedExaminer); // Set data to be edited
        setIsEditDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteOpen = () => {
        setIsDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleEditClose = () => {
        setIsEditDialogOpen(false);
        setExaminerData({
            username: '',
            password: '',
            email: '',
            firstname: '',
            lastname: '',
            branch: '',
            dob: '',
            sex: ''
        });
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setExaminerData({
            username: '',
            password: '',
            email: '',
            firstname: '',
            lastname: '',
            branch: '',
            dob: '',
            sex: ''
        });
    };

    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExaminerData({
            ...examinerData,
            [name]: value
        });
    };

    const handleCreateExaminer = async () => {
        try {
            await CreateExaminer(examinerData);
            setSnackbarMessage('Examiner registered successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseDialog();
            const response = await getAllExaminers();
            setExaminers(response);
        } catch (error) {
            setSnackbarMessage('Error registering examiner. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error("Error registering examiner:", error);
        }
    };

    const handleEditExaminer = async () => {
        try {
            await editExaminer(selectedExaminer._id, examinerData); // Assume you have the updateExaminer service method
            setSnackbarMessage('Examiner updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleEditClose();
            const response = await getAllExaminers();
            setExaminers(response);
        } catch (error) {
            setSnackbarMessage('Error updating examiner. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error("Error updating examiner:", error);
        }
    };

    const handleDeleteExaminer = async () => {
        try {
            await deleteExaminer(selectedExaminer._id); // Assume you have the deleteExaminer service method
            setSnackbarMessage('Examiner deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDeleteClose();
            const response = await getAllExaminers();
            setExaminers(response);
        } catch (error) {
            setSnackbarMessage('Error deleting examiner. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error("Error deleting examiner:", error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="md" sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Examiner Management
            </Typography>

            <TextField
                label="Search by First Name, Last Name, Username, or Email"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '20px' }}
                value={searchQuery}
                onChange={handleSearchChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleOpenDialog}>
                    + Add Examiner
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white' }}>First Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Last Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Username</TableCell>
                            <TableCell style={{ color: 'white' }}>Email</TableCell>
                            <TableCell style={{ color: 'white' }}>Branch</TableCell>
                            <TableCell style={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentExaminers.length > 0 ? (
                            currentExaminers.map((examiner) => (
                                <TableRow key={examiner._id}>
                                    <TableCell>{examiner.firstname}</TableCell>
                                    <TableCell>{examiner.lastname}</TableCell>
                                    <TableCell>{examiner.username}</TableCell>
                                    <TableCell>{examiner.email}</TableCell>
                                    <TableCell>{examiner.branch}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => handleMenuClick(event, examiner)}>
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No examiners found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
            </Menu>

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

            {/* Snackbar for feedback */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Add Examiner Dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Add Examiner</DialogTitle>
                <DialogContent>
                    <Divider sx={{mb: 2}}/>
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="username"
                                label="Username"
                                type="text"
                                fullWidth
                                value={examinerData.username}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="firstname"
                                label="First Name"
                                type="text"
                                fullWidth
                                value={examinerData.firstname}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="dob"
                                label="Date of Birth"
                                type="date"
                                fullWidth
                                value={examinerData.dob}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="sex-label">Sex</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    name="sex"
                                    value={examinerData.sex}
                                    onChange={handleInputChange}
                                    label="Sex"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Right Column */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                value={examinerData.email}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="lastname"
                                label="Last Name"
                                type="text"
                                fullWidth
                                value={examinerData.lastname}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={examinerData.password}
                                onChange={handleInputChange}
                            />
                            <Autocomplete
                                margin="dense"
                                options={sriLankanCities}
                                getOptionLabel={(option) => option}
                                onChange={(event, value) => handleInputChange({ target: { name: 'branch', value } })}
                                renderInput={(params) => (
                                    <TextField {...params} label="Branch" fullWidth variant="outlined" />
                                )}
                                fullWidth
                                style={{marginTop: '8px'}}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{mt: 2}}/>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateExaminer}>Create</Button>
                </DialogActions>
            </Dialog>


            {/* Edit Examiner Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Examiner</DialogTitle>
                <DialogContent>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="username"
                                label="Username"
                                type="text"
                                fullWidth
                                value={examinerData.username}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="firstname"
                                label="First Name"
                                type="text"
                                fullWidth
                                value={examinerData.firstname}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="dob"
                                label="Date of Birth"
                                type="date"
                                fullWidth
                                value={examinerData.dob}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="sex-label">Sex</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    name="sex"
                                    value={examinerData.sex}
                                    onChange={handleInputChange}
                                    label="Sex"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Right Column */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                value={examinerData.email}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="lastname"
                                label="Last Name"
                                type="text"
                                fullWidth
                                value={examinerData.lastname}
                                onChange={handleInputChange}
                            />
                            <Autocomplete
                                margin="dense"
                                options={sriLankanCities} // Array of branch options
                                getOptionLabel={(option) => option}
                                onChange={(event, value) => handleInputChange({ target: { name: 'branch', value } })}
                                renderInput={(params) => (
                                    <TextField {...params} label="Branch" fullWidth variant="outlined" />
                                )}
                                value={examinerData.branch} // Pre-filled value
                                fullWidth
                                style={{ marginTop: '8px' }}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleEditClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditExaminer}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Examiner Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={handleDeleteClose}>
                <DialogTitle>Delete Examiner</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this examiner?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined"  onClick={handleDeleteClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleDeleteExaminer}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
