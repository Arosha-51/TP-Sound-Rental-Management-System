import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCalendar, FiCheck, FiShield, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

// Image imports
import maxtoneDrumKit from '../assets/Gear_Maxtone_Drum_Kit.jpg';
import blackLesPaul from '../assets/Gear_Black_LesPaul_Guitar.jpg';
import korgMixer from '../assets/Gear_KORG_KMX8_Mixer.jpg';
import redBass from '../assets/Gear_Red_Bass_Guitar.jpg';
import chromeFlyingV from '../assets/Gear_Chrome_FlyingV_Guitar.jpg';
import washburnYellow from '../assets/Gear_Washburn_Yellow_Guitar.jpg';
import yamahaKeyboard from '../assets/Gear_Yamaha_Keyboards.jpg';
import samsonMixer from '../assets/Gear_Samson_MIX10_Mixer.jpg';

const imageMap = {
  'KORG KMX-8 Audio Mixer': korgMixer,
  'Black Les Paul Style Electric Guitar': blackLesPaul,
  'Washburn Electric Guitar': washburnYellow,
  'Chrome Flying V Electric Guitar': chromeFlyingV,
  'Maxtone Acoustic Drum Kit': maxtoneDrumKit,
  'Yamaha Electronic Keyboard': yamahaKeyboard,
  'Samson MIX-10 Audio Mixer': samsonMixer,
  'Red Sunburst Electric Bass Guitar': redBass,
};

const API_URL = 'http://localhost:5000/api';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop';

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/equipment`);
        const allEquipment = response.data;
        
        const foundItem = allEquipment.find((eq) => eq._id === id);
        
        if (foundItem) {
          setItem(foundItem);
          const similar = allEquipment
            .filter((eq) => eq.category === foundItem.category && eq._id !== id)
            .slice(0, 4);
          setSimilarItems(similar);
        } else {
          setError('Equipment not found.');
        }
      } catch (err) {
        setError('Failed to load equipment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBooking = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both Start and End dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after Start date.');
      return;
    }

    navigate('/book', { 
      state: { 
        equipmentId: item._id, 
        equipment: item,
        startDate,
        endDate
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-[#43B062] text-xl animate-pulse font-semibold">Loading details...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl mb-4">{error || 'Item not found'}</h2>
        <Link to="/catalog" className="text-[#43B062] hover:underline flex items-center gap-1">
          Go back to Catalog <FiChevronRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col relative">
      <Navbar />

      <div className="pt-28 pb-16 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        
        {/* Breadcrumbs - UPDATED: Category is now a Link */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
          <span>/</span>
          <Link 
            to={`/catalog?category=${encodeURIComponent(item.category)}`} 
            className="hover:text-[#43B062] transition-colors cursor-pointer"
          >
            {item.category}
          </Link>
          <span>/</span>
          <span className="text-[#43B062]">{item.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Image Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#131313] border border-[#2a2a2a] rounded-2xl overflow-hidden relative w-full h-[300px] sm:h-[400px] group cursor-pointer shadow-2xl shadow-black/50">
              <img
                src={item.imageUrl || imageMap[item.name] || DEFAULT_IMAGE}
                alt={item.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${item.status === 'Available' ? 'bg-[#43B062]/90 text-black' : 'bg-red-500/90 text-white'}`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
               <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#131313] border-2 border-[#43B062] rounded-lg overflow-hidden cursor-pointer group shadow-[0_0_15px_rgba(67,176,98,0.2)]">
                  <img src={item.imageUrl || imageMap[item.name] || DEFAULT_IMAGE} alt="thumb1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#131313] border border-[#2a2a2a] rounded-lg overflow-hidden cursor-pointer hover:border-gray-500 transition-colors group">
                  <img src={item.imageUrl || imageMap[item.name] || DEFAULT_IMAGE} alt="thumb2" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
               </div>
               <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#131313] border border-[#2a2a2a] rounded-lg overflow-hidden cursor-pointer hover:border-gray-500 transition-colors group">
                  <img src={item.imageUrl || imageMap[item.name] || DEFAULT_IMAGE} alt="thumb3" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
               </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="lg:col-span-7 flex flex-col pt-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">{item.name}</h1>
              <span className="inline-block text-[#43B062] text-[10px] md:text-xs font-bold bg-[#43B062]/10 px-3 py-1.5 rounded-lg border border-[#43B062]/30 uppercase tracking-widest whitespace-nowrap mt-1 md:mt-0 shadow-[0_0_10px_rgba(67,176,98,0.1)]">
                {item.category}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm mb-4 font-medium">Item Code: <span className="text-gray-300">{item.equipmentCode}</span></p>
            
            <div className="mb-6">
              <p className="text-[#43B062] text-4xl md:text-5xl font-black inline-block drop-shadow-[0_0_15px_rgba(67,176,98,0.3)]">
                LKR {item.dailyRate.toLocaleString()} <span className="text-gray-500 text-xl font-medium tracking-normal">/ day</span>
              </p>
            </div>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 pb-6 border-b border-[#2a2a2a]">
              {item.description || "High-quality rental equipment. Fully tested, tuned, and ready for your next gig or studio session. Experience premium sound with our top-tier gear."}
            </p>

            {/* Select Dates & Book Section */}
            <div className="mb-8 bg-[#151515] border border-[#2a2a2a] p-5 lg:p-6 rounded-2xl shadow-2xl shadow-black/50">
              <h3 className="text-white text-base md:text-lg font-bold mb-4 flex items-center gap-2">
                <FiCalendar className="text-[#43B062]" /> Select Rental Dates
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-[11px] text-gray-400 mb-1.5 block uppercase tracking-wider font-bold">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#43B062] focus:ring-1 focus:ring-[#43B062]/30 transition-all [color-scheme:dark] cursor-pointer hover:border-gray-500"
                  />
                </div>
                
                <div className="flex-1 w-full">
                  <label className="text-[11px] text-gray-400 mb-1.5 block uppercase tracking-wider font-bold">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#43B062] focus:ring-1 focus:ring-[#43B062]/30 transition-all [color-scheme:dark] cursor-pointer hover:border-gray-500"
                  />
                </div>

                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={handleBooking}
                    disabled={item.status !== 'Available'}
                    className={`w-full sm:px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                      item.status === 'Available'
                        ? 'bg-gradient-to-r from-[#43B062] to-[#2d8745] text-black hover:from-[#4cd674] hover:to-[#36a154] shadow-[0_0_15px_rgba(67,176,98,0.3)] hover:shadow-[0_0_25px_rgba(67,176,98,0.5)] hover:-translate-y-0.5'
                        : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.status === 'Available' ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <FiShield className="text-[#43B062] text-sm" />
                <p className="text-gray-400 text-[11px] font-medium">
                  Includes LKR {item.securityDeposit?.toLocaleString() || '5,000'} refundable security deposit.
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="pt-1">
              <h3 className="text-white font-bold mb-4 text-lg">What's Included & Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                <div className="flex items-center gap-2 bg-[#151515] p-3 rounded-lg border border-[#2a2a2a]"><FiCheck className="text-[#43B062] text-base shrink-0" /> Includes deluxe hard case</div>
                <div className="flex items-center gap-2 bg-[#151515] p-3 rounded-lg border border-[#2a2a2a]"><FiCheck className="text-[#43B062] text-base shrink-0" /> Instrument cable included</div>
                <div className="flex items-center gap-2 bg-[#151515] p-3 rounded-lg border border-[#2a2a2a]"><FiCheck className="text-[#43B062] text-base shrink-0" /> Fresh strings installed</div>
                <div className="flex items-center gap-2 bg-[#151515] p-3 rounded-lg border border-[#2a2a2a]"><FiCheck className="text-[#43B062] text-base shrink-0" /> Fully tested & tuned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Gear Section */}
        {similarItems.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#2a2a2a]">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Similar Gear You May Like</h2>
              <Link to="/catalog" className="text-[#43B062] hover:text-[#369a50] text-sm font-medium flex items-center gap-1 transition-colors">
                View All <FiChevronRight />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {similarItems.map((simItem) => (
                <div 
                  key={simItem._id}
                  onClick={() => navigate(`/equipment/${simItem._id}`)}
                  className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden cursor-pointer group hover:border-[#43B062]/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(67,176,98,0.1)]"
                >
                  <div className="aspect-[4/3] bg-[#1a1a1a] overflow-hidden relative">
                    <img
                      src={simItem.imageUrl || imageMap[simItem.name] || DEFAULT_IMAGE}
                      alt={simItem.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  <div className="p-3 lg:p-4">
                    <h4 className="text-white font-bold text-xs lg:text-sm line-clamp-1 mb-1 group-hover:text-[#43B062] transition-colors">{simItem.name}</h4>
                    <p className="text-[#43B062] font-black text-sm lg:text-base">
                      LKR {simItem.dailyRate.toLocaleString()} <span className="text-gray-500 font-medium text-[10px] lg:text-xs">/ day</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default ItemDetails;