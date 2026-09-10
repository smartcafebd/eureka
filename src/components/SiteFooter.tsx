import React from 'react';
import { MapPin, Phone, Mail, Clock, Heart, Shield, ArrowRight, Ruler, Lock, ShieldCheck } from 'lucide-react';
import { EurekaLogo } from './EurekaLogo';

interface SiteFooterProps {
  onOpenHappinessModal: () => void;
  onOpenTrackModal: () => void;
  onSelectCategory: (category: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenSizeGuide?: () => void;
  onOpenAdmin?: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onOpenHappinessModal,
  onOpenTrackModal,
  onSelectCategory,
  onScrollToSection,
  onOpenSizeGuide,
  onOpenAdmin,
}) => {
  const handleNavCategory = (cat: string) => {
    onSelectCategory(cat);
    onScrollToSection('featured-section');
  };

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 text-xs border-t border-[#282828] select-none">
      
      {/* Main Footer Widget Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Outlets */}
          <div className="space-y-4">
            <a href="/" className="inline-block py-1">
              <EurekaLogo size="lg" variant="red" />
            </a>

            <p className="text-gray-400 leading-relaxed text-xs">
              Bangladesh's premier handcrafted genuine leather footwear brand. Delivering artisan luxury comfort across Bangladesh with 100% Cash on Delivery.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-[#e30613] shrink-0 mt-0.5" />
                <span><strong>Uttara:</strong> Sector 3 (Near Mascot Plaza), Dhaka-1230</span>
              </div>
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-[#e30613] shrink-0 mt-0.5" />
                <span><strong>Lalmatia:</strong> Block D, Mohammadpur, Dhaka-1207</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-[#e30613] shrink-0" />
                <span><strong>Hotline:</strong> +880 1711-234567, +880 1811-234567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-[#e30613] shrink-0" />
                <span>contact@eureka.com.bd</span>
              </div>
            </div>
          </div>

          {/* Column 2: Customer Care & Sizing */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider border-b border-[#282828] pb-2.5">
              Customer Care &amp; Sizing
            </h4>
            <ul className="space-y-2">
              {onOpenSizeGuide && (
                <li>
                  <button
                    onClick={onOpenSizeGuide}
                    className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left font-bold text-white"
                  >
                    <Ruler className="w-3.5 h-3.5 text-[#e30613]" />
                    <span>Shoe Sizing Guide &amp; Consultant (সাইজ গাইড)</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenHappinessModal}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ArrowRight className="w-3 h-3 text-[#e30613]" />
                  <span className="font-semibold text-gray-200">কাস্টমার কেয়ার ও সার্ভিস (Customer Support)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackModal}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ArrowRight className="w-3 h-3 text-[#e30613]" />
                  <span>Track Your Order (ক্যাশ অন ডেলিভারি)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider border-b border-[#282828] pb-2.5">
              Top Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavCategory('Sandal')}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left font-medium text-gray-300"
                >
                  <ArrowRight className="w-3 h-3 text-[#e30613]" />
                  <span>Sandal (স্যান্ডেল কালেকশন)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavCategory('Loafer')}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left font-medium text-gray-300"
                >
                  <ArrowRight className="w-3 h-3 text-[#e30613]" />
                  <span>Loafer (পেনি ও ট্যাসেল লোফার)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavCategory('Formal Shoes')}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left font-medium text-gray-300"
                >
                  <ArrowRight className="w-3 h-3 text-[#e30613]" />
                  <span>Formal Shoes (এক্সিকিউটিভ ফরমাল)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavCategory('Casual Shoes')}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left font-medium text-gray-300"
                >
                  <ArrowRight className="w-3 h-3 text-[#e30613]" />
                  <span>Casual Shoes (ক্লার্ক সাইকেল ও স্নিকার)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="bg-[#050505] border-t border-[#1f1f1f] py-4 text-center text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Copyright &copy; 2026 <strong className="text-white">eureka – Handcrafted Genuine Leather Shoes</strong>. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3 text-xs">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all cursor-pointer text-[11px] font-semibold"
                title="Launch ERP System"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>ERP</span>
              </button>
            )}
            <span className="text-[#00d084] font-medium hidden sm:inline">100% Cash on Delivery &amp; SSL Verified</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
