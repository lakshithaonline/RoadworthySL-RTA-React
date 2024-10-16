import React, { useState, useEffect } from 'react';
import { PopupMenu } from "react-simple-widgets";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import styles from './DropdownMenu.module.css';
import { getUserByToken } from '../../../../../services/userService';

const DropdownMenu = ({ onLogout }) => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        profilePicture: ''
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fetchedUser = await getUserByToken();
                setUser(fetchedUser);
                setError(null);
            } catch (err) {
                console.error("Error fetching user data", err);
                setError("Failed to fetch user data. Please log in again.");
                setUser({ firstName: '', lastName: '', email: '', role: '', profilePicture: '' }); // Clear user data
            }
        };

        fetchUserData();
    }, []);

    return (
        <PopupMenu>
            <div className={styles.circleAvatar}>
                {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className={styles.avatarImage} />
                ) : (
                    <AccountCircleIcon className={styles.avatarImage} />
                )}
            </div>
            <div className={styles.cardStart}>
                <div className={styles.cardBody}>
                    <h5 className={styles.textCenter}>
                        {user.firstName} {user.lastName}
                    </h5>
                    <p className={styles.textCenterSmall}>{user.email}</p>
                    {error && <p className={styles.errorText}>{error}</p>} {/* Display error message */}
                    <hr className={styles.hr} />
                    <p className={styles.roles}>ROLES</p>
                    {user.role ? (
                        <p className={styles.roleItem}>{user.role}</p>
                    ) : (
                        <p className={styles.roleItem}>No roles assigned</p> // Adjusted for styling
                    )}
                    <hr className={styles.hr} />
                    <div className={styles.listGroupFlush}>
                        <Link to="/dashboard/customers" className={styles.listGroupItem}>
                            <small>User Profile</small>
                        </Link>
                        <Link to="/admin" className={styles.listGroupItem}>
                            <small>Admin Login</small>
                        </Link>
                        <Link to="/examiner-login" className={styles.listGroupItem}>
                            <small>Examiner Login</small>
                        </Link>
                    </div>
                    <hr className={styles.hr} />
                    <div className={styles.dGrid}>
                        <button className={styles.logoutBtn} onClick={onLogout}>
                            <small>Logout</small>
                        </button>
                    </div>
                </div>
            </div>
        </PopupMenu>
    );
};

export default DropdownMenu;
