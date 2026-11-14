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
import whoweareImg from '../assets/whoweare.jpg';

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
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          const yOffset = -80; 
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
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
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col relative">
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative w-full h-screen flex items-center pt-20">
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
            
            <a 
              href="tel:+94771234567" 
              className="bg-transparent text-white border border-[#2a2a2a] font-medium px-8 py-3.5 rounded-lg transition-all duration-300 ease-out hover:border-[#43B062] hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(67,176,98,0.3)] flex justify-center items-center gap-2"
            >
              <FiPhone size={20} /> Call Now
            </a>
          </div>
        </div>
      </section>

      {/* CATALOG PREVIEW SECTION */}
      <section id="catalog-preview" className="min-h-screen pt-28 pb-12 flex flex-col justify-center bg-[#0f0f0f] relative">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-8 reveal">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {equipment.map((item, index) => (
                  <div 
                    key={item._id} 
                    className={`bg-[#131313] border border-[#2a2a2a] rounded-xl overflow-hidden group hover:border-[#43B062]/50 transition-all duration-700 flex flex-col hover:-translate-y-2 reveal delay-${(index % 4) * 100}`}
                  >
                    <div className="relative h-44 bg-[#1a1a1a] overflow-hidden">
                      <img
                        src={item.imageUrl || imageMap[item.name] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[#43B062] text-xs font-medium mb-1">{item.category}</p>
                      <h3 className="text-white font-semibold text-base mb-3 line-clamp-2">{item.name}</h3>
                      <div className="mt-auto pt-3 border-t border-[#2a2a2a]">
                        <p className="text-[#43B062] font-semibold text-lg mb-3">LKR {item.dailyRate.toLocaleString()} <span className="text-gray-500 text-xs font-normal">/ day</span></p>
                        <button
                          onClick={() => navigate('/book', { state: { equipmentId: item._id, equipment: item } })}
                          className="w-full py-2.5 rounded-lg bg-[#43B062] text-black font-medium text-sm hover:bg-[#369a50] transition-all duration-300 hover:shadow-[0_5px_15px_rgba(67,176,98,0.4)]"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center reveal delay-200">
                <button 
                  onClick={() => navigate('/catalog')}
                  className="bg-[#43B062] text-black font-bold px-8 py-3 rounded-full transition-all duration-300 hover:bg-[#369a50] hover:-translate-y-1 hover:shadow-[0_15px_25px_-10px_rgba(67,176,98,0.6)] flex items-center gap-2 text-sm"
                >
                  View Full Catalog <FiChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="min-h-screen pt-28 pb-12 flex flex-col justify-center bg-[#0a0a0a] border-y border-[#2a2a2a] relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="reveal">
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
                  <div className="w-10 h-10 rounded-full bg-[#43B062]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#43B062] font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm">Top-tier, stage-ready equipment from world-class brands.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image with Smooth Zoom In Effect & Reduced Glow */}
          <div className="relative reveal delay-200 group">
            {/* Reduced Animated Glow Background */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#43B062] to-emerald-600 rounded-2xl blur-md opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
            
            {/* Image Container with Smooth Zoom */}
            <div className="relative rounded-2xl border border-[#2a2a2a] overflow-hidden w-full h-[450px] transition-transform duration-700 ease-out group-hover:scale-[1.02] shadow-xl group-hover:shadow-[0_20px_40px_-10px_rgba(67,176,98,0.2)]">
              <img 
                src={whoweareImg} 
                alt="About TP Sound" 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
              {/* Shimmer Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
            </div>
          </div>
          
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="min-h-screen pt-28 pb-12 flex flex-col justify-center bg-[#0f0f0f] relative">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <div className="text-center mb-6 reveal">
            <span className="font-['Dancing_Script'] text-2xl md:text-3xl text-[#43B062] mb-1 block tracking-wide">
              Contact Us
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Get in Touch</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">Have questions about our gear or need a custom quote for your event? Reach out to us.</p>
          </div>
          
          <div className="bg-[#131313] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xl reveal delay-100">
            
            <div className="bg-[#0a0a0a] p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-[#2a2a2a] relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#43B062] rounded-full blur-[80px] opacity-10"></div>
              
              <h3 className="text-xl font-bold text-white mb-2">Contact Info</h3>
              <p className="text-gray-400 text-xs mb-8">We're happy to help you plan the perfect musical experience.</p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#43B062]/10 border border-[#43B062]/20 flex items-center justify-center flex-shrink-0">
                    <FiClock className="text-[#43B062]" size={18}/>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs mb-0.5 tracking-wider">OPENING HOURS</p>
                    <p className="text-gray-400 text-sm">Mon - Sun, 8:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#43B062]/10 border border-[#43B062]/20 flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-[#43B062]" size={18}/>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs mb-0.5 tracking-wider">CALL FOR BOOKING</p>
                    <p className="text-gray-400 text-sm">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#43B062]/10 border border-[#43B062]/20 flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-[#43B062]" size={18}/>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs mb-0.5 tracking-wider">LOCATION</p>
                    <p className="text-gray-400 text-sm">No. 45, Main Street, Kuruwita</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:w-3/5 bg-[#131313]">
              <h3 className="text-lg font-bold text-white mb-4">Send us a Message</h3>
              
              <form className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      placeholder="+94 77 000 0000" 
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Your Message *</label>
                  <textarea 
                    rows="2" 
                    placeholder="Write your message here..." 
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#43B062] transition-colors duration-300 resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="button" 
                  className="w-full bg-[#43B062] text-black font-bold py-3 rounded-md hover:bg-[#369a50] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_-5px_rgba(67,176,98,0.5)] flex justify-center items-center gap-2 mt-2 text-sm"
                >
                  Send Message <FiSend size={16} />
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