import React from 'react';

const AuditLogs = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full h-[600px] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Admin Audit Logs</h2>
                <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600">
                    Download Logs
                </button>
            </div>

            {/* Audit Logs Table */}
            <div>
                <h3 className="mb-4 text-lg text-gray-800 font-semibold">Recent Audit Logs</h3>
                <table className="w-full border-collapse mb-4">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border-b border-gray-300">Date</th>
                            <th className="p-3 border-b border-gray-300">User</th>
                            <th className="p-3 border-b border-gray-300">Action</th>
                            <th className="p-3 border-b border-gray-300">Details</th>
                            <th className="p-3 border-b border-gray-300">IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-3 border-b border-gray-200">2024-09-01 10:45:23</td>
                            <td className="p-3 border-b border-gray-200">admin</td>
                            <td className="p-3 border-b border-gray-200">Login</td>
                            <td className="p-3 border-b border-gray-200">Successful login</td>
                            <td className="p-3 border-b border-gray-200">192.168.1.1</td>
                        </tr>
                        <tr>
                            <td className="p-3 border-b border-gray-200">2024-09-01 11:10:45</td>
                            <td className="p-3 border-b border-gray-200">admin</td>
                            <td className="p-3 border-b border-gray-200">Update</td>
                            <td className="p-3 border-b border-gray-200">Updated user permissions</td>
                            <td className="p-3 border-b border-gray-200">192.168.1.1</td>
                        </tr>
                        <tr>
                            <td className="p-3 border-b border-gray-200">2024-09-01 11:15:30</td>
                            <td className="p-3 border-b border-gray-200">admin</td>
                            <td className="p-3 border-b border-gray-200">Delete</td>
                            <td className="p-3 border-b border-gray-200">Deleted user account</td>
                            <td className="p-3 border-b border-gray-200">192.168.1.1</td>
                        </tr>
                        <tr>
                            <td className="p-3 border-b border-gray-200">2024-09-02 09:20:14</td>
                            <td className="p-3 border-b border-gray-200">john_doe</td>
                            <td className="p-3 border-b border-gray-200">Logout</td>
                            <td className="p-3 border-b border-gray-200">User logged out</td>
                            <td className="p-3 border-b border-gray-200">192.168.1.2</td>
                        </tr>
                        {/* More rows can be added here */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
