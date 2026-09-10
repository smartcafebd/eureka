import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BusinessSettings, HeroDesignConfig, SlideItem, PromoBanner } from '../../types';
import { ImageUploadBox } from '../common/ImageUploadBox';
import { EurekaLogo } from '../EurekaLogo';
import { AdminCategories } from './AdminCategories';
import {
  Settings,
  Shield,
  History as HistoryIcon,
  Building,
  Truck,
  CheckCircle,
  Save,
  Users,
  Palette,
  Image as ImageIcon,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AdminSettingsProps {
  initialTab?: 'brand' | 'hero' | 'categories' | 'delivery' | 'roles' | 'audit';
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ initialTab = 'brand' }) => {
  const {
    businessSettings,
    updateBusinessSettings,
    heroSlides,
    heroDesign,
    promoBanners,
    saveHeroSlide,
    deleteHeroSlide,
    updateHeroDesign,
    updatePromoBanners,
    resetVisualDefaults,
    adminUsers,
    systemAuditLogs,
    currentAdmin,
    categories,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'brand' | 'hero' | 'categories' | 'delivery' | 'roles' | 'audit'>(initialTab);
  const [savedNotice, setSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Settings updated successfully!');

  // Sync tab if initialTab changes from parent
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const showNotification = (msg: string) => {
    setNoticeMessage(msg);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  // ----------------------------------------------------
  // BRAND & LOGO FORM STATE
  // ----------------------------------------------------
  const [storeName, setStoreName] = useState(businessSettings.storeName || 'Snap Leather / Eureka');
  const [tagline, setTagline] = useState(businessSettings.tagline || '100% Genuine Leather Handcrafted Footwear');
  const [phone, setPhone] = useState(businessSettings.phone || '+880 1711-000000');
  const [email, setEmail] = useState(businessSettings.email || 'support@snapleather.com');
  const [whatsapp, setWhatsapp] = useState(businessSettings.whatsappNumber || '+8801711000000');
  const [address, setAddress] = useState(businessSettings.address || 'House 14, Road 7, Sector 3, Uttara, Dhaka-1230');
  const [bannerNotice, setBannerNotice] = useState(businessSettings.topBannerNotice || '');
  const [logoUrl, setLogoUrl] = useState(businessSettings.logoUrl || '');
  const [logoWhiteUrl, setLogoWhiteUrl] = useState(businessSettings.logoWhiteUrl || '');
  const [logoHeight, setLogoHeight] = useState(businessSettings.logoHeight || 38);
  const [logoAnimation, setLogoAnimation] = useState<'shimmer' | 'float' | 'pulse' | 'glow' | 'none'>(businessSettings.logoAnimation || 'shimmer');

  // ----------------------------------------------------
  // DELIVERY CHARGES
  // ----------------------------------------------------
  const [insideDhaka, setInsideDhaka] = useState(businessSettings.deliveryChargeInsideDhaka ?? 70);
  const [subDhaka, setSubDhaka] = useState(businessSettings.deliveryChargeSubDhaka ?? 100);
  const [outsideDhaka, setOutsideDhaka] = useState(businessSettings.deliveryChargeOutsideDhaka ?? 130);
  const [freeThreshold, setFreeThreshold] = useState(businessSettings.freeDeliveryThreshold ?? 5000);
  const [returnDays, setReturnDays] = useState(businessSettings.returnWindowDays ?? 7);

  // ----------------------------------------------------
  // TRACKING PIXELS
  // ----------------------------------------------------
  const [fbPixel, setFbPixel] = useState(businessSettings.facebookPixelId || '');
  const [gaId, setGaId] = useState(businessSettings.googleAnalyticsId || '');

  // ----------------------------------------------------
  // ERP ENTRY PASSWORD
  // ----------------------------------------------------
  const [erpPasswordInput, setErpPasswordInput] = useState(businessSettings.erpPassword || 'admin123');
  const [showErpPassword, setShowErpPassword] = useState(false);

  useEffect(() => {
    if (businessSettings.erpPassword) {
      setErpPasswordInput(businessSettings.erpPassword);
    }
  }, [businessSettings.erpPassword]);

  // ----------------------------------------------------
  // HERO DESIGN STATE
  // ----------------------------------------------------
  const [designForm, setDesignForm] = useState<HeroDesignConfig>({
    layoutStyle: heroDesign?.layoutStyle || 'split',
    bannerHeight: heroDesign?.bannerHeight || 'standard',
    overlayOpacity: heroDesign?.overlayOpacity ?? 75,
    showBadges: heroDesign?.showBadges ?? true,
    showPreviewCard: heroDesign?.showPreviewCard ?? true,
    autoSlideInterval: heroDesign?.autoSlideInterval ?? 6,
  });

  // ----------------------------------------------------
  // HERO SLIDE MODAL STATE
  // ----------------------------------------------------
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideTag, setSlideTag] = useState('');
  const [slideHighlight, setSlideHighlight] = useState('');
  const [slideDiscountBadge, setSlideDiscountBadge] = useState('');
  const [slideButtonText, setSlideButtonText] = useState('SHOP COLLECTION');
  const [slideImage, setSlideImage] = useState('');
  const [slideGradient, setSlideGradient] = useState('from-stone-950 via-stone-900 to-stone-950');
  const [slideLink, setSlideLink] = useState('Casual Shoes');
  const [slideEnabled, setSlideEnabled] = useState(true);

  // ----------------------------------------------------
  // PROMO BANNERS EDIT STATE
  // ----------------------------------------------------
  const [promoList, setPromoList] = useState<PromoBanner[]>(promoBanners || []);

  useEffect(() => {
    if (promoBanners) setPromoList(promoBanners);
  }, [promoBanners]);

  // Handle Save Brand & Logo
  const handleSaveBrandSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BusinessSettings = {
      ...businessSettings,
      storeName,
      tagline,
      phone,
      email,
      whatsappNumber: whatsapp,
      address,
      topBannerNotice: bannerNotice,
      logoUrl,
      logoWhiteUrl,
      logoHeight: Number(logoHeight),
      logoAnimation,
      deliveryChargeInsideDhaka: insideDhaka,
      deliveryChargeSubDhaka: subDhaka,
      deliveryChargeOutsideDhaka: outsideDhaka,
      freeDeliveryThreshold: freeThreshold,
      returnWindowDays: returnDays,
      facebookPixelId: fbPixel,
      googleAnalyticsId: gaId,
    };

    updateBusinessSettings(updated, currentAdmin.name);
    showNotification('সাইটের লোগো ও ব্র্যান্ড প্রোফাইল সফলভাবে আপডেট হয়েছে!');
  };

  // Handle Save Hero Design
  const handleSaveHeroDesign = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroDesign(designForm, currentAdmin.name);
    showNotification('হিরো ব্যানারের ডিজাইন সেটিংস সফলভাবে সেভ হয়েছে!');
  };

  // Open Slide Modal for New
  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideTitle('প্রিমিয়াম হ্যান্ডক্রাফটেড খাঁটি চামড়ার জুতো');
    setSlideSubtitle('অভিজ্ঞ কারিগরদের নিখুঁত হাতে তৈরি ১০০% জেনুইন লেদার জুতো। সারাদিন হাঁটায় আরাম ও নিখুঁত আভিজাত্য।');
    setSlideTag('NEW ARRIVAL 2026');
    setSlideHighlight('100% Genuine Leather Guarantee');
    setSlideDiscountBadge('UP TO 40% OFF');
    setSlideButtonText('SHOP COLLECTION');
    setSlideImage('https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80');
    setSlideGradient('from-stone-950 via-stone-900 to-stone-950');
    setSlideLink('Casual Shoes');
    setSlideEnabled(true);
    setIsSlideModalOpen(true);
  };

  // Open Slide Modal for Edit
  const handleOpenEditSlide = (slide: SlideItem) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle);
    setSlideTag(slide.tag);
    setSlideHighlight(slide.highlightText);
    setSlideDiscountBadge(slide.discountBadge);
    setSlideButtonText(slide.buttonText || 'SHOP COLLECTION');
    setSlideImage(slide.image);
    setSlideGradient(slide.bgGradient || 'from-stone-950 via-stone-900 to-stone-950');
    setSlideLink(slide.link?.replace('#', '') || 'Casual Shoes');
    setSlideEnabled(slide.enabled !== false);
    setIsSlideModalOpen(true);
  };

  // Save Slide
  const handleSaveSlideForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImage) {
      alert('অনুগ্রহ করে ব্যানারের একটি ছবি আপলোড করুন অথবা লিংক দিন।');
      return;
    }

    const slideToSave: SlideItem = {
      id: editingSlide ? editingSlide.id : `slide-${Date.now()}`,
      title: slideTitle,
      subtitle: slideSubtitle,
      tag: slideTag,
      highlightText: slideHighlight,
      discountBadge: slideDiscountBadge,
      buttonText: slideButtonText,
      image: slideImage,
      bgGradient: slideGradient,
      link: slideLink.startsWith('#') ? slideLink : `#${slideLink}`,
      enabled: slideEnabled,
    };

    saveHeroSlide(slideToSave, currentAdmin.name);
    setIsSlideModalOpen(false);
    showNotification(editingSlide ? 'ব্যানার স্লাইড সফলভাবে এডিট হয়েছে!' : 'নতুন ব্যানার স্লাইড যুক্ত হয়েছে!');
  };

  // Handle Promo Banner Update
  const handleSavePromoBanners = () => {
    updatePromoBanners(promoList, currentAdmin.name);
    showNotification('প্রোমোশনাল ব্যানার অ্যাড সফলভাবে সেভ হয়েছে!');
  };

  const updatePromoItem = (index: number, field: keyof PromoBanner, val: any) => {
    setPromoList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      updatePromoBanners(copy, currentAdmin.name);
      return copy;
    });
  };

  // Gradient options for hero banners
  const gradientPresets = [
    { label: 'Obsidian Black', value: 'from-stone-950 via-stone-900 to-stone-950' },
    { label: 'Deep Burgundy Red', value: 'from-[#2b0d0e] via-[#1a0809] to-stone-950' },
    { label: 'Warm Saddle Leather', value: 'from-[#2a1711] via-[#1a0d09] to-stone-950' },
    { label: 'Midnight Navy Blue', value: 'from-[#0d161f] via-[#090e14] to-stone-950' },
    { label: 'Forest Deep Green', value: 'from-[#0b1b14] via-[#07110c] to-stone-950' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600" /> সাইট ব্র্যান্ডিং, হিরো ব্যানার ও সিস্টেম কন্ট্রোল
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সাইটের লোগো পরিবর্তন (PNG), হিরো ব্যানার ইমেজ ও ডিজাইন এডিট, ডেলিভারি চার্জ এবং সিকিউরিটি অডিট।
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> {noticeMessage}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 gap-2 sm:gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('brand')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'brand'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4" /> ব্র্যান্ড ও সাইট লোগো (PNG)
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'hero'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Palette className="w-4 h-4" /> হিরো ব্যানার ও ডিজাইন এডিটর
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'categories'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers className="w-4 h-4" /> ক্যাটাগরি ছবি ও কভার ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'delivery'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Truck className="w-4 h-4" /> ডেলিভারি চার্জ ও পলিসি
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'roles'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" /> অ্যাডমিন অ্যাক্সেস & RBAC ({adminUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <HistoryIcon className="w-4 h-4" /> সিকিউরিটি অডিট লগ ({systemAuditLogs.length})
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: BRAND PROFILE & LOGO UPLOAD (PNG) */}
      {/* ==================================================== */}
      {activeTab === 'brand' && (
        <form onSubmit={handleSaveBrandSettings} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8 text-xs">
          {/* Logo Management Section */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" /> সাইটের লোগো পরিবর্তন (PNG ফাইল আপলোড)
                </h3>
                {(logoUrl || logoWhiteUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrl('');
                      setLogoWhiteUrl('');
                      setLogoHeight(38);
                    }}
                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> ডিফল্ট লোগোতে ফিরুন
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                স্বচ্ছ ব্যাকগ্রাউন্ডসহ পিএনজি (Transparent PNG) ফাইল আপলোড করলে সাইটের হেডার, ফুটার ও ইনভয়েসে সবচেয়ে সুন্দর দেখাবে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Logo Upload */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <ImageUploadBox
                  label="১. প্রাইমারি সাইট লোগো (Header & Invoice)"
                  value={logoUrl}
                  onChange={(val) => {
                    setLogoUrl(val);
                    updateBusinessSettings({ ...businessSettings, logoUrl: val }, currentAdmin.name);
                    showNotification('সাইট লোগো সফলভাবে সেভ হয়েছে!');
                  }}
                  aspectHint="প্রস্তাবিত: Transparent PNG (যেমন eureka-logo.png)"
                  recommendedDimensions="উচ্চতা: ৩০–৫০ পিক্সেল"
                />
              </div>

              {/* White Logo Upload for Dark Footer/Drawer */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <ImageUploadBox
                  label="২. হোয়াইট লোগো (Footer & Dark Background)"
                  value={logoWhiteUrl}
                  onChange={(val) => {
                    setLogoWhiteUrl(val);
                    updateBusinessSettings({ ...businessSettings, logoWhiteUrl: val }, currentAdmin.name);
                    showNotification('হোয়াইট লোগো সফলভাবে সেভ হয়েছে!');
                  }}
                  aspectHint="ডার্ক ব্যাকগ্রাউন্ডের জন্য সাদা রঙের লোগো (PNG)"
                  recommendedDimensions="উচ্চতা: ৩০–৫০ পিক্সেল"
                />
              </div>
            </div>

            {/* Logo Height Control & Live Previews */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="font-semibold text-gray-800">লোগোর ডিসপ্লে সাইজ (Display Height):</label>
                  <span className="ml-2 font-mono font-bold text-amber-700">{logoHeight}px</span>
                  <span className="text-xs text-gray-400 block sm:inline sm:ml-2">
                    (হেডার ও ফোটার উভয় স্থানেই এটি প্রযোজ্য হবে)
                  </span>
                </div>
                <input
                  type="range"
                  min="28"
                  max="96"
                  value={logoHeight}
                  onChange={(e) => setLogoHeight(Number(e.target.value))}
                  className="w-full sm:w-64 accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Logo Animation Selector */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      লোগো অ্যানিমেশন এফেক্ট (Logo Animation):
                    </label>
                    <p className="text-xs text-gray-500">
                      ওয়েবসাইটে ব্র্যান্ড লোগো আকর্ষণীয় ও দৃষ্টিনন্দন দেখাতে অ্যানিমেশন এফেক্ট নির্বাচন করুন
                    </p>
                  </div>
                  <select
                    value={logoAnimation}
                    onChange={(e) => setLogoAnimation(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="shimmer">✨ লাক্সারি শিমার রশ্মি (Shimmer Ray) - রিকমেন্ডেড</option>
                    <option value="float">🎈 জেন্টল ফ্লোটিং (Gentle Float)</option>
                    <option value="pulse">💓 স্মুথ পালস (Smooth Breathe)</option>
                    <option value="glow">🔥 অ্যাম্বিয়েন্ট গ্লো (Ambient Glow)</option>
                    <option value="none">⏹️ কোনো অ্যানিমেশন নেই (None)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Light Background Preview */}
                <div className="p-4 bg-white border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      লাইট ব্যাকগ্রাউন্ডে প্রিভিউ (Main Header)
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
                      কার্সার হোভার করে দেখুন
                    </span>
                  </div>
                  <div className="h-24 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200 p-2 overflow-hidden">
                    <EurekaLogo
                      variant="red"
                      animationType={logoAnimation}
                    />
                  </div>
                </div>

                {/* Dark Background Preview */}
                <div className="p-4 bg-stone-900 border border-stone-800 rounded-lg text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                      ডার্ক ব্যাকগ্রাউন্ডে প্রিভিউ (Footer & Mobile Menu)
                    </span>
                    <span className="text-[10px] text-amber-400 bg-stone-800 px-2 py-0.5 rounded font-mono">
                      কার্সার হোভার করে দেখুন
                    </span>
                  </div>
                  <div className="h-24 flex items-center justify-center bg-stone-950 rounded border border-dashed border-stone-800 p-2 overflow-hidden">
                    <EurekaLogo
                      variant="white"
                      animationType={logoAnimation}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Info & Contacts */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b">স্টোর আইডেন্টিটি ও কাস্টমার সাপোর্ট কন্টাক্ট</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">স্টোর / ব্র্যান্ড নাম</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">ব্র্যান্ড ট্যাগলাইন</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">কাস্টমার কেয়ার হটলাইন ফোন</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">অফিসিয়াল হোয়াটসঅ্যাপ নাম্বার</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">অফিসিয়াল ইমেইল অ্যাড্রেস</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">সাইটের টপ নোটিশ বার মেসেজ</label>
                <input
                  type="text"
                  value={bannerNotice}
                  onChange={(e) => setBannerNotice(e.target.value)}
                  placeholder="যেমন: ৩০০০ টাকার অর্ডারে সারা দেশে ফ্রি হোম ডেলিভারি!"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">ফ্যাক্টরি ও শোরুমের পূর্ণ ঠিকানা</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Tracking Pixels */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b">ডিজিটাল মার্কেটিং ও ট্র্যাকিং পিক্সেল</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={fbPixel}
                  onChange={(e) => setFbPixel(e.target.value)}
                  placeholder="যেমন: 198273645019283"
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Google Analytics Measurement ID</label>
                <input
                  type="text"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  placeholder="যেমন: G-XXXXXXX"
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer transition"
            >
              <Save className="w-4 h-4" /> সাইট লোগো ও ব্র্যান্ড সেটিংস সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* ==================================================== */}
      {/* TAB 2: HERO BANNER & DESIGN CMS */}
      {/* ==================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-8 text-xs">
          {/* 1. Hero Banner Global Design Settings */}
          <form onSubmit={handleSaveHeroDesign} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-600" /> ১. হিরো ব্যানারের ডিজাইন ও লেআউট কনফিগারেশন
                </h3>
                <p className="text-[11px] text-gray-500">
                  হিরো ব্যানারের প্রদর্শন লেআউট, উচ্চতা, ডার্ক ওভারলে ও অটো-স্লাইড টাইমার পরিবর্তন করুন।
                </p>
              </div>

              <button
                type="submit"
                className="self-start sm:self-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> ডিজাইন সেভ করুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Layout Style */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">লেআউট স্টাইল (Layout Style)</label>
                <select
                  value={designForm.layoutStyle}
                  onChange={(e) => setDesignForm({ ...designForm, layoutStyle: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg font-medium bg-white"
                >
                  <option value="split">Split Grid (লেখা + থ্রিডি প্রোডাক্ট কার্ড)</option>
                  <option value="centered">Centered (মাঝখানে কেন্দ্রিক এলিগ্যান্ট)</option>
                  <option value="fullwidth">Cinematic Fullwidth (বড় ব্যানার)</option>
                  <option value="minimal">Minimal Compact (কমপ্যাক্ট আধুনিক)</option>
                </select>
                <span className="text-[10px] text-gray-400 block mt-1">হোমপেজের ব্যানার কিভাবে সাজানো হবে</span>
              </div>

              {/* Banner Height */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">ব্যানারের উচ্চতা (Banner Height)</label>
                <select
                  value={designForm.bannerHeight}
                  onChange={(e) => setDesignForm({ ...designForm, bannerHeight: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg font-medium bg-white"
                >
                  <option value="compact">Compact (কমপ্যাক্ট - 400px)</option>
                  <option value="standard">Standard (স্ট্যান্ডার্ড - 480px)</option>
                  <option value="large">Large Hero (লার্জ সিনেমাটিক - 560px)</option>
                </select>
                <span className="text-[10px] text-gray-400 block mt-1">স্ক্রিনে ব্যানারটি কতটুকু জায়গা নেবে</span>
              </div>

              {/* Auto Slide Interval */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">অটো স্লাইড রোটেশন টাইমার</label>
                <select
                  value={designForm.autoSlideInterval}
                  onChange={(e) => setDesignForm({ ...designForm, autoSlideInterval: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg font-medium bg-white"
                >
                  <option value="0">অটো-স্লাইড বন্ধ (Manual Only)</option>
                  <option value="4">প্রতি ৪ সেকেন্ড পর পর</option>
                  <option value="6">প্রতি ৬ সেকেন্ড পর পর (স্ট্যান্ডার্ড)</option>
                  <option value="8">প্রতি ৮ সেকেন্ড পর পর</option>
                  <option value="12">প্রতি ১২ সেকেন্ড পর পর</option>
                </select>
                <span className="text-[10px] text-gray-400 block mt-1">কয়েক সেকেন্ড পরপর স্বয়ংক্রিয়ভাবে স্লাইড পাল্টাবে</span>
              </div>

              {/* Dark Overlay Opacity */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">ডার্ক গ্রেডিয়েন্ট ওভারলে ঘনত্ব</label>
                  <span className="font-mono font-bold text-amber-600">{designForm.overlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={designForm.overlayOpacity}
                  onChange={(e) => setDesignForm({ ...designForm, overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 block mt-1">টেক্সট স্পষ্ট পড়ার জন্য ব্যাকগ্রাউন্ডের কালো ভাব</span>
              </div>

              {/* Toggle Badges */}
              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="showBadges"
                  checked={designForm.showBadges}
                  onChange={(e) => setDesignForm({ ...designForm, showBadges: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="showBadges" className="font-semibold text-gray-700 cursor-pointer">
                  হাইলাইট ব্যাজ প্রদর্শন করুন (যেমন: 100% Genuine, OFF Badge)
                </label>
              </div>

              {/* Toggle Preview Card */}
              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="showPreviewCard"
                  checked={designForm.showPreviewCard}
                  onChange={(e) => setDesignForm({ ...designForm, showPreviewCard: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="showPreviewCard" className="font-semibold text-gray-700 cursor-pointer">
                  ডানপাশের থ্রিডি প্রোডাক্ট কার্ড শো করুন (Split Layout-এ)
                </label>
              </div>
            </div>
          </form>

          {/* 2. Hero Banner Slides Management */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" /> ২. ব্যানার স্লাইড ও ছবির তালিকা ({heroSlides.length} টি স্লাইড)
                </h3>
                <p className="text-[11px] text-gray-500">
                  নতুন ব্যানার তৈরি করুন, যে কোনো ছবি আপলোড করুন অথবা লেখা পরিবর্তন করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('আপনি কি নিশ্চিত যে হিরো ব্যানারগুলো ডিফল্ট ডিজাইনে ফিরিয়ে নিতে চান?')) {
                      resetVisualDefaults(currentAdmin.name);
                      showNotification('ভিজুয়াল সেটিংস ডিফল্টে রিসেট হয়েছে!');
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> ডিফল্ট ব্যানার রিসেট
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddSlide}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> নতুন ব্যানার স্লাইড যোগ করুন
                </button>
              </div>
            </div>

            {/* Slide Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`rounded-xl border overflow-hidden transition-all flex flex-col justify-between ${
                    slide.enabled === false ? 'opacity-50 border-dashed border-gray-300 bg-gray-50' : 'border-gray-200 bg-white shadow-xs hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-16/9 w-full bg-black/20 overflow-hidden">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
                        #{idx + 1} {slide.enabled === false ? '(Hidden)' : '(Live)'}
                      </div>
                      {slide.discountBadge && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#b20000] text-white rounded text-[10px] font-bold">
                          {slide.discountBadge}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        {slide.tag || 'Slide Tag'}
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{slide.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{slide.subtitle}</p>

                      <div className="pt-2 flex flex-wrap gap-1">
                        {slide.highlightText && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium">
                            {slide.highlightText}
                          </span>
                        )}
                        <span className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded font-mono">
                          Link: {slide.link}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 border-t bg-stone-50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSlide(slide)}
                      className="px-2.5 py-1 text-amber-700 hover:bg-amber-100 rounded font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> এডিট করুন
                    </button>

                    {heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`আপনি কি এই স্লাইডটি ("${slide.title}") মুছে ফেলতে চান?`)) {
                            deleteHeroSlide(slide.id, currentAdmin.name);
                            showNotification('স্লাইড সফলভাবে মুছে ফেলা হয়েছে!');
                          }
                        }}
                        className="p-1 text-rose-600 hover:bg-rose-100 rounded cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Promo Feature Banners Editor */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" /> ৩. হোমপেজ প্রোমোশনাল ব্যানার গ্রিড (Promo Banners)
                </h3>
                <p className="text-[11px] text-gray-500">
                  হোমপেজের মাঝে প্রদর্শিত সাইকেল শু এবং আউটলেট ওয়ারেন্টির ২টি প্রমোশনাল অ্যাড ব্যানার পরিবর্তন করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={handleSavePromoBanners}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> প্রোমো ব্যানার সেভ করুন
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {promoList.map((banner, index) => (
                <div key={banner.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-800 text-xs">
                      ব্যানার #{index + 1}: {banner.title || 'Promo Banner'}
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={banner.enabled !== false}
                        onChange={(e) => updatePromoItem(index, 'enabled', e.target.checked)}
                        className="accent-amber-600 rounded"
                      />
                      <span>সক্রিয় (Active)</span>
                    </label>
                  </div>

                  {/* Banner Image Upload */}
                  <ImageUploadBox
                    label="ব্যানারের ব্যাকগ্রাউন্ড ছবি"
                    value={banner.bgImage}
                    onChange={(val) => updatePromoItem(index, 'bgImage', val)}
                    aspectHint="প্রস্তাবিত: Landscape 16:9 অথবা 800x450px"
                  />

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-gray-600 font-medium text-[11px] mb-1">হেডলাইন (Title)</label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => updatePromoItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-md bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-medium text-[11px] mb-1">সাবটাইটেল (Subtitle)</label>
                      <textarea
                        rows={2}
                        value={banner.subtitle}
                        onChange={(e) => updatePromoItem(index, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-md bg-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-600 font-medium text-[11px] mb-1">ট্যাগ ব্যাজ</label>
                        <input
                          type="text"
                          value={banner.badgeText || banner.tag}
                          onChange={(e) => updatePromoItem(index, 'badgeText', e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-md bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium text-[11px] mb-1">বাটন টেক্সট</label>
                        <input
                          type="text"
                          value={banner.buttonText}
                          onChange={(e) => updatePromoItem(index, 'buttonText', e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-md bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SLIDE ADD / EDIT MODAL */}
      {/* ==================================================== */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-500" />
                {editingSlide ? 'হিরো ব্যানার স্লাইড এডিট করুন' : 'নতুন হিরো ব্যানার স্লাইড তৈরি করুন'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlideForm} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Image Upload Box */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <ImageUploadBox
                  label="ব্যানারের প্রধান ছবি (Photo / Background Image)"
                  value={slideImage}
                  onChange={(val) => setSlideImage(val)}
                  aspectHint="প্রস্তাবিত মাপ: ১২০০ x ৬০০ পিক্সেল (JPG/PNG/WebP)"
                  recommendedDimensions="হাই রেজ্যুলুশন ব্যানার ছবি"
                />
              </div>

              {/* Title & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">ব্যানার শিরোনাম (Title) *</label>
                  <input
                    type="text"
                    required
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">টপ ট্যাগ ব্যাজ (Tag)</label>
                  <input
                    type="text"
                    value={slideTag}
                    onChange={(e) => setSlideTag(e.target.value)}
                    placeholder="যেমন: EID EXCLUSIVE 2026"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">বিস্তারিত বিবরণ (Subtitle)</label>
                <textarea
                  rows={2}
                  value={slideSubtitle}
                  onChange={(e) => setSlideSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Highlights & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">গ্যারান্টি ব্যাজ (Green Badge)</label>
                  <input
                    type="text"
                    value={slideHighlight}
                    onChange={(e) => setSlideHighlight(e.target.value)}
                    placeholder="যেমন: 100% Genuine Leather Guarantee"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">ডিসকাউন্ট ব্যাজ (Red Flame)</label>
                  <input
                    type="text"
                    value={slideDiscountBadge}
                    onChange={(e) => setSlideDiscountBadge(e.target.value)}
                    placeholder="যেমন: UP TO 35% OFF"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* CTA Button & Target Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">বাটন টেক্সট (CTA)</label>
                  <input
                    type="text"
                    value={slideButtonText}
                    onChange={(e) => setSlideButtonText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">বাটনে ক্লিক করলে যে ক্যাটাগরিতে যাবে</label>
                  <select
                    value={slideLink}
                    onChange={(e) => setSlideLink(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="all">সব প্রোডাক্ট (All Products)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Background Gradient */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">ডার্ক গ্রেডিয়েন্ট কালার স্কিম</label>
                <select
                  value={slideGradient}
                  onChange={(e) => setSlideGradient(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {gradientPresets.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="slideEnabled"
                  checked={slideEnabled}
                  onChange={(e) => setSlideEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="slideEnabled" className="font-semibold text-gray-700 cursor-pointer">
                  এই ব্যানারটি লাইভ স্টোরে প্রদর্শন করুন
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingSlide ? 'আপডেট সেভ করুন' : 'নতুন ব্যানার সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB: CATEGORIES & COVER IMAGES */}
      {/* ==================================================== */}
      {activeTab === 'categories' && (
        <AdminCategories isEmbedded />
      )}

      {/* ==================================================== */}
      {/* TAB 3: DELIVERY FEES */}
      {/* ==================================================== */}
      {activeTab === 'delivery' && (
        <form onSubmit={handleSaveBrandSettings} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b">কুরিয়ার শিপিং রেট ও ডেলিভারি নিয়মাবলি</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">ঢাকা সিটির ভেতরে (৳)</label>
                <input
                  type="number"
                  required
                  value={insideDhaka}
                  onChange={(e) => setInsideDhaka(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                />
                <span className="text-[10px] text-gray-500">হোম ডেলিভারি (২৪-৪৮ ঘণ্টার মধ্যে)</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">সাব-ঢাকা এলাকা (৳)</label>
                <input
                  type="number"
                  required
                  value={subDhaka}
                  onChange={(e) => setSubDhaka(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                />
                <span className="text-[10px] text-gray-500">গাজীপুর, সাভার, নারায়ণগঞ্জ, কেরানীগঞ্জ</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">ঢাকার বাইরে / সারা দেশ (৳)</label>
                <input
                  type="number"
                  required
                  value={outsideDhaka}
                  onChange={(e) => setOutsideDhaka(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                />
                <span className="text-[10px] text-gray-500">৬৪ জেলার কুরিয়ার ক্যাশ অন ডেলিভারি</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">ফ্রি ডেলিভারি কার্ট অ্যামাউন্ট (৳)</label>
                <input
                  type="number"
                  required
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold text-emerald-700"
                />
                <span className="text-[10px] text-gray-500">অর্ডারের পরিমাণ এই সীমার উপরে হলে ফ্রি ডেলিভারি</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">সাইজ এক্সচেঞ্জ পলিসি উইন্ডো (দিন)</label>
                <input
                  type="number"
                  required
                  value={returnDays}
                  onChange={(e) => setReturnDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                />
                <span className="text-[10px] text-gray-500">বিনা খরচে সাইজ পরিবর্তন করার সময়সীমা</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> ডেলিভারি নিয়মাবলি সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* ==================================================== */}
      {/* TAB 4: ADMIN USERS & ROLES */}
      {/* ==================================================== */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* ERP Master Password Card */}
          <div className="bg-white rounded-xl border border-amber-200/80 shadow-xs p-5 text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    ইআরপি মাস্টার পাসওয়ার্ড সিকিউরিটি (ERP Master Password)
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Active Gate</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    অ্যাডমিন ইআরপিতে প্রবেশের জন্য এই পাসওয়ার্ড দিয়ে ভেরিফাই করতে হয়। আপনি চাইলে এখান থেকেই পাসওয়ার্ডটি পরিবর্তন করতে পারেন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <input
                    type={showErpPassword ? 'text' : 'password'}
                    value={erpPasswordInput}
                    onChange={(e) => setErpPasswordInput(e.target.value)}
                    placeholder="মাস্টার পাসওয়ার্ড..."
                    className="w-44 px-3 py-2 pr-9 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowErpPassword(!showErpPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showErpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!erpPasswordInput.trim()) {
                      showNotification('অনুগ্রহ করে একটি পাসওয়ার্ড লিখুন!');
                      return;
                    }
                    updateBusinessSettings({
                      ...businessSettings,
                      erpPassword: erpPasswordInput.trim(),
                    }, currentAdmin.name);
                    showNotification('ইআরপি মাস্টার পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" /> পাসওয়ার্ড সেভ
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-gray-200 bg-stone-50 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-900">Admin Staff & Role-Based Access Matrix</h4>
                <p className="text-[11px] text-gray-500">Authorized personnel who can sign in to the /admin system.</p>
              </div>
            </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Admin Name</th>
                  <th className="py-3 px-4">Email / Login</th>
                  <th className="py-3 px-4">Role Tier</th>
                  <th className="py-3 px-4">Granular Permissions</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adminUsers.map((u) => {
                  const allowedPerms = u.permissions && typeof u.permissions === 'object'
                    ? Object.entries(u.permissions)
                        .filter(([_, val]) => Boolean(val))
                        .map(([k]) => k.replace('canManage', '').replace('can', ''))
                    : [];

                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">{u.name}</td>
                      <td className="py-3 px-4 font-mono text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'Super Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'Admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {allowedPerms.slice(0, 5).map((p, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-stone-100 rounded text-[9px] text-stone-700">
                              {p}
                            </span>
                          ))}
                          {allowedPerms.length > 5 && (
                            <span className="px-1.5 py-0.5 bg-stone-200 rounded text-[9px] text-stone-600 font-bold">
                              +{allowedPerms.length - 5}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{u.lastLogin || 'Recent'}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: SYSTEM AUDIT LOG */}
      {/* ==================================================== */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-gray-200 bg-stone-50 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-gray-900">System Activity Audit Log ({systemAuditLogs.length} events)</h4>
              <p className="text-[11px] text-gray-500">
                Immutable security log of product edits, visual banner updates, stock adjustments, and administrative changes.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Officer</th>
                  <th className="py-3 px-4">ERP Module</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Operational Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {systemAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="py-2.5 px-4 text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-900">{log.adminName}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-semibold text-[10px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-gray-800">{log.action}</td>
                    <td className="py-2.5 px-4 text-gray-600 max-w-md">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
