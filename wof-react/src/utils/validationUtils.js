import dayjs from 'dayjs';

// Validate email
export const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
};

// Validate username (alphanumeric and at least 3 characters)
export const validateUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_]{3,}$/;
    return usernamePattern.test(username);
};

// Validate password (at least 8 characters, includes 1 number and 1 special character)
export const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
};

// Validate password confirmation (check if passwords match)
export const validatePasswordConfirmation = (password, confirmPassword) => {
    return password === confirmPassword;
};

// Validate age (must be at least 18 years old)
export const validateAge = (dob) => {
    const ageLimit = 18;
    const birthDate = dayjs(dob);
    const currentDate = dayjs();
    const age = currentDate.diff(birthDate, 'year');
    return age >= ageLimit;
};

// Sanitize input to prevent basic XSS attacks
export const sanitizeInput = (input) => {
    return input.replace(/[<>/'"]/g, '');
};

// Validate date of birth format (YYYY-MM-DD)
export const validateDateFormat = (dob) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dob);
};
