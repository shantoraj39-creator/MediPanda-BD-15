
import React, { useState } from 'react';
import { ArrowLeft, Plus, Clock, Calendar, Calculator, Trash2, Bell, X, Sun, Moon, Coffee } from 'lucide-react';
import { Reminder } from '../types';

interface MedicineReminderProps {
  onBack: () => void;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

export const MedicineReminder: React.FC<MedicineReminderProps> = ({ onBack, reminders, setReminders }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [dose, setDose] = useState('1'); // Pills per time
  const [days, setDays] = useState('7');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState('');

  // Time slots helper
  const TIME_SLOTS = [
    { label: 'Morning', time: '08:00', icon: <Sun className="w-4 h-4" /> },
    { label: 'Noon', time: '13:00', icon: <Sun className="w-4 h-4 text-orange-500" /> },
    { label: 'Evening', time: '18:00', icon: <Coffee className="w-4 h-4" /> },
    { label: 'Night', time: '22:00', icon: <Moon className="w-4 h-4" /> },
  ];

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(prev => prev.filter(t => t !== time));
    } else {
      setSelectedTimes(prev => [...prev, time].sort());
    }
  };

  const addCustomTime = () => {
    if (customTime && !selectedTimes.includes(customTime)) {
      setSelectedTimes(prev => [...prev, customTime].sort());
      setCustomTime('');
    }
  };

  const calculateTotal = () => {
    const dosesPerDay = selectedTimes.length;
    const duration = parseInt(days) || 0;
    const dosage = parseInt(dose) || 0;
    return dosesPerDay * duration * dosage;
  };

  const handleSave = () => {
    if (!name || selectedTimes.length === 0) return;

    const newReminder: Reminder = {
      id: Date.now().toString(),
      name,
      dose,
      times: selectedTimes,
      days: parseInt(days),
      totalQuantity: calculateTotal(),
      startDate: new Date().toISOString(),
    };

    setReminders(prev => [...prev, newReminder]);
    
    // Reset form
    setName('');
    setSelectedTimes([]);
    setDose('1');
    setDays('7');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="bg-white min-h-screen pb-24 animate-fade-in relative z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex justify-between items-center shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Pill Tracker & Calculator</h1>
        </div>
        <button 
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
        >
            <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Add Form Modal/Overlay */}
        {showAddForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                    <div className="bg-pink-600 p-4 text-white">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Calculator className="w-5 h-5" /> Medicine Calculator
                        </h2>
                        <p className="text-pink-100 text-xs">Plan your course & set alarms</p>
                    </div>
                    
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Napa Extra" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (Select times)</label>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {TIME_SLOTS.map((slot) => (
                                    <button
                                        key={slot.time}
                                        onClick={() => toggleTime(slot.time)}
                                        className={`flex items-center justify-center gap-2 py-2 rounded-xl border transition-all ${
                                            selectedTimes.includes(slot.time) 
                                            ? 'bg-pink-50 border-pink-500 text-pink-700 font-medium' 
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {slot.icon}
                                        <span className="text-xs">{slot.label} ({slot.time})</span>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Custom Time Input */}
                            <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                              <Clock className="w-4 h-4 text-gray-400 ml-2" />
                              <input 
                                type="time" 
                                value={customTime}
                                onChange={(e) => setCustomTime(e.target.value)}
                                className="bg-transparent text-sm text-gray-700 outline-none flex-1"
                              />
                              <button 
                                onClick={addCustomTime}
                                disabled={!customTime}
                                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-bold disabled:opacity-50"
                              >
                                Add
                              </button>
                            </div>

                            {/* Selected Times Tags */}
                            {selectedTimes.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {selectedTimes.map(t => (
                                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-md text-xs font-bold">
                                    {t}
                                    <button onClick={() => toggleTime(t)} className="hover:text-pink-900"><X className="w-3 h-3" /></button>
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dose (Qty)</label>
                                <input 
                                    type="number" 
                                    value={dose}
                                    onChange={(e) => setDose(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                                <input 
                                    type="number" 
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                        </div>

                        {/* Calculation Result */}
                        <div className="bg-gray-900 text-white p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Required</p>
                                <p className="text-2xl font-bold text-yellow-400">{calculateTotal()} <span className="text-sm text-gray-400 font-normal">Pills</span></p>
                            </div>
                            <Calculator className="w-8 h-8 text-gray-700" />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={() => setShowAddForm(false)}
                                className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={!name || selectedTimes.length === 0}
                                className="flex-1 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50"
                            >
                                Set Alarm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        {/* Reminders List */}
        <div className="space-y-4">
            {reminders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-800 font-bold mb-1">No Reminders Set</h3>
                    <p className="text-gray-500 text-sm">Add your medicines to get day-wise calculation and alarms.</p>
                    <button 
                        onClick={() => setShowAddForm(true)}
                        className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-full text-sm font-medium hover:bg-pink-700"
                    >
                        Add Medicine
                    </button>
                </div>
            ) : (
                reminders.map((reminder) => (
                    <div key={reminder.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3">
                            <button 
                                onClick={() => handleDelete(reminder.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                💊
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{reminder.name}</h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        <Calendar className="w-3 h-3" /> {reminder.days} Days
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        <Calculator className="w-3 h-3" /> Total: {reminder.totalQuantity}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Schedule</p>
                            <div className="flex flex-wrap gap-2">
                                {reminder.times.map((t) => (
                                    <span key={t} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1 border border-blue-100">
                                        <Clock className="w-3 h-3" /> {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
