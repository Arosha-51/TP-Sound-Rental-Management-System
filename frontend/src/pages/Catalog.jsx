import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/Logo.png';

// Image imports
import maxtoneDrumKit from '../assets/Gear_Maxtone_Drum_Kit.jpg';
import blackLesPaul from '../assets/Gear_Black_LesPaul_Guitar.jpg';
import korgMixer from '../assets/Gear_KORG_KMX8_Mixer.jpg';
import redBass from '../assets/Gear_Red_Bass_Guitar.jpg';
import chromeFlyingV from '../assets/Gear_Chrome_FlyingV_Guitar.jpg';
import washburnYellow from '../assets/Gear_Washburn_Yellow_Guitar.jpg';
import yamahaKeyboard from '../assets/Gear_Yamaha_Keyboards.jpg';
import samsonMixer from '../assets/Gear_Samson_MIX10_Mixer.jpg';

// Equipment name → Image mapping
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
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch equipment from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/equipment`);
        setEquipment(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setError('Backend connection failed. Please check if server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const categories = [
    'All',
    'Guitars & Basses',
    'Keyboards & Synth',
    'Drums & Percussion',
    'PA & Lighting',
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="TP Sound Logo"
              className="w-14 h-14 object-contain"
            />
            <div>
              <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search premium gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon"
            />
          </div>

          <button className="flex items-center gap-2 text-white hover:text-neon transition">
            <span>📋</span>
            <span className="text-sm">Track My Booking</span>
          </button>
        </div>
      </header>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-neon text-dark font-semibold'
                  : 'bg-dark-card text-white border border-dark-border hover:border-neon'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-lg">
            Loading equipment...
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
            <p className="text-gray-500 text-sm">
              Please check if the backend server is running on port 5000.
            </p>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-lg">
            No equipment found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <div
                key={item._id}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon transition-all duration-300 hover:shadow-lg hover:shadow-neon/20"
              >
                <div className="relative h-48 bg-dark flex items-center justify-center overflow-hidden">
                  {imageMap[item.name] ? (
                    <img
                      src={imageMap[item.name]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🎸</span>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Available'
                        ? 'bg-neon/20 text-neon border border-neon'
                        : 'bg-red-500/20 text-red-400 border border-red-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    {item.equipmentCode} • {item.category}
                  </p>
                  <h3 className="text-white font-semibold text-base mb-3 line-clamp-2 h-12">
                    {item.name}
                  </h3>
                  <p className="text-neon font-bold text-lg mb-4">
                    LKR {item.dailyRate.toLocaleString()}{' '}
                    <span className="text-gray-400 text-sm font-normal">
                      / day
                    </span>
                  </p>

                  <button
                    disabled={item.status !== 'Available'}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      item.status === 'Available'
                        ? 'bg-neon text-dark hover:bg-neon/90'
                        : 'bg-dark-border text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.status === 'Available' ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-border bg-dark-card py-6">
        <p className="text-center text-gray-500 text-sm">
          © 2026 T.P. Sound & Musical Gear Rentals. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Catalog;