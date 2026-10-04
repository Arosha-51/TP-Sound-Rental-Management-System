import { useState, useEffect } from 'react';
import { equipmentAPI } from '../services/api';

function Catalog() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Guitars & Basses',
    'Keyboards & Synth',
    'Drums & Percussion',
    'PA & Lighting',
  ];

  // Fetch equipment from backend API
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await equipmentAPI.getAll();
        setEquipment(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setError('Failed to load equipment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // Filter equipment by category and search term
  const filteredEquipment = equipment.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-neon rounded-full flex items-center justify-center">
              <span className="text-dark font-bold text-xl">♪</span>
            </div>
            <div>
              <h1 className="text-neon font-bold text-lg leading-tight">
                TP Sound &
              </h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search premium gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon transition"
            />
          </div>

          {/* Track My Booking */}
          <button className="flex items-center gap-2 text-white hover:text-neon transition flex-shrink-0">
            <span>📋</span>
            <span className="text-sm hidden sm:inline">Track My Booking</span>
          </button>
        </div>
      </header>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
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
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading equipment...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-neon text-dark px-6 py-2 rounded-lg font-semibold hover:bg-neon/90 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎸</p>
            <p className="text-gray-400 text-lg">No equipment found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <div
                key={item._id}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon transition-all duration-300 hover:shadow-lg hover:shadow-neon/20 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-dark flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML =
                          '<span class="text-6xl">🎸</span>';
                      }}
                    />
                  ) : (
                    <span className="text-6xl">🎸</span>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Available'
                        ? 'bg-neon/20 text-neon border border-neon'
                        : item.status === 'Rented'
                        ? 'bg-red-500/20 text-red-400 border border-red-500'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-white font-semibold text-base mb-3 line-clamp-2 min-h-[3rem]">
                    {item.name}
                  </h3>
                  <p className="text-neon font-bold text-lg mb-4">
                    LKR {item.dailyRate?.toLocaleString()}{' '}
                    <span className="text-gray-400 text-sm font-normal">
                      / day
                    </span>
                  </p>

                  <button
                    disabled={item.status !== 'Available'}
                    className={`w-full py-2 rounded-lg font-semibold transition mt-auto ${
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