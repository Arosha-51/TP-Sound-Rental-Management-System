import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiEye, FiSearch } from 'react-icons/fi';
import logo from '../assets/Logo.png';

const TrackBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Bookings'); // All, Pending, Approved, Completed

  // Fetch all bookings (පස්සේ Customer Auth එකෙන් User ID එක අරගෙන Filter කරන්න)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        // මේකේදී අපි හැම booking එකක්ම ගන්නවා (Demo එකට)
        setBookings(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDownloadPDF = async (id, bookingId) => {
    try {
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
      alert('PDF එක ගන්න බැරි වුනා.');
    }
  };

  // Filter Logic
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.equipmentId?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All Bookings' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      
      {/* Customer Header */}
      <header className="border-b border-[#2a2a2a] bg-[#131313] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-[#43B062] font-bold text-lg leading-tight">TP Sound &</h1>
              <p className="text-gray-500 text-xs">Musical Gear Rentals</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-2">My Bookings</h2>
        <p className="text-gray-400 mb-8">Manage your past, current, and upcoming rentals</p>

        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex bg-[#131313] border border-[#2a2a2a] rounded-lg overflow-hidden w-full md:w-auto">
            {['All Bookings', 'Pending', 'Approved', 'Completed'].map(tab => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-semibold transition ${filter === tab ? 'bg-[#43B062] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by Booking ID or equipment..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#131313] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#43B062]"
            />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-4 flex flex-col md:flex-row items-center gap-6">
                
                {/* Image */}
                <div className="w-full md:w-32 h-24 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                  {booking.equipmentId?.imageUrl ? (
                    <img src={booking.equipmentId.imageUrl} alt={booking.equipmentId.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No Image</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Booking ID: {booking.bookingId}</p>
                      <h3 className="text-lg font-bold text-white">{booking.equipmentId?.name}</h3>
                      <p className="text-sm text-gray-400">Rental Dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                      booking.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-lg font-bold text-[#43B062]">LKR {booking.totalFee.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-gray-300 rounded-lg text-sm hover:bg-[#333] transition">
                        <FiEye /> View Details
                      </button>
                      {booking.status === 'Approved' && (
                        <button onClick={() => handleDownloadPDF(booking._id, booking.bookingId)} className="flex items-center gap-2 px-4 py-2 bg-[#43B062] text-black rounded-lg text-sm font-bold hover:bg-green-500 transition">
                          <FiDownload /> Download PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackBooking;