import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const MedicineGroups = () => {
    const [selectedCategory, setSelectedCategory] = useState('None');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dispatchedMedicines, setDispatchedMedicines] = useState([]);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [groups, setGroups] = useState([
        { id: 'group-1', name: 'Group 1', medicineCount: 10 },
        { id: 'group-2', name: 'Group 2', medicineCount: 5 },
    ]);

    // Handle Category Selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsDropdownOpen(false);
    };

    // Handle Search Input Change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Handle Dispatch Click
    const handleDispatchClick = (id) => {
        setDispatchedMedicines((prev) => [...prev, id]);
        toast.success('Medicine dispatched successfully!');
    };

    // Handle Add Group Click
    const handleAddGroupClick = () => {
        setIsOverlayOpen(true);
    };

    // Add New Group
    const handleAddNewGroup = () => {
        if (newGroupName.trim() !== '') {
            setGroups([...groups, { id: `group-${groups.length + 1}`, name: newGroupName, medicineCount: 0 }]);
            setIsOverlayOpen(false);
            setNewGroupName('');
            toast.success('Group added successfully!');
        } else {
            toast.error('Group name cannot be empty!');
        }
    };

    // Cancel Overlay
    const handleCancelOverlay = () => {
        setIsOverlayOpen(false);
    };

    return (
        <div className='w-full h-full bg-stone-200'>
            <div className='px-10 py-10'>
                <div className='flex justify-between items-center mb-5'>
                    <div>
                        <h1 className='text-2xl font-bold'>
                            <span>
                                <Link to='/inventory' className='hover:text-gray-400'>
                                    Inventory
                                </Link>{' '}
                                &gt; Medicine Groups
                            </span>
                        </h1>
                        <h3>List of medicines available for sales.</h3>
                    </div>
                    <div>
                        <button
                            onClick={handleAddGroupClick}
                            className='border px-4 py-2 bg-red-500 text-white border-red-500 rounded'
                        >
                            &#43; Add New Group
                        </button>
                    </div>
                </div>
                <div className='w-full'>
                    <div className='flex justify-between items-center mb-5'>
                        <div className='w-4/12 rounded-md overflow-hidden border border-gray-400'>
                            <input
                                type="text"
                                className='w-full px-2 py-1 outline-none bg-gray-200'
                                placeholder="Search by Medicine Name or ID."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    {/* Table */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white font-semibold'>
                            <thead>
                                <tr>
                                    <th className='px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Group Name
                                    </th>
                                    <th className='px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        No. of Medicine
                                    </th>
                                    <th className='px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((group) => (
                                    <tr key={group.id}>
                                        <td className='px-6 py-4 border-b border-gray-300 text-sm'>{group.name}</td>
                                        <td className='px-6 py-4 border-b border-gray-300 text-sm'>{group.medicineCount}</td>
                                        <td className='px-6 py-4 border-b border-gray-300 text-sm'>
                                            <Link 
                                                to={`/inventory/groupsmedicinelist/${group.id}`} 
                                                className='px-3 py-1 text-black rounded hover:text-blue-700'
                                            >
                                                View Full Details &gt;
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Overlay for Adding New Group */}
            {isOverlayOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-8 rounded-md w-96 relative'>
                        <button
                            onClick={handleCancelOverlay}
                            className='absolute top-2 right-2 text-gray-600 hover:text-gray-800'
                        >
                            <FiX size={20} />
                        </button>
                        <h2 className='text-xl font-semibold mb-4'>Add Medicine Group</h2>
                        <input
                            type="text"
                            className='w-full px-4 py-2 mb-4 border border-gray-300 rounded'
                            placeholder="Enter Group Name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <button
                            onClick={handleAddNewGroup}
                            className='w-full bg-red-500 text-white py-2 rounded hover:bg-red-600'
                        >
                            &#43; Add Group
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default MedicineGroups;
