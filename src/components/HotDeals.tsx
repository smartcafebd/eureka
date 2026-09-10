import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface HotDealsProps {
  products: Product[];
  wishlistIds: string[];
  onViewDetails?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: number, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  onExpressOrder?: (product: Product, size: number, color: string) => void;
}

export const HotDeals: React.FC<HotDealsProps> = ({
  products,
  wishlistIds,
  onViewDetails,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onExpressOrder,
}) => {
  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hotDealProducts = products.filter(p => p.isHotDeal);

  return (
    <section id="hot-deals" className="py-10 sm:py-14 bg-[#fff7f7] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-2 border-[#b71218] mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#b71218] font-bold text-xs uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 text-[#ff6900] animate-bounce" />
              <span>Super Flash Discount</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#282828] tracking-tight flex items-center gap-2">
              <span>HOT DEALS OF THE WEEK</span>
              <Sparkles className="w-5 h-5 text-[#fcb900] hidden sm:inline" />
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Special prices on premium genuine leather footwear. Limited stock remaining!
            </p>
          </div>

          {/* Countdown Clock (Flatsome Style Timer Block) */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-[#e0e0e0] shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#b71218] mr-2">
              <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="hidden sm:inline">OFFER ENDS:</span>
            </div>
            <div className="flex items-center gap-1 text-center">
              <div className="bg-[#282828] text-white px-2 py-1 rounded text-xs font-heading font-bold min-w-[32px]">
                {String(timeLeft.days).padStart(2, '0')}
                <span className="block text-[8px] font-normal text-gray-300">DAYS</span>
              </div>
              <span className="font-bold text-[#282828]">:</span>
              <div className="bg-[#282828] text-white px-2 py-1 rounded text-xs font-heading font-bold min-w-[32px]">
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="block text-[8px] font-normal text-gray-300">HRS</span>
              </div>
              <span className="font-bold text-[#282828]">:</span>
              <div className="bg-[#282828] text-white px-2 py-1 rounded text-xs font-heading font-bold min-w-[32px]">
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="block text-[8px] font-normal text-gray-300">MIN</span>
              </div>
              <span className="font-bold text-[#282828]">:</span>
              <div className="bg-[#b71218] text-white px-2 py-1 rounded text-xs font-heading font-bold min-w-[32px] animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
                <span className="block text-[8px] font-normal text-white/80">SEC</span>
              </div>
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {hotDealProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onViewDetails={onViewDetails}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onExpressOrder={onExpressOrder}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
