import React, { useState, useEffect } from 'react';
import { Product, ProductReview, CartItem, OrderInvoice, Category } from './types';
import { PRODUCTS } from './data/products';
import { CATEGORIES } from './data/categories';
import { TopBar } from './components/TopBar';
import { SiteHeader } from './components/SiteHeader';
import { SiteNavigation } from './components/SiteNavigation';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { HotDeals } from './components/HotDeals';
import { ProductTabs } from './components/ProductTabs';
import { BannerPromo } from './components/BannerPromo';
import { WhyEureka } from './components/WhyRichkid';
import { CustomerReviews } from './components/CustomerReviews';
import { InstagramFeed } from './components/InstagramFeed';
import { Newsletter } from './components/Newsletter';
import { SiteFooter } from './components/SiteFooter';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { TrackOrderModal } from './components/TrackOrderModal';
import { HappinessModal } from './components/HappinessModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileMenuDrawer } from './components/MobileMenuDrawer';
import { Toast, ToastMessage } from './components/Toast';
import { ExpressOrderModal, ExpressOrderPayload } from './components/ExpressOrderModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { InvoiceModal, InvoiceData } from './components/InvoiceModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginGate } from './components/admin/AdminLoginGate';
import { useStore } from './context/StoreContext';

export default function App() {
  const { products, categories, saveProduct } = useStore();

  // State: Cart with LocalStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('eureka_cart') || localStorage.getItem('richkid_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item && item.product && item.product.id && item.product.price)
          .map((item) => ({
            ...item,
            selectedColor:
              item.selectedColor === 'ব্রাউন' || item.selectedColor?.toLowerCase() === 'brown'
                ? 'চকলেট'
                : item.selectedColor,
          }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // State: Wishlist with LocalStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eureka_wishlist');
      return saved ? JSON.parse(saved) : ['rk-001', 'rk-003'];
    } catch {
      return ['rk-001', 'rk-003'];
    }
  });

  // State: Navigation & Filter
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // State: Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [isHappinessModalOpen, setIsHappinessModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin');
    }
    return false;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('eureka_erp_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // State: Product Detail & Description Modal
  const [isProductDetailOpen, setIsProductDetailOpen] = useState<boolean>(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Keep selectedProductForDetail synchronized when product is edited/saved in store
  useEffect(() => {
    if (selectedProductForDetail) {
      const fresh = products.find((p) => p.id === selectedProductForDetail.id);
      if (fresh && fresh !== selectedProductForDetail) {
        setSelectedProductForDetail(fresh);
      }
    }
  }, [products, selectedProductForDetail]);

  // State: 1-Click Express Order Modal & Sizing Guide
  const [isExpressOrderOpen, setIsExpressOrderOpen] = useState<boolean>(false);
  const [expressOrderProduct, setExpressOrderProduct] = useState<Product | null>(null);
  const [expressInitialSize, setExpressInitialSize] = useState<number | undefined>(undefined);
  const [expressOrderPayload, setExpressOrderPayload] = useState<ExpressOrderPayload | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceData | null>(null);

  // State: Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Listen to #admin hash or /admin path for seamless admin access
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setIsAdminOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('eureka_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('eureka_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  const addToast = (type: 'cart' | 'wishlist' | 'info', title: string, message: string, image?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message, image }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Wishlist Products lookup from dynamic products
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  // Handler: Add to Cart
  const handleAddToCart = (product: Product, size: number, color: string, quantity = 1) => {
    const actualSize = size || product.sizes[0] || 0;
    const actualColor = color || product.colors[0]?.name || 'Standard';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === actualSize && item.selectedColor === actualColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedSize: actualSize, selectedColor: actualColor, quantity }];
      }
    });

    addToast(
      'cart',
      'Added to Cart',
      `${product.name} (${actualSize ? `Size: ${actualSize}` : ''}) added to your bag.`,
      product.images[0]
    );
  };

  // Handler: View Product Details & Description (Step 1: Product Click -> Full Page Description)
  const handleViewProductDetails = (product: Product) => {
    setSelectedProductForDetail(product);
    setIsProductDetailOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedProductForDetail(null);
    setIsProductDetailOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Customer Review Submitted
  const handleReviewAdded = (product: Product, newReview: ProductReview) => {
    const updatedCount = product.reviewCount + 1;
    const updatedRating = Number(
      ((product.rating * product.reviewCount + newReview.rating) / updatedCount).toFixed(1)
    );
    saveProduct(
      {
        ...product,
        reviewCount: updatedCount,
        rating: updatedRating,
      },
      'Customer Review Submission'
    );

    addToast(
      'info',
      'রিভিউ সফলভাবে গৃহীত হয়েছে!',
      `${newReview.author}-এর ${newReview.rating}★ রিভিউ প্রোডাক্ট পেজে প্রকাশিত হয়েছে।`,
      product.images[0]
    );
  };

  // Handler: Proceed from Product Description to Order Form (Step 2: Description Box -> Order Form)
  const handleProceedToOrderFromDetail = (product: Product, size: number, color: string, quantity: number) => {
    setIsProductDetailOpen(false);
    setExpressOrderProduct(product);
    setExpressInitialSize(size || product.sizes[0]);
    setExpressOrderPayload({
      product,
      selectedSize: size || product.sizes[0],
      selectedColor: color || product.colors[0]?.name || 'Standard',
      quantity: quantity || 1,
    });
    setIsExpressOrderOpen(true);
  };

  // Handler: Express 1-Click Order Trigger
  const handleExpressOrder = (product: Product, size?: number, color?: string) => {
    setExpressOrderProduct(product);
    setExpressInitialSize(size || product.sizes[0]);
    setExpressOrderPayload({
      product,
      selectedSize: size || product.sizes[0],
      selectedColor: color || product.colors[0]?.name || 'Standard',
      quantity: 1,
    });
    setIsExpressOrderOpen(true);
  };

  // Handler: Express Order from Cart
  const handleOpenExpressCheckoutFromCart = () => {
    setIsCartOpen(false);
    setExpressOrderProduct(null); // Indicates entire cart checkout
    setExpressOrderPayload({ cartItems });
    setIsExpressOrderOpen(true);
  };

  // Handler: Order Success Callback
  const handleExpressOrderSuccess = (invoice: InvoiceData) => {
    // If order was placed from entire cart or matches cart items, clear the cart
    setCartItems([]);
    setViewingInvoice(invoice);
    addToast(
      'info',
      'অর্ডার সফল হয়েছে!',
      `Order #${invoice.orderId} confirmed. ক্যাশ অন ডেলিভারি নিশ্চিত হয়েছে।`
    );
  };

  // Handler: Update Cart Quantity
  const handleUpdateQuantity = (productId: string, size: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  };

  // Handler: Remove from Cart
  const handleRemoveCartItem = (productId: string, size: number) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  // Handler: Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handler: Toggle Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const isExist = prev.includes(product.id);
      if (isExist) {
        addToast('wishlist', 'Removed from Wishlist', `${product.name} removed.`);
        return prev.filter((id) => id !== product.id);
      } else {
        addToast('wishlist', 'Added to Wishlist', `${product.name} saved for later!`, product.images[0]);
        return [...prev, product.id];
      }
    });
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
  };

  // Smooth Scroll Helper
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin ERP is active, verify authentication before rendering Admin Suite
  if (isAdminOpen) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginGate
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            try {
              sessionStorage.setItem('eureka_erp_authenticated', 'true');
            } catch (e) {
              console.error(e);
            }
          }}
          onExit={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.location.hash = '';
            }
          }}
        />
      );
    }

    return (
      <AdminLayout
        onExitAdmin={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        onLockAdmin={() => {
          setIsAdminAuthenticated(false);
          try {
            sessionStorage.removeItem('eureka_erp_authenticated');
          } catch (e) {
            console.error(e);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#424141] font-sans antialiased selection:bg-[#e30613] selection:text-white pb-16 md:pb-0">
      
      {/* 1. Top Announcement / Delivery Strip */}
      <TopBar
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenHappinessModal={() => setIsHappinessModalOpen(true)}
      />

      {/* 2. Main Site Header (Logo, Search, Wishlist, Cart, Sizing Guide) */}
      <SiteHeader
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistIds.length}
        products={products}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectProduct={(p) => handleViewProductDetails(p)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        onGoHome={handleBackToHome}
        onFilterCategory={(cat) => {
          setSelectedProductForDetail(null);
          setActiveCategory(cat);
          handleScrollToSection('featured-section');
        }}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }}
      />

      {/* 3. Desktop Navigation Mega Menu */}
      <SiteNavigation
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setSelectedProductForDetail(null);
          setActiveCategory(cat);
        }}
        onScrollToSection={handleScrollToSection}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* 4. Main Page Content Stream (Full-Page Product Description or Homepage Catalog) */}
      <main className="flex-1">
        {selectedProductForDetail ? (
          <ProductDetailPage
            product={selectedProductForDetail}
            allProducts={products}
            isWishlisted={wishlistIds.includes(selectedProductForDetail.id)}
            onBack={handleBackToHome}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onProceedToOrder={handleProceedToOrderFromDetail}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onSelectProduct={handleViewProductDetails}
            onReviewAdded={handleReviewAdded}
            onUpdateProduct={(updated) => {
              setSelectedProductForDetail(updated);
              addToast('info', 'প্রোডাক্ট সেভ সম্পন্ন', `"${updated.name}" সফলভাবে আপডেট ও সেভ হয়েছে!`, updated.images?.[0]);
            }}
          />
        ) : (
          <>
            {/* Hero Slider Banner */}
            <HeroSlider
              onExploreClick={(cat) => {
                setActiveCategory(cat);
                if (cat === 'hot-deal') {
                  handleScrollToSection('hot-deals');
                } else {
                  handleScrollToSection('featured-section');
                }
              }}
            />

            {/* Categories Icon/Image Showcase */}
            <CategoryGrid
              categories={categories}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              onScrollToSection={handleScrollToSection}
            />

            {/* Hot Deals Countdown Section */}
            <HotDeals
              products={products}
              wishlistIds={wishlistIds}
              onViewDetails={handleViewProductDetails}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              onExpressOrder={handleExpressOrder}
            />

            {/* Dual Promotional Highlight Banners */}
            <BannerPromo
              onShopClick={(cat) => {
                setActiveCategory(cat);
                handleScrollToSection('featured-section');
              }}
              onOpenHappinessModal={() => setIsHappinessModalOpen(true)}
            />

            {/* Main Product Catalog Tabs with Express 1-Click Ordering */}
            <ProductTabs
              products={products}
              categories={categories}
              selectedCategory={activeCategory}
              wishlistIds={wishlistIds}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              onViewDetails={handleViewProductDetails}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              onExpressOrder={handleExpressOrder}
            />

            {/* Why eureka & Showrooms Guide */}
            <WhyEureka
              onOpenHappinessModal={() => setIsHappinessModalOpen(true)}
            />

            {/* Verified Customer Reviews */}
            <CustomerReviews />

            {/* Instagram Gallery Feed */}
            <InstagramFeed
              onSelectProduct={(prod) => setSelectedProductForDetail(prod)}
            />

            {/* Newsletter Signup Strip */}
            <Newsletter />
          </>
        )}
      </main>

      {/* 5. Comprehensive Site Footer with Admin Access */}
      <SiteFooter
        onOpenHappinessModal={() => setIsHappinessModalOpen(true)}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedProductForDetail(null);
          setActiveCategory(cat);
        }}
        onScrollToSection={handleScrollToSection}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }}
      />

      {/* 6. Mobile Bottom Sticky Navigation (Shown on catalog pages) */}
      {!selectedProductForDetail && (
        <MobileBottomNav
          cartCount={cartCount}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onScrollToTop={handleScrollToTop}
        />
      )}

      {/* 7. Drawers & Modals */}
      
      {/* Shopping Cart Drawer with 1-Click Cash on Delivery Trigger */}
      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenExpressCheckout={handleOpenExpressCheckoutFromCart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        wishlistProducts={wishlistProducts}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewProductDetails}
        onExpressOrder={handleExpressOrder}
      />

      {/* 1-Click Cash on Delivery Express Checkout Modal (Step 2: Order form with address and phone) */}
      <ExpressOrderModal
        isOpen={isExpressOrderOpen}
        onClose={() => {
          setIsExpressOrderOpen(false);
          setExpressOrderPayload(null);
        }}
        orderData={expressOrderPayload}
        product={expressOrderProduct}
        cartItems={cartItems}
        initialSize={expressInitialSize}
        onOrderSuccess={handleExpressOrderSuccess}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Printable Invoice / Order Confirmation Receipt Modal */}
      <InvoiceModal
        isOpen={Boolean(viewingInvoice)}
        invoice={viewingInvoice}
        onClose={() => setViewingInvoice(null)}
      />

      {/* Shoe Sizing Guide & AI Footwear Consultant Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={(size) => {
          setExpressInitialSize(size);
          setIsSizeGuideOpen(false);
          addToast('info', 'সাইজ নির্বাচিত হয়েছে', `EU/BD Size ${size} আপনার জন্য সিলেক্ট করা হয়েছে।`);
        }}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* eureka Happiness Program & Warranty Modal */}
      <HappinessModal
        isOpen={isHappinessModalOpen}
        onClose={() => setIsHappinessModalOpen(false)}
      />

      {/* Mobile Menu Side Drawer */}
      <MobileMenuDrawer
        categories={categories}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleScrollToSection('featured-section');
        }}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Interactive Toast Notifications */}
      <Toast
        toasts={toasts}
        onDismiss={removeToast}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

    </div>
  );
}
