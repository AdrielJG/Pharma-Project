// OrderCard.jsx
import React from 'react';

const OrderCard = ({ orderId, status, date, fromLocation, toLocation }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">#{orderId}</h2>
        <span className="text-sm text-gray-500">{status} · {date}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{fromLocation}</span>
        <div className="w-full h-1 bg-gray-300 mx-2 flex justify-between items-center">
          <span className="w-1/3 h-full bg-green-500 rounded-full"></span>
          <span className="w-1/3 h-full bg-green-500 rounded-full"></span>
          <span className="w-1/3 h-full bg-gray-300 rounded-full"></span>
        </div>
        <span className="text-sm text-gray-500">{toLocation}</span>
      </div>
    </div>
  );
};

export default OrderCard;
