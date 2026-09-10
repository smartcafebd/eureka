import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, User, Ruler, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { EurekaLogo } from './EurekaLogo';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';

interface SiteHeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  products: Product[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleMobileMenu: () => void;
  onFilterCategory: (category: string) => void;
  onOpenSizeGuide?: () => void;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  products,
  onOpenCart,
  onOpenWishlist,
  onSelectProduct,
  onToggleMobileMenu,
  onFilterCategory,
  onOpenSizeGuide,
  onGoHome,
  onOpenAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter products based on search
  const searchResults = products.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.materials.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'All Categories' || item.category === selectedCat;
    return matchesQuery && matchesCat;
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white sticky top-0 z-40 shadow-xs border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-[#282828] hover:text-[#b71218] hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Eureka Brand Logo */}
            <a
              href="/"
              onClick={(e) => {
                if (onGoHome) {
                  e.preventDefault();
                  onGoHome();
                }
              }}
              className="flex items-center group decoration-none cursor-pointer"
            >
              <EurekaLogo size="lg" />
            </a>
          </div>

          {/* Desktop Search Bar (Flatsome Style Header Search) */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="flex w-full items-center border-2 border-[#b71218] rounded-md overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#b71218]/30 transition-all">
              {/* Category Dropdown */}
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="bg-gray-50 border-r border-[#e0e0e0] text-xs font-semibold text-[#282828] px-3 py-2.5 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="All Categories">All Categories</option>
                <option value="Sandal">Sandal</option>
                <option value="Loafer">Loafer</option>
                <option value="Formal Shoes">Formal Shoes</option>
                <option value="Casual Shoes">Casual Shoes</option>
              </select>

              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search leather sandals, loafers, formal shoes, cycle shoes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full px-3 py-2 text-sm text-[#282828] placeholder-gray-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Submit Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="bg-[#b71218] hover:bg-[#9c0f14] text-white px-5 py-2.5 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#e0e0e0] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>Search results for "{searchQuery}"</span>
                  <span className="text-[#b71218]">{searchResults.length} products found</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#fff7f7] cursor-pointer transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#282828] truncate hover:text-[#b71218]">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[#777777]">{product.category}</span>
                            <span className="text-[#424141] font-semibold">|</span>
                            <span className="text-[#b71218] font-bold">{product.price.toLocaleString()} ৳</span>
                            {product.originalPrice > product.price && (
                              <span className="text-gray-400 line-through text-[11px]">{product.originalPrice.toLocaleString()} ৳</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No products found matching "{searchQuery}". Try searching for "cycle", "loafer", "boot", or "sandals".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Size Guide, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Size Guide Button */}
            {onOpenSizeGuide && (
              <button
                onClick={onOpenSizeGuide}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-[#e30613] hover:bg-[#fff7f7] rounded-lg border border-gray-200 transition-colors cursor-pointer"
                title="Shoe Sizing Guide & Footwear Consultant"
              >
                <Ruler className="w-4 h-4 text-[#e30613]" />
                <span className="hidden sm:inline">সাইজ গাইড</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-[#282828] hover:text-[#e30613] hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-[#e30613] text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 bg-gray-50 hover:bg-[#fff7f7] border border-[#e0e0e0] hover:border-[#e30613] rounded-lg transition-all group cursor-pointer"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#282828] group-hover:text-[#e30613] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-[#e30613] text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-pulse-subtle">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Cart</span>
                <span className="text-xs font-bold text-[#e30613]">
                  {cartTotal.toLocaleString()} ৳
                </span>
              </div>
            </button>

          </div>

        </div>

        {/* Mobile Search Bar (Below Header on Small Screens) */}
        <div className="md:hidden mt-3 relative">
          <div className="flex w-full items-center border border-[#b71218] rounded-md overflow-hidden bg-white shadow-xs">
            <input
              type="text"
              placeholder="Search shoes, loafers, boots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs text-[#282828] placeholder-gray-400 outline-none"
            />
            <button 
              className="bg-[#b71218] text-white px-3.5 py-2 flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-xl z-50 max-h-72 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-2.5 p-2 border-b border-gray-100 hover:bg-gray-50"
                >
                  <img
                    src={getSafeProductImageUrl(product.images?.[0], product.category)}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, product.category)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs font-bold text-[#b71218]">{product.price.toLocaleString()} ৳</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
