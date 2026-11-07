import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';

// Recharts වලට ලස්සන පාටවල්
const COLORS = ['#43B062', '#3b82f6', '#eab308', '#ef4444', '#a855f7'];

const Analytics = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({ revenueByCategory: [], monthlyRevenue: [] });
  const [loading, setLoading] = useState(true);

  // BB හදපු API එකෙන් Data අදිනවා
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/stats/charts');
        setChartData(res.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  // මාසේ අංකය (10) වෙනුවට නම (Oct) පෙන්නන්න
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthlyData = chartData.monthlyRevenue.map(item => ({
    ...item,
    monthName: monthNames[item.month - 1]
  }));

  return (
    <div className="min-h-screen bg-dark">
      {/* HEADER */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TP Sound Logo" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-neon font-bold text-lg">TP Sound &</h1>
              <p className="text-gray-400 text-xs">Musical Gear Rentals</p>
            </div>
          </div>
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-neon transition font-semibold">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-white mb-8 border-b border-dark-border pb-4">Analytics & Reports</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-neon text-xl animate-pulse">Loading analytics data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Revenue by Category (Pie Chart) */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-lg hover:border-neon/50 transition duration-300">
              <h3 className="text-xl font-bold text-white mb-6">Revenue by Category</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.revenueByCategory}
                      cx="50%" 
                      cy="50%" 
                      innerRadius={70} 
                      outerRadius={110} 
                      paddingAngle={5}
                      dataKey="value" 
                      nameKey="name"
                      isAnimationActive={true} // Chart එක එද්දී ලස්සන Animation එකක්
                    >
                      {chartData.revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#43B062', color: '#fff', borderRadius: '8px' }} 
                      formatter={(value) => `LKR ${value.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Monthly Revenue (Line Chart) */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-lg hover:border-neon/50 transition duration-300">
              <h3 className="text-xl font-bold text-white mb-6">Monthly Revenue Growth</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="monthName" stroke="#888" tick={{ fill: '#888' }} />
                    <YAxis stroke="#888" tick={{ fill: '#888' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#43B062', color: '#fff', borderRadius: '8px' }} 
                      formatter={(value) => `LKR ${value.toLocaleString()}`}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle"/>
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue" 
                      stroke="#43B062" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: '#43B062', strokeWidth: 2, stroke: '#131313' }} 
                      activeDot={{ r: 8, fill: '#fff' }} 
                      isAnimationActive={true} // Line එක ඇඳෙන Animation එක
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;