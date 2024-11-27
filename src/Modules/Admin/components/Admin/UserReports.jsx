import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserReports = () => {
    // Sample data for the chart
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
    const activeUsersData = [250, 320, 280, 350, 400, 420, 460, 380, 410];
    const inactiveUsersData = [50, 60, 40, 80, 100, 120, 90, 70, 85];

    const data = {
        labels,
        datasets: [
            {
                label: 'User Activity',
                data: activeUsersData.map((active, i) => active + inactiveUsersData[i]), // Sum of active and inactive users
                fill: false,
                backgroundColor: 'rgba(59, 130, 246, 1)',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly User Activity',
            },
            tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: false,
                callbacks: {
                    label: function (tooltipItem) {
                        const index = tooltipItem.dataIndex;
                        const activeUsers = activeUsersData[index];
                        const inactiveUsers = inactiveUsersData[index];
                        return `  Active Users: ${activeUsers}, Inactive Users: ${inactiveUsers}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        hover: {
            mode: 'dataset',
        },
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            width: '100%',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                }}>Report &gt; User Reports</h2>
            </div>

            {/* User Summary */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '24px',
            }}>
                {/* Active Users */}
                <div style={{
                    backgroundColor: '#F3F4F6',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '30%',
                    textAlign: 'center',
                }}>
                    <h3 style={{ marginBottom: '8px', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>Active Users</h3>
                    <p style={{ color: '#10B981', fontSize: '1.5rem', fontWeight: '700' }}>410</p>
                </div>

                {/* Inactive Users */}
                <div style={{
                    backgroundColor: '#F3F4F6',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '30%',
                    textAlign: 'center',
                }}>
                    <h3 style={{ marginBottom: '8px', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>Inactive Users</h3>
                    <p style={{ color: '#EF4444', fontSize: '1.5rem', fontWeight: '700' }}>85</p>
                </div>

                {/* Total Users */}
                <div style={{
                    backgroundColor: '#F3F4F6',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '30%',
                    textAlign: 'center',
                }}>
                    <h3 style={{ marginBottom: '8px', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>Total Users</h3>
                    <p style={{ color: '#10B981', fontSize: '1.5rem', fontWeight: '700' }}>495</p>
                </div>
            </div>

            {/* User Activity Chart */}
            <div style={{
                marginBottom: '100px',
                padding: '20px',
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                height: '300px',
            }}>
                <h3 style={{
                    marginBottom: '16px',
                    fontSize: '1.25rem',
                    color: '#1f2937',
                    fontWeight: '600',
                }}>Monthly User Activity</h3>
                <div style={{ height: '100%' }}>
                    <Line data={data} options={options} />
                </div>
            </div>

        </div>
    );
};

export default UserReports;
