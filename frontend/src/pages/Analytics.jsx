import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { FiTrendingUp, FiDollarSign, FiBox, FiActivity } from 'react-icons/fi';

const COLORS = ['#43B062', '#3b82f6', '#eab308', '#ef4444', '#a855f7'];

const Analytics = () => {
  const [chartData, setChartData] = useState({ revenueByCategory: [], monthlyRevenue: [] });
  const [loading, setLoading] = useState(true);

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

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthlyData = chartData.monthlyRevenue.map(item => ({
    ...item,
    monthName: monthNames[item.month - 1]
  }));

  // Calculate total income from monthly revenue data
  const totalIncome = chartData.monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0);
  // Calculate total rentals from category data
  const totalRentals = chartData.revenueByCategory.reduce((acc, curr) => acc + (curr.count || 1), 0);

  if (loading) return <div className="text-center text-[#43B062] mt-20 animate-pulse text-xl">Loading Analytics...</div>;

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of business performance and rental metrics.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#131313] border border-[#2a2a2a] p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Income</p>
              <h3 className="text-2xl font-bold text-white">LKR {totalIncome.toLocaleString()}</h3>
              <p className="text-[#43B062] text-xs mt-2 flex items-center gap-1"><FiTrendingUp /> +14.2% vs last month</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#43B062]/10 flex items-center justify-center text-[#43B062]">
              <FiDollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#2a2a2a] p-6 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Rentals</p>
              <h3 className="text-2xl font-bold text-white">{totalRentals}</h3>
              <p className="text-[#43B062] text-xs mt-2 flex items-center gap-1"><FiTrendingUp /> +8.5% vs last month</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FiBox size={20} />
            </div>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#2a2a2a] p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm">Active vs Completed</p>
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <FiActivity size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">45 / 79</h3>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#43B062]"></span> Active (45)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600"></span> Completed (79)</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Line Chart */}
        <div className="bg-[#131313] border border-[#2a2a2a] p-6 rounded-xl lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedMonthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#43B062" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#43B062" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="monthName" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#2a2a2a', borderRadius: '8px' }} 
                  formatter={(value) => `LKR ${value.toLocaleString()}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#43B062" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#131313] border border-[#2a2a2a] p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-2">Rental Status</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.revenueByCategory}
                  cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5}
                  dataKey="value" nameKey="name" stroke="none"
                >
                  {chartData.revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#2a2a2a', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
              <span className="text-2xl font-bold text-white">{totalRentals}</span>
              <span className="text-xs text-gray-500">Total</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
             {chartData.revenueByCategory.map((entry, index) => (
                <span key={index} className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </span>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;