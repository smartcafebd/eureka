export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  location?: string;
  rating: number;
  date: string;
  comment: string;
  verified?: boolean;
  recommended?: boolean;
  sizeBought?: number;
  colorBought?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  colorHex: string;
  size: number;
  stock: number;
  purchaseCost: number;
  sellingPrice: number;
  image?: string;
}

export interface ProductCostStructure {
  manufacturingCost: number; // Raw material / leather / factory cost
  packagingCost: number;     // Box, silica, dust bag
  marketingCost: number;     // Ads / content allocation
  transportCost: number;     // Factory to warehouse freight
  deliveryCost: number;      // Courier fee allocation
  otherAllocatedCost: number;// Office / buffer
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  price: number;
  originalPrice: number;
  costPrice?: number;        // Total unit cost
  costStructure?: ProductCostStructure;
  rating: number;
  reviewCount: number;
  images: string[];
  videoUrl?: string;
  isHotDeal?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  description: string;
  shortDescription?: string;
  materials: string;
  soleMaterial?: string;
  weightGrams?: number;
  warrantyMonths?: number;
  sizes: number[];
  colors: { name: string; hex: string }[];
  stockCount: number;
  lowStockAlert?: number;
  sku: string;
  productCode?: string;
  brand?: string;
  status?: 'published' | 'draft' | 'archived';
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  seo?: ProductSeoData;
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
  featured?: boolean;
  description?: string;
  subcategories?: string[];
  sortOrder?: number;
  enabled?: boolean;
}

export interface SlideItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  highlightText: string;
  discountBadge: string;
  buttonText: string;
  link: string;
  bgGradient: string;
  image: string;
  enabled?: boolean;
}

export interface HeroDesignConfig {
  layoutStyle: 'split' | 'centered' | 'fullwidth' | 'minimal';
  overlayOpacity: number; // 20 - 95
  bannerHeight: 'compact' | 'standard' | 'large';
  autoSlideInterval: number; // seconds, 0 = pause
  showBadges: boolean;
  showPreviewCard: boolean;
  accentColor?: string;
}

export interface PromoBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  badgeText: string;
  buttonText: string;
  linkCategory: string;
  bgImage: string;
  enabled: boolean;
  actionType?: 'category' | 'happiness' | 'link';
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  productName: string;
  comment: string;
  avatar: string;
  sizeBought?: number;
  colorBought?: string;
  photos?: string[];
  helpfulCount?: number;
  categoryTag?: 'formal' | 'casual' | 'boot' | 'loafer' | 'all';
}

// ----------------------------------------------------
// INVENTORY & AUDIT TYPES
// ----------------------------------------------------
export type InventoryAction =
  | 'Stock In'
  | 'Stock Out'
  | 'Damaged Stock'
  | 'Returned Stock'
  | 'Adjust Stock'
  | 'Purchase Stock'
  | 'Transfer Stock'
  | 'Order Sale';

export interface InventoryAuditLog {
  id: string;
  productId: string;
  productName: string;
  variantSku?: string;
  size?: number;
  color?: string;
  previousStock: number;
  change: number; // can be negative or positive
  newStock: number;
  action: InventoryAction;
  reason: string;
  date: string;
  adminName: string;
}

// ----------------------------------------------------
// ORDERS & COURIER TYPES
// ----------------------------------------------------
export type OrderStatus =
  | 'New'
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentStatus = 'Pending' | 'Paid' | 'Partial' | 'Refunded';

export type CourierName =
  | 'Steadfast'
  | 'Pathao Courier'
  | 'RedX'
  | 'Paperfly'
  | 'eCourier'
  | 'In-House Rider';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  sku?: string;
  variantSku?: string;
  size: number;
  color: string;
  quantity: number;
  unitPrice: number;
  price?: number;
  costPrice?: number;
  totalPrice: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  courier?: CourierName;
  trackingNumber?: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderInvoice {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: {
    name: string;
    size: number;
    color?: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
  notes?: string;
}

// ----------------------------------------------------
// CUSTOMER (CRM) TYPES
// ----------------------------------------------------
export type CustomerSegment = 'New' | 'Returning' | 'VIP' | 'High Value' | 'Cancelled' | 'Regular';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  cancelledOrders: number;
  returnedOrders: number;
  status: 'active' | 'inactive' | 'blacklisted';
  segment: CustomerSegment;
  notes?: string;
  createdAt: string;
}

// ----------------------------------------------------
// EXPENSE MANAGEMENT TYPES
// ----------------------------------------------------
export type MarketingPlatform =
  | 'Facebook Ads'
  | 'Instagram Ads'
  | 'TikTok Ads'
  | 'Google Ads'
  | 'Influencer Cost'
  | 'Content Creation'
  | 'Photography'
  | 'Video Production'
  | 'Boosting'
  | 'Other Marketing';

export interface MarketingExpense {
  id: string;
  date: string;
  platform: MarketingPlatform;
  campaignName: string;
  amount: number;
  description: string;
  relatedProductId?: string;
  relatedCategory?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  createdBy: string;
}

export type TransportExpenseType =
  | 'Delivery Transport'
  | 'Product Collection'
  | 'Supplier Transport'
  | 'Courier Bills'
  | 'Fuel'
  | 'CNG'
  | 'Bus'
  | 'Truck'
  | 'Pickup'
  | 'Motorcycle'
  | 'Other Vehicle';

export interface TransportExpense {
  id: string;
  date: string;
  expenseType: TransportExpenseType;
  amount: number;
  description: string;
  relatedOrderOrProduct?: string;
  vehicle?: string;
  driverOrPerson?: string;
  createdBy: string;
}

export type EmployeeRole =
  | 'Master Craftsman'
  | 'Officer'
  | 'Manager'
  | 'Delivery Staff'
  | 'Sales Staff'
  | 'Warehouse Assistant';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  phone: string;
  email?: string;
  joiningDate: string;
  salary: number;
  status: 'active' | 'on_leave' | 'terminated';
}

export type EmployeeExpenseType =
  | 'Salary'
  | 'Advance'
  | 'Bonus'
  | 'Commission'
  | 'Food'
  | 'Transport'
  | 'Mobile Bill'
  | 'Other';

export interface EmployeeExpense {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  expenseType: EmployeeExpenseType;
  amount: number;
  description: string;
  paymentMethod: string;
  createdBy: string;
}

export type GeneralExpenseCategory =
  | 'Office Rent'
  | 'Electricity'
  | 'Internet'
  | 'Phone'
  | 'Software'
  | 'Hosting'
  | 'Domain'
  | 'Packaging'
  | 'Printing'
  | 'Maintenance'
  | 'Bank Charges'
  | 'Payment Gateway'
  | 'Miscellaneous';

export interface GeneralExpense {
  id: string;
  date: string;
  category: GeneralExpenseCategory | string;
  amount: number;
  description: string;
  receiptNumber?: string;
  paymentMethod: string;
  createdBy: string;
}

// ----------------------------------------------------
// ACCOUNTING & TRANSACTIONS LEDGER (PIPE-TO-PIPE)
// ----------------------------------------------------
export type TransactionType = 'Income' | 'Expense' | 'Investment' | 'Withdrawal' | 'Transfer';

export type PaymentMethodName =
  | 'Cash'
  | 'Bank'
  | 'bKash'
  | 'Nagad'
  | 'Rocket'
  | 'Card'
  | 'Payment Gateway'
  | 'Other';

export interface AccountingTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  paymentMethod: PaymentMethodName;
  relatedOrderId?: string;
  relatedProductId?: string;
  relatedEmployeeId?: string;
  relatedInvestorId?: string;
  notes: string;
  createdBy: string;
}

// ----------------------------------------------------
// INVESTOR MANAGEMENT TYPES
// ----------------------------------------------------
export interface Investor {
  id: string;
  name: string;
  phone: string;
  address?: string;
  investmentAmount: number;
  investmentDate: string;
  sharePercentage: number;
  notes?: string;
  totalWithdrawn: number;
  totalProfitPaid?: number;
  status?: 'active' | 'inactive';
}

export interface InvestorTransaction {
  id: string;
  investorId: string;
  investorName: string;
  type: 'Investment' | 'Withdrawal' | 'Profit Share';
  amount: number;
  date: string;
  paymentMethod: string;
  notes: string;
  createdBy: string;
}

// ----------------------------------------------------
// WEBSITE SETTINGS & BRANDING
// ----------------------------------------------------
export interface BusinessSettings {
  businessName: string;
  storeName?: string;
  domainName?: string;
  websiteUrl?: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  logoWhiteUrl?: string;
  logoHeight?: number;
  logoType?: 'image' | 'text' | 'both';
  logoAnimation?: 'shimmer' | 'float' | 'pulse' | 'glow' | 'none';
  faviconUrl?: string;
  phone: string;
  hotline: string;
  whatsapp: string;
  whatsappNumber?: string;
  email: string;
  address: string;
  topBannerNotice?: string;
  deliveryChargeInsideDhaka?: number;
  deliveryChargeSubDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
  freeDeliveryThreshold?: number;
  returnWindowDays?: number;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleCode?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  metaKeywords?: string;
  seoMode?: 'manual' | 'ai_fixed' | 'ai-fixed';
  area: string;
  district: string;
  division: string;
  country: string;
  googleMapUrl: string;
  facebookPage: string;
  instagramPage: string;
  tiktokPage: string;
  youtubePage: string;
  showrooms: {
    city: string;
    branchName: string;
    address: string;
    phone: string;
  }[];
  erpPassword?: string;
}

export interface DomainHostingSettings {
  domainName: string;
  websiteUrl: string;
  hostingProvider: string;
  hostingExpiryDate: string;
  domainPurchaseDate: string;
  domainExpiryDate: string;
  sslStatus: 'Active' | 'Expiring Soon' | 'Inactive';
  hostingCost: number;
  domainCost: number;
  renewalReminderEnabled: boolean;
}

// ----------------------------------------------------
// USER & ROLE MANAGEMENT
// ----------------------------------------------------
export type SystemRole = 'Super Admin' | 'Admin' | 'Manager' | 'Accountant' | 'Staff';

export interface PermissionSet {
  canManageProducts: boolean;
  canManageCategories: boolean;
  canManageInventory: boolean;
  canManageOrders: boolean;
  canManageCustomers: boolean;
  canManageExpenses: boolean;
  canManageAccounting: boolean;
  canManageInvestors: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canRestoreBackup: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: SystemRole;
  status: 'active' | 'inactive';
  permissions: PermissionSet;
  lastLogin?: string;
}

// ----------------------------------------------------
// AUDIT LOG
// ----------------------------------------------------
export interface SystemAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  module:
    | 'Products'
    | 'Categories'
    | 'Inventory'
    | 'Orders'
    | 'Expenses'
    | 'Accounting'
    | 'Investors'
    | 'Settings'
    | 'Users'
    | 'Domain'
    | 'SEO'
    | 'Redirects'
    | 'Health'
    | 'Recovery'
    | 'Backups';
  action: string;
  oldValue?: string;
  newValue?: string;
  details: string;
  result?: 'Success' | 'Warning' | 'Failed';
  ip?: string;
}

// ----------------------------------------------------
// DOMAIN & HOSTING MANAGEMENT EXTENSIONS
// ----------------------------------------------------
export interface DnsRecord {
  type: 'A' | 'CNAME' | 'TXT' | 'MX' | 'AAAA';
  name: string;
  value: string;
  ttl: string;
  status: 'Propagated' | 'Pending' | 'Error';
}

export interface DomainEntity {
  id: string;
  domain: string;
  isPrimary: boolean;
  type: 'primary' | 'custom' | 'subdomain';
  status: 'Connected' | 'Verifying' | 'Error' | 'Expired';
  sslStatus: 'Active' | 'Expiring Soon' | 'Inactive' | 'Provisioning';
  sslExpiryDays: number;
  sslIssuer: string;
  dnsConfigured: boolean;
  nameservers: string[];
  autoRenew: boolean;
  addedAt: string;
  expiresAt: string;
}

export interface ServerHealthMetric {
  serverStatus: 'Online' | 'Degraded' | 'Offline';
  uptimePercentage: number;
  avgResponseTimeMs: number;
  phpVersion: string;
  nodeVersion: string;
  databaseStatus: 'Connected (Healthy)' | 'High Latency' | 'Disconnected';
  databaseLatencyMs: number;
  storageUsedGb: number;
  storageTotalGb: number;
  bandwidthUsedGb: number;
  bandwidthTotalGb: number;
  cdnStatus: 'Active (Anycast CDN)' | 'Bypassed' | 'Error';
  cdnProvider: string;
  cacheHitRatio: number;
  emailConfig: {
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
  };
  lastCheckTimestamp: string;
}

// ----------------------------------------------------
// GLOBAL & PRODUCT SEO TYPES
// ----------------------------------------------------
export interface GlobalSeoConfig {
  siteTitle: string;
  metaTitle?: string;
  domainName?: string;
  focusKeyword?: string;
  seoMode?: 'manual' | 'ai_fixed' | 'ai-fixed';
  titleFormat: string; // e.g. "{title} | {site_name}"
  metaDescription: string;
  metaKeywords: string;
  canonicalDomain: string;
  robotsDefault: 'index, follow' | 'noindex, nofollow' | 'index, nofollow';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType: 'website' | 'article' | 'product';
  twitterCard: 'summary' | 'summary_large_image';
  googleVerificationTag?: string;
  bingVerificationTag?: string;
  faviconUrl?: string;
  organizationSchemaJson: string;
  websiteSchemaJson: string;
}

export interface ProductSeoData {
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  slug: string;
  canonicalUrl: string;
  imageAltText: string;
  seoScore: number; // 0 - 100
  schemaEnabled: boolean;
  customFaq?: { question: string; answer: string }[];
}

export interface PageSeoItem {
  id: string;
  pageName: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  schemaType: 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';
}

// ----------------------------------------------------
// AUTOMATIC SEO AUDIT & ISSUES
// ----------------------------------------------------
export type SeoIssueSeverity = 'critical' | 'warning' | 'notice' | 'passed';
export type SeoIssueCategory = 'Meta Tags' | 'Links & URLs' | 'Images & Alt' | 'Schema & Structured' | 'Performance & Indexing';

export interface SeoAuditIssue {
  id: string;
  issue: string;
  affectedUrl: string;
  severity: SeoIssueSeverity;
  category: SeoIssueCategory;
  explanation: string;
  recommendedFix: string;
  autoFixable: boolean;
  status: 'open' | 'fixed' | 'ignored';
  detectedAt: string;
}

export interface SeoAuditSummary {
  overallScore: number;
  lastRunTimestamp: string;
  criticalCount: number;
  warningCount: number;
  noticeCount: number;
  passedCount: number;
  totalUrlsScanned: number;
}

// ----------------------------------------------------
// REDIRECT MANAGER TYPES
// ----------------------------------------------------
export type RedirectStatusCode = '301' | '302' | '307' | '308';

export interface RedirectRule {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  statusCode: RedirectStatusCode;
  hits: number;
  status: 'active' | 'disabled';
  notes?: string;
  createdAt: string;
  lastAccessedAt?: string;
}

// ----------------------------------------------------
// WEBSITE HEALTH & ERROR DETECTION
// ----------------------------------------------------
export type ErrorLogType = '404' | '500' | 'API' | 'BrokenImage' | 'MixedContent' | 'SlowQuery';

export interface ErrorLogItem {
  id: string;
  type: ErrorLogType;
  url: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  referrer?: string;
  ip?: string;
  status: 'open' | 'investigating' | 'resolved';
  hitCount: number;
}

// ----------------------------------------------------
// RECOVERY CENTER & ENGINE
// ----------------------------------------------------
export interface RecoveryActionJob {
  id: string;
  problem: string;
  rootCause: string;
  affectedArea: string;
  proposedFix: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedResult: string;
  status: 'Proposed' | 'Applied' | 'Rolled Back' | 'completed';
  appliedAt?: string;
  adminName: string;
  details?: string;
  name?: string;
  target?: string;
  description?: string;
  lastRun?: string;
  triggeredBy?: string;
}

export interface SystemRestorePoint {
  id: string;
  name: string;
  label?: string;
  createdAt: string;
  timestamp?: string;
  type: 'Manual' | 'Scheduled Daily' | 'Pre-Update' | 'Recovery Snapshot';
  sizeKb: number;
  sizeMb?: number;
  itemCount?: number | { products?: number; orders?: number };
  status: 'Available' | 'Active';
  checksum: string;
  dataSnapshot?: string;
}

// ----------------------------------------------------
// NOTIFICATIONS & ALERTS
// ----------------------------------------------------
export type NotificationType = 'domain' | 'ssl' | 'health' | 'seo' | 'stock' | 'order' | 'security' | 'server' | 'error';
export type NotificationCategory = NotificationType;

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationType;
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  actionTab?: string;
  actionUrl?: string;
  actionLabel?: string;
}

// ----------------------------------------------------
// THIRD-PARTY INTEGRATIONS (GOOGLE & MARKETING)
// ----------------------------------------------------
export interface MarketingIntegration {
  id: string;
  name: string;
  enabled: boolean;
  trackingId: string;
  lastVerified: string;
}

export type RecoveryJob = RecoveryActionJob;
export type RestorePoint = SystemRestorePoint;

export interface MarketingIntegrationsConfig {
  googleSearchConsole: {
    enabled: boolean;
    verificationTag: string;
    sitemapSubmitted: boolean;
    lastCrawlDate: string;
    indexedPagesCount: number;
  };
  googleAnalytics4: {
    enabled: boolean;
    measurementId: string; // G-XXXXX
    enhancedEcommerce: boolean;
  };
  googleTagManager: {
    enabled: boolean;
    containerId: string; // GTM-XXXXX
  };
  googleMerchantCenter: {
    enabled: boolean;
    merchantId: string;
    feedUrl: string;
    currency: string;
    productCount: number;
    lastSyncedAt: string;
  };
  metaPixel: {
    enabled: boolean;
    pixelId: string;
    conversionsApiToken: string;
    testEventCode: string;
  };
  alerts: {
    adminEmailAlerts: boolean;
    alertEmail: string;
    telegramWebhookUrl: string;
    slackWebhookUrl: string;
    notifyOnSslExpiry: boolean;
    notifyOn404Spike: boolean;
    notifyOnServerDowntime: boolean;
  };
}


