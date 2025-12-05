import React from 'react';
import { ViewType } from '../types';
import { LayoutGrid, Home, User, Cloud } from 'lucide-react';

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="w-full h-20 bg-macdonald-dark border-b border-macdonald-gold/30 flex items-center justify-between px-8 relative z-50 backdrop-blur-sm bg-opacity-90">
      {/* Brand Area */}
      <div 
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => onNavigate(ViewType.DASHBOARD)}
      >
        <div className="w-10 h-10 bg-macdonald-gold skew-x-[-10deg] flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.5)] group-hover:animate-pulse">
           <span className="text-macdonald-dark font-bold text-xl skew-x-[10deg]">M</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-widest uppercase text-white leading-none">Macdonald</h1>
          <span className="text-macdonald-gold text-xs tracking-[0.3em] uppercase">Creative Workbench</span>
        </div>
      </div>

      {/* Center Status */}
      <div className="hidden md:flex items-center gap-6">
        <div className="px-6 py-2 bg-black/40 border border-white/10 skew-x-[-10deg]">
          <span className="text-gray-400 text-sm skew-x-[10deg]">SYSTEM: <span className="text-green-400 font-bold">ONLINE</span></span>
        </div>
        <div className="px-6 py-2 bg-black/40 border border-white/10 skew-x-[-10deg]">
           <span className="text-gray-400 text-sm skew-x-[10deg]">ENGINE: <span className="text-macdonald-gold font-bold">GEMINI 2.5</span></span>
        </div>
      </div>

      {/* User Profile & Google Badge */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-white font-semibold">Alex Cameron</span>
          <span className="text-xs text-gray-400">Head of Digital</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-macdonald-gold overflow-hidden">
          <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-500 border-l border-gray-700 pl-4 ml-2">
            <Cloud size={14} />
            <span>Powered by<br/>Google Cloud</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
