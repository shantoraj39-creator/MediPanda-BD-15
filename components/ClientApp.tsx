
import React, { useState, useEffect } from 'react';
import { UserRole, AppView, Medicine, Reminder, CartItem, Pharmacy } from '../types';
import Assistant from './Assistant';
import LivePharmacist from './LivePharmacist';
import PrescriptionEditor from './PrescriptionEditor';
import MedicineDetail from './MedicineDetail';
import { MedicineReminder } from './MedicineReminder';
import HealthTips from './HealthTips';
import Cart from './Cart';
import MedicineDirectory from './MedicineDirectory';
import UserProfile from './UserProfile';
import OrderHistory from './OrderHistory';
import CustomerMenu from './CustomerMenu';
import Favorites from './Favorites';
import Login from './Login';
import Settings from './Settings';
import PharmacyMapModal from './PharmacyMapModal';
import { 
  Home, User, Store, Stethoscope, ShoppingCart, Menu, Search, MapPin, 
  Clock, TrendingUp, AlertCircle, CheckCircle, X, ClipboardList, Plus, 
  LayoutDashboard, BellRing, Edit2, Trash2, ChevronDown, ArrowLeft, 
  Pill, Syringe, Droplets, Zap, BookOpen, Calendar, Factory, Printer,
  ShoppingBag, LogOut, Package
} from 'lucide-react';

// Mock Data for Home Screen (Categories, Popular Medicines, etc.)
const CATEGORIES = [
  { id: 1, name: 'Fever & Pain', icon: '🌡️', query: 'Best fever and pain medicines in Bangladesh with price' },
  { id: 2, name: 'Cold & Cough', icon: '🤧', query: 'Best syrup for cold and cough in Bangladesh' },
  { id: 3, name: 'Gastric', icon: '🔥', query: 'Best gastric medicine in Bangladesh' },
  { id: 4, name: 'Antibiotics', icon: '💊', query: 'Common antibiotics available in Bangladesh' },
  { id: 5, name: 'Diabetes', icon: '🩸', query: 'Diabetes medicine and insulin price list Bangladesh' },
  { id: 6, name: 'Heart & BP', icon: '❤️', query: 'High blood pressure and heart medicines BD' },
  { id: 7, name: 'Vitamins', icon: '🍊', query: 'Best multivitamin supplements in Bangladesh' },
  { id: 8, name: 'Baby Care', icon: '👶', query: 'Baby care medicines and products Bangladesh' },
  { id: 9, name: 'Women Care', icon: '👩', query: 'Womens health and hygiene products Bangladesh' },
  { id: 10, name: 'Sexual Wellness', icon: '🛡️', query: 'Sexual wellness and contraceptive products BD' },
  { id: 11, name: 'Mental Health', icon: '🧠', query: 'Medicines for anxiety and depression BD' },
  { id: 12, name: 'Skin Care', icon: '✨', query: 'Dermatological creams and skin care medicines BD' },
  { id: 13, name: 'Eye & Ear', icon: '👁️', query: 'Eye drops and ear drops list Bangladesh' },
  { id: 14, name: 'Dental Care', icon: '🦷', query: 'Dental care medicines and oral hygiene BD' },
  { id: 15, name: 'Asthma', icon: '💨', query: 'Asthma inhalers and respiratory medicines BD' },
  { id: 16, name: 'First Aid', icon: '🩹', query: 'First aid kit items and devices price BD' },
  { id: 17, name: 'Herbal', icon: '🌿', query: 'Herbal and Unani medicines Bangladesh' },
  { id: 18, name: 'Bone & Joint', icon: '🦴', query: 'Calcium supplements and pain relief gels BD' },
  { id: 19, name: 'Kidney & Liver', icon: '🩺', query: 'Kidney and liver care medicines BD' },
  { id: 20, name: 'Supplements', icon: '💪', query: 'Protein and nutritional supplements BD' },
];

const INITIAL_INVENTORY = [
  { id: 1, name: 'Napa Extra', generic: 'Paracetamol', type: 'Tablet', stock: 120, price: 40, status: 'Good' },
  { id: 2, name: 'Seclo 20', generic: 'Omeprazole', type: 'Capsule', stock: 15, price: 70, status: 'Low' },
  { id: 3, name: 'Monas 10', generic: 'Montelukast', type: 'Tablet', stock: 0, price: 175, status: 'Critical' },
  { id: 4, name: 'Bizoran', generic: 'Amlodipine', type: 'Tablet', stock: 45, price: 120, status: 'Good' },
  { id: 5, name: 'Fexo 120', generic: 'Fexofenadine', type: 'Tablet', stock: 80, price: 90, status: 'Good' },
  { id: 6, name: 'Tufnil', generic: 'Tolfenamic Acid', type: 'Tablet', stock: 200, price: 150, status: 'Good' },
  { id: 7, name: 'Basak', generic: 'Herbal Cough', type: 'Syrup', stock: 30, price: 65, status: 'Good' },
  { id: '8', name: 'Insulin', generic: 'Human Insulin', type: 'Injection', stock: 10, price: 450, status: 'Low' },
];

const INITIAL_ORDERS = [
  { id: '1025', customer: 'Rahim Uddin', items: 'Napa Extra x20, Ace x10', total: 1100, status: 'New', time: 'Just now', address: 'House 12, Road 5, Dhanmondi' },
  { id: '1024', customer: 'Karim Ahmed', items: 'Insulin Pen x1', total: 1200, status: 'Pending', time: '5m ago', address: 'Flat 4B, Shantinagar' },
  { id: '1023', customer: 'Sazid Hasan', items: 'Napa Extra x2, Seclo 20 x1', total: 150, status: 'Processing', time: '12m ago', address: 'Block C, Bashundhara' },
  { id: '1022', customer: 'Anika Tabassum', items: 'Monas 10 x1', total: 175, status: 'Ready', time: '25m ago', address: 'Mirpur 11, Dhaka' },
  { id: '1021', customer: 'Rafiqul Islam', items: 'Fexo 120 x5', total: 450, status: 'Delivered', time: '1h ago', address: 'Uttara Sector 7', fulfillmentDate: '2023-10-12' },
];

const MOCK_PHARMACIES_NEARBY = [
  { id: '1', name: 'Lazz Pharma', address: 'Kalabagan, Dhaka', distance: '0.5 km' },
  { id: '2', name: 'Tamanna Pharmacy', address: 'Dhanmondi 32, Dhaka', distance: '1.2 km' },
  { id: '3', name: 'Popular Medicart', address: 'Green Road, Dhaka', distance: '1.8 km' },
  { id: '4', name: 'Bio-Pharma', address: 'Panthapath, Dhaka', distance: '2.5 km' },
  { id: '5', name: 'Insaf Drug House', address: 'Mirpur 10, Dhaka', distance: '4.0 km' },
];

interface ClientAppProps {
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  onRegisterPharmacy: (pharmacy: Pharmacy) => void;
  onExit: () => void;
}

const ClientApp: React.FC<ClientAppProps> = ({ medicines, pharmacies, onRegisterPharmacy, onExit }) => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginType, setLoginType] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER');
  const [userPhone, setUserPhone] = useState('');
  
  // App State
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [currentPharmacy, setCurrentPharmacy] = useState<Pharmacy | null>(null);
  
  // Customer Specific
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchCache, setSearchCache] = useState<Record<string, any>>({});

  // UI Toggles
  const [showMenu, setShowMenu] = useState(false);
  const [showPharmacySelector, setShowPharmacySelector] = useState(false);
  const [activeNotification, setActiveNotification] = useState<{name: string, dose: string, time: string} | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Owner Specific
  const [ownerTab, setOwnerTab] = useState<'DASHBOARD' | 'INVENTORY' | 'ORDERS'>('DASHBOARD');
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [showOwnerProfile, setShowOwnerProfile] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<any>>({});
  const [editingItem, setEditingItem] = useState<any>(null); // Track item being edited
  const [confirmAction, setConfirmAction] = useState<{ type: 'CANCEL' | 'DELIVER', orderId: string } | null>(null);
  const [actionDate, setActionDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Registration Form State
  const [regShopName, setRegShopName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regTradeLicenseFile, setRegTradeLicenseFile] = useState<File | null>(null);
  const [regNidFile, setRegNidFile] = useState<File | null>(null);

  // Search
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchResults, setHomeSearchResults] = useState<Medicine[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Real-time Effects ---
  useEffect(() => {
    let interval: any;
    if (role === UserRole.PHARMACY_OWNER && currentPharmacy?.status === 'APPROVED') {
       interval = setInterval(() => {
         const random = Math.random();
         if (random > 0.8) { // Simulate infrequent orders
           const newOrder = {
             id: Math.floor(1000 + Math.random() * 9000).toString(),
             customer: ['Jamal', 'Kamal', 'Sadia', 'Fatima', 'Rahim'][Math.floor(Math.random() * 5)],
             items: ['Napa Extra x10', 'Seclo 20 x20', 'Tufnil x5'][Math.floor(Math.random() * 3)],
             total: Math.floor(100 + Math.random() * 500),
             status: 'New',
             time: 'Just now',
             address: 'Gulshan 1, Dhaka'
           };
           setOrders(prev => [newOrder, ...prev]);
           showToast(`New Order Received!`);
         }
       }, 20000);
    }
    return () => clearInterval(interval);
  }, [role, currentPharmacy]);

  // --- Reminder Alarm Logic ---
  useEffect(() => {
    const checkReminders = () => {
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;
        
        reminders.forEach(r => {
            if (r.times.includes(currentTime)) {
                // Trigger notification if not already active for this time/med
                if (!activeNotification || activeNotification.name !== r.name || activeNotification.time !== currentTime) {
                    setActiveNotification({ name: r.name, dose: r.dose, time: currentTime });
                }
            }
        });
    };

    // Check frequently (every 10s) to catch the minute, but ensure we don't annoy user if they dismissed it.
    // In a real app, we would use Service Workers or Push API.
    const alarmInterval = setInterval(() => {
        const now = new Date();
        // Only trigger within the first 15 seconds of a minute to avoid re-triggering after dismissal in the same minute
        if (now.getSeconds() < 15) {
            checkReminders();
        }
    }, 10000);

    return () => clearInterval(alarmInterval);
  }, [reminders, activeNotification]);


  // --- Handlers ---

  const handleLogin = (phone: string) => {
    setUserPhone(phone);
    setIsLoggingIn(false);

    if (loginType === 'OWNER') {
        const pharmacy = pharmacies.find(p => p.phone === phone);
        if (pharmacy) {
            setCurrentPharmacy(pharmacy);
            setRole(UserRole.PHARMACY_OWNER);
            if (pharmacy.status === 'APPROVED') {
                setCurrentView(AppView.PHARMACY_DASHBOARD);
            } else if (pharmacy.status === 'REJECTED') {
                setCurrentView(AppView.PHARMACY_REJECTED);
            } else {
                setCurrentView(AppView.PHARMACY_PENDING);
            }
        } else {
            setRole(UserRole.PHARMACY_OWNER);
            setCurrentView(AppView.PHARMACY_REGISTRATION);
        }
    } else {
        setRole(UserRole.CUSTOMER);
        setCurrentView(AppView.HOME);
    }
  };

  const handlePharmacyRegistration = () => {
      if (!regShopName || !regOwnerName || !regLicense || !regAddress || !regTradeLicenseFile || !regNidFile) {
          alert("All fields and documents are required");
          return;
      }
      const newPharmacy: Pharmacy = {
          id: Date.now().toString(),
          name: regShopName,
          ownerName: regOwnerName,
          phone: userPhone,
          licenseNo: regLicense,
          address: regAddress,
          status: 'PENDING'
      };
      onRegisterPharmacy(newPharmacy);
      setCurrentPharmacy(newPharmacy);
      setCurrentView(AppView.PHARMACY_PENDING);
  };

  const handleHomeSearch = (text: string) => {
    setHomeSearchQuery(text);
    if (text.length > 0) {
      const results = medicines.filter(m => 
        m.name.toLowerCase().includes(text.toLowerCase()) || 
        m.genericName.toLowerCase().includes(text.toLowerCase())
      );
      setHomeSearchResults(results.slice(0, 5));
    } else {
      setHomeSearchResults([]);
    }
  };

  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setCurrentView(AppView.MEDICINE_DETAIL);
    setHomeSearchQuery('');
    setHomeSearchResults([]);
  };

  const handleAddToCart = (medicine: Medicine) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    showToast(`${medicine.name} added to cart`);
  };

  const handleCheckout = () => {
    setCartItems([]);
    showToast("Order placed successfully!");
    setCurrentView(AppView.ORDER_HISTORY); 
  };

  const toggleFavorite = (medicine: Medicine) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === medicine.id);
      if (exists) {
        showToast(`${medicine.name} removed from favorites`);
        return prev.filter(f => f.id !== medicine.id);
      } else {
        showToast(`${medicine.name} added to favorites`);
        return [...prev, medicine];
      }
    });
  };

  const handleSearchResultClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setCurrentView(AppView.MEDICINE_DETAIL);
    setHomeSearchQuery('');
    setHomeSearchResults([]);
  };

  const handlePharmacySelect = (pharmacyName: string) => {
      setSelectedPharmacy(pharmacyName);
      showToast(`Selected Pharmacy: ${pharmacyName}`);
  };

  const handlePrintOrder = (order: any) => {
    const printContent = `
      <html>
        <head><title>Receipt #${order.id}</title></head>
        <body style="font-family: monospace; padding: 20px;">
          <h2 style="text-align:center;">MEDI PANDA BD</h2>
          <hr/>
          <p>Order: #${order.id}</p>
          <p>Customer: ${order.customer}</p>
          <p>Items: ${order.items}</p>
          <h3 style="text-align:right;">Total: ৳${order.total}</h3>
        </body>
      </html>
    `;
    const win = window.open('', '', 'width=300,height=500');
    if(win) {
        win.document.write(printContent);
        win.document.close();
        win.print();
    }
  };

  // --- Render Views ---

  if (isLoggingIn) {
    return <Login onLogin={handleLogin} onBack={() => setIsLoggingIn(false)} userType={loginType} />;
  }

  if (role === UserRole.NONE) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-6 relative">
          <button onClick={onExit} className="absolute top-6 left-6 text-gray-500 flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Back to Portal</button>
          
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 animate-bounce">
            <span className="text-6xl">🐼</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MediPanda BD</h1>
          <p className="text-gray-500 mb-10 text-center max-w-xs">Your trusted AI healthcare companion</p>
          
          <div className="space-y-4 w-full max-w-xs">
            <button 
              onClick={() => { setLoginType('CUSTOMER'); setIsLoggingIn(true); }}
              className="w-full bg-pink-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" /> Login as Customer
            </button>
            <button 
              onClick={() => { setLoginType('OWNER'); setIsLoggingIn(true); }}
              className="w-full bg-white text-gray-800 border border-gray-200 p-4 rounded-xl font-bold hover:bg-gray-50 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" /> Login as Pharmacy Owner
            </button>
          </div>
        </div>
    );
  }

  // --- Pharmacy Owner View ---
  if (role === UserRole.PHARMACY_OWNER) {
      if (currentView === AppView.PHARMACY_REGISTRATION) {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl">
                    <div className="text-center mb-8">
                        <Store className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Partner Registration</h2>
                    </div>
                    <div className="space-y-4">
                        <input className="w-full p-3 border rounded-xl" placeholder="Pharmacy Name" value={regShopName} onChange={e => setRegShopName(e.target.value)} />
                        <input className="w-full p-3 border rounded-xl" placeholder="Owner Name" value={regOwnerName} onChange={e => setRegOwnerName(e.target.value)} />
                        <input className="w-full p-3 border rounded-xl" placeholder="Trade License No." value={regLicense} onChange={e => setRegLicense(e.target.value)} />
                        
                        <div className="border rounded-xl p-3 bg-gray-50">
                            <p className="text-xs font-bold text-gray-500 mb-2">Upload Trade License Copy</p>
                            <input type="file" className="text-xs" onChange={e => setRegTradeLicenseFile(e.target.files?.[0] || null)} />
                        </div>
                        <div className="border rounded-xl p-3 bg-gray-50">
                            <p className="text-xs font-bold text-gray-500 mb-2">Upload NID Copy</p>
                            <input type="file" className="text-xs" onChange={e => setRegNidFile(e.target.files?.[0] || null)} />
                        </div>

                        <textarea className="w-full p-3 border rounded-xl" placeholder="Shop Address" value={regAddress} onChange={e => setRegAddress(e.target.value)} />
                        <button onClick={handlePharmacyRegistration} className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700">Submit for Approval</button>
                        <button onClick={() => setRole(UserRole.NONE)} className="w-full text-gray-500 font-medium py-2">Cancel</button>
                    </div>
                </div>
            </div>
          );
      }

      if (currentView === AppView.PHARMACY_PENDING || currentPharmacy?.status === 'PENDING') {
          return (
            <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl text-center">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Approval Pending</h2>
                    <p className="text-gray-600 mb-6">Admin is reviewing your documents. Please check back later.</p>
                    <button onClick={() => setRole(UserRole.NONE)} className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold">Log Out</button>
                </div>
            </div>
          );
      }

      if (currentView === AppView.PHARMACY_REJECTED || currentPharmacy?.status === 'REJECTED') {
          return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl text-center">
                    <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h2>
                    <p className="text-gray-600 mb-6">Your pharmacy application was not approved. Please contact support or try applying again.</p>
                    <button onClick={() => setRole(UserRole.NONE)} className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold">Log Out</button>
                </div>
            </div>
          );
      }

      // Owner Dashboard
      return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="bg-purple-700 px-6 py-4 flex justify-between items-center shadow-lg z-10">
                <div className="flex items-center gap-3 text-white">
                    <Store className="w-6 h-6" />
                    <div>
                        <h1 className="text-xl font-bold leading-none">Partner Dashboard</h1>
                        <p className="text-[10px] text-purple-200 uppercase tracking-wider">{currentPharmacy?.name}</p>
                    </div>
                </div>
                <button onClick={() => setRole(UserRole.NONE)} className="p-2 bg-purple-800 rounded-lg text-white"><LogOut className="w-5 h-5" /></button>
            </div>

            <div className="flex bg-white border-b border-gray-200">
                {['DASHBOARD', 'INVENTORY', 'ORDERS'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setOwnerTab(tab as any)}
                        className={`flex-1 py-4 font-bold text-sm transition-colors ${ownerTab === tab ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {ownerTab === 'DASHBOARD' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="opacity-80">Today's Sales</p>
                            <h3 className="text-3xl font-bold">৳ {orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0)}</h3>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="opacity-80">Pending Orders</p>
                            <h3 className="text-3xl font-bold">{orders.filter(o => ['New', 'Pending'].includes(o.status)).length}</h3>
                        </div>
                    </div>
                )}
                
                {ownerTab === 'ORDERS' && (
                    <div className="space-y-3">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600">{order.status}</span>
                                </div>
                                <p className="text-sm text-gray-600">{order.items}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <p className="font-bold text-pink-600">৳ {order.total}</p>
                                    <button onClick={() => handlePrintOrder(order)} className="text-gray-500 hover:text-gray-900"><Printer className="w-5 h-5"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {ownerTab === 'INVENTORY' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search inventory..." 
                                    value={inventorySearch}
                                    onChange={(e) => setInventorySearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500" 
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    setEditingItem(null);
                                    setNewMedicine({});
                                    setShowInventoryModal(true);
                                }} 
                                className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 shadow-lg shadow-purple-200"
                            >
                                <Plus className="w-5 h-5" /> Add Product
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                        <tr>
                                            <th className="p-4">Item Name</th>
                                            <th className="p-4">Generic</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Stock</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {inventory
                                            .filter(item => item.name.toLowerCase().includes(inventorySearch.toLowerCase()) || item.generic.toLowerCase().includes(inventorySearch.toLowerCase()))
                                            .map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-bold text-gray-800">{item.name}</td>
                                                <td className="p-4 text-sm text-gray-500">{item.generic}</td>
                                                <td className="p-4 text-sm">
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold">{item.type}</span>
                                                </td>
                                                <td className="p-4 font-bold text-gray-800">{item.stock}</td>
                                                <td className="p-4 font-bold text-purple-600">৳{item.price}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                                        item.status === 'Good' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'Low' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingItem(item);
                                                                setNewMedicine(item);
                                                                setShowInventoryModal(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                if(window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                                                                    setInventory(prev => prev.filter(i => i.id !== item.id));
                                                                    showToast('Item deleted');
                                                                }
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showInventoryModal && (
                <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 animate-slide-up shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                <Package className="w-6 h-6 text-purple-600" />
                                {editingItem ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setShowInventoryModal(false)}><X className="w-6 h-6 text-gray-400 hover:text-red-500" /></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                                <input 
                                    className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 outline-none" 
                                    placeholder="e.g. Napa Extra" 
                                    value={newMedicine.name || ''} 
                                    onChange={e => setNewMedicine({...newMedicine, name: e.target.value})} 
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Generic Name</label>
                                <input 
                                    className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 outline-none" 
                                    placeholder="e.g. Paracetamol" 
                                    value={newMedicine.generic || ''} 
                                    onChange={e => setNewMedicine({...newMedicine, generic: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                <select 
                                    className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                    value={newMedicine.type || 'Tablet'}
                                    onChange={e => setNewMedicine({...newMedicine, type: e.target.value})}
                                >
                                    <option value="Tablet">Tablet</option>
                                    <option value="Capsule">Capsule</option>
                                    <option value="Syrup">Syrup</option>
                                    <option value="Injection">Injection</option>
                                    <option value="Cream">Cream</option>
                                    <option value="Drops">Drops</option>
                                    <option value="Suspension">Suspension</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Price (BDT)</label>
                                <input 
                                    type="number"
                                    className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 outline-none" 
                                    placeholder="0.00" 
                                    value={newMedicine.price || ''} 
                                    onChange={e => setNewMedicine({...newMedicine, price: parseFloat(e.target.value)})} 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Current Stock</label>
                                <input 
                                    type="number"
                                    className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 outline-none" 
                                    placeholder="0" 
                                    value={newMedicine.stock || ''} 
                                    onChange={e => setNewMedicine({...newMedicine, stock: parseInt(e.target.value)})} 
                                />
                            </div>
                            <div className="flex items-center">
                                {/* Status Preview */}
                                <div className="w-full">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Status Preview</label>
                                    <div className="mt-2">
                                        {(newMedicine.stock || 0) < 10 ? (
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><AlertCircle className="w-3 h-3"/> Critical</span>
                                        ) : (newMedicine.stock || 0) < 30 ? (
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><AlertCircle className="w-3 h-3"/> Low</span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><CheckCircle className="w-3 h-3"/> Good</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                onClick={() => setShowInventoryModal(false)}
                                className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    if (!newMedicine.name || !newMedicine.stock || !newMedicine.price) {
                                        showToast('Please fill required fields');
                                        return;
                                    }

                                    const stockVal = Number(newMedicine.stock) || 0;
                                    const status = stockVal < 10 ? 'Critical' : stockVal < 30 ? 'Low' : 'Good';
                                    
                                    if (editingItem) {
                                        setInventory(prev => prev.map(i => i.id === editingItem.id ? {
                                            ...i,
                                            ...newMedicine,
                                            stock: stockVal,
                                            status
                                        } : i));
                                        showToast('Product updated');
                                    } else {
                                        const newItem = {
                                            id: Date.now(),
                                            name: newMedicine.name,
                                            generic: newMedicine.generic || 'Generic',
                                            type: newMedicine.type || 'Tablet',
                                            stock: stockVal,
                                            price: Number(newMedicine.price) || 0,
                                            status
                                        };
                                        setInventory(prev => [newItem, ...prev]);
                                        showToast('Product added');
                                    }
                                    setShowInventoryModal(false);
                                }}
                                className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-colors"
                            >
                                {editingItem ? 'Save Changes' : 'Add to Inventory'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  }

  // --- Customer View ---
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-20">
        <CustomerMenu 
           isOpen={showMenu} 
           onClose={() => setShowMenu(false)} 
           onNavigate={(view) => { setCurrentView(view as AppView); setShowMenu(false); }}
           onLogout={() => { setRole(UserRole.NONE); setShowMenu(false); }}
           userName="Rahim Uddin"
        />

        {/* --- Alarm Notification Modal --- */}
        {activeNotification && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500"></div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <BellRing className="w-10 h-10 text-pink-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Medicine Time!</h2>
                    <p className="text-gray-500 mt-1">It's {activeNotification.time}. Time to take your meds.</p>
                    
                    <div className="bg-gray-50 rounded-xl p-4 w-full mt-6 border border-gray-100">
                        <h3 className="font-bold text-lg text-pink-600">{activeNotification.name}</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">Dosage: {activeNotification.dose}</p>
                    </div>

                    <button 
                        onClick={() => setActiveNotification(null)}
                        className="mt-8 w-full bg-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" /> Taken
                    </button>
                    <button 
                        onClick={() => setActiveNotification(null)}
                        className="mt-3 text-gray-400 text-xs font-bold hover:text-gray-600"
                    >
                        Snooze for 10m
                    </button>
                </div>
            </div>
            </div>
        )}

        {currentView === AppView.CART ? (
          <Cart 
            items={cartItems} 
            onUpdateQuantity={(id, d) => setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))}
            onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
            onCheckout={handleCheckout}
            onBack={() => setCurrentView(AppView.HOME)}
            onStartShopping={() => setCurrentView(AppView.MEDICINE_DIRECTORY)}
            userPhone={userPhone}
          />
        ) : currentView === AppView.MEDICINE_DETAIL && selectedMedicine ? (
          <MedicineDetail 
             medicine={selectedMedicine}
             isFavorite={favorites.some(f => f.id === selectedMedicine.id)}
             onToggleFavorite={() => toggleFavorite(selectedMedicine)}
             onBack={() => setCurrentView(AppView.HOME)} 
             onAddToCart={() => handleAddToCart(selectedMedicine)}
          />
        ) : currentView === AppView.MEDICINE_DIRECTORY ? (
          <MedicineDirectory 
             onBack={() => setCurrentView(AppView.HOME)}
             onAddToCart={handleAddToCart}
             onSelect={handleMedicineSelect}
             medicines={medicines}
          />
        ) : currentView === AppView.MEDICINE_REMINDER ? (
            <MedicineReminder onBack={() => setCurrentView(AppView.HOME)} reminders={reminders} setReminders={setReminders} />
        ) : currentView === AppView.HEALTH_TIPS ? (
            <HealthTips onBack={() => setCurrentView(AppView.HOME)} />
        ) : currentView === AppView.PROFILE ? (
            <UserProfile onBack={() => setCurrentView(AppView.HOME)} />
        ) : currentView === AppView.ORDER_HISTORY ? (
            <OrderHistory onBack={() => setCurrentView(AppView.HOME)} />
        ) : currentView === AppView.FAVORITES ? (
            <Favorites items={favorites} onRemove={id => setFavorites(p => p.filter(x => x.id !== id))} onAddToCart={handleAddToCart} onBack={() => setCurrentView(AppView.HOME)} />
        ) : currentView === AppView.SETTINGS ? (
            <Settings onBack={() => setCurrentView(AppView.HOME)} onNavigate={v => setCurrentView(v as AppView)} userPhone={userPhone} />
        ) : (
            // Home Page View
            <>
                <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowMenu(true)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><Menu className="w-5 h-5 text-gray-700" /></button>
                        <div>
                            <p className="text-xs text-pink-600 font-bold uppercase">Delivering to</p>
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowPharmacySelector(true)}>
                                <p className="text-sm font-bold text-gray-800">{selectedPharmacy || 'Home • Dhanmondi'}</p>
                                <ChevronDown className="w-3 h-3 text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setCurrentView(AppView.CART)} className="relative p-2.5 bg-pink-50 rounded-full hover:bg-pink-100">
                        <ShoppingBag className="w-5 h-5 text-pink-600" />
                        {cartItems.length > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartItems.length}</span>}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
                    <div className="relative z-20">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search medicines..." 
                            value={homeSearchQuery}
                            onChange={(e) => handleHomeSearch(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        {homeSearchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl z-30">
                                {homeSearchResults.map(med => (
                                    <button key={med.id} onClick={() => handleSearchResultClick(med)} className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-0 flex justify-between items-center">
                                        <span>{med.name}</span>
                                        <span className="text-xs text-pink-600 font-bold">৳{med.price}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-1">Upload Prescription</h2>
                            <p className="text-pink-100 text-sm mb-4">Get medicines delivered in 30 mins</p>
                            <button onClick={() => setCurrentView(AppView.PRESCRIPTION_EDIT)} className="bg-white text-pink-600 px-6 py-2 rounded-full font-bold shadow-md flex items-center gap-2">
                                <Stethoscope className="w-4 h-4" /> Order Now
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Pill className="w-32 h-32" /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setCurrentView(AppView.LIVE_PHARMACIST)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600"><User className="w-5 h-5"/></div>
                            <span className="text-xs font-bold text-gray-700">Live Pharmacist</span>
                        </button>
                        <button onClick={() => setCurrentView(AppView.MEDICINE_DIRECTORY)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Pill className="w-5 h-5"/></div>
                            <span className="text-xs font-bold text-gray-700">All Medicines</span>
                        </button>
                    </div>

                    {/* Popular Medicines List */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">Popular Now</h3>
                        <div className="space-y-3">
                            {medicines.slice(0, 5).map(med => (
                                <div key={med.id} onClick={() => handleMedicineSelect(med)} className="bg-white p-3 rounded-2xl flex items-center gap-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">💊</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{med.name}</h4>
                                        <p className="text-xs text-gray-500">{med.genericName}</p>
                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                                            <Factory className="w-3 h-3"/> {med.manufacturer}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-bold text-pink-600">৳ {med.price}</span>
                                        <button onClick={(e) => {e.stopPropagation(); handleAddToCart(med)}} className="w-8 h-8 flex items-center justify-center bg-pink-50 text-pink-600 rounded-lg"><Plus className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {currentView === AppView.AI_ASSISTANT && (
                    <Assistant initialQuery={assistantQuery} onSelectPharmacy={handlePharmacySelect} searchCache={searchCache} onSaveCache={(q, res) => setSearchCache(prev => ({...prev, [q]: res}))} />
                )}
                {currentView === AppView.LIVE_PHARMACIST && (
                    <LivePharmacist onClose={() => setCurrentView(AppView.HOME)} />
                )}
                {currentView === AppView.PRESCRIPTION_EDIT && (
                    <PrescriptionEditor />
                )}

                <div className="bg-white border-t border-gray-100 flex justify-around p-3 sticky bottom-0 z-10 pb-6">
                    <button onClick={() => setCurrentView(AppView.HOME)} className={`flex flex-col items-center gap-1 ${currentView === AppView.HOME ? 'text-pink-600' : 'text-gray-400'}`}><Home className="w-6 h-6" /><span className="text-[10px]">Home</span></button>
                    <button onClick={() => setCurrentView(AppView.MEDICINE_DIRECTORY)} className="flex flex-col items-center gap-1 text-gray-400"><Pill className="w-6 h-6" /><span className="text-[10px]">Meds</span></button>
                    <div className="relative -top-8">
                        <button onClick={() => setCurrentView(AppView.AI_ASSISTANT)} className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-pink-200"><Search className="w-7 h-7" /></button>
                    </div>
                    <button onClick={() => setCurrentView(AppView.HEALTH_TIPS)} className="flex flex-col items-center gap-1 text-gray-400"><BookOpen className="w-6 h-6" /><span className="text-[10px]">Tips</span></button>
                    <button onClick={() => setCurrentView(AppView.PROFILE)} className="flex flex-col items-center gap-1 text-gray-400"><User className="w-6 h-6" /><span className="text-[10px]">Profile</span></button>
                </div>
                
                {toastMessage && (
                    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl animate-bounce-in z-[100] flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" /> {toastMessage}
                    </div>
                )}
                {showPharmacySelector && (
                    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm">
                        <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Select Pharmacy</h3>
                                <button onClick={() => setShowPharmacySelector(false)}><X className="w-6 h-6 text-gray-400" /></button>
                            </div>
                            <div className="space-y-3">
                                {MOCK_PHARMACIES_NEARBY.map(p => (
                                    <button key={p.id} onClick={() => {setSelectedPharmacy(p.name); setShowPharmacySelector(false); showToast(`Selected: ${p.name}`);}} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-all text-left">
                                        <div><p className="font-bold text-gray-800">{p.name}</p><p className="text-xs text-gray-500">{p.address}</p></div>
                                        {selectedPharmacy === p.name && <CheckCircle className="w-5 h-5 text-pink-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}
    </div>
  );
};

export default ClientApp;
