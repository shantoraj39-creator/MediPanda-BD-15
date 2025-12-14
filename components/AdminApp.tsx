
import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import { Medicine, Pharmacy } from '../types';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminAppProps {
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  onUpdatePharmacyStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onAddMedicine: (med: Medicine) => void;
  onUpdateMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  onExit: () => void;
}

const AdminApp: React.FC<AdminAppProps> = ({ 
  medicines, 
  pharmacies, 
  onUpdatePharmacyStatus, 
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
  onExit
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="absolute top-6 left-6">
            <button onClick={onExit} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Return to Main Portal
            </button>
        </div>
        <div className="bg-slate-800 w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-pink-600/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Restricted Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 focus-within:border-pink-500 transition-colors">
                <ShieldCheck className="w-5 h-5 text-slate-500 mr-3" />
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="bg-transparent text-white w-full outline-none placeholder-slate-600"
                  placeholder="admin"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 focus-within:border-pink-500 transition-colors">
                <Lock className="w-5 h-5 text-slate-500 mr-3" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent text-white w-full outline-none placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-xl hover:bg-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
            >
              Login to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard 
      onLogout={() => setIsAuthenticated(false)}
      pharmacies={pharmacies}
      onUpdatePharmacyStatus={onUpdatePharmacyStatus}
      medicines={medicines}
      onAddMedicine={onAddMedicine}
      onUpdateMedicine={onUpdateMedicine}
      onDeleteMedicine={onDeleteMedicine}
    />
  );
};

export default AdminApp;
