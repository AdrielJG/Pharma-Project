import React, { useState } from 'react';

const DispatchedOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);

  const openModal = (info) => {
    setTrackingInfo(info);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrackingInfo(null);
  };
  const [productStatus, setProductStatus] = useState('Received');

  const handleStatusChange = (e) => {
    setProductStatus(e.target.value);
  };
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
            <td className='p-3 text-blue-600'>
              <button onClick={() => openModal("Tracking info for Augmentin 625 Duo Tablet")}>
                Track
              </button>
            </td>
            <td className='p-3'><button className='text-blue-600'>View Full Detail</button></td>
          </tr>
          <tr className='border-b'>
            <td className='p-3'>Ascoril LS Syrup</td>
            <td className='p-3'>D06ID232435452</td>
            <td className='p-3'>Pharmacy</td>
            <td className='p-3 text-green-600'>In Transit</td>
            <td className='p-3'>04-07-2024</td>
            <td className='p-3 text-blue-600'>
              <button onClick={() => openModal("Tracking info for Ascoril LS Syrup")}>
                Track
              </button>
            </td>
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

      {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="min-h-screen bg-[#1A1A2E] flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[500px]">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-6">
                    <a href="#" className="hover:underline">Home</a> &gt; 
                    <a href="#" className="hover:underline"> Orders </a> &gt; 
                    ID 3354654654526
                </nav>
                
                {/* Order Info */}
                <h1 className="text-2xl font-semibold mb-2">Order ID: 3354654654526</h1>
                <p className="text-sm text-gray-600 mb-2">Order date: Feb 16, 2022</p>
                <p className="text-sm text-green-500 font-semibold mb-6">Estimated delivery: May 16, 2022</p>
                
                {/* Order Status */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-center">
                        <p className="font-semibold text-[#00BFFF]">Order Confirmed</p>
                        <p className="text-sm text-gray-600">Wed, 11th Jan</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">Shipped</p>
                        <p className="text-sm text-gray-600">Wed, 11th Jan</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">Out For Delivery</p>
                        <p className="text-sm text-gray-600">Wed, 11th Jan</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">Delivered</p>
                        <p className="text-sm text-gray-600">Expected by, Mon 16th</p>
                    </div>
                </div>

                <hr className="mb-6"/>

                {/* Product Info */}
                <div className="flex items-center mb-6">
                    <img src="https://via.placeholder.com/80" alt="Product" className="w-20 h-20 object-cover mr-4"/>
                    <div>
                        <h2 className="font-semibold">Ascoril LS Syrup”</h2>
                        <p className="text-gray-500"></p>
                        <p className="text-lg font-semibold mt-2">$259.00 <span className="text-sm text-gray-600">Qty: 2</span></p>
                    </div>
                </div>

                <hr className="mb-6"/>

                {/* Payment & Delivery Info */}
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="font-semibold">Payment</h3>
                        <p className="text-gray-500">Visa ****56</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Delivery</h3>
                        <address className="not-italic text-gray-500">
                            847 Jewess Bridge Apt.<br/>
                            174 London, UK<br/>
                            474-769-3919
                        </address>
                    </div>
                </div>

                <hr className="mb-6"/>

                {/* Order Summary */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-semibold">Need Help</h3>
                        <ul className="text-blue-600 text-sm">
                            <li><a href="#">Order Issues</a></li>
                            <li><a href="#">Delivery Info</a></li>
                            <li><a href="#">Returns</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold">Order Summary</h3>
                        <ul className="text-gray-600 text-sm">
                            <li>Discount: $5554</li>
                            <li>Discount (20%): -$1109.40</li>
                            <li>Delivery: $0.00</li>
                            <li>Tax: +$221.88</li>
                        </ul>
                        <p className="font-semibold mt-2">Total: $0.00</p>
                    </div>
                </div>

                <hr className="mb-6"/>

                {/* Product Status with Dropdown */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-700">Product Status</h3>
                        <select
                            value={productStatus}
                            onChange={handleStatusChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00BFFF] focus:border-[#00BFFF] sm:text-sm rounded-md"
                        >
                            <option>Received</option>
                            <option>Shipped</option>
                            <option>Out for Delivery</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                    <button className="bg-[#00BFFF] text-white py-2 px-4 rounded-lg">Upload Proof</button>
                </div>

                {/* Cancel Button */}
                <div className="text-right">
                    <button
                        onClick={closeModal}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

    </div>
  );
};

export default DispatchedOrders;