
import React, { useState } from 'react';
import { Medicine, Pharmacy } from './types';
import { ALL_MEDICINES } from './data/medicines';
import ClientApp from './components/ClientApp';
import AdminApp from './components/AdminApp';
import { Store, ShieldCheck, ArrowRight } from 'lucide-react';

// Initial DB State
const INITIAL_DB_PHARMACIES: Pharmacy[] = [
  { id: 'p1', name: 'Lazz Pharma', ownerName: 'Abdul Malek', phone: '01712345678', licenseNo: 'TRAD/1234', address: 'Kalabagan', status: 'APPROVED' },
  { id: 'p2', name: 'Tamanna Pharmacy', ownerName: 'Selim Reza', phone: '01812345678', licenseNo: 'TRAD/5678', address: 'Dhanmondi', status: 'PENDING' }
];

function App() {
  const [currentApp, setCurrentApp] = useState<'LANDING' | 'CLIENT' | 'ADMIN'>('LANDING');
  
  // --- GLOBAL STATE (Database) ---
  const [medicines, setMedicines] = useState<Medicine[]>(ALL_MEDICINES);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(INITIAL_DB_PHARMACIES);

  // --- Handlers (Backend Logic Simulation) ---
  
  const handleAddMedicine = (med: Medicine) => {
    setMedicines(prev => [med, ...prev]);
  };

  const handleUpdateMedicine = (updatedMed: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleRegisterPharmacy = (newPharmacy: Pharmacy) => {
    setPharmacies(prev => [...prev, newPharmacy]);
  };

  const handleUpdatePharmacyStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setPharmacies(prev => prev.map(p => String(p.id) === String(id) ? { ...p, status } : p));
  };

  // --- View Switcher ---

  if (currentApp === 'CLIENT') {
    return (
      <ClientApp 
        medicines={medicines}
        pharmacies={pharmacies}
        onRegisterPharmacy={handleRegisterPharmacy}
        onExit={() => setCurrentApp('LANDING')}
      />
    );
  }

  if (currentApp === 'ADMIN') {
    return (
      <AdminApp 
        medicines={medicines}
        pharmacies={pharmacies}
        onAddMedicine={handleAddMedicine}
        onUpdateMedicine={handleUpdateMedicine}
        onDeleteMedicine={handleDeleteMedicine}
        onUpdatePharmacyStatus={handleUpdatePharmacyStatus}
        onExit={() => setCurrentApp('LANDING')}
      />
    );
  }

  // --- Landing / Portal Selector ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
       <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
             <span className="text-5xl">🐼</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">MediPanda BD</h1>
          <p className="text-slate-500 mt-2">Select your portal to continue</p>
       </div>

       <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl animate-slide-up">
          {/* Main App Button */}
          <button 
            onClick={() => setCurrentApp('CLIENT')}
            className="group bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-pink-500 hover:shadow-xl transition-all text-left flex flex-col justify-between h-48"
          >
             <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">MediPanda App</h3>
                <p className="text-slate-500 text-sm mt-1">For Customers & Pharmacy Owners</p>
             </div>
             <div className="self-end text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-bold">
                Enter <ArrowRight className="w-4 h-4" />
             </div>
          </button>

          {/* Admin Portal Button */}
          <button 
            onClick={() => setCurrentApp('ADMIN')}
            className="group bg-slate-900 p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-slate-500 hover:shadow-2xl transition-all text-left flex flex-col justify-between h-48"
          >
             <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white">Admin Portal</h3>
                <p className="text-slate-400 text-sm mt-1">Management & Verification</p>
             </div>
             <div className="self-end text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-bold">
                Login <ArrowRight className="w-4 h-4" />
             </div>
          </button>
       </div>

       <p className="mt-16 text-slate-400 text-xs">System Version 2.4.0</p>
    </div>
  );
}

export default App;
