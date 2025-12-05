import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CreateAdvert from './components/CreateAdvert';
import CreateAssets from './components/CreateAssets';
import IdeaGeneration from './components/IdeaGeneration';
import Analytics from './components/Analytics';
import { ViewType, GeneratedIdea, MarketingRequest } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [prefillData, setPrefillData] = useState<Partial<MarketingRequest> | undefined>(undefined);

  const handleNavigate = (view: ViewType) => {
    // Clear prefill data if going back to dashboard
    if (view === ViewType.DASHBOARD) {
        setPrefillData(undefined);
    }
    setCurrentView(view);
  };

  const handleIdeaSelected = (idea: GeneratedIdea) => {
    // Transform idea into marketing request data for Module A
    const requestData: Partial<MarketingRequest> = {
        name: idea.title,
        description: `Concept Pitch: ${idea.pitch}\n\nVisual Direction: ${idea.visuals}`,
        type: 'Campaign',
        businessReason: 'Generated from Idea Lab'
    };
    setPrefillData(requestData);
    setCurrentView(ViewType.MODULE_A);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-macdonald-dark via-black to-slate-900 text-white font-sans selection:bg-macdonald-gold selection:text-black">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="h-[calc(100vh-80px)] overflow-hidden relative">
        {/* Render Views based on State */}
        {currentView === ViewType.DASHBOARD && (
          <Dashboard onNavigate={handleNavigate} />
        )}
        
        {currentView === ViewType.MODULE_A && (
          <CreateAdvert initialData={prefillData} />
        )}

        {currentView === ViewType.MODULE_B && (
          <CreateAssets />
        )}

        {currentView === ViewType.MODULE_C && (
          <IdeaGeneration onIdeaSelected={handleIdeaSelected} />
        )}

        {currentView === ViewType.MODULE_D && (
          <Analytics />
        )}

        {/* Global Back Button (if not on Dashboard) */}
        {currentView !== ViewType.DASHBOARD && (
           <div className="absolute top-4 right-8 z-50">
               <button 
                onClick={() => handleNavigate(ViewType.DASHBOARD)}
                className="text-xs text-gray-500 hover:text-macdonald-gold uppercase tracking-widest flex items-center gap-1 transition-colors"
               >
                 Close Module [X]
               </button>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
