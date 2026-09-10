import React from 'react';
import { Category } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../data/categories';

interface CategoryGridProps {
  categories?: Category[];
  onSelectCategory: (category: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories = DEFAULT_CATEGORIES,
  onSelectCategory,
  onScrollToSection,
}) => {
  const displayCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const handleCategoryClick = (catName: string) => {
    onSelectCategory(catName);
    onScrollToSection('featured-section');
  };

  return (
    <section id="categories" className="py-10 sm:py-14 bg-[#faf9f8] border-b border-[#eae8e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#282828] tracking-tight">
            POPULAR CATEGORIES
          </h2>
          <div className="w-16 h-1 bg-[#b71218] mx-auto mt-2 rounded-full" />
        </div>

        {/* Categories Grid (Clean Curated Categories) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((category) => {
            const cardId = `category-card-${category.slug}`;

            return (
              <div
                key={category.id}
                id={cardId}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-[#e5e5e5] hover:border-[#b71218] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col transform hover:-translate-y-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategoryClick(category.name);
                  }
                }}
              >
                {/* Category Image Wrapper */}
                <div className="aspect-[4/5] w-full overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  {/* Subtle Dark Gradient Overlay for Headline Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

                  {/* Clean Category Headline */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-center sm:text-left">
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-white group-hover:text-yellow-300 transition-colors tracking-wide">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

