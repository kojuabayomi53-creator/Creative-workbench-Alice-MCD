import React, { useState, useRef } from 'react';
import { Download, Image as ImageIcon, CheckCircle, Video, Wand2, Upload as UploadIcon, X, Sparkles, User, Check } from 'lucide-react';
import { generateHighQualityImage, generateVeoVideo, analyzeImage, optimizePromptWithKim } from '../services/geminiService';

interface CreateAssetsProps {
    guidelinesActive: boolean;
}

const CreateAssets: React.FC<CreateAssetsProps> = ({ guidelinesActive }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'analyze'>('image');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  
  // Agent Kim
  const [kimPrompt, setKimPrompt] = useState('');
  const [showKimModal, setShowKimModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  
  // Image Settings
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resolution, setResolution] = useState('1K');
  
  // Video / Analyze Settings
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow: 1. Optimize (Optional) -> 2. Generate
  const handleOptimize = async () => {
      if(!prompt) return;
      setOptimizing(true);
      const improved = await optimizePromptWithKim(prompt, guidelinesActive);
      setKimPrompt(improved);
      setOptimizing(false);
      setShowKimModal(true);
  };

  const handleApproveKim = () => {
      setPrompt(kimPrompt);
      setShowKimModal(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    setAnalysisResult('');

    if (activeTab === 'image') {
        const url = await generateHighQualityImage(prompt, aspectRatio, resolution);
        setResult(url);
    } else if (activeTab === 'video') {
        let imgBase64 = undefined;
        if (referenceImage) {
            imgBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(referenceImage);
            });
        }
        const url = await generateVeoVideo(prompt, imgBase64 as string | undefined, aspectRatio === '9:16' ? '9:16' : '16:9');
        setResult(url);
    } else if (activeTab === 'analyze' && referenceImage) {
        const text = await analyzeImage(referenceImage);
        setAnalysisResult(text);
    }

    setGenerating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setReferenceImage(e.target.files[0]);
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto relative">
      <div className="mb-8 border-l-4 border-macdonald-gold pl-4">
        <h2 className="text-3xl font-bold uppercase text-white font-serif">Create Digital Assets</h2>
        <p className="text-macdonald-gold tracking-widest text-sm">Module B // Advanced Asset Lab</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
              {/* Tabs */}
              <div className="flex bg-macdonald-dark border border-white/10 p-1 rounded">
                  <button onClick={() => {setActiveTab('image'); setResult(null)}} className={`flex-1 py-2 text-xs uppercase flex items-center justify-center gap-2 rounded transition-colors ${activeTab === 'image' ? 'bg-macdonald-gold text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
                      <ImageIcon size={14} /> Image
                  </button>
                  <button onClick={() => {setActiveTab('video'); setResult(null)}} className={`flex-1 py-2 text-xs uppercase flex items-center justify-center gap-2 rounded transition-colors ${activeTab === 'video' ? 'bg-macdonald-gold text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
                      <Video size={14} /> Veo Video
                  </button>
                   <button onClick={() => {setActiveTab('analyze'); setResult(null)}} className={`flex-1 py-2 text-xs uppercase flex items-center justify-center gap-2 rounded transition-colors ${activeTab === 'analyze' ? 'bg-macdonald-gold text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
                      <Wand2 size={14} /> Analyze
                  </button>
              </div>

              {/* Config Panel */}
              <div className="bg-macdonald-green/20 border border-macdonald-gold/20 p-6 backdrop-blur-md rounded-lg">
                 
                 {/* Common Prompt */}
                 {activeTab !== 'analyze' && (
                     <div className="mb-6 relative">
                         <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-macdonald-gold uppercase">Prompt Description</label>
                            <button 
                                onClick={handleOptimize}
                                disabled={!prompt || optimizing}
                                className="text-[10px] text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                                <Sparkles size={10} className="text-macdonald-gold"/> {optimizing ? 'Kim is Thinking...' : 'Optimize with Kim'}
                            </button>
                         </div>
                         <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 p-3 text-white h-24 focus:border-macdonald-gold focus:outline-none resize-none text-sm rounded"
                            placeholder={activeTab === 'image' ? "A luxury suite overlooking..." : "Cinematic drone shot of..."}
                         />
                     </div>
                 )}

                 {/* Image Specifics */}
                 {activeTab === 'image' && (
                    <div className="space-y-4">
                        <div>
                           <label className="text-xs text-macdonald-gold uppercase block mb-2">Aspect Ratio</label>
                           <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-black/50 border border-white/20 p-2 text-white text-sm rounded focus:border-macdonald-gold outline-none">
                               <option value="1:1">1:1 (Square)</option>
                               <option value="16:9">16:9 (Landscape)</option>
                               <option value="9:16">9:16 (Portrait)</option>
                               <option value="4:3">4:3</option>
                               <option value="3:4">3:4</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs text-macdonald-gold uppercase block mb-2">Resolution (Imagen 3)</label>
                           <div className="flex gap-2">
                               {['1K', '2K', '4K'].map(r => (
                                   <button key={r} onClick={() => setResolution(r)} className={`flex-1 border py-1 text-xs rounded transition-colors ${resolution === r ? 'border-macdonald-gold text-macdonald-gold bg-macdonald-gold/10' : 'border-white/20 text-gray-500 hover:text-white'}`}>{r}</button>
                               ))}
                           </div>
                        </div>
                    </div>
                 )}

                 {/* Video Specifics */}
                 {activeTab === 'video' && (
                     <div className="space-y-4">
                         <div>
                           <label className="text-xs text-macdonald-gold uppercase block mb-2">Aspect Ratio (Veo)</label>
                           <div className="flex gap-2">
                               <button onClick={() => setAspectRatio('16:9')} className={`flex-1 border py-2 text-xs rounded transition-colors ${aspectRatio === '16:9' ? 'border-macdonald-gold text-macdonald-gold bg-macdonald-gold/10' : 'border-white/20 text-gray-500 hover:text-white'}`}>16:9</button>
                               <button onClick={() => setAspectRatio('9:16')} className={`flex-1 border py-2 text-xs rounded transition-colors ${aspectRatio === '9:16' ? 'border-macdonald-gold text-macdonald-gold bg-macdonald-gold/10' : 'border-white/20 text-gray-500 hover:text-white'}`}>9:16</button>
                           </div>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded">
                            <label className="text-[10px] text-gray-400 uppercase block mb-2">Start Image (Optional for Animate)</label>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer flex items-center gap-2 text-xs text-macdonald-gold hover:underline">
                                <UploadIcon size={12} /> {referenceImage ? referenceImage.name : 'Upload Reference Image'}
                            </div>
                            {referenceImage && <button onClick={() => {setReferenceImage(null); if(fileInputRef.current) fileInputRef.current.value=''}} className="text-[10px] text-red-400 mt-1">Remove</button>}
                        </div>
                     </div>
                 )}

                 {/* Analyze Specifics */}
                 {activeTab === 'analyze' && (
                     <div className="space-y-4">
                         <div className="border-2 border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-macdonald-gold rounded-lg transition-colors" onClick={() => fileInputRef.current?.click()}>
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                             {referenceImage ? (
                                 <p className="text-macdonald-gold">{referenceImage.name}</p>
                             ) : (
                                 <>
                                    <UploadIcon className="mx-auto mb-2 text-gray-400" />
                                    <p className="text-xs text-gray-400">Upload Media to Analyze</p>
                                 </>
                             )}
                         </div>
                     </div>
                 )}

                 <button 
                    onClick={handleGenerate}
                    disabled={generating || (activeTab === 'analyze' && !referenceImage)}
                    className="w-full mt-6 py-4 bg-macdonald-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-lg"
                 >
                     {generating ? 'Processing...' : `Generate ${activeTab}`}
                 </button>

              </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-8 bg-black/20 border border-white/5 min-h-[500px] flex items-center justify-center relative p-8 rounded-xl shadow-inner">
              {generating && (
                  <div className="text-center">
                      <div className="w-12 h-12 border-4 border-macdonald-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-macdonald-gold uppercase tracking-widest animate-pulse font-serif">
                          {activeTab === 'video' ? 'Veo is generating video...' : 'Gemini is working...'}
                      </p>
                  </div>
              )}

              {!generating && result && activeTab === 'image' && (
                  <img src={result} alt="Generated" className="max-w-full max-h-full shadow-2xl border border-white/10 rounded" />
              )}

              {!generating && result && activeTab === 'video' && (
                  <video src={result} controls autoPlay loop className="max-w-full max-h-full shadow-2xl border border-white/10 rounded" />
              )}
              
              {!generating && analysisResult && activeTab === 'analyze' && (
                  <div className="bg-black/60 p-6 border border-white/10 max-w-lg rounded-lg">
                      <h3 className="text-macdonald-gold font-bold uppercase mb-4 flex items-center gap-2"><CheckCircle size={16}/> Analysis Complete</h3>
                      <p className="text-white text-sm whitespace-pre-wrap">{analysisResult}</p>
                  </div>
              )}

              {!generating && !result && !analysisResult && (
                  <div className="text-center opacity-30">
                      <Wand2 size={48} className="mx-auto mb-2" />
                      <p className="uppercase font-serif">Output Area</p>
                  </div>
              )}
          </div>
      </div>

      {/* --- KIM REVIEW MODAL --- */}
      {showKimModal && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-macdonald-dark border border-macdonald-gold shadow-[0_0_50px_rgba(197,160,89,0.2)] p-6 max-w-lg w-full rounded-xl">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-macdonald-gold to-yellow-700 p-0.5">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                              <User size={20} className="text-macdonald-gold" />
                          </div>
                      </div>
                      <div>
                          <h3 className="text-white font-serif text-lg">Agent Kim's Suggestion</h3>
                          <p className="text-gray-400 text-xs">Based on guidelines & best practices</p>
                      </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded mb-6">
                      <p className="text-white text-sm leading-relaxed italic">"{kimPrompt}"</p>
                  </div>

                  <div className="flex gap-4">
                      <button 
                        onClick={() => setShowKimModal(false)}
                        className="flex-1 py-3 text-xs uppercase font-bold text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleApproveKim}
                        className="flex-1 py-3 bg-macdonald-gold text-black text-xs uppercase font-bold rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
                      >
                          <Check size={14}/> Approve Prompt
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CreateAssets;