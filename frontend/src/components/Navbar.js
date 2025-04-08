import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-[#1e1e1e] text-white p-4 shadow-lg" style={{ width: '100%' }}>
      <div className="flex justify-center gap-8">
        <Link 
          to="/" 
          className="px-4 py-2 rounded-md hover:bg-[#333333] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
        >
          Dashboard
        </Link>
        <Link 
          to="/partners" 
          className="px-4 py-2 rounded-md hover:bg-[#333333] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
        >
          Pickup Partners
        </Link>
        <Link 
          to="/wallet" 
          className="px-4 py-2 rounded-md hover:bg-[#333333] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
        >
          Wallet
        </Link>
        <Link 
          to="/orders" 
          className="px-4 py-2 rounded-md hover:bg-[#333333] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
        >
          Orders
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;