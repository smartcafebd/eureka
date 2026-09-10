import React from 'react';
import { MapPin, Phone, CheckCircle2, ShieldAlert, Award, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface WhyEurekaProps {
  onOpenHappinessModal: () => void;
}

export const WhyEureka: React.FC<WhyEurekaProps> = ({ onOpenHappinessModal }) => {
  const { businessSettings } = useStore();

  const hotlineDisplay = businessSettings?.hotline || businessSettings?.phone || '+880 1800-387352';
  const whatsappDisplay = businessSettings?.whatsapp || '+880 1812-345678';

  return (
    <section id="why-eureka" className="py-14 bg-[#fff7f7] border-y border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Brand Story & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#e30613] uppercase tracking-widest block mb-1">
                Authentic Handcrafted Leather
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#282828] leading-tight">
                Crafted For Those Who Value Distinction &amp; Pure Leather
              </h2>
              <div className="w-16 h-1 bg-[#e30613] mt-3 rounded-full" />
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              At <strong>eureka</strong>, we believe every step you take should exude confidence, anatomical comfort, and timeless artisan luxury. Sourcing the finest grades of cured full-grain cowhides, our skilled craftsmen handcraft footwear that merges classical European silhouettes with Bangladeshi durability.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00d084] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 font-medium">100% Full-Grain Cowhide Leather Uppers</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00d084] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 font-medium">হ্যান্ডক্রাফটেড প্রিমিয়াম স্টিচিং ও লং-লাস্টিং আরামদায়ক সোল</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00d084] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 font-medium">ডেলিভারি ম্যানের সামনে চেক করে নেয়ার সুযোগ</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00d084] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 font-medium">সারা বাংলাদেশ ক্যাশ অন ডেলিভারি (ঢাকা ৳৮০, বাইরে ৳১৩৫)</span>
              </div>
            </div>

            {/* Happiness Program Banner CTA */}
            <div className="p-4 rounded-xl bg-white border border-[#e0e0e0] shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-[#e30613] shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#282828]">
                    eureka Happiness Program™
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Your complete satisfaction and doorstep exchange are 100% guaranteed.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenHappinessModal}
                className="px-3.5 py-1.5 bg-[#e30613] hover:bg-[#c20510] text-white text-xs font-bold rounded-md whitespace-nowrap cursor-pointer transition-colors"
              >
                Learn More
              </button>
            </div>

          </div>

          {/* Right Column: Physical Showroom Outlets in Dhaka */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white p-5 rounded-xl border border-[#e0e0e0] shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#e30613]" />
                  <h3 className="font-heading font-bold text-sm text-[#282828]">
                    Uttara Experience Center
                  </h3>
                </div>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">
                  Open Today
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                Sector 3, Jashimuddin Avenue (Near Mascot Plaza), Uttara, Dhaka-1230, Bangladesh.
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-dashed border-gray-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  10:00 AM – 10:00 PM (Daily)
                </span>
                <a href={`tel:${hotlineDisplay}`} className="text-[#e30613] font-bold hover:underline">
                  {hotlineDisplay}
                </a>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e0e0e0] shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#e30613]" />
                  <h3 className="font-heading font-bold text-sm text-[#282828]">
                    Dhanmondi Flagship Showroom
                  </h3>
                </div>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">
                  Open Today
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                Plot 45, Satmasjid Road, Dhanmondi 9/A, Dhaka-1209, Bangladesh.
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-dashed border-gray-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  10:00 AM – 10:00 PM (Daily)
                </span>
                <a href={`tel:${whatsappDisplay}`} className="text-[#e30613] font-bold hover:underline">
                  {whatsappDisplay}
                </a>
              </div>
            </div>

            {/* Hotline banner */}
            <div className="bg-[#282828] text-white p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-[#fcb900]" />
                <div>
                  <span className="text-[10px] uppercase text-gray-400 font-semibold block">
                    Customer Support Hotline
                  </span>
                  <span className="text-sm font-bold tracking-wide">
                    {hotlineDisplay} / {whatsappDisplay}
                  </span>
                </div>
              </div>
              <span className="bg-[#e30613] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                24/7 ONLINE
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

// Backwards-compatibility alias
export const WhyRichkid = WhyEureka;
