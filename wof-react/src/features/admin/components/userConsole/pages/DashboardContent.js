import React, {useEffect, useState} from 'react';
import {Box, Grid, Paper, Typography} from '@mui/material';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {getAllVehicles} from "../../../../../services/vehicleService";
import {getAllUsers} from "../../../../../services/userService";
import {getAllWOFsADB} from "../../../../../services/wofService";
import {getAllExaminers} from "../../../../../services/examinerService";
import {DirectionsCar, Gavel, People, SupervisorAccount} from '@mui/icons-material';
import dayjs from "dayjs";

export default function DashboardContent() {
    const [vehicleCount, setVehicleCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [wofsCount, setWofsCount] = useState(0);
    const [examinersCount, setExaminerCount] = useState(0);
    const [wofsData, setWofsData] = useState([]);
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [vehicleGrowthData, setVehicleGrowthData] = useState([]);

    useEffect(() => {
        const fetchUsersAndVehicles = async () => {
            try {
                const users = await getAllUsers();
                const vehicles = await getAllVehicles();

                // Prepare data for user growth and vehicle growth over the current month
                const currentMonth = dayjs().month();
                const weeksInMonth = Array.from({length: 4}, (_, i) => ({
                    week: `Week ${i + 1}`,
                    users: 0,
                    vehicles: 0
                }));

                users.forEach(user => {
                    const registrationDate = dayjs(user.createdAt);
                    if (registrationDate.month() === currentMonth) {
                        const weekIndex = Math.ceil(registrationDate.date() / 7) - 1;
                        weeksInMonth[weekIndex].users += 1;
                    }
                });

                vehicles.forEach(vehicle => {
                    const registrationDate = dayjs(vehicle.createdAt);
                    if (registrationDate.month() === currentMonth) {
                        const weekIndex = Math.ceil(registrationDate.date() / 7) - 1;
                        weeksInMonth[weekIndex].vehicles += 1;
                    }
                });

                setUserGrowthData(weeksInMonth);
                setVehicleGrowthData(weeksInMonth);
            } catch (error) {
                console.error("Error fetching users or vehicles:", error);
            }
        };

        fetchUsersAndVehicles();
    }, []);

    useEffect(() => {
        const fetchWofs = async () => {
            try {
                const wofs = await getAllWOFsADB();
                setWofsCount(wofs.length);

                const currentMonth = dayjs().month();
                const wofsThisMonth = wofs.filter(wof => dayjs(wof.inspectionDate).month() === currentMonth);

                const wofsByWeek = wofsThisMonth.reduce((acc, wof) => {
                    const weekOfMonth = Math.ceil(dayjs(wof.inspectionDate).date() / 7);

                    const passed = wof.outcome === 1;

                    if (!acc[weekOfMonth]) {
                        acc[weekOfMonth] = {name: `Week ${weekOfMonth}`, passed: 0, failed: 0};
                    }

                    if (passed) {
                        acc[weekOfMonth].passed += 1;
                    } else {
                        acc[weekOfMonth].failed += 1;
                    }

                    return acc;
                }, {});

                setWofsData(Object.values(wofsByWeek));

            } catch (error) {
                console.error("Error fetching WOFs:", error);
            }
        };
        fetchWofs();
    }, []);


    useEffect(() => {
        const fetchExaminers = async () => {
            try {
                const examiners = await getAllExaminers();
                setExaminerCount(examiners.length);
            } catch (error) {
                console.error("Error fetching examiners:", error);
            }
        };
        fetchExaminers();
    }, []);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getAllUsers();
                setUserCount(users.length);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehicles = await getAllVehicles();
                setVehicleCount(vehicles.length);
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
            }
        };

        fetchVehicles();
    }, []);

    const statistics = [
        {label: 'Total Users', count: userCount, icon: <People fontSize="large"/>},
        {label: 'Total Vehicles', count: vehicleCount, icon: <DirectionsCar fontSize="large"/>},
        {label: 'Total Examiners', count: examinersCount, icon: <SupervisorAccount fontSize="large"/>},
        {label: 'Total WOFs', count: wofsCount, icon: <Gavel fontSize="large"/>},
    ];

    return (
        <Box sx={{width: '100%', height: '100vh', padding: 3, marginTop: 5}}>
            {/* Top Stats Section */}
            <Grid container spacing={3} justifyContent="center" sx={{marginBottom: 3}}>
                {statistics.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper sx={{
                            padding: 3,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            {stat.icon}
                            <Typography variant="h6" sx={{marginTop: 2}}>{stat.label}</Typography>
                            <Typography variant="h3">{stat.count}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Main Dashboard Section */}
            <Grid container spacing={3}>
                {/* Left Column (Bar Chart - Examiner performance) */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{height: '100%', padding: 3}}>
                        <Typography variant="h6" gutterBottom>Weekly User and Vehicle Growth</Typography>
                        <Typography style={{color: '#3f51b5'}} gutterBottom> Blue bars indicate new registrations.
                        </Typography>
                        <Typography style={{color: '#4caf50'}} gutterBottom> Green bars indicate passed inspections.
                        </Typography>

                        <Typography variant="caption">Weekly data for the current month</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="week"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="users" fill="#3f51b5" name="Users"/>
                                <Bar dataKey="vehicles" fill="#4caf50" name="Vehicles"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Right Column (Line Chart - Weekly WOFs) */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{height: '100%', padding: 3}}>
                        <Typography variant="h6" gutterBottom>Weekly WOFs Analysis</Typography>
                        <Typography color="error" gutterBottom>Failed WOFs</Typography>
                        <Typography color="success" gutterBottom>Passed WOFs</Typography>
                        <Typography variant="caption">Weekly data for the current month</Typography>

                        {/* Line Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={wofsData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="failed" stroke="#f44336"/>
                                <Line type="monotone" dataKey="passed" stroke="#4caf50"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
