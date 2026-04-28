import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../api/config';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { token } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setOrderStatus('idle');
    
    try {
      const productIds = items.map(item => item._id);
      await axios.post(`${API_CONFIG.PRODUCT_SERVICE}/products/buy`, 
        { ids: productIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrderStatus('success');
      clearCart();
    } catch (err: any) {
      setOrderStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Order Placed Successfully!</h1>
          <p className="text-slate-500 text-lg mb-8">Thank you for your purchase. Your order is being processed.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
          <ShoppingCart className="w-24 h-24 text-slate-200 dark:text-slate-800 mb-8" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Your cart is empty</h1>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            Go to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                <p className="text-primary-600 font-bold">${item.price}</p>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => removeFromCart(item._id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xl font-bold text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {orderStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}
            
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {isCheckingOut ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  Checkout Now
                </>
              )}
            </button>
            
            <p className="mt-4 text-center text-xs text-slate-400">
              Secure Checkout Powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
