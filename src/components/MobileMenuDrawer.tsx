import React from 'react';
import { X, Flame, ChevronRight, Phone, Ruler, Truck } from 'lucide-react';
import { EurekaLogo } from './EurekaLogo';
import { Category } from '../types';
import { useStore } from '../context/StoreContext';

interface MobileMenuDrawerProps {
  categories?: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onOpenHappinessModal?: () => void;
  onOpenTrackModal?: () => void;
  onOpenSizeGuide?: () => void;
  onOpenAdmin?: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  categories,
  isOpen,
  onClose,
  onSelectCategory,
  onOpenSizeGuide,
}) => {
  const { businessSettings } = useStore();
  const hotline = businessSettings?.hotline || '01800-387352';
  const cleanPhone = hotline.replace(/[^0-9+]/g, '');

  if (!isOpen) return null;

  const handleNav = (cat: string) => {
    onSelectCategory(cat);
    onClose();
  };

  const menuCategories = categories && categories.length > 0
    ? categories
    : [
        { id: 'cat-sandal', name: 'Sandal', slug: 'sandal' },
        { id: 'cat-loafer', name: 'Loafer', slug: 'loafer' },
        { id: 'cat-formal', name: 'Formal Shoes', slug: 'formal-shoes' },
        { id: 'cat-casual', name: 'Casual Shoes', slug: 'casual-shoes' },
      ];

  return (
    <div className="fixed inset-0 z-50 flex justify-start lg:hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250">
        
        <div>
          {/* Header */}
          <div className="p-4 bg-[#1c1c1c] text-white flex items-center justify-between border-b border-[#282828]">
            <div className="flex items-center">
              <EurekaLogo size="md" variant="white" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Note */}
          <div className="bg-[#282828] text-gray-300 px-4 py-2 text-[11px] flex items-center gap-1.5 border-b border-[#383838]">
            <Truck className="w-3.5 h-3.5 text-[#e30613]" />
            <span>সারা বাংলাদেশ ক্যাশ অন ডেলিভারি 🚚</span>
          </div>

          {/* Hot Deals Callout */}
          <div className="p-3 bg-[#fff7f7] border-b border-[#f78da7]/30">
            <button
              onClick={() => handleNav('hot-deal')}
              className="w-full py-2.5 px-3 bg-[#e30613] text-white rounded-lg font-heading font-bold text-xs flex items-center justify-between shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
                <span>HOT DEALS &amp; OFFERS</span>
              </div>
              <span className="bg-[#b20000] text-[10px] px-1.5 py-0.5 rounded font-bold">UP TO 45%</span>
            </button>
          </div>

          {/* Main Navigation Links */}
          <div className="py-2 divide-y divide-gray-100 text-xs font-semibold text-gray-800">
            <button
              onClick={() => handleNav('all')}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
            >
              <span>Home / All Shoes</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNav(cat.name)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer font-bold text-gray-900"
              >
                <span>{cat.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          {/* Quick Actions (Size Guide only) */}
          {onOpenSizeGuide && (
            <div className="p-4 bg-gray-50 text-xs">
              <button
                onClick={() => {
                  onOpenSizeGuide();
                  onClose();
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-white border border-gray-200 text-gray-800 font-bold hover:bg-[#fff7f7] hover:border-[#e30613] transition-colors cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-[#e30613]" />
                <span>📏 Shoe Sizing Guide (সাইজ গাইড)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Contact Info */}
        <div className="p-4 bg-[#1c1c1c] text-white text-xs space-y-2 border-t border-[#282828]">
          <a 
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#e30613]" />
            <span>Hotline: {hotline}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
