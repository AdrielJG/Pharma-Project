import React from 'react';

const DispatchedOrders = () => {
  return (
    <div className='p-8 flex-1'>
      <h2 className='text-2xl font-semibold mb-6'>Orders <span className="text-gray-600">Dispatched Orders</span></h2>
      <p className='text-sm text-gray-500 mb-4'>List of medicines whose checks are either completed or in progress</p>
      <div className='mb-4'>
        <input type="text" placeholder="Search Medicine Groups.." className="px-3 py-2 border rounded w-1/2" />
      </div>
      <table className='w-full bg-white shadow rounded'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='p-3 text-left'>Medicine Name</th>
            <th className='p-3 text-left'>Medicine ID</th>
            <th className='p-3 text-left'>Destination</th>
            <th className='p-3 text-left'>Status</th>
            <th className='p-3 text-left'>Dispatch Date</th>
            <th className='p-3 text-left'>Tracking Info</th>
            <th className='p-3 text-left'>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className='border-b'>
            <td className='p-3'>Augmentin 625 Duo Tablet</td>
            <td className='p-3'>D06ID232435454</td>
            <td className='p-3'>Distributor B</td>
            <td className='p-3 text-green-600'>In Transit</td>
            <td className='p-3'>08-07-2024</td>
            <td className='p-3 text-blue-600'>Track</td>
            <td className='p-3'><button className='text-blue-600'>View Full Detail</button></td>
          </tr>
          <tr className='border-b'>
            <td className='p-3'>Ascoril LS Syrup</td>
            <td className='p-3'>D06ID232435452</td>
            <td className='p-3'>Pharmacy</td>
            <td className='p-3 text-green-600'>In Transit</td>
            <td className='p-3'>04-07-2024</td>
            <td className='p-3 text-blue-600'>Track</td>
            <td className='p-3'><button className='text-blue-600'>View Full Detail</button></td>
          </tr>
        </tbody>
      </table>
      <div className='flex justify-between items-center mt-4'>
        <span>Showing 1-2 results of 298</span>
        <div>
          <button className='py-2 px-4 border rounded bg-gray-100'>Page 01</button>
        </div>
      </div>
    </div>
  );
};

export default DispatchedOrders;
