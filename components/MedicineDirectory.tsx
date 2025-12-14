
import React, { useState } from 'react';
import { Search, ArrowLeft, Plus, ShoppingCart, Pill, Activity, Factory } from 'lucide-react';
import { Medicine } from '../types';

interface MedicineDirectoryProps {
  onBack: () => void;
  onAddToCart: (medicine: Medicine) => void;
  onSelect?: (medicine: Medicine) => void;
  medicines: Medicine[];
}

const CATEGORIES = [
  { name: 'All', icon: '🔍' },
  { name: 'Fever & Pain', icon: '🌡️' },
  { name: 'Gastric', icon: '🔥' },
  { name: 'Antibiotic', icon: '💊' },
  { name: 'Allergy', icon: '🤧' },
  { name: 'Cold & Cough', icon: '🌬️' },
  { name: 'Blood Pressure', icon: '❤️' },
  { name: 'Diabetes', icon: '🩸' },
  { name: 'Vitamin', icon: '🍊' },
  { name: 'Critical Care', icon: '🏥' },
  { name: 'Skin Care', icon: '✨' },
  { name: 'Eye Care', icon: '👁️' },
  { name: 'First Aid', icon: '🩹' }
];

const MedicineDirectory: React.FC<MedicineDirectoryProps> = ({ onBack, onAddToCart, onSelect, medicines }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in relative z-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">All Medicines</h1>
          <div className="ml-auto relative">
             <ShoppingCart className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        
        {/* Search & Filter */}
        <div className="p-4 space-y-3">
          <div className="relative">
             <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
             <input 
               type="text" 
               placeholder="Search medicine (e.g. Napa, Sergel, Herceptin)" 
               className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             {CATEGORIES.map(cat => (
               <button
                 key={cat.name}
                 onClick={() => setSelectedCategory(cat.name)}
                 className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border flex items-center gap-2 shadow-sm ${
                   selectedCategory === cat.name 
                   ? 'bg-pink-600 text-white border-pink-600' 
                   : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                 }`}
               >
                 <span>{cat.icon}</span>
                 {cat.name}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-4 grid gap-3">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map(med => (
            <div 
              key={med.id} 
              className={`bg-white p-3 rounded-2xl shadow-sm border flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer ${med.category === 'Critical Care' ? 'border-red-100 bg-red-50/10' : 'border-gray-100'}`}
              onClick={() => onSelect && onSelect(med)}
            >
               <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${med.category === 'Critical Care' ? 'bg-red-50 text-red-500' : 'bg-pink-50'}`}>
                 {med.category === 'Critical Care' ? <Activity className="w-6 h-6" /> : (
                   med.type?.includes('Syrup') || med.type?.includes('Liquid') ? '🧴' : 
                   med.type?.includes('Drop') ? '💧' : 
                   med.type?.includes('Cream') ? '🧴' : '💊'
                 )}
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                     <h3 className="font-bold text-gray-900 truncate">{med.name}</h3>
                     <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[80px] ${med.category === 'Critical Care' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{med.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{med.genericName}</p>
                  
                  {/* Manufacturer Display */}
                  {med.manufacturer && (
                    <p className="text-[11px] font-semibold text-gray-600 mt-1 flex items-center gap-1">
                      <Factory className="w-3 h-3 text-gray-400" />
                      {med.manufacturer}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${med.category === 'Critical Care' ? 'bg-orange-500' : 'bg-green-500'}`}></span> 
                      {med.category === 'Critical Care' ? 'Limited Stock' : 'In Stock'}
                    </p>
                    
                    {/* Price and Add Button Row */}
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-pink-600">৳{med.price}</span>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           onAddToCart(med);
                         }}
                         className="flex items-center gap-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-xs font-bold"
                       >
                         <ShoppingCart className="w-3 h-3" /> Add
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
             <Pill className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No medicines found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineDirectory;
