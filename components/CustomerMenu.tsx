import React from 'react';
import { User, FileText, ShoppingBag, Heart, Settings, HelpCircle, LogOut, X, ChevronRight, Pill } from 'lucide-react';

interface CustomerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userName?: string;
}

const CustomerMenu: React.FC<CustomerMenuProps> = ({ isOpen, onClose, onNavigate, onLogout, userName = "Guest" }) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: <User className="w-5 h-5 text-blue-500" />, label: 'My Profile', view: 'PROFILE' },
    { icon: <ShoppingBag className="w-5 h-5 text-pink-500" />, label: 'Order History', view: 'ORDER_HISTORY' },
    { icon: <Pill className="w-5 h-5 text-green-500" />, label: 'All Medicines', view: 'MEDICINE_DIRECTORY' },
    { icon: <Heart className="w-5 h-5 text-red-500" />, label: 'Favorites', view: 'FAVORITES' },
    { icon: <Settings className="w-5 h-5 text-gray-500" />, label: 'Settings', view: 'SETTINGS' },
    { icon: <HelpCircle className="w-5 h-5 text-purple-500" />, label: 'Help & Support', view: 'HELP' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-[70] rounded-t-3xl p-6 pb-10 animate-slide-up shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
                 {userName.charAt(0)}
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gray-800">{userName}</h2>
                 <p className="text-sm text-gray-500">Gold Member</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-400" />
           </button>
        </div>

        <div className="space-y-2">
           {menuItems.map((item) => (
             <button
               key={item.label}
               onClick={() => {
                  if (item.view !== 'HELP') {
                    onNavigate(item.view);
                  }
               }}
               className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                   </div>
                   <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
             </button>
           ))}
        </div>

        <button 
          onClick={onLogout}
          className="w-full mt-8 p-4 border border-red-100 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
           <LogOut className="w-5 h-5" /> Log Out
        </button>
        
        <p className="text-center text-xs text-gray-300 mt-6">Version 1.2.0 • Made with ❤️ in BD</p>
      </div>
    </>
  );
};

export default CustomerMenu;