import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronRight } from 'react-icons/fi';
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
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Popup State
  const [selectedItem, setSelectedItem] = useState(null);

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
  }, [equipment, selectedCategory]);

  const categories = ['All', 'Guitars & Basses', 'Keyboards & Synth', 'Drums & Percussion', 'PA & Lighting'];

  const filteredEquipment = equipment.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col relative">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 flex-grow w-full">
        
        {/* Header Section */}
        <div className="mb-12 reveal">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Premium Equipment Catalog</h1>
          <p className="text-gray-400 text-lg">Browse our complete collection of top-tier musical gear.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 reveal delay-100">
          
          <div className="flex gap-3 overflow-x-auto pb-2 w-full lg:w-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-500 ${
                  selectedCategory === cat
                    ? 'bg-[#43B062] text-black shadow-[0_0_15px_rgba(67,176,98,0.3)]'
                    : 'bg-[#131313] text-gray-400 border border-[#2a2a2a] hover:border-[#43B062] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 group">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#43B062]" size={20}/>
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#131313] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#43B062] transition-colors duration-500"
            />
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
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredEquipment.map((item, index) => (
              <div 
                key={item._id} 
                className={`bg-[#131313] border border-[#2a2a2a] rounded-xl overflow-hidden group hover:border-[#43B062]/50 transition-all duration-700 flex flex-col hover:-translate-y-2 reveal delay-${(index % 4) * 100}`}
              >
                {/* Clicking image opens popup */}
                <div className="relative aspect-[4/3] bg-[#1a1a1a] overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <img
                    src={item.imageUrl || imageMap[item.name] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-white font-medium bg-[#43B062] px-4 py-2 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Quick View</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-md text-xs font-semibold backdrop-blur-md ${
                      item.status === 'Available' ? 'bg-[#43B062]/20 text-[#43B062] border border-[#43B062]/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
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
                  <h3 className="text-white font-semibold text-lg mb-4 leading-snug flex-1 line-clamp-2 cursor-pointer hover:text-[#43B062] transition-colors duration-300" onClick={() => setSelectedItem(item)}>{item.name}</h3>
                  
                  <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
                    <p className="text-[#43B062] font-semibold text-xl mb-4">
                      LKR {item.dailyRate.toLocaleString()} <span className="text-gray-500 text-sm font-normal">/ day</span>
                    </p>
                    <button
                      disabled={item.status !== 'Available'}
                      onClick={() => navigate('/book', { state: { equipmentId: item._id, equipment: item } })}
                      className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-500 ${
                        item.status === 'Available'
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

      {/* POPUP MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#131313] border border-[#2a2a2a] rounded-2xl w-full max-w-3xl overflow-hidden relative animate-fade-in-up">
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors duration-300"
            >
              <FiX size={20} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-[#1a1a1a]">
                <img
                  src={selectedItem.imageUrl || imageMap[selectedItem.name] || 'https://via.placeholder.com/600x600?text=No+Image'}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 flex flex-col">
                <span className="text-[#43B062] text-sm font-medium mb-2">{selectedItem.category}</span>
                <h2 className="text-3xl font-bold text-white mb-4">{selectedItem.name}</h2>
                <p className="text-gray-400 mb-6 flex-grow">{selectedItem.description || "High-quality rental equipment from T.P. Sound & Musical Gear Rentals."}</p>
                
                <div className="space-y-4 mb-8 bg-[#0a0a0a] p-4 rounded-xl border border-[#2a2a2a]">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Equipment Code:</span>
                    <span className="text-white font-medium">{selectedItem.equipmentCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Security Deposit:</span>
                    <span className="text-white font-medium">LKR {selectedItem.securityDeposit?.toLocaleString() || '5,000'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#2a2a2a]">
                    <span className="text-gray-400">Daily Rate:</span>
                    <span className="text-[#43B062] text-2xl font-bold">LKR {selectedItem.dailyRate.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/book', { state: { equipmentId: selectedItem._id, equipment: selectedItem } })}
                  className="w-full py-4 rounded-lg bg-[#43B062] text-black font-bold text-lg hover:bg-[#369a50] transition-all duration-300 hover:-translate-y-1 flex justify-center items-center gap-2"
                >
                  Book This Gear <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Catalog;