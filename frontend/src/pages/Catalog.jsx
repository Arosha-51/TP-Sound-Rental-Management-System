import { useState, useEffect } from 'react';

function Catalog() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder data (Backend එකට connect කරන්න කලින්)
  const sampleEquipment = [
    {
      _id: '1',
      name: 'Fender Player II Stratocaster',
      category: 'Guitars & Basses',
      dailyRate: 4500,
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400'
    },
    {
      _id: '2',
      name: 'Roland XPS-30 Synthesizer',
      category: 'Keyboards & Synth',
      dailyRate: 5000,
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400'
    },
    {
      _id: '3',
      name: 'Pearl Export 5-Piece Drum Kit',
      category: 'Drums & Percussion',
      dailyRate: 7500,
      status: 'Rented',
      imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400'
    },
    {
      _id: '4',
      name: 'Yamaha StagePas 600BT PA System',
      category: 'PA & Lighting',
      dailyRate: 9000,
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400'
    }
  ];

  useEffect(() => {
    // මුලින්ම sample data පෙන්නන්න
    setEquipment(sampleEquipment);
    setLoading(false);

    // පස්සේ Backend එකට connect කරන්න
    // fetchEquipment();
  }, []);

  const categories = ['All', 'Guitars & Basses', 'Keyboards & Synth', 'Drums & Percussion', 'PA & Lighting'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEquipment = selectedCategory === 'All'
    ? equipment
    : equipment.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neon rounded-full flex items-center justify-center">
              <span className="text-dark font-bold text-xl">♪</span>
            </div>
            <div>
              <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search premium gear..."
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
          <div className="text-center py-12 text-gray-400">Loading equipment...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <div
                key={item._id}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon transition-all duration-300 hover:shadow-lg hover:shadow-neon/20"
              >
                {/* Image */}
                <div className="relative h-48 bg-dark flex items-center justify-center overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="text-6xl">🎸</span>';
                    }}
                  />
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Available'
                      ? 'bg-neon/20 text-neon border border-neon'
                      : 'bg-red-500/20 text-red-400 border border-red-500'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-white font-semibold text-base mb-3 line-clamp-2 h-12">
                    {item.name}
                  </h3>
                  <p className="text-neon font-bold text-lg mb-4">
                    LKR {item.dailyRate.toLocaleString()} <span className="text-gray-400 text-sm font-normal">/ day</span>
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