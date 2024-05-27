import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, Divider, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {useNavigate} from "react-router-dom";

function AdminNavigation({ onChange, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        console.log('Token after removal:', localStorage.getItem('adminToken')); // Check if the token is removed
        navigate('/admin');
    };


    const drawerWidth = 240;

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem button onClick={() => onChange(0)}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="ExaminerDashboard" />
                    </ListItem>
                    <ListItem button onClick={() => onChange(1)}>
                        <ListItemIcon>
                            <ReportIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reports" />
                    </ListItem>
                    <ListItem button onClick={() => onChange(2)}>
                        <ListItemIcon>
                            <SupervisorAccountIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add Examiner" />
                    </ListItem>
                    <ListItem button onClick={() => onChange(3)}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
                <Divider />
                <Box sx={{ mt: 'auto', mb: 2 }}>
                    <Button
                        fullWidth
                        startIcon={<ExitToAppIcon />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Drawer>
            {/* Content area next to the drawer */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Another Toolbar for consistent spacing with the top AppBar */}
                {/* Here you can add your routing and content pages */}
            </Box>
        </Box>
    );
}

export default AdminNavigation;
