import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import ReportIcon from "@mui/icons-material/Report";
import FactCheckIcon from '@mui/icons-material/FactCheck';



export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="User Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/vehicle-test">
            <ListItemIcon>
                <FactCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicle Tests" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/vehicle-management">
            <ListItemIcon>
                <BuildCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicle Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/appointments">
            <ListItemIcon>
                <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/appointments-management">
            <ListItemIcon>
                <TaskAltIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/customers">
            <ListItemIcon>
                <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/reports">
            <ListItemIcon>
                <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Reports" />
        </ListItemButton>
    </React.Fragment>
);