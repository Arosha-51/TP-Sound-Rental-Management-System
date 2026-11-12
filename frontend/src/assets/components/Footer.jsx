import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiBox, FiCalendar, FiRefreshCw, 
  FiBarChart2, FiUsers, FiLogOut, FiBell 
} from 'react-icons/fi';
import logo from '../assets/Logo.png'; // ඔයාගේ ලෝගෝ එකේ පාත් එක හරිද කියලා බලන්න

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <FiBox size={20} /> },
    { name: 'Booking Requests', path: '/admin/bookings', icon: <FiCalendar size={20} /> },
    { name: 'Check-In / Returns', path: '/admin/check-in', icon: <FiRefreshCw size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <FiUsers size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FiBarChart2 size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden font-sans">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#131313] border-r border-[#2a2a2a] flex flex-col">
        {/* Logo Area */}
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-[#43B062] font-bold text-lg leading-tight">TP Sound &</h1>
            <p className="text-gray-500 text-xs">Musical Gear Rentals</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#43B062] text-black font-bold shadow-[0_0_15px_rgba(67,176,98,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1e1e1e]'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <button
            onClick={() => navigate('/')} // මේක පස්සේ Logout API එකට connect කරන්න පුළුවන්
            className="flex items-center gap-4 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <FiLogOut size={20} />
            <span className="text-sm font-semibold">Log out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Bar */}
        <header className="h-16 bg-[#131313] border-b border-[#2a2a2a] flex items-center justify-between px-8">
          {/* Breadcrumb / Title */}
          <div className="text-gray-300 font-medium">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Admin Portal'}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition relative">
              <FiBell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-[#2a2a2a] pl-6">
              <div className="w-9 h-9 bg-[#43B062] rounded-full flex items-center justify-center text-black font-bold">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-500">Proprietor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content (Dashboard, Inventory etc. will load here) */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0f0f0f]">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;