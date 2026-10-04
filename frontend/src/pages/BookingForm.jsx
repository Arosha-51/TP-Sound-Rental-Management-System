import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function BookingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    customerId: '653f8a1b2c3d4e5f6a7b8c9d',
    equipmentId: id || '',
    startDate: '',
    endDate: '',
  });
  const [equipment, setEquipment] = useState(null);
  const [totalFee, setTotalFee] = useState(0);
  const [days, setDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Equipment details ගන්න
  useEffect(() => {
    const fetchEquipment = async () => {
      if (!formData.equipmentId) return;
      try {
        const response = await axios.get(
          `${API_URL}/equipment/${formData.equipmentId}`
        );
        setEquipment(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchEquipment();
  }, [formData.equipmentId]);

  // Total Fee Calculate කරන්න
  useEffect(() => {
    if (formData.startDate && formData.endDate && equipment) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end >= start) {
        const calculatedDays =
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const calculatedTotal =
          equipment.dailyRate * calculatedDays + equipment.securityDeposit;

        setDays(calculatedDays);
        setTotalFee(calculatedTotal);
      } else {
        setDays(0);
        setTotalFee(0);
      }
    }
  }, [formData.startDate, formData.endDate, equipment]);

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
        text: `✅ Booking සාර්ථක! Booking ID: ${response.data.bookingId}`,
      });
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error.response?.data?.message || 'Booking එක fail වුනා'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg bg-dark-card border border-dark-border rounded-xl p-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-neon transition mb-4"
        >
          ← Back to Catalog
        </button>

        <h1 className="text-3xl font-bold text-neon mb-2">Book Equipment</h1>
        <p className="text-gray-400 mb-6">
          ඔයාට අවශ්‍ය equipment එකයි දිනයි තෝරන්න
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
            <label className="block text-white mb-2 font-medium">
              Equipment ID
            </label>
            <input
              type="text"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              required
              placeholder="Equipment ID එක paste කරන්න"
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon"
            />
          </div>

          {equipment && (
            <div className="bg-dark border border-dark-border rounded-lg p-3">
              <p className="text-neon font-semibold">{equipment.name}</p>
              <p className="text-gray-400 text-sm">
                LKR {equipment.dailyRate.toLocaleString()} / day
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 font-medium">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon"
              />
            </div>
            <div>
              <label className="block text-white mb-2 font-medium">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon"
              />
            </div>
          </div>

          {/* ===== TOTAL FEE DISPLAY ===== */}
          {totalFee > 0 && equipment && (
            <div className="bg-neon/10 border border-neon rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">
                  Daily Rate × {days} {days === 1 ? 'day' : 'days'}
                </span>
                <span className="text-white">
                  LKR {(equipment.dailyRate * days).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-300">Security Deposit</span>
                <span className="text-white">
                  LKR {equipment.securityDeposit.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-neon/30 pt-3 flex justify-between">
                <span className="text-neon font-bold text-lg">Total Fee</span>
                <span className="text-neon font-bold text-lg">
                  LKR {totalFee.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || totalFee === 0}
            className="w-full bg-neon text-dark font-semibold py-3 rounded-lg hover:bg-neon/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking කරනවා...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;