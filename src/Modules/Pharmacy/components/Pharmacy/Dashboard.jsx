import React from 'react';
import health from '../../assets/svgs/health.svg';
import money from '../../assets/svgs/money.svg';
import medicbag from '../../assets/svgs/medicbag.svg';

const Dashboard = () => {
  return (
    <div className='bg-[#f4f5f7] w-full h-full'>
      <div className='bg-white px-10 py-6 shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h1 className='text-3xl font-semibold text-gray-800'>Dashboard</h1>
            <h3 className='text-gray-600'>A quick data overview of the Manufacturing process.</h3>
          </div>
          <div>
            <button className='border px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
              Download Reports
            </button>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          {/* Inventory Status Card */}
          <a href='/inventory'>
          <div className='bg-white border border-green-400 rounded-lg shadow-sm p-4 transition-transform transform hover:scale-105 hover:shadow-lg'>
            <div className='flex flex-col items-center'>
              <div className='bg-green-100 p-2 rounded-full mb-2'>
                <img src={health} alt="Health Icon" className='w-6' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>Good</h3>
              <p className='font-medium text-gray-600'>Inventory Status</p>
            </div>
            <button className='w-full py-2 mt-4 bg-green-100 text-green-600 font-semibold rounded-b'>
              View Detailed Report
            </button>
          </div>
          </a>

          {/* Revenue Card */}
          <a href='/reports'>
          <div className='bg-white border border-yellow-400 rounded-lg shadow-sm p-4 transition-transform transform hover:scale-105 hover:shadow-lg'>
            <div className='flex flex-col items-center'>
              <div className='bg-yellow-100 p-2 rounded-full mb-2'>
                <img src={money} alt="Money Icon" className='w-8 h-8' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>Rs. 8,55,875</h3>
              <p className='font-medium text-gray-600'>Revenue : Jan 2022</p>
            </div>
            <button className='w-full py-2 mt-4 bg-yellow-100 text-yellow-600 font-semibold rounded-b'>
              View Detailed Report
            </button>
          </div>
          </a>

          {/* Medicines Available Card */}
          <a href='/inventory'>
          <div className='bg-white border border-blue-400 rounded-lg shadow-sm p-4 transition-transform transform hover:scale-105 hover:shadow-lg'>
            <div className='flex flex-col items-center'>
              <div className='bg-blue-100 p-2 rounded-full mb-2'>
                <img src={medicbag} alt="Medicbag Icon" className='w-7 h-7' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>298</h3>
              <p className='font-medium text-gray-600'>Medicines Available</p>
            </div>
            <button className='w-full py-2 mt-4 bg-blue-100 text-blue-600 font-semibold rounded-b'>
              Visit Inventory
            </button>
          </div>
          </a>
        </div>
      </div>

      <div className='px-10 py-6 grid grid-cols-2 gap-6'>
        {/* Inventory Section */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-2xl font-semibold text-gray-900'>Inventory</h3>
            <a href='/inventory' className='text-blue-700 cursor-pointer'>Go to Inventory &gt;</a>
          </div>
          <div className='flex justify-between'>
            <div className='text-left'>
              <h3 className='text-3xl font-bold text-gray-800'>298</h3>
              <p className='text-lg text-gray-500'>Total no of Medicines</p>
            </div>
            <div className='text-left'>
              <h3 className='text-3xl font-bold text-gray-800'>24</h3>
              <p className='text-lg text-gray-500'>Medicine Groups</p>
            </div>
          </div>
        </div>

        {/* Quick Report Section */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-2xl font-semibold text-gray-900'>Quick Report</h3>
            <span className='text-gray-500'>January 2024</span>
          </div>
          <div className='flex justify-between'>
            <div className='text-left'>
              <h3 className='text-3xl font-bold text-gray-800'>70,856</h3>
              <p className='text-lg text-gray-500'>Qty of Medicines Sold</p>
            </div>
            <div className='text-left'>
              <h3 className='text-3xl font-bold text-gray-800'>5,288</h3>
              <p className='text-lg text-gray-500'>Invoices Generated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;