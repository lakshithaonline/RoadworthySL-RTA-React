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
    ListItemText, CircularProgress, Alert, Divider,
} from '@mui/material';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    getAllBookedSlots, getAllVehiclesWithOwners,
    getExaminerDetails
} from "../../../../../services/examinerService";
import {useNavigate} from "react-router-dom";
import {getAllWOFs, getWOFsByLoggedInExaminer} from "../../../../../services/wofService";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {getExaminerAppointments} from "../../../../../services/AppointmentService";

const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const issueReportsData = [
    { id: '1', issue: 'Brake Issue', status: 'Pending' },
    { id: '2', issue: 'Engine Noise', status: 'Resolved' },
];

export default function ExaminerDashboard() {
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [bookedSlots, setBookedSlots] = useState([]);
    const [recentVehicles, setRecentVehicles] = useState([]);
    const [inspectionStatsData, setInspectionStatsData] = useState([]);
    const [wofExaminer, setWofExaminer] = useState([]);
    const [inspectionPerformanceData, setInspectionPerformanceData] = useState([]); // State to store dynamic performance data

    useEffect(() => {
        const fetchInspectionsByExaminer = async () => {
            setLoading(true);
            try {
                const response = await getWOFsByLoggedInExaminer();
                const inspectionsData = response.wofs;

                setWofExaminer(inspectionsData);

                const now = new Date();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                const days = Array(7).fill(0);
                const dayLabels = [];
                const isTodayArray = [];

                for (let i = 0; i < 7; i++) {
                    const currentDay = new Date(startOfWeek);
                    currentDay.setDate(startOfWeek.getDate() + i);

                    const formattedDate = `${currentDay.getMonth() + 1}/${currentDay.getDate()}`;
                    dayLabels.push(formattedDate);

                    isTodayArray.push(currentDay.toDateString() === now.toDateString());
                }

                inspectionsData.forEach((inspection) => {
                    const inspectionDate = new Date(inspection.inspectionDate);

                    if (inspectionDate >= startOfWeek && inspectionDate <= now) {
                        const dayIndex = inspectionDate.getDay();
                        days[dayIndex] += 1;
                    }
                });

                setInspectionPerformanceData(days.map((count, index) => ({
                    day: dayLabels[index],
                    inspections: count,
                    isToday: isTodayArray[index],
                })));
            } catch (err) {
                setError('Unable to fetch WOF records. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInspectionsByExaminer();
    }, []);



    useEffect(() => {
        const fetchWOFReports = async () => {
            try {
                const allWOFsData = await getAllWOFs();
                const allWOFs = allWOFsData.wofs;

                const now = new Date();
                const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
                const recentWOFs = allWOFs.filter(wof => new Date(wof.inspectionDate) >= ninetyDaysAgo);

                let passCount = 0;
                let failCount = 0;
                let passWithMediumConcernsCount = 0;

                recentWOFs.forEach(wof => {
                    if (wof.outcome === 1) {
                        // Pass
                        const hasMediumConcerns = wof.highCriticalConcerns.some(concern => concern.severity === "Medium");
                        if (hasMediumConcerns) {
                            passWithMediumConcernsCount++;
                        } else {
                            passCount++;
                        }
                    } else if (wof.outcome === 0) {
                        // Failed
                        failCount++;
                    }
                });

                setInspectionStatsData([
                    { name: 'Pass', value: passCount },
                    { name: 'Failed', value: failCount },
                    { name: 'Pass with Medium Concerns', value: passWithMediumConcernsCount }
                ]);
            } catch (error) {
                console.error('Error fetching WOF reports:', error);
            }
        };

        fetchWOFReports();
    }, []);

    useEffect(() => {
        const fetchRecentVehicles = async () => {
            try {
                const vehiclesData = await getAllVehiclesWithOwners();
                const now = new Date();
                const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));

                // Filter vehicles registered within the last 30 days
                const recentVehiclesList = vehiclesData.filter(vehicle => {
                    const registrationDate = new Date(vehicle.createdAt);
                    return registrationDate >= threeDaysAgo;
                });

                setRecentVehicles(recentVehiclesList);
            } catch (error) {
                console.error('Error fetching recent vehicles:', error);
            }
        };

        fetchRecentVehicles();
    }, []);


    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                const slotsData = await getExaminerAppointments();
                setBookedSlots(slotsData);

            } catch (error) {
                console.error('Error fetching booked slots or users:', error);
            }
        };

        fetchBookedSlots();
    }, []);

    const now = new Date();
    const nowDateString = now.toDateString();

    const upcomingSlots = Array.isArray(bookedSlots)
        ? bookedSlots.filter(slot => {
            const slotDate = new Date(slot.date);
            const slotDateString = slotDate.toDateString();

            const timeDifference = slotDate.getTime() - now.getTime();
            const hoursDifference = timeDifference / (1000 * 60 * 60);

            const isWithin24Hours = hoursDifference <= 24 && hoursDifference >= 0;
            return slotDateString === nowDateString || isWithin24Hours;
        })
        : [];



    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const customerData = await getExaminerDetails();
                setUserName(customerData.firstname);
            } catch (err) {
                setError('Unable to load data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleViewAllAppointments = () => {
        navigate('/dashboard/examiner/appointments');
    };

    const handleRegisterNewVehicle = () => {
        navigate('/dashboard/examiner/vehicle-test');
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

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
                            <Typography variant="h6" gutterBottom>
                                Daily Schedule Overview
                            </Typography>

                            <List
                                sx={{
                                    maxHeight: upcomingSlots.length > 3 ? '300px' : 'none',
                                    overflowY: upcomingSlots.length > 3 ? 'auto' : 'hidden',
                                    paddingRight: '0.5rem',

                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
                                    '&::-webkit-scrollbar': {
                                        width: '0px',
                                    },
                                    '&:hover::-webkit-scrollbar': {
                                        width: '6px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                        borderRadius: '10px',
                                    },
                                }}
                            >
                                {upcomingSlots.length > 0 ? (
                                    upcomingSlots
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((item, index) => (
                                            <ListItem key={index} sx={{ padding: 0 }}>
                                                <Card
                                                    sx={{
                                                        backgroundColor: '#f5f5f5',
                                                        margin: '8px 0',
                                                        width: '100%',
                                                        boxShadow: 2,
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Typography variant="h6" component="div">
                                                            {item.registrationNumber}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {new Date(item.date).toLocaleDateString()} - {item.time}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </ListItem>
                                        ))
                                ) : (
                                    <ListItem>
                                        <ListItemText primary="No appointments for today." />
                                    </ListItem>
                                )}
                            </List>

                            <Button variant="contained" size="small" fullWidth onClick={handleViewAllAppointments}>
                                View All Appointments
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>


                {/* Row 2: Vehicle Registration Summary and Predictive Insights */}
                <Grid item xs={12} lg={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                        {/* Vehicle Registration Summary */}
                        <Card sx={{ boxShadow: 4, borderRadius: 3, flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Vehicle Registration Summary
                                </Typography>

                                {recentVehicles.length > 0 ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            maxHeight: recentVehicles.length > 6 ? '300px' : 'none',
                                            overflowY: recentVehicles.length > 6 ? 'auto' : 'hidden',
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
                                            '&::-webkit-scrollbar': {
                                                width: '0px',
                                            },
                                            '&:hover::-webkit-scrollbar': {
                                                width: '6px',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                                borderRadius: '10px',
                                            },
                                        }}
                                    >
                                        {recentVehicles
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map((vehicle, index) => (
                                                <Box key={index}>
                                                    <Typography variant="body1" color="text.primary">
                                                        {vehicle.make} {vehicle.model}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Registration: {vehicle.registrationNumber} | Owner ID: {vehicle.owner.username}
                                                    </Typography>
                                                </Box>
                                            ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No recent vehicle registrations.
                                    </Typography>
                                )}

                                <Button variant="contained" size="small" fullWidth sx={{ mt: 2 }} onClick={handleRegisterNewVehicle}>
                                    Register New Vehicle
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Predictive Insights for Inspections */}
                        {/*<Card sx={{ boxShadow: 4, borderRadius: 3, flex: 1 }}>*/}
                        {/*    <CardContent>*/}
                        {/*        <Typography variant="h6" gutterBottom>*/}
                        {/*            Predictive Insights for Inspections*/}
                        {/*        </Typography>*/}
                        {/*        <Typography variant="body1" color="text.secondary">*/}
                        {/*            Based on historical data, the following vehicles are at high risk of failing their next inspection:*/}
                        {/*        </Typography>*/}
                        {/*        <List>*/}
                        {/*            <ListItem>Vehicle ABC123 (High Risk)</ListItem>*/}
                        {/*            <ListItem>Vehicle DEF456 (Moderate Risk)</ListItem>*/}
                        {/*        </List>*/}
                        {/*    </CardContent>*/}
                        {/*</Card>*/}
                    </Box>
                </Grid>


                {/* Row 3 */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ boxShadow: 4, borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Inspection Statistics & Trends
                            </Typography>
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
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    index === 0 ? '#0088FE' : // Pass – Blue
                                                        index === 1 ? '#FF8042' : // Failed – Orange
                                                            '#00C49F' // Pass with Medium Concerns – Green
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box>
                                <Divider sx={{ mb: 2 }} /> {/* Top Divider */}

                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Inspection Statistics
                                </Typography>

                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <CheckCircleIcon sx={{ color: 'black', fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                                    Pass: {inspectionStatsData[0]?.value} <br />

                                    <CancelIcon sx={{ color: 'black', fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                                    Failed: {inspectionStatsData[1]?.value} <br />

                                    <WarningAmberIcon sx={{ color: 'black', fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                                    Pass with Medium Concerns: {inspectionStatsData[2]?.value}
                                </Typography>

                                <Divider sx={{ mt: 2 }} /> {/* Bottom Divider */}
                            </Box>

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
                                    data={inspectionPerformanceData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const { day, inspections, isToday } = payload[0].payload;
                                            return (
                                                <div className="custom-tooltip" style={{ padding: '10px', background: '#fff', border: '1px solid #ccc' }}>
                                                    <p>{day} {isToday ? "(Today)" : ""}</p>
                                                    <p>Inspections: {inspections}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
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
