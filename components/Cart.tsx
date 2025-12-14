
import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard, X, Check, Landmark, Banknote, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onBack: () => void;
  onStartShopping: () => void;
  userPhone?: string;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, onBack, onStartShopping, userPhone }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('COD');
  
  // Payment Form States
  const [bkashNumber, setBkashNumber] = useState(userPhone || '');
  const [bkashPin, setBkashPin] = useState('');
  const [bankCard, setBankCard] = useState('');

  // Simulation States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 60;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    // Basic validation
    if (selectedMethod === 'BKASH' && (!bkashNumber || bkashPin.length < 4)) {
       alert("Please enter a valid bKash number and PIN");
       return;
    }
    if (selectedMethod === 'BANK' && !bankCard) {
       alert("Please enter card or account details");
       return;
    }

    // Direct checkout for COD
    if (selectedMethod === 'COD') {
        setShowPaymentModal(false);
        onCheckout();
        return;
    }

    // Simulate Processing for Digital Payments
    setIsProcessing(true);
    
    // Simulate Network Request
    setTimeout(() => {
        setIsProcessing(false);
        setIsVerified(true);

        // Auto-close and checkout after success message
        setTimeout(() => {
            setShowPaymentModal(false);
            onCheckout();
            // Reset local states
            setTimeout(() => {
                setIsVerified(false);
                setBkashPin(''); // Clear sensitive data
            }, 300);
        }, 1500);
    }, 2000);
  };

  const handleCloseModal = () => {
      if (isProcessing) return; // Prevent closing during processing
      setShowPaymentModal(false);
      setIsVerified(false);
      setIsProcessing(false);
  };

  return (
    <div className="bg-white min-h-screen pb-24 animate-fade-in relative z-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">My Cart</h1>
        <span className="ml-auto bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold">
          {items.length} Items
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
              <p className="text-gray-500 text-sm">Looks like you haven't added any medicines yet.</p>
            </div>
            <button 
              onClick={onStartShopping}
              className="px-6 py-2 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center text-2xl border border-gray-100">
                    💊
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <p className="font-bold text-pink-600">৳ {item.price * item.quantity}</p>
                      
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 active:scale-95 transition-all"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 active:scale-95 transition-all"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
              <h3 className="font-bold text-gray-800 mb-2">Bill Details</h3>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳ {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>৳ {deliveryFee}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>৳ {total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      {items.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-20">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Pay • ৳ {total}
          </button>
        </div>
      )}

      {/* Payment Selection Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
           <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
                    <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full" disabled={isProcessing}>
                       <X className="w-6 h-6 text-gray-500" />
                    </button>
                 </div>

                 <div className="space-y-3 mb-6">
                    {/* Cash On Delivery */}
                    <button 
                       onClick={() => !isProcessing && setSelectedMethod('COD')}
                       className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedMethod === 'COD' ? 'border-pink-600 bg-pink-50' : 'border-gray-100 hover:border-gray-200'
                       } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                       disabled={isProcessing}
                    >
                       <div className="flex items-center gap-3">
                          <Banknote className="w-6 h-6 text-green-600" />
                          <div className="text-left">
                             <p className="font-bold text-gray-800">Cash on Delivery</p>
                             <p className="text-xs text-gray-500">Pay when you receive</p>
                          </div>
                       </div>
                       {selectedMethod === 'COD' && <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    </button>

                    {/* bKash */}
                    <button 
                       onClick={() => !isProcessing && setSelectedMethod('BKASH')}
                       className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedMethod === 'BKASH' ? 'border-pink-600 bg-pink-50' : 'border-gray-100 hover:border-gray-200'
                       } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                       disabled={isProcessing}
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-xs italic">b</div>
                          <div className="text-left">
                             <p className="font-bold text-gray-800">bKash</p>
                             <p className="text-xs text-gray-500">Mobile Banking</p>
                          </div>
                       </div>
                       {selectedMethod === 'BKASH' && <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    </button>

                    {selectedMethod === 'BKASH' && (
                       <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-200 animate-fade-in relative">
                          <p className="text-xs text-gray-500">You are paying <span className="font-bold">৳ {total}</span></p>
                          <input 
                             type="tel" 
                             placeholder="bKash Mobile Number" 
                             value={bkashNumber}
                             onChange={(e) => setBkashNumber(e.target.value)}
                             disabled={isProcessing || isVerified}
                             className="w-full p-3 border rounded-lg text-sm outline-none focus:border-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                          <input 
                             type="password" 
                             placeholder="Enter PIN (Simulated)" 
                             value={bkashPin}
                             onChange={(e) => setBkashPin(e.target.value)}
                             disabled={isProcessing || isVerified}
                             className="w-full p-3 border rounded-lg text-sm outline-none focus:border-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                          {isVerified && (
                             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg animate-bounce-in">
                                   <ShieldCheck className="w-5 h-5" /> Verified Securely
                                </div>
                             </div>
                          )}
                       </div>
                    )}

                    {/* Bank Transfer */}
                    <button 
                       onClick={() => !isProcessing && setSelectedMethod('BANK')}
                       className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedMethod === 'BANK' ? 'border-pink-600 bg-pink-50' : 'border-gray-100 hover:border-gray-200'
                       } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                       disabled={isProcessing}
                    >
                       <div className="flex items-center gap-3">
                          <Landmark className="w-6 h-6 text-blue-600" />
                          <div className="text-left">
                             <p className="font-bold text-gray-800">Bank Transfer / Card</p>
                             <p className="text-xs text-gray-500">Visa, Mastercard, DBBL</p>
                          </div>
                       </div>
                       {selectedMethod === 'BANK' && <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    </button>

                    {selectedMethod === 'BANK' && (
                       <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-200 animate-fade-in relative">
                          <input 
                             type="text" 
                             placeholder="Card Number / Account No" 
                             value={bankCard}
                             onChange={(e) => setBankCard(e.target.value)}
                             disabled={isProcessing || isVerified}
                             className="w-full p-3 border rounded-lg text-sm outline-none focus:border-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                          {isVerified && (
                             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg animate-bounce-in">
                                   <ShieldCheck className="w-5 h-5" /> Verified Securely
                                </div>
                             </div>
                          )}
                       </div>
                    )}
                 </div>

                 <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || isVerified}
                    className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isVerified 
                        ? 'bg-green-500 shadow-green-200' 
                        : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200 active:scale-95'
                    } ${isProcessing ? 'opacity-80 cursor-wait' : ''}`}
                 >
                    {isProcessing ? (
                        <>
                           <Loader2 className="animate-spin w-5 h-5" />
                           {selectedMethod === 'BKASH' ? 'Verifying bKash...' : 'Processing Payment...'}
                        </>
                    ) : isVerified ? (
                        <>
                           <CheckCircle className="w-5 h-5" /> Payment Successful
                        </>
                    ) : (
                        <>Confirm Order - ৳ {total}</>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
