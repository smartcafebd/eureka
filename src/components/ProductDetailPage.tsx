import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  Zap,
  ShoppingBag,
  ShoppingCart,
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
  ChevronRight,
  Clock,
  ExternalLink,
  Edit2,
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';
import { getProductReviews, addCustomerReview, calculateReviewStats } from '../data/reviews';
import { ProductEditModal } from './ProductEditModal';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  isWishlisted: boolean;
  onBack: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: string, quantity: number) => void;
  onProceedToOrder: (product: Product, size: number, color: string, quantity: number) => void;
  onOpenSizeGuide: () => void;
  onSelectProduct: (product: Product) => void;
  onReviewAdded?: (product: Product, newReview: ProductReview) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  isWishlisted,
  onBack,
  onToggleWishlist,
  onAddToCart,
  onProceedToOrder,
  onOpenSizeGuide,
  onSelectProduct,
  onReviewAdded,
  onUpdateProduct,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const availableColors = (product.colors || []).filter(
    (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
  );
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 41);
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0]?.name || 'Standard');
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

  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const reviewFormRef = useRef<HTMLDivElement>(null);

  // When product changes, reset states and scroll to top
  useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedSize(product.sizes[0] || 41);
    const validColors = (product.colors || []).filter(
      (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
    );
    setSelectedColor(validColors[0]?.name || 'Standard');
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

    const loaded = getProductReviews(product.id);
    setReviews(loaded);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Computed Review Stats
  const reviewStats = useMemo(() => {
    return calculateReviewStats(reviews);
  }, [reviews]);

  // Related products from same category or popular
  const relatedProducts = useMemo(() => {
    const fromCategory = allProducts.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    if (fromCategory.length >= 4) {
      return fromCategory.slice(0, 4);
    }
    const remaining = allProducts.filter(
      (p) => p.id !== product.id && !fromCategory.some((c) => c.id === p.id)
    );
    return [...fromCategory, ...remaining].slice(0, 4);
  }, [allProducts, product.id, product.category]);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const savingsAmount = product.originalPrice - product.price;

  // Handler: Share product link
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Handler: Direct Cash on Delivery Checkout
  const handleOrderClick = () => {
    onProceedToOrder(product, selectedSize, selectedColor, quantity);
  };

  // Handler: Add to shopping bag
  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
  };

  // Handler: Scroll to reviews tab and open review form
  const handleOpenReviewsTab = () => {
    setActiveTab('reviews');
    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenReviewForm = () => {
    setActiveTab('reviews');
    setIsWriteReviewOpen(true);
    setTimeout(() => {
      if (reviewFormRef.current) {
        reviewFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Handler: Submit a new review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewFormError('');

    if (!reviewAuthor.trim()) {
      setReviewFormError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 10) {
      setReviewFormError('অনুগ্রহ করে জুতোর অভিজ্ঞতা সম্পর্কে অন্তত ১০ অক্ষরের মন্তব্য লিখুন।');
      return;
    }

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

    setReviews((prev) => [newReview, ...prev]);
    setReviewFormSuccess(true);
    setIsWriteReviewOpen(false);

    setReviewAuthor('');
    setReviewLocation('');
    setReviewComment('');
    setReviewRating(5);
    setReviewRecommended(true);

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
    <div className="bg-[#fcfbf9] min-h-screen text-[#2d2d2d] pb-24 lg:pb-16 animate-in fade-in duration-300">
      
      {/* 1. TOP BREADCRUMB & BACK ACTION BAR */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={onBack}
              className="font-bold text-[#e30613] hover:underline flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোম / সকল জুতো</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <span className="font-medium text-gray-600 shrink-0">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <span className="font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          {/* Quick Actions (Share & Wishlist & Edit) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Edit Product Info Button */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="প্রোডাক্টের নাম, মূল্য, স্টক ও বিবরণ এডিট করুন"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-700" />
              <span>তথ্য এডিট করুন</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="লিংক কপি করুন"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">শেয়ার করুন</span>
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-black text-white text-[11px] py-1 px-2 rounded whitespace-nowrap shadow-md z-50">
                  লিংক কপি হয়েছে!
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                isWishlisted
                  ? 'text-[#e30613] bg-red-50'
                  : 'text-gray-600 hover:text-[#e30613] hover:bg-gray-100'
              }`}
              title={isWishlisted ? 'উইশলিস্টে যুক্ত আছে' : 'উইশলিস্টে যুক্ত করুন'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#e30613]' : ''}`} />
              <span className="hidden sm:inline">{isWishlisted ? 'সংরক্ষিত' : 'উইশলিস্ট'}</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ফিরে যান</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN PRODUCT OVERVIEW SHOWCASE CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Main Grid: Left Gallery + Right Purchase Box */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: IMAGE GALLERY (5 Columns on desktop) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
            
            {/* Featured Main Image Box */}
            <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center group shadow-xs">
              <img
                src={getSafeProductImageUrl(product.images?.[selectedImageIdx], product.category, product.images?.[0])}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 select-none"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, product.category)}
              />

              {/* Floating Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                <span className="bg-[#b71218] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.badge || '১০০% জেনুইন লেদার'}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-amber-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-md w-fit">
                    {discountPercent}% ছাড়!
                  </span>
                )}
              </div>

              {/* COD Watermark Tag */}
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>পার্সেল খুলে চেক করে পেমেন্ট</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-[#e30613] shadow-md ring-2 ring-red-100'
                        : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getSafeProductImageUrl(img, product.category)}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, product.category)}
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT: PRODUCT INFO & FAST ORDER BOX (7 Columns on desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between">
            <div>
              
              {/* Category, SKU & In Stock */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#e30613] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">
                    SKU: <strong className="text-gray-800">{product.sku}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="ml-1 px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="প্রোডাক্ট তথ্য এডিট ও সেভ করুন"
                  >
                    <Edit2 className="w-3 h-3 text-amber-700" />
                    <span>এডিট</span>
                  </button>
                </div>

                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  স্টকে রয়েছে (In Stock)
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Review Counter Bar */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/70">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(product.rating)
                            ? 'fill-[#fcb900] text-[#fcb900]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 ml-1">{product.rating}</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenReviewsTab}
                  className="text-xs font-semibold text-gray-600 hover:text-[#e30613] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>({reviewStats.totalCount} টি কাস্টমার রিভিউ)</span>
                </button>

                <span className="text-gray-300">•</span>

                <button
                  type="button"
                  onClick={handleOpenReviewForm}
                  className="text-xs font-bold text-[#e30613] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>একটি রিভিউ দিন</span>
                </button>
              </div>

              {/* Price Display Banner */}
              <div className="my-2.5 sm:my-5 p-2.5 px-3 sm:p-5 bg-gradient-to-r from-red-50/80 via-red-50/40 to-white rounded-xl sm:rounded-2xl border border-red-100 flex items-center justify-between gap-2 sm:gap-4">
                <div>
                  <span className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-0.5">বিশেষ অফার মূল্য:</span>
                  <div className="flex items-baseline gap-2 sm:gap-3">
                    <span className="text-xl sm:text-4xl font-heading font-black text-[#e30613] leading-none">
                      ৳ {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs sm:text-lg text-gray-400 line-through leading-none">
                        ৳ {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {savingsAmount > 0 && (
                  <div className="text-right shrink-0">
                    <span className="inline-block bg-emerald-600 text-white text-[10px] sm:text-sm font-bold px-2 py-0.5 sm:px-3 sm:py-1.5 rounded sm:rounded-lg shadow-xs leading-tight">
                      ৳ {savingsAmount.toLocaleString()} সাশ্রয়!
                    </span>
                    <span className="block text-[9px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1">ক্যাশ অন ডেলিভারি প্রযোজ্য</span>
                  </div>
                )}
              </div>

              {/* Size Selector */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <span>সাইজ নির্বাচন করুন:</span>
                    <span className="text-[#e30613] text-base font-extrabold">{selectedSize}</span>
                  </label>

                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-xs text-[#e30613] font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-red-50 px-2.5 py-1 rounded-md border border-red-100"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>সাইজ চার্ট / গাইড দেখুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3 max-w-md">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-xl text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#e30613] text-white shadow-md ring-2 ring-red-200 scale-105'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  * জুতোটি সাধারণ স্ট্যান্ডার্ড সাইজে তৈরি। নিয়মিত যে সাইজ পরেন সেই সাইজটি বেছে নিন।
                </p>
              </div>

              {/* Color Selector */}
              {availableColors && availableColors.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                    কালার (Color): <span className="text-[#e30613]">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {availableColors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                          selectedColor === c.name
                            ? 'bg-black text-white shadow-md ring-2 ring-gray-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs inline-block"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">পরিমাণ:</span>
                <div className="inline-flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-3.5 py-2 text-gray-700 hover:bg-gray-200 text-base font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-sm font-bold text-gray-900 bg-white min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-3.5 py-2 text-gray-700 hover:bg-gray-200 text-base font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  মোট: <strong>৳ {(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>

              {/* PRIMARY ACTION BUTTONS */}
              <div className="space-y-3 pt-2">
                
                {/* 1-Click Cash on Delivery Order Button */}
                <button
                  type="button"
                  id="direct-order-btn"
                  onClick={handleOrderClick}
                  className="w-full py-4 px-6 bg-[#e30613] hover:bg-[#c20510] active:scale-[0.99] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide"
                >
                  <Zap className="w-5 h-5 fill-current text-yellow-300 animate-pulse" />
                  <span>সরাসরি অর্ডার করুন - ক্যাশ অন ডেলিভারি (৳ {(product.price * quantity).toLocaleString()})</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  id="add-to-cart-page-btn"
                  onClick={handleAddToCartClick}
                  className="w-full py-3.5 px-6 bg-gray-900 hover:bg-black active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ব্যাগে যোগ করুন (Add to Cart)</span>
                </button>

              </div>

              {/* Direct Hotline & WhatsApp Assistance Strip */}
              <div className="mt-5 p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <a
                  href="tel:01800EUREKA"
                  className="flex items-center gap-2 text-gray-800 hover:text-[#e30613] font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#e30613]" />
                  <span>ফোনে অর্ডারে কল করুন: <strong>01800-EUREKA</strong></span>
                </a>

                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>সারা দেশে ফ্রি হোম ডেলিভারি</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. FULL-PAGE TABBED SECTIONS (DESCRIPTION, REVIEWS, SPECS, DELIVERY) */}
        <div ref={reviewSectionRef} className="mt-10 sm:mt-12">
          
          {/* Tab Navigation Header */}
          <div className="flex items-center gap-2 sm:gap-4 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white p-2 rounded-t-2xl shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`py-3 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'description'
                  ? 'bg-[#e30613] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>বিস্তারিত বিবরণ ও বৈশিষ্ট্য</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-[#e30613] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Star className="w-4 h-4 fill-current text-amber-300" />
              <span>কাস্টমার রিভিউ ({reviewStats.totalCount})</span>
            </button>
          </div>

          {/* Tab Content Panels Container */}
          <div className="bg-white rounded-b-2xl border-x border-b border-gray-200 p-6 sm:p-8 lg:p-10 shadow-xs min-h-[360px]">
            
            {/* TAB 1: PRODUCT FULL DESCRIPTION */}
            {activeTab === 'description' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Introduction Paragraph */}
                <div className="max-w-4xl space-y-4">
                  <h3 className="text-lg sm:text-xl font-heading font-extrabold text-gray-900">
                    {product.name} — রাজকীয় চামড়ার আভিজাত্য ও সারা দিনের আরাম
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    ইউরেকা লেদার ফুটওয়্যার প্রতিটি জুতো তৈরি করে অভিজ্ঞ কারিগরদের নিপুণ হাতের ছোঁয়ায়। এই জুতোটিতে ব্যবহৃত হয়েছে প্রিমিয়াম গ্রেড ১০০% জেনুইন কাউ লেদার, যা নরম, টেকসই এবং পায়ে চমৎকার আরাম দেয়। অফিস, মিটিং, সামাজিক অনুষ্ঠান কিংবা প্রতিদিনের দীর্ঘ হাঁটাচলায় এটি আপনার ব্যক্তিত্বে এনে দেবে প্রিমিয়াম আভিজাত্য।
                  </p>
                </div>

                {/* 4 Rich Feature Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 hover:border-red-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#e30613] flex items-center justify-center font-bold mb-3.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1.5">১০০% আসল চামড়া</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      খাঁটি কাউ লেদার আপার যা সহজে ফাটে না এবং বছরজুড়ে নতুনের মতো মসৃণ থাকে।
                    </p>
                  </div>

                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 hover:border-red-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold mb-3.5">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1.5">মেমোরি ফোম ইনসোল</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      বিশেষ নরম কুশন ইনসোল যা পায়ের চাপ শুষে নেয় এবং সারাদিন ক্লান্তিমুক্ত রাখে।
                    </p>
                  </div>

                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 hover:border-red-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold mb-3.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1.5">অ্যান্টি-স্কিড রাবার সোল</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      উচ্চমানের রাবার সোল যা টাইলস বা ভেজা রাস্তায় শক্ত গ্রিপ প্রদান করে এবং পা পিছলায় না।
                    </p>
                  </div>

                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 hover:border-red-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold mb-3.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1.5">হাতে সেলাইয়ের মজবুতি</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      কারিগরদের নিপুণ হাতে সেলাই যা জুতোকে দেয় দ্বিগুণ স্থায়িত্ব ও প্রিমিয়াম লুক।
                    </p>
                  </div>
                </div>

                {/* Key Features Bullet List */}
                <div className="bg-[#fcfbf9] rounded-2xl p-6 border border-gray-200/80">
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e30613]" />
                    <span>জুতোটির প্রধান বৈশিষ্ট্যসমূহ:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>আপার:</strong> প্রিমিয়াম কোয়ালিটি ১০০% জেনুইন মিল্ড/অয়েল কাউ লেদার</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>ইনার লাইনিং:</strong> শ্বাসপ্রশ্বাসযোগ্য সফট লেদার লাইনিং (পা ঘেমে দুর্গন্ধ হয় না)</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>সোল:</strong> ডাবল ডেনসিটি রাবার আউটসোল, দীর্ঘস্থায়ী ও ফ্লেক্সিবল</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>উপযোগিতা:</strong> পাঞ্জাবি, ফরমাল প্যান্ট, জিন্স কিংবা ক্যাজুয়াল সব পোশাকের সাথে মানানসই</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: CUSTOMER REVIEWS (FULL PAGE DASHBOARD) */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Review Success Notification */}
                {reviewFormSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block font-bold">ধন্যবাদ! আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে।</strong>
                      <span>আপনার মূল্যবান মতামত অন্য ক্রেতাদের সঠিক জুতোটি বেছে নিতে সাহায্য করবে।</span>
                    </div>
                  </div>
                )}

                {/* Rating Overview Analytics Box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50/70 rounded-2xl p-5 sm:p-7 border border-gray-200">
                  
                  {/* Left: Overall Score */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-gray-200">
                    <span className="text-5xl sm:text-6xl font-heading font-black text-gray-900 leading-none">
                      {reviewStats.average}
                    </span>
                    <div className="flex items-center gap-1 my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(Number(reviewStats.average))
                              ? 'fill-[#fcb900] text-[#fcb900]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                      {reviewStats.totalCount} জন ক্রেতার রেটিংয়ের ভিত্তিতে
                    </span>
                    <div className="mt-3 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      ৯৮% ক্রেতা এই জুতো কেনার সুপারিশ করেছেন
                    </div>
                  </div>

                  {/* Middle: Star Bars */}
                  <div className="md:col-span-5 flex flex-col justify-center space-y-2 text-xs">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviewStats.distribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
                      const percentage = reviewStats.totalCount > 0 ? Math.round((count / reviewStats.totalCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="w-12 font-medium text-gray-600 flex items-center gap-1 shrink-0">
                            {stars} <Star className="w-3 h-3 fill-[#fcb900] text-[#fcb900]" />
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-gray-500 text-[11px] shrink-0 font-medium">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Write Review Trigger */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">আপনার অভিজ্ঞতা শেয়ার করুন</h4>
                    <p className="text-xs text-gray-500 mb-3.5">
                      আপনি কি এই জুতোটি ব্যবহার করেছেন? একটি রিভিউ দিয়ে অন্যদের জানান।
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsWriteReviewOpen((prev) => !prev)}
                      className="w-full py-2.5 px-4 bg-[#e30613] hover:bg-[#c20510] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      <span>{isWriteReviewOpen ? 'রিভিউ ফর্ম বন্ধ করুন' : 'একটি রিভিউ দিন'}</span>
                    </button>
                  </div>

                </div>

                {/* WRITE A REVIEW FORM (EXPANDABLE) */}
                {isWriteReviewOpen && (
                  <div
                    ref={reviewFormRef}
                    className="p-5 sm:p-7 bg-white rounded-2xl border-2 border-red-200 shadow-md animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                          <MessageSquarePlus className="w-5 h-5 text-[#e30613]" />
                          <span>{product.name} সম্পর্কে আপনার রিভিউ লিখুন</span>
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          সঠিক ও খাঁটি মতামত দিন যাতে অন্যান্য ক্রেতারা আস্থা পেতে পারেন।
                        </p>
                      </div>
                    </div>

                    {reviewFormError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                        {reviewFormError}
                      </div>
                    )}

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      
                      {/* Star Rating Selection */}
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                          আপনার রেটিং নির্বাচন করুন: <span className="text-[#e30613]">{getRatingLabel(hoverRating || reviewRating)}</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
                              title={`${star} Star`}
                            >
                              <Star
                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform ${
                                  star <= (hoverRating || reviewRating)
                                    ? 'fill-[#fcb900] text-[#fcb900] scale-110'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            আপনার নাম *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: মো. রহিম উদ্দিন"
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#e30613]/20 focus:border-[#e30613] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            শহর / এলাকা (ঐচ্ছিক)
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: মিরপুর, ঢাকা / চট্টগ্রাম"
                            value={reviewLocation}
                            onChange={(e) => setReviewLocation(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#e30613]/20 focus:border-[#e30613] outline-none"
                          />
                        </div>
                      </div>

                      {/* Feedback comment */}
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          আপনার অভিজ্ঞতা ও মতামত *
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="জুতোর চামড়া, সোল, আরাম এবং ফিনিশিং কেমন লেগেছে লিখুন..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#e30613]/20 focus:border-[#e30613] outline-none leading-relaxed"
                        />
                      </div>

                      {/* Recommend Checkbox */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="recommend-checkbox"
                          checked={reviewRecommended}
                          onChange={(e) => setReviewRecommended(e.target.checked)}
                          className="w-4 h-4 text-[#e30613] rounded border-gray-300 focus:ring-[#e30613] cursor-pointer"
                        />
                        <label htmlFor="recommend-checkbox" className="text-xs text-gray-700 font-medium cursor-pointer">
                          আমি অন্যদের এই প্রিমিয়াম লেদার জুতোটি কেনার সুপারিশ করছি।
                        </label>
                      </div>

                      {/* Form Submit Button */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsWriteReviewOpen(false)}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#e30613] hover:bg-[#c20510] text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>রিভিউ জমা দিন</span>
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* VERIFIED CUSTOMER REVIEWS LIST */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>সকল গ্রাহক রিভিউ ({reviews.length})</span>
                    </h4>
                    <span className="text-xs text-gray-500">সবচেয়ে সাম্প্রতিক রিভিউ প্রথমে</span>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                      <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-700">এখনও কোনো রিভিউ দেওয়া হয়নি।</p>
                      <p className="text-xs text-gray-500 mt-1">প্রথম রিভিউটি দিয়ে অন্য ক্রেতাদের উৎসাহিত করুন!</p>
                      <button
                        type="button"
                        onClick={handleOpenReviewForm}
                        className="mt-3 px-4 py-2 bg-[#e30613] text-white text-xs font-bold rounded-xl hover:bg-[#c20510] transition-colors inline-flex items-center gap-1.5"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>প্রথম রিভিউ দিন</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all"
                        >
                          <div>
                            {/* Author & Header */}
                            <div className="flex items-start justify-between gap-3 mb-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-full bg-red-100/70 text-[#e30613] font-bold text-sm flex items-center justify-center shrink-0">
                                  {rev.author.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="text-sm font-bold text-gray-900">
                                      {rev.author}
                                    </h5>
                                    {rev.verified !== false && (
                                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        ভেরিফাইড ক্রেতা
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                                    {rev.location && <span>{rev.location}</span>}
                                    {rev.location && <span>•</span>}
                                    <span>{rev.date}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Star Rating */}
                              <div className="flex items-center gap-0.5 shrink-0">
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

                            {/* Purchase Tag (Size / Color) */}
                            {(rev.sizeBought || rev.colorBought) && (
                              <div className="mb-2.5 flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg w-fit">
                                {rev.sizeBought && <span>সাইজ: <strong>{rev.sizeBought}</strong></span>}
                                {rev.sizeBought && rev.colorBought && <span>|</span>}
                                {rev.colorBought && <span>কালার: <strong>{rev.colorBought}</strong></span>}
                              </div>
                            )}

                            {/* Review Content */}
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                              "{rev.comment}"
                            </p>
                          </div>

                          {/* Footer / Thumbs up */}
                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            {rev.recommended !== false ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                                <Check className="w-3.5 h-3.5" /> জুতোটি কেনার জন্য সুপারিশ করেছেন
                              </span>
                            ) : <span />}

                            <button
                              type="button"
                              onClick={() => handleHelpfulClick(rev.id)}
                              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs"
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

        {/* 4. RELATED SHOES SECTION (সম্পর্কিত অন্যান্য জুতো) */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900">
                  সম্পর্কিত অন্যান্য জুতো (You May Also Like)
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  একই প্রিমিয়াম মানের অন্যান্য জনপ্রিয় ডিজাইনসমূহ
                </p>
              </div>

              <button
                type="button"
                onClick={onBack}
                className="text-xs sm:text-sm font-bold text-[#e30613] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>সব জুতো দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={() => onSelectProduct(relProduct)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={getSafeProductImageUrl(relProduct.images?.[0], relProduct.category)}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, relProduct.category)}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-[#b71218] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {relProduct.badge || 'খাঁটি লেদার'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span>{relProduct.category}</span>
                        <div className="flex items-center gap-1 text-gray-700 font-semibold">
                          <Star className="w-3 h-3 fill-[#fcb900] text-[#fcb900]" />
                          <span>{relProduct.rating}</span>
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#e30613] line-clamp-2 transition-colors">
                        {relProduct.name}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm sm:text-base font-extrabold text-[#e30613]">
                        ৳ {relProduct.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-gray-600 group-hover:text-[#e30613] flex items-center gap-0.5">
                        <span>বিস্তারিত</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. STICKY MOBILE CONVERSION BAR (On mobile screens when scrolling down) */}
      <div className="block md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-40 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={getSafeProductImageUrl(product.images?.[0], product.category)}
            alt=""
            className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, product.category)}
          />
          <div className="min-w-0">
            <h5 className="text-xs font-bold text-gray-900 truncate">{product.name}</h5>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-extrabold text-[#e30613]">
                ৳ {product.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-400">সাইজ: {selectedSize}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOrderClick}
          className="py-2.5 px-4 bg-[#e30613] hover:bg-[#c20510] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current text-yellow-300" />
          <span>অর্ডার করুন</span>
        </button>
      </div>

      {/* Self-contained Product Edit Modal with Instant Save */}
      <ProductEditModal
        isOpen={isEditModalOpen}
        product={product}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={(updated) => {
          onUpdateProduct?.(updated);
        }}
      />

    </div>
  );
};
