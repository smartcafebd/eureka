import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductSeoData, PageSeoItem, GlobalSeoConfig } from '../../types';
import {
  Search,
  Sparkles,
  Globe,
  Share2,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  ArrowUpRight,
  Save,
  Wand2,
  Bot,
  Copy,
  Check,
  Tag,
  Layers,
  HelpCircle,
  Eye,
  Sliders,
  RefreshCw,
  Zap,
  Info,
  Radio,
  ExternalLink,
  ShieldCheck,
  Edit3,
  Flame,
  CheckCheck
} from 'lucide-react';

interface AdminSEOManagerProps {
  onNavigateTab?: (tabId: string) => void;
}

export const AdminSEOManager: React.FC<AdminSEOManagerProps> = ({ onNavigateTab }) => {
  const {
    globalSeo,
    updateGlobalSeo,
    products,
    categories,
    pageSeoList,
    updatePageSeo,
    updateProductSeo,
    currentAdmin,
    businessSettings,
    updateBusinessSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'global' | 'categories' | 'pages' | 'ai-assistant'>('products');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [productSearch, setProductSearch] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // SEO Editing Mode: 'manual' or 'ai-fixed'
  const [seoMode, setSeoMode] = useState<'manual' | 'ai-fixed'>('manual');

  // Global SEO Form Local State
  const [globalForm, setGlobalForm] = useState<GlobalSeoConfig>(() => ({
    ...globalSeo,
    domainName: globalSeo.domainName || businessSettings.domainName || 'eurekabd.com',
    canonicalDomain: globalSeo.canonicalDomain || 'https://eurekabd.com',
    focusKeyword: globalSeo.focusKeyword || 'genuine leather shoes bd',
    metaTitle: globalSeo.metaTitle || globalSeo.siteTitle || 'EUREKA Footwear BD – Handcrafted Genuine Leather Shoes & Boots',
    metaDescription: globalSeo.metaDescription || 'Premium handcrafted genuine leather shoes in Bangladesh with anatomic arch support, durable soles, and cash on delivery.',
    seoMode: globalSeo.seoMode || 'manual'
  }));

  // Selected Product SEO State
  const selectedProduct = useMemo(
    () => products.find(p => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const [productSeoForm, setProductSeoForm] = useState<ProductSeoData>(() => {
    if (selectedProduct?.seo) return selectedProduct.seo;
    const catStr = typeof selectedProduct?.category === 'string' ? selectedProduct.category : (selectedProduct?.category as any)?.name || 'leather shoes';
    return {
      seoTitle: `${selectedProduct?.name || 'Footwear'} | EUREKA Genuine Leather`,
      metaDescription: selectedProduct?.shortDescription || selectedProduct?.description?.slice(0, 150) || '',
      focusKeyword: catStr.toLowerCase(),
      secondaryKeywords: ['genuine leather', 'handcrafted', 'anatomic sole', 'shoes bd'],
      slug: (selectedProduct?.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      canonicalUrl: `https://eurekabd.com/product/${(selectedProduct?.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      imageAltText: `${selectedProduct?.name || ''} handcrafted genuine leather footwear eurekabd.com`,
      seoScore: 88,
      schemaEnabled: true
    };
  });

  // Reset local form when selected product changes
  React.useEffect(() => {
    if (selectedProduct) {
      const catStr = typeof selectedProduct.category === 'string' ? selectedProduct.category : (selectedProduct.category as any)?.name || 'leather shoes';
      setProductSeoForm(
        selectedProduct.seo || {
          seoTitle: `${selectedProduct.name} | EUREKA Genuine Leather`,
          metaDescription: selectedProduct.shortDescription || selectedProduct.description.slice(0, 150),
          focusKeyword: catStr.toLowerCase(),
          secondaryKeywords: ['genuine leather', 'handcrafted', selectedProduct.name.toLowerCase()],
          slug: selectedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          canonicalUrl: `https://eurekabd.com/product/${selectedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          imageAltText: `${selectedProduct.name} handcrafted genuine leather footwear eurekabd.com`,
          seoScore: 88,
          schemaEnabled: true
        }
      );
    }
  }, [selectedProductId, selectedProduct]);

  // Recommended Focus Keywords for quick one-click insertion
  const recommendedFocusKeywords = [
    'genuine leather shoes bd',
    'mens leather shoes dhaka',
    'handcrafted formal shoes',
    'chelsea boots bangladesh',
    'leather sandals bd',
    'oxford dress shoes bd',
    'pure leather footwear'
  ];

  // Real-time SEO Score Calculator & Checklist
  const seoChecklist = useMemo(() => {
    const title = productSeoForm.seoTitle || '';
    const desc = productSeoForm.metaDescription || '';
    const focus = (productSeoForm.focusKeyword || '').toLowerCase().trim();
    const slug = productSeoForm.slug || '';
    const alt = productSeoForm.imageAltText || '';

    const checks = [
      {
        id: 'title-len',
        title: 'Title Length (৪০–৬৫ অক্ষর)',
        passed: title.length >= 40 && title.length <= 65,
        detail: `বর্তমানে ${title.length} টি অক্ষর (উপযুক্ত সীমা: ৪০-৬৫ অক্ষর)`
      },
      {
        id: 'desc-len',
        title: 'Meta Description Length (১২০–১৬০ অক্ষর)',
        passed: desc.length >= 120 && desc.length <= 160,
        detail: `বর্তমানে ${desc.length} টি অক্ষর (উপযুক্ত সীমা: ১২০-১৬০ অক্ষর)`
      },
      {
        id: 'focus-title',
        title: 'Title এ ফোকাস কিওয়ার্ডের উপস্থিতি',
        passed: focus ? title.toLowerCase().includes(focus) : false,
        detail: focus ? `ফোকাস কিওয়ার্ড "${focus}" টাইটেলে অন্তর্ভুক্ত আছে` : 'একটি ফোকাস কিওয়ার্ড নির্ধারণ করুন'
      },
      {
        id: 'focus-desc',
        title: 'Meta Description এ ফোকাস কিওয়ার্ড',
        passed: focus ? desc.toLowerCase().includes(focus) : false,
        detail: focus ? `ফোকাস কিওয়ার্ড "${focus}" ডেসক্রিপশনে পাওয়া গেছে` : 'ডেসক্রিপশনে ফোকাস কিওয়ার্ড যোগ করুন'
      },
      {
        id: 'focus-slug',
        title: 'URL Slug এ ক্লিয়ার কিওয়ার্ড ফরম্যাট',
        passed: slug.length > 3 && !/[^a-z0-9-]/.test(slug),
        detail: `eurekabd.com/product/${slug}`
      },
      {
        id: 'alt-text',
        title: 'Image Alt Text অপ্টিমাইজেশন',
        passed: alt.length > 10,
        detail: alt ? `Alt: "${alt.slice(0, 35)}..."` : 'ইমেজ Alt ট্যাগ অনুপস্থিত'
      },
      {
        id: 'schema',
        title: 'Rich Product Schema Markup সক্রিয়',
        passed: productSeoForm.schemaEnabled,
        detail: 'Price, Currency, Rating এবং Availability JSON-LD সংযুক্ত'
      }
    ];

    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return { checks, score };
  }, [productSeoForm]);

  // Handle saving product SEO
  const handleSaveProductSeo = () => {
    if (!selectedProduct) return;
    updateProductSeo(selectedProduct.id, {
      ...productSeoForm,
      seoScore: seoChecklist.score
    }, currentAdmin.name);
    setSaveSuccess(`প্রোডাক্ট SEO সফলভাবে সংরক্ষিত: ${selectedProduct.name} (${seoChecklist.score}% SEO Score)`);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Handle saving Global SEO
  const handleSaveGlobalSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalSeo(globalForm, currentAdmin.name);
    if (globalForm.domainName) {
      updateBusinessSettings({
        ...businessSettings,
        domainName: globalForm.domainName,
        metaTitle: globalForm.metaTitle,
        metaDescription: globalForm.metaDescription,
        focusKeyword: globalForm.focusKeyword,
        seoMode: globalForm.seoMode
      });
    }
    setSaveSuccess(`গ্লোবাল SEO ও মেটাডাটা কনফিগারেশন (${globalForm.domainName}) সফলভাবে সংরক্ষিত হয়েছে!`);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // AI Assistant generator state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<{
    title: string;
    description: string;
    focusKeyword: string;
    keywords: string[];
    altText: string;
    slug: string;
    faqs: { question: string; answer: string }[];
  } | null>(null);

  // Run AI Auto-Fix & Optimize for Selected Product
  const runAiOptimization = () => {
    if (!selectedProduct) return;
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      const cat = typeof selectedProduct.category === 'string' ? selectedProduct.category : 'leather shoes';
      const cleanSlug = selectedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const focus = `${cat.toLowerCase()} bd`;

      const generated = {
        title: `${selectedProduct.name} – Genuine Leather ${cat} | eurekabd.com`,
        description: `Buy ${selectedProduct.name} handcrafted from 100% genuine leather with anatomic cushioned arch support and durable sole. Cash on delivery & 7-day exchange on eurekabd.com.`,
        focusKeyword: focus,
        keywords: [
          focus,
          selectedProduct.name.toLowerCase(),
          'genuine leather shoes bd',
          'handcrafted mens footwear dhaka',
          'anatomic arch support'
        ],
        altText: `${selectedProduct.name} handcrafted genuine leather footwear with non-slip sole eurekabd.com`,
        slug: cleanSlug,
        faqs: [
          {
            question: `Is ${selectedProduct.name} made of 100% genuine leather?`,
            answer: 'Yes, every pair is handcrafted using premium full-grain vegetable-tanned cow leather with breathable genuine leather lining.'
          },
          {
            question: 'What is the delivery time across Bangladesh?',
            answer: 'Dhaka city deliveries take 24–48 hours; all other districts across Bangladesh are delivered within 2–4 days via courier with cash on delivery.'
          }
        ]
      };
      setAiGeneratedResult(generated);

      // If user is in AI-Fixed mode, directly apply it
      if (seoMode === 'ai-fixed') {
        setProductSeoForm(prev => ({
          ...prev,
          seoTitle: generated.title,
          metaDescription: generated.description,
          focusKeyword: generated.focusKeyword,
          secondaryKeywords: generated.keywords,
          imageAltText: generated.altText,
          slug: generated.slug,
          customFaq: generated.faqs,
          seoScore: 98
        }));
        setSaveSuccess(`এআই স্বয়ংক্রিয়ভাবে "${selectedProduct.name}" এর মেটা ট্যাগ, ডেসক্রিপশন এবং ফোকাস কিওয়ার্ড ফিক্স করে দিয়েছে!`);
        setTimeout(() => setSaveSuccess(null), 4000);
      }
    }, 900);
  };

  const applyAiResultToProduct = () => {
    if (!aiGeneratedResult) return;
    setProductSeoForm(prev => ({
      ...prev,
      seoTitle: aiGeneratedResult.title,
      metaDescription: aiGeneratedResult.description,
      focusKeyword: aiGeneratedResult.focusKeyword,
      secondaryKeywords: aiGeneratedResult.keywords,
      imageAltText: aiGeneratedResult.altText,
      slug: aiGeneratedResult.slug,
      customFaq: aiGeneratedResult.faqs,
      seoScore: 98
    }));
    setSaveSuccess(`এআই প্রস্তাবিত মেটাডাটা ও ফোকাস কিওয়ার্ড সফলভাবে প্রয়োগ করা হয়েছে!`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // Run AI Optimization for Global Site Settings
  const runGlobalAiOptimization = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setGlobalForm(prev => ({
        ...prev,
        domainName: 'eurekabd.com',
        canonicalDomain: 'https://eurekabd.com',
        siteTitle: 'EUREKA Footwear – Handcrafted Genuine Leather Shoes & Boots in Bangladesh',
        metaTitle: 'EUREKA BD | Luxury Handcrafted Genuine Leather Shoes & Boots',
        metaDescription: 'Shop handcrafted 100% genuine leather oxford shoes, boots, and sandals in Bangladesh. Ergonomic arch support, durable soles, and fast Cash on Delivery on eurekabd.com.',
        focusKeyword: 'genuine leather shoes bd',
        ogTitle: 'EUREKA Footwear Bangladesh – Premium Handcrafted Leather Shoes',
        ogDescription: 'Experience timeless style with 100% genuine leather footwear. Handcrafted with care, anatomic arch comfort, and doorstep delivery across Bangladesh.'
      }));
      setSaveSuccess(`গ্লোবাল ওয়েবসাইট মেটাডাটা ও ফোকাস কিওয়ার্ড এআই দ্বারা অপ্টিমাইজ করা হয়েছে!`);
      setTimeout(() => setSaveSuccess(null), 3500);
    }, 850);
  };

  const copySnippet = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredProducts = (products || []).filter(p => {
    const catStr = typeof p.category === 'string' ? p.category : (p.category as any)?.name || '';
    return p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      catStr.toLowerCase().includes(productSearch.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Formal Executive Header */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Search className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  সার্চ ইঞ্জিন অপ্টিমাইজেশন ও মেটাডাটা ব্যবস্থাপনা
                </h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-mono font-bold">
                  eurekabd.com
                </span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
                Google Search Snippets, মেটা ট্যাগ ও ডেসক্রিপশন (ম্যানুয়াল ও এআই ফিক্সড), ফোকাস কিওয়ার্ড এবং JSON-LD স্কিমা কমান্ড সেন্টার
              </p>
            </div>
          </div>
        </div>

        {/* Executive Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* SEO Mode Switcher Pill */}
          <div className="bg-stone-800/90 p-1 rounded-xl border border-stone-700/80 flex items-center text-xs">
            <button
              onClick={() => setSeoMode('manual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                seoMode === 'manual'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="ম্যানুয়াল মোড: নিজের মতো করে মেটা ট্যাগ, ডেসক্রিপশন ও কিওয়ার্ড লিখুন"
            >
              <Edit3 className="w-3.5 h-3.5" />
              ম্যানুয়াল মোড
            </button>
            <button
              onClick={() => {
                setSeoMode('ai-fixed');
                runAiOptimization();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                seoMode === 'ai-fixed'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="এআই ফিক্সড মোড: এআই স্বয়ংক্রিয়ভাবে সেরা মেটাডাটা ও ফোকাস কিওয়ার্ড তৈরি করবে"
            >
              <Sparkles className="w-3.5 h-3.5" />
              এআই ফিক্সড মোড
            </button>
          </div>

          {/* Direct link to Google Search Console & Pixel Setup Guides */}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('integrations')}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600/90 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition border border-blue-500/50 shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 text-amber-300" />
              GSC ও Pixel সেটআপ গাইড
            </button>
          )}
        </div>
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

      {/* Domain & Quick Integration Status Strip */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
            <Globe className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">প্রাথমিক ভেরিফাইড ডোমেইন:</span>
              <span className="font-mono font-bold text-stone-900 text-sm">https://eurekabd.com</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> SSL Active
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              ক্যানোনিকাল ইউআরএল এবং গুগল ক্রলার ইনডেক্সিং eurekabd.com ডোমেইনের সাথে সংযুক্ত রয়েছে।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => copySnippet('https://eurekabd.com/sitemap.xml', 'sitemap')}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            {copiedKey === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            Sitemap.xml লিংক
          </button>
          <button
            onClick={() => copySnippet('https://eurekabd.com/robots.txt', 'robots')}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            {copiedKey === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            Robots.txt লিংক
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <Tag className="w-4 h-4" />
          প্রোডাক্ট SEO ও SERP প্রিভিউ
        </button>

        <button
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'global'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <Globe className="w-4 h-4" />
          গ্লোবাল ওয়েবসাইট SEO ও মেটা ট্যাগ
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          ক্যাটাগরি মেটা ও ব্রেডক্রাম্ব
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'pages'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          স্ট্যাটিক পেজ মেটাডাটা
        </button>

        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'ai-assistant'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-500" />
          AI Content Optimizer (এআই অ্যাসিস্ট্যান্ট)
        </button>
      </div>

      {/* TAB 1: PRODUCT SEO & SERP PREVIEWS */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Selector Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                প্রোডাক্ট নির্বাচন করুন ({filteredProducts.length})
              </h2>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="নাম বা ক্যাটাগরি দিয়ে সার্চ করুন..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="max-h-[560px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-50">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 ${
                    selectedProductId === p.id
                      ? 'bg-amber-50/80 border border-amber-300 text-amber-950 font-semibold shadow-2xs'
                      : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                  }`}
                >
                  <img
                    src={p.images?.[0] || ''}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs truncate font-bold text-stone-900">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                      <span>{typeof p.category === 'string' ? p.category : (p.category as any)?.name || 'Footwear'}</span>
                      <span>•</span>
                      <span className="font-mono">৳{p.price}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      (p.seo?.seoScore || 88) >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {p.seo?.seoScore || 88}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: SEO Editor & Live Snippet Preview */}
          <div className="lg:col-span-8 space-y-6">
            {/* GOOGLE SERP PREVIEW BOX */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-stone-900">গুগল সার্চ রেজাল্ট প্রিভিউ (Google SERP Snippet Preview)</h3>
                </div>
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                      previewDevice === 'desktop' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                      previewDevice === 'mobile' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>
              </div>

              {/* Realistic Google Search Card */}
              <div className={`p-4 bg-white border border-stone-200 rounded-xl transition ${
                previewDevice === 'mobile' ? 'max-w-sm mx-auto shadow-md' : 'w-full'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-stone-900 flex items-center justify-center text-amber-400 font-bold text-[10px]">
                    E
                  </div>
                  <div className="text-xs leading-none">
                    <p className="font-semibold text-stone-900">EUREKA Footwear BD</p>
                    <p className="text-[11px] text-stone-500 font-mono mt-0.5 truncate">
                      https://eurekabd.com &gt; product &gt; {productSeoForm.slug || 'item'}
                    </p>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-snug">
                  {productSeoForm.seoTitle || `${selectedProduct?.name} | EUREKA Footwear BD`}
                </h4>

                <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                  {productSeoForm.metaDescription || selectedProduct?.shortDescription || '100% Genuine leather handcrafted footwear in Bangladesh. Premium anatomic arch sole and cash on delivery.'}
                </p>

                {/* Structured Data Badges in SERP */}
                {productSeoForm.schemaEnabled && (
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-600 border-t border-stone-100 pt-2">
                    <span className="font-semibold text-stone-900">৳{selectedProduct?.price} BDT</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">In Stock</span>
                    <span>•</span>
                    <span>Rating: 4.9 ★★★★★ (128 Reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT SEO FIELDS FORM */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-stone-900">
                      অন-পেজ মেটাডাটা ও কিওয়ার্ড এডিটর ({selectedProduct?.name})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500">বর্তমান মোড:</span>
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                      seoMode === 'ai-fixed'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                    }`}>
                      {seoMode === 'ai-fixed' ? '🤖 এআই ফিক্সড মোড' : '✍️ ম্যানুয়াল মোড'}
                    </span>
                  </div>
                </div>

                {/* AI Quick Fix Action Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={runAiOptimization}
                    disabled={aiGenerating}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-xs transition shadow-xs disabled:opacity-50"
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
                    {aiGenerating ? 'এআই অপ্টিমাইজ করছে...' : 'এআই দিয়ে অটো-ফিক্স করুন'}
                  </button>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    seoChecklist.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {seoChecklist.score}% SEO
                  </span>
                </div>
              </div>

              {/* Real-time Checklist Visual */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/90 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-900">
                    SEO হেলথ অডিট চেকলিস্ট ({seoChecklist.checks.filter(c => c.passed).length}/{seoChecklist.checks.length} পাস)
                  </span>
                  <span className="text-[11px] text-stone-500">টাইপ করার সাথে সাথে লাইভ আপডেট হয়</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  {seoChecklist.checks.map(c => (
                    <div key={c.id} className="flex items-start gap-2">
                      {c.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-semibold ${c.passed ? 'text-stone-800' : 'text-amber-900'}`}>{c.title}</p>
                        <p className="text-[10px] text-stone-500">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 text-xs">
                {/* SEO Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-stone-800">SEO পেজ টাইটেল ট্যাগ (Page Title Tag)</label>
                    <span className={`text-[11px] font-mono ${
                      productSeoForm.seoTitle.length > 65 || productSeoForm.seoTitle.length < 40 ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'
                    }`}>
                      {productSeoForm.seoTitle.length} / ৬৫ অক্ষর
                    </span>
                  </div>
                  <input
                    type="text"
                    value={productSeoForm.seoTitle}
                    onChange={e => setProductSeoForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
                    placeholder="e.g. Oxford Formal Shoes – Handcrafted Genuine Leather | eurekabd.com"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    গুগল সার্চ ফলাফলের নীল শিরোনাম। এতে প্রাইমারি ফোকাস কিওয়ার্ড ও ব্র্যান্ড নেম রাখা আবশ্যক।
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-stone-800">মেটা ডেসক্রিপশন (Meta Description Tag)</label>
                    <span className={`text-[11px] font-mono ${
                      productSeoForm.metaDescription.length > 160 || productSeoForm.metaDescription.length < 120 ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'
                    }`}>
                      {productSeoForm.metaDescription.length} / ১৬০ অক্ষর
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={productSeoForm.metaDescription}
                    onChange={e => setProductSeoForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-normal leading-relaxed"
                    placeholder="e.g. Buy handcrafted 100% genuine leather shoes in Bangladesh with anatomic cushioned arch support. Cash on delivery & fast delivery across BD on eurekabd.com."
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    সার্চ ইঞ্জিনে লিংকের নিচে প্রদর্শিত সারাংশ। ১২০ থেকে ১৬০ অক্ষরের মধ্যে ফোকাস কিওয়ার্ড সহ আকর্ষণীয় তথ্য দিন।
                  </p>
                </div>

                {/* FOCUS KEYWORD ENGINE (ফোকাস কিওয়ার্ড) */}
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-600" />
                      প্রাইমারি ফোকাস কিওয়ার্ড (Focus Search Keyword)
                    </label>
                    <span className="text-[11px] font-bold text-amber-800">
                      {productSeoForm.focusKeyword ? `ফোকাস: "${productSeoForm.focusKeyword}"` : 'কিওয়ার্ড নির্ধারণ করুন'}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={productSeoForm.focusKeyword}
                    onChange={e => setProductSeoForm(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    className="w-full px-3 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium bg-white"
                    placeholder="e.g. genuine leather shoes bd, oxford shoes bd, chelsea boots"
                  />

                  {/* Clickable Recommended Keywords */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-stone-600 font-medium">প্রস্তাবিত জনপ্রিয় ফোকাস কিওয়ার্ড (ক্লিক করে নির্বাচন করুন):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendedFocusKeywords.map(kw => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => setProductSeoForm(prev => ({ ...prev, focusKeyword: kw }))}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                            productSeoForm.focusKeyword === kw
                              ? 'bg-amber-600 text-white font-bold shadow-2xs'
                              : 'bg-white hover:bg-amber-100 text-stone-700 border border-amber-200'
                          }`}
                        >
                          + {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* URL Slug & Image Alt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">URL Slug / পারমালিংক</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-stone-400 font-mono text-[11px]">eurekabd.com/product/</span>
                      <input
                        type="text"
                        value={productSeoForm.slug}
                        onChange={e => setProductSeoForm(prev => ({
                          ...prev,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
                        }))}
                        className="w-full pl-44 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">ইমেজ Alt ট্যাগ (Accessibility & Image SEO)</label>
                    <input
                      type="text"
                      value={productSeoForm.imageAltText}
                      onChange={e => setProductSeoForm(prev => ({ ...prev, imageAltText: e.target.value }))}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      placeholder="e.g. Oxford genuine leather shoes handcrafted eurekabd.com"
                    />
                  </div>
                </div>

                {/* Schema Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="schemaEnabled"
                    checked={productSeoForm.schemaEnabled}
                    onChange={e => setProductSeoForm(prev => ({ ...prev, schemaEnabled: e.target.checked }))}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <label htmlFor="schemaEnabled" className="font-semibold text-stone-800 cursor-pointer">
                    Enable Rich Product JSON-LD Schema (Google Merchant, Ratings & Stock Status)
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleSaveProductSeo}
                  className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  প্রোডাক্ট SEO সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL SEO & SOCIAL SHARING */}
      {activeTab === 'global' && (
        <form onSubmit={handleSaveGlobalSeo} className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-600" /> গ্লোবাল ওয়েবসাইট ডোমেইন ও মেটাডাটা কনফিগারেশন
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  eurekabd.com এর প্রাথমিক ডোমেইন, সাইটওয়াইড মেটা ট্যাগ, ডিফল্ট ডেসক্রিপশন এবং ক্রলার সেটিংস
                </p>
              </div>
              <button
                type="button"
                onClick={runGlobalAiOptimization}
                disabled={aiGenerating}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl text-xs transition shadow-xs shrink-0"
              >
                <Wand2 className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
                {aiGenerating ? 'এআই অপ্টিমাইজ করছে...' : 'গ্লোবাল SEO এআই ফিক্স করুন'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                {/* Domain Name */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">প্রাথমিক ডোমেইন নেম (Primary Domain Name)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={globalForm.domainName || 'eurekabd.com'}
                      onChange={e => setGlobalForm({ ...globalForm, domainName: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono font-bold text-stone-900"
                    />
                    <span className="absolute right-3 top-2 text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    সার্চ ইঞ্জিন এবং ব্রাউজারে ব্যবহৃত প্রধান ডোমেইন: <code>https://eurekabd.com</code>
                  </p>
                </div>

                {/* Global Site Title */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">গ্লোবাল সাইট টাইটেল (Global Site Title)</label>
                  <input
                    type="text"
                    value={globalForm.siteTitle}
                    onChange={e => setGlobalForm({ ...globalForm, siteTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
                  />
                </div>

                {/* Global Focus Keyword */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">হোমপেজ ফোকাস কিওয়ার্ড (Homepage Focus Keyword)</label>
                  <input
                    type="text"
                    value={globalForm.focusKeyword || ''}
                    onChange={e => setGlobalForm({ ...globalForm, focusKeyword: e.target.value })}
                    placeholder="e.g. genuine leather shoes bd, handcrafted shoes dhaka"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">ডিফল্ট মেটা ডেসক্রিপশন (Default Meta Description)</label>
                  <textarea
                    rows={3}
                    value={globalForm.metaDescription}
                    onChange={e => setGlobalForm({ ...globalForm, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Canonical Base URL */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">ক্যানোনিকাল ডোমেইন বেস (Canonical Base URL)</label>
                  <input
                    type="text"
                    value={globalForm.canonicalDomain || 'https://eurekabd.com'}
                    onChange={e => setGlobalForm({ ...globalForm, canonicalDomain: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>

                {/* Robots Directive */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Robots Default Directive (সার্চ ইঞ্জিন ক্রলিং)</label>
                  <select
                    value={globalForm.robotsDefault}
                    onChange={e => setGlobalForm({ ...globalForm, robotsDefault: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="index, follow">index, follow (প্রস্তাবিত: সমস্ত পেজ সার্চ ইঞ্জিনে ইনডেক্স হবে)</option>
                    <option value="noindex, nofollow">noindex, nofollow (ইনডেক্সিং বন্ধ)</option>
                    <option value="index, nofollow">index, nofollow (শুধুমাত্র পেজ ইনডেক্স হবে)</option>
                  </select>
                </div>

                {/* Google Site Verification Code */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-stone-800">Google Search Console ভেরিফিকেশন কোড</label>
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab('integrations')}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        সেটআপ গাইড দেখুন →
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={globalForm.googleVerificationTag || ''}
                    onChange={e => setGlobalForm({ ...globalForm, googleVerificationTag: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                    placeholder="google-site-verification=EUR-9x882a0b12cd991"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OpenGraph & Social Previews */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-600" /> OpenGraph & Social Sharing Meta (Facebook, WhatsApp, LinkedIn)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                ফেসবুক, হোয়াটসঅ্যাপ বা মেসেঞ্জারে eurekaBD এর লিংক শেয়ার করলে যেভাবে কার্ড ও ইমেজ প্রদর্শিত হবে
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">OpenGraph Title (og:title)</label>
                  <input
                    type="text"
                    value={globalForm.ogTitle || ''}
                    onChange={e => setGlobalForm({ ...globalForm, ogTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">OpenGraph Description (og:description)</label>
                  <textarea
                    rows={3}
                    value={globalForm.ogDescription || ''}
                    onChange={e => setGlobalForm({ ...globalForm, ogDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">OpenGraph Banner Image URL (1200x630)</label>
                  <input
                    type="text"
                    value={globalForm.ogImage || ''}
                    onChange={e => setGlobalForm({ ...globalForm, ogImage: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Social Share Live Preview Card */}
              <div>
                <label className="block font-bold text-stone-800 mb-2">লাইভ সোশ্যাল শেয়ার প্রিভিউ</label>
                <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs bg-white">
                  <img
                    src={globalForm.ogImage || 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80'}
                    alt="Social Preview"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3 bg-stone-50 border-t border-stone-100">
                    <p className="text-[11px] uppercase font-mono text-stone-400">eurekabd.com</p>
                    <p className="font-bold text-stone-900 text-xs mt-0.5 truncate">{globalForm.ogTitle || globalForm.siteTitle}</p>
                    <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">{globalForm.ogDescription || globalForm.metaDescription}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition shadow-xs"
              >
                <Save className="w-4 h-4" />
                গ্লোবাল SEO সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: CATEGORY SEO */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" /> ক্যাটাগরি পেজ মেটাডাটা ও ব্রেডক্রাম্ব
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              ক্যাটাগরি ভিত্তিক সার্চের জন্য মেটা টাইটেল, ডেসক্রিপশন এবং ব্রেডক্রাম্ব স্কিমা
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {categories.map(cat => (
              <div key={cat.id} className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    <h3 className="font-bold text-stone-900 text-sm">{cat.name}</h3>
                    <span className="text-xs font-mono text-stone-500">eurekabd.com/category/{cat.slug}</span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Breadcrumb Schema Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">SEO Title</label>
                    <input
                      type="text"
                      defaultValue={`${cat.name} | Handcrafted Men's Footwear – eurekabd.com`}
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Meta Description</label>
                    <input
                      type="text"
                      defaultValue={`Shop genuine leather ${cat.name.toLowerCase()} handcrafted in Bangladesh. Premium Tuscan leather with anatomic arch support on eurekabd.com.`}
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STATIC PAGES SEO */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-amber-600" /> স্টোরফ্রন্ট স্ট্যাটিক পেজ মেটাডাটা
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              হোমপেজ, অ্যাটেলিয়ার স্টোরি, কন্টাক্ট এবং পলিসি পেজগুলোর মেটা টাইটেল ও স্কিমা পরিচালনা
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4">Page</th>
                  <th className="py-2.5 px-4">URL Route</th>
                  <th className="py-2.5 px-4">SEO Title</th>
                  <th className="py-2.5 px-4">Schema Type</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pageSeoList.map(page => (
                  <tr key={page.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-bold text-stone-900">{page.pageName}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">eurekabd.com{page.path}</td>
                    <td className="py-3 px-4 font-medium text-stone-800 max-w-xs truncate">{page.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-700 font-mono text-[10px]">
                        {page.schemaType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const newTitle = prompt('Edit SEO Title for ' + page.pageName, page.title);
                          if (newTitle) {
                            updatePageSeo({ ...page, title: newTitle }, currentAdmin.name);
                          }
                        }}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-semibold text-xs transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AI SEO ASSISTANT */}
      {activeTab === 'ai-assistant' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-600" /> AI Content & SEO Optimization Generator
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                নির্বাচিত প্রোডাক্টের জন্য এক ক্লিকে ক্লিক-ওর্দি টাইটেল, মেটা ডেসক্রিপশন, ফোকাস কিওয়ার্ড ও এফএকিউ স্কিমা জেনারেট করুন।
              </p>
            </div>
            <button
              onClick={runAiOptimization}
              disabled={aiGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-xs disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${aiGenerating ? 'animate-spin' : ''}`} />
              {aiGenerating ? 'Generating with AI...' : `Optimize for "${selectedProduct?.name}"`}
            </button>
          </div>

          {aiGeneratedResult ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="text-xs font-bold text-amber-950">AI রিকমেন্ডেশন তৈরি সম্পন্ন</h3>
                    <p className="text-[11px] text-amber-800">
                      গুগল সার্চ ও সোশ্যাল মিডিয়া অর্গানিক সি-টি-আর (CTR) বৃদ্ধির জন্য অপ্টিমাইজড।
                    </p>
                  </div>
                </div>
                <button
                  onClick={applyAiResultToProduct}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition shadow-xs"
                >
                  প্রোডাক্টে প্রয়োগ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                {/* Proposed Title & Description */}
                <div className="space-y-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">AI জেনারেটেড টাইটেল</label>
                    <p className="p-3 bg-white rounded-lg border border-stone-200 text-stone-900 font-semibold">
                      {aiGeneratedResult.title}
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">AI জেনারেটেড মেটা ডেসক্রিপশন</label>
                    <p className="p-3 bg-white rounded-lg border border-stone-200 text-stone-700 leading-relaxed">
                      {aiGeneratedResult.description}
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">ফোকাস কিওয়ার্ড</label>
                    <p className="p-3 bg-white rounded-lg border border-stone-200 text-amber-800 font-bold font-mono">
                      {aiGeneratedResult.focusKeyword}
                    </p>
                  </div>
                </div>

                {/* Structured FAQs */}
                <div className="space-y-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800">Generated Product FAQs (JSON-LD Schema)</label>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded">
                      FAQPage Schema
                    </span>
                  </div>

                  <div className="space-y-3">
                    {aiGeneratedResult.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                        <p className="font-bold text-stone-900">Q: {faq.question}</p>
                        <p className="text-stone-600 text-[11px] leading-relaxed">A: {faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Bot className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-sm font-semibold text-stone-600">
                "{selectedProduct?.name}" এর জন্য এআই অপ্টিমাইজড মেটাডাটা ও কিওয়ার্ড তৈরি করতে উপরের বাটনে চাপ দিন।
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
