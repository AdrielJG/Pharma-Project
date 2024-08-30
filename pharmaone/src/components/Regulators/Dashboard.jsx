import React from 'react'
import compliant from '../../assets/svgs/compliant.svg'
import total from '../../assets/svgs/Total.svg'
import medicbag from '../../assets/svgs/medicbag.svg'
import shield from '../../assets/svgs/Shield.svg'

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
                <a href="/compliance">
                    <div className='bg-white flex flex-col items-center border-2 border-green-400 rounded-lg w-64 overflow-hidden pt-5 gap-1'>
                        <img src={compliant} alt="" className='w-8'/>
                        <h3 className='text-2xl font-bold'>Compliant</h3>
                        <p className='font-semibold leading-none mb-5'>Entity Status</p>
                        <div className='w-full py-1 bg-green-200 text-center '>
                            <p><u>
                                View Detailed Report 
                            </u></p>
                        </div>
                    </div>
                </a>
                <a href="/reports">
                    <div className='bg-white flex flex-col items-center border-2 border-yellow-400 rounded-lg w-64 overflow-hidden pt-3.5 gap-1'>
                        <img src={total} alt="" className='w-10 mb-1'/>
                        <h3 className='text-2xl font-bold'>523</h3>
                        <p className='font-semibold text-xs leading-none mb-1'>Total Compliance Checks: <br></br>Jan 2024</p>
                        <div className='w-full py-1 bg-yellow-200 text-center '>
                            <p><u>
                                View Detailed Report 
                            </u></p>
                        </div>
                    </div>
                </a>
                <a href="/qualityrec">
                    <div className='bg-white flex flex-col items-center border-2 border-blue-400 rounded-lg w-64 overflow-hidden pt-5 gap-1'>
                        <img src={shield} alt="" className='w-8 mb-1'/>
                        <h3 className='text-2xl font-bold'>298</h3>
                        <p className='font-semibold text-sm leading-none mb-1'>Total Quality Checks: <br></br>Jan 2024</p>
                        <div className='w-full bg-blue-200 text-center py-1'>
                            <p><u>
                                View Detailed Report 
                            </u></p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div  className=' px-10 py-10'>
            <div className='grid grid-cols-2 gap-4'>
                <div className='border'>
                    <div className='px-5 py-1 flex items-center justify-between border-b'>
                        <h3 className='text-xl font-bold'>Regulations</h3>
                        <span>Go to Reports &gt;</span>
                    </div>
                    <div className='px-5 flex py-5'>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>98</h3>
                            <p className='font-semibold'>Total no of Entities Monitored</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>16</h3>
                            <p  className='font-semibold'>Supply Groups</p>
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
                            <h3 className='text-xl font-bold'>1063</h3>
                            <p className='font-semibold'>Checks Done</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>52</h3>
                            <p  className='font-semibold'>Checks Pending</p>
                        </div>
                    </div>
                </div>

                <div className='border'>
                    <div className='px-5 py-1 flex items-center justify-between border-b'>
                        <h3 className='text-xl font-bold'>Compliance</h3>
                        <span>Go to Compliance Checks &gt;</span>
                    </div>
                    <div className='px-5 flex py-5'>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>82%</h3>
                            <p className='font-semibold'>Current Compliance Rate</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>05</h3>
                            <p  className='font-semibold'>Outstanding Issues</p>
                        </div>
                    </div>
                </div>

                <div className='border'>
                    <div className='px-5 py-1 flex items-center justify-between border-b'>
                        <h3 className='text-xl font-bold'>Quality</h3>
                        <span>Go to Quality Checks &gt;</span>
                    </div>
                    <div className='px-5 flex py-5'>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>89%</h3>
                            <p className='font-semibold'>Quality Check Pass Rate</p>
                        </div>
                        <div className='w-1/2 text-start'>
                            <h3 className='text-xl font-bold'>11%</h3>
                            <p  className='font-semibold'>Defect Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard