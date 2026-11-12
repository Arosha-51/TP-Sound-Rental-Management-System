import React, { useState } from 'react';
import axios from 'axios';
import { FiSearch, FiCheckCircle } from 'react-icons/fi';

const CheckIn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [damageCharges, setDamageCharges] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setSearching(true); setError(''); setSelectedBooking(null); setResult(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/search?query=${searchQuery}`);
      setSearchResults(response.data);
      if (response.data.length === 0) setError('No active bookings found for this query.');
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking); setSearchResults([]); setDamageCharges(''); setResult(null);
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);

    try {
      const response = await axios.put(`http://localhost:5000/api/bookings/${selectedBooking._id}/check-in`, {
        damageCharges: Number(damageCharges) || 0
      });
      setResult(response.data.data);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Check-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white max-w-6xl mx-auto">
      
      {/* Search Bar Area */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Quick Check-In</h2>
        <p className="text-gray-400 text-sm mb-6">Process equipment returns and calculate final settlements.</p>
        
        <form onSubmit={handleSearch} className="flex gap-4 max-w-3xl">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131313] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#43B062]"
              placeholder="Enter Booking ID or Customer Phone Number..."
              required
            />
          </div>
          <button type="submit" disabled={searching} className="bg-[#43B062] text-black font-bold px-8 py-3 rounded-lg hover:bg-green-500 transition disabled:opacity-50">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && !selectedBooking && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side - Active Rentals / Search Results */}
        <div className="lg:col-span-2">
          <div className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-6 min-h-[400px]">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-[#2a2a2a] pb-4">Current Active Rentals</h3>
            
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((booking) => (
                  <div key={booking._id} onClick={() => handleSelectBooking(booking)} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg flex justify-between items-center hover:border-[#43B062] cursor-pointer transition">
                    <div>
                      <p className="text-white font-bold">{booking.bookingId}</p>
                      <p className="text-gray-400 text-sm">{booking.customerId?.name} • {booking.equipmentId?.name}</p>
                    </div>
                    <button className="bg-[#2a2a2a] text-white px-4 py-1.5 rounded text-sm hover:bg-[#333]">Select</button>
                  </div>
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FiSearch size={40} className="mb-4 opacity-50"/>
                  <p>Search by Booking ID or Phone Number to start.</p>
               </div>
            )}
          </div>
        </div>

        {/* Right Side - Return Settlement */}
        <div>
          <div className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-6 sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-[#2a2a2a] pb-4">Return Settlement</h3>
            
            {selectedBooking ? (
              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Booking ID:</span> <span className="text-white font-semibold">{selectedBooking.bookingId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Customer:</span> <span className="text-white">{selectedBooking.customerId?.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Equipment:</span> <span className="text-white">{selectedBooking.equipmentId?.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Due Date:</span> <span className="text-red-400 font-semibold">{new Date(selectedBooking.endDate).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Security Deposit:</span> <span className="text-white">LKR {selectedBooking.securityDeposit || 5000}</span></div>
                </div>

                <div className="pt-4 border-t border-[#2a2a2a]">
                  <label className="block text-gray-400 text-sm mb-2">Damage Charges (LKR)</label>
                  <input 
                    type="number" 
                    value={damageCharges}
                    onChange={(e) => setDamageCharges(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-white focus:outline-none focus:border-[#43B062]"
                    placeholder="Enter 0 if no damage"
                    min="0"
                  />
                </div>

                <button onClick={handleCheckIn} disabled={loading} className="w-full bg-[#43B062] text-black font-bold py-3 rounded-lg hover:bg-green-500 transition disabled:opacity-50 mt-4">
                  {loading ? 'Processing...' : 'Process Return & Finalize'}
                </button>
                <button onClick={() => setSelectedBooking(null)} className="w-full bg-transparent text-gray-400 py-2 rounded-lg hover:text-white transition">
                  Cancel
                </button>
              </div>
            ) : result ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center text-[#43B062] mb-4"><FiCheckCircle size={48}/></div>
                <h4 className="text-xl font-bold text-[#43B062]">Success!</h4>
                <div className="bg-[#1a1a1a] p-4 rounded-lg text-sm space-y-2 text-left">
                  <div className="flex justify-between"><span className="text-gray-400">Overdue Days:</span> <span className="text-red-400 font-bold">{result.overdueDays}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Late Fee:</span> <span className="text-red-400 font-bold">LKR {result.lateFee.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Damage:</span> <span className="text-red-400 font-bold">LKR {result.damage.toLocaleString()}</span></div>
                  <div className="border-t border-[#2a2a2a] pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span className="text-white">Net Refund:</span> <span className="text-[#43B062]">LKR {result.netRefund.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setResult(null)} className="w-full bg-[#2a2a2a] text-white py-2 rounded-lg hover:bg-[#333] transition">Done</button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-10">Select a booking from the left to process return.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckIn;