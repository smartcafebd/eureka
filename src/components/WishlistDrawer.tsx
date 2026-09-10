import React from 'react';
import { X, Heart, Trash2, Zap } from 'lucide-react';
import { Product } from '../types';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';

interface WishlistDrawerProps {
  isOpen: boolean;
  wishlistProducts: Product[];
  onClose: () => void;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart?: (product: Product, size: number, color: string) => void;
  onViewDetails?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onExpressOrder?: (product: Product, size: number, color: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  wishlistProducts,
  onClose,
  onRemoveFromWishlist,
  onViewDetails,
  onExpressOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#282828] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#b71218] fill-[#b71218]" />
            <h3 className="font-heading font-bold text-base text-white">
              My Wishlist ({wishlistProducts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Heart className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="font-heading font-bold text-base text-gray-700">Your Wishlist is Empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Save your favorite genuine leather shoes, loafers, and sandals for later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-[#b71218] text-white rounded-md text-xs font-bold hover:bg-[#9c0f14]"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <img
                  src={getSafeProductImageUrl(product.images?.[0], product.category)}
                  alt={product.name}
                  onClick={() => {
                    if (onViewDetails) {
                      onViewDetails(product);
                    } else if (onExpressOrder) {
                      onExpressOrder(product, product.sizes[0], product.colors[0]?.name || '');
                    }
                    onClose();
                  }}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200 cursor-pointer"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, product.category)}
                />
                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      if (onViewDetails) {
                        onViewDetails(product);
                      } else if (onExpressOrder) {
                        onExpressOrder(product, product.sizes[0], product.colors[0]?.name || '');
                      }
                      onClose();
                    }}
                    className="text-xs font-bold text-[#282828] line-clamp-1 hover:text-[#e30613] cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">{product.category}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-xs text-[#e30613]">
                      ৳ {product.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => {
                        if (onViewDetails) {
                          onViewDetails(product);
                        } else if (onExpressOrder) {
                          onExpressOrder(product, product.sizes[0], product.colors[0]?.name || '');
                        }
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-[#e30613] hover:bg-[#c20510] text-white text-[11px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3 h-3 fill-current text-yellow-300" />
                      <span>বিস্তারিত ও অর্ডার</span>
                    </button>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveFromWishlist(product)}
                  className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
