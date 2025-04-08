import React, { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
  const [mcpId, setMcpId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMcpIdAndDashboard = async () => {
      try {
        const dashboardResponse = await api.get(`/mcp/67f122f1940c483d6fa3fccf/dashboard`);
        setDashboardData(dashboardResponse.data);
      } catch (error) {
        console.error("Error in fetch process:", error);
        setError("Failed to load dashboard. Please check the server.");
      }
    };

    fetchMcpIdAndDashboard();
  }, []);

  return (
    <div 
      style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#1a1a1a', // Dark background covering full screen
        color: '#ffffff',
        minHeight: '100vh', // Ensure it covers the full height
        width: '100%', // Ensure full width
        boxSizing: 'border-box' // Include padding in width calculation
      }}
    >
      <h2 style={{ 
        color: '#ffffff', 
        borderBottom: '2px solid #4a4a4a', 
        paddingBottom: '10px',
        marginLeft: '20px' // Align with content padding
      }}>
        MCP Dashboard
      </h2>
      
      {error ? (
        <p style={{ color: '#ff4444', fontWeight: 'bold', marginLeft: '20px' }}>{error}</p>
      ) : dashboardData ? (
        <div style={{ 
          backgroundColor: '#2d2d2d', 
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          margin: '20px' // Consistent margin around the content
        }}>
          {/* Wallet Balance Section */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#cccccc' }}>Wallet Balance</h3>
            <p style={{ 
              fontSize: '24px', 
              color: '#66d9ef', 
              fontWeight: 'bold' 
            }}>
              ${dashboardData.walletBalance?.toLocaleString() || 'N/A'}
            </p>
          </div>

          {/* Pickup Partners Section */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#cccccc' }}>Pickup Partners</h3>
            {Array.isArray(dashboardData.pickupPartners) && dashboardData.pickupPartners.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {dashboardData.pickupPartners.map((partner, index) => (
                  <li
                    key={partner.id || `partner-${index}`}
                    style={{
                      backgroundColor: '#3a3a3a',
                      padding: '15px',
                      marginBottom: '15px',
                      borderRadius: '5px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    <p><strong>Name:</strong> {partner.name || 'Unnamed'}</p>
                    <p><strong>Wallet Balance:</strong> ${partner.walletBalance?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Status:</strong> {partner.status ? 'Active' : 'Inactive'}</p>
                    <p><strong>Completed Orders:</strong> {partner.completedOrders || 0}</p>
                    <p><strong>Pending Orders:</strong> {partner.pendingOrders || 0}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pickup partners available.</p>
            )}
          </div>

          {/* Order Summary Section */}
          <div>
            <h3 style={{ color: '#cccccc' }}>Order Summary</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ 
                backgroundColor: '#265666', 
                padding: '15px', 
                borderRadius: '5px',
                flex: '1',
                minWidth: '150px',
                textAlign: 'center'
              }}>
                <p><strong>Completed:</strong> {dashboardData.completedOrders || 0}</p>
              </div>
              <div style={{ 
                backgroundColor: '#664926', 
                padding: '15px', 
                borderRadius: '5px',
                flex: '1',
                minWidth: '150px',
                textAlign: 'center'
              }}>
                <p><strong>Cancelled:</strong> {dashboardData.cancelledOrders || 0}</p>
              </div>
              <div style={{ 
                backgroundColor: '#565926', 
                padding: '15px', 
                borderRadius: '5px',
                flex: '1',
                minWidth: '150px',
                textAlign: 'center'
              }}>
                <p><strong>Pending:</strong> {dashboardData.pendingOrders || 0}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#888888', marginLeft: '20px' }}>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;