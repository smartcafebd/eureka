import { ProductReview } from '../types';

// Storage key for user submitted reviews
const STORAGE_KEY = 'eureka_product_reviews_v1';

// Seed reviews for demo/authenticity
export const DEFAULT_PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'rk-001': [
    {
      id: 'rev-001-1',
      productId: 'rk-001',
      author: 'কবির হোসেন',
      location: 'মিরপুর-১২, ঢাকা',
      rating: 5,
      date: '২ দিন আগে',
      comment: 'একদম খাঁটি প্রিমিয়াম লেদার! ডেলিভারি ম্যানের সামনে প্যাকেট খুলে পায়ে দিয়ে চেক করে পেমেন্ট করেছি। সাইজ ৪২ পারফেক্ট হয়েছে। সোলটা অনেক সফট।',
      verified: true,
      recommended: true,
      sizeBought: 42,
      colorBought: 'চকলেট',
    },
    {
      id: 'rev-001-2',
      productId: 'rk-001',
      author: 'তানভীর আহমেদ',
      location: 'আগ্রাবাদ, চট্টগ্রাম',
      rating: 5,
      date: '১ সপ্তাহ আগে',
      comment: 'অফিসে প্রতিদিন পরার জন্য অসাধারণ আরামদায়ক জুতো। এই দামে অরিজিনাল লেদার সত্যিই পাওয়া কঠিন। ইউরেকাকে অনেক ধন্যবাদ।',
      verified: true,
      recommended: true,
      sizeBought: 41,
      colorBought: 'ব্ল্যাক',
    },
    {
      id: 'rev-001-3',
      productId: 'rk-001',
      author: 'মো. সাজ্জাদুল ইসলাম',
      location: 'উপশহর, সিলেট',
      rating: 4,
      date: '২ সপ্তাহ আগে',
      comment: 'কোয়ালিটি খুবই ভালো। কালারটি ছবির চেয়ে বাস্তবে আরও সুন্দর লাগে। ডেলিভারি ২ দিনের মধ্যে পেয়েছি।',
      verified: true,
      recommended: true,
      sizeBought: 43,
      colorBought: 'চকলেট',
    },
  ],
  'rk-002': [
    {
      id: 'rev-002-1',
      productId: 'rk-002',
      author: 'মাহমুদুল হাসান',
      location: 'ধানমন্ডি, ঢাকা',
      rating: 5,
      date: '৩ দিন আগে',
      comment: 'কালার কম্বিনেশন আর ফিনিশিং খুবই চমৎকার। রাবার সোলের গ্রিপ দারুণ। সহজে পা পিছলায় না। ১০০% রিকমেন্ডেড!',
      verified: true,
      recommended: true,
      sizeBought: 40,
      colorBought: 'মাস্টার',
    },
    {
      id: 'rev-002-2',
      productId: 'rk-002',
      author: 'রাশেদ খান',
      location: 'খুলনা সদর',
      rating: 5,
      date: '১ সপ্তাহ আগে',
      comment: 'একদম যেমন চেয়েছিলাম তেমন পেয়েছি। ক্যাশ অন ডেলিভারি সার্ভিস খুবই ভরসার।',
      verified: true,
      recommended: true,
      sizeBought: 42,
    },
  ],
  'rk-003': [
    {
      id: 'rev-003-1',
      productId: 'rk-003',
      author: 'ইমতিয়াজ চৌধুরী',
      location: 'উত্তরা, ঢাকা',
      rating: 5,
      date: '৪ দিন আগে',
      comment: 'লুফারটির লেদার খুবই সফট এবং পায়ে দিলে কোন ব্যথা লাগে না। জিন্স ও গ্যাবার্ডিন প্যান্টের সাথে খুব সুন্দর মানায়।',
      verified: true,
      recommended: true,
      sizeBought: 41,
    },
    {
      id: 'rev-003-2',
      productId: 'rk-003',
      author: 'আরিফুল হক',
      location: 'বগুড়া',
      rating: 5,
      date: '২ সপ্তাহ আগে',
      comment: 'অর্ডার করার পরদিনই ফোন দিয়ে সাইজ কনফার্ম করেছিল। অনেক প্রফেশনাল সার্ভিস। জুতোর কোয়ালিটি টপ নচ।',
      verified: true,
      recommended: true,
      sizeBought: 42,
    },
  ],
  'rk-004': [
    {
      id: 'rev-004-1',
      productId: 'rk-004',
      author: 'নাবিল মাহমুদ',
      location: 'গুলশান-২, ঢাকা',
      rating: 5,
      date: '৫ দিন আগে',
      comment: 'অফিসিয়াল মিটিং এবং স্যুট-প্যান্টের সাথে দারুণ একটা ক্লাসিক লুক দেয়। হিল সাইজ এবং ফিনিশিং আন্তর্জাতিক মানের।',
      verified: true,
      recommended: true,
      sizeBought: 42,
    },
  ],
};

// Generic realistic reviews for products without predefined reviews
const GENERIC_REVIEWS_TEMPLATES = [
  {
    author: 'শাকিল আহমেদ',
    location: 'মোহাম্মদপুর, ঢাকা',
    rating: 5,
    date: '৩ দিন আগে',
    comment: 'চামড়ার কোয়ালিটি ও ফিনিশিং দারুণ। মেমোরি কুশন সোল থাকায় দীর্ঘক্ষণ পায়ে রাখলেও কোনো ক্লান্তি আসে না। ক্যাশ অন ডেলিভারিতে চেক করে নিয়েছি।',
    recommended: true,
  },
  {
    author: 'সোহেল রানা',
    location: 'কুমিল্লা সদর',
    rating: 5,
    date: '১ সপ্তাহ আগে',
    comment: 'ছবিতে যেমন দেখেছি হুবহু সেম প্রডাক্ট পেয়েছি। সাইজ পারফেক্ট হয়েছে। ইউরেকা থেকে আবার অর্ডার করবো ইনশাআল্লাহ।',
    recommended: true,
  },
  {
    author: 'ফারহান চৌধুরী',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    rating: 4,
    date: '২ সপ্তাহ আগে',
    comment: 'ভালো জুতো, জেনুইন লেদার স্মেল আছে এবং সেলাইগুলো খুব নিখুঁত। প্যাকেজিংও খুব ভালো ছিল।',
    recommended: true,
  },
];

// Load user submitted reviews from localStorage
function getStoredCustomReviews(): ProductReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading custom reviews', err);
    return [];
  }
}

// Get all reviews for a product (defaults + custom submitted)
export function getProductReviews(productId: string): ProductReview[] {
  const custom = getStoredCustomReviews().filter((r) => r.productId === productId);
  const defaults = DEFAULT_PRODUCT_REVIEWS[productId] || [
    {
      id: `gen-1-${productId}`,
      productId,
      author: GENERIC_REVIEWS_TEMPLATES[0].author,
      location: GENERIC_REVIEWS_TEMPLATES[0].location,
      rating: GENERIC_REVIEWS_TEMPLATES[0].rating,
      date: GENERIC_REVIEWS_TEMPLATES[0].date,
      comment: GENERIC_REVIEWS_TEMPLATES[0].comment,
      verified: true,
      recommended: GENERIC_REVIEWS_TEMPLATES[0].recommended,
      sizeBought: 42,
    },
    {
      id: `gen-2-${productId}`,
      productId,
      author: GENERIC_REVIEWS_TEMPLATES[1].author,
      location: GENERIC_REVIEWS_TEMPLATES[1].location,
      rating: GENERIC_REVIEWS_TEMPLATES[1].rating,
      date: GENERIC_REVIEWS_TEMPLATES[1].date,
      comment: GENERIC_REVIEWS_TEMPLATES[1].comment,
      verified: true,
      recommended: GENERIC_REVIEWS_TEMPLATES[1].recommended,
      sizeBought: 41,
    },
    {
      id: `gen-3-${productId}`,
      productId,
      author: GENERIC_REVIEWS_TEMPLATES[2].author,
      location: GENERIC_REVIEWS_TEMPLATES[2].location,
      rating: GENERIC_REVIEWS_TEMPLATES[2].rating,
      date: GENERIC_REVIEWS_TEMPLATES[2].date,
      comment: GENERIC_REVIEWS_TEMPLATES[2].comment,
      verified: true,
      recommended: GENERIC_REVIEWS_TEMPLATES[2].recommended,
      sizeBought: 43,
    },
  ];

  // Custom reviews come first so user immediately sees newly added reviews!
  return [...custom, ...defaults];
}

// Save a new customer review
export function addCustomerReview(newReviewData: {
  productId: string;
  author: string;
  location?: string;
  rating: number;
  comment: string;
  recommended?: boolean;
  sizeBought?: number;
  colorBought?: string;
}): ProductReview {
  const customList = getStoredCustomReviews();
  const createdReview: ProductReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: newReviewData.productId,
    author: newReviewData.author.trim() || 'সম্মানিত কাস্টমার',
    location: newReviewData.location?.trim() || 'বাংলাদেশ',
    rating: Math.max(1, Math.min(5, newReviewData.rating || 5)),
    date: 'এইমাত্র (Just now)',
    comment: newReviewData.comment.trim(),
    verified: true,
    recommended: newReviewData.recommended !== false,
    sizeBought: newReviewData.sizeBought,
    colorBought: newReviewData.colorBought,
  };

  const updated = [createdReview, ...customList];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving review to localStorage', e);
  }

  return createdReview;
}

// Calculate summary stats
export function calculateReviewStats(reviews: ProductReview[]) {
  if (!reviews.length) {
    return {
      average: 5.0,
      totalCount: 0,
      recommendPercent: 100,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  let recommendedCount = 0;

  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    distribution[star] = (distribution[star] || 0) + 1;
    sum += r.rating;
    if (r.recommended) recommendedCount++;
  });

  const average = Number((sum / reviews.length).toFixed(1));
  const recommendPercent = Math.round((recommendedCount / reviews.length) * 100);

  return {
    average,
    totalCount: reviews.length,
    recommendPercent,
    distribution,
  };
}
