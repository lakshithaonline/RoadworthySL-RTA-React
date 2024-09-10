import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const dailyScheduleData = [
    { time: '9:00 AM', inspection: 'Inspection 1' },
    { time: '10:00 AM', inspection: 'Inspection 2' },
    { time: '11:00 AM', inspection: 'Inspection 3' },
    { time: '1:00 PM', inspection: 'Inspection 4' },
];

const vehicleRegistrationData = [
    { id: 'ABC123', owner: 'John Doe', vehicle: 'Toyota Corolla 2021' },
    { id: 'DEF456', owner: 'Jane Smith', vehicle: 'Honda Civic 2022' },
];

const inspectionStatsData = [
    { name: 'Pass', value: 400 },
    { name: 'Fail', value: 300 },
    { name: 'Critical Concerns', value: 100 },
];

const performanceMetricsData = [
    { time: 'Jan', inspections: 30 },
    { time: 'Feb', inspections: 45 },
    { time: 'Mar', inspections: 40 },
];

const issueReportsData = [
    { id: '1', issue: 'Brake Issue', status: 'Pending' },
    { id: '2', issue: 'Engine Noise', status: 'Resolved' },
];

export default function ExaminerDashboard() {
    const [userName, setUserName] = useState('Lakshitha');

    useEffect(() => {
        setUserName('Lakshitha');
    }, []);

    return (
        <Container
            sx={{
                maxWidth: false,
                width: '100%',
                padding: '0 24px',
                mt: 4,
                mb: 4,
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                {`${getTimeOfDay()} ${userName}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Manage your vehicles efficiently with the options below.
            </Typography>
            <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ boxShadow: 4, borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Daily Schedule Overview</Typography>
                            <List>
                                {dailyScheduleData.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={item.inspection} secondary={item.time} />
                                    </ListItem>
                                ))}
                            </List>
                            <Button variant="contained" size="small" fullWidth>View All Appointments</Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Row 2: Vehicle Registration Summary and Predictive Insights */}
                <Grid item xs={12} lg={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                        <Card sx={{ boxShadow: 4, borderRadius: 3, flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Vehicle Registration Summary</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {vehicleRegistrationData.map((vehicle, index) => (
                                        <Box key={index}>
                                            <Typography variant="body1" color="text.primary">{vehicle.vehicle}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Registration: {vehicle.id} | Owner: {vehicle.owner}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Button variant="contained" size="small" fullWidth sx={{ mt: 2 }}>Register New Vehicle</Button>
                            </CardContent>
                        </Card>

                        <Card sx={{ boxShadow: 4, borderRadius: 3, flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Predictive Insights for Inspections</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Based on historical data, the following vehicles are at high risk of failing their next inspection:
                                </Typography>
                                <List>
                                    <ListItem>Vehicle ABC123 (High Risk)</ListItem>
                                    <ListItem>Vehicle DEF456 (Moderate Risk)</ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ boxShadow: 4, borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Inspection Statistics & Trends</Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={inspectionStatsData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {inspectionStatsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : index === 1 ? '#00C49F' : '#FF8042'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Row 4 */}
                <Grid item xs={12} lg={6}>
                    <Card sx={{ boxShadow: 4, borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Issue Reports Management</Typography>
                            <List>
                                {issueReportsData.map((report) => (
                                    <ListItem key={report.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body1">{report.issue}</Typography>
                                        <Typography variant="body2" color={report.status === 'Pending' ? 'error' : 'success.main'}>
                                            {report.status}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                            <Button variant="contained" size="small" fullWidth>View All Reports</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card sx={{ boxShadow: 4, borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Examiner Performance Metrics</Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart
                                    data={performanceMetricsData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="inspections" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
