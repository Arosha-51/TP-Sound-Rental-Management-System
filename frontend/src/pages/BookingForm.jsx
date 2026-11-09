import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/Logo.png';

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
  
  // 👇 හැම Field එකකම Errors තියාගන්න State එක
  const [errors, setErrors] = useState({});
  
  // 👇 යූසර් බටන් එක ඔබලා තියෙනවද කියලා බලන්න State එකක් (Submit කරද්දී හැම Error එකක්ම පෙන්නන්න)
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch equipment details
  useEffect(() => {
    const fetchEquipment = async () => {
      if (!formData.equipmentId) return;
      if (!/^[0-9a-fA-F]{24}$/.test(formData.equipmentId)) return; 

      try {
        const response = await axios.get(
          `${API_URL}/equipment/${formData.equipmentId}`
        );
        setEquipment(response.data);
      } catch (error) {
        console.error('Error:', error);
        setEquipment(null);
      }
    };
    fetchEquipment();
  }, [formData.equipmentId]);

  // 👇 Real-time Validation & Fee Calculation එක (හැම වෙනස්කමකදීම රන් වෙනවා)
  useEffect(() => {
    let newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // අද දවසේ වෙලාව අදාළ නැති නිසා

    // 1. Equipment ID Validation (යූසර් Type කරන කොටම බලනවා)
    if (formData.equipmentId && !/^[0-9a-fA-F]{24}$/.test(formData.equipmentId)) {
      newErrors.equipmentId = 'Invalid format. Please check the Equipment ID.';
    }

    // 2. Start Date Validation (අතීත දිනයක් ද ද බලනවා)
    if (formData.startDate) {
      const start = new Date(formData.startDate);
      if (start < today) {
        newErrors.startDate = 'Start date cannot be a past date.';
      }
    }

    // 3. End Date Validation (Start Date එකට කලින් ද බලනවා)
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before Start date.';
      }
    }

    // Errors ටික අප්ඩේට් කරනවා
    setErrors(newErrors);

    // ගාන ගණනය කිරීම (Errors නැත්නම් විතරයි ගාන හදන්නේ)
    if (formData.startDate && formData.endDate && equipment && !newErrors.startDate && !newErrors.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const calculatedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const calculatedTotal = equipment.dailyRate * calculatedDays + equipment.securityDeposit;
      
      setDays(calculatedDays);
      setTotalFee(calculatedTotal);
    } else {
      setDays(0);
      setTotalFee(0);
    }

  }, [formData, equipment]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // බටන් එක ඔබද්දී හැම Field එකක්ම පුරවලා තියෙනවද බලනවා
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // මේකෙන් ඔක්කොම හිස් තැන් වලට එරර් පෙන්නන්න ගන්නවා

    let submitErrors = { ...errors };

    if (!formData.equipmentId) submitErrors.equipmentId = 'Equipment ID is required.';
    if (!formData.startDate) submitErrors.startDate = 'Start date is required.';
    if (!formData.endDate) submitErrors.endDate = 'End date is required.';

    setErrors(submitErrors);

    // Errors තියෙනවා නම් නවතිනවා
    if (Object.keys(submitErrors).length > 0) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/bookings`, formData);
      setMessage({
        type: 'success',
        text: `Booking Successful! Booking ID: ${response.data.bookingId}`,
      });
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: `${error.response?.data?.message || 'Booking failed'}`,
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
          className="text-gray-400 hover:text-neon transition mb-6"
        >
          ← Back to Catalog
        </button>

        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="TP Sound Logo" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
            <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-neon mb-2">Book Equipment</h2>
        <p className="text-gray-400 mb-6">Select the equipment and rental dates</p>

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

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-white mb-2 font-medium">Equipment ID</label>
            <input
              type="text"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              placeholder="Paste Equipment ID here"
              className={`w-full bg-dark border rounded-lg px-4 py-3 text-white focus:outline-none transition ${
                errors.equipmentId ? 'border-red-500 focus:border-red-500' : 'border-dark-border focus:border-neon'
              }`}
            />
            {errors.equipmentId && <p className="text-red-500 text-sm mt-1">{errors.equipmentId}</p>}
          </div>

          {equipment && (
            <div className="bg-dark border border-dark-border rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">{equipment.equipmentCode}</p>
              <p className="text-neon font-semibold">{equipment.name}</p>
              <p className="text-gray-400 text-sm">LKR {equipment.dailyRate.toLocaleString()} / day</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full bg-dark border rounded-lg px-4 py-3 text-white focus:outline-none transition ${
                  errors.startDate ? 'border-red-500 focus:border-red-500' : 'border-dark-border focus:border-neon'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-white mb-2 font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full bg-dark border rounded-lg px-4 py-3 text-white focus:outline-none transition ${
                  errors.endDate ? 'border-red-500 focus:border-red-500' : 'border-dark-border focus:border-neon'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {totalFee > 0 && equipment && !errors.endDate && !errors.startDate && (
            <div className="bg-neon/10 border border-neon rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Daily Rate × {days} {days === 1 ? 'day' : 'days'}</span>
                <span className="text-white">LKR {(equipment.dailyRate * days).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-300">Security Deposit</span>
                <span className="text-white">LKR {equipment.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="border-t border-neon/30 pt-3 flex justify-between">
                <span className="text-neon font-bold text-lg">Total Fee</span>
                <span className="text-neon font-bold text-lg">LKR {totalFee.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-dark font-semibold py-3 rounded-lg hover:bg-neon/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;