import React, { useState, useEffect } from 'react';
import { PopupMenu } from "react-simple-widgets";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './DropdownMenu.module.css';
import { getUserByToken } from '../../../../../services/userService'; // Adjust the import based on your file structure

const DropdownMenu = ({ onLogout }) => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fetchedUser = await getUserByToken();
                setUser(fetchedUser);
            } catch (err) {
                console.error("Error fetching user data", err);
            }
        };

        fetchUserData();
    }, []);

    return (
        <PopupMenu>
            <div className={styles.circleAvatar}>
                <AccountCircleIcon className={styles.avatarImage} />
            </div>
            <div className={styles.cardStart}>
                <div className={styles.cardBody}>
                    <h5 className={styles.textCenter}>
                        {user.firstName} {user.lastName}
                    </h5>
                    <p className={styles.textCenterSmall}>{user.email}</p>
                    <hr className={styles.hr} />
                    <p className={styles.roles}>
                        ROLES
                    </p>
                    {user.role ? (
                        <p className={styles.roleItem}>
                            {user.role}
                        </p>
                    ) : (
                        <p>No roles assigned</p>
                    )}
                    <hr className={styles.hr} />
                    <div className={styles.listGroupFlush}>
                        <button className={styles.listGroupItem}>
                            <small>Change Requests</small>
                        </button>
                        <button className={styles.listGroupItem}>
                            <small>Pending Requests</small>
                        </button>
                        <button className={styles.listGroupItem}>
                            <small>Other Requests</small>
                        </button>
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
