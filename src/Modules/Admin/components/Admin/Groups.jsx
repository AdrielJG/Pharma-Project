import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface'; // Import your ChatInterface component

const Groups = () => {
  // Initial groups data
  const [groups, setGroups] = useState([
    {
      name: 'Group I',
      members: 5,
      memberImages: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },
    {
      name: 'Group II',
      members: 3,
      memberImages: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },
  ]);

  // Users that can be invited to a group
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  // Fetch verified users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.verified_users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);
  
  // Handle opening and closing the modals
  const openCreateGroupModal = () => setIsCreateGroupModalOpen(true);
  const closeCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false);
    setGroupName('');
    setSelectedUsers([]);
  };

  const openModal = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  // Handle group creation
  const handleCreateGroup = () => {
    const newGroup = {
      name: groupName,
      members: selectedUsers.length,
      memberImages: selectedUsers.map((user) => user.image),
    };
    setGroups([...groups, newGroup]);
    closeCreateGroupModal();
  };

  // Handle user selection for invitation
  const handleUserSelect = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  return (
    <div className="p-10 bg-[#F7F8FA] h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-700">Groups</h1>
        <button
          onClick={openCreateGroupModal}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          + Create Group
        </button>
      </div>

      {/* Groups List */}
      <div className="bg-white shadow-md rounded">
        {groups.map((group, index) => (
          <div
            key={index}
            className="p-4 flex justify-between items-center border-b border-gray-200 cursor-pointer"
            onClick={() => openModal(group)}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{group.name}</h2>
              <p className="text-sm text-gray-500">Members: {group.members}</p>
            </div>
            <div className="flex -space-x-2">
              {group.memberImages.slice(0, 5).map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src={image}
                  alt={`Member ${imgIndex + 1}`}
                />
              ))}
              {group.memberImages.length > 5 && (
                <span className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 text-xs flex items-center justify-center">
                  +{group.memberImages.length - 5}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl mx-auto p-6 relative shadow-lg rounded">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeCreateGroupModal}
            >
              &times; {/* Close button */}
            </button>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Create New Group</h2>

            {/* Group Name Input */}
            <div className="mb-4">
              <label className="text-gray-600 text-sm font-medium">Group Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>

            {/* User List for Invitations */}
            <div className="mb-4">
              <label className="text-gray-600 text-sm font-medium">Invite Users</label>
              <div className="overflow-y-auto max-h-60 mt-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center p-2 cursor-pointer ${
                      selectedUsers.includes(user) ? 'bg-blue-100' : 'bg-white'
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateGroup}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Details Modal */}
      {isModalOpen && selectedGroup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full h-full max-w-4xl mx-auto p-6 relative shadow-lg rounded">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times; {/* Close button */}
            </button>
            {/* Render the ChatInterface component as an overlay */}
            <ChatInterface group={selectedGroup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
