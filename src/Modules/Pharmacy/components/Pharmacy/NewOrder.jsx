import React, { useState, useEffect } from "react";

const OrdersTable = () => {
  const [inventory, setInventory] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    // Mock data for inventory and approved requests
    setInventory([
      {
        id: 1,
        name: "Medicine A",
        stock: 100,
        completedStatus: "Awaiting Offer",
        offerDetails: null,
      },
      {
        id: 2,
        name: "Medicine B",
        stock: 50,
        completedStatus: "Offered",
        offerDetails: {
          deliveryType: "Partial",
          message: "We can deliver 30 units out of 50.",
        },
      },
    ]);

    setApprovedRequests([
      { id: 4, name: "Medicine D", quantity: 30, approvalDate: "2024-12-01" },
      { id: 5, name: "Medicine E", quantity: 60, approvalDate: "2024-12-15" },
    ]);
  }, []);

  const handleViewOffer = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleAcceptOffer = () => {
    setOrderPlaced(true);
    setIsModalOpen(false);
    console.log("Offer Accepted for", selectedOrder.name);
  };

  const handleRejectOffer = () => {
    setOrderPlaced(false);
    setIsModalOpen(false);
    console.log("Offer Rejected for", selectedOrder.name);
  };

  const filteredInventory = inventory.filter(
    (item) => item.completedStatus !== "Accepted"
  );

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      {/* Title and Place Order Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Orders
          </h1>
          <p className="text-gray-600">List of Order Requests.</p>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600">
          Place Order
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {filteredInventory.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-gray-700">Medicine Name</th>
                  <th className="px-4 py-2 text-gray-700">Medicine ID</th>
                  <th className="px-4 py-2 text-gray-700">Quantity</th>
                  <th className="px-4 py-2 text-gray-700">Status</th>
                  <th className="px-4 py-2 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.stock}</td>
                    <td className="px-4 py-2">{item.completedStatus}</td>
                    <td className="px-4 py-2">
                      {item.completedStatus === "Offered" && (
                        <button
                          className="text-teal-500 hover:underline"
                          onClick={() => handleViewOffer(item)}
                        >
                          View Offer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No inventory records found.</p>
        )}
      </div>

      {/* Approved Requests Table */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Approved Requests
        </h2>
        <p className="text-gray-600 mb-6">
          List of approved medicine requests.
        </p>
        {approvedRequests.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-gray-700">Medicine Name</th>
                  <th className="px-4 py-2 text-gray-700">Quantity</th>
                  <th className="px-4 py-2 text-gray-700">Approval Date</th>
                </tr>
              </thead>
              <tbody>
                {approvedRequests.map((request, idx) => (
                  <tr
                    key={request.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2">{request.name}</td>
                    <td className="px-4 py-2">{request.quantity}</td>
                    <td className="px-4 py-2">{request.approvalDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No approved requests found.</p>
        )}
      </div>

      {/* Modal for Offer Details */}
      {selectedOrder && isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <h3 className="text-lg font-bold mb-4">Offer Details</h3>
            <p>
              <strong>Medicine Name:</strong> {selectedOrder.name}
            </p>
            <p>
              <strong>Delivery Type:</strong>{" "}
              {selectedOrder.offerDetails?.deliveryType || "N/A"}
            </p>
            <p>
              <strong>Message:</strong>{" "}
              {selectedOrder.offerDetails?.message || "No details available"}
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                onClick={handleAcceptOffer}
              >
                Accept Offer
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleRejectOffer}
              >
                Reject Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
