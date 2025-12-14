import React, { useState } from 'react';
import { ArrowLeft, User, Bell, CreditCard, ChevronRight, Shield, Globe, Lock, Save, Landmark } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  userPhone: string;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onNavigate, userPhone }) => {
  const [bkashNumber, setBkashNumber] = useState(userPhone);
  const [bankAccount, setBankAccount] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in relative z-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Profile Section */}
        <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wide">Account</h2>
          <button 
            onClick={() => onNavigate('PROFILE')}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><User className="w-5 h-5" /></div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Edit Profile</p>
                <p className="text-xs text-gray-500">Name, Address, Bio</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          
          <button 
             onClick={() => onNavigate('MEDICINE_REMINDER')}
             className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-pink-50 p-2 rounded-lg text-pink-600"><Bell className="w-5 h-5" /></div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Alarm & Notifications</p>
                <p className="text-xs text-gray-500">Manage medicine reminders</p>
              </div>
            </div>
            <div className="relative">
               <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} className="sr-only peer" />
               <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600"></div>
            </div>
          </button>
        </section>

        {/* Payment Management */}
        <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wide">Payment Methods</h2>
          
          <div className="space-y-4">
             {/* Bkash */}
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-[10px]">b</div>
                   <span className="font-bold text-gray-700">bKash Number</span>
                </div>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                      placeholder="017..."
                   />
                   <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg">
                      <Save className="w-4 h-4" />
                   </button>
                </div>
             </div>

             {/* Bank */}
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                   <Landmark className="w-5 h-5 text-gray-600" />
                   <span className="font-bold text-gray-700">Bank Account / Card</span>
                </div>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                      placeholder="Card or Account Number"
                   />
                   <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg">
                      <Save className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* Other Links */}
        <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
           <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-600">
              <Shield className="w-5 h-5" /> Privacy Policy
           </button>
           <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-600">
              <Globe className="w-5 h-5" /> Language
           </button>
           <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-600">
              <Lock className="w-5 h-5" /> Change Password
           </button>
        </section>

      </div>
    </div>
  );
};

export default Settings;