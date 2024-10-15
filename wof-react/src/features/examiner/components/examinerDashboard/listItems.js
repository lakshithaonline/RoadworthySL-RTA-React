import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/Groups';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskIcon from '@mui/icons-material/Task';
import ReportIcon from "@mui/icons-material/Report";

export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="/dashboard/examiner">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Examiner Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/examiner/vehicle-test">
            <ListItemIcon>
                <BuildCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicle Tests" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/examiner/vehicle-management">
            <ListItemIcon>
                <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicle Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/examiner/appointment-manager">
            <ListItemIcon>
                <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments Management" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/examiner/appointments">
            <ListItemIcon>
                <TaskIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/examiner/customers">
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/examiner/reports">
            <ListItemIcon>
                <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Reports" />
        </ListItemButton>
    </React.Fragment>
);
//
// export const secondaryListItems = (
//     <React.Fragment>
//         <ListSubheader component="div" inset>
//             Saved reports
//         </ListSubheader>
//         <ListItemButton component={Link} to="/dashboard/examiner/report/current-month">
//             <ListItemIcon>
//                 <AssignmentIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Current month"/>
//         </ListItemButton>
//         <ListItemButton component={Link} to="/dashboard/examiner/report/last-quarter">
//             <ListItemIcon>
//                 <AssignmentIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Last quarter"/>
//         </ListItemButton>
//         <ListItemButton component={Link} to="/dashboard/examiner/report/year-end-summary">
//             <ListItemIcon>
//                 <AssignmentIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Year-end summary"/>
//         </ListItemButton>
//     </React.Fragment>
// );
