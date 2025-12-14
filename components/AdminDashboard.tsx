
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Pill, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  X, 
  Search, 
  Plus, 
  LogOut,
  FileText,
  DollarSign,
  Trash2,
  Edit2,
  Ban,
  Unlock,
  Menu,
  Download,
  Database,
  CheckCircle,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Loader2,
  Save,
  Link
} from 'lucide-react';
import { Medicine, Pharmacy } from '../types';
import { parseMedicineDetails } from '../services/genai';

interface AdminDashboardProps {
  onLogout: () => void;
  pharmacies: Pharmacy[];
  onUpdatePharmacyStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  medicines: Medicine[];
  onAddMedicine: (med: Medicine) => void;
  onUpdateMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
}

// Mock Data for Stats & Users
const MOCK_STATS = [
  { label: 'Total Revenue', value: '৳ 1.2M', icon: <DollarSign className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
  { label: 'Active Pharmacies', value: '142', icon: <Store className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
  { label: 'Pending Approvals', value: '12', icon: <AlertCircle className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
  { label: 'Total Customers', value: '5.4k', icon: <Users className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
];

const MOCK_USERS = [
  { id: 1, name: 'Rahim Uddin', role: 'Customer', phone: '01712345678', status: 'Active' },
  { id: 2, name: 'Karim Ahmed', role: 'Customer', phone: '01812345678', status: 'Blocked' },
  { id: 3, name: 'Sokina Begum', role: 'Customer', phone: '01512345678', status: 'Active' },
  { id: 4, name: 'Jamal Hossain', role: 'Pharmacy Owner', phone: '01912345678', status: 'Active' },
];

type AdminView = 'OVERVIEW' | 'PHARMACIES' | 'MEDICINES' | 'USERS' | 'DATA_ANALYST';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  pharmacies, 
  onUpdatePharmacyStatus,
  medicines,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine
}) => {
  const [currentView, setCurrentView] = useState<AdminView>('OVERVIEW');
  const [medicineSearch, setMedicineSearch] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Medicine Form State
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({});

  // Data Analyst State
  const [analystInput, setAnalystInput] = useState('');
  const [analystResult, setAnalystResult] = useState<Partial<Medicine> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pendingPharmacies = pharmacies.filter(p => p.status === 'PENDING');
  const approvedPharmacies = pharmacies.filter(p => p.status === 'APPROVED');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Pharmacy Approval Logic
  const handleApprove = (id: string) => {
    onUpdatePharmacyStatus(id, 'APPROVED');
    showToast("Pharmacy Approved Successfully");
  };

  const handleReject = (id: string) => {
    onUpdatePharmacyStatus(id, 'REJECTED');
    showToast("Pharmacy Rejected");
  };

  // Medicine Management Logic
  const handleDeleteMedicine = (id: string) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      onDeleteMedicine(id);
      showToast("Medicine Deleted");
    }
  };

  const handleSaveMedicine = () => {
    if (!newMedicine.name || !newMedicine.price || !newMedicine.manufacturer) {
        alert("Please fill in Name, Price, and Manufacturer.");
        return;
    }

    if (newMedicine.id) {
        // Update existing
        onUpdateMedicine(newMedicine as Medicine);
        showToast("Medicine Updated Successfully");
    } else {
        // Add new
        const med: Medicine = {
            id: Date.now().toString(),
            name: newMedicine.name,
            genericName: newMedicine.genericName || 'Generic',
            price: Number(newMedicine.price),
            manufacturer: newMedicine.manufacturer,
            type: newMedicine.type || 'Tablet',
            category: newMedicine.category || 'General',
            primaryUse: newMedicine.primaryUse || 'General use',
            sideEffects: newMedicine.sideEffects || 'N/A',
            storage: newMedicine.storage || 'Store in cool place'
        };
        onAddMedicine(med);
        showToast("Medicine Added to Database");
    }
    
    setShowMedicineModal(false);
    setNewMedicine({});
  };

  const openAddModal = () => {
      setNewMedicine({});
      setShowMedicineModal(true);
  };

  const openEditModal = (med: Medicine) => {
      setNewMedicine(med);
      setShowMedicineModal(true);
  };

  // AI Analyst Logic
  const handleAnalyze = async () => {
    if(!analystInput.trim()) return;
    setIsAnalyzing(true);
    setAnalystResult(null);
    
    try {
        const result = await parseMedicineDetails(analystInput);
        if(result) {
            setAnalystResult(result);
        } else {
            showToast("Failed to parse data. Try again.");
        }
    } catch (e) {
        showToast("Analysis Error");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleConfirmAnalysis = () => {
    if(analystResult && analystResult.name) {
        const med: Medicine = {
            id: Date.now().toString(),
            name: analystResult.name,
            genericName: analystResult.genericName || 'Generic',
            price: Number(analystResult.price) || 0,
            manufacturer: analystResult.manufacturer || 'Unknown',
            type: analystResult.type || 'Tablet',
            category: analystResult.category || 'General',
            primaryUse: analystResult.primaryUse || 'General use',
            sideEffects: analystResult.sideEffects || 'N/A',
            storage: analystResult.storage || 'Store in cool place'
        };
        onAddMedicine(med);
        setAnalystResult(null);
        setAnalystInput('');
        showToast("Medicine added via AI Analyst");
    }
  };

  const toggleUserStatus = (id: number) => {
      setUsers(prev => prev.map(u => 
          u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u
      ));
      showToast("User Status Updated");
  };

  const handleExportData = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      pharmacies: pharmacies,
      medicines: medicines,
      users: users,
      stats: MOCK_STATS
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `medipanda_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast("Data Exported Successfully");
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    m.genericName.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl z-50 animate-fade-in flex items-center gap-2">
           <CheckCircle className="w-5 h-5 text-green-400" />
           <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-2xl">🐼</div>
            <div>
              <h1 className="font-bold text-lg leading-none">MediPanda</h1>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => { setCurrentView('OVERVIEW'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'OVERVIEW' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => { setCurrentView('PHARMACIES'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'PHARMACIES' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Store className="w-5 h-5" /> Pharmacies 
            {pendingPharmacies.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingPharmacies.length}</span>}
          </button>
          <button 
            onClick={() => { setCurrentView('MEDICINES'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'MEDICINES' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Pill className="w-5 h-5" /> Medicine DB
          </button>
          <button 
            onClick={() => { setCurrentView('DATA_ANALYST'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'DATA_ANALYST' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BrainCircuit className="w-5 h-5" /> AI Data Entry
          </button>
          <button 
            onClick={() => { setCurrentView('USERS'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'USERS' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" /> User Management
          </button>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
             <p className="px-4 text-xs font-bold text-slate-500 uppercase mb-2">Data Management</p>
             <button 
               onClick={handleExportData}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-colors"
             >
               <Database className="w-5 h-5" /> Backup Data
             </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors px-4 py-2">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative w-full">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate">
              {currentView === 'OVERVIEW' && 'Dashboard Overview'}
              {currentView === 'PHARMACIES' && 'Pharmacy Verification'}
              {currentView === 'MEDICINES' && 'Global Medicine Database'}
              {currentView === 'DATA_ANALYST' && 'AI Data Entry Manager'}
              {currentView === 'USERS' && 'User Management'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExportData}
              className="p-2 hover:bg-gray-100 rounded-lg text-emerald-600 flex items-center gap-2"
              title="Backup Data"
            >
              <Download className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-bold">Backup</span>
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">A</div>
               <span className="text-sm font-medium text-gray-600 hidden md:inline">Super Admin</span>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          
          {/* OVERVIEW VIEW */}
          {currentView === 'OVERVIEW' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {MOCK_STATS.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" /> Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Order #{20230 + i} Completed</p>
                          <p className="text-xs text-gray-500">2 mins ago • Uttara Branch</p>
                        </div>
                        <span className="text-green-600 font-bold text-sm">+ ৳450</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-500" /> System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg text-sm">
                      <span className="text-green-800 font-medium">AI Services (Gemini)</span>
                      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">Operational</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg text-sm">
                      <span className="text-green-800 font-medium">Payment Gateway</span>
                      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">Operational</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg text-sm">
                      <span className="text-green-800 font-medium">Maps API</span>
                      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHARMACIES VIEW */}
          {currentView === 'PHARMACIES' && (
            <div className="space-y-6 animate-fade-in">
              {/* Pending List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                  <h3 className="font-bold text-lg text-orange-800">Pending Approvals</h3>
                  <div className="text-sm text-orange-600 font-bold bg-white px-3 py-1 rounded-full">{pendingPharmacies.length} Requests</div>
                </div>
                
                {pendingPharmacies.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <Check className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    <p>No pending requests.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                          <th className="px-6 py-4">Pharmacy Name</th>
                          <th className="px-6 py-4">Owner</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4">Trade License</th>
                          <th className="px-6 py-4">Address</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pendingPharmacies.map((pharmacy) => (
                          <tr key={pharmacy.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{pharmacy.name}</td>
                            <td className="px-6 py-4 text-gray-600">{pharmacy.ownerName}</td>
                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{pharmacy.phone}</td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 w-fit">
                                <FileText className="w-3 h-3" /> {pharmacy.licenseNo}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">{pharmacy.address}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleApprove(String(pharmacy.id))}
                                  className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                                  title="Approve Pharmacy"
                                >
                                  <Check className="w-4 h-4" /> Approve
                                </button>
                                <button 
                                  onClick={() => handleReject(String(pharmacy.id))}
                                  className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                                  title="Reject Pharmacy"
                                >
                                  <X className="w-4 h-4" /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Approved List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Approved Partners</h3>
                    <button onClick={handleExportData} className="text-xs flex items-center gap-1 text-emerald-600 font-bold hover:underline">
                      <Download className="w-3 h-3" /> Export List
                    </button>
                </div>
                {approvedPharmacies.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No approved pharmacies yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Pharmacy Name</th>
                                    <th className="px-6 py-4">Owner</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {approvedPharmacies.map((p) => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{p.ownerName}</td>
                                        <td className="px-6 py-4 text-gray-600 text-xs">{p.phone}</td>
                                        <td className="px-6 py-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* MEDICINES VIEW */}
          {currentView === 'MEDICINES' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search medicine database..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                  />
                </div>
                <button 
                    onClick={openAddModal}
                    className="w-full md:w-auto bg-pink-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 shadow-lg shadow-pink-200"
                >
                  <Plus className="w-5 h-5" /> Add New Medicine
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                          <th className="px-6 py-4">Medicine Name</th>
                          <th className="px-6 py-4">Generic</th>
                          <th className="px-6 py-4">Manufacturer</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4 text-right">MRP</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredMedicines.map((med) => (
                          <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{med.name}</td>
                            <td className="px-6 py-4 text-gray-500 text-sm">{med.genericName}</td>
                            <td className="px-6 py-4 text-gray-600 text-sm">{med.manufacturer}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${med.type?.includes('Syrup') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                {med.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-800">৳ {med.price}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => openEditModal(med)}
                                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Medicine"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteMedicine(med.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Medicine"
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

          {/* AI DATA ANALYST VIEW */}
          {currentView === 'DATA_ANALYST' && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl">
                    <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                        <BrainCircuit className="w-8 h-8" /> AI Data Entry Manager
                    </h2>
                    <p className="text-pink-100 max-w-xl">
                        Analyze medicine data from any text source or website link. 
                        Simply paste a <strong>URL to a product page</strong> or raw notes below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Area */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px]">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Link className="w-5 h-5 text-gray-500" /> Source Input
                        </h3>
                        <textarea 
                            value={analystInput}
                            onChange={(e) => setAnalystInput(e.target.value)}
                            placeholder="e.g. 'Add Napa Extra 500mg...' OR paste a link like 'https://medex.com.bd/brands/napa-extra'..."
                            className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 resize-none outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !analystInput}
                            className="mt-4 w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 text-yellow-400" />}
                            Analyze Web/Text
                        </button>
                    </div>

                    {/* Output/Review Area */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px] overflow-y-auto">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5 text-gray-500" /> Structured Preview
                        </h3>
                        
                        {analystResult ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                                        <input 
                                            value={analystResult.name} 
                                            onChange={(e) => setAnalystResult({...analystResult, name: e.target.value})}
                                            className="w-full font-bold text-gray-800 border-b border-gray-200 py-1 outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Price (BDT)</label>
                                        <input 
                                            type="number"
                                            value={analystResult.price} 
                                            onChange={(e) => setAnalystResult({...analystResult, price: Number(e.target.value)})}
                                            className="w-full font-bold text-pink-600 border-b border-gray-200 py-1 outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Generic Name</label>
                                        <input 
                                            value={analystResult.genericName} 
                                            onChange={(e) => setAnalystResult({...analystResult, genericName: e.target.value})}
                                            className="w-full text-gray-600 border-b border-gray-200 py-1 outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                                        <input 
                                            value={analystResult.type} 
                                            onChange={(e) => setAnalystResult({...analystResult, type: e.target.value})}
                                            className="w-full text-gray-800 border-b border-gray-200 py-1 outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Manufacturer</label>
                                        <input 
                                            value={analystResult.manufacturer} 
                                            onChange={(e) => setAnalystResult({...analystResult, manufacturer: e.target.value})}
                                            className="w-full text-gray-800 border-b border-gray-200 py-1 outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Primary Use</label>
                                        <input 
                                            value={analystResult.primaryUse} 
                                            onChange={(e) => setAnalystResult({...analystResult, primaryUse: e.target.value})}
                                            className="w-full text-gray-600 border-b border-gray-200 py-1 outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 pt-4 border-t border-gray-100">
                                    <button 
                                        onClick={handleConfirmAnalysis}
                                        className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                                    >
                                        <Save className="w-5 h-5" /> Confirm & Add to Database
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                                <ArrowRight className="w-8 h-8 opacity-20" />
                                <p className="text-sm">Processed data will appear here for review.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          )}

          {/* USERS VIEW */}
          {currentView === 'USERS' && (
            <div className="space-y-6 animate-fade-in">
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                     <h3 className="font-bold text-lg text-gray-800">Registered Users</h3>
                     <button onClick={handleExportData} className="text-xs flex items-center gap-1 text-emerald-600 font-bold hover:underline">
                      <Download className="w-3 h-3" /> Export List
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[700px]">
                         <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                               <th className="px-6 py-4">Name</th>
                               <th className="px-6 py-4">Role</th>
                               <th className="px-6 py-4">Phone</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                               <tr key={user.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                  <td className="px-6 py-4">
                                     <span className={`text-xs px-2 py-1 rounded-full font-bold ${user.role === 'Customer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {user.role}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                                  <td className="px-6 py-4">
                                     <span className={`text-xs px-2 py-1 rounded-full font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <button 
                                        onClick={() => toggleUserStatus(user.id)}
                                        className={`p-2 rounded-lg transition-colors ${user.status === 'Active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                        title={user.status === 'Active' ? 'Ban User' : 'Unban User'}
                                     >
                                        {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                     </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                  </div>
               </div>
            </div>
          )}

        </main>

        {/* Modal for Adding/Editing Medicine */}
        {showMedicineModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 animate-slide-up max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800">
                            {newMedicine.id ? 'Edit Medicine' : 'Add New Medicine'}
                        </h3>
                        <button onClick={() => setShowMedicineModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input className="p-3 border rounded-xl w-full" placeholder="Name" value={newMedicine.name || ''} onChange={e => setNewMedicine({...newMedicine, name: e.target.value})} />
                        <input className="p-3 border rounded-xl w-full" placeholder="Generic Name" value={newMedicine.genericName || ''} onChange={e => setNewMedicine({...newMedicine, genericName: e.target.value})} />
                        <input className="p-3 border rounded-xl w-full" placeholder="Price (BDT)" type="number" value={newMedicine.price || ''} onChange={e => setNewMedicine({...newMedicine, price: Number(e.target.value)})} />
                        <input className="p-3 border rounded-xl w-full" placeholder="Manufacturer" value={newMedicine.manufacturer || ''} onChange={e => setNewMedicine({...newMedicine, manufacturer: e.target.value})} />
                        <input className="p-3 border rounded-xl w-full" placeholder="Type (e.g. Tablet)" value={newMedicine.type || ''} onChange={e => setNewMedicine({...newMedicine, type: e.target.value})} />
                        <input className="p-3 border rounded-xl w-full" placeholder="Category" value={newMedicine.category || ''} onChange={e => setNewMedicine({...newMedicine, category: e.target.value})} />
                    </div>
                    <textarea className="p-3 border rounded-xl w-full h-20" placeholder="Primary Use" value={newMedicine.primaryUse || ''} onChange={e => setNewMedicine({...newMedicine, primaryUse: e.target.value})} />
                    
                    <button onClick={handleSaveMedicine} className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700">
                        {newMedicine.id ? 'Save Changes' : 'Add to Database'}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
