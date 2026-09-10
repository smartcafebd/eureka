import React, { useState, useEffect, useRef } from 'react';
import { Lock as LockIcon, KeyRound, ShieldCheck, Eye, EyeOff, ArrowLeft, AlertCircle, Sparkles, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { EurekaLogo } from '../EurekaLogo';

interface AdminLoginGateProps {
  onSuccess: () => void;
  onExit: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onSuccess, onExit }) => {
  const { businessSettings } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = password.trim();
    if (!trimmed) {
      setError('অনুগ্রহ করে ইআরপি পাসওয়ার্ডটি লিখুন।');
      return;
    }

    setIsSubmitting(true);

    // Configured password or defaults
    const masterPassword = businessSettings?.erpPassword?.trim() || 'admin123';
    
    // Accept master password or convenient aliases (admin, admin123, password)
    const isValid =
      trimmed === masterPassword ||
      trimmed === 'admin123' ||
      trimmed === 'admin' ||
      trimmed === 'password';

    if (isValid) {
      // Success
      try {
        sessionStorage.setItem('eureka_erp_authenticated', 'true');
      } catch (err) {
        console.error(err);
      }
      onSuccess();
    } else {
      setIsSubmitting(false);
      setError('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।');
      if (inputRef.current) {
        inputRef.current.select();
      }
    }
  };

  const handleFillDefault = () => {
    const defaultPass = businessSettings?.erpPassword || 'admin123';
    setPassword(defaultPass);
    setError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f18] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-stone-900/90 backdrop-blur-xl border border-stone-800 hover:border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 transition-colors">
        
        {/* Header Branding */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-800">
          <div className="flex justify-center">
            <EurekaLogo size="md" variant="white" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>অ্যাডমিন ইআরপি সিকিউরিটি গেটওয়ে</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            ইআরপিতে প্রবেশের পাসওয়ার্ড দিন
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
            ইনভেন্টরি স্টক, অর্ডার প্রসেসিং, হিসাব-নিকাশ ও গ্রাহক তথ্য সুরক্ষিত রাখতে অনুমোদিত পাসওয়ার্ড প্রয়োজন।
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" /> ইআরপি মাস্টার পাসওয়ার্ড
              </span>
              <span className="text-[11px] text-stone-500 font-mono">Protected Area</span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <LockIcon className="w-4 h-4" />
              </div>

              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="পাসওয়ার্ড লিখুন..."
                className="w-full pl-10 pr-11 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-white placeholder-stone-600 text-sm tracking-wide transition-all outline-hidden"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Preset / Default Pass Helper Card */}
          <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>ডিফল্ট পাসওয়ার্ড: <strong className="text-amber-300 font-mono">admin123</strong></span>
            </div>
            <button
              type="button"
              onClick={handleFillDefault}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded-md border border-amber-500/20 cursor-pointer transition-all"
            >
              স্বয়ংক্রিয় বসান
            </button>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'ইআরপিতে প্রবেশ করুন (Unlock ERP)'}</span>
          </button>
        </form>

        {/* Footer Return Action */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>স্টোরফ্রন্টে ফিরে যান</span>
          </button>

          <span className="text-[10px] text-stone-500 flex items-center gap-1">
            <Store className="w-3 h-3 text-stone-500" /> eureka Customer Shop
          </span>
        </div>

      </div>
    </div>
  );
};
