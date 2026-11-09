import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';

const CheckIn = () => {
  const navigate = useNavigate();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [damageCharges, setDamageCharges] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // 1. Search Booking Function (TPS-184)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setSearching(true);
    setError('');
    setSelectedBooking(null);
    setResult(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/search?query=${searchQuery}`);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setError('No active bookings found for this query.');
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  // 2. Handle Select Booking
  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setSearchResults([]); // Hide search list
    setDamageCharges('');
    setResult(null);
  };

  // 3. Process Check-In (TPS-91, TPS-190)
  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.put(`http://localhost:5000/api/bookings/${selectedBooking._id}/check-in`, {
        damageCharges: Number(damageCharges) || 0
      });
      
      setResult(response.data.data);
      setSelectedBooking(null); // Reset after successful check-in
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Check-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* HEADER */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TP Sound Logo" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>
          <button onClick={() => navigate('/admin')} className="text-neon hover:underline font-semibold">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Quick Check-In</h2>

        {/* Search Bar */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-lg mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-dark border border-dark-border rounded p-3 text-white focus:outline-none focus:border-neon"
              placeholder="Search by Booking ID (e.g., #TP-2026-001) or Phone Number"
              required
            />
            <button 
              type="submit" 
              disabled={searching}
              className="bg-neon text-dark font-bold px-6 py-3 rounded hover:bg-green-500 transition disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && !selectedBooking && (
            <div className="mt-4 p-4 bg-red-900 border border-red-500 text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Search Results List */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-400 mb-3 text-sm font-semibold uppercase tracking-wider">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map((booking) => (
                  <div key={booking._id} className="bg-dark border border-dark-border p-4 rounded-lg flex justify-between items-center hover:border-neon transition cursor-pointer" onClick={() => handleSelectBooking(booking)}>
                    <div>
                      <p className="text-white font-bold text-lg">{booking.bookingId}</p>
                      <p className="text-gray-400 text-sm">{booking.customerId?.name} • {booking.equipmentId?.name}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-blue-500">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Check-In Form (Shows only when a booking is selected) */}
        {selectedBooking && (
          <div className="bg-dark-card border-2 border-neon rounded-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3">Processing Return for: <span className="text-neon">{selectedBooking.bookingId}</span></h3>
            
            <div className="bg-[#131313] rounded-lg p-4 mb-6 text-sm space-y-2">
              <p className="flex justify-between text-gray-300"><span>Customer:</span> <span className="text-white font-medium">{selectedBooking.customerId?.name || 'N/A'}</span></p>
              <p className="flex justify-between text-gray-300"><span>Equipment:</span> <span className="text-white font-medium">{selectedBooking.equipmentId?.name}</span></p>
              <p className="flex justify-between text-gray-300"><span>Due Date:</span> <span className="text-red-400 font-bold">{new Date(selectedBooking.endDate).toLocaleDateString()}</span></p>
              <p className="flex justify-between text-gray-300"><span>Daily Rate:</span> <span className="text-white font-medium">LKR {selectedBooking.equipmentId?.dailyRate}</span></p>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Damage Charges (LKR)</label>
                <input 
                  type="number" 
                  value={damageCharges}
                  onChange={(e) => setDamageCharges(e.target.value)}
                  className="w-full bg-dark border border-dark-border rounded p-3 text-white focus:outline-none focus:border-neon"
                  placeholder="Enter 0 if no damage"
                  min="0"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-neon text-dark font-bold py-3 rounded hover:bg-green-500 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Process Return & Calculate Refund'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gray-600 text-white font-bold py-3 px-6 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Final Result (Penalty Calculation Display - TPS-190) */}
        {result && (
          <div className="mt-8 p-6 bg-[#0a0a0a] border-2 border-neon rounded-xl shadow-[0_0_15px_rgba(67,176,98,0.3)]">
            <h3 className="text-neon font-bold text-2xl mb-6 text-center border-b border-gray-800 pb-4">Check-In Successful!</h3>
            
            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center bg-dark p-3 rounded">
                <span className="text-gray-300">Overdue Days:</span> 
                <span className="text-red-400 font-bold text-xl">{result.overdueDays} Days</span>
              </div>
              <div className="flex justify-between items-center bg-dark p-3 rounded">
                <span className="text-gray-300">Late Fee:</span> 
                <span className="text-red-400 font-bold text-xl">LKR {result.lateFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-dark p-3 rounded">
                <span className="text-gray-300">Damage Charges:</span> 
                <span className="text-red-400 font-bold text-xl">LKR {result.damage.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-lg border border-neon mt-6">
                <span className="text-white font-bold text-xl">Net Refund:</span> 
                <span className="text-neon font-bold text-3xl">LKR {result.netRefund.toLocaleString()}</span>
              </div>
              
              <p className="text-center text-gray-400 mt-4 text-sm">
                Booking Status Updated To: <span className="text-green-400 font-bold">{result.status}</span>
              </p>
            </div>
            
            <button 
              onClick={() => setResult(null)}
              className="w-full mt-6 bg-neon text-dark font-bold py-3 rounded hover:bg-green-500 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;