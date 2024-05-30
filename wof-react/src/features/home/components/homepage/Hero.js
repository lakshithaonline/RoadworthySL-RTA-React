import React from 'react';
import { ReactTyped as Typed } from 'react-typed';
import {useNavigate} from "react-router-dom";
import wavingFlagVideo from '../../../../assets/hero/Sri Lanka Waving Flag Background Loop (720p).mp4';


const Hero = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/user-login');
  };

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

  return (
      <div className='text-white' >
          <video
              className='absolute top-0 left-0 w-full h-full'
              autoPlay
              loop
              muted
              playsInline
              style={{opacity: 0.05, zIndex: -1, position: 'fixed', top: 0, left: 0, width: '100vw', height: '56.25vw',}}
              playbackRate={0.01}
              controlsList="nodownload"
          >
              <source src={wavingFlagVideo} type="video/mp4"/>
          </video>
          <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
              <p className='text-[#00df9a] font-bold p-2'>
                  ROAD AND TRANSPORT AGENCY
              </p>
              <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
                  Secure Your Journey
              </h1>
              <div className='flex justify-center items-center'>
                  <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>
                      Rigorous Tests for
                  </p>
                  <Typed
                      className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2'
                      strings={['Cars', 'Vans', 'Bikes', 'Buses']}
                      typeSpeed={120}
                      backSpeed={140}
                      loop
                  />
              </div>
              <p className='md:text-2xl text-xl font-bold text-gray-500'>Stay compliant and safe with our certified
                  Warrant
                  of Fitness inspections.</p>
              {!isLoggedIn ? (
                  <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black' onClick={handleGetStartedClick}>
                      Get Certified
                  </button>
              ) : (
                  <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black' onClick={handleDashboardClick}>
                      Check WOF
                  </button>
              )}
          </div>
      </div>
  );
};

export default Hero;
