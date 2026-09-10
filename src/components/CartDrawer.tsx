import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Zap,
  Truck,
} from 'lucide-react';
import { CartItem } from '../types';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';

interface CartDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, size: number, quantity: number) => void;
  onRemoveItem: (productId: string, size: number) => void;
  onClearCart: () => void;
  onOpenExpressCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenExpressCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validCartItems = cartItems.filter((item) => item && item.product);
  const subtotal = validCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'EUREKA10' || code === 'RICHKID10') {
      setDiscountPercent(10);
      setCouponMessage({ type: 'success', text: '১০% স্পেশাল ডিসকাউন্ট যুক্ত হয়েছে!' });
    } else {
      setCouponMessage({ type: 'error', text: 'অকার্যকর কুপন কোড! ট্রাই করুন: EUREKA10' });
    }
  };

  const handleTriggerCheckout = () => {
    onClose();
    onOpenExpressCheckout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#282828] text-white flex items-center justify-between border-b border-[#383838]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e30613] text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-white uppercase tracking-tight">
                Shopping Bag ({cartItems.length})
              </h3>
              <p className="text-[11px] text-gray-300">সারা বাংলাদেশ ক্যাশ অন ডেলিভারি 🚚</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-base text-gray-800">Your Bag is Empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our handcrafted genuine leather loafers, boots, and casual shoes.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#e30613] text-white rounded-lg text-xs font-bold hover:bg-[#c20510] cursor-pointer shadow-md"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Delivery Info Banner */}
              <div className="p-3 bg-[#fff7f7] border border-[#f78da7]/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#e30613]" />
                  <span className="font-bold text-gray-800">ক্যাশ অন ডেলিভারি চার্জ:</span>
                </div>
                <div className="text-[11px] font-bold text-gray-700 space-x-2">
                  <span>ঢাকা: <strong className="text-[#e30613]">৳৮০</strong></span>
                  <span>|</span>
                  <span>ঢাকার বাইরে: <strong className="text-[#e30613]">৳১৩৫</strong></span>
                </div>
              </div>

              {/* Items List */}
              {validCartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${idx}`}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 relative group transition-all hover:border-gray-300"
                >
                  <img
                    src={getSafeProductImageUrl(item.product.images?.[0], item.product.category)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, item.product.category)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#282828] line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                      {item.selectedSize > 0 && (
                        <span>Size: <strong className="text-gray-800">{item.selectedSize}</strong></span>
                      )}
                      {item.selectedColor && (
                        <span>Color: <strong className="text-gray-800">{item.selectedColor === 'ব্রাউন' || item.selectedColor?.toLowerCase() === 'brown' ? 'চকলেট' : item.selectedColor}</strong></span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold font-mono text-xs text-[#e30613]">
                        {(item.product.price * item.quantity).toLocaleString()} ৳
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                    className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Coupon Code Section */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon: EUREKA10 (১০% ছাড়)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs uppercase font-mono outline-none focus:border-[#e30613]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#282828] hover:bg-[#e30613] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponMessage && (
                  <p className={`text-[11px] mt-1 font-semibold ${
                    couponMessage.type === 'success' ? 'text-green-700' : 'text-red-500'
                  }`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Footer Subtotal & 1-Click Order Trigger */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900 font-mono">{subtotal.toLocaleString()} ৳</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupon Discount ({discountPercent}%):</span>
                  <span className="font-mono">- {discountAmount.toLocaleString()} ৳</span>
                </div>
              )}
              <div className="flex justify-between text-[11px]">
                <span>ডেলিভারি চার্জ:</span>
                <span>ঢাকা ৳৮০ / ঢাকার বাইরে ৳১৩৫</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#282828] pt-1.5 border-t border-gray-200">
                <span>Total Items:</span>
                <span className="text-[#e30613] font-mono text-base">
                  {(subtotal - discountAmount).toLocaleString()} ৳ (+ ডেলিভারি)
                </span>
              </div>
            </div>

            {/* Express 1-Click Order Trigger CTA */}
            <button
              onClick={handleTriggerCheckout}
              className="w-full py-3.5 px-4 bg-[#e30613] hover:bg-[#c20510] text-white font-heading font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300" />
              <span>অর্ডার করুন (১-ক্লিক ক্যাশ অন ডেলিভারি)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
