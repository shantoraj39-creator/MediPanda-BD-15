import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, ShoppingCart, Activity, AlertTriangle, Thermometer, ShieldCheck, Info, Package, Factory, Globe, Loader2 } from 'lucide-react';
import { Medicine } from '../types';
import ShareModal from './ShareModal';
import { translateMedicineDetails } from '../services/genai';

interface MedicineDetailProps {
  medicine: Medicine;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onAddToCart: () => void;
}

const MedicineDetail: React.FC<MedicineDetailProps> = ({ medicine, isFavorite, onToggleFavorite, onBack, onAddToCart }) => {
  const [showShare, setShowShare] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [translatedData, setTranslatedData] = useState<any>(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const handleLanguageToggle = async () => {
    if (language === 'en') {
      setLanguage('bn');
      if (!translatedData) {
        setLoadingTranslation(true);
        const data = await translateMedicineDetails(medicine);
        setTranslatedData(data);
        setLoadingTranslation(false);
      }
    } else {
      setLanguage('en');
    }
  };

  const displayData = language === 'bn' && translatedData ? {
    primaryUse: translatedData.primaryUseBn,
    sideEffects: translatedData.sideEffectsBn,
    storage: translatedData.storageBn,
    description: translatedData.descriptionBn,
    labels: {
        highlights: 'চিকিৎসা তথ্য',
        use: 'ব্যবহার',
        sideEffects: 'পার্শ্বপ্রতিক্রিয়া',
        storage: 'সংরক্ষণ',
        desc: 'বিস্তারিত বিবরণ',
        addToCart: 'কার্টে যোগ করুন',
        price: 'প্রতি পাতা'
    }
  } : {
    primaryUse: medicine.primaryUse,
    sideEffects: medicine.sideEffects,
    storage: medicine.storage,
    description: medicine.description,
    labels: {
        highlights: 'Medical Highlights',
        use: 'Primary Use',
        sideEffects: 'Side Effects',
        storage: 'Storage Instructions',
        desc: 'Detailed Description',
        addToCart: 'Add to Cart',
        price: 'per strip'
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 animate-fade-in relative z-50">
      <ShareModal 
        isOpen={showShare} 
        onClose={() => setShowShare(false)} 
        title={medicine.name}
        text={`Check out ${medicine.name} (${medicine.genericName}) by ${medicine.manufacturer} for ৳${medicine.price} on MediPanda BD.`}
      />

      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex justify-between items-center shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex gap-2">
           <button 
             onClick={handleLanguageToggle}
             className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors border ${language === 'bn' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
           >
             <Globe className="w-3 h-3" />
             {loadingTranslation ? <Loader2 className="w-3 h-3 animate-spin" /> : (language === 'bn' ? 'বাংলা' : 'EN')}
           </button>
           <button 
             onClick={() => setShowShare(true)}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
           >
             <Share2 className="w-5 h-5 text-gray-700" />
           </button>
           <button 
             onClick={onToggleFavorite}
             className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-pink-50' : 'hover:bg-gray-100'}`}
           >
             <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-700'}`} />
           </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
         {/* Image Area */}
         <div className="bg-gray-50 rounded-3xl h-64 flex items-center justify-center border border-gray-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
            <div className="text-8xl transform transition-transform group-hover:scale-110 duration-500">💊</div>
            {medicine.manufacturer && (
              <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm flex items-center gap-1">
                <Factory className="w-3 h-3" /> Mfr: {medicine.manufacturer}
              </span>
            )}
         </div>

         {/* Basic Info */}
         <div>
            <div className="flex justify-between items-start mb-2">
               <div>
                 <h1 className="text-2xl font-bold text-gray-900 leading-tight">{medicine.name}</h1>
                 <p className="text-gray-500 font-medium mt-1">{medicine.genericName} • {medicine.type}</p>
                 
                 {/* Manufacturer */}
                 {medicine.manufacturer && (
                   <div className="flex items-center gap-1.5 mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg self-start inline-flex">
                      <Factory className="w-3 h-3" />
                      <span className="text-xs font-bold">{medicine.manufacturer}</span>
                   </div>
                 )}
               </div>
               <div className="text-right">
                 <p className="text-2xl font-bold text-pink-600">৳ {medicine.price}</p>
                 <p className="text-xs text-gray-400">{displayData.labels.price}</p>
               </div>
            </div>
         </div>

         {/* Medical Highlights Section */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-pink-600" /> {displayData.labels.highlights}
               </h3>
            </div>
            
            <div className="p-4 space-y-4">
                {/* Primary Use */}
                <div className="flex gap-4 items-start">
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-gray-800">{displayData.labels.use}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        {loadingTranslation && language === 'bn' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : (displayData.primaryUse || 'General health maintenance.')}
                      </p>
                   </div>
                </div>

                <div className="h-px bg-gray-100 w-full ml-14" />

                {/* Side Effects */}
                <div className="flex gap-4 items-start">
                   <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-gray-800">{displayData.labels.sideEffects}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        {loadingTranslation && language === 'bn' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : (displayData.sideEffects || 'Consult doctor if symptoms persist.')}
                      </p>
                   </div>
                </div>

                <div className="h-px bg-gray-100 w-full ml-14" />

                {/* Storage */}
                <div className="flex gap-4 items-start">
                   <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-600">
                      <Thermometer className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-gray-800">{displayData.labels.storage}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        {loadingTranslation && language === 'bn' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : (displayData.storage || 'Store in a cool, dry place.')}
                      </p>
                   </div>
                </div>
            </div>
         </div>

         {/* Description */}
         <div>
            <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">{displayData.labels.desc}</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                {loadingTranslation && language === 'bn' ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Translating...</span>
                ) : (
                    displayData.description || `${medicine.name} is a pharmaceutical product manufactured by ${medicine.manufacturer || 'a certified company'}. It contains ${medicine.genericName} and is commonly prescribed for ${medicine.primaryUse?.toLowerCase() || 'medical treatment'}.`
                )}
                </p>
            </div>
         </div>
      </div>

       {/* Bottom Action */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-4 max-w-md mx-auto z-50">
          <button 
            onClick={onAddToCart} 
            className="flex-1 bg-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
             <ShoppingCart className="w-5 h-5" /> {displayData.labels.addToCart}
          </button>
       </div>
    </div>
  );
};

export default MedicineDetail;