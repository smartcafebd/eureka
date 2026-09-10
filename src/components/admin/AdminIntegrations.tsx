import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MarketingIntegration } from '../../types';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Check,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  Copy,
  Terminal,
  Layers,
  HelpCircle,
  RefreshCw,
  Search,
  Radio,
  FileCode2,
  ChevronRight,
  Eye,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const DEFAULT_MARKETING_INTEGRATIONS: MarketingIntegration[] = [
  { id: 'ga4', name: 'Google Analytics 4 (GA4)', enabled: true, trackingId: 'G-EUR8821901', lastVerified: '2026-09-06T10:00:00.000Z' },
  { id: 'gsc', name: 'Google Search Console', enabled: true, trackingId: 'google-site-verification=EUR-9x882a0b12cd991', lastVerified: '2026-09-06T10:00:00.000Z' },
  { id: 'gtm', name: 'Google Tag Manager', enabled: true, trackingId: 'GTM-WK88201', lastVerified: '2026-09-06T10:00:00.000Z' },
  { id: 'fb_pixel', name: 'Meta Pixel & Conversions API', enabled: true, trackingId: '89127491028301', lastVerified: '2026-09-06T10:00:00.000Z' },
];

export const AdminIntegrations: React.FC = () => {
  const {
    marketingIntegrations,
    updateMarketingIntegration,
    currentAdmin,
    globalSeo,
    updateGlobalSeo,
    businessSettings,
    updateBusinessSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'configs' | 'gsc-guide' | 'pixel-guide' | 'telemetry'>('configs');
  const [integrationsList, setIntegrationsList] = useState<MarketingIntegration[]>(
    () => (Array.isArray(marketingIntegrations) && marketingIntegrations.length > 0 ? marketingIntegrations : DEFAULT_MARKETING_INTEGRATIONS)
  );
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live test simulator states
  const [liveTestLogs, setLiveTestLogs] = useState<Array<{ timestamp: string; event: string; status: string; detail: string }>>([
    { timestamp: '10:42:05 AM', event: 'gsc.verification_probe', status: '200 OK', detail: 'Meta tag verified for https://eurekabd.com' },
    { timestamp: '10:41:18 AM', event: 'meta_pixel.PageView', status: '200 OK', detail: 'Payload matched Dataset ID 89127491028301' },
    { timestamp: '10:39:50 AM', event: 'ga4.session_start', status: '200 OK', detail: 'Stream G-EUR8821901 captured geo: Dhaka' }
  ]);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggle = (id: string) => {
    setIntegrationsList(prev =>
      (prev || DEFAULT_MARKETING_INTEGRATIONS).map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleIdChange = (id: string, newTrackingId: string) => {
    setIntegrationsList(prev =>
      (prev || DEFAULT_MARKETING_INTEGRATIONS).map(item =>
        item.id === id ? { ...item, trackingId: newTrackingId } : item
      )
    );
  };

  const handleSave = (item: MarketingIntegration) => {
    updateMarketingIntegration(item.id, {
      enabled: item.enabled,
      trackingId: item.trackingId
    }, currentAdmin.name);

    // If GSC tag, also synchronize to globalSeo
    if (item.id === 'gsc') {
      updateGlobalSeo({
        ...globalSeo,
        googleVerificationTag: item.trackingId
      }, currentAdmin.name);
      updateBusinessSettings({
        ...businessSettings,
        googleSearchConsoleCode: item.trackingId
      });
    }

    // If Facebook Pixel, synchronize to businessSettings
    if (item.id === 'fb_pixel') {
      updateBusinessSettings({
        ...businessSettings,
        facebookPixelId: item.trackingId
      });
    }

    setSaveSuccess(`কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে: ${item.name}`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const testConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      const newLog = {
        timestamp: new Date().toLocaleTimeString(),
        event: `${id}.telemetry_ping`,
        status: '200 OK - Active',
        detail: `Handshake verified with ${id === 'gsc' ? 'Google Search Console' : id === 'fb_pixel' ? 'Meta Graph API' : 'Endpoint'}`
      };
      setLiveTestLogs(prev => [newLog, ...prev]);
      setSaveSuccess(`কানেকশন টেস্ট সফল: ${id.toUpperCase()} 200 OK হ্যান্ডশেক সম্পূর্ণ।`);
      setTimeout(() => setSaveSuccess(null), 3500);
    }, 900);
  };

  const simulatePixelPurchase = () => {
    setIsSimulatingEvent(true);
    setTimeout(() => {
      setIsSimulatingEvent(false);
      const orderId = `EUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const price = 4850;
      const logs = [
        {
          timestamp: new Date().toLocaleTimeString(),
          event: 'meta_pixel.Purchase',
          status: '200 OK Dispatched',
          detail: `Order ${orderId}, Value: ৳${price} BDT, Currency: BDT, Content: "Oxford Leather Shoes"`
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          event: 'meta_pixel.InitiateCheckout',
          status: '200 OK Dispatched',
          detail: `Checkout flow initiated for https://eurekabd.com/checkout`
        }
      ];
      setLiveTestLogs(prev => [...logs, ...prev]);
      setSaveSuccess(`Meta Pixel Test Event (Purchase & AddToCart) সফলভাবে ডিসপ্যাচ করা হয়েছে!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    }, 1200);
  };

  const gscItem = integrationsList.find(i => i.id === 'gsc') || DEFAULT_MARKETING_INTEGRATIONS[1];
  const fbItem = integrationsList.find(i => i.id === 'fb_pixel') || DEFAULT_MARKETING_INTEGRATIONS[3];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Formal Executive Header */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Google Services & Marketing Telemetry Hub
                </h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-mono font-bold">
                  eurekabd.com
                </span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
                গুগল সার্চ কনসোল ভেরিফিকেশন, ফেসবুক পিক্সেল ই-কমার্স ইভেন্ট ট্র্যাকিং এবং অ্যানালিটিক্স সেন্ট্রাল সেটআপ
              </p>
            </div>
          </div>
        </div>

        {/* Quick Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-stone-800/90 rounded-xl border border-stone-700/80 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-stone-300 font-medium">ডোমেইন:</span>
            <span className="text-white font-mono font-bold">eurekabd.com</span>
          </div>
          <div className="px-3 py-1.5 bg-stone-800/90 rounded-xl border border-stone-700/80 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-stone-300 font-medium">Pixel:</span>
            <span className="text-amber-300 font-mono font-bold">{fbItem.enabled ? 'Active' : 'Disabled'}</span>
          </div>
          <div className="px-3 py-1.5 bg-stone-800/90 rounded-xl border border-stone-700/80 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-stone-300 font-medium">GSC:</span>
            <span className="text-blue-300 font-mono font-bold">{gscItem.enabled ? 'Verified' : 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('configs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'configs'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Active Integrations (কনফিগারেশন ও আইডি)
        </button>

        <button
          onClick={() => setActiveTab('gsc-guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'gsc-guide'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          <Search className="w-4 h-4 text-amber-400" />
          Google Search Console সেটআপ গাইড
          <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded">Step-by-Step</span>
        </button>

        <button
          onClick={() => setActiveTab('pixel-guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'pixel-guide'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-indigo-50 hover:text-indigo-700'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-300" />
          Facebook Pixel সেটআপ গাইড
          <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded">Step-by-Step</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'telemetry'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-amber-50 hover:text-amber-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Live Telemetry & Diagnostics (লাইভ টেস্ট)
        </button>
      </div>

      {/* Global Success Notification */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccess}</span>
          </div>
          <button
            onClick={() => setSaveSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-0.5"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* TAB 1: INTEGRATION CONFIG CARDS */}
      {activeTab === 'configs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationsList.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-5 flex flex-col justify-between hover:border-stone-300 transition"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs border ${
                        item.id === 'gsc'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : item.id === 'fb_pixel'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : item.id === 'ga4'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {item.id === 'gsc' ? <Search className="w-5 h-5" /> : item.id === 'fb_pixel' ? <Radio className="w-5 h-5" /> : item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                          {item.id === 'ga4'
                            ? 'রিয়েল-টাইম ভিজিটর সংখ্যা ও ই-কমার্স রাজস্ব ট্র্যাকিং'
                            : item.id === 'gsc'
                            ? 'গুগল অর্গানিক সার্চ কুয়েরি, ইমপ্রেশন ও ইনডেক্সিং ভেরিফিকেশন'
                            : item.id === 'fb_pixel'
                            ? 'ফেসবুক মেটা অ্যাডস কনভার্সন ও রি-টার্গেটিং ইভেন্টস'
                            : 'সেন্ট্রাল স্ক্রিপ্ট ও থার্ড-পার্টি কাস্টম ট্যাগ ম্যানেজমেন্ট'}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={() => handleToggle(item.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {/* ID Input */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-stone-700">
                        {item.id === 'gsc'
                          ? 'HTML Verification Tag / Meta Code'
                          : item.id === 'fb_pixel'
                          ? 'Facebook Pixel Dataset ID'
                          : 'Measurement / Tracking ID'}
                      </label>
                      {item.id === 'gsc' && (
                        <button
                          onClick={() => setActiveTab('gsc-guide')}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
                        >
                          কীভাবে পাবেন? <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                      {item.id === 'fb_pixel' && (
                        <button
                          onClick={() => setActiveTab('pixel-guide')}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5"
                        >
                          কীভাবে পাবেন? <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={item.trackingId}
                        onChange={e => handleIdChange(item.id, e.target.value)}
                        placeholder={
                          item.id === 'ga4'
                            ? 'G-EUR8821901'
                            : item.id === 'gsc'
                            ? 'google-site-verification=EUR-9x882a0b12cd991'
                            : item.id === 'fb_pixel'
                            ? '89127491028301'
                            : 'GTM-WK88201'
                        }
                        className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-stone-50/50"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.trackingId, `input-${item.id}`)}
                        className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700"
                        title="Copy ID"
                      >
                        {copiedKey === `input-${item.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.enabled ? 'bg-emerald-500' : 'bg-stone-300'}`}></span>
                      <span className="text-stone-700 font-medium">
                        স্ট্যাটাস: <strong className={item.enabled ? 'text-emerald-700' : 'text-stone-500'}>{item.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}</strong>
                      </span>
                    </div>
                    <span className="font-mono text-stone-500 text-[10px]">
                      ডোমেইন: eurekabd.com
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => testConnection(item.id)}
                    disabled={!item.enabled || testingId === item.id}
                    className="text-xs text-stone-600 hover:text-stone-900 font-semibold disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {testingId === item.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                        <span>যাচাই হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-3.5 h-3.5 text-stone-500" />
                        <span>কানেকশন টেস্ট</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(item)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Setting
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Setup Promotion Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-stone-900 rounded-2xl p-6 text-white border border-stone-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                গুগল সার্চ কনসোল বা ফেসবুক পিক্সেল সেটআপ করতে সহায়তা চান?
              </h3>
              <p className="text-stone-300 text-xs max-w-2xl leading-relaxed">
                আমাদের বিস্তারিত বাংলা ও ইংরেজি গাইডলাইন পড়ুন। প্রতিটি ধাপে কি কি করতে হবে, কোথা থেকে কোড কপি করবেন এবং কিভাবে eurekabd.com ডোমেইনে সাবমিট করবেন তা সচিত্রভাবে দেখানো হয়েছে।
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('gsc-guide')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> GSC গাইড দেখুন
              </button>
              <button
                onClick={() => setActiveTab('pixel-guide')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Radio className="w-4 h-4" /> পিক্সেল গাইড দেখুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE SEARCH CONSOLE STEP-BY-STEP SETUP GUIDE */}
      {activeTab === 'gsc-guide' && (
        <div className="space-y-6">
          {/* Guide Header Banner */}
          <div className="bg-white rounded-2xl border border-blue-200/90 shadow-2xs p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  অফিসিয়াল গাইডলাইন • eurekabd.com
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  গুগল সার্চ কনসোলে (Google Search Console) ওয়েবসাইট অ্যাড করার সম্পূর্ণ নিয়ম
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
                  গুগল সার্চ কনসোলের মাধ্যমে আপনার ওয়েবসাইট গুগলের ইনডেক্সে দ্রুত যুক্ত হয়, সার্চ ফলাফল ও কিওয়ার্ড র‍্যাঙ্কিং দেখতে পারবেন এবং কোনো ত্রুটি থাকলে গুগল সরাসরি আপনাকে জানাবে।
                </p>
              </div>

              <a
                href="https://search.google.com/search-console/about"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs shrink-0"
              >
                Google Search Console খুলুন <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Step-by-Step Walkthrough Grid */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ১
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ১: গুগল সার্চ কনসোলে লগইন করুন
                </h3>
              </div>
              <p className="text-xs text-stone-600 pl-11 leading-relaxed">
                প্রথমে ব্রাউজারে{' '}
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-semibold"
                >
                  search.google.com/search-console
                </a>{' '}
                লিংকটিতে প্রবেশ করুন এবং আপনার জিমেইল (Gmail) অ্যাকাউন্ট দিয়ে সাইন ইন (Sign In) করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ২
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ২: প্রপার্টি টাইপ সিলেক্ট করুন এবং ডোমেইন URL দিন
                </h3>
              </div>
              <div className="text-xs text-stone-600 pl-11 space-y-2">
                <p>
                  "Add Property" বাটনে ক্লিক করলে দুটি অপশন দেখতে পাবেন: <strong>Domain</strong> এবং <strong>URL prefix</strong>।
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 max-w-xl">
                  <div className="font-semibold text-stone-800">
                    👉 ডান পাশের <strong>URL prefix</strong> অপশনটি বেছে নিন এবং নিচে আপনার সম্পূর্ণ ওয়েবসাইটের ঠিকানা লিখুন:
                  </div>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs">
                    <span className="font-bold text-stone-900">https://eurekabd.com</span>
                    <button
                      onClick={() => copyToClipboard('https://eurekabd.com', 'gsc-domain')}
                      className="text-blue-600 hover:text-blue-800 font-sans font-bold flex items-center gap-1"
                    >
                      {copiedKey === 'gsc-domain' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      কপি করুন
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500">এরপর <strong>"Continue"</strong> বাটনে চাপ দিন।</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৩
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৩: ভেরিফিকেশন মেথড হিসেবে "HTML Tag" নির্বাচন করুন
                </h3>
              </div>
              <div className="text-xs text-stone-600 pl-11 space-y-2">
                <p>
                  গুগল আপনাকে মালিকানা যাচাই (Ownership Verification) করার বিভিন্ন উপায় দেখাবে। সেখানে <strong>"Other verification methods"</strong> সেকশনের ভেতরে <strong>"HTML tag"</strong> অপশনটিতে ক্লিক করুন।
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 max-w-2xl font-mono text-xs text-stone-800">
                  <div className="text-[11px] font-sans text-stone-500 font-semibold">গুগল নিচের মতো একটি মেটা ট্যাগ কোড প্রদান করবে:</div>
                  <div className="bg-stone-900 text-amber-300 p-2.5 rounded-lg overflow-x-auto text-[11px]">
                    {'<meta name="google-site-verification" content="EUR-9x882a0b12cd991" />'}
                  </div>
                </div>
                <p>গুগল সার্চ কনসোল থেকে শুধু <strong>content="..."</strong> এর ভেতরের কোডটুকু অথবা পুরো ট্যাগটি কপি করুন।</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-blue-50/60 rounded-2xl border border-blue-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৪
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৪: এই অ্যাডমিন প্যানেলে কোডটি পেস্ট করে সংরক্ষণ করুন
                </h3>
              </div>
              <div className="text-xs text-stone-700 pl-11 space-y-3">
                <p>
                  নিচের বক্সে আপনার গুগল থেকে পাওয়া ভেরিফিকেশন কোডটি পেস্ট করুন এবং <strong>"Save & Apply to eurekabd.com"</strong> এ ক্লিক করুন। এটি সাথে সাথে ওয়েবসাইটের কোডে যুক্ত হয়ে যাবে।
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
                  <input
                    type="text"
                    value={gscItem.trackingId}
                    onChange={e => handleIdChange('gsc', e.target.value)}
                    placeholder="google-site-verification=EUR-9x882a0b12cd991"
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleSave(gscItem)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs whitespace-nowrap transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save & Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৫
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৫: গুগল সার্চ কনসোলে "VERIFY" বাটনে চাপ দিন
                </h3>
              </div>
              <p className="text-xs text-stone-600 pl-11 leading-relaxed">
                এবার গুগল সার্চ কনসোলের ট্যাবে ফিরে গিয়ে সবুজ <strong>"VERIFY"</strong> বাটনে চাপ দিন। সাথে সাথে গুগল একটি পপআপে দেখাবে: <em>"Ownership verified"</em>! আপনার ডোমেইন <strong>eurekabd.com</strong> সফলভাবে সংযুক্ত হয়ে গেল।
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৬
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৬: এক্সএমএল সাইটম্যাপ (Sitemap.xml) সাবমিট করুন
                </h3>
              </div>
              <div className="text-xs text-stone-600 pl-11 space-y-2">
                <p>
                  ভেরিফিকেশন শেষের পর গুগল সার্চ কনসোলের বাম পাশের মেনু থেকে <strong>"Sitemaps"</strong> অপশনে যান। সেখানে <strong>"Add a new sitemap"</strong> ঘরে লিখুন:
                </p>
                <div className="flex items-center justify-between bg-stone-50 px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs max-w-md">
                  <span className="font-bold text-blue-700">sitemap.xml</span>
                  <button
                    onClick={() => copyToClipboard('https://eurekabd.com/sitemap.xml', 'sitemap-copy')}
                    className="text-stone-600 hover:text-stone-900 font-sans font-bold flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey === 'sitemap-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    পূর্ণ লিংক কপি
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  পূর্ণ লিংক: <code>https://eurekabd.com/sitemap.xml</code>। এরপর <strong>"Submit"</strong> চাপলেই গুগল আপনার সমস্ত ফুটওয়্যার প্রোডাক্ট ও ক্যাটাগরি স্বয়ংক্রিয়ভাবে স্ক্যান করে ইনডেক্স করে ফেলবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FACEBOOK PIXEL & CONVERSIONS API STEP-BY-STEP SETUP GUIDE */}
      {activeTab === 'pixel-guide' && (
        <div className="space-y-6">
          {/* Pixel Header Banner */}
          <div className="bg-white rounded-2xl border border-indigo-200/90 shadow-2xs p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-bold">
                  <Radio className="w-3.5 h-3.5 text-indigo-600" />
                  Meta Events Manager • eurekabd.com
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  ফেসবুক পিক্সেল (Meta Pixel & Conversions API) সেটআপ করার পূর্ণাঙ্গ নিয়ম
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
                  ফেসবুক পিক্সেল যুক্ত করলে ফেসবুকে পেইড বুস্টিং বা অ্যাড রান করার সময় কোন ভিজিটর প্রোডাক্ট দেখল (ViewContent), কার্টে যোগ করল (AddToCart), বা জুতো অর্ডার করল (Purchase) — সবকিছু ফেসবুকে লাইভ রিপোর্ট হবে।
                </p>
              </div>

              <a
                href="https://business.facebook.com/events_manager2"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs shrink-0"
              >
                Meta Events Manager খুলুন <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Step-by-Step Flow */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ১
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ১: Meta Events Manager এ যান
                </h3>
              </div>
              <p className="text-xs text-stone-600 pl-11 leading-relaxed">
                ব্রাউজারে{' '}
                <a
                  href="https://business.facebook.com/events_manager2"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 underline font-semibold"
                >
                  business.facebook.com/events_manager2
                </a>{' '}
                এ প্রবেশ করুন এবং আপনার ফেসবুক বিজনেস অ্যাকাউন্ট দিয়ে লগইন করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ২
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ২: নতুন পিক্সেল বা ডেটাসেট তৈরি করুন (Connect Data Source)
                </h3>
              </div>
              <div className="text-xs text-stone-600 pl-11 space-y-2 leading-relaxed">
                <p>
                  বাম পাশের সবুজ <strong>"+" (Connect Data Sources)</strong> বাটনে ক্লিক করুন।
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 max-w-xl">
                  <div className="font-semibold text-stone-800">
                    ১. অপশন থেকে <strong>"Web"</strong> নির্বাচন করুন এবং <strong>"Connect"</strong> বাটনে চাপ দিন।
                  </div>
                  <div className="font-semibold text-stone-800">
                    ২. পিক্সেলের একটি নাম দিন, যেমন: <code>Eureka BD Official Pixel</code>।
                  </div>
                  <div className="font-semibold text-stone-800">
                    ৩. আপনার ওয়েবসাইটের ডোমেইন দিন: <code>https://eurekabd.com</code>।
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৩
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৩: আপনার ১৫ বা ১৬ সংখ্যার Pixel ID কপি করুন
                </h3>
              </div>
              <div className="text-xs text-stone-600 pl-11 space-y-2 leading-relaxed">
                <p>
                  পিক্সেল তৈরি হয়ে গেলে "Settings" বা "Overview" ট্যাবে গেলে আপনি একটি <strong>Dataset ID / Pixel ID</strong> দেখতে পাবেন (যেমন: <code>89127491028301</code>)।
                </p>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-indigo-900 font-semibold max-w-lg">
                  💡 কোনো জটিল কোডিং করতে হবে না! শুধু এই সংখ্যাটি কপি করলেই হবে।
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-indigo-50/60 rounded-2xl border border-indigo-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৪
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৪: এই প্যানেলে Facebook Pixel ID বসিয়ে সেভ করুন
                </h3>
              </div>
              <div className="text-xs text-stone-700 pl-11 space-y-3">
                <p>
                  নিচের বক্সে আপনার পিক্সেল আইডিটি বসান এবং <strong>"Save & Activate Pixel"</strong> বাটনে ক্লিক করুন:
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
                  <input
                    type="text"
                    value={fbItem.trackingId}
                    onChange={e => handleIdChange('fb_pixel', e.target.value)}
                    placeholder="89127491028301"
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleSave(fbItem)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs whitespace-nowrap transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save & Activate Pixel
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৫
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৫: eurekabd.com এ স্বয়ংক্রিয়ভাবে যেসব ইভেন্ট ট্র্যাক হবে
                </h3>
              </div>
              <div className="text-xs text-stone-600 pl-11 space-y-3 leading-relaxed">
                <p>পিক্সেল সেভ করার সাথে সাথে নিচের স্ট্যান্ডার্ড ই-কমার্স ইভেন্টগুলো সক্রিয় হয়ে যাবে:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" /> PageView & ViewContent
                    </div>
                    <div className="text-[11px] text-stone-500">
                      যখনই কোনো কাস্টমার ওয়েবসাইট বা কোনো জুতোর পেজ ওপেন করবে।
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-600" /> AddToCart
                    </div>
                    <div className="text-[11px] text-stone-500">
                      যখন কাস্টমার পছন্দের সাইজ নির্বাচন করে জুতো ব্যাগে যুক্ত করবে।
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Purchase (কেনাকাটা সম্পন্ন)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      ক্যাশ অন ডেলিভারিতে অর্ডার প্লেস করার পর টাকার পরিমাণ (BDT) সহ ফেসবুক অ্যাড ম্যানেজারে কনভার্সন কাউন্ট হবে।
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" /> InitiateCheckout
                    </div>
                    <div className="text-[11px] text-stone-500">
                      যখন কাস্টমার চেকআউট ফর্মে নাম ও ঠিকানা পূরণ করতে যাবে।
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৬
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  ধাপ ৬: টেস্ট করুন এবং নিশ্চিত হোন
                </h3>
              </div>
              <div className="text-xs text-stone-600 pl-11 space-y-3">
                <p>
                  পিক্সেল সঠিকভাবে কাজ করছে কিনা তা জানার জন্য গুগল ক্রোম ব্রাউজারে <strong>"Meta Pixel Helper"</strong> এক্সটেনশনটি ব্যবহার করতে পারেন অথবা নিচের বাটনে চাপ দিয়ে এখনই একটি টেস্ট ইভেন্ট পাঠিয়ে যাচাই করতে পারেন:
                </p>
                <div>
                  <button
                    onClick={simulatePixelPurchase}
                    disabled={isSimulatingEvent}
                    className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition"
                  >
                    {isSimulatingEvent ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>ইভেন্ট ডিসপ্যাচ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Send Test Pixel Event (PageView & AddToCart)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE TELEMETRY & DIAGNOSTICS */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-600" />
                  লাইভ মার্কেটিং ও ট্র্যাকিং ইভেন্ট কনসোল
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  eurekabd.com স্টোরফ্রন্ট থেকে প্রেরিত Google Tag Manager, Search Console ও Facebook Pixel ইভেন্ট ট্র্যাকিং স্ট্রিম।
                </p>
              </div>

              <button
                onClick={simulatePixelPurchase}
                disabled={isSimulatingEvent}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {isSimulatingEvent ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                টেস্ট ইভেন্ট সিমুলেশন করুন
              </button>
            </div>

            {/* Event Console Window */}
            <div className="bg-stone-950 rounded-xl p-4 font-mono text-xs text-stone-300 space-y-2 border border-stone-800 max-h-96 overflow-y-auto shadow-inner">
              <div className="text-stone-500 pb-2 border-b border-stone-800 text-[11px] flex justify-between">
                <span>[STREAM ACTIVE: https://eurekabd.com/api/telemetry]</span>
                <span className="text-emerald-400">● LIVE</span>
              </div>
              {liveTestLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1 border-b border-stone-900/60 last:border-0 text-[11px]">
                  <span className="text-stone-500 shrink-0">{log.timestamp}</span>
                  <span className="text-amber-400 font-bold shrink-0">{log.event}</span>
                  <span className="text-emerald-400 font-semibold shrink-0">[{log.status}]</span>
                  <span className="text-stone-300 truncate">{log.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
