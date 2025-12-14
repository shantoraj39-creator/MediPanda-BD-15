
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, MapPin, Phone, Mail, Save, Camera, AlertCircle, Store, FileText, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface UserProfileProps {
  onBack: () => void;
  role?: UserRole;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBack, role = UserRole.CUSTOMER }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ address?: string; license?: string }>({});
  
  // State for Customer
  const [customer, setCustomer] = useState({
    name: 'Rahim Uddin',
    phone: '+880 1712 345678',
    email: 'rahim@example.com',
    address: 'House 12, Road 5, Dhanmondi, Dhaka',
    age: '28',
    gender: 'Male',
    bloodGroup: 'B+'
  });

  // State for Shopkeeper
  const [shopkeeper, setShopkeeper] = useState({
    shopName: 'Lazz Pharma (Kalabagan Branch)',
    ownerName: 'Abdul Malek',
    phone: '+880 1819 555666',
    email: 'contact@lazzpharma.com',
    address: '32 Lake Circus, Kalabagan, Dhaka',
    licenseNo: 'TRAD/DSCC/123456/2023',
    established: '2010'
  });

  const isOwner = role === UserRole.PHARMACY_OWNER;

  const handleCustomerChange = (field: string, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (field === 'address' && errors.address) {
      setErrors(prev => ({ ...prev, address: undefined }));
    }
  };

  const handleShopkeeperChange = (field: string, value: string) => {
    setShopkeeper(prev => ({ ...prev, [field]: value }));
    if (field === 'address' && errors.address) setErrors(prev => ({ ...prev, address: undefined }));
    if (field === 'licenseNo' && errors.license) setErrors(prev => ({ ...prev, license: undefined }));
  };

  const handleSave = () => {
    const newErrors: { address?: string; license?: string } = {};
    let isValid = true;

    if (isOwner) {
        if (!shopkeeper.address.trim()) {
            newErrors.address = 'Shop address is required.';
            isValid = false;
        }
        if (!shopkeeper.licenseNo.trim()) {
            newErrors.license = 'Trade License number is required.';
            isValid = false;
        }
    } else {
        // Customer Validation
        if (!customer.address.trim()) {
            newErrors.address = 'Delivery address is required.';
            isValid = false;
        } else if (customer.address.trim().length < 10) {
            newErrors.address = 'Please enter a complete address (min 10 characters).';
            isValid = false;
        }
    }

    setErrors(newErrors);

    if (isValid) {
      setIsEditing(false);
      // API call to save profile would go here
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in relative z-50">
      {/* Header */}
      <div className={`${isOwner ? 'bg-purple-700' : 'bg-pink-600'} text-white pb-16 pt-4 px-4 rounded-b-[2.5rem] shadow-lg relative transition-colors duration-300`}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold">{isOwner ? 'Pharmacy Profile' : 'My Profile'}</h1>
          <button 
            onClick={() => {
              if (isEditing) setErrors({});
              setIsEditing(!isEditing);
            }}
            className="ml-auto bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-xs font-bold transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="flex flex-col items-center">
           <div className="relative">
             <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
               <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                 {isOwner ? (
                    <Store className="w-12 h-12 text-purple-600" />
                 ) : (
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim" alt="Avatar" className="w-full h-full object-cover" />
                 )}
               </div>
             </div>
             <button className={`absolute bottom-0 right-0 p-2 rounded-full text-white shadow-lg border-2 border-white ${isOwner ? 'bg-purple-500' : 'bg-pink-500'}`}>
               <Camera className="w-4 h-4" />
             </button>
           </div>
           <h2 className="mt-4 text-2xl font-bold text-center px-4">{isOwner ? shopkeeper.shopName : customer.name}</h2>
           <p className={`text-opacity-90 ${isOwner ? 'text-purple-100' : 'text-pink-100'}`}>
             {isOwner ? shopkeeper.phone : customer.phone}
           </p>
           {isOwner && (
             <span className="mt-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Verified Partner</span>
           )}
        </div>
      </div>

      <div className="px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
           
           {/* PHARMACY OWNER FORM */}
           {isOwner ? (
             <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Shop Name</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Store className="w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            value={shopkeeper.shopName} 
                            disabled={!isEditing}
                            onChange={(e) => handleShopkeeperChange('shopName', e.target.value)}
                            className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Owner Name</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <User className="w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            value={shopkeeper.ownerName} 
                            disabled={!isEditing}
                            onChange={(e) => handleShopkeeperChange('ownerName', e.target.value)}
                            className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Trade License No.</label>
                    <div className={`flex items-center gap-3 bg-gray-50 p-3 rounded-xl border ${errors.license ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
                        <FileText className="w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            value={shopkeeper.licenseNo} 
                            disabled={!isEditing}
                            onChange={(e) => handleShopkeeperChange('licenseNo', e.target.value)}
                            className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600"
                        />
                    </div>
                    {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Shop Address</label>
                    <div className={`flex items-start gap-3 bg-gray-50 p-3 rounded-xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
                        <MapPin className="w-5 h-5 mt-0.5 text-gray-400" />
                        <textarea 
                            value={shopkeeper.address} 
                            disabled={!isEditing}
                            onChange={(e) => handleShopkeeperChange('address', e.target.value)}
                            className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600 resize-none h-20"
                        />
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contact Phone</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            value={shopkeeper.phone} 
                            disabled={!isEditing}
                            onChange={(e) => handleShopkeeperChange('phone', e.target.value)}
                            className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600"
                        />
                    </div>
                </div>
             </div>
           ) : (
             /* CUSTOMER FORM */
             <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <User className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        value={customer.name} 
                        disabled={!isEditing}
                        onChange={(e) => handleCustomerChange('name', e.target.value)}
                        className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        value={customer.phone} 
                        disabled={!isEditing}
                        onChange={(e) => handleCustomerChange('phone', e.target.value)}
                        className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        value={customer.email} 
                        disabled={!isEditing}
                        onChange={(e) => handleCustomerChange('email', e.target.value)}
                        className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Delivery Address {isEditing && <span className="text-red-500">*</span>}
                    </label>
                    <div className={`flex items-start gap-3 bg-gray-50 p-3 rounded-xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
                    <MapPin className={`w-5 h-5 mt-0.5 ${errors.address ? 'text-red-500' : 'text-gray-400'}`} />
                    <textarea 
                        value={customer.address} 
                        disabled={!isEditing}
                        onChange={(e) => handleCustomerChange('address', e.target.value)}
                        className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-600 resize-none h-20"
                    />
                    </div>
                    {errors.address && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs font-medium animate-fade-in">
                        <AlertCircle className="w-3 h-3" />
                        {errors.address}
                    </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Age</label>
                        <input 
                        type="text" 
                        value={customer.age} 
                        disabled={!isEditing}
                        onChange={(e) => handleCustomerChange('age', e.target.value)}
                        className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none text-gray-800 font-medium disabled:text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Blood Group</label>
                        <input 
                        type="text" 
                        value={customer.bloodGroup} 
                        disabled={!isEditing}
                        onChange={(e) => handleCustomerChange('bloodGroup', e.target.value)}
                        className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none text-gray-800 font-medium disabled:text-gray-600"
                        />
                    </div>
                </div>
             </div>
           )}

           {isEditing && (
             <button 
               onClick={handleSave}
               className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${isOwner ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200'}`}
             >
               <Save className="w-5 h-5" /> Save Changes
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
