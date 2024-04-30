import React, { useState, useEffect } from 'react';
import Analytics from '../components/homepage/Analytics';
import Cards from '../components/homepage/Cards';
import Footer from '../components/homepage/Footer';
import Hero from '../components/homepage/Hero';
import Navbar from '../components/homepage/Navbar';
import Newsletter from '../components/homepage/Newsletter';

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [forceRerender, setForceRerender] = useState(false);

    useEffect(() => {
        const checkLoggedIn = () => {
            const user = localStorage.getItem('user');
            const userObj = user ? JSON.parse(user) : null;
            if (userObj && userObj.token) {
                console.log('User is logged in with token:', userObj.token); // Debugging line
                setIsLoggedIn(true);
            } else {
                console.log('No user token found.'); // Debugging line
                setIsLoggedIn(false);
            }
        };

        checkLoggedIn();
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setForceRerender(prev => !prev); // Flip the state to trigger a re-render
    };

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Hero isLoggedIn={isLoggedIn} />
            <Analytics />
            <Newsletter />
            <Cards />
            <Footer />
        </div>
    );
}

export default HomePage;
