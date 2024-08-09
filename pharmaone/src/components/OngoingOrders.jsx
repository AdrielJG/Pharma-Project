// OngoingOrders.jsx
import React from 'react';
import OrderCard from './OrderCard';

const orders = [
  { orderId: 'HWDSF776567DS', status: 'On the way', date: '24 June', fromLocation: 'Delhi, India', toLocation: 'California, US' },
  { orderId: 'HWDSF776567DS', status: 'On the way', date: '24 June', fromLocation: 'Delhi, India', toLocation: 'California, US' },
  { orderId: 'HWDSF776567DS', status: 'On the way', date: '24 June', fromLocation: 'Delhi, India', toLocation: 'California, US' },
  { orderId: 'HWDSF776567DS', status: 'On the way', date: '24 June', fromLocation: 'Delhi, India', toLocation: 'California, US' },
  { orderId: 'HWDSF776567DS', status: 'On the way', date: '24 June', fromLocation: 'Delhi, India', toLocation: 'California, US' },
  { orderId: 'HWDSF776567DS', status: 'On the way', date: '24 June', fromLocation: 'Delhi, India', toLocation: 'California, US' },
];

const OngoingOrders = () => {
  return (
    <div className="w-full p-10">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <p className="text-sm text-gray-600 mb-8">Order details and their progress</p>
      <div className="grid grid-cols-2 gap-6">
        {orders.map((order, index) => (
          <OrderCard key={index} {...order} />
        ))}
      </div>
    </div>
  );
};

export default OngoingOrders;
