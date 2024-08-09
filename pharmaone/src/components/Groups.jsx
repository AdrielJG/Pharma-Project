import React from 'react';

const Groups = () => {
  return (
    <div className="p-10 bg-[#F7F8FA] h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-700">Groups</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          + Create Group
        </button>
      </div>

      {/* Groups List */}
      <div className="bg-white shadow-md rounded">
        <div className="p-4 flex justify-between items-center border border-gray-200 rounded">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Group I</h2>
            <p className="text-sm text-gray-500">Members: X</p>
          </div>
          <div className="flex -space-x-2">
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://via.placeholder.com/150"
              alt="Member 1"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://via.placeholder.com/150"
              alt="Member 2"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://via.placeholder.com/150"
              alt="Member 3"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://via.placeholder.com/150"
              alt="Member 4"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://via.placeholder.com/150"
              alt="Member 5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
