import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <section className="bg-[#282828] text-white py-12 border-t border-[#383838]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text */}
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#b71218] text-white text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>VIP Privilege Club</span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              GET 10% OFF YOUR FIRST ORDER
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Subscribe to the eureka insider list for early access to Hot Deals, private seasonal drops, and leather care guides.
            </p>
          </div>

          {/* Form */}
          <div className="w-full lg:w-auto">
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#00d084]/20 border border-[#00d084] text-[#00d084] rounded-lg text-sm font-bold">
                <Check className="w-5 h-5" />
                <span>Thank you! Coupon code <strong>EUREKA10</strong> sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-gray-400 outline-none focus:border-[#b71218] focus:bg-black/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#b71218] hover:bg-[#9c0f14] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
