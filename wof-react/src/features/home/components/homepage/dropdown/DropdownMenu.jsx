import React from 'react';
import { PopupMenu } from "react-simple-widgets";
import styles from './DropdownMenu.module.css';

// Default profile picture URL (replace with your actual profile picture URL)
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const DropdownMenu = ({ user, onLogout }) => {
    return (
        <PopupMenu>
            <div className={styles.circleAvatar}>
                <AccountCircleIcon className={styles.avatarImage} />
            </div>
            <div className={styles.cardStart}>
                <div className={styles.cardBody}>
                    <h5 className={styles.textCenter}>Lakshitha Geethmal</h5>
                    <p className={styles.textCenterSmall}>lakshithageethmal@x.com</p>
                    <hr className={styles.hr} />
                    <p className={styles.roles}>
                        ROLES
                    </p>
                    <p className={styles.roleItem}>
                        User
                    </p>
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
