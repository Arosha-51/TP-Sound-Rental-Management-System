import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiRefreshCw, FiDownload, FiCheck, FiX } from 'react-icons/fi';

function Dashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Popup සඳහා
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Upcoming Returns සඳහා
  const [upcomingReturns, setUpcomingReturns] = useState([]);
  
  // Stats සඳහා
  const [statsData, setStatsData] = useState({
    activeRentals: 0,
    pendingApprovals: 0,
    overdueReturns: 0,
    totalRevenue: 0
  });

  const stats = [
    { title: 'Active Rentals', value: statsData.activeRentals.toString(), color: 'text-[#43B062]', icon: '📊' },
    { title: 'Pending Approvals', value: statsData.pendingApprovals.toString(), color: 'text-yellow-400', icon: '⏳' },
    { title: 'Overdue Returns', value: statsData.overdueReturns.toString(), color: 'text-red-400', icon: '⚠️' },
    { title: 'Monthly Revenue', value: `LKR ${statsData.totalRevenue.toLocaleString()}`, color: 'text-[#43B062]', icon: '💰' },
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bookings');
      const pendingBookings = response.data.filter(b => b.status === 'Pending');
      setBookings(pendingBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage({ type: 'error', text: 'Bookings load කරගන්න බැරි වුනා.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/stats/dashboard');
      setStatsData(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUpcomingReturns = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/stats/upcoming-returns');
      setUpcomingReturns(res.data);
    } catch (error) {
      console.error("Error fetching upcoming returns:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
    fetchUpcomingReturns();
  }, []);

  const handleDownloadPDF = async () => {
    if (!selectedBooking) return;
    try {
      setProcessingId(selectedBooking._id);
      const response = await axios.get(`http://localhost:5000/api/bookings/${selectedBooking._id}/contract`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Contract-${selectedBooking.bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('PDF එක ගන්න බැරි වුනා. ආයෙත් ට්‍රයි කරන්න.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setProcessingId(id);
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus });
      setMessage({ type: 'success', text: `Booking ${newStatus} successfully!` });
      setBookings(bookings.filter(b => b._id !== id));
      fetchStats(); 
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage({ type: 'error', text: 'Status update කරන්න බැරි වුනා.' });
    } finally {
      setProcessingId(null);
    }
  };

  const openContractModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="text-white">
      {/* Messages */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg font-semibold ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
              <span className="text-xl opacity-80">{stat.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Pending Requests */}
        <div className="lg:col-span-2 bg-[#131313] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Pending Booking Requests</h3>
            <button onClick={fetchBookings} className="text-sm text-gray-400 hover:text-[#43B062] transition flex items-center gap-1">
              <FiRefreshCw /> Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No pending requests right now.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-xs uppercase tracking-wider text-gray-500">
                    <th className="pb-3 font-medium">Customer Name</th>
                    <th className="pb-3 font-medium">Item Selected</th>
                    <th className="pb-3 font-medium">Dates</th>
                    <th className="pb-3 font-medium">Total Fee</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition">
                      <td className="py-4 text-white font-medium">{booking.customerId?.name || 'N/A'}</td>
                      <td className="py-4 text-gray-400">{booking.equipmentId?.name || 'N/A'}</td>
                      <td className="py-4 text-gray-400 text-sm">
                        {new Date(booking.startDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})} - {new Date(booking.endDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})}
                      </td>
                      <td className="py-4 text-[#43B062] font-bold">LKR {booking.totalFee.toLocaleString()}</td>
                      <td className="py-4 flex gap-2">
                        <button onClick={() => handleStatusUpdate(booking._id, 'Approved')} disabled={processingId === booking._id} className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500/20 disabled:opacity-50 transition">
                          <FiCheck /> Approve
                        </button>
                        <button onClick={() => handleStatusUpdate(booking._id, 'Rejected')} disabled={processingId === booking._id} className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500/20 disabled:opacity-50 transition">
                          <FiX /> Reject
                        </button>
                        <button onClick={() => openContractModal(booking)} disabled={processingId === booking._id} className="bg-[#2a2a2a] text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#333] transition">
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side - Quick Check-In & Upcoming Returns */}
        <div className="space-y-6">
          <div className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Check-In</h3>
            <p className="text-sm text-gray-400 mb-4">Process equipment returns and calculate final settlements.</p>
            <button onClick={() => navigate('/admin/check-in')} className="w-full bg-[#2a2a2a] text-[#43B062] font-bold py-3 rounded-lg hover:bg-[#333] transition border border-[#43B062]/30">
              Go to Check-In Portal →
            </button>
          </div>

          <div className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Upcoming Returns (Next 5)</h3>
            {upcomingReturns.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming returns.</p>
            ) : (
              <div className="space-y-3">
                {upcomingReturns.map((booking) => (
                  <div key={booking._id} className="flex justify-between items-center p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <div>
                      <p className="text-white text-sm font-semibold">{booking.customerId?.name || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">{booking.equipmentId?.name}</p>
                    </div>
                    <p className="text-red-400 text-xs font-bold">{new Date(booking.endDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generate Contract Popup UI */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1e1e1e] p-8 rounded-xl w-full max-w-lg border border-[#2a2a2a] shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Generate Rental Contract</h2>
            <div className="bg-[#131313] border border-[#2a2a2a] rounded-lg p-5 mb-6 text-sm">
              <div className="flex justify-between mb-3 border-b border-[#2a2a2a] pb-2">
                <span className="text-gray-400">Booking ID:</span>
                <span className="text-[#43B062] font-bold">{selectedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Customer:</span>
                <span className="text-white">{selectedBooking.customerId?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Equipment:</span>
                <span className="text-white">{selectedBooking.equipmentId?.name}</span>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-[#2a2a2a]">
                <span className="text-gray-400 font-semibold">Total Amount:</span>
                <span className="text-[#43B062] font-bold text-lg">LKR {selectedBooking.totalFee.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleDownloadPDF} disabled={processingId === selectedBooking._id} className="w-full bg-[#43B062] text-black font-bold py-3 rounded-lg hover:bg-green-500 transition flex justify-center items-center gap-2 disabled:opacity-50">
              {processingId === selectedBooking._id ? 'Generating...' : <><FiDownload /> Generate & Download PDF</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;