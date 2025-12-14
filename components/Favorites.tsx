import React from 'react';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Pill } from 'lucide-react';
import { Medicine } from '../types';

interface FavoritesProps {
  items: Medicine[];
  onRemove: (id: string) => void;
  onAddToCart: (medicine: Medicine) => void;
  onBack: () => void;
  onSelect?: (medicine: Medicine) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ items, onRemove, onAddToCart, onBack, onSelect }) => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in relative z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">My Favorites</h1>
        <span className="ml-auto bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold">
          {items.length} Saved
        </span>
      </div>

      <div className="p-4 space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No favorites yet</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Save medicines you buy frequently to find them quickly later.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => onSelect && onSelect(item)}
            >
               <div className="w-16 h-16 bg-pink-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                 {item.type === 'Syrup' ? '🧴' : '💊'}
               </div>
               
               <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{item.genericName}</p>
                  <p className="font-bold text-pink-600 mt-1">৳ {item.price}</p>
               </div>

               <div className="flex flex-col gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;