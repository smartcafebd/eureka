import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEFAULT_PROMO_BANNERS } from '../data/categories';

interface BannerPromoProps {
  onShopClick: (category: string) => void;
  onOpenHappinessModal: () => void;
}

export const BannerPromo: React.FC<BannerPromoProps> = ({
  onShopClick,
  onOpenHappinessModal,
}) => {
  const { promoBanners: storeBanners } = useStore();

  const banners = (storeBanners && storeBanners.length > 0 ? storeBanners : DEFAULT_PROMO_BANNERS)
    .filter((b) => b.enabled !== false);

  if (banners.length === 0) return null;

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${banners.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
          {banners.map((banner, index) => {
            const isSecond = index % 2 === 1;
            const bgDark = isSecond ? 'bg-[#182026] border-[#2d3748]' : 'bg-[#241717] border-[#383838]';
            const grad = isSecond 
              ? 'from-[#0d161d] via-[#16232d]/90 to-transparent' 
              : 'from-[#1c0f0f] via-[#2d1414]/90 to-transparent';

            const handleButtonClick = () => {
              if (banner.actionType === 'happiness') {
                onOpenHappinessModal();
              } else {
                onShopClick(banner.linkCategory || 'all');
              }
            };

            return (
              <div
                key={banner.id}
                className={`group relative rounded-2xl overflow-hidden ${bgDark} text-white p-8 sm:p-10 flex flex-col justify-between min-h-[300px] border shadow-lg`}
              >
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url('${banner.bgImage}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${grad}`} />

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                    isSecond ? 'bg-[#00d084] text-black' : 'bg-[#b71218] text-white'
                  }`}>
                    {isSecond ? <ShieldCheck className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                    <span>{banner.badgeText || banner.tag}</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                    {banner.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 max-w-sm">
                    {banner.subtitle}
                  </p>
                </div>

                <div className="relative z-10 pt-6">
                  <button
                    onClick={handleButtonClick}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 font-heading font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-md group-hover:translate-x-1 cursor-pointer ${
                      isSecond
                        ? 'bg-[#b71218] hover:bg-[#9c0f14] text-white'
                        : 'bg-white text-[#282828] hover:bg-[#b71218] hover:text-white'
                    }`}
                  >
                    <span>{banner.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

