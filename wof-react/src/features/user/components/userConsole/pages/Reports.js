import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Paper, Divider, Alert, TextField, MenuItem } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getWOFSByToken } from "../../../../../services/wofService";
import { format } from 'date-fns';
import { createIssueReport } from "../../../../../services/issueReportService";

export default function Reports() {
    const [selectedInspection, setSelectedInspection] = useState(null);
    const [issueDescription, setIssueDescription] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactSuccess, setContactSuccess] = useState(false);
    const [allInspections, setAllInspections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const formatInspectionDate = (dateString) => {
        return format(new Date(dateString), 'dd/MM/yyyy'); // Formats the date as "DD/MM/YYYY"
    };

    const handleInspectionChange = (event) => {
        const selectedId = event.target.value;
        const inspection = allInspections.find((ins) => ins._id === selectedId);
        if (inspection) {
            setSelectedInspection(inspection); // Update with the selected inspection object
        } else {
            setSelectedInspection(null); // Clear selection if no match
        }
    };

    const handleGenerateReport = () => {
        if (selectedInspection) {
            alert(`Generating report for WOF Inspection: ${selectedInspection.vehicle.make} ${selectedInspection.vehicle.model} (${formatInspectionDate(selectedInspection.inspectionDate)})`);
        }
    };

    const handleSubmitIssue = async () => {
        if (!selectedInspection || !issueDescription.trim()) {
            setError('Please select an inspection and provide a description.');
            return;
        }

        setError(null); // Clear any previous errors

        try {
            const issueReportData = {
                inspectionId: selectedInspection._id,
                vehicle: selectedInspection.vehicle._id,
                examiner: selectedInspection.examiner._id,
                description: issueDescription
            };

            await createIssueReport(issueReportData);
            setShowSuccessMessage(true);
            setIssueDescription('');
            setSelectedInspection(null); // Clear selection after submission
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            setError('Failed to submit the issue. Please try again.');
            console.error(err);
        }
    };

    const handleContactSubmit = () => {
        if (contactName && contactEmail && contactMessage) {
            setContactSuccess(true);
            setContactName('');
            setContactEmail('');
            setContactMessage('');
            setTimeout(() => setContactSuccess(false), 3000);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ paddingY: 4 }}>
            <Typography variant="h4" gutterBottom>
                Reports & Issue Management
            </Typography>

            <Grid container spacing={3}>
                {/* Left Section: Report Console, Report Content, and Issue Reporting */}
                <Grid item xs={12} md={8}>
                    {/* Report Console */}
                    <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Report Console
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Select WOF Inspection"
                                    fullWidth
                                    value={selectedInspection ? selectedInspection._id : ''}
                                    onChange={handleInspectionChange}
                                    variant="outlined"
                                    disabled={loading || !allInspections.length}
                                    error={!!error}
                                    helperText={error || ""}
                                >
                                    {allInspections.length > 0 ? (
                                        allInspections.map((inspection) => (
                                            <MenuItem key={inspection._id} value={inspection._id}>
                                                {`${formatInspectionDate(inspection.inspectionDate)} - ${inspection.vehicle.make} ${inspection.vehicle.model}`}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No Inspections Available</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ height: '100%' }}
                                    onClick={handleGenerateReport}
                                    disabled={!selectedInspection || loading}
                                >
                                    Add Report
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* User Issue Reporting Section */}
                    <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Report an Issue
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />

                        {showSuccessMessage && (
                            <Alert severity="success" sx={{ marginBottom: 2 }}>
                                Your issue has been submitted successfully! Our team will review it shortly.
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ marginBottom: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <ReactQuill
                            value={issueDescription}
                            onChange={setIssueDescription}
                            placeholder="Provide a detailed description of the problem you're experiencing."
                        />
                        <Button
                            variant="contained"
                            sx={{ marginTop: 2 }}
                            onClick={handleSubmitIssue}
                            disabled={!issueDescription.trim() || !selectedInspection}
                        >
                            Submit Issue
                        </Button>
                    </Paper>
                </Grid>

                {/* Right Section: Guidance and Contact Us */}
                <Grid item xs={12} md={4}>
                    {/* Contact Us Section */}
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />

                        {contactSuccess && (
                            <Alert severity="success" sx={{ marginBottom: 2 }}>
                                Your message has been sent successfully! We'll get back to you shortly.
                            </Alert>
                        )}

                        <TextField
                            label="Your Name"
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                        <TextField
                            label="Your Email"
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />
                        <TextField
                            label="Your Message"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleContactSubmit}
                            disabled={!contactName || !contactEmail || !contactMessage}
                        >
                            Send Message
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
