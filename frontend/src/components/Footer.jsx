import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { FiMapPin, FiPhone, FiMail, FiX } from 'react-icons/fi';

function Footer() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  
  // --- Animation States ---
  const [bubbles, setBubbles] = useState([]);
  const lastTimeRef = useRef(0);
  const [clickedId, setClickedId] = useState(null);
  const [isMouseIn, setIsMouseIn] = useState(false);
  
  // Ref to keep track of active timeouts for cleanup
  const timeoutsRef = useRef([]);

  // Musical notations for the bubbles
  const notes = ['𝄞', '𝄢', '♪', '♫'];

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Handle mouse move over footer to create water bubble effect
  const handleMouseMove = (e) => {
    const now = Date.now();
    // Throttle to prevent too many bubbles spawning at once
    if (now - lastTimeRef.current > 150) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newBubble = {
        id: now,
        x,
        y,
        char: notes[Math.floor(Math.random() * notes.length)],
        size: Math.random() * 10 + 20, // Size between 20px and 30px
        drift: (Math.random() - 0.5) * 80 // Random horizontal movement
      };

      setBubbles((prev) => [...prev.slice(-20), newBubble]); 
      lastTimeRef.current = now;

      // Automatically remove the bubble after 2 seconds (to keep DOM clean)
      const timeoutId = setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 2000);
      
      timeoutsRef.current.push(timeoutId);
    }
  };

  // Handle click animation
  const handleItemClick = (e, id, action) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 450); 
    if (action) action();
  };

  const modalData = {
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Please review and accept our terms to continue.',
      content: (
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div>
            <h4 className="text-white font-semibold text-base mb-2">1. Equipment Use</h4>
            <p>You agree to use any rented or accessed equipment strictly for its intended purpose and in accordance with our user guides. Any misuse or unauthorized modification is strictly prohibited.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">2. Late Returns & Fees</h4>
            <p>Items must be returned by the agreed-upon date and time specified in your contract. Late returns will incur an additional charge calculated based on the daily rental rate and will be deducted from the security deposit.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">3. Limitation of Liability</h4>
            <p>To the maximum extent permitted by law, T.P. Sound & Musical Gear Rentals is not liable for any indirect, incidental, special, or consequential damages arising out of the use or inability to use our equipment.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">4. Privacy & Data Use</h4>
            <p>We value your privacy and process your personal data in strict compliance with our Privacy Policy. Your details are used solely for rental processing and communication.</p>
          </div>
        </div>
      ),
      hasAcceptButton: true
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How we handle your data.',
      content: (
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>At T.P. Sound & Musical Gear Rentals, your privacy is important to us. This policy outlines how we collect and use your information.</p>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">1. Information Collection</h4>
            <p>We collect your name, NIC, phone number, and email address solely for the purpose of processing your rental booking and ensuring secure transactions.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">2. Data Usage</h4>
            <p>Your contact information will only be used to communicate with you regarding your booking, return dates, and payment processing. We do not use your data for marketing without your explicit consent.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">3. Data Protection</h4>
            <p>We implement strict security measures to protect your personal data from unauthorized access. We do not sell or share your information with third parties.</p>
          </div>
        </div>
      ),
      hasAcceptButton: true
    },
    damage: {
      title: 'Damage Liability Policy',
      subtitle: 'Rules regarding equipment damage.',
      content: (
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>Our equipment is high-value and requires careful handling. Please read our damage policy carefully.</p>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">1. Inspection</h4>
            <p>A physical inspection is conducted in the presence of the customer at the time of check-out and check-in to establish the condition of the equipment.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">2. Liability</h4>
            <p>The customer is fully liable for any damage, loss, or theft of the equipment during the rental period, regardless of fault.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-2">3. Deductions</h4>
            <p>Any repair costs or replacement fees will be deducted from the security deposit. If the damage exceeds the deposit amount, the customer will be billed for the difference and must settle it immediately.</p>
          </div>
        </div>
      ),
      hasAcceptButton: true
    }
  };

  return (
    <>
      {/* CSS Keyframes injected directly for the animations */}
      <style>
        {`
          /* Float Up Animation */
          @keyframes floatUp {
            0% { 
              transform: translateY(0) scale(0.8) translateX(0); 
            }
            100% { 
              transform: translateY(-120px) scale(1) translateX(var(--drift)); 
            }
          }
          
          .animate-bubble {
            animation: floatUp 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            text-shadow: 0 0 10px rgba(67, 176, 98, 0.6);
          }
          
          /* Distinct bouncy click animation */
          @keyframes bounceClickEffect {
            0% { transform: scale(1); }
            30% { transform: scale(0.85); color: #43B062; text-shadow: 0 0 15px rgba(67, 176, 98, 0.8); }
            60% { transform: scale(1.1); color: #43B062; text-shadow: 0 0 20px rgba(67, 176, 98, 1); }
            100% { transform: scale(1); text-shadow: none; color: inherit; }
          }
          
          .animate-click {
            animation: bounceClickEffect 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: inline-block;
          }
        `}
      </style>

      <footer 
        className="relative bg-[#0a0a0a] border-t border-[#2a2a2a] pt-16 pb-8 mt-auto z-40 overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsMouseIn(true)}
        onMouseLeave={() => setIsMouseIn(false)}
      >
        
        {/* Floating Musical Notes Container */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className={`absolute flex items-center justify-center rounded-full bg-[#43B062]/10 border border-[#43B062]/30 text-[#43B062] animate-bubble transition-all duration-700 ease-out ${
                isMouseIn ? 'opacity-100' : 'opacity-0 scale-75'
              }`}
              style={{
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                width: `${bubble.size * 2}px`,
                height: `${bubble.size * 2}px`,
                fontSize: `${bubble.size}px`,
                '--drift': `${bubble.drift}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {bubble.char}
            </div>
          ))}
        </div>

        {/* Actual Footer Content */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="TP Sound Logo" className="w-10 h-10 object-contain" />
                <div>
                  <h1 className="text-[#43B062] font-bold text-xl leading-tight">TP Sound &</h1>
                  <p className="text-gray-400 text-xs tracking-wide">Musical Gear Rentals</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your premier destination in Kuruwita for high-quality sound systems, stage lighting, and musical instruments. Ensuring your performance sounds and looks spectacular.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    onClick={(e) => handleItemClick(e, 'link-home')}
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors ${clickedId === 'link-home' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/catalog" 
                    onClick={(e) => handleItemClick(e, 'link-catalog')}
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors ${clickedId === 'link-catalog' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    Browse Catalog
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/track" 
                    onClick={(e) => handleItemClick(e, 'link-track')}
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors ${clickedId === 'link-track' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    Track My Booking
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    onClick={(e) => handleItemClick(e, 'link-login')}
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors ${clickedId === 'link-login' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    Sign In / Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Support</h3>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={(e) => handleItemClick(e, 'btn-terms', () => setActiveModal('terms'))} 
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left ${clickedId === 'btn-terms' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={(e) => handleItemClick(e, 'btn-privacy', () => setActiveModal('privacy'))} 
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left ${clickedId === 'btn-privacy' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={(e) => handleItemClick(e, 'btn-damage', () => setActiveModal('damage'))} 
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left ${clickedId === 'btn-damage' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    Damage Liability Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={(e) => handleItemClick(e, 'btn-faq', () => navigate('/', { state: { scrollTo: 'faq' } }))} 
                    className={`text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left ${clickedId === 'btn-faq' ? 'animate-click text-[#43B062]' : ''}`}
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group/item">
                  <FiMapPin className="text-[#43B062] mt-1 flex-shrink-0 group-hover/item:animate-bounce" />
                  <span className="text-gray-400 text-sm group-hover/item:text-white transition-colors">No. 45, Main Street,<br/>Kuruwita, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group/item">
                  <FiPhone className="text-[#43B062] flex-shrink-0 group-hover/item:rotate-12 transition-transform" />
                  <span className="text-gray-400 text-sm group-hover/item:text-white transition-colors">+94 77 123 4567</span>
                </li>
                <li className="flex items-center gap-3 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group/item">
                  <FiMail className="text-[#43B062] flex-shrink-0 group-hover/item:-rotate-12 transition-transform" />
                  <span className="text-gray-400 text-sm group-hover/item:text-white transition-colors">info@tpsound.lk</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-[#2a2a2a] flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <p className="text-gray-500 text-sm">© 2026 T.P. Sound & Musical Gear Rentals. All rights reserved.</p>
            <p className="text-gray-500 text-sm">Designed & Developed by Group 44</p>
          </div>
        </div>
      </footer>

      {/* REALISTIC GLASSMORPHISM MODAL LOGIC */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          
          <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[85vh] animate-fade-in-up">
            
            <div className="px-6 py-5 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {modalData[activeModal].title}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{modalData[activeModal].subtitle}</p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-300"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
                {modalData[activeModal].content}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-white/10 bg-[#0f0f0f]/50 rounded-b-2xl">
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#43B062] text-black font-bold py-3.5 rounded-lg hover:bg-[#369a50] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_-5px_rgba(67,176,98,0.5)] flex justify-center items-center"
              >
                I Understand & Accept
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Footer;