import React, { useState } from 'react';
import { Download, Image as ImageIcon, CheckCircle } from 'lucide-react';

const CreateAssets: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setCompleted(true);
    }, 2000);
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <div className="mb-8 border-l-4 border-macdonald-gold pl-4">
        <h2 className="text-3xl font-bold uppercase text-white">Create Digital Assets</h2>
        <p className="text-macdonald-gold tracking-widest text-sm">Module B // Quick Asset Builder</p>
      </div>

      <div className="max-w-2xl mx-auto bg-black/40 border border-white/10 p-8 backdrop-blur-md">
        <h3 className="text-xl text-white font-bold uppercase mb-6 border-b border-white/10 pb-4">Asset Configuration</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-xs text-macdonald-gold uppercase block mb-2">Asset Type</label>
            <select className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-macdonald-gold focus:outline-none">
              <option>Social Media Profile Graphics</option>
              <option>Email Template Headers</option>
              <option>Website Hero Images</option>
              <option>Print Collateral (PDF)</option>
              <option>Event Banners (Large Format)</option>
            </select>
          </div>

          <div>
             <label className="text-xs text-macdonald-gold uppercase block mb-2">Visual Theme</label>
             <div className="grid grid-cols-3 gap-3">
               {['Seasonal', 'Corporate', 'Leisure'].map(theme => (
                 <button key={theme} className="border border-white/20 py-2 hover:bg-white/10 text-sm text-gray-300 uppercase focus:border-macdonald-gold focus:text-macdonald-gold">
                   {theme}
                 </button>
               ))}
             </div>
          </div>

          {!completed ? (
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 bg-macdonald-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
            >
              {generating ? 'Processing Request...' : 'Generate Asset Package'}
            </button>
          ) : (
            <div className="mt-8 animate-in fade-in zoom-in duration-300">
               <div className="bg-green-900/30 border border-green-500/50 p-4 flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" />
                    <div>
                      <h4 className="text-white font-bold uppercase text-sm">Generation Complete</h4>
                      <p className="text-[10px] text-gray-400">5 High-Res Assets Ready</p>
                    </div>
                 </div>
               </div>
               <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                 <Download size={18} /> Download ZIP Package (158 MB)
               </button>
               <button 
                onClick={() => setCompleted(false)}
                className="w-full py-2 mt-2 text-gray-500 hover:text-white text-xs uppercase"
               >
                 Create New Batch
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAssets;
