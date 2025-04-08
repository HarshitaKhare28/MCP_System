import React, { useEffect, useState } from 'react';
import api from '../api';

function Wallet({ mcpId = '67f122f1940c483d6fa3fccf' }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [error, setError] = useState(null);
  const [partners, setPartners] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get(`/api/wallet/67f122f1940c483d6fa3fccf`)
      .then((res) => {
        console.log('Wallet balance response:', res.data);
        setBalance(res.data.walletBalance || 0);
      })
      .catch((err) => {
        console.error('Error fetching wallet balance:', err);
        setError('Failed to load wallet balance. Check server or ID.');
      });

    api.get(`/api/mcp/${mcpId}/pickup-partners`)
      .then((res) => {
        console.log('Pickup partners response:', res.data);
        setPartners(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Error fetching pickup partners:', err);
        setError((prev) => prev || 'Failed to load pickup partners.');
      });

    api.get(`/api/mcp/${mcpId}/transactions`)
      .then((res) => {
        console.log('Transaction history response:', res.data);
        setTransactions(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Error fetching transactions:', err);
        setError((prev) => prev || 'Failed to load transaction history.');
      });
  }, [mcpId]);

  const transferFunds = () => {
    if (!amount || !partnerId) {
      setError('Please enter both amount and partner ID');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    api.post(`/api/mcp/${mcpId}/transfer-funds/${partnerId}`, { amount })
      .then((res) => {
        console.log('Transfer response:', res.data);
        setBalance(res.data.mcpBalance);
        setAmount('');
        setPartnerId('');
        setError(null);

        api.get(`/api/mcp/${mcpId}/pickup-partners`).then((res) =>
          setPartners(Array.isArray(res.data) ? res.data : [])
        );
        api.get(`/api/mcp/${mcpId}/transactions`).then((res) =>
          setTransactions(Array.isArray(res.data) ? res.data : [])
        );
      })
      .catch((err) => {
        console.error('Error transferring funds:', err);
        setError(err.response?.data?.error || 'Transfer failed');
      });
  };

  return (
    <div 
      className="p-6 bg-[#1a1a1a] min-h-screen"
      style={{ color: '#ffffff' }}
    >
      <h1 
        className="text-2xl font-bold mb-6 border-b-2 pb-2"
        style={{ borderColor: '#4a4a4a', color: '#ffffff' }}
      >
        Wallet
      </h1>

      {/* Wallet Balance */}
      <p 
        className="text-lg mb-4"
        style={{ color: '#66d9ef' }} // Cyan for emphasis, matching dashboard
      >
        Wallet Balance: ₹{balance.toLocaleString()}
      </p>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Transfer Section */}
      <div className="mb-6 flex items-center gap-4">
        <input
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          placeholder="Partner ID"
          className="w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 bg-[#2d2d2d] text-white border-gray-600 focus:ring-[#66d9ef]"
          style={{ borderColor: '#4a4a4a' }}
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          min="0"
          className="w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 bg-[#2d2d2d] text-white border-gray-600 focus:ring-[#66d9ef]"
          style={{ borderColor: '#4a4a4a' }}
        />
        <button
          onClick={transferFunds}
          className="bg-[#265666] text-white p-3 rounded-lg hover:bg-[#2e6a80] focus:outline-none focus:ring-2 focus:ring-[#66d9ef] disabled:bg-[#4a6c7a] disabled:cursor-not-allowed transition duration-200"
          disabled={!amount || !partnerId || isNaN(amount) || amount <= 0}
        >
          Transfer
        </button>
      </div>

      {/* Pickup Partners Wallets */}
      <div className="mb-6">
        <h2 
          className="text-xl font-semibold mb-4"
          style={{ color: '#cccccc' }}
        >
          Pickup Partners Wallets
        </h2>
        {partners.length > 0 ? (
          <ul className="space-y-4">
            {partners.map((partner) => (
              <li
                key={partner._id}
                className="bg-[#3a3a3a] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <p style={{ color: '#cccccc' }}><strong>Name:</strong> {partner.name || 'Unnamed'}</p>
                <p style={{ color: '#aaaaaa' }}><strong>ID:</strong> {partner._id}</p>
                <p style={{ color: '#aaaaaa' }}><strong>Wallet Balance:</strong> ₹{partner.walletBalance?.toLocaleString() || 'N/A'}</p>
                <p style={{ color: '#aaaaaa' }}><strong>Status:</strong> {partner.status || 'N/A'}</p>
                <p style={{ color: '#aaaaaa' }}><strong>Completed Orders:</strong> {partner.completedOrders || 0}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4 bg-[#3a3a3a] rounded-lg shadow-md" style={{ color: '#888888' }}>
            No pickup partners available.
          </p>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <h2 
          className="text-xl font-semibold mb-4"
          style={{ color: '#cccccc' }}
        >
          Transaction History
        </h2>
        {transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => (
              <li
                key={index} // Use index as a fallback; replace with transaction ID if available
                className="bg-[#3a3a3a] p-4 rounded-lg shadow-md"
              >
                <p style={{ color: '#cccccc' }}><strong>Date:</strong> {new Date().toLocaleString()}</p>
                <p style={{ color: '#aaaaaa' }}><strong>Partner ID:</strong> {transaction.partnerId || 'N/A'}</p>
                <p style={{ color: '#aaaaaa' }}><strong>Amount:</strong> ₹{transaction.amount?.toLocaleString() || 'N/A'}</p>
                <p style={{ color: '#aaaaaa' }}><strong>Type:</strong> Transfer</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4 bg-[#3a3a3a] rounded-lg shadow-md" style={{ color: '#888888' }}>
            No transactions recorded.
          </p>
        )}
      </div>
    </div>
  );
}

export default Wallet;