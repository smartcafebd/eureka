import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  Zap,
  ShoppingBag,
  Ruler,
  Phone,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  Share2,
  ThumbsUp,
  MessageSquarePlus,
  MessageCircle,
  FileText,
  Sparkles,
  Send,
  UserCheck,
  HelpCircle,
  Award,
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { getProductReviews, addCustomerReview, calculateReviewStats } from '../data/reviews';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: string, quantity: number) => void;
  onProceedToOrder: (product: Product, size: number, color: string, quantity: number) => void;
  onOpenSizeGuide: () => void;
  onReviewAdded?: (product: Product, newReview: ProductReview) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  product,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onProceedToOrder,
  onOpenSizeGuide,
  onReviewAdded,
}) => {
  const availableColors = (product?.colors || []).filter(
    (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
  );
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<number>(41);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Tabs: 'description' | 'reviews'
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  // Reviews state for this specific product
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState<boolean>(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Review form inputs
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewLocation, setReviewLocation] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewRecommended, setReviewRecommended] = useState<boolean>(true);
  const [reviewFormSuccess, setReviewFormSuccess] = useState<boolean>(false);
  const [reviewFormError, setReviewFormError] = useState<string>('');

  const reviewFormRef = useRef<HTMLDivElement>(null);

  // Load reviews and initialize state when a new product is selected
  useEffect(() => {
    if (product) {
      const valid = (product.colors || []).filter(
        (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
      );
      setSelectedImageIdx(0);
      setSelectedSize(product.sizes[0] || 41);
      setSelectedColor(valid[0]?.name || 'Standard');
      setQuantity(1);
      setActiveTab('description');
      setCopiedLink(false);
      setIsWriteReviewOpen(false);
      setReviewFormSuccess(false);
      setReviewFormError('');
      setReviewRating(5);
      setReviewAuthor('');
      setReviewLocation('');
      setReviewComment('');
      setReviewRecommended(true);

      // Load product reviews
      const loaded = getProductReviews(product.id);
      setReviews(loaded);
    }
  }, [product]);

  // Review stats calculation
  const reviewStats = useMemo(() => {
    return calculateReviewStats(reviews);
  }, [reviews]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const savingsAmount = product.originalPrice > product.price ? product.originalPrice - product.price : 0;

  const handleOrderClick = () => {
    onProceedToOrder(product, selectedSize, selectedColor, quantity);
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenReviewsTab = () => {
    setActiveTab('reviews');
  };

  const handleOpenReviewForm = () => {
    setActiveTab('reviews');
    setIsWriteReviewOpen(true);
    setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim()) {
      setReviewFormError('অনুগ্রহ করে আপনার নাম প্রদান করুন');
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 5) {
      setReviewFormError('অনুগ্রহ করে জুতোর মান বা অভিজ্ঞতা সম্পর্কে অন্তত কয়েকটি কথা লিখুন');
      return;
    }

    setReviewFormError('');

    const newReview = addCustomerReview({
      productId: product.id,
      author: reviewAuthor.trim(),
      location: reviewLocation.trim() || 'বাংলাদেশ',
      rating: reviewRating,
      comment: reviewComment.trim(),
      recommended: reviewRecommended,
      sizeBought: selectedSize,
      colorBought: selectedColor,
    });

    // Update local reviews list
    setReviews((prev) => [newReview, ...prev]);
    setReviewFormSuccess(true);
    setIsWriteReviewOpen(false);

    // Reset form
    setReviewAuthor('');
    setReviewLocation('');
    setReviewComment('');
    setReviewRating(5);

    if (onReviewAdded) {
      onReviewAdded(product, newReview);
    }

    setTimeout(() => {
      setReviewFormSuccess(false);
    }, 5000);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return '৫ - অসাধারণ! (Excellent)';
      case 4:
        return '৪ - খুব ভালো (Very Good)';
      case 3:
        return '৩ - ভালো (Good)';
      case 2:
        return '২ - মোটামুটি (Fair)';
      case 1:
        return '১ - প্রত্যাশানুযায়ী নয় (Poor)';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        id="product-detail-modal"
        className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl z-10 overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-[#fdfdfd]">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="text-[#e30613] font-bold">eureka</span>
            <span>/</span>
            <span>{product.category}</span>
            {product.subCategory && (
              <>
                <span>/</span>
                <span className="hidden sm:inline">{product.subCategory}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative cursor-pointer"
              title="লিংক কপি করুন"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 bg-black text-white text-[10px] py-0.5 px-2 rounded whitespace-nowrap shadow-md">
                  কপি হয়েছে!
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isWishlisted
                  ? 'text-[#e30613] bg-red-50'
                  : 'text-gray-400 hover:text-[#e30613] hover:bg-gray-100'
              }`}
              title={isWishlisted ? 'উইশলিস্ট থেকে মুছুন' : 'উইশলিস্টে যুক্ত করুন'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              id="close-product-modal-btn"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          
          {/* Main Top Section: Images Gallery on Left, Core Details & Purchase Actions on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pb-6 border-b border-gray-200">
            
            {/* Left Column: Product Photos & Gallery (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              {/* Main Image Stage */}
              <div className="relative aspect-square w-full bg-[#f8f8f8] rounded-xl overflow-hidden border border-gray-200 group">
                <img
                  src={getSafeProductImageUrl(product.images?.[selectedImageIdx], product.category, product.images?.[0])}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, product.category)}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {product.isHotDeal && (
                    <span className="bg-[#b20000] text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm uppercase tracking-wide animate-pulse">
                      HOT DEAL
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-[#e30613] text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  <span className="bg-black/85 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs backdrop-blur-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-yellow-400" />
                    ১০০% আসল চামড়া
                  </span>
                </div>
              </div>

              {/* Thumbnail Selector */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImageIdx === idx
                          ? 'border-[#e30613] ring-2 ring-red-100 shadow-sm'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getSafeProductImageUrl(img, product.category)}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, product.category)}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Trust Highlights */}
              <div className="p-3 bg-[#fafafa] rounded-xl border border-gray-100 text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Truck className="w-4 h-4 text-[#e30613] shrink-0" />
                  <span>সারা দেশে <strong>ক্যাশ অন ডেলিভারি</strong> সুবিধা</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <PackageCheck className="w-4 h-4 text-[#e30613] shrink-0" />
                  <span>প্যাকেট খুলে <strong>চেক করে মূল্য পরিশোধ</strong> করবেন</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <RotateCcw className="w-4 h-4 text-[#e30613] shrink-0" />
                  <span>সাইজ না মিললে <strong>৭ দিনের ফ্রি এক্সচেঞ্জ</strong></span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Rating, Price, Size Selection & Order Now button (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand & Stock */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e30613] bg-red-50 px-2.5 py-0.5 rounded-full">
                    eureka Footwear
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>স্টকে আছে ({product.stockCount || 15}+ টি মজুদ)</span>
                  </div>
                </div>

                {/* Product Title */}
                <h1
                  id="product-modal-title"
                  className="text-lg sm:text-2xl font-heading font-extrabold text-[#1a1a1a] tracking-tight leading-snug"
                >
                  {product.name}
                </h1>

                {/* Rating & Review Link Header */}
                <div className="flex items-center flex-wrap gap-2 mt-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={handleOpenReviewsTab}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(reviewStats.average)
                            ? 'fill-[#fcb900] text-[#fcb900]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{reviewStats.average}</span>
                  <button
                    type="button"
                    onClick={handleOpenReviewsTab}
                    className="text-xs text-gray-600 hover:text-[#e30613] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>({reviewStats.totalCount} কাস্টমার রিভিউ)</span>
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={handleOpenReviewForm}
                    className="text-xs font-bold text-[#e30613] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>রিভিউ লিখুন</span>
                  </button>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">SKU: <strong className="text-gray-700">{product.sku}</strong></span>
                </div>

                {/* Price Display */}
                <div className="my-2.5 sm:my-3.5 p-2.5 sm:p-3.5 bg-red-50/60 rounded-xl border border-red-100 flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2 sm:gap-3">
                    <span className="text-xl sm:text-3xl font-heading font-extrabold text-[#e30613] leading-none">
                      ৳ {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs sm:text-base text-gray-400 line-through leading-none">
                        ৳ {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {savingsAmount > 0 && (
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shrink-0">
                      ৳ {savingsAmount.toLocaleString()} সাশ্রয়!
                    </span>
                  )}
                </div>

                {/* Size Selection */}
                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      সাইজ নির্বাচন করুন (Size): <span className="text-[#e30613]">{selectedSize}</span>
                    </label>
                    <button
                      type="button"
                      onClick={onOpenSizeGuide}
                      className="text-[11px] text-[#e30613] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>সাইজ গাইড দেখুন</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] h-10 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#e30613] text-white shadow-md ring-2 ring-red-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection (if available) */}
                {availableColors && availableColors.length > 0 && (
                  <div className="mb-3.5">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                      কালার নির্বাচন করুন (Color): <span className="text-[#e30613]">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedColor === c.name
                              ? 'bg-black text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">পরিমাণ:</span>
                  <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 text-sm font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-gray-900 bg-white min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 text-sm font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    মোট: <strong className="text-gray-900">৳ {(product.price * quantity).toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Order Now (opens order form) & Add to Cart */}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                {/* Step Transition: Proceed to Order Form */}
                <button
                  type="button"
                  id="modal-order-now-btn"
                  onClick={handleOrderClick}
                  className="w-full py-3.5 px-6 bg-[#e30613] hover:bg-[#c20510] active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Zap className="w-5 h-5 fill-current text-yellow-300 animate-bounce" />
                  <span>অর্ডার করুন (Order Now - ক্যাশ অন ডেলিভারি)</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="text-[11px] text-center text-gray-500">
                  👆 বাটনে ক্লিক করে পরবর্তী ধাপে ডেলিভারির নাম, ঠিকানা ও ফোন নম্বর প্রদান করুন
                </p>

                {/* Secondary Button: Add to Cart */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-gray-600" />
                    <span>কার্টে যোগ করুন (Add to Cart)</span>
                  </button>
                  
                  <a
                    href="tel:01800EUREKA"
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                    title="ফোনে অর্ডার করুন"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">ফোনে অর্ডার</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* SECOND SECTION: Interactive Tabs for Description, Customer Reviews, Specs, Delivery */}
          <div className="mt-8">
            
            {/* Tabs Navigation Header */}
            <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'description'
                    ? 'border-[#e30613] text-[#e30613]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>বিস্তারিত বিবরণ (Description)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#e30613] text-[#e30613]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>কাস্টমার রিভিউ ({reviewStats.totalCount})</span>
                <span className="bg-red-50 text-[#e30613] text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  {reviewStats.average} ★
                </span>
              </button>
            </div>

            {/* TAB 1: PRODUCT DESCRIPTION & KEY HIGHLIGHTS */}
            {activeTab === 'description' && (
              <div className="py-6 space-y-6 animate-in fade-in duration-200">
                
                {/* Full Description Box */}
                <div className="bg-gray-50/80 rounded-2xl p-5 sm:p-6 border border-gray-200">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e30613]" />
                    <span>জুতোটির বিশেষত্ব ও বিস্তারিত বিবরণ</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed sm:leading-loose">
                    {product.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>১০০% খাঁটি গরুর চামড়া:</strong> দীর্ঘস্থায়ী, টেকসই ও শ্বাস-প্রশ্বাস উপযোগী প্রিমিয়াম লেদার।
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>অ্যান্টি-স্কিড গ্রিপ সোল:</strong> ভেজা বা মসৃণ মেঝেতেও পিছলে না গিয়ে দৃঢ় ব্যালান্স প্রদান করে।
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>সফট মেমোরি কুশন:</strong> দীর্ঘ সময় দাঁড়িয়ে বা হেঁটে কাটালেও পায়ে আরাম বজায় রাখে।
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>হাতে সেলাই নিখুঁত ফিনিশিং:</strong> আন্তর্জাতিক মানের দক্ষ কারিগর দ্বারা প্রস্তুতকৃত।
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Customer Review Teaser Banner inside Description */}
                <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 rounded-xl p-4 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e30613] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      ★ {reviewStats.average}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        {reviewStats.totalCount} জন গ্রাহক এই জুতোটির রিভিউ দিয়েছেন!
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        {reviewStats.recommendPercent}% কাস্টমার জুতোটি কেনার সুপারিশ করেছেন
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenReviewsTab}
                      className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-lg border border-gray-200 shadow-xs transition-colors cursor-pointer"
                    >
                      রিভিউগুলো পড়ুন
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenReviewForm}
                      className="px-3.5 py-2 bg-[#e30613] hover:bg-[#c20510] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>রিভিউ দিন</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: CUSTOMER REVIEWS & WRITE A REVIEW */}
            {activeTab === 'reviews' && (
              <div className="py-6 space-y-6 animate-in fade-in duration-200">
                
                {/* Success Banner when Review is submitted */}
                {reviewFormSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in zoom-in-95">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block font-bold">ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে প্রকাশিত হয়েছে।</strong>
                      <span>অন্যান্য গ্রাহকদের সঠিক জুতো বেছে নিতে আপনার মতামত দারুণ সহায়তা করবে।</span>
                    </div>
                  </div>
                )}

                {/* Rating Overview Card */}
                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Score summary */}
                    <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6">
                      <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <span className="text-4xl sm:text-5xl font-heading font-extrabold text-[#1a1a1a]">
                          {reviewStats.average}
                        </span>
                        <span className="text-gray-400 text-sm font-semibold">/ ৫.০</span>
                      </div>

                      <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(reviewStats.average)
                                ? 'fill-[#fcb900] text-[#fcb900]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-gray-500">
                        সর্বমোট <strong>{reviewStats.totalCount}</strong> টি ভেরিফাইড রিভিউ এর ভিত্তিতে
                      </p>
                      
                      <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 py-1 px-2 rounded inline-block">
                        ✓ {reviewStats.recommendPercent}% গ্রাহক সন্তুষ্ট
                      </div>
                    </div>

                    {/* Star Breakdown Bars */}
                    <div className="md:col-span-5 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviewStats.distribution[stars] || 0;
                        const pct = reviewStats.totalCount > 0 ? (count / reviewStats.totalCount) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="w-7 font-bold flex items-center gap-0.5">
                              {stars} <Star className="w-3 h-3 fill-[#fcb900] text-[#fcb900]" />
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#fcb900] rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-8 text-right font-medium text-gray-400">{count}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Write Review Button / CTA */}
                    <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center">
                      <button
                        type="button"
                        id="open-write-review-btn"
                        onClick={() => setIsWriteReviewOpen((prev) => !prev)}
                        className="w-full sm:w-auto px-5 py-3 bg-[#e30613] hover:bg-[#c20510] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <MessageSquarePlus className="w-4 h-4" />
                        <span>{isWriteReviewOpen ? 'ফর্ম বন্ধ করুন' : 'একটি রিভিউ দিন'}</span>
                      </button>
                      <span className="text-[10px] text-gray-400 mt-1.5 text-center md:text-right">
                        আপনার মতামত আমাদের জন্য অমূল্য
                      </span>
                    </div>

                  </div>
                </div>

                {/* EXPANDABLE REVIEW FORM */}
                {isWriteReviewOpen && (
                  <div
                    ref={reviewFormRef}
                    className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-red-200 shadow-xl animate-in slide-in-from-top-4 duration-300"
                  >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#e30613] flex items-center justify-center">
                          <MessageSquarePlus className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900">
                            প্রোডাক্টটির জন্য রিভিউ লিখুন
                          </h3>
                          <p className="text-[11px] text-gray-500">
                            {product.name}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsWriteReviewOpen(false)}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {reviewFormError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                        ⚠️ {reviewFormError}
                      </div>
                    )}

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      
                      {/* Interactive Star Rating Selector */}
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                          আপনার রেটিং নির্বাচন করুন <span className="text-[#e30613]">*</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-hidden"
                            >
                              <Star
                                className={`w-7 h-7 sm:w-8 sm:h-8 ${
                                  star <= (hoverRating || reviewRating)
                                    ? 'fill-[#fcb900] text-[#fcb900]'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-xs font-bold text-gray-700">
                            {getRatingLabel(hoverRating || reviewRating)}
                          </span>
                        </div>
                      </div>

                      {/* Name & City Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
                            আপনার নাম <span className="text-[#e30613]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            placeholder="যেমন: তানভীর আহমেদ"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#e30613] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
                            আপনার শহর / জেলা (ঐচ্ছিক)
                          </label>
                          <input
                            type="text"
                            value={reviewLocation}
                            onChange={(e) => setReviewLocation(e.target.value)}
                            placeholder="যেমন: মিরপুর, ঢাকা"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#e30613] focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Review Comment / Feedback */}
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
                          আপনার অভিজ্ঞতা ও মতামত লিখুন <span className="text-[#e30613]">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="চামড়ার কোয়ালিটি কেমন লেগেছে? সোলটি কি আরামদায়ক? সাইজ ঠিকমতো মিলেছে কি না লিখুন..."
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#e30613] focus:outline-hidden"
                        />
                      </div>

                      {/* Recommend Checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={reviewRecommended}
                          onChange={(e) => setReviewRecommended(e.target.checked)}
                          className="w-4 h-4 text-[#e30613] rounded border-gray-300 focus:ring-[#e30613]"
                        />
                        <span className="text-xs text-gray-700 font-medium">
                          হ্যাঁ, আমি অন্যদের এই জুতোটি কেনার জন্য সুপারিশ করছি।
                        </span>
                      </label>

                      {/* Submit Actions */}
                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsWriteReviewOpen(false)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          বাতিল করুন
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#e30613] hover:bg-[#c20510] text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>রিভিউ জমা দিন (Submit Review)</span>
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* CUSTOMER REVIEWS LIST */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>গ্রাহকদের রিভিউ ও মতামত ({reviews.length} টি)</span>
                    </h3>
                    <span className="text-xs text-gray-400">সকল রিভিউ ১০০% আসল ক্রেতাদের</span>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
                      <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-medium">
                        এখনো কোনো রিভিউ যোগ করা হয়নি। আপনিই প্রথম রিভিউ দিন!
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsWriteReviewOpen(true)}
                        className="mt-3 px-4 py-1.5 bg-[#e30613] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        প্রথম রিভিউটি লিখুন
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-xs"
                        >
                          {/* Reviewer Header */}
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-3">
                              {/* Avatar circle */}
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs">
                                {rev.author.substring(0, 2)}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                    {rev.author}
                                  </h4>
                                  {rev.verified !== false && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      ভেরিফাইড ক্রেতা
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                  {rev.location && <span>{rev.location}</span>}
                                  {rev.location && <span>•</span>}
                                  <span>{rev.date}</span>
                                </div>
                              </div>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= rev.rating
                                      ? 'fill-[#fcb900] text-[#fcb900]'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Purchase details tag if available */}
                          {(rev.sizeBought || rev.colorBought) && (
                            <div className="mb-2 flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded w-fit">
                              {rev.sizeBought && <span>সাইজ: <strong>{rev.sizeBought}</strong></span>}
                              {rev.sizeBought && rev.colorBought && <span>|</span>}
                              {rev.colorBought && <span>কালার: <strong>{rev.colorBought}</strong></span>}
                            </div>
                          )}

                          {/* Review Text */}
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            "{rev.comment}"
                          </p>

                          {/* Thumbs up / Helpful footer */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                            {rev.recommended !== false ? (
                              <span className="text-emerald-700 font-medium flex items-center gap-1">
                                <Check className="w-3 h-3" /> জুতোটি কেনার জন্য সুপারিশ করেছেন
                              </span>
                            ) : <span />}

                            <button
                              type="button"
                              onClick={() => handleHelpfulClick(rev.id)}
                              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                              title="রিভিউটি সহায়ক মনে হয়েছে"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>সহায়ক ({helpfulVotes[rev.id] || 0})</span>
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

        {/* Bottom Bar with Fast Order Button */}
        <div className="bg-[#1f1f1f] text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">কোনো অগ্রিম পেমেন্ট ছাড়াই ১০০% ক্যাশ অন ডেলিভারি</span>
            <span className="sm:hidden">১০০% ক্যাশ অন ডেলিভারি</span>
          </div>

          <button
            type="button"
            onClick={handleOrderClick}
            className="px-5 py-2 bg-[#e30613] hover:bg-[#c20510] text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
          >
            <Zap className="w-4 h-4 fill-current text-yellow-300" />
            <span>অর্ডার করুন (৳ {product.price.toLocaleString()})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
