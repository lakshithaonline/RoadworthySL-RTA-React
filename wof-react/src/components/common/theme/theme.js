// src/theme.js
import { createTheme } from '@mui/material/styles';

// Include the Google Font link in your public/index.html or import via CSS
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#fbc02d', // dark yellow
        },
        background: {
            default: '#121212', // very dark background
            paper: '#333333', // lighter dark for surfaces like cards
        },
        text: {
            primary: '#ffffff',
            secondary: '#eeeeee'
        }
    },
    typography: {
        fontFamily: '"Inter", sans-serif', // Using Inter as the primary font
        fontSize: 16, // Slightly larger base font size for better readability
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700, // Bold for headlines
        },
        h2: {
            fontSize: '2.0rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 400,
        },
        h6: {
            fontSize: '1.0rem',
            fontWeight: 400,
        },
        body1: {
            fontSize: '0.9rem',
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.8rem',
            fontWeight: 400,
        },
        button: {
            fontWeight: 500, // Medium weight for button text to stand out
            textTransform: 'none' // No text transformation to maintain the natural style
        }
    },
});

export default theme;
