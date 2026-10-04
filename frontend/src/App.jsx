import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
      </Routes>
    </Router>
  );
}

export default App;