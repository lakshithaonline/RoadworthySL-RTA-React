import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AssignmentIcon from '@mui/icons-material/Assignment';



export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="/dashboard/admin">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/admin/vehicle-management">
            <ListItemIcon>
                <FactCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicle Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/admin/inspection-management">
            <ListItemIcon>
                <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Inspection Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/admin/appointments-management">
            <ListItemIcon>
                <TaskAltIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/admin/customers-management">
            <ListItemIcon>
                <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Customers Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/admin/examiner-management">
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Examiner Management" />
        </ListItemButton>
    </React.Fragment>
);