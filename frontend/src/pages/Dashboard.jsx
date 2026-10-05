import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Active Rentals', value: '12', color: 'neon', icon: '📊' },
    { title: 'Pending Approvals', value: '4', color: 'yellow', icon: '⏳' },
    { title: 'Overdue Returns', value: '2', color: 'red', icon: '⚠️' },
    { title: 'Monthly Revenue', value: 'LKR 185,000', color: 'neon', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* ===== HEADER WITH LOGO ===== */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="TP Sound Logo"
              className="w-14 h-14 object-contain"
            />
            <div>
              <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-neon transition"
          >
            ← Back to Catalog
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-neon">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Pending Requests Table */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Pending Booking Requests
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border text-left">
                <th className="pb-3 text-gray-400 text-sm">Customer</th>
                <th className="pb-3 text-gray-400 text-sm">Equipment</th>
                <th className="pb-3 text-gray-400 text-sm">Dates</th>
                <th className="pb-3 text-gray-400 text-sm">Total</th>
                <th className="pb-3 text-gray-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-border">
                <td className="py-3 text-white">Sahan Fernando</td>
                <td className="py-3 text-gray-400">Roland XPS-30</td>
                <td className="py-3 text-gray-400">Aug 22 - Aug 24</td>
                <td className="py-3 text-neon">LKR 10,000</td>
                <td className="py-3">
                  <button className="bg-neon text-dark px-3 py-1 rounded text-sm mr-2">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;