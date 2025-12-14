import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Loader2, Search, ChevronRight, ExternalLink, Leaf, Share2 } from 'lucide-react';
import { generateHealthTips } from '../services/genai';
import ShareModal from './ShareModal';

interface HealthTipsProps {
  onBack: () => void;
}

const TOPICS = [
  { id: 'dengue', title: '🦟 Dengue Prevention', query: 'Dengue prevention tips Bangladesh' },
  { id: 'gastric', title: '🔥 Gastric & Acidity', query: 'How to reduce gastric and acidity naturally' },
  { id: 'diabetes', title: '🩸 Diabetes Diet', query: 'Healthy diet for diabetes patients in Bangladesh context' },
  { id: 'hydration', title: '💧 Summer Hydration', query: 'Tips to stay hydrated in humid weather' },
  { id: 'flu', title: '🤧 Seasonal Flu', query: 'Preventing seasonal flu and cold home remedies' },
  { id: 'skin', title: '✨ Skin Care', query: 'Skin care tips for pollution and humidity' },
];

const HealthTips: React.FC<HealthTipsProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [showShare, setShowShare] = useState(false);

  const fetchTips = async (topic: string) => {
    setLoading(true);
    setContent(null);
    setGroundingMetadata(null);
    try {
      const result = await generateHealthTips(topic);
      setContent(result.text || "No information found.");
      setGroundingMetadata(result.groundingMetadata);
    } catch (e) {
      setContent("Sorry, I couldn't fetch the tips right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: typeof TOPICS[0]) => {
    setSelectedTopic(topic.title);
    fetchTips(topic.query);
  };

  const handleCustomSearch = () => {
    if (!customQuery.trim()) return;
    setSelectedTopic(customQuery);
    fetchTips(customQuery);
  };

  // Markdown renderer
  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={`mb-3 text-gray-700 leading-relaxed ${line.startsWith('#') ? 'font-bold text-lg text-pink-700 mt-4' : ''} ${line.trim().startsWith('-') || line.trim().startsWith('*') ? 'pl-4 border-l-2 border-pink-100' : ''}`}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white min-h-screen pb-24 animate-fade-in relative z-50">
      <ShareModal 
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title={selectedTopic || "Health Tip"}
        text={content?.slice(0, 150) + "..." || "Check out this health tip on MediPanda BD"}
      />

      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Health Tips</h1>
        </div>
        {selectedTopic && !loading && content && (
            <button 
              onClick={() => setShowShare(true)}
              className="p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
            >
                <Share2 className="w-5 h-5" />
            </button>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSearch()}
            placeholder="Search health topic (e.g. Back pain)..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button 
            onClick={handleCustomSearch}
            className="absolute right-2 top-2 p-1.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {selectedTopic && (loading || content) ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="bg-pink-50 p-4 border-b border-pink-100">
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                   <Leaf className="w-5 h-5 text-pink-600" />
                   {selectedTopic}
                </h2>
             </div>
             
             <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                     <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
                     <p className="text-sm text-gray-500 animate-pulse">Searching best health advice...</p>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="prose prose-pink max-w-none">
                       {renderContent(content || "")}
                    </div>
                    
                    {/* Grounding Sources */}
                    {groundingMetadata?.searchChunks && groundingMetadata.searchChunks.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Sources & References</p>
                        <div className="flex flex-wrap gap-2">
                          {groundingMetadata.searchChunks.map((chunk: any, idx: number) => (
                             <a 
                               key={idx} 
                               href={chunk.web.uri} 
                               target="_blank" 
                               rel="noreferrer"
                               className="flex items-center gap-1 text-[10px] bg-gray-50 border border-gray-200 px-2 py-1 rounded-full text-blue-600 hover:underline hover:bg-blue-50 transition-colors max-w-full truncate"
                             >
                               <ExternalLink className="w-3 h-3" />
                               <span className="truncate max-w-[150px]">{chunk.web.title}</span>
                             </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div>
             <h3 className="font-bold text-gray-800 mb-3">Popular Topics in Bangladesh</h3>
             <div className="grid grid-cols-1 gap-3">
               {TOPICS.map((topic) => (
                 <button
                   key={topic.id}
                   onClick={() => handleTopicClick(topic)}
                   className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-pink-200 hover:shadow-md transition-all group text-left"
                 >
                   <span className="font-medium text-gray-700 group-hover:text-pink-700">{topic.title}</span>
                   <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-pink-50">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-500" />
                   </div>
                 </button>
               ))}
             </div>
             
             <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
                <div className="flex items-start gap-3">
                   <BookOpen className="w-6 h-6 text-green-600 mt-1" />
                   <div>
                      <h4 className="font-bold text-green-800">Did you know?</h4>
                      <p className="text-sm text-green-700 mt-1 leading-relaxed">
                        Regular hand washing can reduce the risk of respiratory infections by 16%. 
                        Stay informed with our AI-powered health tips sourced directly from verified medical articles.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTips;