import React, { useState } from 'react';
import { ViewType, GeneratedIdea, MarketingRequest } from '../types';
import { generateMarketingIdeas } from '../services/geminiService';
import { Send, Sparkles, ArrowRight, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface IdeaGenerationProps {
  onIdeaSelected: (idea: GeneratedIdea) => void;
}

const IdeaGeneration: React.FC<IdeaGenerationProps> = ({ onIdeaSelected }) => {
  const [input, setInput] = useState('');
  const [goal, setGoal] = useState('Increase Direct Bookings');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const result = await generateMarketingIdeas(input, goal);
    setIdeas(result);
    setLoading(false);
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
      
      {/* Chat / Input Panel */}
      <div className="lg:col-span-4 bg-black/40 border-r border-white/10 p-6 flex flex-col h-full backdrop-blur-md">
        <div className="mb-6">
           <h2 className="text-2xl font-bold uppercase text-white flex items-center gap-2">
             <Sparkles className="text-macdonald-gold" /> Idea Lab
           </h2>
           <p className="text-xs text-gray-400 mt-2">Powered by Gemini 2.5 Flash</p>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
           {/* Chat Bubble Simulation */}
           <div className="bg-white/10 p-4 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-white/5">
             <p className="text-sm text-gray-200">
               I am your AI Creative Partner. Tell me about the season, audience, or product you want to promote.
             </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-auto space-y-4">
          <div>
            <label className="text-[10px] text-macdonald-gold uppercase block mb-1">Campaign Goal</label>
            <select 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-2 text-white text-sm focus:border-macdonald-gold focus:outline-none"
            >
              <option>Increase Direct Bookings</option>
              <option>Drive Off-Peak Revenue</option>
              <option>Promote New Restaurant</option>
              <option>Build Brand Loyalty</option>
            </select>
          </div>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. A winter spa break for couples..."
              className="w-full bg-black/50 border border-white/20 p-3 pr-10 text-white h-32 focus:border-macdonald-gold focus:outline-none resize-none text-sm"
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
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
          </div>
        </form>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-8 p-8 overflow-y-auto bg-gradient-to-br from-black/20 to-macdonald-green/10">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-macdonald-gold border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white uppercase tracking-widest animate-pulse">Brainstorming Concepts...</p>
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-white font-bold uppercase mb-4 opacity-50">Generated Concepts</h3>
            {ideas.map((idea, index) => (
              <div 
                key={index}
                onClick={() => onIdeaSelected(idea)}
                className="group bg-black/60 border border-white/10 p-6 hover:border-macdonald-gold cursor-pointer transition-all hover:translate-x-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-macdonald-gold">{idea.title}</h4>
                    <p className="text-gray-300 text-sm mb-3">{idea.pitch}</p>
                    <div className="flex items-center gap-2 text-xs text-macdonald-gold/70">
                       <ImageIcon size={12} />
                       <span>Visual: {idea.visuals}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-full group-hover:bg-macdonald-gold group-hover:text-black transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/20">
            <MessageSquare size={64} className="mb-4" />
            <p className="uppercase tracking-widest">Start the conversation</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default IdeaGeneration;