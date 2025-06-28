import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import money from '../../assets/svgs/money.svg';
import medicbag from '../../assets/svgs/medicbag.svg';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import logo from '../../assets/Logo.png'; // Ensure you have a logo image

const Dashboard = () => {
  const [inventoryCount, setInventoryCount] = useState(0);
  const [transactionData, setTransactionData] = useState({ 
    totalQuotation: 0, 
    transactionCount: 0 
  });
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory count
        const inventoryResponse = await fetch('https://pharma-project-1.onrender.com/api/get-pharinventory', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!inventoryResponse.ok) throw new Error('Inventory fetch failed');
        const inventoryData = await inventoryResponse.json();
        setInventoryCount(inventoryData.count);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsInventoryLoading(false);
      }

      try {
        // Fetch transaction data
        const transactionResponse = await fetch('https://pharma-project-1.onrender.com/api/total-transactions', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!transactionResponse.ok) throw new Error('Transaction data fetch failed');
        const transactionData = await transactionResponse.json();
        
        setTransactionData({
          totalQuotation: transactionData.total_quotation,
          transactionCount: transactionData.transaction_count
        });
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsTransactionLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to handle PDF download
  const handleDownloadReport = async () => {
    // Show loading alert
    Swal.fire({
      title: 'Generating Report...',
      text: 'Please wait while we prepare your report.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yOffset = 50; // Initial Y position for content

      // Add Pharmachain Logo
      pdf.addImage(logo, 'PNG', 20, 10, 25, 25);

      // Pharmachain Header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Pharmachain', 65, 20);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Dashboard Report', 65, 28);

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

      // Add sections with better spacing
      addSection('Total Expenditure', `Amount: ${formatCurrency(transactionData.totalQuotation)}`);
      addSection('Medicines in Stock', `Count: ${inventoryCount}`);
      addSection('Transaction Summary', `Total Transactions Value: ${formatCurrency(transactionData.totalQuotation)}\nOrders Placed: ${transactionData.transactionCount}`);

      // Footer with Page Number and Watermark
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);

        // Add a watermark
        pdf.setFontSize(40);
        pdf.setTextColor(230, 230, 230); // Light gray watermark
        pdf.setFont('helvetica', 'bold');
        pdf.text('Pharmachain', pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' });
      }

      // Save the PDF
      pdf.save('Pharmachain_Dashboard_Report.pdf');

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Report Downloaded!',
        text: 'Your report has been successfully downloaded.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate the report. Please try again.',
      });
    }
  };

  return (
    <div className='bg-[#f4f5f7] w-full h-full'>
      <div className='bg-white px-10 py-6 shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h1 className='text-3xl font-semibold text-gray-800'>Dashboard</h1>
            <h3 className='text-gray-600'>A quick data overview of the Pharmaceutical process.</h3>
          </div>
          <div>
            <button
              className='border px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              onClick={handleDownloadReport}
            >
              Download Reports
            </button>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          {/* Revenue Card */}
          <a href='/reportsP'>
            <div className='bg-white border border-yellow-400 rounded-lg shadow-sm p-4 transition-transform transform hover:scale-105 hover:shadow-lg'>
              <div className='flex flex-col items-center'>
                <div className='bg-yellow-100 p-2 rounded-full mb-2'>
                  <img src={money} alt="Money Icon" className='w-8 h-8' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>
                  {isTransactionLoading ? (
                    <Skeleton width={100} height={30} />
                  ) : (
                    formatCurrency(transactionData.totalQuotation)
                  )}
                </h3>
                <p className='font-medium text-gray-600'>Total Expenditure</p>
              </div>
              <button className='w-full py-2 mt-4 bg-yellow-100 text-yellow-600 font-semibold rounded-b'>
                View Financial Report
              </button>
            </div>
          </a>

          {/* Medicines Available Card */}
          <a href='/inventoryP'>
            <div className='bg-white border border-blue-400 rounded-lg shadow-sm p-4 transition-transform transform hover:scale-105 hover:shadow-lg'>
              <div className='flex flex-col items-center'>
                <div className='bg-blue-100 p-2 rounded-full mb-2'>
                  <img src={medicbag} alt="Medicbag Icon" className='w-7 h-7' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>
                  {isInventoryLoading ? (
                    <Skeleton width={50} height={30} />
                  ) : (
                    inventoryCount
                  )}
                </h3>
                <p className='font-medium text-gray-600'>Medicines in stock</p>
              </div>
              <button className='w-full py-2 mt-4 bg-blue-100 text-blue-600 font-semibold rounded-b'>
                Visit Inventory
              </button>
            </div>
          </a>
        </div>
      </div>

      <div className='px-10 py-6 grid grid-cols-2 gap-6'>
        {/* Inventory Section */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-2xl font-semibold text-gray-900'>Inventory</h3>
            <a href='/inventoryP' className='text-blue-700 cursor-pointer'>Go to Inventory &gt;</a>
          </div>
          <div className='flex justify-between'>
            <div className='text-left'>
              <h3 className='text-3xl font-bold text-gray-800'>
                {isInventoryLoading ? (
                  <Skeleton width={80} height={40} />
                ) : (
                  inventoryCount
                )}
              </h3>
              <p className='text-lg text-gray-500'>Total no of Medicines</p>
            </div>
          </div>
        </div>

        {/* Transaction Summary Section */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-2xl font-semibold text-gray-900'>Transaction Summary</h3>
            <span className='text-gray-500'>Lifetime Total</span>
          </div>
          <div className='flex justify-between'>
            <div className='text-left'>
              <h3 className='text-3xl font-bold text-gray-800'>
                {isTransactionLoading ? (
                  <Skeleton width={100} height={40} />
                ) : (
                  formatCurrency(transactionData.totalQuotation)
                )}
              </h3>
              <p className='text-lg text-gray-500'>Total Transactions Value</p>
            </div>
            <div className='text-left'>
              <h3 className='text-3xl font-bold text-gray-800'>
                {isTransactionLoading ? (
                  <Skeleton width={50} height={40} />
                ) : (
                  transactionData.transactionCount
                )}
              </h3>
              <p className='text-lg text-gray-500'>Orders placed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;