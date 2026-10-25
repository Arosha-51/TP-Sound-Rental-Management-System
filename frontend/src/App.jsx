import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import BookingForm from './pages/BookingForm';
import Dashboard from './pages/Dashboard';
import TrackBooking from './pages/TrackBooking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/track" element={<TrackBooking />} />
      </Routes>
    </Router>
  );
}

export default App;