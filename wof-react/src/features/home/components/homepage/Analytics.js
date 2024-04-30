import React from 'react';
import Laptop from '../../../../assets/home-page/laptop.jpg';

const Analytics = () => {
  return (
    <div className='w-full bg-white py-16 px-4'>
      <div className='max-w-[1240px] mx-auto grid md:grid-cols-2'>
        <img className='w-[500px] mx-auto my-4' src={Laptop} alt='/' />
        <div className='flex flex-col justify-center'>
          <p className='text-[#00df9a] font-bold '>RoadworthySL - RTA</p>
          <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>Streamline Your Vehicle Inspections</h1>
          <div style={{marginTop: '1.5rem'}}>
            <p style={{marginBottom: '1rem'}}>
              Make managing your vehicle inspections hassle-free with our RoadworthySL. Whether you're a vehicle
              owner or a service provider, our platform simplifies the process of ensuring your vehicle meets safety
              standards.
            </p>
            <p style={{marginBottom: '1rem'}}>
              Our user-friendly interface allows you to schedule inspections, receive reminders, and access inspection
              reports conveniently. Say goodbye to paperwork and long wait times at inspection centers.
            </p>
            <p>
              Join countless others in Sri Lanka who have embraced the convenience and efficiency of our RoadworthySL. Drive with confidence knowing your vehicle is compliant with safety regulations.
            </p>
          </div>

          <button className='bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3'>Get
            Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
