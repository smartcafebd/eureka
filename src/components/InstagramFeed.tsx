import React from 'react';
import { Camera, ExternalLink, Instagram, Facebook } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { isValidImageUrl } from '../utils/imageUtils';

interface InstagramFeedProps {
  onSelectProduct?: (product: Product) => void;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({ onSelectProduct }) => {
  const { products, businessSettings } = useStore();

  const facebookUrl =
    businessSettings?.facebookPage?.replace(/eurekafootwear/gi, 'eureka') ||
    'https://facebook.com/eureka';
  const instagramUrl =
    businessSettings?.instagramPage?.replace(/eurekafootwear/gi, 'eureka') ||
    'https://instagram.com/eureka';

  // Find real Sandal, Loafer, and Casual Shoes products from the store
  const sandals = products.filter(
    (p) =>
      p.category?.toLowerCase().includes('sandal') ||
      p.category?.includes('স্যান্ডেল')
  );
  const loafers = products.filter(
    (p) =>
      p.category?.toLowerCase().includes('loafer') ||
      p.category?.includes('লোফার')
  );
  const casuals = products.filter(
    (p) =>
      p.category?.toLowerCase().includes('casual') ||
      p.category?.includes('ক্যাজুয়াল') ||
      p.subCategory?.toLowerCase().includes('cycle')
  );

  // Helper to pick valid image from product or fallback
  const getProductImage = (prod?: Product, fallbackUrl: string = ''): string => {
    if (prod && Array.isArray(prod.images) && prod.images.length > 0) {
      const valid = prod.images.find((img) => isValidImageUrl(img));
      if (valid) return valid;
    }
    return fallbackUrl;
  };

  // 6 specific authentic items strictly featuring Real Sandals, Real Loafers, and Real Casual Shoes
  const feedItems = [
    {
      category: 'স্যান্ডেল',
      categoryEn: 'Leather Sandal',
      tag: '#EurekaSandal',
      product: sandals[0],
      defaultTitle: 'হ্যান্ডমেড ক্রস-স্ট্র্যাপ লেদার স্যান্ডেল',
      url: getProductImage(
        sandals[0],
        'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80'
      ),
    },
    {
      category: 'লোফার',
      categoryEn: 'Penny Loafer',
      tag: '#EurekaLoafer',
      product: loafers[0],
      defaultTitle: 'ক্লাসিক পেনি লেদার লোফার',
      url: getProductImage(
        loafers[0],
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80'
      ),
    },
    {
      category: 'ক্যাজুয়াল',
      categoryEn: 'Cycle Casual Shoes',
      tag: '#EurekaCasual',
      product: casuals[0],
      defaultTitle: 'ক্লার্কস ডার্ক চকলেট সাইকেল সুজ',
      url: getProductImage(
        casuals[0],
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'
      ),
    },
    {
      category: 'স্যান্ডেল',
      categoryEn: 'Slide Sandal',
      tag: '#LeatherSandal',
      product: sandals[1] || sandals[0],
      defaultTitle: 'ডাবল-স্ট্র্যাপ কুশন স্লাইড স্যান্ডেল',
      url: getProductImage(
        sandals[1],
        'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80'
      ),
    },
    {
      category: 'লোফার',
      categoryEn: 'Tassel Loafer',
      tag: '#ClassicLoafer',
      product: loafers[1] || loafers[0],
      defaultTitle: 'আল্ট্রা কমফোর্ট টাসেল লোফার',
      url: getProductImage(
        loafers[1],
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'
      ),
    },
    {
      category: 'ক্যাজুয়াল',
      categoryEn: 'Casual Leather Shoes',
      tag: '#CasualShoes',
      product: casuals[1] || casuals[0],
      defaultTitle: 'আরবান প্রিমিয়াম ক্যাজুয়াল সুজ',
      url: getProductImage(
        casuals[1],
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80'
      ),
    },
  ];

  return (
    <section className="py-10 bg-white border-t border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#b71218] text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base md:text-lg text-[#282828] uppercase tracking-wide">
                FOLLOW @EUREKA ON INSTAGRAM &amp; FACEBOOK
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                আসল লেদার স্যান্ডেল, লোফার ও ক্যাজুয়াল সুজ কালেকশন | Tag #EurekaBD to be featured
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold text-[#b71218] bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@Eureka</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold text-[#1877f2] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Gallery Grid of Real Sandals, Loafers, and Casual Shoes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {feedItems.map((item, idx) => {
            const displayName = item.product?.name || item.defaultTitle;
            const price = item.product?.price;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.product && onSelectProduct) {
                    onSelectProduct(item.product);
                  } else {
                    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="group relative aspect-square rounded-lg overflow-hidden bg-stone-100 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 border border-stone-200/80"
                title={`${displayName} - ক্লিক করে দেখুন`}
              >
                <img
                  src={item.url}
                  alt={`Eureka - ${displayName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Category Pill Tag */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Hover Overlay with Real Shoe Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 text-white">
                  <span className="text-[11px] font-bold text-amber-300 font-heading">
                    {item.tag}
                  </span>
                  <p className="text-xs font-medium line-clamp-1 mt-0.5 leading-tight">
                    {displayName}
                  </p>
                  {price && (
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/20">
                      <span className="text-xs font-bold text-white">
                        ৳{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-semibold text-white/90 bg-[#b71218] px-1.5 py-0.5 rounded">
                        দেখুন
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
