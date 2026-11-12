import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] pt-16 pb-8">
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
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-[#43B062] hover:border-[#43B062] transition-colors cursor-pointer">Fb</div>
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-[#43B062] hover:border-[#43B062] transition-colors cursor-pointer">Ig</div>
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-[#43B062] hover:border-[#43B062] transition-colors cursor-pointer">Yt</div>
            </div>
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
              <li><a href="#" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">Damage Liability Policy</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-[#43B062] transition-colors">FAQ</a></li>
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
  );
}

export default Footer;