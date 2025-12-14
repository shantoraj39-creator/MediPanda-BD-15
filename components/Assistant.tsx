import React, { useState, useEffect, useRef } from 'react';
import { generateMedicineSuggestion, searchMedicinesOrPharmacies } from '../services/genai';
import { Search, MapPin, Send, Loader2, Pill, AlertTriangle, RefreshCw, ShoppingBag } from 'lucide-react';
import { ChatMessage } from '../types';

interface AssistantProps {
  initialQuery?: string;
  onSelectPharmacy?: (pharmacyName: string) => void;
  searchCache?: Record<string, any>;
  onSaveCache?: (query: string, result: any) => void;
}

const QUICK_SYMPTOMS = ["Fever", "Headache", "Cough", "Runny Nose", "Stomach Pain", "Acidity", "Body Ache", "Indigestion"];

const Assistant: React.FC<AssistantProps> = ({ initialQuery, onSelectPharmacy, searchCache, onSaveCache }) => {
  const [activeTab, setActiveTab] = useState<'suggest' | 'chat'>('suggest');
  const [loading, setLoading] = useState(false);
  
  // Suggestion State
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);

  // Chat/Search State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  // Ref to track if the initial query has been processed to avoid infinite loops or re-runs
  const processedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    // Get location for Maps Grounding
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Location access denied")
      );
    }
  }, []);

  useEffect(() => {
    if (initialQuery && initialQuery !== processedQueryRef.current) {
      processedQueryRef.current = initialQuery;
      setActiveTab('chat');
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSuggestion = async () => {
    if (!age || !weight || !symptoms) return;
    setLoading(true);
    setSuggestion(null);
    const result = await generateMedicineSuggestion(age, weight, symptoms);
    setSuggestion(result);
    setLoading(false);
  };

  const performSearch = async (searchText: string) => {
    if (!searchText.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: searchText };
    setMessages(prev => [...prev, userMsg]);
    setQuery(''); // Clear input
    
    // 1. Check Cache first
    if (searchCache && searchCache[searchText]) {
       const cachedResult = searchCache[searchText];
       const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cachedResult.text,
        groundingMetadata: {
            searchChunks: cachedResult.groundingMetadata?.groundingChunks?.filter((c: any) => c.web) as any,
            mapChunks: cachedResult.groundingMetadata?.groundingChunks?.filter((c: any) => c.maps) as any
        }
      };
      setMessages(prev => [...prev, aiMsg]);
      return; // Return early, do not call API
    }

    setLoading(true);

    try {
      // 2. Call API if not in cache
      const result = await searchMedicinesOrPharmacies(searchText, userLocation);
      
      // 3. Save to Cache
      if (onSaveCache) {
         onSaveCache(searchText, result);
      }
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "I found some information.",
        groundingMetadata: {
            searchChunks: result.groundingMetadata?.groundingChunks?.filter((c: any) => c.web) as any,
            mapChunks: result.groundingMetadata?.groundingChunks?.filter((c: any) => c.maps) as any
        }
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error searching for that." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = () => {
    performSearch(query);
  };

  // Basic Markdown Bold Parser
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={`mb-2 text-gray-700 ${line.startsWith('#') || line.startsWith('-') ? 'ml-2' : ''}`}>
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
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="flex gap-2 p-4 bg-white sticky top-0 z-10 shadow-sm border-b">
        <button 
          onClick={() => setActiveTab('suggest')}
          className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'suggest' ? 'bg-pink-50 text-pink-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Medicine Suggester
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'chat' ? 'bg-pink-50 text-pink-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Search & Find
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {activeTab === 'suggest' ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Disclaimer:</strong> This AI tool suggests common OTC medicines in Bangladesh based on general guidelines. It is not a substitute for professional medical advice. Always consult a doctor.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Age (Years)</label>
                   <input 
                     type="number" 
                     value={age}
                     onChange={(e) => setAge(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-pink-500"
                     placeholder="e.g. 25"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                   <input 
                     type="number" 
                     value={weight}
                     onChange={(e) => setWeight(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-pink-500"
                     placeholder="e.g. 65"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                 <textarea 
                   value={symptoms}
                   onChange={(e) => setSymptoms(e.target.value)}
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-pink-500 h-24 resize-none"
                   placeholder="Describe what you are feeling (e.g., headache, mild fever, runny nose)"
                 />
                 <div className="flex flex-wrap gap-2 mt-2">
                    {QUICK_SYMPTOMS.map(s => (
                      <button 
                        key={s} 
                        onClick={() => setSymptoms(prev => prev ? (prev.includes(s) ? prev : `${prev}, ${s}`) : s)}
                        className="text-[10px] font-medium bg-gray-100 hover:bg-pink-50 hover:text-pink-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-pink-100"
                      >
                        + {s}
                      </button>
                    ))}
                 </div>
               </div>

               <button 
                 onClick={handleSuggestion}
                 disabled={loading || !age || !weight || !symptoms}
                 className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-700 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Pill className="w-5 h-5" />}
                 Get Suggestion
               </button>
            </div>

            {suggestion && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-pink-500" />
                        AI Recommendation
                    </h3>
                    <button onClick={handleSuggestion} className="text-gray-400 hover:text-pink-600" title="Regenerate">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                <div className="prose prose-sm prose-pink max-w-none">
                  {renderFormattedText(suggestion)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Ask about medicine prices or find pharmacies nearby.</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <button onClick={() => performSearch("Price of Napa Extra in BD")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full">Price of Napa Extra</button>
                  <button onClick={() => performSearch("Pharmacies near me open now")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full">Pharmacies near me</button>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${msg.role === 'user' ? 'bg-pink-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                  
                  {/* Grounding Sources */}
                  {msg.groundingMetadata?.searchChunks && msg.groundingMetadata.searchChunks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Sources:</p>
                      <ul className="space-y-1">
                        {msg.groundingMetadata.searchChunks.map((chunk, idx) => (
                          <li key={idx}><a href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{chunk.web.title}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.groundingMetadata?.mapChunks && msg.groundingMetadata.mapChunks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Locations:</p>
                      <ul className="space-y-2">
                        {msg.groundingMetadata.mapChunks.map((chunk, idx) => (
                          <li key={idx} className="bg-gray-50 p-2 rounded flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <a href={chunk.maps.uri} target="_blank" rel="noreferrer" className="text-xs font-medium text-gray-800 hover:underline block">{chunk.maps.title}</a>
                                </div>
                            </div>
                            {onSelectPharmacy && (
                                <button 
                                    onClick={() => onSelectPharmacy(chunk.maps.title)}
                                    className="ml-6 flex items-center gap-1 text-[10px] bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-bold self-start hover:bg-pink-200"
                                >
                                    <ShoppingBag className="w-3 h-3" /> Order from here
                                </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
                 </div>
              </div>
            )}
            <div className="h-16"></div> {/* Spacer */}
          </div>
        )}
      </div>

      {activeTab === 'chat' && (
        <div className="p-4 bg-white border-t sticky bottom-0">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              placeholder="Ask about medicines or pharmacies..."
              className="w-full bg-gray-100 text-gray-900 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button 
              onClick={handleManualSearch}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 p-1.5 bg-pink-600 text-white rounded-full hover:bg-pink-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;