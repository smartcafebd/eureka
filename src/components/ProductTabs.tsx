import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';

interface ProductTabsProps {
  products: Product[];
  categories?: Category[];
  selectedCategory: string;
  wishlistIds: string[];
  onSelectCategory: (category: string) => void;
  onViewDetails?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: number, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  onExpressOrder?: (product: Product, size: number, color: string) => void;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  products,
  categories,
  selectedCategory,
  wishlistIds,
  onSelectCategory,
  onViewDetails,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onExpressOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'new' | 'bestsellers' | 'men' | 'women'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Build dynamic tabs from categories or defaults
  const dynamicTabs = [
    { id: 'all', label: 'All Collection (সকল পণ্য)' },
    ...(categories && categories.length > 0
      ? categories.map((c) => ({ id: c.name, label: c.name }))
      : [
          { id: 'Sandal', label: 'Sandal (স্যান্ডেল)' },
          { id: 'Loafer', label: 'Loafer (লোফার)' },
          { id: 'Formal Shoes', label: 'Formal Shoes (ফরমাল)' },
          { id: 'Casual Shoes', label: 'Casual Shoes (ক্যাজুয়াল)' },
        ]),
    { id: 'hot-deal', label: 'Hot Deals 🔥' },
  ];

  // Filtering Logic
  let filtered = products.filter(p => {
    // If a specific category is chosen from navigation/categories/tabs
    const effectiveCat = (selectedCategory && selectedCategory !== 'all') ? selectedCategory : activeTab;

    if (effectiveCat && effectiveCat !== 'all') {
      if (effectiveCat === 'hot-deal') return p.isHotDeal;
      return p.category.toLowerCase().includes(effectiveCat.toLowerCase()) || 
             p.name.toLowerCase().includes(effectiveCat.toLowerCase()) ||
             effectiveCat.toLowerCase().includes(p.category.toLowerCase());
    }

    return true;
  });

  // Sorting
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <section id="featured-section" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#b71218] uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#fcb900]" />
              <span>Premium Craftsmanship</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#282828] tracking-tight">
              {selectedCategory && selectedCategory !== 'all' 
                ? `CATEGORY: ${selectedCategory.toUpperCase()}`
                : 'EXPLORE OUR COLLECTION'
              }
            </h2>
            <div className="w-14 h-1 bg-[#b71218] mt-2 rounded-full" />
          </div>

          {/* Sort Filter Dropdown */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {selectedCategory && selectedCategory !== 'all' && (
              <button
                onClick={() => onSelectCategory('all')}
                className="text-xs text-[#b71218] font-bold hover:underline"
              >
                Clear Filter (View All)
              </button>
            )}
            
            <div className="flex items-center gap-2 bg-gray-50 border border-[#e0e0e0] px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer font-bold text-[#282828]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Buttons (Flatsome Style Pill/Underline Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#e0e0e0] no-scrollbar">
          {dynamicTabs.map((tab) => {
            const isTabActive = (selectedCategory && selectedCategory !== 'all') 
              ? selectedCategory.toLowerCase() === tab.id.toLowerCase()
              : activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  onSelectCategory(tab.id);
                }}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isTabActive
                    ? 'bg-[#b71218] text-white shadow-md shadow-[#b71218]/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((product) => (
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
        ) : (
          <div className="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <SlidersHorizontal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">No products found in this filter</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try switching tabs or clear your category filter to explore all available shoes.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                onSelectCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-[#b71218] text-white rounded-md text-xs font-bold hover:bg-[#9c0f14]"
            >
              Show All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
