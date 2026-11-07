import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import BookingForm from './pages/BookingForm';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import TrackBooking from './pages/TrackBooking';
import AdminInventory from './pages/AdminInventory';
import Analytics from './pages/Analytics'; // 👈 අලුතෙන් එකතු කළා

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/check-in" element={<CheckIn />} />
        <Route path="/track" element={<TrackBooking />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        
        {/* 👇 අලුතෙන් එකතු කරපු Analytics Route එක */}
        <Route path="/admin/analytics" element={<Analytics />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;