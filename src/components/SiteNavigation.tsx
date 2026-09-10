import React, { useState } from 'react';
import { Flame, ChevronDown, Sparkles, MapPin, Tag, Ruler } from 'lucide-react';
import { Category } from '../types';

export interface SiteNavigationProps {
  categories?: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenSizeGuide?: () => void;
}

export const SiteNavigation: React.FC<SiteNavigationProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onScrollToSection,
  onOpenSizeGuide,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    onScrollToSection('featured-section');
    setOpenDropdown(null);
  };

  const navCategories = categories && categories.length > 0
    ? categories
    : [
        { id: 'cat-sandal', name: 'Sandal', slug: 'sandal' },
        { id: 'cat-loafer', name: 'Loafer', slug: 'loafer' },
        { id: 'cat-formal', name: 'Formal Shoes', slug: 'formal-shoes' },
        { id: 'cat-casual', name: 'Casual Shoes', slug: 'casual-shoes' },
      ];

  return (
    <nav className="bg-[#1c1c1c] text-white border-b border-[#282828] hidden lg:block select-none shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Main Navigation Links */}
          <ul className="flex items-center space-x-1 text-sm font-semibold tracking-wide">
            
            {/* HOT DEAL link with Flame Icon */}
            <li className="relative group">
              <button
                onClick={() => {
                  onSelectCategory('hot-deal');
                  onScrollToSection('hot-deals');
                }}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-[#ff6900] hover:text-white hover:bg-[#b71218] transition-all cursor-pointer font-bold ${
                  activeCategory === 'hot-deal' ? 'bg-[#b71218] text-white' : ''
                }`}
              >
                <Flame className="w-4 h-4 text-[#fcb900] animate-bounce" />
                <span>HOT DEAL</span>
                <span className="bg-[#b20000] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
                  Sale
                </span>
              </button>
            </li>

            {/* ALL PRODUCTS */}
            <li>
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-4 py-3.5 hover:bg-[#b71218] transition-colors cursor-pointer ${
                  activeCategory === 'all' ? 'bg-[#b71218] text-white' : 'text-gray-200'
                }`}
              >
                HOME / ALL
              </button>
            </li>

            {/* Dynamic Categories */}
            {navCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`px-4 py-3.5 hover:bg-[#b71218] transition-colors cursor-pointer font-bold uppercase ${
                    activeCategory.toLowerCase() === cat.name.toLowerCase() ? 'bg-[#b71218] text-white' : 'text-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}

          </ul>

          {/* Right Navigation Highlight */}
          <div className="flex items-center space-x-3 text-xs font-semibold">
            {onOpenSizeGuide && (
              <button 
                onClick={onOpenSizeGuide}
                className="flex items-center gap-1.5 text-gray-200 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Shoe Sizing Guide & Footwear Consultant"
              >
                <Ruler className="w-3.5 h-3.5 text-[#e30613]" />
                <span>সাইজ গাইড</span>
              </button>
            )}
            <button
              onClick={() => {
                onSelectCategory('all');
                onScrollToSection('categories');
              }}
              className="bg-[#e30613] hover:bg-[#c20510] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>NEW COLLECTION</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
