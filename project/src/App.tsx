import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Gamepad2, History } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import RentalTable from './pages/RentalTable';
import RentalHistory from './pages/RentalHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-indigo-600 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gamepad2 size={32} />
                <h1 className="text-2xl font-bold">PS Rental Dashboard</h1>
              </div>
              <nav className="flex space-x-4">
                <Link to="/" className="text-white hover:text-indigo-200 transition">
                  Dashboard
                </Link>
                <Link to="/rentals" className="text-white hover:text-indigo-200 transition">
                  Rental Table
                </Link>
                <Link to="/history" className="text-white hover:text-indigo-200 transition">
                  History
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rentals" element={<RentalTable />} />
          <Route path="/history" element={<RentalHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App