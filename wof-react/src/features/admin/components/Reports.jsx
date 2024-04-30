import React from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register the chart pages
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Sample data for the line chart
const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            label: 'Monthly Sales',
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }
    ]
};

// Function to create data for the table
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

// Sample data for the table
const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function Reports() {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Reports {/* Main title of the page */}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Sales Performance {/* Subsection title */}
            </Typography>
            <Box mb={3}>
                <Line data={lineData} /> {/* Line chart displaying sales data */}
            </Box>
            <Typography variant="h6" gutterBottom>
                Product Details {/* Subsection title for table */}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name} {/* Display the product name */}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Reports;
