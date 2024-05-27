import { createTheme } from '@mui/material/styles';

const DashboardTheme = createTheme({
    palette: {
        mode: 'light', // You can change this to 'dark' if you prefer a dark mode
        primary: {
            main: '#000000', // Black color
        },
        secondary: {
            main: '#FFFFFF', // White color
        },
        background: {
            default: '#EAEAEA', // Light gray color
            paper: '#FFFFFF', // White color
        },
    },
});

export default DashboardTheme;
