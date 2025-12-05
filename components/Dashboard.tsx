import React from 'react';
import { ViewType } from '../types';
import { PenTool, Image, Lightbulb, BarChart2, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

const DashboardTile: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  bgImage: string;
}> = ({ title, subtitle, icon, color, onClick, bgImage }) => (
  <button 
    onClick={onClick}
    className="group relative h-full w-full overflow-hidden border border-white/10 bg-black/60 transition-all hover:border-macdonald-gold hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-macdonald-gold"
  >
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60 group-hover:scale-110">
      <img src={bgImage} alt="" className="w-full h-full object-cover" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-macdonald-dark via-macdonald-dark/80 to-transparent" />
    
    {/* Content */}
    <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start text-left z-10">
      <div className={`mb-4 p-3 rounded-none bg-${color} text-black skew-x-[-10deg]`}>
        <div className="skew-x-[10deg]">{icon}</div>
      </div>
      <h2 className="text-3xl font-bold uppercase tracking-wider text-white mb-1 group-hover:text-macdonald-gold transition-colors">{title}</h2>
      <p className="text-gray-400 text-sm font-light tracking-widest uppercase">{subtitle}</p>
      
      {/* Active Indicator Line */}
      <div className="mt-6 w-12 h-1 bg-white/20 group-hover:w-full group-hover:bg-macdonald-gold transition-all duration-500" />
    </div>

    {/* Hover Arrow */}
    <div className="absolute top-8 right-8 text-white/20 group-hover:text-macdonald-gold transition-colors">
        <ChevronRight size={40} />
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="w-full h-[calc(100vh-80px)] p-8 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-macdonald-green/20 to-transparent pointer-events-none" />

      <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Module A: Advert */}
        <DashboardTile 
          title="Create Advert"
          subtitle="Campaign Generation Engine"
          icon={<PenTool size={24} />}
          color="white"
          bgImage="https://picsum.photos/800/600?grayscale&blur=2"
          onClick={() => onNavigate(ViewType.MODULE_A)}
        />

        {/* Module B: Assets */}
        <DashboardTile 
          title="Create Assets"
          subtitle="Ad-Hoc Static Builder"
          icon={<Image size={24} />}
          color="white"
          bgImage="https://picsum.photos/800/601?grayscale&blur=2"
          onClick={() => onNavigate(ViewType.MODULE_B)}
        />

        {/* Module C: Ideas */}
        <DashboardTile 
          title="Idea Lab"
          subtitle="AI Creative Brainstorm"
          icon={<Lightbulb size={24} />}
          color="white"
          bgImage="https://picsum.photos/800/602?grayscale&blur=2"
          onClick={() => onNavigate(ViewType.MODULE_C)}
        />

        {/* Module D: Analytics */}
        <DashboardTile 
          title="Behaviour"
          subtitle="Performance & Insights"
          icon={<BarChart2 size={24} />}
          color="white"
          bgImage="https://picsum.photos/800/603?grayscale&blur=2"
          onClick={() => onNavigate(ViewType.MODULE_D)}
        />

      </div>
    </div>
  );
};

export default Dashboard;
