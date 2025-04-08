import React, { useEffect, useState } from 'react';
import api from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div 
      className="p-6 bg-[#1a1a1a] min-h-screen"
      style={{ color: '#ffffff' }}
    >
      <h1 
        className="text-2xl font-bold mb-6 border-b-2 pb-2"
        style={{ borderColor: '#4a4a4a', color: '#ffffff' }}
      >
        Orders
      </h1>
      <ul className="space-y-4">
        {orders.length > 0 ? (
          orders.map((o) => (
            <li
              key={o._id}
              className="bg-[#3a3a3a] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <p style={{ color: '#cccccc' }}>
                <strong>Order #:</strong> {o._id}
              </p>
              <p style={{ color: '#aaaaaa' }}>
                <strong>Status:</strong> {o.status}
              </p>
              <p style={{ color: '#aaaaaa' }}>
                <strong>Assigned to:</strong> {o.partnerId || 'Unassigned'}
              </p>
            </li>
          ))
        ) : (
          <li className="bg-[#3a3a3a] p-4 rounded-lg shadow-md text-center" style={{ color: '#888888' }}>
            No orders available.
          </li>
        )}
      </ul>
    </div>
  );
}

export default Orders;