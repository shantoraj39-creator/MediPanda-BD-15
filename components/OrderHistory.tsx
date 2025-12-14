
import React from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, RefreshCw } from 'lucide-react';

interface OrderHistoryProps {
  onBack: () => void;
}

const PAST_ORDERS = [
  { id: '1021', date: '12 Oct, 2023', items: 'Napa Extra (20), Seclo 20 (10)', total: 450, status: 'Delivered' },
  { id: '1018', date: '05 Oct, 2023', items: 'Monas 10 (10), Tufnil (10)', total: 325, status: 'Delivered' },
  { id: '1015', date: '28 Sep, 2023', items: 'Fexo 120 (10)', total: 90, status: 'Delivered' },
];

const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack }) => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in relative z-50">
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Order History</h1>
      </div>

      <div className="p-4 space-y-4">
        {PAST_ORDERS.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   <div className="bg-pink-50 p-2 rounded-lg text-pink-600">
                      <Package className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                      <p className="text-xs text-gray-500">{order.date}</p>
                   </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                   <CheckCircle className="w-3 h-3" /> {order.status}
                </span>
             </div>
             
             <div className="my-3 border-t border-b border-gray-50 py-2">
                <p className="text-sm text-gray-600">{order.items}</p>
             </div>

             <div className="flex justify-between items-center">
                <p className="font-bold text-gray-900">৳ {order.total}</p>
                <button className="text-pink-600 text-sm font-bold flex items-center gap-1 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors">
                   <RefreshCw className="w-4 h-4" /> Reorder
                </button>
             </div>
          </div>
        ))}
        
        <div className="text-center py-6">
           <p className="text-gray-400 text-sm">Showing last 3 orders</p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
