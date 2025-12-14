
import React, { useState } from 'react';
import { Phone, ArrowRight, Loader2, Store, User } from 'lucide-react';

interface LoginProps {
  onLogin: (phone: string) => void;
  onBack: () => void;
  userType?: 'CUSTOMER' | 'OWNER';
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, userType = 'CUSTOMER' }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Bangladesh Phone Validation
    const bdPhoneRegex = /^(\+88)?(01[3-9]\d{8})$/;
    
    if (!bdPhoneRegex.test(phone)) {
      setError('Please enter a valid Bangladeshi mobile number (e.g., 01712345678)');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin(phone);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 animate-fade-in">
      <button onClick={onBack} className="self-start mb-8 text-gray-500 hover:text-gray-800">
        Back
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${userType === 'OWNER' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'}`}>
          {userType === 'OWNER' ? <Store className="w-8 h-8" /> : <Phone className="w-8 h-8" />}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userType === 'OWNER' ? 'Partner Login' : 'Welcome to MediPanda'}
        </h1>
        <p className="text-gray-500 mb-8">
            {userType === 'OWNER' 
                ? 'Enter your registered business number to access dashboard.' 
                : 'Enter your mobile number to create an account or log in.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                {userType === 'OWNER' ? 'Business Mobile Number' : 'Mobile Number'}
            </label>
            <div className={`flex items-center gap-3 border-b-2 border-gray-200 py-2 transition-colors ${userType === 'OWNER' ? 'focus-within:border-purple-500' : 'focus-within:border-pink-500'}`}>
              <span className="text-gray-400 font-medium text-lg">🇧🇩 +880</span>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                placeholder="1712345678"
                className="flex-1 outline-none text-lg font-bold text-gray-800 placeholder-gray-300 bg-transparent"
                maxLength={11}
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button 
            type="submit"
            disabled={loading || !phone}
            className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 ${
                userType === 'OWNER' 
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' 
                : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200'
            }`}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Continue'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
