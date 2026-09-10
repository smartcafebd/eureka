import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { ImageUploadBox } from '../common/ImageUploadBox';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  UploadCloud,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface AdminCategoriesProps {
  isEmbedded?: boolean;
}

// Curated high-resolution leather footwear photos for fast 1-click selection
const PRESET_LEATHER_SHOES = [
  {
    label: 'প্রিমিয়াম লেদার স্যান্ডেল (Cross Strap)',
    categoryHint: 'Sandal',
    url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'ডার্ক এসপ্রেসো লেদার স্যান্ডেল',
    categoryHint: 'Sandal',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'হ্যান্ডমেড ট্যান পেনি লোফার (Loafer)',
    categoryHint: 'Loafer',
    url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'টাসেল ব্ল্যাক লেদার লোফার',
    categoryHint: 'Loafer',
    url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'এক্সিকিউটিভ ফর্মাল অক্সফোর্ড শুজ (Formal)',
    categoryHint: 'Formal Shoes',
    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'কগনাক ব্রগ ফর্মাল ডার্বি',
    categoryHint: 'Formal Shoes',
    url: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'ক্লার্ক সাইকেল ক্যাজুয়াল শুজ (Casual)',
    categoryHint: 'Casual Shoes',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'হালকা ওজনের লেদার ওয়াকিং শুজ',
    categoryHint: 'Casual Shoes',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'হ্যান্ডক্রাফটেড চেলসি লেদার বুটস',
    categoryHint: 'Boots',
    url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=85',
  },
];

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ isEmbedded = false }) => {
  const { categories, saveCategory, deleteCategory, products, currentAdmin } = useStore();

  // Edit / Add Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(true);

  // Notifications
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  // Open modal for editing existing category
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormImage(cat.image);
    setFormDescription(cat.description || '');
    setFormFeatured(cat.featured ?? true);
    setIsEditorOpen(true);
  };

  // Open modal for direct image change on a specific category
  const handleOpenQuickChangeImage = (cat: Category) => {
    handleOpenEdit(cat);
  };

  // Open modal for creating new category
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormImage(PRESET_LEATHER_SHOES[0].url);
    setFormDescription('');
    setFormFeatured(true);
    setIsEditorOpen(true);
  };

  // Auto-generate slug when name changes in create mode
  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingCategory) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(slug);
    }
  };

  // Save submit
  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('ক্যাটাগরির নাম প্রদান করুন');
      return;
    }

    if (!formImage.trim()) {
      alert('ক্যাটাগরির ছবি প্রদান করুন (ফাইল আপলোড বা URL দিন)');
      return;
    }

    const finalSlug = formSlug.trim() || formName.toLowerCase().trim().replace(/\s+/g, '-');
    const categoryId = editingCategory ? editingCategory.id : `cat-${Date.now()}`;

    const updatedCategory: Category = {
      id: categoryId,
      name: formName.trim(),
      slug: finalSlug,
      image: formImage.trim(),
      description: formDescription.trim() || undefined,
      featured: formFeatured,
    };

    saveCategory(updatedCategory, currentAdmin?.name || 'Admin');
    setIsEditorOpen(false);
    showNotice(
      editingCategory
        ? `"${updatedCategory.name}" ক্যাটাগরির ছবি ও তথ্য আপডেট হয়েছে!`
        : `নতুন ক্যাটাগরি "${updatedCategory.name}" তৈরি ও ছবি সেট করা হয়েছে!`
    );
  };

  // Delete category confirm
  const handleDelete = (cat: Category) => {
    const productCount = products.filter((p) => p.category === cat.name).length;
    let confirmMsg = `আপনি কি নিশ্চিত যে "${cat.name}" ক্যাটাগরিটি মুছে ফেলতে চান?`;
    if (productCount > 0) {
      confirmMsg += `\nসতর্কতা: এই ক্যাটাগরিতে ${productCount} টি জুতো যুক্ত আছে!`;
    }

    if (window.confirm(confirmMsg)) {
      deleteCategory(cat.id, currentAdmin?.name || 'Admin');
      showNotice(`ক্যাটাগরি "${cat.name}" মুছে ফেলা হয়েছে।`);
    }
  };

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : ''}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                ক্যাটাগরি ছবি ও কভার ম্যানেজমেন্ট (Category Images)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                হোমপেজের <strong>"POPULAR CATEGORIES"</strong> সেকশনের ছবি পরিবর্তন করুন, ফাইল আপলোড করুন বা নতুন ক্যাটাগরি তৈরি করুন।
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {noticeMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{noticeMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> নতুন ক্যাটাগরি যোগ করুন
          </button>
        </div>
      </div>

      {/* Categories Cards Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-amber-500 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Category Live Preview Area */}
              <div>
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-stone-900">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold rounded-md">
                      #{cat.slug}
                    </span>
                    {cat.featured !== false && (
                      <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 bg-white/90 text-stone-900 text-[10px] font-bold rounded-md shadow-xs">
                      {productCount} টি জুতো
                    </span>
                  </div>

                  {/* Bottom Title & Direct Change Hover Button */}
                  <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
                    <h3 className="text-white font-extrabold text-lg sm:text-xl drop-shadow-sm">
                      {cat.name}
                    </h3>
                    <p className="text-white/80 text-[11px] line-clamp-1">
                      {cat.description || 'খাঁটি চামড়ার জুতো কালেকশন'}
                    </p>

                    {/* Quick Image Change Button Overlay */}
                    <button
                      type="button"
                      onClick={() => handleOpenQuickChangeImage(cat)}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> ছবি পরিবর্তন করুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Bottom Management Footer */}
              <div className="p-3 bg-stone-50 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-white rounded-md border border-transparent hover:border-gray-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-stone-500" /> তথ্য এডিট
                </button>

                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                    title="ক্যাটাগরি মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Editor & Image Upload Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingCategory ? `"${editingCategory.name}" এর ছবি ও তথ্য এডিট` : 'নতুন ক্যাটাগরি ও ছবি যুক্ত করুন'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    হোমপেজে প্রদর্শিত ক্যাটাগরি কাভার ফটো পরিবর্তন ও সেভ করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Image Input Section (Upload / URL / Live Preview) */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" /> ক্যাটাগরি ছবি (Category Cover Photo)
                  </label>
                  <span className="text-[11px] text-stone-500 font-medium">
                    অনুপাত: ৪:৫ (যেমন 800x1000px)
                  </span>
                </div>

                {/* Direct Image Upload Box (Drag-and-Drop or File Picker) */}
                <ImageUploadBox
                  label="কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট / ড্রপ করুন (PNG, JPG, WebP):"
                  value={formImage}
                  onChange={(newUrl) => setFormImage(newUrl)}
                  onRemove={() => setFormImage('')}
                  aspectRatio="category"
                  helperText="ফাইল নির্বাচন করুন অথবা সরাসরি ড্রপ করুন"
                />

                {/* Preset Suggestions */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> রেডিমেড হাই-কোয়ালিটি লেদার জুতো স্যাম্পল (১-ক্লিকে সিলেক্ট করুন):
                    </label>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PRESET_LEATHER_SHOES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className={`group relative aspect-4/5 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          formImage === preset.url
                            ? 'border-amber-600 ring-2 ring-amber-400'
                            : 'border-stone-200 hover:border-amber-400'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-end p-1">
                          <span className="text-[9px] text-white font-bold truncate leading-tight">
                            {preset.categoryHint}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    ক্যাটাগরির নাম (Category Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="যেমন: Sandal, Loafer, Formal Shoes..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    ইউআরএল স্লাগ (Slug)
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="sandal, loafer, formal-shoes..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="যেমন: খাঁটি চামড়ার তৈরি আরামদায়ক ক্যাজুয়াল স্যান্ডেল"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-featured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="cat-featured" className="text-xs font-medium text-stone-800 cursor-pointer">
                  হোমপেজের <strong>"POPULAR CATEGORIES"</strong> সেকশনে দেখান (Featured)
                </label>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> সংরক্ষণ করুন (Save Category)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
