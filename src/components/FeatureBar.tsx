import React from 'react';
import { Award, ShieldCheck, Banknote, Truck } from 'lucide-react';

interface FeatureBarProps {
  onOpenHappinessModal?: () => void;
}

export const FeatureBar: React.FC<FeatureBarProps> = () => {
  const features = [
    {
      icon: <Award className="w-6 h-6 text-[#b71218]" />,
      title: '100% Genuine Leather',
      subtitle: 'Pure cowhide & calfskin craft',
    },
    {
      icon: <Banknote className="w-6 h-6 text-[#b71218]" />,
      title: 'Cash on Delivery',
      subtitle: 'Pay after checking parcel',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#b71218]" />,
      title: 'Handcrafted Quality',
      subtitle: 'Premium finish & durable sole',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#b71218]" />,
      title: 'Express Delivery',
      subtitle: 'Inside Dhaka 24-48 hours',
    }
  ];

  return (
    <div className="bg-[#fff7f7] border-y border-[#e0e0e0] py-6 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3 rounded-lg bg-white border border-[#e0e0e0] shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[#fff7f7] group-hover:bg-[#b71218] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                {React.cloneElement(feat.icon, {
                  className: "w-6 h-6 text-[#b71218] group-hover:text-white transition-colors"
                })}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-heading font-bold text-[#282828] group-hover:text-[#b71218] transition-colors leading-snug">
                  {feat.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                  {feat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
