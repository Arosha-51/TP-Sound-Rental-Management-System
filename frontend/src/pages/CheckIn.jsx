import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckIn = () => {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [damageCharges, setDamageCharges] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/check-in`, {
        damageCharges: Number(damageCharges) || 0
      });
      
      setResult(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Check-In failed. Please check the Booking ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-dark-card border border-dark-border rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Quick Check-In (Process Return)</h2>
          <button onClick={() => navigate('/admin')} className="text-neon hover:underline">
            ← Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleCheckIn} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Booking ID (MongoDB _id)</label>
            <input 
              type="text" 
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded p-3 text-white focus:outline-none focus:border-neon"
              placeholder="e.g., 653f8a1b2c3d4e5f6a7b8c9d"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Damage Charges (LKR)</label>
            <input 
              type="number" 
              value={damageCharges}
              onChange={(e) => setDamageCharges(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded p-3 text-white focus:outline-none focus:border-neon"
              placeholder="Enter 0 if no damage"
              min="0"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-neon text-dark font-bold py-3 rounded hover:bg-green-500 transition"
          >
            {loading ? 'Processing...' : 'Process Return & Calculate Refund'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900 border border-red-500 text-red-200 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-5 bg-gray-800 border-2 border-neon rounded-lg">
            <h3 className="text-neon font-bold text-xl mb-4 border-b border-gray-600 pb-2">Check-In Successful!</h3>
            
            <div className="space-y-2 text-lg">
              <p className="text-gray-300 flex justify-between"><span>Overdue Days:</span> <span className="text-red-400 font-bold">{result.overdueDays} Days</span></p>
              <p className="text-gray-300 flex justify-between"><span>Late Fee:</span> <span className="text-red-400 font-bold">LKR {result.lateFee}</span></p>
              <p className="text-gray-300 flex justify-between"><span>Damage Charges:</span> <span className="text-red-400 font-bold">LKR {result.damage}</span></p>
              <hr className="border-gray-600 my-2" />
              <p className="text-white flex justify-between font-bold text-xl"><span>Net Refund:</span> <span className="text-neon">LKR {result.netRefund}</span></p>
              <p className="text-gray-300 flex justify-between mt-2"><span>Status:</span> <span className="text-green-400">{result.status}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;