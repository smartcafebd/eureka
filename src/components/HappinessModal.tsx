import React from 'react';
import { X, ShieldCheck, Award, HeartHandshake, PhoneCall, CheckCircle } from 'lucide-react';

interface HappinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HappinessModal: React.FC<HappinessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 z-10 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#b71218] text-white flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#282828]">
                eureka Customer Care &amp; Service
              </h3>
              <p className="text-xs text-gray-500">
                কাস্টমার সন্তুষ্টি ও সেবা নির্দেশিকা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 text-xs text-gray-700 leading-relaxed">
          
          {/* Section 1: Product Checking on Delivery */}
          <div className="p-4 bg-[#fff7f7] rounded-xl border border-[#f78da7]/40 space-y-2">
            <div className="flex items-center gap-2 text-sm font-heading font-bold text-[#b71218]">
              <HeartHandshake className="w-4 h-4" />
              <h4>১. ডেলিভারির সময় পণ্য চেক করার সুবিধা</h4>
            </div>
            <p>
              ডেলিভারি ম্যানের উপস্থিতিতে জুতাটি চেক করে কোয়ালিটি দেখে বুঝে নেওয়ার সম্পূর্ণ সুযোগ রয়েছে। শতভাগ নিশ্চিন্ত হয়ে পণ্য গ্রহণ করতে পারবেন।
            </p>
          </div>

          {/* Section 2: 100% Genuine Leather */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-heading font-bold text-[#282828]">
              <ShieldCheck className="w-4 h-4 text-[#00d084]" />
              <h4>২. ১০০% জেনুইন লেদার কোয়ালিটি</h4>
            </div>
            <p>
              আমাদের সকল জুতা প্রিমিয়াম মানের অরিজিনাল কাওহাইড ও বাফেলো লেদার দিয়ে নিপুণ কারিগর দ্বারা তৈরি করা হয়।
            </p>
          </div>

          {/* Section 3: Customer Care */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-heading font-bold text-[#282828]">
              <CheckCircle className="w-4 h-4 text-[#b71218]" />
              <h4>৩. কাস্টমার কেয়ার ও সহায়তা</h4>
            </div>
            <p>
              অর্ডার সংক্রান্ত যেকোনো প্রশ্ন বা সহযোগিতার জন্য আমাদের হেল্পলাইন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন। আমাদের সাপোর্ট টিম দ্রুত সমাধানে প্রস্তুত।
            </p>
          </div>

          {/* Support Helpline Callout */}
          <div className="p-4 bg-[#282828] text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-[#fcb900]" />
              <div>
                <p className="font-bold text-xs">Need Immediate Help With An Order?</p>
                <p className="text-[11px] text-gray-300">Call our Dedicated Helpline or WhatsApp us 24/7</p>
              </div>
            </div>
            <a
              href="tel:+8801711234567"
              className="px-3.5 py-1.5 bg-[#b71218] text-white font-bold text-xs rounded hover:bg-[#9c0f14]"
            >
              +880 1711-234567
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
