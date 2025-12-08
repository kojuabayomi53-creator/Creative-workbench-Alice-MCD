import React, { useState, useEffect } from 'react';
import { MarketingRequest, AssetVersion } from '../types';
import { generateCreativeConcepts, generateHighQualityImage, generateVeoVideo, generateVoiceover, optimizePromptWithKim } from '../services/geminiService';
import { AlertTriangle, Play, Monitor, Volume2, BrainCircuit, Type, Image as ImageIcon, Wand2, Download, MousePointer2, Sparkles, User, RefreshCw, Check, Edit2 } from 'lucide-react';

interface CreateAdvertProps {
  initialData?: Partial<MarketingRequest>;
  guidelinesActive: boolean;
}

const CreateAdvert: React.FC<CreateAdvertProps> = ({ initialData, guidelinesActive }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedAssets, setGeneratedAssets] = useState<AssetVersion[]>([]);
  
  // Agent Kim State
  const [masterPrompt, setMasterPrompt] = useState<string>('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  // Editor State
  const [selectedAsset, setSelectedAsset] = useState<AssetVersion | null>(null);
  const [editorText, setEditorText] = useState<string>('');
  const [editorMode, setEditorMode] = useState<'view' | 'text' | 'crop'>('view');
  
  const [selectedFormat, setSelectedFormat] = useState<'image' | 'video' | 'audio'>('image');
  
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

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // PHASE 1: Consult Agent Kim
  const handleConsultKim = async () => {
      if (!formData.description) return;
      setLoading(true);
      setLoadingMessage("Consulting Agent Kim... (Researching Competitors & Guidelines)");
      
      const optimized = await optimizePromptWithKim(formData.description, guidelinesActive);
      setMasterPrompt(optimized);
      
      setLoading(false);
      setStep(2); // Go to Approval Step
  };

  // PHASE 2: Generate Concepts & Assets
  const handleGenerate = async () => {
    setLoading(true);
    setStep(3); // Loading UI
    
    // 1. Thinking Phase
    setLoadingMessage("Gemini 3 Pro is Thinking... (Analysing Strategy)");
    const concepts = await generateCreativeConcepts(formData, masterPrompt);
    setGeneratedAssets(concepts);

    // 2. Rendering Phase
    if (concepts.length > 0) {
      const hero = concepts[0];
      
      if (selectedFormat === 'image') {
        setLoadingMessage("Generating 20 High-Definition Campaign Variations...");
        // Generate image for the HERO concept immediately
        const imgUrl = await generateHighQualityImage(hero.description || hero.title, "16:9", "1K");
        if (imgUrl) hero.imageUrl = imgUrl;
        
        setSelectedAsset(hero);
        setEditorText(hero.title.toUpperCase());

      } else if (selectedFormat === 'video') {
         setLoadingMessage("Generating Video with Veo (This may take a minute)...");
         const vidUrl = await generateVeoVideo(hero.description || hero.title);
         if (vidUrl) {
           hero.videoUrl = vidUrl;
           hero.format = 'video';
         }
      } else if (selectedFormat === 'audio') {
         setLoadingMessage("Synthesizing Neural Audio...");
         const audioUrl = await generateVoiceover(hero.description || hero.title);
         if (audioUrl) {
           hero.audioUrl = audioUrl;
           hero.format = 'audio';
         }
      }
    }

    setLoading(false);
    setStep(4);
  };

  const handleEditorSelect = async (asset: AssetVersion) => {
      // Lazy load image if needed for other variations
      if (selectedFormat === 'image' && asset.imageUrl.includes('picsum')) {
          const newUrl = await generateHighQualityImage(asset.description || asset.title, "16:9", "1K");
          if (newUrl) asset.imageUrl = newUrl;
      }
      setSelectedAsset(asset);
      setEditorText(asset.title.toUpperCase());
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto pb-24 font-sans">
      
      {/* Header */}
      <div className="mb-8 border-l-4 border-macdonald-gold pl-4 flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold uppercase text-white font-serif tracking-wide">Create Digital Advert</h2>
            <p className="text-macdonald-gold tracking-widest text-sm">Module A // Creative Generation</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 border border-white/10 px-3 py-1 rounded-full bg-black/30">
            <BrainCircuit size={14} className="text-purple-400" />
            <span>Thinking Mode: Enabled</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* Left Panel - Inputs (Collapsed when editing) */}
        <div className={`lg:col-span-3 space-y-6 transition-all duration-500 ${step >= 4 ? 'hidden lg:block lg:opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Step 1: Request Data */}
          <div className="bg-macdonald-green/20 border border-macdonald-gold/20 p-6 rounded-lg backdrop-blur-md">
            <h3 className="text-white font-serif font-bold uppercase mb-4 flex items-center gap-2">
                <span className="bg-macdonald-gold text-macdonald-dark w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span> 
                Campaign Data
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-macdonald-gold uppercase block mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 p-3 text-white focus:border-macdonald-gold focus:outline-none rounded" 
                  placeholder="e.g. Q4 Winter Golf"
                />
              </div>
               <div>
                <label className="text-xs text-macdonald-gold uppercase block mb-1">Brief Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 p-3 text-white h-32 focus:border-macdonald-gold focus:outline-none resize-none rounded text-sm" 
                  placeholder="Describe the offer, mood, and target audience..."
                />
              </div>
            </div>
          </div>

          {/* Step 2: Format */}
          <div className="bg-macdonald-green/20 border border-macdonald-gold/20 p-6 rounded-lg backdrop-blur-md">
            <h3 className="text-white font-serif font-bold uppercase mb-4 flex items-center gap-2">
                <span className="bg-macdonald-gold text-macdonald-dark w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span> 
                Output Format
            </h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setSelectedFormat('image')}
                className={`w-full py-3 border text-xs uppercase text-left px-4 flex justify-between transition-all rounded ${selectedFormat === 'image' ? 'bg-macdonald-gold text-macdonald-dark border-macdonald-gold font-bold' : 'border-white/10 hover:bg-white/5'}`}
              >
                Still Image <Monitor size={14}/>
              </button>
              <button 
                onClick={() => setSelectedFormat('video')}
                className={`w-full py-3 border text-xs uppercase text-left px-4 flex justify-between transition-all rounded ${selectedFormat === 'video' ? 'bg-macdonald-gold text-macdonald-dark border-macdonald-gold font-bold' : 'border-white/10 hover:bg-white/5'}`}
              >
                Veo Video <Play size={14}/>
              </button>
              <button 
                onClick={() => setSelectedFormat('audio')}
                className={`w-full py-3 border text-xs uppercase text-left px-4 flex justify-between transition-all rounded ${selectedFormat === 'audio' ? 'bg-macdonald-gold text-macdonald-dark border-macdonald-gold font-bold' : 'border-white/10 hover:bg-white/5'}`}
              >
                Audio <Volume2 size={14}/>
              </button>
            </div>
          </div>

          {/* Action Button */}
          {step === 1 && (
            <button 
                onClick={handleConsultKim}
                disabled={!formData.description}
                className={`w-full py-4 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded shadow-lg
                ${formData.description 
                    ? 'bg-gradient-to-r from-macdonald-gold to-yellow-600 text-black hover:scale-[1.02]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}
                `}
            >
                <Sparkles size={16} /> Consult Agent Kim
            </button>
          )}
        </div>

        {/* Right Panel - Visualization / Editor Area */}
        <div className="lg:col-span-9 relative min-h-[600px] border border-white/5 bg-macdonald-dark/50 rounded-xl p-6 flex flex-col shadow-2xl">
          
          {/* Loading State */}
          {step === 3 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-macdonald-dark/90 backdrop-blur-sm rounded-xl">
              <div className="w-64 mb-4">
                 <div className="w-full h-1 bg-gray-800 overflow-hidden relative rounded-full">
                    <div className="absolute inset-0 bg-macdonald-gold animate-progress-indeterminate"></div>
                 </div>
              </div>
              <p className="text-macdonald-gold animate-pulse tracking-widest uppercase text-sm text-center">{loadingMessage}</p>
            </div>
          )}

          {/* --- STEP 2: AGENT KIM APPROVAL --- */}
          {step === 2 && (
             <div className="flex flex-col h-full items-center justify-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
                 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-macdonald-gold to-yellow-700 p-[2px] mb-6 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                    <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
                        <User size={40} className="text-macdonald-gold" />
                    </div>
                 </div>
                 
                 <h3 className="text-2xl font-serif text-white mb-2">Agent Kim's Strategy</h3>
                 <p className="text-gray-400 text-center mb-8 text-sm">
                    I've analyzed your brief against the Macdonald Brand Guidelines and current competitor trends. 
                    Here is the Master Visual Direction I recommend.
                 </p>

                 <div className="w-full bg-black/40 border border-macdonald-gold/30 p-6 rounded-lg relative group">
                    <div className="absolute -top-3 left-4 bg-macdonald-dark px-2 text-xs text-macdonald-gold uppercase tracking-widest border border-macdonald-gold/30">Master Prompt</div>
                    
                    {isEditingPrompt ? (
                        <textarea 
                            value={masterPrompt}
                            onChange={(e) => setMasterPrompt(e.target.value)}
                            className="w-full bg-transparent text-white font-light text-lg leading-relaxed focus:outline-none min-h-[150px] resize-none"
                        />
                    ) : (
                        <p className="text-white font-light text-lg leading-relaxed italic">
                            "{masterPrompt}"
                        </p>
                    )}

                    <button 
                        onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                        className="absolute bottom-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                 </div>

                 <div className="flex gap-4 mt-8 w-full">
                     <button 
                        onClick={handleConsultKim}
                        className="flex-1 py-3 border border-white/20 text-gray-300 uppercase text-xs font-bold tracking-widest hover:bg-white/5 rounded transition-colors flex items-center justify-center gap-2"
                     >
                        <RefreshCw size={14} /> Regenerate
                     </button>
                     <button 
                        onClick={handleGenerate}
                        className="flex-1 py-3 bg-macdonald-gold text-black uppercase text-xs font-bold tracking-widest hover:bg-white rounded transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-macdonald-gold/20"
                     >
                        <Check size={16} /> Approve & Generate
                     </button>
                 </div>
             </div>
          )}
          
          {/* --- VIDEO / AUDIO RESULT VIEW (Classic) --- */}
          {step === 4 && selectedFormat !== 'image' && (
              <div className="flex flex-col items-center justify-center h-full w-full animate-in fade-in">
                  {generatedAssets.map((asset) => (
                    asset.format === selectedFormat ? (
                        <div key={asset.id} className="w-full max-w-2xl bg-black border border-white/10 p-4 rounded-lg shadow-2xl">
                             <div className="aspect-video w-full bg-gray-900 mb-4 relative rounded overflow-hidden">
                                {asset.videoUrl && <video src={asset.videoUrl} controls autoPlay loop className="w-full h-full object-cover"/>}
                                {asset.audioUrl && (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <Volume2 size={64} className="text-macdonald-gold animate-pulse mb-4"/>
                                        <audio src={asset.audioUrl} controls className="w-2/3"/>
                                    </div>
                                )}
                             </div>
                             <h3 className="text-xl text-white font-serif">{asset.title}</h3>
                             <p className="text-gray-400 font-light">{asset.description}</p>
                        </div>
                    ) : null
                  ))}
              </div>
          )}

          {/* --- IMAGE EDITOR VIEW (New Feature) --- */}
          {step === 4 && selectedFormat === 'image' && selectedAsset && (
             <div className="flex flex-col h-full gap-6 animate-in fade-in">
                
                {/* Editor Toolbar */}
                <div className="flex items-center justify-between bg-black/40 border border-white/10 p-2 rounded-t-lg">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setEditorMode('text')}
                            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase font-bold transition-all rounded ${editorMode === 'text' ? 'bg-macdonald-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                        >
                            <Type size={14}/> Add Text
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-xs uppercase font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all rounded">
                            <ImageIcon size={14}/> Add Logo
                        </button>
                         <button className="flex items-center gap-2 px-4 py-2 text-xs uppercase font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all rounded">
                            <Wand2 size={14}/> Filters
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-white text-black text-xs uppercase font-bold hover:bg-macdonald-gold transition-colors rounded shadow-lg">
                        <Download size={14}/> Export High-Res
                    </button>
                </div>

                {/* Main Workspace Split */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Canvas */}
                    <div className="lg:col-span-2 bg-gray-900 border border-white/10 relative overflow-hidden flex items-center justify-center group rounded shadow-inner">
                        <img src={selectedAsset.imageUrl} alt="Canvas" className="w-full h-full object-cover" />
                        
                        {/* Simulated Text Layer */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 pointer-events-none">
                            <h2 className="text-5xl font-bold text-white uppercase drop-shadow-lg tracking-widest leading-tight mb-2 font-serif border-b-4 border-macdonald-gold pb-2">
                                {editorText}
                            </h2>
                            <p className="text-white text-lg drop-shadow-md uppercase tracking-[0.2em] bg-black/40 px-4 py-1 font-sans">
                                {formData.location}
                            </p>
                            <button className="mt-8 bg-macdonald-gold text-black px-8 py-3 uppercase font-bold tracking-widest text-sm shadow-xl hover:bg-white transition-colors pointer-events-auto rounded">
                                Book Your Stay
                            </button>
                        </div>

                        {/* Edit Controls Overlay (Visible on hover/mode) */}
                        {editorMode === 'text' && (
                             <div className="absolute top-4 right-4 bg-black/80 p-4 border border-macdonald-gold backdrop-blur-sm w-64 rounded-lg shadow-xl">
                                <label className="text-xs text-macdonald-gold uppercase block mb-2">Headline Text</label>
                                <input 
                                    type="text" 
                                    value={editorText} 
                                    onChange={(e) => setEditorText(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 p-2 text-white text-sm focus:outline-none focus:border-macdonald-gold rounded"
                                />
                             </div>
                        )}
                    </div>

                    {/* Sidebar: Recommended Variations */}
                    <div className="border-l border-white/10 pl-6 flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar lg:grid-cols-4">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="text-white text-sm font-bold uppercase tracking-widest">Variations (20)</h4>
                             <span className="text-[10px] text-macdonald-gold border border-macdonald-gold px-2 py-0.5 rounded-full">AI Suggested</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            {generatedAssets.map((asset, idx) => (
                                <div 
                                    key={asset.id} 
                                    onClick={() => handleEditorSelect(asset)}
                                    className={`relative cursor-pointer group border transition-all rounded overflow-hidden aspect-square ${selectedAsset.id === asset.id ? 'border-macdonald-gold ring-2 ring-macdonald-gold' : 'border-white/10 hover:border-white/40'}`}
                                >
                                    <img src={asset.imageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] font-bold uppercase">Select</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
             </div>
          )}

          {/* Default Placeholder */}
          {step === 1 && (
             <div className="flex items-center justify-center h-full border-2 border-dashed border-white/5 opacity-50 rounded-xl">
                <div className="text-center">
                  <Monitor size={64} className="mx-auto mb-4 text-gray-600" />
                  <p className="uppercase tracking-widest text-gray-500">Workspace Ready</p>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CreateAdvert;