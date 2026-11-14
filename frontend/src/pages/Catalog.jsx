import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom'; // useSearchParams එකතු කළා
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

function Catalog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // URL params අල්ලගන්න
  
  // URL එකේ 'category' තියෙනවා නම් ඒක ගන්නවා, නැත්නම් 'All' ගන්නවා
  const categoryParam = searchParams.get('category') || 'All';
  
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState('');

  // URL එක වෙනස් වෙද්දී (උදා: වෙන page එකකින් එද්දී) State එක update කරන්න
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/equipment`);
        setEquipment(response.data);
        setError(null);
      } catch (err) {
        setError('Backend connection failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  // Scroll Reveal Animation Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [equipment, selectedCategory, searchTerm]); 

  const categories = ['All', 'Guitars & Basses', 'Keyboards & Synth', 'Drums & Percussion', 'PA & Lighting'];

  // Category එක click කරද්දී URL එකත් එක්ක update කරන්න
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setSearchParams({}); // 'All' නම් URL එකේ තියෙන category අයින් කරනවා
    } else {
      setSearchParams({ category: cat }); // අලුත් category එක URL එකට දානවා
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = item.name && item.name.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col relative">
      <Navbar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 flex-grow w-full">

        {/* Header Section */}
        <div className="mb-12 reveal">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gray-600"></div>
            <span className="text-gray-400 text-xs font-semibold tracking-[0.2em] uppercase">Catalog</span>
            <div className="h-[1px] w-8 bg-gray-600"></div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-5 mb-4">
            <h1 className="text-4xl md:text-6xl font-serif font-normal text-white tracking-tight leading-none">
              Premium Equipment
            </h1>
            <span className="font-['Dancing_Script'] text-[#43B062]/80 drop-shadow-[0_0_8px_rgba(67,176,98,0.3)] text-4xl md:text-6xl leading-none pb-1">
              Catalog
            </span>
          </div>
          
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Browse our complete collection of top-tier musical gear.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 reveal delay-100">
          <div className="flex gap-3 overflow-x-auto pb-2 w-full lg:w-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)} // අලුත් Function එක
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-[#43B062] text-black shadow-[0_0_15px_rgba(67,176,98,0.3)]'
                    : 'bg-[#131313] text-gray-300 border border-[#2a2a2a] hover:border-[#43B062] hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80 group">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#43B062]" size={18} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#131313] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#43B062] transition-colors duration-300"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-32 text-[#43B062] text-xl animate-pulse">Loading inventory...</div>
        ) : error ? (
          <div className="text-center py-32 text-red-400">{error}</div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-32 reveal">
            <FiFilter size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-2xl text-white mb-2">No equipment found</h3>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {setSearchTerm(''); handleCategoryChange('All');}} // Reset කරද්දීත් URL එක අයින් වෙන්න
              className="mt-6 px-6 py-2 bg-[#131313] border border-[#43B062] text-[#43B062] rounded-lg hover:bg-[#43B062] hover:text-black transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredEquipment.map((item, index) => (
              <div
                key={item._id}
                className={`bg-[#131313] border border-[#2a2a2a] rounded-xl overflow-hidden group hover:border-[#43B062]/50 transition-all duration-700 flex flex-col hover:-translate-y-2 reveal delay-${(index % 4) * 100}`}
              >
                <div className="relative aspect-[4/3] bg-[#1a1a1a] overflow-hidden cursor-pointer" onClick={() => navigate(`/equipment/${item._id}`)}>
                  <img
                    src={item.imageUrl || imageMap[item.name] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-md text-xs font-semibold backdrop-blur-md ${item.status === 'Available' ? 'bg-[#43B062]/20 text-[#43B062] border border-[#43B062]/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-gray-500 text-xs font-semibold tracking-wider">{item.equipmentCode}</p>
                    <span className="text-[#43B062] text-xs font-medium bg-[#43B062]/10 px-2 py-1 rounded-md">{item.category}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-4 leading-snug flex-1 line-clamp-2 cursor-pointer hover:text-[#43B062] transition-colors duration-300" onClick={() => navigate(`/equipment/${item._id}`)}>{item.name}</h3>

                  <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
                    <p className="text-[#43B062] font-semibold text-xl mb-4">
                      LKR {item.dailyRate.toLocaleString()} <span className="text-gray-500 text-sm font-normal">/ day</span>
                    </p>
                    <button
                      disabled={item.status !== 'Available'}
                      onClick={() => navigate('/book', { state: { equipmentId: item._id, equipment: item } })}
                      className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-500 ${item.status === 'Available'
                          ? 'bg-[#43B062] text-black hover:bg-[#369a50] hover:shadow-[0_0_15px_rgba(67,176,98,0.3)]'
                          : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      {item.status === 'Available' ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Catalog;