import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ItemDetails from './pages/ItemDetails'; // 👈 අලුතෙන් එකතු කළා
import BookingForm from './pages/BookingForm';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import TrackBooking from './pages/TrackBooking';
import AdminInventory from './pages/AdminInventory';
import Analytics from './pages/Analytics';
import AdminLayout from './components/AdminLayout'; 
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/equipment/:id" element={<ItemDetails />} /> {/* 👈 අලුත් Route එක */}
        <Route path="/book" element={<BookingForm />} />
        <Route path="/track" element={<TrackBooking />} />
        
        {/* Admin Routes (Wrapped in Layout) */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/inventory" element={<AdminLayout><AdminInventory /></AdminLayout>} />
        <Route path="/admin/check-in" element={<AdminLayout><CheckIn /></AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />
      </Routes>

      <FloatingWhatsApp />
    </Router>
  );
}

export default App;