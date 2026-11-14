import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 useNavigate අලුතෙන් එකතු කළා
import logo from '../assets/Logo.png';
import { FiMapPin, FiPhone, FiMail, FiX } from 'react-icons/fi';

function Footer() {
  const navigate = useNavigate(); // 👈 Navigation එකට
  const [activeModal, setActiveModal] = useState(null);

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
      <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] pt-16 pb-8 mt-auto relative z-40">
        <div className="max-w-7xl mx-auto px-6">
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
                <li><Link to="/" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">Home</Link></li>
                <li><Link to="/catalog" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">Browse Catalog</Link></li>
                <li><Link to="/track" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">Track My Booking</Link></li>
                <li><Link to="/login" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">Sign In / Register</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Support</h3>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => setActiveModal('terms')} className="text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('damage')} className="text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left">
                    Damage Liability Policy
                  </button>
                </li>
                {/* 👇 අලුතෙන් එකතු කරපු FAQ ලින්ක් එක (Home එකේ FAQ එකට යනවා) 👇 */}
                <li>
                  <button 
                    onClick={() => navigate('/', { state: { scrollTo: 'faq' } })} 
                    className="text-gray-400 text-sm hover:text-[#43B062] transition-colors text-left"
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
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-[#43B062] mt-1 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">No. 45, Main Street,<br/>Kuruwita, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone className="text-[#43B062] flex-shrink-0" />
                  <span className="text-gray-400 text-sm">+94 77 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail className="text-[#43B062] flex-shrink-0" />
                  <span className="text-gray-400 text-sm">info@tpsound.lk</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-[#2a2a2a] flex flex-col md:flex-row justify-between items-center gap-4">
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