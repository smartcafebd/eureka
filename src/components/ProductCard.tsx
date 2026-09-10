import React, { useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onViewDetails?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: number, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  onExpressOrder?: (product: Product, size: number, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onViewDetails,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onExpressOrder,
}) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedSize] = useState(product.sizes[0]);
  const [selectedColor] = useState(product.colors[0]?.name || '');

  const discountPercent = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Primary action: opens product description first when tapping card/image
  const handleProductClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    } else if (onQuickView) {
      onQuickView(product);
    } else if (onExpressOrder) {
      onExpressOrder(product, selectedSize, selectedColor);
    } else if (onAddToCart) {
      onAddToCart(product, selectedSize, selectedColor);
    }
  };

  // Direct Order button action: opens Express 1-click order immediately
  const handleOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpressOrder) {
      onExpressOrder(product, selectedSize, selectedColor);
    } else if (onAddToCart) {
      onAddToCart(product, selectedSize, selectedColor);
    } else if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-xl border border-[#e5e5e5] hover:border-[#e30613] hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      onClick={handleProductClick}
    >
      
      {/* Product Image Stage */}
      <div 
        className="relative aspect-square w-full bg-[#f8f8f8] overflow-hidden"
        onMouseEnter={() => product.images.length > 1 && setCurrentImageIdx(1)}
        onMouseLeave={() => setCurrentImageIdx(0)}
      >
        <img
          src={getSafeProductImageUrl(product.images?.[currentImageIdx], product.category, product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, product.category)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 sm:gap-1.5 z-10">
          {product.isHotDeal && (
            <span className="bg-[#b20000] text-white text-[9px] sm:text-xs font-heading font-extrabold px-1.5 sm:px-2 py-0.5 rounded shadow-sm uppercase tracking-wide animate-pulse">
              HOT DEAL
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#e30613] text-white text-[9px] sm:text-xs font-heading font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.badge && !product.isHotDeal && (
            <span className="bg-[#282828] text-white text-[9px] sm:text-[10px] font-heading font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-[#e30613] text-white'
              : 'bg-white/90 text-[#282828] hover:bg-[#e30613] hover:text-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Category & Ratings */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
            <span className="font-medium uppercase tracking-wider text-gray-400 truncate max-w-[80px] sm:max-w-none">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#fcb900] text-[#fcb900]" />
              <span className="font-semibold text-[#282828] text-[10px] sm:text-xs">{product.rating}</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            className="text-xs sm:text-sm font-heading font-semibold text-[#282828] group-hover:text-[#e30613] line-clamp-2 transition-colors cursor-pointer leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-heading font-bold text-sm sm:text-lg text-[#e30613]">
              ৳ {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ৳ {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Single Action Order Button: মোবাইলে দৃশ্যমান এবং কম্পিউটারে কার্সার রাখলে (On Hover) মসৃণভাবে ভেসে উঠবে */}
        <div className="mt-2 pt-2 border-t border-gray-100 transition-all duration-300 ease-out sm:overflow-hidden sm:max-h-0 sm:opacity-0 sm:mt-0 sm:pt-0 sm:border-transparent sm:pointer-events-none sm:group-hover:max-h-16 sm:group-hover:opacity-100 sm:group-hover:mt-2.5 sm:group-hover:pt-2 sm:group-hover:border-gray-100 sm:group-hover:pointer-events-auto">
          <button
            type="button"
            id={`order-btn-${product.id}`}
            onClick={handleOrderClick}
            className="w-full py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg font-bold text-xs sm:text-sm bg-[#e30613] hover:bg-[#c20510] active:scale-[0.98] text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="অর্ডার করুন"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>অর্ডার করুন</span>
          </button>
        </div>

      </div>

    </div>
  );
};
