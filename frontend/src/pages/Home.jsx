import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronRight, FiSend, FiClock, FiPhone, FiMapPin } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import homepageImg from '../assets/Homepageimg.jpg';

// Image imports for fallback
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

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(`${API_URL}/equipment`);
        setEquipment(response.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching equipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state]);

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
  }, [equipment]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative w-full min-h-[100vh] flex items-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${homepageImg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center py-20 reveal">
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white tracking-tight">
            Rent Premium <br/>
            <span className="text-[#43B062]">Musical Gear</span><br/>
            for Your Next Gig
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-10 max-w-xl leading-relaxed delay-100">
            T.P. Sound & Musical Gear Rentals is your premier destination in Kuruwita for high-quality sound systems, stage lighting, and musical instruments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 delay-200">
            <button 
              onClick={() => scrollToSection('catalog-preview')} 
              className="bg-[#43B062] text-black font-medium px-8 py-3.5 rounded-lg transition-all duration-300 ease-out hover:bg-[#369a50] hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(67,176,98,0.6)] flex justify-center items-center gap-2"
            >
              Browse Catalog <FiChevronRight size={20} />
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="bg-transparent text-white border border-[#2a2a2a] font-medium px-8 py-3.5 rounded-lg transition-all duration-300 ease-out hover:border-[#43B062] hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(67,176,98,0.3)]"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* CATALOG PREVIEW SECTION */}
      <section id="catalog-preview" className="py-24 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            {/* Dancing Script Title */}
            <span className="font-['Dancing_Script'] text-3xl md:text-4xl text-[#43B062] mb-2 block tracking-wide">
              Our Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Gear</h2>
            <p className="text-gray-400">Explore our most popular rental equipment.</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#43B062] animate-pulse">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {equipment.map((item, index) => (
                  <div 
                    key={item._id} 
                    className={`bg-[#131313] border border-[#2a2a2a] rounded-xl overflow-hidden group hover:border-[#43B062]/50 transition-all duration-700 flex flex-col hover:-translate-y-2 reveal delay-${(index % 4) * 100}`}
                  >
                    <div className="relative aspect-[4/3] bg-[#1a1a1a] overflow-hidden">
                      <img
                        src={item.imageUrl || imageMap[item.name] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[#43B062] text-xs font-medium mb-2">{item.category}</p>
                      <h3 className="text-white font-semibold text-lg mb-4 line-clamp-2">{item.name}</h3>
                      <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
                        <p className="text-[#43B062] font-semibold text-xl mb-4">LKR {item.dailyRate.toLocaleString()} <span className="text-gray-500 text-sm font-normal">/ day</span></p>
                        <button
                          onClick={() => navigate('/book', { state: { equipmentId: item._id, equipment: item } })}
                          className="w-full py-3 rounded-lg bg-[#43B062] text-black font-medium hover:bg-[#369a50] transition-all duration-300 hover:shadow-[0_5px_15px_rgba(67,176,98,0.4)]"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Catalog Button at Bottom Center */}
              <div className="mt-16 flex justify-center reveal delay-200">
                <button 
                  onClick={() => navigate('/catalog')}
                  className="bg-[#43B062] text-black font-bold px-10 py-4 rounded-full transition-all duration-300 hover:bg-[#369a50] hover:-translate-y-1 hover:shadow-[0_15px_25px_-10px_rgba(67,176,98,0.6)] flex items-center gap-2"
                >
                  View Full Catalog <FiChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="min-h-screen flex items-center py-24 bg-[#0a0a0a] border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div className="reveal">
            {/* Dancing Script Title */}
            <span className="font-['Dancing_Script'] text-3xl md:text-4xl text-[#43B062] mb-2 block tracking-wide">
              Who We Are
            </span>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Your Trusted Gear Partner</h3>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Serving musicians, event organizers, and artists in Kuruwita and beyond since 2020. At T.P. Sound & Musical Gear Rentals, we provide top-tier audio equipment, backlines, and instruments to bring your events to life.
            </p>
            <div className="space-y-6">
              {['Premium Gear', 'Affordable Rates', 'Expert Support'].map((title, i) => (
                <div key={i} className={`flex gap-4 reveal delay-${(i+1)*100}`}>
                  <div className="w-10 h-10 rounded-full bg-[#43B062]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#43B062] font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm">Top-tier, stage-ready equipment from world-class brands.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative reveal delay-200">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#43B062] to-blue-500 rounded-2xl blur-lg opacity-20"></div>
            <img 
              src={homepageImg} 
              alt="About TP Sound" 
              className="relative rounded-2xl border border-[#2a2a2a] w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-24 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            {/* Dancing Script Title */}
            <span className="font-['Dancing_Script'] text-3xl md:text-4xl text-[#43B062] mb-2 block tracking-wide">
              Contact Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Have questions about our gear or need a custom quote for your event? Reach out to us.</p>
          </div>
          
          <div className="bg-[#131313] border border-[#2a2a2a] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            
            {/* Left Side: Contact Info */}
            <div className="bg-[#0a0a0a] p-10 lg:w-2/5 border-b lg:border-b-0 lg:border-r border-[#2a2a2a] relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#43B062] rounded-full blur-[100px] opacity-10"></div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Contact Info</h3>
              <p className="text-gray-400 text-sm mb-10">We're happy to help you plan the perfect musical experience.</p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#43B062]/10 border border-[#43B062]/20 flex items-center justify-center flex-shrink-0">
                    <FiClock className="text-[#43B062]" size={22}/>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">OPENING HOURS</p>
                    <p className="text-gray-400 text-sm">Mon - Sun, 8:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#43B062]/10 border border-[#43B062]/20 flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-[#43B062]" size={22}/>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">CALL FOR BOOKING</p>
                    <p className="text-gray-400 text-sm">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#43B062]/10 border border-[#43B062]/20 flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-[#43B062]" size={22}/>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">LOCATION</p>
                    <p className="text-gray-400 text-sm">No. 45, Main Street, Kuruwita</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Message Form */}
            <div className="p-10 lg:w-3/5 bg-[#131313]">
              <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      placeholder="+94 77 000 0000" 
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Message *</label>
                  <textarea 
                    rows="4" 
                    placeholder="Write your message here..." 
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300 resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="button" 
                  className="w-full bg-[#43B062] text-black font-bold py-4 rounded-lg hover:bg-[#369a50] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(67,176,98,0.5)] flex justify-center items-center gap-2 mt-2"
                >
                  Send Message <FiSend size={18} />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;