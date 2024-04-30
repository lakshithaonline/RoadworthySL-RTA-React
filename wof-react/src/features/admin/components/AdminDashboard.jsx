import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Registering components needed for ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Data for the Doughnut chart
const dataDoughnut = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: ['#ff1744', '#2979ff', '#ffff00', '#00e676', '#651fff', '#ff9100'],
            borderColor: ['#d50000', '#2962ff', '#ffea00', '#00c853', '#6200ea', '#ff3d00'],
            borderWidth: 1,
        },
    ],
};

// Data for the Bar chart
const dataBar = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
        {
            label: 'Monthly Sales',
            data: [65, 59, 80, 81],
            backgroundColor: 'rgba(253, 216, 53, 0.75)',
            borderColor: 'rgba(253, 216, 53, 1)',
            borderWidth: 1,
        }
    ],
};

function AdminDashboard() {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total Users
                        </Typography>
                        <Typography component="p" variant="h4">
                            9,000
                        </Typography>
                        <Typography color="text.secondary">
                            as of 25th April, 2024
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 240 }}>
                        <Doughnut data={dataDoughnut} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Sales Over Time
                        </Typography>
                        <Bar data={dataBar} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AdminDashboard;
