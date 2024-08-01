import React from 'react';
import Mechanical from '../../../../assets/testingIcons/construction (1).png';
import Safety from '../../../../assets/testingIcons/insurance.png';
import Structural from '../../../../assets/testingIcons/chassis.png';
import Environmental from '../../../../assets/testingIcons/zero-emission.png';
import Documentation from '../../../../assets/testingIcons/documents.png';

const Cards = () => {
    return (
        <div className='w-full py-10 px-4 bg-white'>
            <div className='max-w-[1240px] mx-auto flex flex-wrap justify-center gap-4'>
                {/* Mechanical Systems Card */}
                <div className='w-[200px] h-[300px] shadow-xl flex flex-col items-center p-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-12 bg-white' src={Mechanical} alt="Mechanical Systems" />
                    <h2 className='text-xl font-bold text-center py-4'>Mechanical Systems</h2>
                    <div className='text-center font-medium'>
                        <p className='py-1 border-b mx-4 mt-4'>Brakes</p>
                        <p className='py-1 border-b mx-4'>Steering</p>
                        <p className='py-1 border-b mx-4'>Suspension</p>
                    </div>
                </div>

                {/* Safety Features Card */}
                <div className='w-[200px] h-[300px] shadow-xl flex flex-col items-center p-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-12 bg-white' src={Safety} alt="Safety Features" />
                    <h2 className='text-xl font-bold text-center py-4'>Safety Features</h2>
                    <div className='text-center font-medium'>
                        <p className='py-1 border-b mx-4 mt-4'>Seat Belts</p>
                        <p className='py-1 border-b mx-4'>Lights</p>
                        <p className='py-1 border-b mx-4'>Horn and Mirrors</p>
                    </div>
                </div>

                {/* Structural Integrity Card */}
                <div className='w-[200px] h-[300px] shadow-xl flex flex-col items-center p-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-12 bg-white' src={Structural} alt="Structural Integrity" />
                    <h2 className='text-xl font-bold text-center py-4'>Structural Integrity</h2>
                    <div className='text-center font-medium'>
                        <p className='py-1 border-b mx-4 mt-4'>Body and Chassis</p>
                        <p className='py-1 border-b mx-4'>Windows</p>
                        <p className='py-1 border-b mx-4'>Wipers</p>
                    </div>
                </div>

                {/* Environmental Compliance Card */}
                <div className='w-[200px] h-[300px] shadow-xl flex flex-col items-center p-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-12 bg-white' src={Environmental} alt="Environmental Compliance" />
                    <h2 className='text-xl font-bold text-center py-4'>Environmental Compliance</h2>
                    <div className='text-center font-medium'>
                        <p className='py-1 border-b mx-4 mt-4'>Exhaust System</p>
                        <p className='py-1 border-b mx-4'>Emissions</p>
                        <p className='py-1 border-b mx-4'>Fluid Levels:</p>
                    </div>
                </div>

                {/* Documentation and Identification Card */}
                <div className='w-[200px] h-[300px] shadow-xl flex flex-col items-center p-4 rounded-lg hover:scale-105 duration-300'>
                    <img className='w-12 bg-white' src={Documentation} alt="Documentation and Identification" />
                    <h2 className='text-xl font-bold text-center py-4'>Documentation and Identification</h2>
                    <div className='text-center font-medium'>
                        <p className='py-1 border-b mx-4 mt-4'>VIN Verification</p>
                        <p className='py-1 border-b mx-4'>Registration Documents</p>
                        <p className='py-1 border-b mx-4'>Insurance Papers</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cards;
