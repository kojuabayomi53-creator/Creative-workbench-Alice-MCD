import React, { useState, useRef } from 'react';
import { GeneratedIdea } from '../types';
import { chatWithGrounding, transcribeAudio } from '../services/geminiService';
import { Send, Sparkles, ArrowRight, MessageSquare, Image as ImageIcon, Globe, Mic, StopCircle, ExternalLink } from 'lucide-react';

interface IdeaGenerationProps {
  onIdeaSelected: (idea: GeneratedIdea) => void;
}

const IdeaGeneration: React.FC<IdeaGenerationProps> = ({ onIdeaSelected }) => {
  const [input, setInput] = useState('');
  const [useGrounding, setUseGrounding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string, links?: string[]}[]>([
      { role: 'ai', content: 'I am your AI Creative Partner. Tell me about the season, audience, or product you want to promote.' }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await chatWithGrounding(userMsg, useGrounding);
    
    setChatHistory(prev => [...prev, { role: 'ai', content: response.text, links: response.links }]);
    setLoading(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setLoading(true);
                const text = await transcribeAudio(audioBlob);
                setInput(prev => prev + " " + text);
                setLoading(false);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (e) {
            console.error("Mic Error", e);
            alert("Microphone access denied or not available.");
        }
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
      
      {/* Chat / Input Panel */}
      <div className="lg:col-span-4 bg-black/40 border-r border-white/10 p-6 flex flex-col h-full backdrop-blur-md">
        <div className="mb-6">
           <h2 className="text-2xl font-bold uppercase text-white flex items-center gap-2">
             <Sparkles className="text-macdonald-gold" /> Idea Lab
           </h2>
           <p className="text-xs text-gray-400 mt-2">Powered by Gemini 3 Pro</p>
        </div>

        {/* Input Area */}
        <div className="mt-auto space-y-4">
           {/* Controls */}
           <div className="flex items-center justify-between">
               <button 
                onClick={() => setUseGrounding(!useGrounding)}
                className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border transition-all ${useGrounding ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/20 text-gray-500'}`}
               >
                   <Globe size={12} /> Google Search Grounding {useGrounding ? 'ON' : 'OFF'}
               </button>

               <button
                 onClick={toggleRecording}
                 className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 'border-white/20 text-gray-500'}`}
               >
                   {isRecording ? <><StopCircle size={12}/> Recording...</> : <><Mic size={12}/> Voice Input</>}
               </button>
           </div>

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about campaigns, local trends, or competitors..."
              className="w-full bg-black/50 border border-white/20 p-3 pr-10 text-white h-32 focus:border-macdonald-gold focus:outline-none resize-none text-sm"
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute bottom-2 right-2 p-2 bg-macdonald-gold text-black rounded hover:bg-white transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Results Panel / Chat History */}
      <div className="lg:col-span-8 p-8 overflow-y-auto bg-gradient-to-br from-black/20 to-macdonald-green/10 flex flex-col">
        <div className="space-y-6">
            {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl p-6 rounded-xl border ${msg.role === 'user' ? 'bg-white/10 border-white/5' : 'bg-black/60 border-macdonald-gold/30'}`}>
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        
                        {/* Render Grounding Links */}
                        {msg.links && msg.links.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-[10px] text-gray-400 uppercase mb-2">Sources</p>
                                <div className="flex flex-wrap gap-2">
                                    {msg.links.slice(0, 3).map((link, i) => (
                                        <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-white/5 px-2 py-1 rounded hover:bg-white/10 text-blue-300 truncate max-w-[200px]">
                                            <ExternalLink size={10} /> {new URL(link).hostname}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {msg.role === 'ai' && idx !== 0 && (
                             <button 
                                onClick={() => onIdeaSelected({ title: "Generated Idea", pitch: msg.content, visuals: "Based on chat context" })}
                                className="mt-4 text-xs text-macdonald-gold uppercase flex items-center gap-1 hover:underline"
                             >
                                 Use this Concept <ArrowRight size={12} />
                             </button>
                        )}
                    </div>
                </div>
            ))}
            {loading && (
                 <div className="flex justify-start">
                    <div className="bg-black/60 border border-macdonald-gold/30 p-4 rounded-xl">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-macdonald-gold rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-macdonald-gold rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-macdonald-gold rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                 </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default IdeaGeneration;