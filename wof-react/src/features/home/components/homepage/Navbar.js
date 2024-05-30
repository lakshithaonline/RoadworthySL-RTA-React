import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, useNavigate  } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }) => {
    const [nav, setNav] = useState(false);
    const navigate = useNavigate ();

    const handleNav = () => {
        setNav(!nav);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        onLogout();
        navigate('/');
    };

    return (
        <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
            <h1 className='w-full text-4xl font-bold text-[#00df9a]'>CeylonRTA</h1>
            <ul className='hidden md:flex'>
                {isLoggedIn && (
                    <>
                        <Link to="/" className='p-4'>Home</Link>
                        <Link to="/company" className='p-4'>Company</Link>
                        <Link to="/resources" className='p-4'>Resources</Link>
                        <Link to="/about" className='p-4'>About</Link>
                        <Link to="/contact" className='p-4'>Contact</Link>
                        <li onClick={handleLogout} className='p-4 cursor-pointer'>Logout</li>
                    </>
                )}
            </ul>
            <div onClick={handleNav} className='block md:hidden'>
                {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>}
            </div>
            {nav && isLoggedIn && (
                <ul className={`fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500`}>
                    <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>REACT.</h1>
                    <Link to="/" className='p-4 border-b border-gray-600'>Home</Link>
                    <Link to="/company" className='p-4 border-b border-gray-600'>Company</Link>
                    <Link to="/resources" className='p-4 border-b border-gray-600'>Resources</Link>
                    <Link to="/about" className='p-4 border-b border-gray-600'>About</Link>
                    <Link to="/contact" className='p-4 border-b border-gray-600'>Contact</Link>
                    <li onClick={handleLogout} className='p-4 border-b border-gray-600 cursor-pointer'>Logout</li>
                </ul>
            )}
        </div>
    );
};

export default Navbar;
