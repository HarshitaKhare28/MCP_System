import React, { useEffect, useState } from 'react';
import api from '../api';

function Partners({ mcpId = '67f122f1940c483d6fa3fccf' }) {
  const [partners, setPartners] = useState([]);
  const [name, setName] = useState('');

  const loadPartners = () => {
    api.get(`/mcp/${mcpId}/pickup-partners`)
      .then((res) => {
        console.log('Partners data:', res.data); // Debug log
        setPartners(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error('Error loading partners:', err));
  };

  useEffect(() => {
    loadPartners();
  }, [mcpId]);

  const addPartner = () => {
    if (!name.trim()) return;
    api.post(`/mcp/${mcpId}/add-partner`, { name })
      .then(() => {
        setName('');
        loadPartners();
      })
      .catch((err) => console.error('Error adding partner:', err));
  };

  const deletePartner = (id) => {
    api.delete(`/pickup-partners/${id}`)
      .then(loadPartners)
      .catch((err) => console.error('Error deleting partner:', err));
  };

  return (
    <div 
      className="p-6 bg-[#1a1a1a] min-h-screen"
      style={{ color: '#ffffff' }} // Default text color for dark mode
    >
      <h1 
        className="text-2xl font-bold mb-6 border-b-2 pb-2"
        style={{ borderColor: '#4a4a4a', color: '#ffffff' }}
      >
        Pickup Partners
      </h1>
      
      {/* Add Partner Section */}
      <div className="mb-6 flex items-center gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Partner Name"
          className="w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 bg-[#2d2d2d] text-white border-gray-600 focus:ring-[#66d9ef]"
          style={{ borderColor: '#4a4a4a' }}
        />
        <button
          onClick={addPartner}
          className="bg-[#265666] text-white p-3 rounded-lg hover:bg-[#2e6a80] focus:outline-none focus:ring-2 focus:ring-[#66d9ef] disabled:bg-[#4a6c7a] disabled:cursor-not-allowed transition duration-200"
          disabled={!name.trim()}
        >
          Add Partner
        </button>
      </div>

      {/* Partners List */}
      <ul className="space-y-4">
        {partners.length > 0 ? (
          partners.map((partner) => (
            <li
              key={partner._id || `partner-${partner.name}-${Date.now()}`}
              className="bg-[#3a3a3a] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p style={{ color: '#cccccc' }}><strong>Name:</strong> {partner.name || 'Unnamed'}</p>
                  <p style={{ color: '#aaaaaa' }}><strong>ID:</strong> {partner._id || 'N/A'}</p>
                  <p style={{ color: '#aaaaaa' }}><strong>Wallet Balance:</strong> ${partner.walletBalance?.toLocaleString() || 'N/A'}</p>
                  <p style={{ color: '#aaaaaa' }}><strong>Status:</strong> {partner.status || 'N/A'}</p>
                  <p style={{ color: '#aaaaaa' }}><strong>Completed Orders:</strong> {partner.completedOrders || 0}</p>
                </div>
                <div className="flex justify-end items-start">
                  <button
                    onClick={() => deletePartner(partner._id)}
                    className="text-red-400 hover:text-red-600 font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center py-4 bg-[#3a3a3a] rounded-lg shadow-md" style={{ color: '#888888' }}>
            No partners available.
          </p>
        )}
      </ul>
    </div>
  );
}

export default Partners;