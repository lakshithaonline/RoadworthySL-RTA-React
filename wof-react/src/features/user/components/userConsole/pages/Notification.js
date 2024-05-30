import React, {useEffect, useState} from 'react';
import {Badge, Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Popover} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import {getUserAppointments} from '../../../../../services/AppointmentService';

const Notification = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [lastClearedAt, setLastClearedAt] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchNotifications();
            } catch (error) {
                console.error('Error fetching notifications', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications([]);
            setLastClearedAt(new Date());
        }, 21600000); // 6 hours
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const appointments = await getUserAppointments();
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const upcomingAppointments = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.date);
                return appointmentDate >= today && appointmentDate <= tomorrow;
            });
            setNotifications(upcomingAppointments);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleRemoveNotification = (index) => {
        setNotifications(prevNotifications => {
            const updatedNotifications = [...prevNotifications];
            updatedNotifications.splice(index, 1);
            return updatedNotifications;
        });
        setLastClearedAt(new Date());
    };

    const handleClearAllNotifications = () => {
        setNotifications([]);
        setLastClearedAt(new Date());
        setAnchorEl(null); // Close the popover
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={notifications.length} color="secondary">
                    <NotificationsIcon/>
                </Badge>
            </IconButton>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <List>
                    {notifications.map((notification, index) => (
                        <ListItem key={index} button>
                            <ListItemText
                                primary={`Appointment on ${new Date(notification.date).toLocaleDateString()} at ${notification.time}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleRemoveNotification(index)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                    {notifications.length > 0 && (
                        <ListItem style={{textAlign: 'center'}}>
                            <Button onClick={handleClearAllNotifications} style={{
                                borderRadius: '20px',
                                padding: '8px 16px',
                                backgroundColor: '#606060',
                                color: 'white'
                            }}>Clear All</Button>
                        </ListItem>
                    )}
                </List>
            </Popover>
        </>
    );
};

export default Notification;
