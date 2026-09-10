import React, { useState } from 'react';
import {
  X,
  Lock as LockIcon,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  Check,
  Image as ImageIcon,
  Palette,
  Package,
  Layers,
  RotateCcw,
  Search,
  Flame,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  Upload,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '../types';
import { STANDARD_PRODUCT_COLORS } from '../data/products';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onResetDefaults: () => void;
}

// Preset Curated Leather Shoe Images for quick 1-click selection
const PRESET_IMAGES = [
  { label: 'Casual Cycle Shoe Chocolate', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cycle Shoe Tan', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80' },
  { label: 'Black Penny Loafer', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tassel Loafer Chocolate', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
  { label: 'Oxford Dress Shoes', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
  { label: 'Leather Sandal Cross Strap', url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Artisan Tan Derby', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80' },
  { label: 'Monk Strap Boot', url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ankle Chelsea Boot', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
];

const PRESET_COLORS = [
  { name: 'ব্ল্যাক', hex: '#1a1a1a' },
  { name: 'চকলেট', hex: '#3e2316' },
  { name: 'মাস্টার', hex: '#c9932a' },
  { name: 'ট্যান', hex: '#d27d2d' },
  { name: 'নেভি ব্লু', hex: '#1b2a4a' },
  { name: 'বার্গান্ডি', hex: '#631326' },
  { name: 'অলিভ গ্রিন', hex: '#4a5d3f' },
  { name: 'হোয়াইট', hex: '#f0f0f0' },
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onUpdateProducts,
  onUpdateCategories,
  onResetDefaults,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('eureka_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Category Editing / Creation State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Notification Banner
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setBannerMsg({ type, text });
    setTimeout(() => setBannerMsg(null), 3500);
  };

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'password') {
      setIsAuthenticated(true);
      sessionStorage.setItem('eureka_admin_auth', 'true');
      setAuthError('');
      setPasswordInput('');
      showNotification('success', 'অ্যাডমিন প্যানেলে স্বাগতম!');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড: password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('eureka_admin_auth');
    setPasswordInput('');
  };

  if (!isOpen) return null;

  // ----------------------------------------------------
  // 1. LOGIN SCREEN IF NOT AUTHENTICATED
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 bg-red-50 text-[#e30613] rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-100">
              <LockIcon className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-gray-900">
              eureka Admin Portal
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              প্রোডাক্টের নাম, ছবি, ক্যাটাগরি, মূল্য ও কালার পরিবর্তনের জন্য অ্যাডমিন পাসওয়ার্ড দিন।
            </p>
            <div className="inline-block bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200">
              🔐 পাসওয়ার্ড: <span className="font-mono underline">password</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                অ্যাডমিন পাসওয়ার্ড (Admin Password):
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter 'password'"
                  autoFocus
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:bg-white focus:border-[#e30613] focus:ring-2 focus:ring-[#e30613]/20 outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#e30613] hover:bg-[#c20510] text-white font-heading font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Unlock className="w-4 h-4" />
              <span>লগইন ও অ্যাডমিন এক্সেস</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PRODUCT ACTIONS (ADD, EDIT, DELETE)
  // ----------------------------------------------------
  const handleSaveProduct = (prod: Product) => {
    const isExisting = products.some((p) => p.id === prod.id);
    let updated: Product[];
    if (isExisting) {
      updated = products.map((p) => (p.id === prod.id ? prod : p));
      showNotification('success', `"${prod.name}" সফলভাবে আপডেট হয়েছে!`);
    } else {
      updated = [prod, ...products];
      showNotification('success', `নতুন প্রোডাক্ট "${prod.name}" যুক্ত হয়েছে!`);
    }
    onUpdateProducts(updated);
    setEditingProduct(null);
    setIsCreatingProduct(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}" প্রোডাক্টটি ডিলিট করতে চান?`)) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      showNotification('success', `"${name}" ডিলিট করা হয়েছে!`);
    }
  };

  // ----------------------------------------------------
  // CATEGORY ACTIONS (ADD, EDIT, DELETE)
  // ----------------------------------------------------
  const handleSaveCategory = (cat: Category) => {
    const isExisting = categories.some((c) => c.id === cat.id);
    let updated: Category[];
    if (isExisting) {
      updated = categories.map((c) => (c.id === cat.id ? cat : c));
      showNotification('success', `ক্যাটাগরি "${cat.name}" আপডেট হয়েছে!`);
    } else {
      updated = [...categories, cat];
      showNotification('success', `নতুন ক্যাটাগরি "${cat.name}" তৈরি হয়েছে!`);
    }
    onUpdateCategories(updated);
    setEditingCategory(null);
    setIsCreatingCategory(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}" ক্যাটাগরি ডিলিট করতে চান?`)) {
      const updated = categories.filter((c) => c.id !== id);
      onUpdateCategories(updated);
      showNotification('success', `ক্যাটাগরি "${name}" ডিলিট করা হয়েছে!`);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#f8f9fa] rounded-2xl max-w-6xl w-full h-[94vh] flex flex-col shadow-2xl border border-gray-300 overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="bg-[#1a1a1a] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#e30613] rounded-lg flex items-center justify-center font-black text-white text-lg">
              e
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  eureka Control Center (অ্যাডমিন প্যানেল)
                </h2>
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">
                  Live Admin
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                প্রোডাক্ট, ক্যাটাগরি, ফটো, দাম ও কালার লাইভ এডিটর
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (window.confirm('সবকিছু ফ্যাক্টরি ডিফল্ট ডাটাতে রিসেট করতে চান? আপনার কাস্টম এডিট মুছে যাবে।')) {
                  onResetDefaults();
                  showNotification('success', 'ফ্যাক্টরি ডিফল্ট ডাটা রিস্টোর করা হয়েছে!');
                }
              }}
              title="Reset to factory products & categories"
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ফ্যাক্টরি রিসেট</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-red-800/50"
            >
              <LockIcon className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Global Notification Toast in Admin */}
        {bannerMsg && (
          <div
            className={`px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 transition-all ${
              bannerMsg.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{bannerMsg.text}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 px-5 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('products');
                setEditingProduct(null);
                setIsCreatingProduct(false);
              }}
              className={`py-3 px-4 font-heading font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'border-[#e30613] text-[#e30613] bg-red-50/40'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>প্রোডাক্ট ম্যানেজমেন্ট</span>
              <span className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setEditingCategory(null);
                setIsCreatingCategory(false);
              }}
              className={`py-3 px-4 font-heading font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'border-[#e30613] text-[#e30613] bg-red-50/40'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>ক্যাটাগরি ও ফটোস</span>
              <span className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full font-mono">
                {categories.length}
              </span>
            </button>
          </div>

          {/* Create Button depending on tab */}
          <div>
            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setIsCreatingProduct(true);
                  setEditingProduct(null);
                }}
                className="my-2 px-3.5 py-1.5 bg-[#e30613] hover:bg-[#c20510] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন প্রোডাক্ট যোগ করুন</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => {
                  setIsCreatingCategory(true);
                  setEditingCategory(null);
                }}
                className="my-2 px-3.5 py-1.5 bg-[#e30613] hover:bg-[#c20510] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ক্যাটাগরি তৈরি করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              {/* Product Editor Modal Form */}
              {(editingProduct || isCreatingProduct) && (
                <ProductEditorForm
                  initialProduct={
                    editingProduct || {
                      id: `rk-${Date.now().toString().slice(-4)}`,
                      name: '',
                      category: categories[0]?.name || 'Casual Shoes',
                      subCategory: '',
                      gender: 'men',
                      price: 2450,
                      originalPrice: 3850,
                      rating: 4.9,
                      reviewCount: 25,
                      images: [
                        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
                      ],
                      isHotDeal: true,
                      isFeatured: true,
                      isBestSeller: false,
                      badge: 'HOT DEAL',
                      description: 'হ্যান্ডক্রাফটেড ১০০% খাঁটি চামড়ার প্রিমিয়াম জুতো। সারাদিন ব্যবহারের জন্য আরামদায়ক ও টেকসই সোল।',
                      materials: '100% Genuine Full Grain Leather Upper, High-grade Rubber Outsole',
                      sizes: [39, 40, 41, 42, 43, 44],
                      colors: STANDARD_PRODUCT_COLORS,
                      stockCount: 15,
                      sku: `RK-${Math.floor(100 + Math.random() * 900)}`,
                    }
                  }
                  categories={categories}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                />
              )}

              {/* Product Filter Strip */}
              {!editingProduct && !isCreatingProduct && (
                <div className="space-y-4">
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="প্রোডাক্ট নাম, ক্যাটাগরি বা SKU দিয়ে সার্চ করুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#e30613]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-semibold">ক্যাটাগরি:</span>
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 font-medium outline-none focus:border-[#e30613]"
                      >
                        <option value="all">সব ক্যাটাগরি ({products.length})</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Products Grid/Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                      const discountPct = product.originalPrice > product.price
                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                        : 0;

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-xl border border-gray-200 hover:border-gray-400 p-4 shadow-xs flex flex-col justify-between transition-all"
                        >
                          <div className="space-y-3">
                            {/* Product Header & Images */}
                            <div className="flex items-start gap-3">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-20 h-20 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#e30613] bg-red-50 px-2 py-0.5 rounded">
                                    {product.category}
                                  </span>
                                  {product.isHotDeal && (
                                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                      <Flame className="w-3 h-3 text-amber-600" />
                                      Hot
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-heading font-bold text-sm text-gray-900 line-clamp-2 mt-1">
                                  {product.name}
                                </h4>
                                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                                  SKU: {product.sku}
                                </p>
                              </div>
                            </div>

                            {/* Pricing & Discount */}
                            <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg text-xs">
                              <div>
                                <span className="text-gray-500 text-[10px] block">বিক্রয় মূল্য:</span>
                                <span className="font-bold text-[#e30613] font-mono text-sm">
                                  {product.price.toLocaleString()} ৳
                                </span>
                              </div>
                              {product.originalPrice > product.price && (
                                <div className="text-right">
                                  <span className="text-gray-400 line-through font-mono block text-[11px]">
                                    {product.originalPrice.toLocaleString()} ৳
                                  </span>
                                  <span className="text-green-700 font-bold text-[10px]">
                                    -{discountPct}% অফ
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Colors & Sizes Swatches */}
                            <div className="space-y-1.5 text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500 font-medium">কালার:</span>
                                <div className="flex items-center gap-1">
                                  {product.colors.map((col, i) => (
                                    <span
                                      key={i}
                                      className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block"
                                      style={{ backgroundColor: col.hex }}
                                      title={col.name}
                                    />
                                  ))}
                                  <span className="text-[10px] text-gray-400">
                                    ({product.colors.map((c) => c.name).join(', ')})
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500 font-medium">সাইজ:</span>
                                <span className="text-gray-700 font-mono">
                                  {product.sizes.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsCreatingProduct(false);
                              }}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-[#e30613] hover:text-white text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>এডিট করুন</span>
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-700">কোন প্রোডাক্ট খুঁজে পাওয়া যায়নি!</p>
                      <p className="text-xs text-gray-400 mt-1">
                        অন্য কিওয়ার্ড দিয়ে সার্চ করুন অথবা নতুন প্রোডাক্ট যুক্ত করুন।
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && (
            <div>
              {/* Category Editor Form */}
              {(editingCategory || isCreatingCategory) && (
                <CategoryEditorForm
                  initialCategory={
                    editingCategory || {
                      id: `cat-${Date.now().toString().slice(-4)}`,
                      name: '',
                      slug: '',
                      image:
                        'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=85',
                      featured: true,
                    }
                  }
                  onSave={handleSaveCategory}
                  onCancel={() => {
                    setEditingCategory(null);
                    setIsCreatingCategory(false);
                  }}
                />
              )}

              {/* Categories Cards List */}
              {!editingCategory && !isCreatingCategory && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs flex items-center justify-between">
                    <span>
                      💡 <strong>টিপস:</strong> আপনি যেকোনো ক্যাটাগরির নাম, ছবি বা নতুন ক্যাটাগরি তৈরি করলে তা সাথে সাথে ওয়েবসাইটের হোমপেজের POPULAR CATEGORIES ও নেভিগেশনে আপডেট হয়ে যাবে।
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => {
                      const associatedCount = products.filter(
                        (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                      ).length;

                      return (
                        <div
                          key={cat.id}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="aspect-[4/3] relative bg-gray-900 overflow-hidden">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-3 left-3 right-3 text-white">
                                <h4 className="font-heading font-extrabold text-base leading-tight">
                                  {cat.name}
                                </h4>
                                <span className="text-[10px] text-gray-300 font-mono">
                                  /{cat.slug} • {associatedCount} টি প্রোডাক্ট
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setIsCreatingCategory(false);
                              }}
                              className="px-3 py-1.5 bg-white border border-gray-300 hover:border-[#e30613] hover:text-[#e30613] text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>ছবি ও নাম পরিবর্তন</span>
                            </button>

                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------
// PRODUCT EDITOR FORM COMPONENT
// ----------------------------------------------------
interface ProductEditorFormProps {
  initialProduct: Product;
  categories: Category[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditorForm: React.FC<ProductEditorFormProps> = ({
  initialProduct,
  categories,
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState<Product>(initialProduct);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1a1a1a');

  const handleAddImage = (urlToAdd?: string) => {
    const target = urlToAdd || newImageUrl.trim();
    if (target) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, target],
      }));
      if (!urlToAdd) setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddColor = (preset?: { name: string; hex: string }) => {
    const toAdd = preset || { name: newColorName.trim(), hex: newColorHex };
    if (toAdd.name && toAdd.hex) {
      if (!form.colors.some((c) => c.name.toLowerCase() === toAdd.name.toLowerCase())) {
        setForm((prev) => ({
          ...prev,
          colors: [...prev.colors, toAdd],
        }));
      }
      if (!preset) {
        setNewColorName('');
      }
    }
  };

  const handleRemoveColor = (name: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.name !== name),
    }));
  };

  const handleToggleSize = (sizeNum: number) => {
    setForm((prev) => {
      const exists = prev.sizes.includes(sizeNum);
      const nextSizes = exists
        ? prev.sizes.filter((s) => s !== sizeNum)
        : [...prev.sizes, sizeNum].sort((a, b) => a - b);
      return { ...prev, sizes: nextSizes };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('অনুগ্রহ করে প্রোডাক্টের নাম লিখুন');
      return;
    }
    if (form.images.length === 0) {
      alert('কমপক্ষে ১টি প্রোডাক্ট ইমেজ ইউআরএল যোগ করুন');
      return;
    }
    if (form.colors.length === 0) {
      alert('কমপক্ষে ১টি কালার সিলেক্ট করুন');
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-300 shadow-md space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-gray-900">
            {form.name ? `এডিট: ${form.name}` : 'নতুন প্রোডাক্ট যুক্ত করুন'}
          </h3>
          <p className="text-xs text-gray-500">প্রোডাক্টের নাম, মূল্য, ছবি ও কালারসমূহ কাস্টমাইজ করুন</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            বাতিল (Cancel)
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#e30613] hover:bg-[#c20510] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>প্রোডাক্ট সেভ করুন</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Core Details */}
        <div className="space-y-4">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              প্রোডাক্টের নাম (Product Name) *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Clark Cycle Shoes Dark Tan"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl outline-none focus:border-[#e30613]"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ক্যাটাগরি (Category) *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#e30613]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                সাব-ক্যাটাগরি (Subcategory)
              </label>
              <input
                type="text"
                value={form.subCategory || ''}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                placeholder="e.g. Cycle Shoes / Loafers"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl outline-none focus:border-[#e30613]"
              />
            </div>
          </div>

          {/* Pricing: Selling Price & Original Price */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">
                বিক্রয় মূল্য / অফার প্রাইস (৳) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm font-bold text-[#e30613] font-mono border border-gray-300 rounded-lg outline-none focus:border-[#e30613] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                নিয়মিত মূল্য / রেগুলার প্রাইস (৳)
              </label>
              <input
                type="number"
                min={0}
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg outline-none focus:border-[#e30613] bg-white"
              />
            </div>
          </div>

          {/* SKU, Stock & Hot Deal */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">SKU কোড</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">স্টক সংখ্যা</label>
              <input
                type="number"
                value={form.stockCount}
                onChange={(e) => setForm({ ...form, stockCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={form.isHotDeal}
                  onChange={(e) => setForm({ ...form, isHotDeal: e.target.checked })}
                  className="w-4 h-4 text-[#e30613] rounded focus:ring-0"
                />
                <span>হট ডিল সেল 🔥</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              প্রোডাক্টের বিবরণ (Description)
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#e30613]"
            />
          </div>

          {/* Materials */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              ম্যাটেরিয়াল ও চামড়ার বিস্তারিত
            </label>
            <input
              type="text"
              value={form.materials}
              onChange={(e) => setForm({ ...form, materials: e.target.value })}
              placeholder="100% Genuine Full Grain Leather..."
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#e30613]"
            />
          </div>

        </div>

        {/* Right Column: Images, Colors & Sizes */}
        <div className="space-y-5">
          
          {/* PRODUCT IMAGES SECTION */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#e30613]" />
                <span>প্রোডাক্টের ছবিসমূহ (Product Photos) *</span>
              </label>
              <span className="text-[10px] text-gray-500 font-mono">
                {form.images.length} টি ছবি যুক্ত আছে
              </span>
            </div>

            {/* Current Images Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {form.images.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-300 aspect-square bg-gray-200">
                  <img src={imgUrl} alt={`Prod ${idx}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-[#e30613] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      মেইন
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Remove Photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Image URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="নতুন ছবির URL পেস্ট করুন..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:border-[#e30613]"
              />
              <button
                type="button"
                onClick={() => handleAddImage()}
                className="px-3.5 py-2 bg-gray-800 hover:bg-[#e30613] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                যুক্ত করুন
              </button>
            </div>

            {/* Image Presets Quick Bank */}
            <div>
              <span className="text-[10px] text-gray-500 font-bold block mb-1.5">
                📸 প্রি-সেট ফটো লাইব্রেরি (১ ক্লিকে যোগ করুন):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-lg border border-gray-200">
                {PRESET_IMAGES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddImage(preset.url)}
                    className="text-[10px] bg-gray-100 hover:bg-red-50 hover:text-[#e30613] text-gray-700 px-2 py-1 rounded border border-gray-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>+ {preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT COLORS SECTION */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#e30613]" />
              <span>কালারসমূহ (Product Colors) *</span>
            </label>

            {/* Active Selected Colors */}
            <div className="flex flex-wrap gap-2">
              {form.colors.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-white border border-gray-300 px-2.5 py-1 rounded-full text-xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-400"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="font-semibold text-gray-800">{col.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(col.name)}
                    className="text-gray-400 hover:text-red-500 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Color */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="কালারের নাম (e.g. চকলেট)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:border-[#e30613]"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-8 p-0.5 border border-gray-300 rounded cursor-pointer"
                title="Select Hex Color"
              />
              <button
                type="button"
                onClick={() => handleAddColor()}
                className="px-3 py-2 bg-gray-800 hover:bg-[#e30613] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                কালার যোগ
              </button>
            </div>

            {/* Color Presets */}
            <div>
              <span className="text-[10px] text-gray-500 font-bold block mb-1">
                🎨 জনপ্রিয় কালার বাটন:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_COLORS.map((col, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddColor(col)}
                    className="flex items-center gap-1 text-[10px] bg-white hover:bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200 transition-colors cursor-pointer"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-gray-300"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIZES SELECTION */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <label className="text-xs font-bold text-gray-900 block">
              উপলব্ধ সাইজসমূহ (Available Sizes)
            </label>
            <div className="flex flex-wrap gap-2">
              {[38, 39, 40, 41, 42, 43, 44, 45, 46].map((sizeNum) => {
                const isSelected = form.sizes.includes(sizeNum);
                return (
                  <button
                    key={sizeNum}
                    type="button"
                    onClick={() => handleToggleSize(sizeNum)}
                    className={`w-10 h-10 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#e30613] text-white border-[#e30613] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {sizeNum}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </form>
  );
};

// ----------------------------------------------------
// CATEGORY EDITOR FORM COMPONENT
// ----------------------------------------------------
interface CategoryEditorFormProps {
  initialCategory: Category;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

const CategoryEditorForm: React.FC<CategoryEditorFormProps> = ({
  initialCategory,
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState<Category>(initialCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('ক্যাটাগরির নাম লিখুন');
      return;
    }
    if (!form.image.trim()) {
      alert('ক্যাটাগরির ফটো URL দিন');
      return;
    }
    const finalSlug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-');
    onSave({ ...form, slug: finalSlug });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-300 shadow-md space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-gray-900">
            {form.name ? `ক্যাটাগরি এডিট: ${form.name}` : 'নতুন ক্যাটাগরি তৈরি করুন'}
          </h3>
          <p className="text-xs text-gray-500">ক্যাটাগরির নাম ও ফটো আপডেট করুন</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#e30613] hover:bg-[#c20510] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>ক্যাটাগরি সেভ করুন</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            ক্যাটাগরির নাম (Category Name) *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm({
                ...form,
                name,
                slug: form.slug || name.toLowerCase().replace(/\s+/g, '-'),
              });
            }}
            placeholder="e.g. Sandal, Loafer, Formal Shoes, Casual Shoes"
            className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-[#e30613]"
          />
        </div>

        {/* Category Slug */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            স্লাগ / URL Slug (e.g. sandal, loafer, casual-shoes)
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            placeholder="e.g. loafer"
            className="w-full px-3.5 py-2 text-xs font-mono border border-gray-300 rounded-xl outline-none"
          />
        </div>

        {/* Category Image URL & Preview */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <label className="block text-xs font-bold text-gray-900">
            ক্যাটাগরি ফটো (Category Photo URL) *
          </label>

          <div className="flex gap-2">
            <input
              type="url"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:border-[#e30613]"
            />
          </div>

          {/* Photo Live Preview */}
          {form.image && (
            <div className="aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden relative border border-gray-300 bg-gray-900">
              <img
                src={form.image}
                alt={form.name || 'Category'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-white font-heading font-extrabold text-xl">
                  {form.name || 'Category Headline'}
                </span>
              </div>
            </div>
          )}

          {/* Quick Preset Images */}
          <div>
            <span className="text-[10px] text-gray-500 font-bold block mb-1.5">
              📸 ফটো লাইব্রেরি থেকে বেছে নিন:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_IMAGES.slice(0, 6).map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm({ ...form, image: preset.url })}
                  className="flex items-center gap-2 p-1.5 bg-white hover:bg-red-50 hover:border-[#e30613] rounded-lg border border-gray-200 transition-all text-left cursor-pointer"
                >
                  <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded object-cover" />
                  <span className="text-[10px] font-semibold text-gray-700 line-clamp-1">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
