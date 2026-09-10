import React, { useEffect } from 'react';
import { CheckCircle2, Heart, ShoppingBag, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist' | 'info';
  title: string;
  message: string;
  image?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  toasts,
  onDismiss,
  onOpenCart,
  onOpenWishlist,
}) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#282828] text-white p-3.5 rounded-xl shadow-2xl border border-[#383838] flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300"
        >
          {toast.image ? (
            <img
              src={toast.image}
              alt=""
              className="w-12 h-12 object-cover rounded-md border border-gray-600 shrink-0"
            />
          ) : toast.type === 'cart' ? (
            <div className="w-10 h-10 rounded-full bg-[#b71218] text-white flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
          ) : toast.type === 'wishlist' ? (
            <div className="w-10 h-10 rounded-full bg-pink-700 text-white flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#00d084] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white font-heading">{toast.title}</h4>
            <p className="text-[11px] text-gray-300 truncate">{toast.message}</p>
            {toast.type === 'cart' && onOpenCart && (
              <button
                onClick={onOpenCart}
                className="mt-1 text-[10px] font-bold text-[#f78da7] hover:text-white underline cursor-pointer"
              >
                View Cart &amp; Checkout →
              </button>
            )}
            {toast.type === 'wishlist' && onOpenWishlist && (
              <button
                onClick={onOpenWishlist}
                className="mt-1 text-[10px] font-bold text-[#f78da7] hover:text-white underline cursor-pointer"
              >
                View Wishlist →
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
