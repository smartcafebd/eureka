import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  PenLine,
  X,
  Check,
  MessageSquareQuote,
} from 'lucide-react';
import { TESTIMONIALS } from '../data/categories';
import { Testimonial } from '../types';

const STORAGE_KEY = 'eureka_customer_testimonials_v2';

export const CustomerReviews: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<Testimonial[]>(TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  // Write Review Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Load custom reviews from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Testimonial[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewsList([...parsed, ...TESTIMONIALS]);
        }
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  const changeSlide = (nextIndex: number, dir: 'right' | 'left') => {
    if (isTransitioning) return;
    setDirection(dir);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 220);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % reviewsList.length;
    changeSlide(nextIdx, 'right');
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + reviewsList.length) % reviewsList.length;
    changeSlide(prevIdx, 'left');
  };

  // Auto-advance reviews one after another every 4.5 seconds
  useEffect(() => {
    if (isPaused || reviewsList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIdx = (prev + 1) % reviewsList.length;
        setDirection('right');
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 220);
        return nextIdx;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, reviewsList.length]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formAuthor.trim()) {
      setFormError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 5) {
      setFormError('অনুগ্রহ করে রিভিউ মতামত লিখুন।');
      return;
    }

    const newReview: Testimonial = {
      id: `user-t-${Date.now()}`,
      author: formAuthor.trim(),
      rating: formRating,
      comment: formComment.trim(),
      location: 'বাংলাদেশ',
      date: 'এইমাত্র',
      verified: true,
      productName: 'ইউরেকা প্রিমিয়াম ফুটওয়্যার',
      avatar: '',
      helpfulCount: 1,
    };

    const updatedList = [newReview, ...reviewsList];
    setReviewsList(updatedList);
    setCurrentIndex(0);

    // Persist
    try {
      const userReviews = updatedList.filter((r) => r.id.startsWith('user-t-'));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userReviews));
    } catch {
      // Ignore
    }

    setFormSuccessMessage('ধন্যবাদ! আপনার রিভিউটি যুক্ত হয়েছে।');
    setTimeout(() => {
      setIsModalOpen(false);
      setFormSuccessMessage('');
      setFormAuthor('');
      setFormComment('');
      setFormRating(5);
    }, 1200);
  };

  if (reviewsList.length === 0) return null;

  const currentReview = reviewsList[currentIndex] || reviewsList[0];

  return (
    <section
      id="customer-reviews-section"
      className="py-3.5 sm:py-4 bg-[#fbf9f6] border-y border-[#ece5da] select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Single-Line Animated Reviews Showcase */}
        <div
          className="relative bg-white rounded-xl sm:rounded-2xl border border-[#e6dfd4] shadow-xs px-3 sm:px-5 py-2.5 sm:py-3 transition-all flex items-center justify-between gap-3 sm:gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left: Section Label with Quote Icon */}
          <div className="hidden md:flex items-center gap-2 shrink-0 pr-3 border-r border-gray-200">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800 tracking-wide">
              কাস্টমার রিভিউ
            </span>
          </div>

          {/* Center: The Animated Single-Review Line */}
          <div className="flex-1 min-w-0 overflow-hidden relative py-0.5">
            <div
              key={currentReview.id || currentIndex}
              className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 transition-all duration-300 ease-out ${
                isTransitioning
                  ? direction === 'right'
                    ? 'opacity-0 translate-x-4'
                    : 'opacity-0 -translate-x-4'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {/* 1. Customer Name & 2. Review (Stars) */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                  {currentReview.author}
                </span>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= currentReview.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <span className="hidden sm:inline text-gray-300 font-bold">•</span>
              </div>

              {/* 3. Review Content */}
              <div className="flex-1 min-w-0 flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:inline" />
                <p className="text-xs sm:text-[13px] text-gray-700 leading-snug line-clamp-1 sm:truncate font-normal">
                  {currentReview.comment}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Controls (Previous, Next, and Write Review) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Index Counter */}
            <span className="text-[11px] font-bold text-gray-400 hidden lg:inline mr-1">
              {currentIndex + 1} / {reviewsList.length}
            </span>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 sm:p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              title="আগের রিভিউ"
              aria-label="আগের রিভিউ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="p-1 sm:p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              title="পরবর্তী রিভিউ"
              aria-label="পরবর্তী রিভিউ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Write a Review Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="ml-1 px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="রিভিউ লিখুন"
            >
              <PenLine className="w-3 h-3 text-amber-700" />
              <span className="hidden sm:inline">রিভিউ দিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#1a1615] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">আপনার রিভিউ লিখুন</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {formSuccessMessage ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{formSuccessMessage}</h4>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  {formError && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-medium">
                      {formError}
                    </div>
                  )}

                  {/* Rating Stars */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      রেটিং নির্বাচন করুন:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="p-0.5 text-amber-400 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= formRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      আপনার নাম:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তানভীর আহমেদ"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      আপনার রিভিউ / মতামত:
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="জুতোটির কোয়ালিটি ও ফিটিং কেমন লেগেছে লিখুন..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs text-gray-600 hover:bg-gray-50 cursor-pointer font-semibold"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#b71218] hover:bg-[#9a0f14] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      রিভিউ জমা দিন
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
