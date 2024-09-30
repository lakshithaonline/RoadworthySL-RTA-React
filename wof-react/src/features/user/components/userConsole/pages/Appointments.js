import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Typography
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
    createAppointment,
    getAllBookedSlots,
    getUserAppointments,
    getVehicles
} from "../../../../../services/AppointmentService";
import {format} from 'date-fns';

const Appointments = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [userAppointments, setUserAppointments] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Control success/error

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchVehicles();
                await fetchAllBookedSlots();
                await fetchUserAppointments();
            } catch (error) {
            }
        };
        fetchData();
    }, []);

    const fetchVehicles = async () => {
        try {
            const vehicles = await getVehicles();
            setVehicles(vehicles);
        } catch (error) {
            console.error('Error fetching vehicles', error);
        }
    };

    const fetchAllBookedSlots = async () => {
        try {
            const slots = await getAllBookedSlots();
            setBookedSlots(slots);
        } catch (error) {
            console.error('Error fetching booked slots', error);
        }
    };

    const fetchUserAppointments = async () => {
        try {
            const appointments = await getUserAppointments();
            const formattedAppointments = appointments.map(appointment => ({
                ...appointment,
                date: format(new Date(appointment.date), 'yyyy-MM-dd'),
                time: appointment.time,
                registrationNumber: appointment.registrationNumber
            }));
            setUserAppointments(formattedAppointments);
        } catch (error) {
            console.error('Error fetching user appointments', error);
        }
    };

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        const slotsForDate = generateTimeSlots(info.dateStr, bookedSlots);
        setAvailableTimeSlots(slotsForDate);
        setSelectedTime('');
    };

    const generateTimeSlots = (date, bookedSlots) => {
        const workingHours = [
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
        ];
        const bookedTimes = bookedSlots
            .filter(slot => slot.date === date)
            .map(slot => slot.time);
        return workingHours.map(time => ({
            time,
            available: !bookedTimes.includes(time)
        }));
    };

    const handleBooking = async () => {
        const selectedDateTime = new Date(selectedDate + 'T' + selectedTime);
        const today = new Date();

        if (selectedDateTime.getDay() === 0 || selectedDateTime.getDay() === 6) {
            handleSnackbarOpen('Booking on weekends is not allowed.', 'error');
            return;
        }
        if (selectedDateTime < today) {
            handleSnackbarOpen('Booking on past dates is not allowed.', 'error');
            return;
        }
        try {
            const response = await createAppointment(selectedDate, selectedTime, selectedVehicle);
            handleSnackbarOpen(response.message, 'success');
            await fetchAllBookedSlots();
            await fetchUserAppointments();
        } catch (error) {
            handleSnackbarOpen(error.response.data.message, 'error');
        }
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const formatEventTime = (time) => {
        try {
            const [hours, minutes] = time.split(':');
            const formattedTime = new Date();
            formattedTime.setHours(hours);
            formattedTime.setMinutes(minutes);
            return format(formattedTime, 'HH:mm');
        } catch (error) {
            console.error('Error formatting time:', error);
            return time;
        }
    };

    const renderEventContent = (eventInfo) => {
        const timeOnly = formatEventTime(eventInfo.event.title);
        return (
            <div>
                <span style={{display: 'none'}}>{eventInfo.event.title.split(' ')[0]}</span>
                <span>{timeOnly}</span>
            </div>
        );
    };

    return (
        <Container maxWidth="lg" sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Book Appointments
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{padding: 3, height: '100%'}}>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={bookedSlots.map(slot => ({
                                title: slot.time,
                                date: slot.date
                            }))}
                            dateClick={handleDateClick}
                            eventContent={renderEventContent}
                            height="auto"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{padding: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Available Time Slots
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Selected Date: {selectedDate}
                        </Typography>
                        <List sx={{maxHeight: 300, overflow: 'auto'}}>
                            {availableTimeSlots.map(slot => (
                                <ListItem
                                    key={slot.time}
                                    button
                                    disabled={!slot.available}
                                    selected={slot.time === selectedTime}
                                    onClick={() => setSelectedTime(slot.time)}
                                >
                                    <ListItemText primary={slot.time}/>
                                </ListItem>
                            ))}
                        </List>
                        <Select
                            value={selectedVehicle}
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                            displayEmpty
                            fullWidth
                            sx={{margin: '20px 0'}}
                        >
                            <MenuItem value="" disabled>Select Vehicle</MenuItem>
                            {vehicles.map(vehicle => (
                                <MenuItem key={vehicle._id} value={vehicle.registrationNumber}>
                                    {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBooking}
                            fullWidth
                            disabled={!selectedDate || !selectedTime || !selectedVehicle}
                        >
                            Book Appointment
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{width: '100%'}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Appointments;
