import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import BookingForm from './pages/BookingForm';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/check-in" element={<CheckIn />} />
      </Routes>
    </Router>
  );
}

export default App;