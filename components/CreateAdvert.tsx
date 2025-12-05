import React, { useState, useEffect, useRef } from 'react';
import { MarketingRequest, AssetVersion } from '../types';
import { Upload, AlertTriangle, Check, Play, Smartphone, Youtube, Instagram, Monitor, X, FileText, Trash2 } from 'lucide-react';

interface CreateAdvertProps {
  initialData?: Partial<MarketingRequest>;
}

const CreateAdvert: React.FC<CreateAdvertProps> = ({ initialData }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedAssets, setGeneratedAssets] = useState<AssetVersion[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetVersion | null>(null);
  
  // File Upload State
  const [brandFile, setBrandFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<MarketingRequest>({
    name: initialData?.name || '',
    department: initialData?.department || 'Marketing',
    location: initialData?.location || 'Aviemore Resort',
    type: initialData?.type || 'Seasonal Offer',
    description: initialData?.description || '',
    businessReason: initialData?.businessReason || '',
    impactLevel: 50,
  });

  // Load initial data if present
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBrandFile(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBrandFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = () => {
    if (!brandFile) return;

    setLoading(true);
    setStep(4);
    
    // Simulate Progress Bar
    let prog = 0;
    const interval = setInterval(() => {
      prog += 2;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        finishGeneration();
      }
    }, 50);
  };

  const finishGeneration = () => {
    setLoading(false);
    // Mock Assets
    const assets: AssetVersion[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `v${i+1}`,
      title: `Creative Concept V${i+1}: ${['Luxury Escape', 'Family Fun', 'Golf & Spa', 'Dining Delight', 'Highland Retreat'][i]}`,
      imageUrl: `https://picsum.photos/800/600?random=${i}`,
      format: 'image',
      stats: {
        predictedCtr: `${(2.5 + Math.random()).toFixed(1)}%`,
        impressions: '12.5K'
      }
    }));
    setGeneratedAssets(assets);
    setStep(5);
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto pb-24">
      
      {/* Header */}
      <div className="mb-8 border-l-4 border-macdonald-gold pl-4">
        <h2 className="text-3xl font-bold uppercase text-white">Create Digital Advert</h2>
        <p className="text-macdonald-gold tracking-widest text-sm">Module A // Creative Generation</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel - Inputs */}
        <div className={`lg:col-span-4 space-y-6 transition-all duration-500 ${step >= 4 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Step 1: Brand Guidelines */}
          <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-white font-bold uppercase">1. Brand Core Lock</h3>
               <div className={`h-2 w-2 rounded-full animate-pulse ${brandFile ? 'bg-green-500' : 'bg-red-500'}`}></div>
             </div>
             
             <input 
               type="file" 
               accept=".pdf" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleFileChange}
             />

             <div 
               onClick={triggerFileUpload}
               className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-all group relative overflow-hidden
                  ${brandFile ? 'border-macdonald-gold bg-macdonald-gold/10' : 'border-white/20 hover:border-macdonald-gold hover:bg-white/5'}
               `}
             >
                {brandFile ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <FileText className="mx-auto text-macdonald-gold mb-2" size={32} />
                    <p className="text-sm text-white font-medium truncate w-full px-4">{brandFile.name}</p>
                    <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                       <Check size={10} /> Compliance Check Active
                    </p>
                    <button 
                      onClick={clearFile}
                      className="mt-3 p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-macdonald-gold transition-colors" />
                    <p className="text-xs text-gray-400 uppercase group-hover:text-white transition-colors">Upload Guidelines (PDF)</p>
                    <p className="text-[10px] text-gray-600 mt-1 uppercase">Required for generation</p>
                  </>
                )}
             </div>
          </div>

          {/* Step 2: Request Data */}
          <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md">
            <h3 className="text-white font-bold uppercase mb-4">2. Campaign Data</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-macdonald-gold uppercase block mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-macdonald-gold focus:outline-none" 
                  placeholder="e.g. Q4 Winter Golf"
                />
              </div>
               <div>
                <label className="text-xs text-macdonald-gold uppercase block mb-1">Description & Context</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 p-2 text-white h-24 focus:border-macdonald-gold focus:outline-none resize-none" 
                  placeholder="Describe the offer, mood, and target audience..."
                />
              </div>
              
              {/* Contextual Warning Simulation */}
              {formData.description.toLowerCase().includes("beach") && (
                <div className="flex items-center gap-2 text-yellow-500 text-xs bg-yellow-500/10 p-2 border border-yellow-500/30">
                  <AlertTriangle size={12} />
                  <span>Warning: Selected location may not have beach access.</span>
                </div>
              )}

              <div>
                <label className="text-xs text-macdonald-gold uppercase block mb-1">Impact Level (Priority)</label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={formData.impactLevel}
                  onChange={(e) => setFormData({...formData, impactLevel: parseInt(e.target.value)})}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-macdonald-gold"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>LOW</span>
                  <span>HIGH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Format */}
          <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md">
            <h3 className="text-white font-bold uppercase mb-4">3. Output Formats</h3>
            <div className="flex gap-2">
              {['Still Image', 'Motion Video', 'Audio'].map((fmt) => (
                <button key={fmt} className="flex-1 py-3 border border-white/20 text-xs uppercase hover:bg-macdonald-gold hover:text-black hover:border-macdonald-gold transition-all">
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleGenerate}
            disabled={!brandFile}
            className={`w-full py-4 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 skew-x-[-5deg]
               ${brandFile 
                 ? 'bg-macdonald-gold text-black hover:bg-white cursor-pointer' 
                 : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}
            `}
          >
            <span className="skew-x-[5deg]">
              {brandFile ? 'Initialize Generation' : 'Upload Guidelines First'}
            </span>
          </button>

        </div>

        {/* Right Panel - Visualization Area */}
        <div className="lg:col-span-8 relative min-h-[600px] border border-white/5 bg-black/20 p-8">
          
          {/* Loading State */}
          {step === 4 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm">
              <div className="w-64 mb-4">
                 <div className="flex justify-between text-xs text-macdonald-gold mb-1 uppercase">
                    <span>Rendering</span>
                    <span>{progress}%</span>
                 </div>
                 <div className="w-full h-1 bg-gray-800">
                    <div className="h-full bg-macdonald-gold transition-all duration-75" style={{ width: `${progress}%` }}></div>
                 </div>
              </div>
              <p className="text-white animate-pulse tracking-widest uppercase text-sm">Thinking (Gemini 2.5)</p>
            </div>
          )}

          {/* Results Grid */}
          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {generatedAssets.map((asset) => (
                <div 
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="group relative cursor-pointer border border-white/10 bg-black/40 hover:border-macdonald-gold transition-all hover:-translate-y-1"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-bold text-sm truncate">{asset.title}</h4>
                    <div className="flex justify-between mt-2 text-[10px] text-gray-400 uppercase">
                      <span>CTR: <span className="text-green-400">{asset.stats.predictedCtr}</span></span>
                      <span>Format: {asset.format}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Default Placeholder */}
          {step < 4 && (
             <div className="flex items-center justify-center h-full border-2 border-dashed border-white/5">
                <div className="text-center opacity-30">
                  <Monitor size={64} className="mx-auto mb-4" />
                  <p className="uppercase tracking-widest">Waiting for Input</p>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Preview Modal Overlay */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="w-full max-w-6xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-white uppercase flex items-center gap-2">
                 <Play size={24} className="text-macdonald-gold" /> Channel Simulation
               </h2>
               <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-white">
                 <X size={32} />
               </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Instagram Story Preview */}
              <div className="flex flex-col items-center">
                 <span className="text-xs uppercase text-macdonald-gold mb-2 flex items-center gap-1"><Instagram size={14}/> Instagram Story</span>
                 <div className="w-[280px] h-[500px] bg-white text-black relative rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800">
                    <img src={selectedAsset.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <span className="text-white font-bold text-xs drop-shadow-md">Macdonald Hotels</span>
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-xs font-bold uppercase">
                      Book Now
                    </div>
                 </div>
              </div>

              {/* YouTube Pre-roll Preview */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs uppercase text-macdonald-gold mb-2 flex items-center gap-1"><Youtube size={14}/> YouTube Pre-roll</span>
                <div className="w-full aspect-video bg-black relative border-2 border-gray-800">
                   <img src={selectedAsset.imageUrl} className="w-full h-full object-cover opacity-80" />
                   <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 text-white text-[10px]">
                      Ad · 0:15
                   </div>
                   <div className="absolute bottom-4 right-4 bg-white text-black text-xs font-bold px-4 py-2 uppercase cursor-pointer">
                      Skip Ad
                   </div>
                </div>
              </div>

               {/* TikTok Feed Preview */}
               <div className="flex flex-col items-center">
                 <span className="text-xs uppercase text-macdonald-gold mb-2 flex items-center gap-1"><Smartphone size={14}/> TikTok Feed</span>
                 <div className="w-[280px] h-[500px] bg-black text-white relative rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800">
                    <img src={selectedAsset.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center">
                       <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">❤️</div>
                       <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">💬</div>
                    </div>
                    <div className="absolute bottom-4 left-4 pr-12">
                      <p className="font-bold text-sm">Macdonald Hotels</p>
                      <p className="text-xs opacity-90">{selectedAsset.title} #LuxuryWait</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateAdvert;