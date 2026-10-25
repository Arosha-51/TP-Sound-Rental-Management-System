import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import BookingForm from './pages/BookingForm';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import TrackBooking from './pages/TrackBooking'; // 👈 මේක අලුතෙන් එකතු කළා

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/book" element={<BookingForm />} />
        
        {/* 👇 අලුත් Track Booking Route එක මෙතන තියෙන්නේ 👇 */}
        <Route path="/track" element={<TrackBooking />} />
        
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/check-in" element={<CheckIn />} />
      </Routes>
    </Router>
  );
}

export default App;