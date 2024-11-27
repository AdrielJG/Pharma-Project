import React, { useState } from 'react';
import ReplyOverlay from './ReplyOverlay';

const Feedback = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Data for Feedbacks/Complaints
  const feedbacks = [
    { firstName: "John", lastName: "Doe", email: "john.doe@example.com", message: "I have an issue with my order." },
    { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", message: "The app is crashing frequently." },
    { firstName: "Emily", lastName: "Johnson", email: "emily.johnson@example.com", message: "Can I change my delivery address?" },
    { firstName: "Michael", lastName: "Brown", email: "michael.brown@example.com", message: "I am not receiving notifications." },
    { firstName: "Sarah", lastName: "Davis", email: "sarah.davis@example.com", message: "Great service, but delivery was late." },
  ];

  const chats = [
    // Example chat data
    { user: "Adriel Gaddam", message: "Sorry, I forgot to send the invoice." },
    { user: "K Everson", message: "Please click on the link and submit your address for reverse pickup." },
    // Add more chats as needed
  ];

  const handleReplyClick = (feedback) => {
    setSelectedFeedback(feedback);
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
    setSelectedFeedback(null);
  };

  return (
    <div className="p-10 bg-[#F7F8FA] h-screen overflow-y-auto">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-700">
          Feedbacks and Complaints
        </h1>
        <p className="text-sm text-gray-500">
          List of feedbacks and complaints submitted by users
        </p>
      </div>

      {/* Table of Feedbacks/Complaints */}
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-600 tracking-wider">
                First Name
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-600 tracking-wider">
                Last Name
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-600 tracking-wider">
                Email
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-600 tracking-wider">
                Message
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-600 tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{feedback.firstName}</td>
                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{feedback.lastName}</td>
                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{feedback.email}</td>
                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{feedback.message}</td>
                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleReplyClick(feedback)}
                  >
                    Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chat Overlay */}
      {selectedFeedback && (
        <ReplyOverlay 
          user={{
            name: `${selectedFeedback.firstName} ${selectedFeedback.lastName}`,
            email: selectedFeedback.email
          }}
          message={selectedFeedback.message}
          chats={chats}
          isOpen={isOverlayOpen}
          onClose={handleOverlayClose}
        />
      )}
    </div>
  );
};

export default Feedback;
