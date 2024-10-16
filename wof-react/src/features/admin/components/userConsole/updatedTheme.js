import { createTheme } from '@mui/material/styles';

const UpdatedTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#FFFFFF',
        },
        background: {
            default: '#EAEAEA',
            paper: '#FFFFFF',
        },
    },
});

export default UpdatedTheme;
