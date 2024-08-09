import React from 'react'
import health from '../assets/svgs/health.svg'
import money from '../assets/svgs/money.svg'
import medicbag from '../assets/svgs/medicbag.svg'

const Dashboard = () => {
  return (
    <div className='w-full h-full  '>
        <div className='bg-stone-200 px-10 py-10'>
            <div className='flex justify-between items-center mb-5'>
                <div>
                    <h1 className='text-2xl font-bold '>Dashboard</h1>
                    <h3>A quick data overview of the inventory.</h3>
                </div>
                <div>
                    <button className='border px-4 py-2 bg-white border-gray-500 rounded'>
                        Download Reports
                    </button>
                </div>
            </div>
            <div className='w-full flex gap-5'>
                <a href="">
                    <div className='bg-white flex flex-col items-center border-2 border-green-400 rounded-lg w-64 overflow-hidden pt-5 gap-1'>
                        <img src={health} alt="" className='w-8'/>
                        <h3 className='text-2xl font-bold'>Good</h3>
                        <p className='font-semibold leading-none mb-5'>Inventory Status</p>
                        <div className='w-full py-1 bg-green-200 text-center '>
                            <p>
                                View Detailed Report 
                            </p>
                        </div>
                    </div>
                </a>
                <a href="">
                    <div className='bg-white flex flex-col items-center border-2 border-yellow-400 rounded-lg w-64 overflow-hidden pt-5 gap-1'>
                        <img src={money} alt="" className='w-10 mb-2'/>
                        <h3 className='text-2xl font-bold'>Rs. 8,55,875</h3>
                        <p className='font-semibold leading-none mb-5'>Revenue: Jan 2024</p>
                        <div className='w-full py-1 bg-yellow-200 text-center '>
                            <p>
                                View Detailed Report 
                            </p>
                        </div>
                    </div>
                </a>
                <a href="">
                    <div className='bg-white flex flex-col items-center border-2 border-blue-400 rounded-lg w-64 overflow-hidden pt-5 gap-1'>
                        <img src={medicbag} alt="" className='w-8 mb-1'/>
                        <h3 className='text-2xl font-bold'>298</h3>
                        <p className='font-semibold leading-none mb-5'>Medicines Available</p>
                        <div className='w-full bg-blue-200 text-center py-1'>
                            <p>
                                View Detailed Report 
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div  className=' px-10 py-10'>
            <div className='grid grid-cols-2 gap-4'>
                <div className='border'>
                    <div className='px-5 py-1 flex items-center justify-between border-b'>
                        <h3 className='text-xl font-bold'>Inventory</h3>
                        <span>Go to Configuration &gt;</span>
                    </div>
                    <div className='px-5 flex py-5'>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>298</h3>
                            <p className='font-semibold'>Total no of Medicines</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>24</h3>
                            <p  className='font-semibold'>Medicine Groups</p>
                        </div>
                    </div>
                </div>

                <div className='border'>
                    <div className='px-5 py-1 flex items-center justify-between border-b'>
                        <h3 className='text-xl font-bold'>Quick Report</h3>
                        <span>January 2024</span>
                    </div>
                    <div className='px-5 flex py-5'>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>70,856</h3>
                            <p className='font-semibold'>Qty of Medicines Sold</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>5,288</h3>
                            <p  className='font-semibold'>Invoices Generated</p>
                        </div>
                    </div>
                </div>

                <div className='border'>
                    <div className='px-5 py-1 flex items-center justify-between border-b'>
                        <h3 className='text-xl font-bold'>My Pharmacy</h3>
                        <span>Go to User Management &gt;</span>
                    </div>
                    <div className='px-5 flex py-5'>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>04</h3>
                            <p className='font-semibold'>Total no of Suppliers</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>05</h3>
                            <p  className='font-semibold'>Total no of Users</p>
                        </div>
                    </div>
                </div>

                <div className='border'>
                    <div className='px-5 py-1 flex items-center justify-between border-b'>
                        <h3 className='text-xl font-bold'>Customers</h3>
                        <span>Go to Customer Page &gt;</span>
                    </div>
                    <div className='px-5 flex py-5'>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>845</h3>
                            <p className='font-semibold'>Total no of Customers</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>Adalimumab</h3>
                            <p  className='font-semibold'>Frequently bought item</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard