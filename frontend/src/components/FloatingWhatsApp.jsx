import { useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  const location = useLocation();
  
  // Admin පැත්තට යද්දී මේ බටන් එක අයින් කරන්න (Hide on admin routes)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <a 
      href="https://wa.me/94771234567" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:shadow-[0_0_30px_rgba(37,211,102,0.8)] hover:-translate-y-1 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={32} className="group-hover:animate-pulse" />
    </a>
  );
};

export default FloatingWhatsApp;