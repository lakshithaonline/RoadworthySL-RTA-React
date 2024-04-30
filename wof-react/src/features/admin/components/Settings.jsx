import React from 'react';
import { Typography, Box, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';

// Functional component for user settings
function Settings() {
    return (
        <Box p={3}> {/* Padding around the Box container */}
            <Typography variant="h4" gutterBottom>
                Settings {/* Title of the settings page */}
            </Typography>
            <form>
                {/* Section for password change */}
                <Box marginBottom={2}>
                    <Typography variant="h6">Change Password</Typography>
                    <TextField
                        label="Current Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                </Box>
                {/* Section for user permissions */}
                <Box marginBottom={2}>
                    <Typography variant="h6">User Permissions</Typography>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Allow user to access reports"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Enable user to modify settings"
                    />
                </Box>
                {/* Submit button for the form */}
                <Button variant="contained" color="primary" type="submit">
                    Save Changes
                </Button>
            </form>
        </Box>
    );
}

export default Settings;
