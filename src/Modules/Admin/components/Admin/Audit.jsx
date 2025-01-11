import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/audit-logs');
                const data = await response.json();
                const normalizedData = data.map(log => ({
                    Date: log.Date,
                    User: log.User,
                    Action: log.Action,
                    Details: log.Details,
                    "IP Address": log["IP Address"],
                }));
                setLogs(normalizedData);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const downloadLogsAsExcel = () => {
        if (logs.length === 0) {
            alert("No logs available to download.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(logs);
        worksheet["!cols"] = [
            { wch: 20 },
            { wch: 30 },
            { wch: 20 },
            { wch: 40 },
            { wch: 15 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Logs');
        XLSX.writeFile(workbook, 'audit_logs.xlsx');
    };

    return (
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 shadow-lg rounded-lg p-6 w-full h-[875px] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 text-blue-500">
                        <i className="fas fa-clipboard-list"></i>
                    </span>
                    Admin Audit Logs
                </h2>
                <button
                    onClick={downloadLogsAsExcel}
                    className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow hover:bg-teal-600 transition"
                >
                    Download Logs
                </button>
            </div>

            {/* Audit Logs Table */}
            <div className="flex-grow overflow-y-scroll">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="sticky top-0 bg-gray-300">
                                <th className="p-3 border-b border-gray-400">Date</th>
                                <th className="p-3 border-b border-gray-400">User</th>
                                <th className="p-3 border-b border-gray-400">Action</th>
                                <th className="p-3 border-b border-gray-400">Details</th>
                                <th className="p-3 border-b border-gray-400">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 hover:bg-gray-200'}
                                    >
                                        <td className="p-3 border-b border-gray-300">{log.Date}</td>
                                        <td className="p-3 border-b border-gray-300">{log.User}</td>
                                        <td className="p-3 border-b border-gray-300">{log.Action}</td>
                                        <td className="p-3 border-b border-gray-300">{log.Details}</td>
                                        <td className="p-3 border-b border-gray-300">{log["IP Address"]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-6 text-center text-gray-600 font-medium"
                                    >
                                        No logs found. Start recording activities to view audit logs.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
