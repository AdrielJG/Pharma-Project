import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import medicbag from '../assets/svgs/medicbag.svg';
import medicbaggreen from '../assets/svgs/medicbaggreen.svg';

const Inventory = () => {
    const [inventoryCount, setInventoryCount] = useState(null); // State to store the inventory count
    const [loading, setLoading] = useState(true); // State to manage loading state

    // Fetch inventory count from the API
    useEffect(() => {
        const fetchInventoryCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/get-inventory', {
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
                console.log(data);
                setInventoryCount(data.count); // Update the state with the fetched count
            } catch (error) {
                console.error('Error fetching inventory count:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchInventoryCount();
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className='w-full h-full bg-stone-200 '>
            <div className='px-10 py-10'>
                <div className='flex justify-between items-center mb-5'>
                    <div>
                        <h1 className='text-2xl font-bold '>Inventory</h1>
                        <h3>List of medicines available for sales.</h3>
                    </div>
                    <Link to="medicinelist/addmedicine">
                        <div>
                            <button className='border px-4 py-2 bg-red-500 text-white border-red-500 rounded'>
                                &#43; Add New Item
                            </button>
                        </div>
                    </Link>
                </div>
                <div className='w-full flex gap-5 '>
                    <Link to="medicinelist">
                        <div className='bg-white flex flex-col items-center border-2 border-blue-400 rounded-lg w-64 overflow-hidden pt-5 gap-1'>
                            <img src={medicbag} alt="" className='w-8 mb-1' />
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-8 w-16 bg-gray-300 rounded mb-1"></div>
                                </div>
                            ) : (
                                <>
                                    <h3 className='text-2xl font-bold'>{inventoryCount}</h3>
                                </>
                            )}
                            <p className='font-semibold leading-none mb-5'>Medicines Available</p>
                            <div className='w-full bg-blue-200 text-center py-1'>
                                <p>View Full List</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Inventory;