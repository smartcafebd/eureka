import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Tag,
  FileText,
  DollarSign,
  Package,
  Ruler,
  Palette,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Product, ProductCostStructure } from '../types';
import { useStore } from '../context/StoreContext';
import { STANDARD_PRODUCT_COLORS } from '../data/products';
import { ImageUploadBox } from './common/ImageUploadBox';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';

interface ProductEditModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSaved?: (updatedProduct: Product) => void;
}

const COMMON_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  product,
  onClose,
  onSaved,
}) => {
  const { categories, saveProduct, currentAdmin } = useStore();

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [productCode, setProductCode] = useState('');
  const [brand, setBrand] = useState('Eureka Leather');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(2450);
  const [originalPrice, setOriginalPrice] = useState(3500);
  const [stockCount, setStockCount] = useState(25);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [soleMaterial, setSoleMaterial] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState(12);
  const [badge, setBadge] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHotDeal, setIsHotDeal] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Sizes & Colors
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Save feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'variants' | 'images'>('general');

  // Populate when product changes
  useEffect(() => {
    if (product && isOpen) {
      setName(product.name || '');
      setSku(product.sku || '');
      setProductCode(product.productCode || '');
      setBrand(product.brand || 'Eureka Leather');
      setCategory(product.category || (categories[0]?.name || 'Casual Shoes'));
      setPrice(product.price || 0);
      setOriginalPrice(product.originalPrice || 0);
      setStockCount(product.stockCount || 0);
      setShortDescription(product.shortDescription || '');
      setDescription(product.description || '');
      setMaterials(product.materials || '100% Genuine Cowhide Leather');
      setSoleMaterial(product.soleMaterial || 'Anti-Skid Vulcanized Rubber');
      setWarrantyMonths(product.warrantyMonths || 12);
      setBadge(product.badge || '');
      setStatus(product.status || 'published');
      setIsFeatured(Boolean(product.isFeatured));
      setIsHotDeal(Boolean(product.isHotDeal));
      setIsNewArrival(Boolean(product.isNewArrival));
      setIsBestSeller(Boolean(product.isBestSeller));

      setSelectedSizes(product.sizes && product.sizes.length > 0 ? [...product.sizes] : [40, 41, 42, 43]);

      const colorsFiltered = (product.colors || STANDARD_PRODUCT_COLORS).filter(
        (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
      );
      setSelectedColors(colorsFiltered.length > 0 ? colorsFiltered : [STANDARD_PRODUCT_COLORS[0]]);

      setImages(product.images && product.images.length > 0 ? [...product.images] : []);
      setSavedSuccess(false);
      setIsSaving(false);
    }
  }, [product, isOpen, categories]);

  if (!isOpen || !product) return null;

  // Toggle size selection
  const handleToggleSize = (size: number) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size].sort((a, b) => a - b));
    }
  };

  const handleAddCustomSize = () => {
    const parsed = parseInt(customSizeInput.trim(), 10);
    if (!isNaN(parsed) && parsed > 0 && !selectedSizes.includes(parsed)) {
      setSelectedSizes([...selectedSizes, parsed].sort((a, b) => a - b));
      setCustomSizeInput('');
    }
  };

  // Toggle color selection
  const handleToggleColor = (colorObj: { name: string; hex: string }) => {
    const exists = selectedColors.some((c) => c.name === colorObj.name);
    if (exists) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c.name !== colorObj.name));
      }
    } else {
      setSelectedColors([...selectedColors, colorObj]);
    }
  };

  // Image manipulation
  const handleAddImage = () => {
    const trimmed = newImageUrl.trim();
    if (trimmed && !images.includes(trimmed)) {
      setImages([...images, trimmed]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, idx) => idx !== indexToRemove));
    }
  };

  const handleSetCoverImage = (indexToMakeCover: number) => {
    const target = images[indexToMakeCover];
    const rest = images.filter((_, idx) => idx !== indexToMakeCover);
    setImages([target, ...rest]);
  };

  // Core Save Handler - Automatically updates Store, DB, and triggers callbacks
  const handleSave = () => {
    if (!name.trim()) {
      alert('অনুগ্রহ করে প্রোডাক্টের নাম লিখুন।');
      return;
    }

    setIsSaving(true);

    // Build updated variants matching colors and sizes
    const existingVariants = product.variants || [];
    const newVariants = [];

    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        const existing = existingVariants.find((v) => v.color === color.name && v.size === size);
        if (existing) {
          newVariants.push({
            ...existing,
            sellingPrice: price,
            colorHex: color.hex,
          });
        } else {
          newVariants.push({
            id: `var-${product.id}-${color.name}-${size}`,
            sku: `${sku || product.sku}-${color.name.slice(0, 2).toUpperCase()}-${size}`,
            color: color.name,
            colorHex: color.hex,
            size,
            stock: Math.max(1, Math.floor(stockCount / (selectedColors.length * selectedSizes.length))),
            purchaseCost: Math.round(price * 0.5),
            sellingPrice: price,
            image: images[0] || product.images[0],
          });
        }
      }
    }

    const totalVariantStock = newVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const finalStock = totalVariantStock > 0 ? totalVariantStock : stockCount;

    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      sku: sku.trim() || product.sku,
      productCode: productCode.trim() || product.productCode,
      brand: brand.trim(),
      category: category || product.category,
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || 0,
      stockCount: finalStock,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      materials: materials.trim(),
      soleMaterial: soleMaterial.trim(),
      warrantyMonths: Number(warrantyMonths) || 12,
      badge: badge.trim(),
      status,
      isFeatured,
      isHotDeal,
      isNewArrival,
      isBestSeller,
      sizes: selectedSizes,
      colors: selectedColors,
      images: images.length > 0 ? images : product.images,
      variants: newVariants,
    };

    // 1. Save directly into StoreContext (which triggers persistent sync to IndexedDB & localStorage)
    saveProduct(updatedProduct, currentAdmin?.name || 'Store Admin');

    // 2. Trigger callback to immediately update local view
    if (onSaved) {
      onSaved(updatedProduct);
    }

    // 3. Show instant saved feedback
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);

      // Auto close after brief confirmation
      setTimeout(() => {
        onClose();
      }, 900);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="px-5 py-3.5 bg-[#1c1c1c] text-white flex items-center justify-between border-b border-[#2e2e2e] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#b71218] flex items-center justify-center text-white shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate">
                প্রোডাক্ট তথ্য এডিট ও আপডেট
              </h3>
              <p className="text-[11px] text-gray-400 truncate">
                {product.name} (SKU: {product.sku})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                স্বয়ংক্রিয়ভাবে সেভ হয়েছে ✓
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-5 bg-gray-50 border-b border-gray-200 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-[#b71218] text-[#b71218]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>সাধারণ তথ্য ও বিবরণ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-[#b71218] text-[#b71218]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>মূল্য, স্টক ও অফার</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'variants'
                ? 'border-[#b71218] text-[#b71218]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>সাইজ ও কালার ভ্যারিয়েন্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'images'
                ? 'border-[#b71218] text-[#b71218]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>ছবিসমূহ ({images.length})</span>
          </button>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-gray-700 flex-1">
          
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  প্রোডাক্টের নাম (Product Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম লেদার লফার জুতো"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:border-[#b71218] focus:ring-2 focus:ring-[#b71218]/20 outline-none transition-all font-medium"
                />
              </div>

              {/* Category & Brand Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    ক্যাটাগরি (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none bg-white font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    ব্র্যান্ড (Brand)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none font-medium"
                  />
                </div>
              </div>

              {/* SKU and Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    SKU কোড
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    প্রোডাক্ট কোড / মডেল
                  </label>
                  <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="e.g. SL-2024"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="১-২ লাইনে আকর্ষণীয় মূল ফিচার বা সংক্ষেপ লিখুন..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  বিস্তারিত তথ্য ও স্পেসিফিকেশন (Full Description)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="জুতোটির চামড়া, স্থায়িত্ব, সোল ও ব্যবহারের আরামদায়ক দিক বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none leading-relaxed"
                />
              </div>

              {/* Material & Sole */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    লেদার / আপার উপাদান (Materials)
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. 100% Genuine Cowhide Leather"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    সোল ম্যাটেরিয়াল (Sole)
                  </label>
                  <input
                    type="text"
                    value={soleMaterial}
                    onChange={(e) => setSoleMaterial(e.target.value)}
                    placeholder="e.g. Anti-Skid Vulcanized Rubber"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING, STOCK & OFFERS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Selling Price */}
                <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-100">
                  <label className="block font-bold text-[#b71218] mb-1">
                    অফার / বিক্রয় মূল্য (৳) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-gray-500">৳</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-base font-bold text-[#b71218] bg-white border border-red-200 rounded-lg outline-none focus:border-[#b71218]"
                    />
                  </div>
                </div>

                {/* Regular Price */}
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <label className="block font-bold text-gray-700 mb-1">
                    পূর্বের রেগুলার মূল্য (৳)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-gray-400">৳</span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Stock Count */}
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <label className="block font-bold text-gray-700 mb-1">
                    মজুত স্টক সংখ্যা (Total Stock)
                  </label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-base font-bold text-gray-900 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Discount Calculator Display */}
              {originalPrice > price && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>কাস্টমার ছাড় (Discount): {Math.round(((originalPrice - price) / originalPrice) * 100)}% ছাড়</span>
                  <span>সেভ করবে: ৳ {(originalPrice - price).toLocaleString()}</span>
                </div>
              )}

              {/* Status and Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    পাবলিশ স্ট্যাটাস (Status)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none bg-white font-medium"
                  >
                    <option value="published">পাবলিশড (Published / লাইভ দেখাবে)</option>
                    <option value="draft">ড্রাফট (Draft / লুকানো থাকবে)</option>
                    <option value="archived">আর্কাইভড (Archived)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    ওয়ারেন্টি গ্যারান্টি (মাস)
                  </label>
                  <input
                    type="number"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none font-medium"
                  />
                </div>
              </div>

              {/* Badges and Marketing Flags */}
              <div className="pt-3 border-t border-gray-200">
                <label className="block font-bold text-gray-900 mb-2">
                  মার্কেটিং ফ্ল্যাগ ও স্পেশাল ব্যাজ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={isHotDeal}
                      onChange={(e) => setIsHotDeal(e.target.checked)}
                      className="rounded text-[#b71218] focus:ring-[#b71218] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-gray-800">🔥 Hot Deal</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-[#b71218] focus:ring-[#b71218] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-gray-800">⭐ Featured</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="rounded text-[#b71218] focus:ring-[#b71218] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-gray-800">✨ New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded text-[#b71218] focus:ring-[#b71218] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-gray-800">🏆 Best Seller</span>
                  </label>
                </div>
              </div>

              {/* Custom Badge Text */}
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  কাস্টম ব্যাজ টেক্সট (যেমন: ১০০% খাঁটি চামড়া, ঈদ অফার ইত্যাদি)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. ১০০% জেনুইন লেদার"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#b71218] outline-none font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SIZES & COLORS */}
          {activeTab === 'variants' && (
            <div className="space-y-5">
              {/* Sizes Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-gray-900">
                    উপলব্ধ জুতো সাইজসমূহ (Available Sizes)
                  </label>
                  <span className="text-[11px] text-gray-500">
                    ক্লিক করে সাইজ অন/অফ করুন
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_SIZES.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`w-11 h-11 rounded-xl font-heading font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#b71218] text-white shadow-sm ring-2 ring-[#b71218]/30'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Size */}
                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="number"
                    placeholder="অন্য সাইজ (যেমন: 46)"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    className="w-32 px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-[#b71218]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    + যোগ করুন
                  </button>
                </div>
              </div>

              {/* Colors Selection */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block font-bold text-gray-900 mb-2">
                  উপলব্ধ চামড়ার কালারসমূহ (Available Leather Colors)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STANDARD_PRODUCT_COLORS.filter(
                    (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
                  ).map((col) => {
                    const isSelected = selectedColors.some((c) => c.name === col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => handleToggleColor(col)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-[#b71218] bg-red-50/60 ring-2 ring-[#b71218]/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-gray-300 shadow-xs shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#b71218]' : 'text-gray-800'}`}>
                          {col.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                💡 <strong>স্বয়ংক্রিয় ভ্যারিয়েন্ট ম্যাট্রিক্স:</strong> সেভ বাটনে ক্লিক করলে সিস্টেম স্বয়ংক্রিয়ভাবে নির্বাচিত সাইজ ও কালারের কম্বিনেশন অনুযায়ী ইনভেন্টরি ভ্যারিয়েন্ট স্টক তৈরি ও সিঙ্ক করে রাখবে।
              </div>
            </div>
          )}

          {/* TAB 4: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-5">
              {/* Direct Device File Upload Box */}
              <div className="bg-amber-50/40 p-3.5 border border-amber-200/80 rounded-xl">
                <ImageUploadBox
                  label="ডিভাইস থেকে সরাসরি ছবি আপলোড করুন (PC / মোবাইল)"
                  helperText="PNG, JPG, WebP ছবি ড্র্যাগ অ্যান্ড ড্রপ বা ক্লিক করে সিলেক্ট করুন (স্বয়ংক্রিয়ভাবে অপ্টিমাইজড)"
                  aspectRatio="square"
                  onChange={(dataUrl) => {
                    if (dataUrl && !images.includes(dataUrl)) {
                      setImages([dataUrl, ...images]);
                    }
                  }}
                />
              </div>

              {/* Add New Image via URL */}
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  অথবা ইমেজ লিংক (URL) দিয়ে যুক্ত করুন
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/shoe-photo.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#b71218]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#b71218] hover:bg-[#990e13] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Images Grid */}
              <div>
                <label className="block font-bold text-gray-900 mb-2">
                  গ্যালারির ছবিসমূহ ({images.length}টি - প্রথম ছবিটি স্টোরফ্রন্টে মূল কভার হিসেবে প্রদর্শিত হবে):
                </label>

                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border bg-gray-50 aspect-square ${
                          idx === 0 ? 'ring-2 ring-[#b71218] border-[#b71218]' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={getSafeProductImageUrl(img, category)}
                          alt={`Product photo ${idx + 1}`}
                          className="w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, category)}
                        />

                        {/* Main Cover Badge */}
                        {idx === 0 && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#b71218] text-white text-[10px] font-bold rounded shadow-xs">
                            মূল কভার ছবি
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="self-end p-1 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                            title="ছবি রিমুভ করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="w-full py-1 bg-white hover:bg-gray-100 text-gray-900 text-[10px] font-bold rounded cursor-pointer text-center"
                            >
                              কভার ছবি করুন
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-xl">
                    কোনো ছবি পাওয়া যায়নি। উপরের ইনপুট বক্সে ইমেজ ইউআরএল পেস্ট করে যোগ করুন।
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER - THE PROMINENT SAVE ACTION */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">
              স্ট্যাটাস: <strong className="text-gray-800 capitalize">{status}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              বাতিল (Cancel)
            </button>

            {/* CORE SAVE BUTTON WITH AUTO-SAVE CONFIRMATION */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 scale-105'
                  : 'bg-[#b71218] hover:bg-[#990e13] active:scale-95'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                  <span>তথ্য সফলভাবে সেভ ও আপডেট হয়েছে! ✓</span>
                </>
              ) : isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>অটোমেটিক সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white" />
                  <span>তথ্য সেভ করুন (Save Changes)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
