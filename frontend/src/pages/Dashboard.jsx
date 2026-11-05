import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 👇 අලුතෙන් එකතු කරපු States (Popup එක සඳහා)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  // PDF එක ඩවුන්ලෝඩ් කරන ෆන්ක්ෂන් එක (Popup එකෙන් call වෙනවා)
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
      setIsModalOpen(false); // PDF එක ගත්තට පස්සේ Popup එක වහන්න
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
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage({ type: 'error', text: 'Status update කරන්න බැරි වුනා.' });
    } finally {
      setProcessingId(null);
    }
  };

  // Popup එක අරින්න
  const openContractModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
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
                        {new Date(booking.startDate).toLocaleDateString()} - <br />
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
                        {/* PDF බටන් එක දැන් Popup එක අරිනවා */}
                        <button
                          onClick={() => openContractModal(booking)}
                          disabled={processingId === booking._id}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold disabled:opacity-50 transition"
                        >
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
      </div>

      {/* =========================================
          👇 අලුතෙන් හදපු Generate Contract Popup UI 👇
          ========================================= */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1e1e1e] p-8 rounded-xl w-full max-w-lg border border-gray-700 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Generate Rental Contract</h2>

            {/* Details Box */}
            <div className="bg-[#131313] border border-gray-700 rounded-lg p-5 mb-6 text-sm">
              <div className="flex justify-between mb-3 border-b border-gray-800 pb-2">
                <span className="text-gray-400">Booking ID:</span>
                <span className="text-neon font-bold">{selectedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Customer:</span>
                {/* customerId එකේ name එක නැත්නම් 'N/A' පෙන්නන්න */}
                <span className="text-white">{selectedBooking.customerId?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Equipment:</span>
                <span className="text-white">{selectedBooking.equipmentId?.name}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Rental Period:</span>
                <span className="text-white">
                  {new Date(selectedBooking.startDate).toLocaleDateString()} - {new Date(selectedBooking.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-gray-800">
                <span className="text-gray-400 font-semibold">Total Amount:</span>
                <span className="text-neon font-bold text-lg">LKR {selectedBooking.totalFee}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={processingId === selectedBooking._id}
                className="w-full bg-[#43B062] text-black font-bold py-3 rounded-lg hover:bg-green-600 transition flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {processingId === selectedBooking._id ? 'Generating...' : '📄 Generate & Download PDF'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-transparent text-gray-400 py-2 rounded-lg hover:text-white hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;