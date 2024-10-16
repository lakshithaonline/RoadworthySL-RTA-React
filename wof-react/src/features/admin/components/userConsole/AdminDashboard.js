import * as React from 'react';
import {styled, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {mainListItems} from './listItems';
import WOFInspectionHistory from "./pages/InspectionHistory";
import DashboardContent from "./pages/DashboardContent";
import UpdatedTheme from "../userConsole/updatedTheme";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {ListItemIcon, ListItemText} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import AppointmentsManagement from "./pages/AppointmentsManagement";
import VehicleManagement from "./pages/VehicleManagement";
import CustomerManagement from "./pages/CustomerManagement";
import ExaminerManagement from "./pages/ExaminerManagement";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/lakshithaonline">
                GitHub
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const handleLogout = (navigate) => {
    localStorage.removeItem('adminToken');
    navigate('/');
};

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

export default function AdminDashboard() {
    const [open, setOpen] = React.useState(false);
    // const [anchorEl, setAnchorEl] = React.useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen(!open);
    };


    const getTitle = () => {
        switch (location.pathname) {
            case '/dashboard/examiner-management':
                return 'Examiner Management';
            case '/dashboard/customers-management':
                return 'Customers Management';
            case '/dashboard/appointments-management':
                return 'Appointments Management';
            case '/dashboard/inspection-management':
                return 'Inspection Management';
            case '/dashboard/vehicle-management':
                return 'Vehicle Management';
            default:
                return 'Admin Dashboard';
        }
    };

    return (
        <ThemeProvider theme={UpdatedTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            {getTitle()}
                        </Typography>

                        {/*<IconButton color="inherit" onClick={handleNotificationClick}>*/}
                        {/*    <Badge badgeContent={4} color="secondary">*/}
                        {/*        <NotificationsIcon />*/}
                        {/*    </Badge>*/}
                        {/*</IconButton>*/}
                        {/*<Menu*/}
                        {/*    anchorEl={anchorEl}*/}
                        {/*    open={Boolean(anchorEl)}*/}
                        {/*    onClose={handleNotificationClose}*/}
                        {/*>*/}
                        {/*    <MenuItem onClick={handleNotificationClose}>Notification 1</MenuItem>*/}
                        {/*    <MenuItem onClick={handleNotificationClose}>Notification 2</MenuItem>*/}
                        {/*    <MenuItem onClick={handleNotificationClose}>Notification 3</MenuItem>*/}
                        {/*    <MenuItem onClick={handleNotificationClose}>Notification 4</MenuItem>*/}
                        {/*</Menu>*/}
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <List component="nav">
                        {mainListItems}
                    </List>
                    <Box sx={{mt: 'auto', mb: 2}}>
                        <ListItemButton onClick={() => handleLogout(navigate)}>
                            <ListItemIcon>
                                <ExitToAppIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Logout"/>
                        </ListItemButton>
                    </Box>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Grid container spacing={3}>
                            <Routes>
                                <Route path="/" element={<DashboardContent/>}/>
                                <Route path="vehicle-management" element={<VehicleManagement/>}/>
                                <Route path="inspection-management" element={<WOFInspectionHistory/>}/>
                                <Route path="appointments-management" element={<AppointmentsManagement/>}/>
                                <Route path="customers-management" element={<CustomerManagement/>}/>
                                <Route path="examiner-management" element={<ExaminerManagement/>}/>
                            </Routes>
                        </Grid>
                        <Copyright sx={{pt: 4}}/>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
