
import React from 'react';
import { X, MapPin, Navigation } from 'lucide-react';

interface Pharmacy {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance: string;
}

const NEARBY_PHARMACIES: Pharmacy[] = [
  { id: 1, name: 'Lazz Pharma (Kalabagan)', lat: 23.7511, lng: 90.3831, address: 'Kalabagan, Dhaka', distance: '0.5 km' },
  { id: 2, name: 'Tamanna Pharmacy', lat: 23.7520, lng: 90.3750, address: 'Dhanmondi 32', distance: '1.2 km' },
  { id: 3, name: 'Popular Medicart', lat: 23.7480, lng: 90.3850, address: 'Green Road', distance: '1.8 km' },
  { id: 4, name: 'Bio-Pharma', lat: 23.7530, lng: 90.3900, address: 'Panthapath', distance: '2.5 km' },
];

interface PharmacyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pharmacy: Pharmacy) => void;
}

const PharmacyMapModal: React.FC<PharmacyMapModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" /> Select Fulfillment Partner
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Map Visualization (Mock) */}
        <div className="h-64 bg-gray-100 relative overflow-hidden group">
           {/* Mock Map Background */}
           <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Dhaka_City_Map.jpg/800px-Dhaka_City_Map.jpg')] bg-cover bg-center" />
           
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" title="Your Location" />
           </div>

           {/* Pins */}
           {NEARBY_PHARMACIES.map((p, i) => (
              <div 
                key={p.id}
                className="absolute flex flex-col items-center cursor-pointer hover:z-10 transition-transform hover:scale-110"
                style={{ 
                  top: `${30 + (i * 15)}%`, 
                  left: `${20 + (i * 20)}%` 
                }}
                onClick={() => onSelect(p)}
              >
                 <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white mb-1">
                    <StoreIcon className="w-4 h-4" />
                 </div>
                 <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap">{p.name}</span>
              </div>
           ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Nearby Available Pharmacies</h4>
           {NEARBY_PHARMACIES.map(p => (
             <button 
               key={p.id}
               onClick={() => {
                 onSelect(p);
                 onClose();
               }}
               className="w-full bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all flex items-center justify-between group text-left"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Navigation className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-800">{p.name}</h4>
                      <p className="text-xs text-gray-500">{p.address}</p>
                   </div>
                </div>
                <div className="text-right">
                   <span className="block font-bold text-gray-800">{p.distance}</span>
                   <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">Open</span>
                </div>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

// Simple Store Icon helper
const StoreIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
    <path d="M2 7h20"/>
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
  </svg>
);

export default PharmacyMapModal;
