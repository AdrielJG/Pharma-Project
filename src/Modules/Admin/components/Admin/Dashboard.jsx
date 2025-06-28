import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import compliant from '../../assets/svgs/compliant.svg';
import total from '../../assets/svgs/Total.svg';
import medicbag from '../../assets/svgs/medicbag.svg';
import shield from '../../assets/svgs/Shield.svg';
import logo from '../../assets/Logo.png'; // Replace with your logo path

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [pharmData, setPharmData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user stats
        const statsResponse = await fetch('http://localhost:5000/api/user-stats');
        const statsData = await statsResponse.json();
        setUserStats(statsData);

        // Fetch inventory data with credentials
        const inventoryResponse = await fetch('http://localhost:5000/api/get-inventory-all', {
          credentials: 'include', // Required for session cookies
        });
        if (!inventoryResponse.ok) throw new Error('Inventory fetch failed');
        const inventoryJson = await inventoryResponse.json();
        setInventoryData(inventoryJson);

        // Fetch pharmacy data
        const pharmResponse = await fetch('http://localhost:5000/api/get-pharinventory-all', {
          credentials: 'include', // Required for session cookies
        });
        if (!pharmResponse.ok) throw new Error('P-Inventory fetch failed');
        const pharmJson = await pharmResponse.json();
        setPharmData(pharmJson.pharmacies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to generate and download the PDF
  const generatePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yOffset = 50; // Initial Y position for content
  
    // Add Pharmachain Logo (smaller size)
    pdf.addImage(logo, 'PNG', 20, 10, 25, 25); // Reduced width and height to 25mm
  
    // Pharmachain Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Pharmachain', 55, 20); // Adjusted X position to align with smaller logo
  
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Dashboard Report', 55, 28); // Adjusted X position to align with smaller logo
  
    // Horizontal Line
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.5);
    pdf.line(20, 40, pageWidth - 20, 40);
  
    // Section Helper Function with Background Box
    const addSection = (title, text) => {
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yOffset, pageWidth - 40, 14, 'F');
  
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, 25, yOffset + 9);
  
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');
      pdf.text(text, 25, yOffset + 18);
  
      yOffset += 28;
    };
  
    // Add sections with data
    addSection('Total Active Users', `Count: ${userStats?.activeUsers?.toLocaleString() ?? 'N/A'}`);
    addSection('Total Inactive Users', `Count: ${userStats?.inactiveUsers?.toLocaleString() ?? 'N/A'}`);
    addSection('Manufacturer Inventory Items', `Count: ${inventoryData?.total_quantity?.toLocaleString() ?? 'N/A'}`);
    addSection('Pharmacy Inventory', `Count: ${pharmData && pharmData.length > 0 ? pharmData[0].total_quantity.toLocaleString() : 'N/A'}`);
  
    // Footer with Page Number
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
    }
  
    // Save the PDF
    pdf.save('Pharmachain_Dashboard_Report.pdf');
  };

  return (
    <div className="w-full h-full bg-gray-100">
      <div className="bg-white-200 px-10 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <h3 className="text-gray-600">A quick data overview of the inventory.</h3>
          </div>
          <div>
            <button
              className="border px-4 py-2 bg-white border-gray-500 rounded hover:bg-gray-200"
              onClick={generatePDF}
            >
              Download Reports
            </button>
          </div>
        </div>

        <div className="w-full flex gap-8">
          <a href="/userreportA" className="w-full">
            <div className="bg-white flex flex-col items-center border-2 border-green-400 rounded-lg w-full overflow-hidden p-5 gap-2 transition-transform transform hover:scale-105 hover:shadow-lg">
              <img src={compliant} alt="Compliant Icon" className="w-13 mb-5" />
              <h3 className="text-2xl font-bold text-gray-800">
                {loading ? 'Loading...' : userStats?.activeUsers?.toLocaleString()}
              </h3>
              <p className="font-semibold text-gray-600 leading-none mb-4">Total Active Users</p>
              <div className="w-full py-2 bg-green-200 text-green-600 text-center">
                <p className="font-semibold">
                  <u>View Detailed Report</u>
                </p>
              </div>
            </div>
          </a>
          <a href="/medicineA" className="w-full">
            <div className="bg-white flex flex-col items-center border-2 border-yellow-400 rounded-lg w-full overflow-hidden p-5 gap-2 transition-transform transform hover:scale-105 hover:shadow-lg">
              <img src={total} alt="Total Icon" className="w-11 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">
                {loading
                  ? 'Loading...'
                  : pharmData && pharmData.length > 0 && inventoryData
                  ? (pharmData[0].total_quantity + inventoryData.total_quantity).toLocaleString()
                  : 'N/A'}
              </h3>
              <p className="font-semibold text-gray-600 text-center text-sm leading-tight mb-3">
                Total Inventory Items
              </p>
              <div className="w-full py-2 bg-yellow-200 text-yellow-600 text-center">
                <p className="font-semibold">
                  <u>View Details</u>
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="px-10 py-10">
        <div className="grid grid-cols-2 gap-8">
          <div className="border bg-white rounded-lg shadow-md">
            <div className="px-5 py-4 flex items-center justify-between border-b">
              <h3 className="text-xl font-bold text-gray-800">User Management</h3>
              <a href="/inventoryA" className="text-blue-600 hover:underline cursor-pointer">
                Go to User Detail &gt;
              </a>
            </div>
            <div className="px-5 py-6 flex">
              <div className="w-1/2 text-left">
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading ? 'Loading...' : userStats?.activeUsers?.toLocaleString()}
                </h3>
                <p className="font-semibold text-gray-600">Active Users</p>
              </div>
              <div className="w-1/2 text-left">
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading ? 'Loading...' : userStats?.inactiveUsers?.toLocaleString()}
                </h3>
                <p className="font-semibold text-gray-600">Inactive Users</p>
              </div>
            </div>
          </div>

          <div className="border bg-white rounded-lg shadow-md">
            <div className="px-5 py-4 flex items-center justify-between border-b">
              <h3 className="text-xl font-bold text-gray-800">Inventory Details</h3>
              <span className="text-gray-600">Medicine Quantity</span>
            </div>
            <div className="px-5 py-6 flex">
              <div className="w-1/2 text-left">
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading ? 'Loading...' : inventoryData?.total_quantity?.toLocaleString()}
                </h3>
                <p className="font-semibold text-gray-600">Manufacturer</p>
              </div>
              <div className="w-1/2 text-left">
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading
                    ? 'Loading...'
                    : pharmData && pharmData.length > 0
                    ? pharmData[0].total_quantity.toLocaleString()
                    : 'N/A'}
                </h3>
                <p className="font-semibold text-gray-600">Pharmacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;