import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Divider,
    FormControl,
    InputLabel,
    Select,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert, Box,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports() {
    const [reportType, setReportType] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openContactDialog, setOpenContactDialog] = useState(false);

    // Simulate fetching report data based on report type
    useEffect(() => {
        if (reportType) {
            setLoading(true);
            setTimeout(() => {
                setReportData(mockReportData(reportType)); // Replace with API call
                setLoading(false);
            }, 1000);
        }
    }, [reportType]);

    const mockReportData = (type) => {
        // Generate mock data based on report type
        switch (type) {
            case 'sales':
                return [
                    { name: 'Jan', sales: 400 },
                    { name: 'Feb', sales: 300 },
                    { name: 'Mar', sales: 500 },
                    // Additional data
                ];
            case 'inventory':
                return [
                    { name: 'Product A', stock: 200 },
                    { name: 'Product B', stock: 150 },
                    // Additional data
                ];
            // Add more cases for other report types
            default:
                return [];
        }
    };

    const handleGenerateReport = () => {
        // Logic to handle report generation
        alert(`Generating ${reportType} report...`);
    };

    const handleExportReport = (format) => {
        // Logic to handle report export in various formats
        alert(`Exporting report as ${format}`);
    };

    const handleOpenContactDialog = () => {
        setOpenContactDialog(true);
    };

    const handleCloseContactDialog = () => {
        setOpenContactDialog(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Report Console</Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Report Type</InputLabel>
                    <Select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        label="Select Report Type"
                    >
                        <MenuItem value="sales">Sales Report</MenuItem>
                        <MenuItem value="inventory">Inventory Report</MenuItem>
                        {/* Add more report types */}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={handleGenerateReport}
                    disabled={!reportType}
                    sx={{ mb: 2 }}
                >
                    Generate Report
                </Button>

                <Divider sx={{ mb: 2 }} />

                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}

                {reportData && (
                    <>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={reportData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>

                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleExportReport('PDF')}
                                sx={{ mr: 2 }}
                            >
                                Export as PDF
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleExportReport('CSV')}
                                sx={{ mr: 2 }}
                            >
                                Export as CSV
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={() => handleExportReport('Print')}
                            >
                                Print Report
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>

            {/* Contact Us Section */}
            <Typography variant="h5" gutterBottom>Contact Us</Typography>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Button variant="outlined" onClick={handleOpenContactDialog}>
                    Reach Out for More Information
                </Button>
            </Paper>

            <Dialog open={openContactDialog} onClose={handleCloseContactDialog}>
                <DialogTitle>Contact Us</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        If you have any questions or need further assistance with reports, feel free to contact us.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Your Message"
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseContactDialog} color="secondary">Cancel</Button>
                    <Button variant="contained" color="primary">Send Message</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
