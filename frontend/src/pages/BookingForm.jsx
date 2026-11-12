import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/Logo.png';
import { FiUser, FiCheck } from 'react-icons/fi';

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
  const [errors, setErrors] = useState({});
  
  // Terms Checkbox state
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Fetch equipment details
  useEffect(() => {
    const fetchEquipment = async () => {
      if (!formData.equipmentId) return;
      if (!/^[0-9a-fA-F]{24}$/.test(formData.equipmentId)) return; 

      try {
        const response = await axios.get(`${API_URL}/equipment/${formData.equipmentId}`);
        setEquipment(response.data);
      } catch (error) {
        console.error('Error:', error);
        setEquipment(null);
      }
    };
    fetchEquipment();
  }, [formData.equipmentId]);

  // Real-time Validation & Fee Calculation
  useEffect(() => {
    let newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.equipmentId && !/^[0-9a-fA-F]{24}$/.test(formData.equipmentId)) {
      newErrors.equipmentId = 'Invalid format. Please check the Equipment ID.';
    }

    if (formData.startDate) {
      const start = new Date(formData.startDate);
      if (start < today) {
        newErrors.startDate = 'Start date cannot be a past date.';
      }
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before Start date.';
      }
    }

    setErrors(newErrors);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }

    let submitErrors = { ...errors };
    if (!formData.equipmentId) submitErrors.equipmentId = 'Equipment ID is required.';
    if (!formData.startDate) submitErrors.startDate = 'Start date is required.';
    if (!formData.endDate) submitErrors.endDate = 'End date is required.';
    setErrors(submitErrors);

    if (Object.keys(submitErrors).length > 0) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/bookings`, formData);
      // Redirect to a success page or show success message
      setMessage({
        type: 'success',
        text: `Booking Successful! ID: ${response.data.bookingId}`,
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
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
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
            Cancel
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-2">Complete Your Booking</h2>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500 text-green-400' : 'bg-red-500/10 border border-red-500 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side - Form */}
          <div className="flex-1">
            {/* Logged in user banner */}
            <div className="bg-[#131313] border border-[#43B062]/30 rounded-lg p-4 mb-6 flex items-center gap-3">
              <FiUser className="text-[#43B062]" size={20} />
              <p className="text-sm text-gray-300">Logged in as: <span className="text-white font-semibold">Customer Name</span> (NIC: 199812345678)</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Rental Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full bg-[#131313] border rounded-lg px-4 py-3 text-white focus:outline-none transition ${errors.startDate ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#43B062]'}`}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full bg-[#131313] border rounded-lg px-4 py-3 text-white focus:outline-none transition ${errors.endDate ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#43B062]'}`}
                    />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Special Notes or Requests (Optional)</label>
                <textarea 
                  className="w-full bg-[#131313] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#43B062]"
                  rows="3"
                  placeholder="e.g., Please include a guitar strap and a 1/4 inch cable..."
                ></textarea>
              </div>

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#43B062]"
                />
                <label htmlFor="terms" className="text-sm text-gray-400 leading-tight">
                  I agree to the <span className="text-[#43B062] cursor-pointer hover:underline">Terms & Conditions</span> and <span className="text-[#43B062] cursor-pointer hover:underline">Damage Liability Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0 || !agreeTerms || !equipment}
                className="w-full bg-[#43B062] text-black font-bold text-lg py-4 rounded-lg hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? 'Processing...' : 'Confirm & Proceed to Payment →'}
              </button>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-[#131313] border border-[#2a2a2a] rounded-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              {equipment ? (
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    {equipment.imageUrl ? (
                      <img src={equipment.imageUrl} alt={equipment.name} className="w-20 h-20 object-cover rounded-lg border border-[#2a2a2a]" />
                    ) : (
                      <div className="w-20 h-20 bg-[#2a2a2a] rounded-lg flex items-center justify-center">No Img</div>
                    )}
                    <div>
                      <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded">{equipment.category}</span>
                      <h4 className="text-white font-bold text-lg leading-tight mt-1">{equipment.name}</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Daily Rate:</span>
                      <span className="text-white">LKR {equipment.dailyRate?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Total Days:</span>
                      <span className="text-white">{days} {days === 1 ? 'Day' : 'Days'}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Security Deposit:</span>
                      <span className="text-white">LKR {equipment.securityDeposit?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-6">Select equipment to see summary.</p>
              )}

              <div className="border-t border-[#2a2a2a] pt-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-300 font-semibold">Total Payable</span>
                  <span className="text-[#43B062] font-bold text-3xl">
                    LKR {totalFee > 0 ? totalFee.toLocaleString() : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookingForm;