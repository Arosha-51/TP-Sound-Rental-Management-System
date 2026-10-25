import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrackBooking = () => {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      // 👇 ඉන්පුට් එකේ # ලකුණ තියෙනවා නම් ඒක අයින් කරනවා
      const cleanBookingId = bookingId.replace('#', '');

      // API එකට යවනවා
      const response = await axios.get(`http://localhost:5000/api/bookings/track/${cleanBookingId}`);
      setBooking(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Booking not found. Please check your Booking ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg mt-10">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neon">Track My Booking</h2>
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
            ← Back to Home
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="flex-1 bg-dark border border-dark-border rounded p-3 text-white focus:outline-none focus:border-neon"
            placeholder="Enter your Booking ID (e.g., #TP-2026-001)"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-neon text-dark font-bold px-6 py-3 rounded hover:bg-green-500 transition"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-900 border border-red-500 text-red-200 rounded mb-6">
            {error}
          </div>
        )}

        {booking && (
          <div className="bg-gray-800 border-2 border-dark-border rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-600 pb-2">Booking Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div>
                <p className="text-gray-400 text-sm">Booking ID</p>
                <p className="text-white font-bold">{booking.bookingId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`px-3 py-1 rounded text-sm font-bold ${
                  booking.status === 'Approved' ? 'bg-green-600 text-white' : 
                  booking.status === 'Rejected' ? 'bg-red-600 text-white' : 
                  'bg-yellow-600 text-black'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Start Date</p>
                <p className="text-white">{new Date(booking.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">End Date</p>
                <p className="text-white">{new Date(booking.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Equipment</p>
                <p className="text-white">{booking.equipmentId?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Fee</p>
                <p className="text-neon font-bold">LKR {booking.totalFee}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackBooking;