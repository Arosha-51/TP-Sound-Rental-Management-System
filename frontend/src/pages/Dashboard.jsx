import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();

  // 1. Database එකෙන් එන Bookings ටික තියාගන්න State එක
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // (මේ stats ටික දැනට hardcode කරලා තියෙන්නේ. පස්සේ මේවා API එකෙන් ගන්න පුළුවන්)
  const stats = [
    { title: 'Active Rentals', value: '12', color: 'neon', icon: '📊' },
    { title: 'Pending Approvals', value: '4', color: 'yellow', icon: '⏳' },
    { title: 'Overdue Returns', value: '2', color: 'red', icon: '⚠️' },
    { title: 'Monthly Revenue', value: 'LKR 185,000', color: 'neon', icon: '💰' },
  ];

  // 2. පේජ් එක ලෝඩ් වෙද්දී API එකෙන් ඩේටා ගන්නවා
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        // Pending ඒවා විතරක් අපිට ඕන නිසා filter කරගන්නවා
        const pendingBookings = response.data.filter(b => b.status === 'Pending');
        setBookings(pendingBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // 3. PDF එක ඩවුන්ලෝඩ් කරන ෆන්ක්ෂන් එක
  const handleDownloadPDF = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}/contract`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Contract-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('PDF එක ගන්න බැරි වුනා. ආයෙත් ට්‍රයි කරන්න.');
    }
  };

  // 4. Approve හෝ Reject කරන ෆන්ක්ෂන් එක
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: newStatus });
      alert(`Booking ${newStatus} successfully!`);
      // Update උන එක ලිස්ට් එකෙන් අයින් කරනවා (Refresh නැතුව)
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* ===== HEADER WITH LOGO ===== */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TP Sound Logo" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-neon transition">
            ← Back to Catalog
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-neon">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Pending Requests Table */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Pending Booking Requests</h3>
          
          {loading ? (
            <p className="text-white">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400">No pending requests right now.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border text-left">
                  <th className="pb-3 text-gray-400 text-sm">Booking ID</th>
                  <th className="pb-3 text-gray-400 text-sm">Customer</th>
                  <th className="pb-3 text-gray-400 text-sm">Equipment</th>
                  <th className="pb-3 text-gray-400 text-sm">Dates</th>
                  <th className="pb-3 text-gray-400 text-sm">Total</th>
                  <th className="pb-3 text-gray-400 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Database එකේ තියෙන හැම Booking එකක්ම මෙතනින් Loop වෙනවා */}
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-dark-border">
                    <td className="py-3 text-white">{booking.bookingId}</td>
                    <td className="py-3 text-white">{booking.customerId?.name || 'N/A'}</td>
                    <td className="py-3 text-gray-400">{booking.equipmentId?.name || 'N/A'}</td>
                    <td className="py-3 text-gray-400">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-neon">LKR {booking.totalFee}</td>
                    
                    {/* මෙන්න මේ <td> එක ඇතුළේ තමයි බොත්තම් ඔක්කොම තියෙන්න ඕනේ */}
                    <td className="py-3 flex gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(booking._id, 'Approved')}
                        className="bg-neon text-dark px-3 py-1 rounded text-sm font-bold"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(booking._id)} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;