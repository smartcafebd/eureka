import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, ProductCostStructure, Category } from '../../types';
import { ImageUploadBox } from '../common/ImageUploadBox';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Layers,
  Check,
  X,
  Eye,
  DollarSign,
  Package,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  FolderOpen,
} from 'lucide-react';
import { STANDARD_PRODUCT_COLORS } from '../../data/products';
import { getSafeProductImageUrl, handleImageError } from '../../utils/imageUtils';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    saveProduct,
    deleteProduct,
    duplicateProduct,
    deleteProductVariant,
    saveCategory,
    deleteCategory,
    currentAdmin,
    recoverLostProductImages,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Image Recovery state
  const [isRecoveringImages, setIsRecoveringImages] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<string | null>(null);

  const handleRecoverImages = async () => {
    setIsRecoveringImages(true);
    try {
      const res = await recoverLostProductImages();
      setRecoveryResult(res.details);
      setTimeout(() => setRecoveryResult(null), 8000);
    } catch (e: any) {
      setRecoveryResult(`ত্রুটি: ${e?.message || 'রিকভারি করা সম্ভব হয়নি'}`);
    } finally {
      setIsRecoveringImages(false);
    }
  };

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Category Manager Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryEditorOpen, setIsCategoryEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Variant manager sub-modal
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [activeProductForVariants, setActiveProductForVariants] = useState<Product | null>(null);

  // Keep activeProductForVariants synchronized with the products list from store
  useEffect(() => {
    if (activeProductForVariants && isVariantModalOpen) {
      const fresh = products.find((p) => p.id === activeProductForVariants.id);
      if (fresh && fresh !== activeProductForVariants) {
        setActiveProductForVariants(fresh);
      }
    }
  }, [products, isVariantModalOpen, activeProductForVariants]);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formBrand, setFormBrand] = useState('Snap Leather / Eureka');
  const [formCategory, setFormCategory] = useState('Casual Shoes');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formGender, setFormGender] = useState<'men' | 'women' | 'kids' | 'unisex'>('men');
  const [formPrice, setFormPrice] = useState(2450);
  const [formOriginalPrice, setFormOriginalPrice] = useState(4150);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formMaterials, setFormMaterials] = useState('100% Genuine Cowhide Leather');
  const [formSoleMaterial, setFormSoleMaterial] = useState('Anti-Skid Vulcanized Rubber');
  const [formWeight, setFormWeight] = useState(750);
  const [formWarranty, setFormWarranty] = useState(12);
  const [formLowStockAlert, setFormLowStockAlert] = useState(5);
  const [formStatus, setFormStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsHotDeal, setFormIsHotDeal] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  ]);
  const [formImageInput, setFormImageInput] = useState('');

  // Cost Structure
  const [mfgCost, setMfgCost] = useState(980);
  const [pkgCost, setPkgCost] = useState(95);
  const [mktCost, setMktCost] = useState(180);
  const [trpCost, setTrpCost] = useState(65);
  const [delCost, setDelCost] = useState(120);
  const [othCost, setOthCost] = useState(50);

  const totalCalculatedCost = mfgCost + pkgCost + mktCost + trpCost + delCost + othCost;
  const estimatedGrossProfit = formPrice - totalCalculatedCost;

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.productCode && p.productCode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || (p.status || 'published') === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`SL-${Math.floor(100 + Math.random() * 900)}`);
    setFormCode(`CODE-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormBrand('Snap Leather / Eureka');
    setFormCategory(categories[0]?.name || 'Casual Shoes');
    setFormSubcategory('');
    setFormGender('men');
    setFormPrice(2450);
    setFormOriginalPrice(4150);
    setFormShortDesc('হ্যান্ডক্রাফটেড খাঁটি চামড়া ও আরামদায়ক কুশন সোলে তৈরি।');
    setFormDesc('প্রিমিয়াম ফুল গ্রেইন চামড়া এবং ইম্পোর্টেড আরামদায়ক কুশন সোলে নিখুঁত ফিনিশিংয়ে তৈরি।');
    setFormMaterials('100% Genuine Cowhide Leather');
    setFormSoleMaterial('Anti-Skid Vulcanized Rubber');
    setFormWeight(750);
    setFormWarranty(12);
    setFormLowStockAlert(5);
    setFormStatus('published');
    setFormVideoUrl('');
    setFormBadge('NEW');
    setFormIsFeatured(true);
    setFormIsHotDeal(false);
    setFormIsNewArrival(true);
    setFormIsBestSeller(false);
    setFormImages([
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    ]);
    setMfgCost(980);
    setPkgCost(95);
    setMktCost(180);
    setTrpCost(65);
    setDelCost(120);
    setOthCost(50);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCode(p.productCode || '');
    setFormBrand(p.brand || 'Snap Leather / Eureka');
    setFormCategory(p.category);
    setFormSubcategory(p.subCategory || '');
    setFormGender(p.gender);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormShortDesc(p.shortDescription || '');
    setFormDesc(p.description || '');
    setFormMaterials(p.materials);
    setFormSoleMaterial(p.soleMaterial || 'Anti-Skid Vulcanized Rubber');
    setFormWeight(p.weightGrams || 750);
    setFormWarranty(p.warrantyMonths || 12);
    setFormLowStockAlert(p.lowStockAlert || 5);
    setFormStatus(p.status || 'published');
    setFormVideoUrl(p.videoUrl || '');
    setFormBadge(p.badge || '');
    setFormIsFeatured(!!p.isFeatured);
    setFormIsHotDeal(!!p.isHotDeal);
    setFormIsNewArrival(!!p.isNewArrival);
    setFormIsBestSeller(!!p.isBestSeller);
    setFormImages(p.images);

    if (p.costStructure) {
      setMfgCost(p.costStructure.manufacturingCost);
      setPkgCost(p.costStructure.packagingCost);
      setMktCost(p.costStructure.marketingCost);
      setTrpCost(p.costStructure.transportCost);
      setDelCost(p.costStructure.deliveryCost);
      setOthCost(p.costStructure.otherAllocatedCost);
    } else {
      const base = p.costPrice || Math.round(p.price * 0.48);
      setMfgCost(Math.round(base * 0.7));
      setPkgCost(90);
      setMktCost(150);
      setTrpCost(60);
      setDelCost(120);
      setOthCost(40);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const costStructure: ProductCostStructure = {
      manufacturingCost: mfgCost,
      packagingCost: pkgCost,
      marketingCost: mktCost,
      transportCost: trpCost,
      deliveryCost: delCost,
      otherAllocatedCost: othCost,
    };

    const id = editingProduct ? editingProduct.id : `rk-${Date.now().toString().slice(-6)}`;

    const allFinalImages = [...formImages];
    if (formImageInput && formImageInput.trim() && !allFinalImages.includes(formImageInput.trim())) {
      allFinalImages.push(formImageInput.trim());
    }

    // If new product, generate base variants
    let variants = editingProduct?.variants;
    if (!variants || variants.length === 0) {
      variants = [];
      const defaultSizes = [39, 40, 41, 42, 43, 44];
      const defaultColors = STANDARD_PRODUCT_COLORS.slice(0, 2);
      defaultColors.forEach((col) => {
        defaultSizes.forEach((sz) => {
          variants!.push({
            id: `var-${id}-${col.name.slice(0, 3)}-${sz}`,
            sku: `${formSku}-${col.name.slice(0, 2).toUpperCase()}-${sz}`,
            color: col.name,
            colorHex: col.hex,
            size: sz,
            stock: 6,
            purchaseCost: totalCalculatedCost,
            sellingPrice: formPrice,
            image: allFinalImages[0],
          });
        });
      });
    } else {
      // Update variant prices and costs
      variants = variants.map((v) => ({
        ...v,
        sellingPrice: formPrice,
        purchaseCost: totalCalculatedCost,
        image: v.image || allFinalImages[0],
      }));
    }

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    const productPayload: Product = {
      id,
      name: formName,
      sku: formSku,
      productCode: formCode,
      brand: formBrand,
      category: formCategory,
      subCategory: formSubcategory,
      gender: formGender,
      price: formPrice,
      originalPrice: formOriginalPrice,
      costPrice: totalCalculatedCost,
      costStructure,
      shortDescription: formShortDesc,
      description: formDesc,
      materials: formMaterials,
      soleMaterial: formSoleMaterial,
      weightGrams: formWeight,
      warrantyMonths: formWarranty,
      lowStockAlert: formLowStockAlert,
      status: formStatus,
      videoUrl: formVideoUrl,
      badge: formBadge,
      isFeatured: formIsFeatured,
      isHotDeal: formIsHotDeal,
      isNewArrival: formIsNewArrival,
      isBestSeller: formIsBestSeller,
      images: allFinalImages.length > 0 ? allFinalImages : ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'],
      sizes: Array.from(new Set(variants.map((v) => v.size))),
      colors: Array.from(
        new Map(variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()
      ) as { name: string; hex: string }[],
      stockCount: totalStock,
      variants,
      rating: editingProduct?.rating || 5,
      reviewCount: editingProduct?.reviewCount || 1,
    };

    setIsSaving(true);
    saveProduct(productPayload);
    setSavedSuccess(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(false);
      setIsModalOpen(false);
    }, 600);
  };

  // Variant editing handlers
  const handleVariantStockChange = (variantIdentifier: string, newStock: number) => {
    if (!activeProductForVariants) return;
    const updatedVariants = activeProductForVariants.variants?.map((v) =>
      (v.id === variantIdentifier || v.sku === variantIdentifier)
        ? { ...v, stock: Math.max(0, newStock) }
        : v
    );
    const updatedProd: Product = {
      ...activeProductForVariants,
      variants: updatedVariants,
      stockCount: updatedVariants?.reduce((s, v) => s + (Number(v.stock) || 0), 0) || 0,
    };
    setActiveProductForVariants(updatedProd);
    saveProduct(updatedProd);
  };

  const handleAddVariant = (colorName: string, colorHex: string, size: number, stock: number) => {
    if (!activeProductForVariants) return;
    const uniqueId = `var-${activeProductForVariants.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newVariant: ProductVariant = {
      id: uniqueId,
      sku: `${activeProductForVariants.sku}-${colorName.slice(0, 2).toUpperCase()}-${size}`,
      color: colorName,
      colorHex: colorHex,
      size: size,
      stock: stock,
      purchaseCost: activeProductForVariants.costPrice || 1100,
      sellingPrice: activeProductForVariants.price,
      image: activeProductForVariants.images[0],
    };

    const updatedVariants = [...(activeProductForVariants.variants || []), newVariant];
    const newSizes = Array.from(new Set(updatedVariants.map((v) => v.size))).sort((a, b) => a - b);
    const newColors = Array.from(
      new Map(updatedVariants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()
    );

    const updatedProd: Product = {
      ...activeProductForVariants,
      variants: updatedVariants,
      stockCount: updatedVariants.reduce((s, v) => s + (Number(v.stock) || 0), 0),
      sizes: newSizes,
      colors: newColors,
    };
    setActiveProductForVariants(updatedProd);
    saveProduct(updatedProd);
  };

  const handleDeleteVariant = (variantIdentifier?: string, variantSku?: string, variantIndex?: number) => {
    if (!activeProductForVariants) return;
    const currentVariants = activeProductForVariants.variants || [];

    // Find target variant for detail confirmation
    const targetVariant = currentVariants.find(
      (v, idx) =>
        (variantIdentifier && v.id === variantIdentifier) ||
        (variantSku && v.sku === variantSku) ||
        (variantIndex !== undefined && idx === variantIndex)
    );

    const variantDesc = targetVariant
      ? `"${targetVariant.color}" কালার, সাইজ ${targetVariant.size} (SKU: ${targetVariant.sku})`
      : 'এই ভ্যারিয়েন্টটি';

    if (!window.confirm(`আপনি কি নিশ্চিত যে ${variantDesc} ভ্যারিয়েন্টটি ডিলিট করতে চান?`)) {
      return;
    }

    const updatedVariants = currentVariants.filter((v, idx) => {
      if (variantIndex !== undefined && idx === variantIndex) return false;
      if (variantIdentifier && v.id && v.id === variantIdentifier) return false;
      if (variantSku && v.sku && v.sku === variantSku) return false;
      return true;
    });

    const newStockCount = updatedVariants.reduce((s, v) => s + (Number(v.stock) || 0), 0);
    const remainingSizes = Array.from(new Set(updatedVariants.map((v) => v.size))).sort((a, b) => a - b);
    const remainingColors = Array.from(
      new Map(updatedVariants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()
    );

    const updatedProd: Product = {
      ...activeProductForVariants,
      variants: updatedVariants,
      stockCount: newStockCount,
      sizes: remainingSizes.length > 0 ? remainingSizes : (activeProductForVariants.sizes || []),
      colors: remainingColors.length > 0 ? remainingColors : (activeProductForVariants.colors || []),
    };

    setActiveProductForVariants(updatedProd);
    saveProduct(updatedProd);

    if (deleteProductVariant) {
      deleteProductVariant(activeProductForVariants.id, variantIdentifier || variantSku, variantIndex);
    }
  };

  // Category Management Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatImage('');
    setCatDesc('');
    setIsCategoryEditorOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatImage(cat.image);
    setCatDesc(cat.description || '');
    setIsCategoryEditorOpen(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoryToSave: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: catName.trim(),
      slug,
      image: catImage.trim() || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      description: catDesc.trim(),
      featured: true,
      enabled: true,
    };
    saveCategory(categoryToSave, currentAdmin.name);
    setIsCategoryEditorOpen(false);
  };

  const handleDeleteCategoryConfirm = (cat: Category) => {
    if (confirm(`আপনি কি "${cat.name}" ক্যাটাগরিটি ডিলিট করতে চান?`)) {
      deleteCategory(cat.id, currentAdmin.name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" /> Leather Footwear Catalog & Variants
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total {products.length} products with multi-size and multi-color SKU variant management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRecoverImages}
            disabled={isRecoveringImages}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer"
            title="পূর্বে আপলোড করা ছবি খুঁজুন এবং ব্রাউজার ডাটাবেজ থেকে রিস্টোর করুন"
          >
            <Sparkles className={`w-4 h-4 ${isRecoveringImages ? 'animate-spin' : 'text-emerald-300'}`} />
            <span>{isRecoveringImages ? 'ছবি রিকভার হচ্ছে...' : 'ছবি পুনরুদ্ধার ও ব্যাকআপ'}</span>
          </button>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-400" /> পপুলার ক্যাটাগরি ছবি ও ম্যানেজমেন্ট ({categories.length})
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Shoe Model
          </button>
        </div>
      </div>

      {/* Image Recovery Feedback Banner */}
      {recoveryResult && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{recoveryResult}</span>
          </div>
          <button
            type="button"
            onClick={() => setRecoveryResult(null)}
            className="p-1 hover:bg-emerald-200/60 rounded-lg text-emerald-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by shoe name, SKU, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published (Live in Store)</option>
          <option value="draft">Draft (Hidden)</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Shoe Model</th>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Est. Gross Profit</th>
                <th className="py-3 px-4">Total Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const totalStock = product.variants
                  ? product.variants.reduce((sum, v) => sum + v.stock, 0)
                  : product.stockCount;
                const cost = product.costPrice || Math.round(product.price * 0.48);
                const profit = product.price - cost;
                const profitMargin = Math.round((profit / product.price) * 100);

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getSafeProductImageUrl(product.images?.[0], product.category)}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, product.category)}
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">{product.name}</span>
                          <span className="text-[10px] text-gray-500">{product.brand || 'Snap Leather'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-700">
                      <div>{product.sku}</div>
                      {product.productCode && (
                        <span className="text-[10px] text-gray-400 block">{product.productCode}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">৳{(product.price ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">৳{(cost ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700">৳{(profit ?? 0).toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 block">({profitMargin}% margin)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          totalStock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : totalStock <= (product.lowStockAlert || 5)
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {totalStock} pcs
                      </span>
                      <button
                        onClick={() => {
                          setActiveProductForVariants(product);
                          setIsVariantModalOpen(true);
                        }}
                        className="block text-[10px] text-amber-600 hover:text-amber-700 font-semibold mt-0.5 flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3" /> {product.variants?.length || 0} variants
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          (product.status || 'published') === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : product.status === 'draft'
                            ? 'bg-stone-100 text-stone-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {product.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveProductForVariants(product);
                            setIsVariantModalOpen(true);
                          }}
                          title="Manage Color & Size Variants"
                          className="p-1.5 hover:bg-amber-50 rounded text-amber-600"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          title="Edit Full Product Specs"
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateProduct(product.id)}
                          title="Duplicate Product"
                          className="p-1.5 hover:bg-stone-100 rounded text-stone-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete product "${product.name}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          title="Delete Product"
                          className="p-1.5 hover:bg-rose-50 rounded text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL PRODUCT ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-stone-900 text-white">
              <div>
                <h3 className="font-bold text-lg">
                  {editingProduct ? `Edit Footwear: ${editingProduct.name}` : 'Add New Handcrafted Shoe'}
                </h3>
                <p className="text-xs text-stone-300">
                  Configure full product specifications, pipe-to-pipe cost breakdown, and visual gallery.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-stone-800 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body with Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Information */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3 pb-1 border-b border-gray-200">
                  1. General Footwear Specs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">Product Title / Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Clark Cycle Shoes In Dark Chocolate & Red"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Master SKU *</label>
                    <input
                      type="text"
                      required
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Internal Product Code</label>
                    <input
                      type="text"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="SL-1002"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Pipe-to-Pipe Cost Calculation */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <h4 className="font-bold text-gray-900 text-sm mb-3 pb-1 border-b border-amber-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-600" /> 2. Pricing & Cost Breakdown Calculator
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    Est. Unit Gross Profit: ৳{(estimatedGrossProfit ?? 0).toLocaleString()} ({Math.round(((estimatedGrossProfit ?? 0) / (formPrice || 1)) * 100)}%)
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Selling Price (৳) *</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Regular Price (৳)</label>
                    <input
                      type="number"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Low Stock Threshold</label>
                    <input
                      type="number"
                      value={formLowStockAlert}
                      onChange={(e) => setFormLowStockAlert(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-600 mb-2 font-medium">
                  Allocated Unit Costs (All components sum to Total Product Cost):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                  <div>
                    <label className="block text-gray-500 text-[10px]">Leather & Craft</label>
                    <input
                      type="number"
                      value={mfgCost}
                      onChange={(e) => setMfgCost(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px]">Box & Packaging</label>
                    <input
                      type="number"
                      value={pkgCost}
                      onChange={(e) => setPkgCost(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px]">Marketing Allocation</label>
                    <input
                      type="number"
                      value={mktCost}
                      onChange={(e) => setMktCost(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px]">Factory Transport</label>
                    <input
                      type="number"
                      value={trpCost}
                      onChange={(e) => setTrpCost(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px]">Courier Delivery</label>
                    <input
                      type="number"
                      value={delCost}
                      onChange={(e) => setDelCost(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px]">Other Allocated</label>
                    <input
                      type="number"
                      value={othCost}
                      onChange={(e) => setOthCost(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-center"
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-amber-200 text-right font-semibold text-gray-900">
                  Total Calculated Unit Cost: ৳{(totalCalculatedCost ?? 0).toLocaleString()}
                </div>
              </div>

              {/* Material Specifications */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3 pb-1 border-b border-gray-200">
                  3. Leather & Construction Materials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">Upper Leather Material</label>
                    <input
                      type="text"
                      value={formMaterials}
                      onChange={(e) => setFormMaterials(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Sole Construction</label>
                    <input
                      type="text"
                      value={formSoleMaterial}
                      onChange={(e) => setFormSoleMaterial(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Warranty (Months)</label>
                    <input
                      type="number"
                      value={formWarranty}
                      onChange={(e) => setFormWarranty(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions & Badges */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3 pb-1 border-b border-gray-200">
                  4. Storefront Display & Descriptions
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Short Description</label>
                    <input
                      type="text"
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Detailed Description</label>
                    <textarea
                      rows={3}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span className="font-semibold text-gray-700">Mark Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsHotDeal}
                        onChange={(e) => setFormIsHotDeal(e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span className="font-semibold text-gray-700">Mark Hot Deal</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsNewArrival}
                        onChange={(e) => setFormIsNewArrival(e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span className="font-semibold text-gray-700">Mark New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsBestSeller}
                        onChange={(e) => setFormIsBestSeller(e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span className="font-semibold text-gray-700">Mark Best Seller</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Images Gallery */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-200 gap-1">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" /> ৫. প্রোডাক্টের ছবি আপলোড (Image Gallery - {formImages.length} Photos)
                  </h4>
                  <span className="text-[10px] text-gray-500">
                    কম্পিউটার/মোবাইল থেকে সরাসরি ছবি আপলোড করুন অথবা লিংক দিন
                  </span>
                </div>

                {/* Direct Upload Box */}
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <ImageUploadBox
                    label="নতুন ছবি আপলোড বা লিংক দিন (PNG, JPG, WebP)"
                    value={formImageInput}
                    onChange={(val) => {
                      setFormImageInput(val);
                      if (val && val.trim()) {
                        setFormImages((prev) => {
                          const clean = val.trim();
                          if (prev.includes(clean)) return prev;
                          return [...prev, clean];
                        });
                      }
                    }}
                    aspectHint="প্রস্তাবিত: স্কয়ার ১:১ (800x800px) অথবা ভার্টিক্যাল ৪:৫ জুতো ফটো"
                    recommendedDimensions="হাই কোয়ালিটি প্রোডাক্ট ছবি"
                  />
                  {formImageInput && (
                    <div className="mt-3 flex items-center justify-between bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> ছবিটি প্রোডাক্ট গ্যালারিতে যোগ হয়েছে!
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormImageInput('')}
                        className="px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded text-xs font-semibold border border-emerald-300 shadow-2xs cursor-pointer transition"
                      >
                        + আরেকটি ছবি যোগ করুন
                      </button>
                    </div>
                  )}
                </div>

                {/* Uploaded Gallery Thumbnails */}
                {formImages.length > 0 ? (
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold text-xs">
                      সংযুক্ত ছবিসমূহ (প্রথম ছবিটি প্রধান কভার হিসেবে স্টোরফ্রন্টে শো করবে):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {formImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative group rounded-xl overflow-hidden border bg-white shadow-xs ${
                            idx === 0 ? 'ring-2 ring-amber-500 border-amber-500' : 'border-gray-200'
                          }`}
                        >
                          <div className="aspect-square w-full">
                            <img
                              src={getSafeProductImageUrl(img, formCategory)}
                              alt={`Product ${idx}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => handleImageError(e, formCategory)}
                            />
                          </div>

                          {/* Primary Cover Badge */}
                          {idx === 0 && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-600 text-white text-[9px] font-bold rounded">
                              Main Cover
                            </div>
                          )}

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                            <button
                              type="button"
                              onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                              className="self-end bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full cursor-pointer shadow-xs"
                              title="Delete Photo"
                            >
                              <X className="w-3 h-3" />
                            </button>

                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  // Move to index 0
                                  const reordered = [img, ...formImages.filter((_, i) => i !== idx)];
                                  setFormImages(reordered);
                                }}
                                className="w-full py-1 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-semibold rounded cursor-pointer text-center"
                              >
                                কভার ছবি বানান
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center text-amber-800 text-xs">
                    এখনো কোনো ছবি যোগ করা হয়নি। উপরের বক্স থেকে ফাইল সিলেক্ট করে "গ্যালারিতে যোগ করুন" চাপুন।
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-2">
                <div>
                  {savedSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-pulse">
                      <Check className="w-4 h-4 text-emerald-600" />
                      স্বয়ংক্রিয়ভাবে সেভ হয়েছে! ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-5 py-2.5 font-bold rounded-xl shadow text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      savedSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>সফলভাবে সেভ হয়েছে!</span>
                      </>
                    ) : isSaving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>অটো-সেভ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingProduct ? 'তথ্য সেভ ও আপডেট করুন (Save Changes)' : 'প্রোডাক্ট তৈরি ও সেভ করুন'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VARIANT MANAGER SUB-MODAL */}
      {isVariantModalOpen && activeProductForVariants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-stone-900 text-white">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" /> Variant Matrix: {activeProductForVariants.name}
                </h3>
                <p className="text-xs text-stone-300">
                  Individual stock tracking per size and color. Stock auto-deducts on order confirmation.
                </p>
              </div>
              <button onClick={() => setIsVariantModalOpen(false)} className="p-1.5 hover:bg-stone-800 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Add New Variant Row */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-bold text-gray-900 mb-2">Add New Size / Color Variant</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Color Name</label>
                    <input id="newVarColor" type="text" defaultValue="চকলেট" className="w-full p-1.5 border rounded" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Color Hex</label>
                    <input id="newVarHex" type="text" defaultValue="#4a2c11" className="w-full p-1.5 border rounded" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Shoe Size</label>
                    <input id="newVarSize" type="number" defaultValue="42" className="w-full p-1.5 border rounded" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Initial Stock</label>
                    <input id="newVarStock" type="number" defaultValue="5" className="w-full p-1.5 border rounded" />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const col = (document.getElementById('newVarColor') as HTMLInputElement).value;
                        const hex = (document.getElementById('newVarHex') as HTMLInputElement).value;
                        const sz = Number((document.getElementById('newVarSize') as HTMLInputElement).value);
                        const stk = Number((document.getElementById('newVarStock') as HTMLInputElement).value);
                        handleAddVariant(col, hex, sz, stk);
                      }}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Variants List Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Variant SKU</th>
                      <th className="py-2.5 px-3">Color</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Selling Price</th>
                      <th className="py-2.5 px-3">Current Stock</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(!activeProductForVariants.variants || activeProductForVariants.variants.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 font-medium text-xs">
                          এই প্রোডাক্টের কোনো সাইজ বা কালার ভ্যারিয়েন্ট নেই। ওপরের ফর্ম থেকে নতুন ভ্যারিয়েন্ট তৈরি করুন।
                        </td>
                      </tr>
                    ) : (
                      activeProductForVariants.variants.map((v, idx) => (
                        <tr key={v.id || v.sku || `var-${idx}`} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-mono text-gray-800 font-medium">{v.sku}</td>
                          <td className="py-2.5 px-3 flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                              style={{ backgroundColor: v.colorHex }}
                            />
                            <span className="text-gray-800 font-medium">{v.color}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{v.size}</td>
                          <td className="py-2.5 px-3 font-medium text-gray-900">৳{(v.sellingPrice ?? 0).toLocaleString()}</td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min="0"
                              value={v.stock}
                              onChange={(e) => handleVariantStockChange(v.id || v.sku, Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-bold text-gray-900 focus:ring-1 focus:ring-amber-500"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(v.id, v.sku, idx)}
                              title={`ভ্যারিয়েন্ট ডিলিট করুন (${v.color}, সাইজ ${v.size})`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded-md font-medium text-xs border border-rose-200 hover:border-rose-600 transition cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
              <span className="text-xs font-semibold text-gray-700">
                Total Combined Stock: {activeProductForVariants.stockCount} pcs
              </span>
              <button
                onClick={() => setIsVariantModalOpen(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* POPULAR CATEGORIES MANAGEMENT MODAL */}
      {/* ==================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-stone-900 text-white">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" /> পপুলার ক্যাটাগরি ছবি ও ম্যানেজমেন্ট
                </h3>
                <p className="text-xs text-stone-300">
                  হোমপেজের "POPULAR CATEGORIES" সেকশনের প্রতিটি ক্যাটাগরির নাম ও ছবি এখান থেকে পরিবর্তন বা আপলোড করুন।
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> নতুন ক্যাটাগরি যোগ করুন
                </button>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const productCount = products.filter((p) => p.category === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded">
                            {productCount} টি জুতো
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-3 space-y-1">
                          <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                          <p className="text-[11px] text-gray-500 font-mono">Slug: #{cat.slug}</p>
                          {cat.description && (
                            <p className="text-[11px] text-gray-600 line-clamp-2 pt-1">{cat.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-3 border-t bg-stone-50 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded text-xs flex items-center gap-1 cursor-pointer transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> ছবি ও নাম এডিট
                        </button>

                        {categories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategoryConfirm(cat)}
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CATEGORY ADD / EDIT SUB-MODAL WITH IMAGE UPLOAD */}
      {/* ==================================================== */}
      {isCategoryEditorOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-stone-900 text-white">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                {editingCategory ? 'ক্যাটাগরি ছবি ও তথ্য পরিবর্তন' : 'নতুন ক্যাটাগরি যুক্ত করুন'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryEditorOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="p-5 space-y-4 text-xs">
              {/* Category Image Upload */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <ImageUploadBox
                  label="ক্যাটাগরির কভার ছবি (PNG / JPG / WebP)"
                  value={catImage}
                  onChange={(val) => setCatImage(val)}
                  aspectHint="প্রস্তাবিত: ভার্টিক্যাল ৪:৫ অথবা স্কয়ার ১:১ (যেমন 800x1000px)"
                  recommendedDimensions="হাই রেজ্যুলুশন জুতো ছবি"
                />
              </div>

              {/* Name & Slug */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">ক্যাটাগরি নাম (Category Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Casual Shoes, Formal Oxfords..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">স্লাগ / আইডেন্টিফায়ার (Slug)</label>
                <input
                  type="text"
                  placeholder="যেমন: casual-shoes (ফাঁকা রাখলে স্বয়ংক্রিয় তৈরি হবে)"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">সংক্ষিপ্ত বর্ণনা (Description)</label>
                <textarea
                  rows={2}
                  placeholder="যেমন: আরামদায়ক জেনুইন লেদার ক্যাজুয়াল শু কালেকশন"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-xs"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryEditorOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingCategory ? 'ক্যাটাগরি আপডেট করুন' : 'ক্যাটাগরি সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
