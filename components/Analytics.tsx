import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

const dataAB = [
  { name: 'Direct Clicks', agency: 4000, ai: 5200 },
  { name: 'Conversions', agency: 240, ai: 380 },
  { name: 'Engagement', agency: 2400, ai: 3100 },
];

const dataTrend = [
  { day: 'Mon', bookings: 45 },
  { day: 'Tue', bookings: 52 },
  { day: 'Wed', bookings: 48 },
  { day: 'Thu', bookings: 61 },
  { day: 'Fri', bookings: 85 },
  { day: 'Sat', bookings: 95 },
  { day: 'Sun', bookings: 75 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-macdonald-gold p-3 text-xs">
        <p className="text-white font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const KPICard: React.FC<{ title: string; value: string; change: string; positive: boolean }> = ({ title, value, change, positive }) => (
    <div className="bg-black/40 border border-white/10 p-4 relative overflow-hidden group hover:border-macdonald-gold transition-colors">
        <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        <div className={`flex items-center text-xs ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            <span className="ml-1">{change} vs last month</span>
        </div>
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-12 h-12 rounded-full border-4 border-white"></div>
        </div>
    </div>
);

const Analytics: React.FC = () => {
  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <div className="mb-8 border-l-4 border-macdonald-gold pl-4 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold uppercase text-white">Behaviour & Activity</h2>
            <p className="text-macdonald-gold tracking-widest text-sm">Module D // Performance Intelligence</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 text-xs uppercase rounded">Live Data</span>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Revenue (Q4)" value="£1.2M" change="12%" positive={true} />
        <KPICard title="Direct Booking Share" value="64%" change="5%" positive={true} />
        <KPICard title="Cost Per Acquisition" value="£14.20" change="8%" positive={false} /> {/* Down is good for CPA, but logic simplified for visuals */}
        <KPICard title="Guest Sentiment" value="4.8/5" change="0.2" positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* A/B Test Results */}
        <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md">
           <h3 className="text-white font-bold uppercase mb-6 flex items-center justify-between">
             <span>Creative A/B Test: Agency vs AI</span>
             <span className="text-[10px] bg-macdonald-gold text-black px-2 py-1">Winner: AI</span>
           </h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dataAB}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                 <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
                 <YAxis stroke="#666" fontSize={12} tickLine={false} />
                 <Tooltip content={<CustomTooltip />} />
                 <Bar dataKey="agency" name="Agency Creative" fill="#4b5563" barSize={40} />
                 <Bar dataKey="ai" name="AI (Veo/Imagen)" fill="#c5a059" barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Booking Trend */}
         <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md">
           <h3 className="text-white font-bold uppercase mb-6">Real-time Booking Velocity</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={dataTrend}>
                 <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c5a059" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                 <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} />
                 <YAxis stroke="#666" fontSize={12} tickLine={false} />
                 <Tooltip content={<CustomTooltip />} />
                 <Area type="monotone" dataKey="bookings" stroke="#c5a059" fillOpacity={1} fill="url(#colorBookings)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>

      {/* Heatmap Placeholder (Visual only) */}
      <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md">
         <h3 className="text-white font-bold uppercase mb-4">Regional Demand Heatmap</h3>
         <div className="w-full h-64 bg-slate-900 relative overflow-hidden rounded border border-white/5">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-macdonald-gold/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs tracking-[1em] uppercase">
                Map Data Visualization
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
