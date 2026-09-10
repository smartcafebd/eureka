import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HERO_SLIDES } from '../data/categories';

interface HeroSliderProps {
  onExploreClick: (category: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onExploreClick }) => {
  const { heroSlides: storeSlides, heroDesign } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter active slides
  const activeSlides = (storeSlides && storeSlides.length > 0 ? storeSlides : HERO_SLIDES)
    .filter((s) => s.enabled !== false);

  const slidesToRender = activeSlides.length > 0 ? activeSlides : HERO_SLIDES;

  const autoIntervalSec = heroDesign?.autoSlideInterval ?? 6;

  useEffect(() => {
    if (isPaused || autoIntervalSec <= 0 || slidesToRender.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToRender.length);
    }, autoIntervalSec * 1000);
    return () => clearInterval(interval);
  }, [isPaused, autoIntervalSec, slidesToRender.length]);

  // Prevent out-of-bounds slide index
  useEffect(() => {
    if (currentSlide >= slidesToRender.length) {
      setCurrentSlide(0);
    }
  }, [slidesToRender.length, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToRender.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToRender.length) % slidesToRender.length);
  };

  const slide = slidesToRender[currentSlide] || slidesToRender[0];
  if (!slide) return null;

  // Height configurations
  const heightClasses = {
    compact: 'min-h-[340px] sm:min-h-[400px] lg:min-h-[450px]',
    standard: 'min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]',
    large: 'min-h-[440px] sm:min-h-[540px] lg:min-h-[620px]',
  };
  const currentHeightClass = heightClasses[heroDesign?.bannerHeight || 'standard'];

  const overlayOpacity = (heroDesign?.overlayOpacity ?? 75) / 100;
  const layoutStyle = heroDesign?.layoutStyle || 'split';
  const showBadges = heroDesign?.showBadges ?? true;
  const showPreviewCard = heroDesign?.showPreviewCard ?? true;

  return (
    <div 
      className={`relative w-full overflow-hidden bg-[#1a1212] text-white select-none group flex items-center ${currentHeightClass}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Dark Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform scale-105 group-hover:scale-100 opacity-45 mix-blend-luminosity"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient || 'from-stone-950 via-stone-900 to-stone-950'}`}
        style={{ opacity: overlayOpacity }}
      />

      {/* Slide Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full z-10">
        {layoutStyle === 'centered' ? (
          /* Centered Layout */
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            {showBadges && slide.tag && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#b71218]/90 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{slide.tag}</span>
              </div>
            )}

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              {slide.subtitle}
            </p>

            {showBadges && (slide.highlightText || slide.discountBadge) && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                {slide.highlightText && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-md text-xs font-semibold text-[#00d084] border border-white/10">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{slide.highlightText}</span>
                  </div>
                )}
                {slide.discountBadge && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#b20000] rounded-md text-xs font-extrabold text-white animate-pulse">
                    <Flame className="w-4 h-4 text-yellow-300" />
                    <span>{slide.discountBadge}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                onClick={() => onExploreClick(slide.link?.replace('#', '') || 'all')}
                className="bg-[#b71218] hover:bg-[#9c0f14] text-white px-7 py-3 rounded-md font-heading font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-[#b71218]/40 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.buttonText || 'EXPLORE NOW'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onExploreClick('hot-deal')}
                className="bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white px-6 py-3 rounded-md font-heading font-semibold text-sm tracking-wide transition-all cursor-pointer"
              >
                VIEW HOT DEALS
              </button>
            </div>
          </div>
        ) : layoutStyle === 'minimal' ? (
          /* Minimal Compact Layout */
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <h1 className="font-heading font-bold text-xl sm:text-3xl text-white tracking-tight">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 line-clamp-2">
              {slide.subtitle}
            </p>
            <button
              onClick={() => onExploreClick(slide.link?.replace('#', '') || 'all')}
              className="bg-[#b71218] hover:bg-[#9c0f14] text-white px-5 py-2 rounded font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>{slide.buttonText || 'Shop Collection'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Split / Fullwidth Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text & CTAs */}
            <div className={`${showPreviewCard && layoutStyle === 'split' ? 'lg:col-span-7' : 'lg:col-span-9'} space-y-4 sm:space-y-6`}>
              {/* Tag Badge */}
              {showBadges && slide.tag && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#b71218]/90 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{slide.tag}</span>
                </div>
              )}

              {/* Title */}
              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight sm:leading-none">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Guarantee Highlight */}
              {showBadges && (slide.highlightText || slide.discountBadge) && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {slide.highlightText && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-md text-xs font-semibold text-[#00d084] border border-white/10">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{slide.highlightText}</span>
                    </div>
                  )}
                  {slide.discountBadge && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#b20000] rounded-md text-xs font-extrabold text-white animate-pulse">
                      <Flame className="w-4 h-4 text-yellow-300" />
                      <span>{slide.discountBadge}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => onExploreClick(slide.link?.replace('#', '') || 'all')}
                  className="bg-[#b71218] hover:bg-[#9c0f14] text-white px-7 py-3 rounded-md font-heading font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-[#b71218]/40 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>{slide.buttonText || 'SHOP COLLECTION'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onExploreClick('hot-deal')}
                  className="bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white px-6 py-3 rounded-md font-heading font-semibold text-sm tracking-wide transition-all cursor-pointer"
                >
                  VIEW HOT DEALS
                </button>
              </div>
            </div>

            {/* Right Column: Hero Product Image Card Preview */}
            {showPreviewCard && layoutStyle === 'split' && (
              <div className="lg:col-span-5 hidden lg:flex justify-center">
                <div className="relative w-full max-w-md p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl transform transition-transform group-hover:scale-102">
                  <div className="aspect-4/3 rounded-xl overflow-hidden relative shadow-inner bg-black/30">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-[#b71218] text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-md">
                      100% Genuine Leather
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-300 font-medium px-1">
                    <span>Handcrafted in Bangladesh</span>
                    <span className="text-[#00d084] font-bold">In Stock &amp; Ready to Ship</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {slidesToRender.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-[#b71218] text-white flex items-center justify-center backdrop-blur-xs transition-all z-20 cursor-pointer opacity-70 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-[#b71218] text-white flex items-center justify-center backdrop-blur-xs transition-all z-20 cursor-pointer opacity-70 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slidesToRender.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 h-2 bg-[#b71218]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

