import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // බටන් ඔබද්දී Loading පෙන්නන්න
  const [message, setMessage] = useState({ type: '', text: '' }); // Success/Error පෙන්නන්න

  // (මේ stats ටික දැනට hardcode කරලා තියෙන්නේ. Analytics වලදී අපි මේක API එකට connect කරමු)
  const stats = [
    { title: 'Active Rentals', value: '12', color: 'neon', icon: '📊' },
    { title: 'Pending Approvals', value: bookings.length.toString(), color: 'yellow', icon: '⏳' },
    { title: 'Overdue Returns', value: '2', color: 'red', icon: '⚠️' },
    { title: 'Monthly Revenue', value: 'LKR 185,000', color: 'neon', icon: '💰' },
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bookings');
      // Pending ඒවා විතරක් අපිට ඕන නිසා filter කරගන්නවා
      const pendingBookings = response.data.filter(b => b.status === 'Pending');
      setBookings(pendingBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage({ type: 'error', text: 'Bookings load කරගන්න බැරි වුනා.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // PDF එක ඩවුන්ලෝඩ් කරන ෆන්ක්ෂන් එක
  const handleDownloadPDF = async (id, bookingId) => {
    try {
      setProcessingId(id);
      const response = await axios.get(`http://localhost:5000/api/bookings/${id}/contract`, {
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
    } finally {
      setProcessingId(null);
    }
  };

  // Approve හෝ Reject කරන ෆන්ක්ෂන් එක
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setProcessingId(id);
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus });
      setMessage({ type: 'success', text: `Booking ${newStatus} successfully!` });
      
      // Update උන එක ලිස්ට් එකෙන් අයින් කරනවා (Refresh නැතුව)
      setBookings(bookings.filter(b => b._id !== id));
      
      // තත්පර 3කින් Message එක මකන්න
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage({ type: 'error', text: 'Status update කරන්න බැරි වුනා.' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* ===== HEADER ===== */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TP Sound Logo" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-neon transition">
              ← Back to Catalog
            </button>
            <button
              onClick={() => navigate('/admin/check-in')}
              className="bg-neon text-dark font-bold px-4 py-2 rounded hover:bg-green-500 transition"
            >
              Quick Check-In
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h2>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg font-semibold ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {message.text}
          </div>
        )}

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Pending Booking Requests</h3>
            <button onClick={fetchBookings} className="text-sm text-gray-400 hover:text-white transition">
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-white">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400">No pending requests right now.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="pb-3 text-gray-400 text-sm font-semibold">Booking ID</th>
                    <th className="pb-3 text-gray-400 text-sm font-semibold">Customer</th>
                    <th className="pb-3 text-gray-400 text-sm font-semibold">Equipment</th>
                    <th className="pb-3 text-gray-400 text-sm font-semibold">Dates</th>
                    <th className="pb-3 text-gray-400 text-sm font-semibold">Total</th>
                    <th className="pb-3 text-gray-400 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-dark-border hover:bg-[#252525] transition">
                      <td className="py-4 text-white font-medium">{booking.bookingId}</td>
                      <td className="py-4 text-white">{booking.customerId?.name || 'N/A'}</td>
                      <td className="py-4 text-gray-400">{booking.equipmentId?.name || 'N/A'}</td>
                      <td className="py-4 text-gray-400 text-sm">
                        {new Date(booking.startDate).toLocaleDateString()} - <br/>
                        {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-neon font-bold">LKR {booking.totalFee}</td>

                      <td className="py-4 flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'Approved')}
                          disabled={processingId === booking._id}
                          className="bg-neon text-dark px-3 py-1.5 rounded text-sm font-bold hover:bg-green-500 disabled:opacity-50 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                          disabled={processingId === booking._id}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-semibold disabled:opacity-50 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(booking._id, booking.bookingId)}
                          disabled={processingId === booking._id}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold disabled:opacity-50 transition"
                        >
                          {processingId === booking._id ? 'Wait...' : 'PDF'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;