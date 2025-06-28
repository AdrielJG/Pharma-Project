import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import medicbag from '../../assets/svgs/medicbag.svg'
import medicbaggreen from '../../assets/svgs/medicbaggreen.svg'

const Inventory = () => {
    const [inventoryCount, setInventoryCount] = useState(0); // State to store the inventory count
    
      // Fetch inventory count from the API
      useEffect(() => {
        const fetchInventoryCount = async () => {
          try {
            const response = await fetch('https://pharma-project-1.onrender.com/api/get-pharinventory', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Include cookies for session management
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch inventory data');
            }
    
            const data = await response.json();
            console.log(data)
            setInventoryCount(data.count); // Update the state with the fetched count
          } catch (error) {
            console.error('Error fetching inventory count:', error);
          }
        };
    
        fetchInventoryCount();
      }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className='w-full h-full bg-stone-200 '>
    <div className=' px-10 py-10'>
        <div className='flex justify-between items-center mb-5'>
            <div>
                <h1 className='text-2xl font-bold '>Inventory</h1>
                <h3>List of medicines available for sales.</h3>
            </div>
        </div>
        <div className='w-full flex gap-5 '>
        <Link to="medicinelist">
            <div className='bg-white flex flex-col items-center border-2 border-blue-400 rounded-lg w-64 overflow-hidden pt-5 gap-1'>
                <img src={medicbag} alt="" className='w-8 mb-1'/>
                <h3 className='text-2xl font-bold'>{inventoryCount}</h3>
                <p className='font-semibold leading-none mb-5'>Medicines Available</p>
                <div className='w-full bg-blue-200 text-center py-1'>
                    <p>
                        View Full List 
                    </p>
                </div>
            </div>
        </Link>
        </div>
    </div>
</div>
  )
}

export default Inventory