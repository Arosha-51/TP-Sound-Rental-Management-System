import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { FiSearch, FiShoppingBag, FiSettings, FiMenu, FiX } from 'react-icons/fi';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  // Scroll spy logic to highlight active section on scroll
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
    setIsMobileMenuOpen(false); // Close mobile menu when a link is clicked
    
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center relative">
        
        {/* Left: Logo & Text */}
        <div className="flex items-center gap-3 cursor-pointer z-10" onClick={() => handleNavClick('home')}>
          <img src={logo} alt="TP Sound Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <div className="flex flex-col whitespace-nowrap">
            <h1 className="text-[#43B062] font-bold text-base sm:text-lg leading-tight">TP Sound &</h1>
            <p className="text-gray-400 text-[9px] sm:text-[10px] tracking-widest uppercase">Musical Gear Rentals</p>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 gap-2">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              location.pathname === '/' && activeSection === 'home' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white'
            }`}
          >
            Home
          </Link>
          
          <Link 
            to="/catalog" 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              location.pathname === '/catalog' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white'
            }`}
          >
            Catalog
          </Link>
          
          <button 
            onClick={() => handleNavClick('about')} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              location.pathname === '/' && activeSection === 'about' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white'
            }`}
          >
            About
          </button>
          
          <button 
            onClick={() => handleNavClick('contact')} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              location.pathname === '/' && activeSection === 'contact' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-3 z-10">
          
          {/* Search Bar (Desktop only) */}
          <div className="hidden lg:flex relative group w-48 xl:w-56 mr-2">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#43B062] transition-colors" size={16}/>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#43B062]"
            />
          </div>

          {/* Track Icon */}
          <button onClick={() => navigate('/track')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium p-2">
            <FiShoppingBag size={18} />
          </button>
          
          <div className="w-px h-5 bg-[#2a2a2a] mx-1 hidden sm:block"></div>

          {/* Sign In (Hidden on mobile to save space) */}
          <button 
            onClick={() => navigate('/login')} 
            className="hidden sm:block text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2 rounded-md hover:bg-[#1a1a1a]"
          >
            Sign In
          </button>
          
          {/* Sign Up Button */}
          <button 
            onClick={() => navigate('/register')} 
            className="bg-[#43B062] text-black px-3 sm:px-5 py-1.5 sm:py-2 rounded-md font-semibold text-xs sm:text-sm transition-all duration-300 hover:bg-green-400 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(67,176,98,0.4)]"
          >
            Sign Up
          </button>
          
          {/* Admin Icon (Desktop) */}
          <button onClick={() => navigate('/admin')} className="hidden sm:block text-gray-400 hover:text-[#43B062] transition-colors p-1 ml-1">
            <FiSettings size={20} />
          </button>

          {/* Mobile Menu Toggle Button (Hamburger) */}
          <button 
            className="md:hidden text-gray-300 hover:text-white p-2 ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#0f0f0f] border-b border-[#2a2a2a] ${
          isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          
          {/* Mobile Search Bar */}
          <div className="relative group w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#43B062] transition-colors" size={18}/>
            <input
              type="text"
              placeholder="Search gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#43B062]"
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/' && activeSection === 'home' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/catalog' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              Catalog
            </Link>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`text-left px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/' && activeSection === 'about' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              About Us
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className={`text-left px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/' && activeSection === 'contact' ? 'text-[#43B062] bg-[#1a1a1a]' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Mobile Auth / Admin Links */}
          <div className="flex flex-col gap-2 pt-4 border-t border-[#2a2a2a]">
            <button 
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} 
              className="w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Sign In
            </button>
            <button 
              onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }} 
              className="w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2"
            >
              <FiSettings size={16} /> Admin Portal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;