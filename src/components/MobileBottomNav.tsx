import React from 'react';
import { Home, Grid, Heart, ShoppingBag, PhoneCall } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenMobileMenu: () => void;
  onScrollToTop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenMobileMenu,
  onScrollToTop,
}) => {
  const { businessSettings } = useStore();
  const rawPhone = businessSettings?.hotline || '01800-387352';
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');

  return (
    <div className="block md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 px-2 pt-1.5 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-medium text-gray-600">
        
        {/* Home */}
        <button
          type="button"
          onClick={onScrollToTop}
          className="flex flex-col items-center justify-center py-1 hover:text-[#b71218] active:scale-95 transition-all cursor-pointer"
        >
          <Home className="w-5 h-5 text-gray-700" />
          <span className="mt-0.5 font-bold">Home</span>
        </button>

        {/* Categories / Menu */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 hover:text-[#b71218] active:scale-95 transition-all cursor-pointer"
        >
          <Grid className="w-5 h-5 text-gray-700" />
          <span className="mt-0.5 font-bold">Menu</span>
        </button>

        {/* Hotline */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center py-1 hover:text-[#b71218] active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#b71218] text-white flex items-center justify-center -mt-5 shadow-md border-2 border-white">
            <PhoneCall className="w-4 h-4" />
          </div>
          <span className="mt-0.5 font-bold text-[#b71218]">Call Us</span>
        </a>

        {/* Wishlist */}
        <button
          type="button"
          onClick={onOpenWishlist}
          className="flex flex-col items-center justify-center py-1 relative hover:text-[#b71218] active:scale-95 transition-all cursor-pointer"
        >
          <Heart className="w-5 h-5 text-gray-700" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-[#b71218] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="mt-0.5 font-bold">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 relative hover:text-[#b71218] active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-[#b71218] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
          <span className="mt-0.5 font-bold text-[#b71218]">Cart</span>
        </button>

      </div>
    </div>
  );
};
