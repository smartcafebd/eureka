import React, { useState } from 'react';
import {
  X,
  Ruler,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  Footprints,
  Compass,
  ArrowRight,
  Calculator,
} from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: number) => void;
}

interface SizeRow {
  eu: number;
  bd: number;
  uk: number;
  us: number;
  cm: number;
  inches: number;
}

const SIZE_CHART: SizeRow[] = [
  { eu: 39, bd: 39, uk: 5.5, us: 6.5, cm: 24.5, inches: 9.6 },
  { eu: 40, bd: 40, uk: 6.5, us: 7.5, cm: 25.0, inches: 9.8 },
  { eu: 41, bd: 41, uk: 7.5, us: 8.5, cm: 25.5, inches: 10.0 },
  { eu: 42, bd: 42, uk: 8.5, us: 9.5, cm: 26.0, inches: 10.2 },
  { eu: 43, bd: 43, uk: 9.5, us: 10.5, cm: 26.5, inches: 10.4 },
  { eu: 44, bd: 44, uk: 10.5, us: 11.5, cm: 27.0, inches: 10.6 },
  { eu: 45, bd: 45, uk: 11.5, us: 12.5, cm: 27.5, inches: 10.8 },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'consultant' | 'breakin'>('chart');
  
  // Interactive Consultant State
  const [measurementUnit, setMeasurementUnit] = useState<'cm' | 'inches'>('cm');
  const [footLength, setFootLength] = useState<string>('26.0');
  const [footWidth, setFootWidth] = useState<'standard' | 'wide' | 'narrow'>('standard');
  const [shoeType, setShoeType] = useState<'loafers' | 'boots' | 'oxford' | 'sandals'>('loafers');

  if (!isOpen) return null;

  // Calculate recommended size from input
  const calculateRecommendation = () => {
    const val = parseFloat(footLength);
    if (isNaN(val) || val <= 0) return null;

    const lenInCm = measurementUnit === 'inches' ? val * 2.54 : val;

    let closest = SIZE_CHART[0];
    let minDiff = 999;

    for (const row of SIZE_CHART) {
      const diff = Math.abs(row.cm - lenInCm);
      if (diff < minDiff) {
        minDiff = diff;
        closest = row;
      }
    }

    // Wide feet recommendation: if wide and close to next half step, size up
    let finalEu = closest.eu;
    let note = 'True to standard sizing. Genuine leather will gently mold to your instep.';

    if (footWidth === 'wide') {
      if (shoeType === 'loafers' || shoeType === 'oxford') {
        note = 'Since you have wider feet, we recommend choosing this size for a comfortable initial fit, or sizing up if between sizes.';
      }
    } else if (footWidth === 'narrow') {
      note = 'For narrow feet, your standard EU size will provide a firm, classic glove-like grip.';
    }

    return {
      size: finalEu,
      chartRow: closest,
      note,
    };
  };

  const recommendation = calculateRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#282828] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-20 border-b border-[#383838]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e30613] text-white flex items-center justify-center font-bold">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-white uppercase tracking-tight flex items-center gap-2">
                <span>Shoe Sizing Guide &amp; Footwear Consultant</span>
                <Sparkles className="w-4 h-4 text-[#fcb900]" />
              </h3>
              <p className="text-[11px] text-gray-300">
                EU / BD Size Chart, Precise Foot Measurements &amp; Leather Break-In Advice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 sm:px-6 pt-3 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('chart')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'chart'
                ? 'border-[#e30613] text-[#e30613]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 EU/BD Size Chart
          </button>
          <button
            onClick={() => setActiveTab('consultant')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'consultant'
                ? 'border-[#e30613] text-[#e30613]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Size Finder</span>
          </button>
          <button
            onClick={() => setActiveTab('breakin')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'breakin'
                ? 'border-[#e30613] text-[#e30613]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            👞 Genuine Leather Break-In Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: SIZE CHART */}
          {activeTab === 'chart' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Sizing Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#282828] text-white">
                      <th className="py-3 px-3 font-bold">EU / BD Size</th>
                      <th className="py-3 px-3 font-bold text-center">Foot Length (CM)</th>
                      <th className="py-3 px-3 font-bold text-center">Foot Length (Inches)</th>
                      <th className="py-3 px-3 font-bold text-center">UK Size</th>
                      <th className="py-3 px-3 font-bold text-center">US Size</th>
                      <th className="py-3 px-3 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {SIZE_CHART.map((row) => (
                      <tr key={row.eu} className="hover:bg-red-50/50 transition-colors">
                        <td className="py-3 px-3 font-black text-sm text-[#e30613]">
                          EU {row.eu} (BD {row.bd})
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-center text-gray-800">
                          {row.cm.toFixed(1)} cm
                        </td>
                        <td className="py-3 px-3 font-mono text-center text-gray-600">
                          {row.inches.toFixed(1)} in
                        </td>
                        <td className="py-3 px-3 text-center text-gray-600">UK {row.uk}</td>
                        <td className="py-3 px-3 text-center text-gray-600">US {row.us}</td>
                        <td className="py-3 px-3 text-center">
                          {onSelectSize ? (
                            <button
                              onClick={() => {
                                onSelectSize(row.eu);
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-[#e30613] hover:text-white text-gray-800 text-[11px] font-bold rounded transition-colors cursor-pointer"
                            >
                              Choose {row.eu}
                            </button>
                          ) : (
                            <span className="text-[11px] text-green-700 font-semibold">Standard Fit</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Step-by-Step Measurement Guide */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#e30613]" />
                  <span>How to Accurately Measure Your Foot at Home (পায়ের মাপ নেয়ার সহজ নিয়ম)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="w-6 h-6 rounded-full bg-[#e30613] text-white flex items-center justify-center font-bold text-xs mb-2">
                      ১
                    </span>
                    <p className="font-bold text-gray-900 mb-1">Place Paper on Floor</p>
                    <p className="text-gray-600 text-[11px]">
                      একটি সাদা কাগজ মেঝের ওপর দেয়ালের সাথে সোজা করে রাখুন।
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="w-6 h-6 rounded-full bg-[#e30613] text-white flex items-center justify-center font-bold text-xs mb-2">
                      ২
                    </span>
                    <p className="font-bold text-gray-900 mb-1">Mark Heel &amp; Longest Toe</p>
                    <p className="text-gray-600 text-[11px]">
                      গোড়ালি দেয়ালের সাথে লাগিয়ে কাগজের ওপর দাঁড়ান এবং সবচেয়ে বড় আঙুলের ডগায় পেন্সিল দিয়ে দাগ দিন।
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="w-6 h-6 rounded-full bg-[#e30613] text-white flex items-center justify-center font-bold text-xs mb-2">
                      ৩
                    </span>
                    <p className="font-bold text-gray-900 mb-1">Measure with Ruler</p>
                    <p className="text-gray-600 text-[11px]">
                      স্কেল দিয়ে গোড়ালি থেকে দাগের দূরত্ব সেন্টিমিটারে (cm) মেপে ওপরের চার্ট অনুযায়ী আপনার সাইজ নিশ্চিত করুন।
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE SIZE FINDER */}
          {activeTab === 'consultant' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inputs */}
                <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Enter Your Foot Measurements
                  </h4>

                  {/* Unit Toggle & Foot Length */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700">Foot Length:</label>
                      <div className="flex bg-white rounded border border-gray-300 p-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setMeasurementUnit('cm')}
                          className={`px-2 py-0.5 rounded font-bold transition-colors ${
                            measurementUnit === 'cm' ? 'bg-[#e30613] text-white' : 'text-gray-600'
                          }`}
                        >
                          CM
                        </button>
                        <button
                          type="button"
                          onClick={() => setMeasurementUnit('inches')}
                          className={`px-2 py-0.5 rounded font-bold transition-colors ${
                            measurementUnit === 'inches' ? 'bg-[#e30613] text-white' : 'text-gray-600'
                          }`}
                        >
                          Inches
                        </button>
                      </div>
                    </div>

                    <input
                      type="number"
                      step="0.1"
                      value={footLength}
                      onChange={(e) => setFootLength(e.target.value)}
                      placeholder={measurementUnit === 'cm' ? 'e.g. 26.0' : 'e.g. 10.2'}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold font-mono outline-none focus:border-[#e30613]"
                    />
                  </div>

                  {/* Foot Width */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Foot Width Profile (পায়ের প্রস্থ):
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'narrow', label: 'Narrow (চিকন)' },
                        { id: 'standard', label: 'Standard (স্বাভাবিক)' },
                        { id: 'wide', label: 'Wide (চওড়া)' },
                      ].map((w) => (
                        <button
                          type="button"
                          key={w.id}
                          onClick={() => setFootWidth(w.id as any)}
                          className={`py-2 px-2 rounded-lg border font-bold text-center transition-all ${
                            footWidth === w.id
                              ? 'border-[#e30613] bg-[#fff7f7] text-[#e30613]'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shoe Silhouette Style */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Shoe Category:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'loafers', label: 'Leather Loafers' },
                        { id: 'boots', label: 'Chelsea / Lace Boots' },
                        { id: 'oxford', label: 'Dress Oxfords' },
                        { id: 'sandals', label: 'Comfort Sandals' },
                      ].map((st) => (
                        <button
                          type="button"
                          key={st.id}
                          onClick={() => setShoeType(st.id as any)}
                          className={`py-2 px-2.5 rounded-lg border font-bold text-left transition-all ${
                            shoeType === st.id
                              ? 'border-[#e30613] bg-[#fff7f7] text-[#e30613]'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Recommendation Card Output */}
                <div className="flex flex-col justify-between bg-[#fff7f7] p-5 rounded-xl border-2 border-[#f78da7] space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#e30613] uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4 text-[#fcb900]" />
                      <span>Recommended eureka® Size</span>
                    </div>

                    {recommendation ? (
                      <div className="space-y-3">
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl sm:text-5xl font-heading font-black text-[#282828]">
                            EU {recommendation.size}
                          </span>
                          <span className="text-sm font-bold text-gray-600">
                            (BD {recommendation.size} / UK {recommendation.chartRow.uk})
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-red-100 text-xs text-gray-700 space-y-1">
                          <p className="font-semibold text-gray-900">Expert Fit Assessment:</p>
                          <p className="text-gray-600 leading-relaxed">{recommendation.note}</p>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                          <p>• Foot Length match: <strong>{recommendation.chartRow.cm} cm</strong> ({recommendation.chartRow.inches} inches)</p>
                          <p>• Hassle-free 3-day doorstep size replacement included.</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        Please enter your foot length on the left to see the instant recommendation.
                      </p>
                    )}
                  </div>

                  {recommendation && onSelectSize && (
                    <button
                      onClick={() => {
                        onSelectSize(recommendation.size);
                        onClose();
                      }}
                      className="w-full py-2.5 px-4 bg-[#e30613] hover:bg-[#c20510] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Apply EU {recommendation.size} to Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: GENUINE LEATHER BREAK-IN */}
          {activeTab === 'breakin' && (
            <div className="space-y-4 text-xs leading-relaxed animate-in fade-in duration-200">
              
              <div className="p-4 bg-[#fff7f7] border border-[#f78da7]/50 rounded-xl space-y-2">
                <h4 className="font-bold text-[#e30613] text-sm flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00d084]" />
                  <span>The Science of Handcrafted Cowhide Break-In</span>
                </h4>
                <p className="text-gray-700">
                  Unlike synthetic shoes that stay rigid, genuine top-grain cowhide leather is a natural, breathable material that slowly stretches and molds to the exact contour of your feet within <strong>3 to 5 wearings</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                    1. Initial Snug Fit is Normal
                  </h5>
                  <p className="text-gray-600 text-[11px]">
                    When you first try on your new leather loafers or boots, they should feel pleasantly snug without painful pinching. The leather will soften and widen by approximately 2–3% with warmth and stride pressure.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                    2. Gradual Break-In Protocol
                  </h5>
                  <p className="text-gray-600 text-[11px]">
                    Wear your new shoes for 1–2 hours around the house with socks on the first day. By the third day, the insole cork and leather upper will form a custom anatomical footbed.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                    3. Shoe Tree &amp; Shape Maintenance
                  </h5>
                  <p className="text-gray-600 text-[11px]">
                    Always insert wooden shoe trees or crumple clean paper inside the toe box when resting shoes overnight. This prevents deep toe creasing and absorbs perspiration.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                    4. Check Before You Pay (ডেলিভারির সময় চেক করুন)
                  </h5>
                  <p className="text-gray-600 text-[11px]">
                    ডেলিভারি ম্যানের সামনে সাইজ ও কোয়ালিটি দেখে নিশ্চিত হয়ে সম্পূর্ণ ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ করার সুযোগ রয়েছে।
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#e30613]" />
            All measurements adhere to European &amp; Bangladesh footwear standards.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-[#e30613] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
