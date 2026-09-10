import { Product } from '../types';

export const STANDARD_PRODUCT_COLORS = [
  { name: 'ব্ল্যাক', hex: '#1a1a1a' },
  { name: 'চকলেট', hex: '#3e2316' },
  { name: 'মাস্টার', hex: '#c9932a' }
];

export const PRODUCTS: Product[] = [
  // --- CASUAL SHOES ---
  {
    id: 'rk-001',
    name: 'Clark Cycle Shoes Dark Chocolate with Off-White Sole',
    category: 'Casual Shoes',
    subCategory: 'Cycle Shoes',
    gender: 'men',
    price: 2450,
    originalPrice: 4150,
    rating: 4.9,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: true,
    isBestSeller: true,
    badge: 'HOT DEAL -41%',
    description: 'The Clarks cycle shoe in rich dark chocolate leather is engineered for maximum everyday comfort. Featuring handcrafted full-grain leather, breathable interior cushioning, and a flexible, shock-absorbing off-white rubber sole for superior grip on all terrains.',
    materials: '100% Genuine Full Grain Leather Upper, High-grade Rubber Outsole, Cushioned Insole',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 18,
    sku: 'RK-CYC-DB-401'
  },
  {
    id: 'rk-002',
    name: 'Clarks Genuine Leather Cycle Shoes Light Red',
    category: 'Casual Shoes',
    subCategory: 'Cycle Shoes',
    gender: 'men',
    price: 2450,
    originalPrice: 4150,
    rating: 4.8,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: true,
    isBestSeller: false,
    badge: 'HOT DEAL -41%',
    description: 'Iconic light red genuine leather cycle shoes engineered for distinct style and breathable walking comfort. Crafted with precision stitching and an ultra-durable sole for modern metropolitan wear.',
    materials: '100% Genuine Cow Leather, Ergonomic Insole, Anti-skid Vulcanized Rubber Sole',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 12,
    sku: 'RK-CYC-LR-402'
  },
  {
    id: 'rk-010',
    name: 'Urban Casual Premium Leather Sneakers',
    category: 'Casual Shoes',
    subCategory: 'Casual Sneakers',
    gender: 'men',
    price: 2350,
    originalPrice: 3600,
    rating: 4.8,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: true,
    isNewArrival: true,
    badge: 'CASUAL HIT',
    description: 'Ultra-light casual leather sneaker designed for effortless everyday steps with shock-absorbing foam midsole and premium leather finish.',
    materials: 'Genuine Nappa Leather, Anti-sweat Insole, EVA Cushion Midsole',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 20,
    sku: 'RK-CAS-SNK-801'
  },

  // --- LOAFER ---
  {
    id: 'rk-003',
    name: 'Premium Leather Classic Penny Loafer',
    category: 'Loafer',
    subCategory: 'Penny Loafers',
    gender: 'men',
    price: 2650,
    originalPrice: 3850,
    rating: 5.0,
    reviewCount: 215,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: true,
    isBestSeller: true,
    badge: 'BEST SELLER',
    description: 'A timeless staple for the modern gentleman. Hand-buffed Italian-style finish with luxury penny strap detail and memory foam footbed that molds to your stride.',
    materials: 'Imported Polished Calfskin Leather, Breathable Leather Lining, Handcrafted Welted Sole',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 24,
    sku: 'RK-LOAF-CL-501'
  },
  {
    id: 'rk-005',
    name: 'Ultra Comfort Handcrafted Tassel Loafer',
    category: 'Loafer',
    subCategory: 'Tassel Loafers',
    gender: 'men',
    price: 2750,
    originalPrice: 3950,
    rating: 4.8,
    reviewCount: 76,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: true,
    isNewArrival: true,
    badge: '-30% OFF',
    description: 'Elevate your business casual look with our handcrafted tassel penny loafer. Designed with premium soft-temper leather that requires zero break-in period.',
    materials: 'Supple Nappa Leather, Anti-bacterial Microfiber Insole, Flexible Crepe Outsole',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 15,
    sku: 'RK-LOAF-TAS-502'
  },
  {
    id: 'rk-014',
    name: 'Italian Hand-Polished Horsebit Loafer',
    category: 'Loafer',
    subCategory: 'Horsebit Loafers',
    gender: 'men',
    price: 2950,
    originalPrice: 4400,
    rating: 4.9,
    reviewCount: 68,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: false,
    isFeatured: true,
    isNewArrival: true,
    badge: 'LUXURY',
    description: 'Masterpiece horsebit metallic buckle loafer with smooth burnished finish for elite formal and semi-formal elegance.',
    materials: 'Full Grain Burnished Cowhide, Leather Padded Footbed, Non-slip Rubber Outsole',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 14,
    sku: 'RK-LOAF-HBT-503'
  },

  // --- FORMAL SHOES ---
  {
    id: 'rk-004',
    name: 'Imperial Plain Luxury Formal Shoes',
    category: 'Formal Shoes',
    subCategory: 'Oxford & Derby',
    gender: 'men',
    price: 2850,
    originalPrice: 4500,
    rating: 4.9,
    reviewCount: 160,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: false,
    isFeatured: true,
    isNewArrival: true,
    badge: 'EXECUTIVE',
    description: 'The epitome of corporate elegance and formal distinction. Featuring a sleek wholecut silhouette, high-gloss shine, and reinforced heel cup for effortless confidence in every step.',
    materials: 'High-grade Full Grain Crust Leather, Leather Midsole, Non-slip Rubber Injected Heel',
    sizes: [40, 41, 42, 43, 44, 45],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 15,
    sku: 'RK-FORM-IMP-101'
  },
  {
    id: 'rk-008',
    name: 'Executive Derby Cap-Toe Formal Shoes',
    category: 'Formal Shoes',
    subCategory: 'Derby Shoes',
    gender: 'men',
    price: 2950,
    originalPrice: 4600,
    rating: 4.9,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: true,
    isNewArrival: true,
    badge: 'POPULAR',
    description: 'Handcrafted cap-toe Derby shoes tailored for boardroom meetings and formal events with mirror-buffed toe shine and padded collar.',
    materials: 'Full Grain Cowhide, Breathable Leather Interior, Hand-stitched Welted Sole',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 16,
    sku: 'RK-FORM-DRB-102'
  },
  {
    id: 'rk-013',
    name: 'Brogue Wingtip Handcrafted Formal Shoes',
    category: 'Formal Shoes',
    subCategory: 'Brogue Shoes',
    gender: 'men',
    price: 3150,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 110,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'HERITAGE',
    description: 'Intricate wingtip brogue punch detailing on premium cowhide leather. Built for ceremonies, formal galas, and professional leadership.',
    materials: 'Hand-buffed Calf Leather, Reinforced Arch Support, Dual Layered Leather Sole',
    sizes: [40, 41, 42, 43, 44],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 12,
    sku: 'RK-FORM-BRG-103'
  },

  // --- SANDAL ---
  {
    id: 'rk-007',
    name: 'Handmade Cross-Strap Leather Sandal',
    category: 'Sandal',
    subCategory: 'Comfort Sandals',
    gender: 'men',
    price: 1850,
    originalPrice: 2800,
    rating: 4.7,
    reviewCount: 110,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'BESTSELLER',
    description: 'Experience summer ease and traditional Bangladeshi leather craftsmanship. Features padded footbed and ergonomic arch support for all-day ventilation and comfort.',
    materials: 'Full Leather Straps, Anatomical Cork-Cushion Bed, Textured Grip Sole',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 22,
    sku: 'RK-SAN-CRS-201'
  },
  {
    id: 'rk-011',
    name: 'Premium Leather Double-Strap Slide Sandal',
    category: 'Sandal',
    subCategory: 'Slide Sandals',
    gender: 'men',
    price: 1950,
    originalPrice: 2950,
    rating: 4.9,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: true,
    isNewArrival: true,
    badge: 'COMFORT',
    description: 'Adjustable dual buckle leather straps with extra soft latex padding for mosque, casual outings, and everyday comfort walking.',
    materials: 'Top Grain Oil Pull-up Leather, Microfiber Footbed, Non-slip Rubber Outsole',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 25,
    sku: 'RK-SAN-SLD-202'
  },
  {
    id: 'rk-012',
    name: 'Artisan Hand-Stitched Leather Toe-Ring Sandal',
    category: 'Sandal',
    subCategory: 'Toe-Ring Sandals',
    gender: 'men',
    price: 1750,
    originalPrice: 2600,
    rating: 4.8,
    reviewCount: 75,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    isHotDeal: true,
    isFeatured: false,
    isNewArrival: true,
    badge: 'HOT DEAL',
    description: 'Traditional toe-loop leather sandal hand-stitched with waxed thread for unmatched longevity and airy breathability.',
    materials: '100% Cow Leather, Hand-stitched Sole, Anti-skid Grip Base',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: STANDARD_PRODUCT_COLORS,
    stockCount: 19,
    sku: 'RK-SAN-TOE-203'
  }
];

