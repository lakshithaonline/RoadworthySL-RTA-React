import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
                <DashboardIcon/>
            </ListItemIcon>
            <ListItemText primary="Dashboard"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/vehicle-test">
            <ListItemIcon>
                <DirectionsCarIcon/>
            </ListItemIcon>
            <ListItemText primary="Vehicle Tests"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/vehicle-management">
            <ListItemIcon>
                <BuildIcon/>
            </ListItemIcon>
            <ListItemText primary="Vehicle Management"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/appointments">
            <ListItemIcon>
                <EventIcon/>
            </ListItemIcon>
            <ListItemText primary="Appointments"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/customers">
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Customers"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/reports">
            <ListItemIcon>
                <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Reports"/>
        </ListItemButton>
    </React.Fragment>
);


export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Saved reports
        </ListSubheader>
        <ListItemButton component={Link} to="/dashboard/report/current-month">
            <ListItemIcon>
                <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Current month"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/report/last-quarter">
            <ListItemIcon>
                <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Last quarter"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/report/year-end-summary">
            <ListItemIcon>
                <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Year-end summary"/>
        </ListItemButton>
    </React.Fragment>
);
