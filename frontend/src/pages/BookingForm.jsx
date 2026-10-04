import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function BookingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '653f8a1b2c3d4e5f6a7b8c9d', // Test User ID
    equipmentId: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/bookings`, formData);
      setMessage({
        type: 'success',
        text: `Booking Success! Booking ID: ${response.data.bookingId}`,
      });
      // Reset form
      setFormData({
        customerId: '653f8a1b2c3d4e5f6a7b8c9d',
        equipmentId: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Booking Failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-dark-card border border-dark-border rounded-xl p-8">
        <h1 className="text-3xl font-bold text-neon mb-2">Book Equipment</h1>
        <p className="text-gray-400 mb-6">
          Choose Your Equipment & Dates
        </p>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-neon/20 border border-neon text-neon'
                : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Equipment ID</label>
            <input
              type="text"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              required
              placeholder="Paste Equipment ID"
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon"
              />
            </div>
            <div>
              <label className="block text-white mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-dark font-semibold py-3 rounded-lg hover:bg-neon/90 transition disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;