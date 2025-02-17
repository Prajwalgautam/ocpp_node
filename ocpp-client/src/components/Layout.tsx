import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 ${isMenuOpen ? 'block' : 'hidden'} sm:block transition-all ease-in-out duration-300`}>
        <div className="p-4 flex items-center justify-between">
          <div className="text-lg font-semibold">My App</div>
          <div className="sm:hidden cursor-pointer" onClick={toggleMenu}>
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white"></div>
          </div>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">Charging Stations</Link>
            </li>
            <li>
              <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <main>{children}</main>
        
      </div>
      
    </div>
  );
};

export default Layout;
