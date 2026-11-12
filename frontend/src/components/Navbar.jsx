import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { FiSearch, FiSettings, FiMenu, FiX } from 'react-icons/fi';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll spy logic
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['home', 'catalog-preview', 'about', 'contact'];
      let current = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    
    // Fix: If user clicks 'Home' while already on the homepage, just scroll to top
    if (sectionId === 'home' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[98%] max-w-[1400px] z-50">
      
      {/* Changed from rounded-full to rounded-2xl for smooth corners */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/20 rounded-2xl px-6 lg:px-8 h-16 lg:h-[72px] flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300">
        
        {/* LEFT: Logo & Search Bar */}
        <div className="flex items-center gap-6 z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <img src={logo} alt="TP Sound Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain drop-shadow-md" />
            <div className="flex flex-col whitespace-nowrap">
              <h1 className="text-[#43B062] font-bold text-sm lg:text-base leading-tight drop-shadow-sm">TP Sound &</h1>
              <p className="text-gray-300 text-[8px] lg:text-[9px] tracking-widest uppercase">Musical Gear Rentals</p>
            </div>
          </div>

          {/* Search Bar - Desktop Only */}
          <div className="hidden lg:flex relative group w-40 xl:w-56">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#43B062] transition-colors" size={16}/>
            <input
              type="text"
              placeholder="Search gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:border-[#43B062]/50 transition-all duration-300 shadow-inner"
            />
          </div>
        </div>

        {/* CENTER: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`px-4 lg:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === '/' && activeSection === 'home' ? 'text-[#0f0f0f] bg-[#43B062] shadow-[0_0_15px_rgba(67,176,98,0.5)]' : 'text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Home
          </button>
          
          <Link 
            to="/catalog" 
            className={`px-4 lg:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === '/catalog' ? 'text-[#0f0f0f] bg-[#43B062] shadow-[0_0_15px_rgba(67,176,98,0.5)]' : 'text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Catalog
          </Link>
          
          <button 
            onClick={() => handleNavClick('about')} 
            className={`px-4 lg:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === '/' && activeSection === 'about' ? 'text-[#0f0f0f] bg-[#43B062] shadow-[0_0_15px_rgba(67,176,98,0.5)]' : 'text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            About
          </button>
          
          <button 
            onClick={() => handleNavClick('contact')} 
            className={`px-4 lg:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === '/' && activeSection === 'contact' ? 'text-[#0f0f0f] bg-[#43B062] shadow-[0_0_15px_rgba(67,176,98,0.5)]' : 'text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 z-10">
          
          {/* Sign In - Hidden on Mobile */}
          <button 
            onClick={() => navigate('/login')} 
            className="hidden md:block text-gray-200 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10"
          >
            Sign In
          </button>
          
          {/* Sign Up Button - Hidden on Mobile */}
          <button 
            onClick={() => navigate('/register')} 
            className="hidden md:block bg-[#43B062] text-black px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-green-400 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(67,176,98,0.6)]"
          >
            Sign Up
          </button>
          
          {/* Admin Icon - Hidden on Mobile */}
          <button onClick={() => navigate('/admin')} className="hidden md:flex text-gray-300 hover:text-[#43B062] transition-colors p-2 rounded-lg hover:bg-white/10 ml-1">
            <FiSettings size={20} />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden text-gray-200 hover:text-white p-2 ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Also changed to rounded-2xl */}
      <div 
        className={`md:hidden mt-3 overflow-hidden transition-all duration-300 ease-in-out bg-white/5 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-transparent'
        }`}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          
          {/* Mobile Search Bar */}
          <div className="relative group w-full">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#43B062] transition-colors" size={16}/>
            <input
              type="text"
              placeholder="Search gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:border-[#43B062]/50"
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => handleNavClick('home')} 
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/' && activeSection === 'home' ? 'text-[#0f0f0f] bg-[#43B062]' : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <Link 
              to="/catalog" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/catalog' ? 'text-[#0f0f0f] bg-[#43B062]' : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Catalog
            </Link>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/' && activeSection === 'about' ? 'text-[#0f0f0f] bg-[#43B062]' : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              About Us
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/' && activeSection === 'contact' ? 'text-[#0f0f0f] bg-[#43B062]' : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Mobile Auth Links */}
          <div className="flex flex-col gap-1 pt-3 border-t border-white/10">
            <button 
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} 
              className="w-full text-left px-4 py-2 text-sm font-medium text-gray-200 hover:text-white rounded-lg hover:bg-white/10"
            >
              Sign In
            </button>
            <button 
              onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }} 
              className="w-full text-left px-4 py-2 text-sm font-medium text-[#43B062] hover:text-green-400 rounded-lg hover:bg-white/10"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;