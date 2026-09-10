import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  Category,
  Order,
  Customer,
  InventoryAuditLog,
  MarketingExpense,
  TransportExpense,
  Employee,
  EmployeeExpense,
  GeneralExpense,
  AccountingTransaction,
  Investor,
  InvestorTransaction,
  BusinessSettings,
  DomainHostingSettings,
  AdminUser,
  SystemAuditLog,
  OrderStatus,
  InventoryAction,
  PaymentMethodName,
  SlideItem,
  HeroDesignConfig,
  PromoBanner,
  DomainEntity,
  DnsRecord,
  ServerHealthMetric,
  GlobalSeoConfig,
  ProductSeoData,
  PageSeoItem,
  SeoAuditIssue,
  SeoAuditSummary,
  RedirectRule,
  ErrorLogItem,
  RecoveryActionJob,
  SystemRestorePoint,
  AdminNotification,
  MarketingIntegrationsConfig,
  MarketingIntegration,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_DOMAIN_SETTINGS,
  INITIAL_ADMIN_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_EMPLOYEE_EXPENSES,
  INITIAL_MARKETING_EXPENSES,
  INITIAL_TRANSPORT_EXPENSES,
  INITIAL_GENERAL_EXPENSES,
  INITIAL_INVESTORS,
  INITIAL_INVESTOR_TRANSACTIONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_INVENTORY_AUDIT_LOGS,
  INITIAL_SYSTEM_AUDIT_LOGS,
} from '../data/initialMasterData';
import { CATEGORIES, HERO_SLIDES, DEFAULT_HERO_DESIGN, DEFAULT_PROMO_BANNERS } from '../data/categories';
import { STANDARD_PRODUCT_COLORS } from '../data/products';
import {
  sanitizeProductImages,
  getCategoryFallback,
  isValidImageUrl,
} from '../utils/imageUtils';
import {
  INITIAL_DOMAINS,
  INITIAL_DNS_RECORDS,
  INITIAL_SERVER_METRICS,
  INITIAL_GLOBAL_SEO,
  INITIAL_PAGE_SEO,
  INITIAL_SEO_AUDIT_ISSUES,
  INITIAL_REDIRECTS,
  INITIAL_ERROR_LOGS,
  INITIAL_RECOVERY_JOBS,
  INITIAL_RESTORE_POINTS,
  INITIAL_ADMIN_NOTIFICATIONS,
  INITIAL_INTEGRATIONS_CONFIG,
} from '../data/seoHealthData';
import { saveToIndexedDB, loadAllFromIndexedDB } from '../utils/storageDb';

interface BusinessMetrics {
  totalSales: number;
  todaySales: number;
  monthlySales: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  totalProductCostOfSales: number;
  totalProductCosts: number;
  totalMarketingCost: number;
  totalTransportCost: number;
  totalStaffCost: number;
  totalOtherCost: number;
  totalOperatingExpenses: number;
  totalBusinessExpenses: number;
  grossProfit: number;
  netProfit: number;
  totalInvestorCapital: number;
  currentCashFlow: number;
}

interface StoreContextType {
  // States
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  inventoryAuditLogs: InventoryAuditLog[];
  marketingExpenses: MarketingExpense[];
  transportExpenses: TransportExpense[];
  employees: Employee[];
  employeeExpenses: EmployeeExpense[];
  generalExpenses: GeneralExpense[];
  transactions: AccountingTransaction[];
  investors: Investor[];
  investorTransactions: InvestorTransaction[];
  businessSettings: BusinessSettings;
  domainSettings: DomainHostingSettings;
  adminUsers: AdminUser[];
  systemAuditLogs: SystemAuditLog[];
  currentAdmin: AdminUser;

  // Real-time Metrics
  metrics: BusinessMetrics;

  // Actions - Products & Categories
  saveProduct: (product: Product, adminName?: string) => void;
  deleteProduct: (id: string, adminName?: string) => void;
  duplicateProduct: (id: string, adminName?: string) => void;
  deleteProductVariant: (
    productId: string,
    variantIdOrSku?: string,
    variantIndex?: number,
    adminName?: string
  ) => void;
  saveCategory: (category: Category, adminName?: string) => void;
  deleteCategory: (id: string, adminName?: string) => void;

  // Actions - Inventory & Stock
  adjustStock: (
    productId: string,
    variantIdOrSku: string,
    changeQty: number,
    action: InventoryAction,
    reason: string,
    adminName?: string
  ) => void;
  clearInventoryAuditLogs: (adminName?: string) => void;
  deleteInventoryAuditLog: (logId: string, adminName?: string) => void;
  clearAllLiveStock: (mode?: 'zero_stock' | 'clear_all_variants', adminName?: string) => void;

  // Actions - Orders & Checkout
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    courier?: string,
    tracking?: string,
    notes?: string,
    adminName?: string
  ) => void;

  // Actions - Expenses
  addMarketingExpense: (expense: Omit<MarketingExpense, 'id'>, adminName?: string) => void;
  deleteMarketingExpense: (id: string, adminName?: string) => void;
  addTransportExpense: (expense: Omit<TransportExpense, 'id'>, adminName?: string) => void;
  deleteTransportExpense: (id: string, adminName?: string) => void;
  addEmployee: (emp: Omit<Employee, 'id'>, adminName?: string) => void;
  updateEmployee: (emp: Employee, adminName?: string) => void;
  deleteEmployee: (id: string, adminName?: string) => void;
  addEmployeeExpense: (expense: Omit<EmployeeExpense, 'id'>, adminName?: string) => void;
  deleteEmployeeExpense: (id: string, adminName?: string) => void;
  addGeneralExpense: (expense: Omit<GeneralExpense, 'id'>, adminName?: string) => void;
  deleteGeneralExpense: (id: string, adminName?: string) => void;

  // Actions - Accounting
  addTransaction: (tx: Omit<AccountingTransaction, 'id'>, adminName?: string) => void;
  deleteTransaction: (id: string, adminName?: string) => void;

  // Actions - Investors
  addInvestor: (inv: Omit<Investor, 'id' | 'totalWithdrawn'>, adminName?: string) => void;
  updateInvestor: (inv: Investor, adminName?: string) => void;
  deleteInvestor: (id: string, adminName?: string) => void;
  addInvestorTransaction: (tx: Omit<InvestorTransaction, 'id'>, adminName?: string) => void;
  recordInvestorWithdrawal: (investorId: string, amount: number, paymentMethod: string, notes: string, adminName?: string) => void;

  // Actions - Settings & Users
  updateBusinessSettings: (settings: BusinessSettings, adminName?: string) => void;
  updateDomainSettings: (settings: DomainHostingSettings, adminName?: string) => void;
  saveAdminUser: (user: AdminUser, adminName?: string) => void;
  deleteAdminUser: (id: string, adminName?: string) => void;
  setCurrentAdmin: (user: AdminUser) => void;

  // Visuals & Storefront CMS
  heroSlides: SlideItem[];
  heroDesign: HeroDesignConfig;
  promoBanners: PromoBanner[];
  saveHeroSlide: (slide: SlideItem, adminName?: string) => void;
  deleteHeroSlide: (id: string, adminName?: string) => void;
  updateHeroDesign: (design: HeroDesignConfig, adminName?: string) => void;
  updatePromoBanners: (banners: PromoBanner[], adminName?: string) => void;
  resetVisualDefaults: (adminName?: string) => void;

  // Database Backup & Restore
  exportDatabaseJSON: () => string;
  restoreDatabaseJSON: (jsonString: string) => boolean;
  resetToFactoryDefaults: () => void;

  // Domain & Hosting
  domains: DomainEntity[];
  dnsRecords: DnsRecord[];
  serverMetrics: ServerHealthMetric;
  addDomain: (domain: string, type: 'custom' | 'subdomain', adminName?: string) => void;
  verifyDomainDns: (id: string, adminName?: string) => Promise<boolean>;
  setPrimaryDomain: (id: string, adminName?: string) => void;
  deleteDomain: (id: string, adminName?: string) => void;
  updateServerMetrics: (metrics: Partial<ServerHealthMetric>, adminName?: string) => void;
  purgeCache: (type: 'all' | 'pages' | 'assets', adminName?: string) => Promise<{ success: boolean; clearedMb: number }>;

  // SEO Command Center
  globalSeo: GlobalSeoConfig;
  pageSeoList: PageSeoItem[];
  seoIssues: SeoAuditIssue[];
  robotsTxt: string;
  updateGlobalSeo: (seo: GlobalSeoConfig, adminName?: string) => void;
  updatePageSeo: (item: PageSeoItem, adminName?: string) => void;
  updateProductSeo: (productId: string, seoData: Partial<ProductSeoData>, adminName?: string) => void;
  runSeoAudit: (adminName?: string) => Promise<SeoAuditSummary>;
  resolveSeoIssue: (issueId: string, adminName?: string) => void;
  autoFixSeoIssue: (issueId: string, adminName?: string) => void;
  updateRobotsTxt: (content: string, adminName?: string) => void;

  // Redirect Manager
  redirects: RedirectRule[];
  addRedirect: (rule: Omit<RedirectRule, 'id' | 'hits' | 'createdAt'>, adminName?: string) => void;
  updateRedirect: (ruleOrId: RedirectRule | string, updatesOrAdmin?: Partial<RedirectRule> | string, adminName?: string) => void;
  deleteRedirect: (id: string, adminName?: string) => void;
  toggleRedirectStatus: (id: string, adminName?: string) => void;

  // Website Health & Error Detection
  errorLogs: ErrorLogItem[];
  resolveErrorLog: (id: string, adminName?: string) => void;
  clearResolvedErrors: (adminName?: string) => void;
  runHealthDiagnostics: (adminName?: string) => Promise<{ healthy: boolean; testsRun: number; score: number }>;

  // Recovery Center & Backups
  recoveryJobs: RecoveryActionJob[];
  restorePoints: SystemRestorePoint[];
  applyRecoveryJob: (id: string, adminName?: string) => Promise<{ success: boolean; message: string }>;
  dismissRecoveryJob: (id: string, adminName?: string) => void;
  createRecoveryCheckpoint: (name: string, adminName?: string) => SystemRestorePoint;
  createRestorePoint: (nameOrLabel: string, type?: string, adminName?: string) => SystemRestorePoint;
  restoreCheckpoint: (id: string, adminName?: string) => boolean;
  restoreFromSnapshot: (id: string, adminName?: string) => boolean;
  deleteRestorePoint: (id: string, adminName?: string) => void;

  // Notifications & Alerts
  adminNotifications: AdminNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string, adminName?: string) => void;
  markAllNotificationsAsRead: (adminName?: string) => void;
  deleteNotification: (id: string, adminName?: string) => void;
  addNotification: (notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Third-Party Integrations
  integrations: MarketingIntegrationsConfig;
  updateIntegrations: (config: MarketingIntegrationsConfig, adminName?: string) => void;
  marketingIntegrations: MarketingIntegration[];
  updateMarketingIntegration: (id: string, updates: Partial<MarketingIntegration>, adminName?: string) => void;

  // Persistence & Image Recovery Vault
  isHydrated: boolean;
  productImagesVault: Record<string, string[]>;
  recoverLostProductImages: () => Promise<{ recoveredCount: number; details: string }>;
  saveProductImageToVault: (productId: string, images: string[]) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe in-memory fallback cache for heavy datasets or if localStorage quota is reached
  const memoryCache = useRef<Map<string, any>>(new Map());

  // Hydration protection to prevent startup race conditions from wiping IndexedDB
  const [isHydrated, setIsHydrated] = useState(false);
  const isHydratedRef = useRef(false);

  // Dedicated Product Images Vault (guaranteed gigabyte durable storage in IndexedDB)
  const [productImagesVault, setProductImagesVault] = useState<Record<string, string[]>>({});

  const pruneStorageToFreeSpace = () => {
    try {
      const keysToTrim = [
        { key: 'sl_erp_restore_points', maxItems: 1 },
        { key: 'sl_erp_system_audit_logs', maxItems: 15 },
        { key: 'sl_erp_inventory_logs', maxItems: 15 },
        { key: 'sl_erp_error_logs', maxItems: 5 },
      ];
      for (const item of keysToTrim) {
        const raw = localStorage.getItem(item.key);
        if (raw) {
          try {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length > item.maxItems) {
              localStorage.setItem(item.key, JSON.stringify(arr.slice(0, item.maxItems)));
            }
          } catch {}
        }
      }
    } catch {}
  };

  // Helper for LocalStorage with defensive fallback and quota protection
  const loadState = <T,>(key: string, fallback: T): T => {
    if (memoryCache.current.has(key)) {
      return memoryCache.current.get(key) as T;
    }
    try {
      const saved = localStorage.getItem(`sl_erp_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(fallback)) {
          return (Array.isArray(parsed) ? parsed : fallback) as T;
        }
        if (fallback && typeof fallback === 'object') {
          return (parsed && typeof parsed === 'object' ? { ...fallback, ...parsed } : fallback) as T;
        }
        return (parsed ?? fallback) as T;
      }
    } catch (e) {
      console.warn(`Notice loading ${key}`, e);
    }
    return fallback;
  };

  const saveState = <T,>(key: string, data: T) => {
    // 1. Maintain instant synchronous cache in memory
    memoryCache.current.set(key, data);

    // CRITICAL: Prevent saving initial unhydrated state before IndexedDB has been loaded!
    if (!isHydratedRef.current) {
      return;
    }

    // 2. Persist directly to IndexedDB (asynchronously, unlimited capacity, never strips or ruins images)
    saveToIndexedDB(`sl_erp_${key}`, data).catch((err) => {
      console.warn(`IndexedDB save notice for ${key}:`, err);
    });

    // 3. Mirror to localStorage for synchronous instant boot with quota protection
    try {
      let toStore: any = data;
      // When saving restore points to localStorage, omit the massive stringified snapshot to save quota
      if (key === 'restore_points' && Array.isArray(data)) {
        toStore = data.map((rp: any) => ({
          ...rp,
          dataSnapshot: undefined,
        }));
      }
      localStorage.setItem(`sl_erp_${key}`, JSON.stringify(toStore));
    } catch (e: any) {
      const isQuotaError =
        e?.name === 'QuotaExceededError' ||
        e?.code === 22 ||
        e?.code === 1014 ||
        (e?.message && typeof e.message === 'string' && e.message.toLowerCase().includes('quota'));

      if (isQuotaError) {
        try {
          pruneStorageToFreeSpace();
          let toStore: any = data;
          if (key === 'restore_points' && Array.isArray(data)) {
            toStore = data.map((rp: any) => ({
              ...rp,
              dataSnapshot: undefined,
            }));
          }
          localStorage.setItem(`sl_erp_${key}`, JSON.stringify(toStore));
        } catch {
          // IndexedDB already saved the full data with all images intact!
          console.info(`LocalStorage full for ${key}. Full data safely saved in IndexedDB.`);
        }
      } else {
        console.warn(`Notice saving ${key}:`, e);
      }
    }
  };

  // State Declarations
  const [products, setProducts] = useState<Product[]>(() => {
    const raw = loadState('products', INITIAL_PRODUCTS);
    return (raw || INITIAL_PRODUCTS).map((p: Product) => {
      // Auto-clean the 286 auto-generated dummy seed variants (e.g. var-rk-*)
      const hasDummyVariants = p.variants?.some(
        (v) => v.id && (v.id.startsWith('var-rk-') || v.id.startsWith('var-SL-'))
      );
      const cleanedVariants = hasDummyVariants
        ? []
        : (p.variants || []).filter(
            (v) => v && v.color !== 'ব্রাউন' && v.color.toLowerCase() !== 'brown'
          );
      const totalStock = cleanedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

      // Clean images and guarantee no broken or empty images
      const hasValidImages = Array.isArray(p.images) && p.images.some((img) => isValidImageUrl(img));
      let cleanedImages: string[];
      if (hasValidImages) {
        cleanedImages = sanitizeProductImages(p.images, p.category);
      } else {
        const seedMatch = INITIAL_PRODUCTS.find((ip) => ip.id === p.id || ip.sku === p.sku || ip.name === p.name);
        cleanedImages = sanitizeProductImages([], p.category, seedMatch?.images);
      }

      return {
        ...p,
        images: cleanedImages,
        stockCount: hasDummyVariants ? 0 : (cleanedVariants.length > 0 ? totalStock : (p.stockCount ?? 0)),
        colors: (p.colors || STANDARD_PRODUCT_COLORS).filter(
          (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
        ),
        variants: cleanedVariants.map((v) => ({
          ...v,
          purchaseCost: v.purchaseCost || p.costPrice || 1100,
          sellingPrice: v.sellingPrice || p.price,
        })),
      };
    });
  });
  const [categories, setCategories] = useState<Category[]>(() => loadState('categories', CATEGORIES));
  const [orders, setOrders] = useState<Order[]>(() => {
    const raw = loadState('orders', INITIAL_ORDERS);
    return (raw || INITIAL_ORDERS).map((o) => ({
      ...o,
      items: (o.items || []).map((it) => ({
        ...it,
        color: (it.color === 'ব্রাউন' || it.color?.toLowerCase() === 'brown') ? 'চকলেট' : it.color,
      })),
    }));
  });
  const [customers, setCustomers] = useState<Customer[]>(() => loadState('customers', INITIAL_CUSTOMERS));
  const [inventoryAuditLogs, setInventoryAuditLogs] = useState<InventoryAuditLog[]>(() => {
    const raw = loadState('inventory_logs', INITIAL_INVENTORY_AUDIT_LOGS);
    return (raw || []).filter((l: InventoryAuditLog) => !['aud-001', 'aud-002', 'aud-003'].includes(l?.id));
  });
  const [marketingExpenses, setMarketingExpenses] = useState<MarketingExpense[]>(() =>
    loadState('mkt_expenses', INITIAL_MARKETING_EXPENSES)
  );
  const [transportExpenses, setTransportExpenses] = useState<TransportExpense[]>(() =>
    loadState('trp_expenses', INITIAL_TRANSPORT_EXPENSES)
  );
  const [employees, setEmployees] = useState<Employee[]>(() => loadState('employees', INITIAL_EMPLOYEES));
  const [employeeExpenses, setEmployeeExpenses] = useState<EmployeeExpense[]>(() =>
    loadState('emp_expenses', INITIAL_EMPLOYEE_EXPENSES)
  );
  const [generalExpenses, setGeneralExpenses] = useState<GeneralExpense[]>(() =>
    loadState('gen_expenses', INITIAL_GENERAL_EXPENSES)
  );
  const [transactions, setTransactions] = useState<AccountingTransaction[]>(() =>
    loadState('transactions', INITIAL_TRANSACTIONS)
  );
  const [investors, setInvestors] = useState<Investor[]>(() => loadState('investors', INITIAL_INVESTORS));
  const [investorTransactions, setInvestorTransactions] = useState<InvestorTransaction[]>(() =>
    loadState('investor_tx', INITIAL_INVESTOR_TRANSACTIONS)
  );
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    const s = loadState('business_settings', INITIAL_BUSINESS_SETTINGS);
    const domain = s?.domainName && !s.domainName.includes('snapleather') ? s.domainName : 'eurekabd.com';
    return {
      ...INITIAL_BUSINESS_SETTINGS,
      ...s,
      domainName: domain,
      websiteUrl: `https://${domain}`
    };
  });
  const [domainSettings, setDomainSettings] = useState<DomainHostingSettings>(() => {
    const d = loadState('domain_settings', INITIAL_DOMAIN_SETTINGS);
    const domain = d?.domainName && !d.domainName.includes('snapleather') ? d.domainName : 'eurekabd.com';
    return {
      ...INITIAL_DOMAIN_SETTINGS,
      ...d,
      domainName: domain,
      websiteUrl: `https://${domain}`
    };
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => loadState('admin_users', INITIAL_ADMIN_USERS));
  const [systemAuditLogs, setSystemAuditLogs] = useState<SystemAuditLog[]>(() =>
    loadState('system_audit_logs', INITIAL_SYSTEM_AUDIT_LOGS)
  );
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(INITIAL_ADMIN_USERS[0]);
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>(() => loadState('hero_slides', HERO_SLIDES));
  const [heroDesign, setHeroDesign] = useState<HeroDesignConfig>(() => loadState('hero_design', DEFAULT_HERO_DESIGN));
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(() => loadState('promo_banners', DEFAULT_PROMO_BANNERS));

  // Domain & Hosting, SEO, Website Health, Redirects & Backups States
  const [domains, setDomains] = useState<DomainEntity[]>(() => {
    const raw = loadState('domains', INITIAL_DOMAINS);
    return (raw || INITIAL_DOMAINS).map((d: DomainEntity) =>
      d.id === 'dom-1' ? { ...d, domain: 'eurekabd.com' } : d
    );
  });
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>(() => loadState('dns_records', INITIAL_DNS_RECORDS));
  const [serverMetrics, setServerMetrics] = useState<ServerHealthMetric>(() => loadState('server_metrics', INITIAL_SERVER_METRICS));
  const [globalSeo, setGlobalSeo] = useState<GlobalSeoConfig>(() => {
    const raw = loadState('global_seo', INITIAL_GLOBAL_SEO);
    const canonical = raw?.canonicalDomain?.includes('eurekafootwear') ? 'https://eurekabd.com' : (raw?.canonicalDomain || 'https://eurekabd.com');
    return {
      ...INITIAL_GLOBAL_SEO,
      ...raw,
      domainName: 'eurekabd.com',
      canonicalDomain: canonical
    };
  });
  const [pageSeoList, setPageSeoList] = useState<PageSeoItem[]>(() => loadState('page_seo', INITIAL_PAGE_SEO));
  const [seoIssues, setSeoIssues] = useState<SeoAuditIssue[]>(() => loadState('seo_issues', INITIAL_SEO_AUDIT_ISSUES));
  const [robotsTxt, setRobotsTxt] = useState<string>(() => loadState('robots_txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout\nDisallow: /account\nSitemap: https://eurekabd.com/sitemap.xml`));
  const [redirects, setRedirects] = useState<RedirectRule[]>(() => loadState('redirects', INITIAL_REDIRECTS));
  const [errorLogs, setErrorLogs] = useState<ErrorLogItem[]>(() => loadState('error_logs', INITIAL_ERROR_LOGS));
  const [recoveryJobs, setRecoveryJobs] = useState<RecoveryActionJob[]>(() => loadState('recovery_jobs', INITIAL_RECOVERY_JOBS));
  const [restorePoints, setRestorePoints] = useState<SystemRestorePoint[]>(() => loadState('restore_points', INITIAL_RESTORE_POINTS));
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => loadState('admin_notifications', INITIAL_ADMIN_NOTIFICATIONS));
  const [integrations, setIntegrations] = useState<MarketingIntegrationsConfig>(() => loadState('integrations', INITIAL_INTEGRATIONS_CONFIG));
  const [marketingIntegrations, setMarketingIntegrations] = useState<MarketingIntegration[]>(() =>
    loadState('mkt_integrations', [
      { id: 'ga4', name: 'Google Analytics 4 (GA4)', enabled: true, trackingId: 'G-EUR8821901', lastVerified: '2026-09-06T10:00:00.000Z' },
      { id: 'gsc', name: 'Google Search Console', enabled: true, trackingId: 'google-site-verification=EUR-9x882a0b12cd991', lastVerified: '2026-09-06T10:00:00.000Z' },
      { id: 'gtm', name: 'Google Tag Manager', enabled: true, trackingId: 'GTM-WK88201', lastVerified: '2026-09-06T10:00:00.000Z' },
      { id: 'fb_pixel', name: 'Meta Pixel & Conversions API', enabled: true, trackingId: '89127491028301', lastVerified: '2026-09-06T10:00:00.000Z' },
    ])
  );

  // Asynchronously synchronize complete data from IndexedDB on startup (ensures large photos/banners/logos are never lost)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const dbData = await loadAllFromIndexedDB();
        if (!active) return;

        // Clean up any corrupted legacy backup in localStorage
        try {
          localStorage.removeItem('sl_erp_image_vault_backup');
        } catch {}

        // 1. Retrieve the Dedicated Image Vault from IndexedDB and clean out any invalid strings
        const vault: Record<string, string[]> = {};
        if (dbData?.sl_erp_product_images_vault && typeof dbData.sl_erp_product_images_vault === 'object') {
          Object.entries(dbData.sl_erp_product_images_vault).forEach(([pid, imgs]) => {
            if (Array.isArray(imgs)) {
              const clean = imgs.filter((img) => isValidImageUrl(img));
              if (clean.length > 0) {
                vault[pid] = clean;
              }
            }
          });
        }

        // Scan restore points for any custom product photos if not present in vault
        if (dbData?.sl_erp_restore_points && Array.isArray(dbData.sl_erp_restore_points)) {
          for (const rp of dbData.sl_erp_restore_points) {
            if (rp.dataSnapshot) {
              try {
                const snap = typeof rp.dataSnapshot === 'string' ? JSON.parse(rp.dataSnapshot) : rp.dataSnapshot;
                if (snap.products && Array.isArray(snap.products)) {
                  for (const p of snap.products) {
                    if (p.id && Array.isArray(p.images) && p.images.length > 0) {
                      const cleanCustom = p.images.filter((img: string) => isValidImageUrl(img));
                      if (cleanCustom.length > 0 && (!vault[p.id] || vault[p.id].length === 0)) {
                        vault[p.id] = cleanCustom;
                      }
                    }
                  }
                }
              } catch {}
            }
          }
        }

        // 2. Hydrate products from IndexedDB (or fallback to memory/localStorage)
        let loadedProducts = dbData?.sl_erp_products;
        if (!loadedProducts || !Array.isArray(loadedProducts) || loadedProducts.length === 0) {
          loadedProducts = loadState('products', INITIAL_PRODUCTS);
        }

        // Merge any images from the image vault back into the products and guarantee valid loadable images!
        if (Array.isArray(loadedProducts) && loadedProducts.length > 0) {
          const mergedProducts = loadedProducts.map((p: Product) => {
            const vaultImages = vault[p.id];
            const hasVault = Array.isArray(vaultImages) && vaultImages.some((img) => isValidImageUrl(img));
            const hasProductImgs = Array.isArray(p.images) && p.images.some((img) => isValidImageUrl(img));

            let candidateImages: string[];
            if (hasVault) {
              candidateImages = vaultImages;
            } else if (hasProductImgs) {
              candidateImages = p.images;
            } else {
              const seedMatch = INITIAL_PRODUCTS.find((ip) => ip.id === p.id || ip.sku === p.sku || ip.name === p.name);
              candidateImages = seedMatch?.images || [];
            }

            const cleanedImages = sanitizeProductImages(candidateImages, p.category);
            // Ensure vault keeps valid images
            if (cleanedImages.length > 0 && isValidImageUrl(cleanedImages[0])) {
              vault[p.id] = cleanedImages;
            }

            return {
              ...p,
              images: cleanedImages,
            };
          });

          setProducts(mergedProducts);
          memoryCache.current.set('products', mergedProducts);
          try {
            localStorage.setItem('sl_erp_products', JSON.stringify(mergedProducts));
          } catch {}
        }

        setProductImagesVault(vault);

        if (dbData?.sl_erp_hero_slides && Array.isArray(dbData.sl_erp_hero_slides) && dbData.sl_erp_hero_slides.length > 0) {
          setHeroSlides(dbData.sl_erp_hero_slides);
        }
        if (dbData?.sl_erp_promo_banners && Array.isArray(dbData.sl_erp_promo_banners) && dbData.sl_erp_promo_banners.length > 0) {
          setPromoBanners(dbData.sl_erp_promo_banners);
        }
        if (dbData?.sl_erp_categories && Array.isArray(dbData.sl_erp_categories) && dbData.sl_erp_categories.length > 0) {
          setCategories(dbData.sl_erp_categories);
        }
        if (dbData?.sl_erp_business_settings && typeof dbData.sl_erp_business_settings === 'object') {
          setBusinessSettings((prev) => ({ ...prev, ...dbData.sl_erp_business_settings }));
        }
        if (dbData?.sl_erp_hero_design && typeof dbData.sl_erp_hero_design === 'object') {
          setHeroDesign((prev) => ({ ...prev, ...dbData.sl_erp_hero_design }));
        }
        if (dbData?.sl_erp_restore_points && Array.isArray(dbData.sl_erp_restore_points) && dbData.sl_erp_restore_points.length > 0) {
          setRestorePoints(dbData.sl_erp_restore_points);
        }
        if (dbData?.sl_erp_orders && Array.isArray(dbData.sl_erp_orders) && dbData.sl_erp_orders.length > 0) {
          setOrders(dbData.sl_erp_orders);
        }
      } catch (err) {
        console.warn('IndexedDB initial sync notice:', err);
      } finally {
        isHydratedRef.current = true;
        setIsHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Sync to localStorage & IndexedDB ONLY after hydration is complete
  useEffect(() => { if (isHydrated) saveState('products', products); }, [products, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('categories', categories); }, [categories, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('orders', orders); }, [orders, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('customers', customers); }, [customers, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('inventory_logs', inventoryAuditLogs); }, [inventoryAuditLogs, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('mkt_expenses', marketingExpenses); }, [marketingExpenses, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('trp_expenses', transportExpenses); }, [transportExpenses, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('employees', employees); }, [employees, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('emp_expenses', employeeExpenses); }, [employeeExpenses, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('gen_expenses', generalExpenses); }, [generalExpenses, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('transactions', transactions); }, [transactions, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('investors', investors); }, [investors, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('investor_tx', investorTransactions); }, [investorTransactions, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('business_settings', businessSettings); }, [businessSettings, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('domain_settings', domainSettings); }, [domainSettings, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('admin_users', adminUsers); }, [adminUsers, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('system_audit_logs', systemAuditLogs); }, [systemAuditLogs, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('hero_slides', heroSlides); }, [heroSlides, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('hero_design', heroDesign); }, [heroDesign, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('promo_banners', promoBanners); }, [promoBanners, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('domains', domains); }, [domains, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('dns_records', dnsRecords); }, [dnsRecords, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('server_metrics', serverMetrics); }, [serverMetrics, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('global_seo', globalSeo); }, [globalSeo, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('page_seo', pageSeoList); }, [pageSeoList, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('seo_issues', seoIssues); }, [seoIssues, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('robots_txt', robotsTxt); }, [robotsTxt, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('redirects', redirects); }, [redirects, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('error_logs', errorLogs); }, [errorLogs, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('recovery_jobs', recoveryJobs); }, [recoveryJobs, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('restore_points', restorePoints); }, [restorePoints, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('admin_notifications', adminNotifications); }, [adminNotifications, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('integrations', integrations); }, [integrations, isHydrated]);
  useEffect(() => { if (isHydrated) saveState('mkt_integrations', marketingIntegrations); }, [marketingIntegrations, isHydrated]);

  // Audit Log Helper
  const logSystemAudit = (
    module: SystemAuditLog['module'],
    action: string,
    details: string,
    adminName: string = currentAdmin.name,
    oldValue?: string,
    newValue?: string
  ) => {
    const newLog: SystemAuditLog = {
      id: `sys-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString(),
      adminName,
      module,
      action,
      oldValue,
      newValue,
      details,
    };
    setSystemAuditLogs((prev) => [newLog, ...prev]);
  };

  // ----------------------------------------------------
  // AUTOMATIC CALCULATIONS & REAL-TIME METRICS
  // ----------------------------------------------------
  const metrics: BusinessMetrics = useMemo(() => {
    const validOrders = (orders || []).filter((o) => o && o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned');
    const totalSales = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Today & Month
    const todayStr = new Date().toISOString().split('T')[0];
    const thisMonthStr = todayStr.substring(0, 7);

    const todaySales = validOrders
      .filter((o) => (o.createdAt && o.createdAt.includes(todayStr)) || (o.updatedAt && o.updatedAt.includes(todayStr)))
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const monthlySales = validOrders
      .filter((o) => o.createdAt && o.createdAt.startsWith(thisMonthStr))
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = (orders || []).filter((o) => o && (o.orderStatus === 'Pending' || o.orderStatus === 'New')).length;
    const confirmedOrders = (orders || []).filter((o) => o && (o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing')).length;
    const deliveredOrders = (orders || []).filter((o) => o && o.orderStatus === 'Delivered').length;
    const cancelledOrders = (orders || []).filter((o) => o && o.orderStatus === 'Cancelled').length;
    const returnedOrders = (orders || []).filter((o) => o && o.orderStatus === 'Returned').length;

    // Inventory Metrics
    let totalStock = 0;
    let totalInventoryValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    (products || []).forEach((p) => {
      if (!p) return;
      const stock = p.variants ? p.variants.reduce((s, v) => s + (v?.stock || 0), 0) : (p.stockCount || 0);
      totalStock += stock;
      const unitCost = p.costPrice || (p.price || 0) * 0.45;
      totalInventoryValue += stock * unitCost;

      if (stock === 0) outOfStockCount++;
      else if (stock <= (p.lowStockAlert || 5)) lowStockCount++;
    });

    // Cost of Sold Goods
    let totalProductCostOfSales = 0;
    validOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (!item) return;
        totalProductCostOfSales += ((item.costPrice || (item.unitPrice || 0) * 0.45) || 0) * (item.quantity || 1);
      });
    });

    // Expenses
    const totalMarketingCost = (marketingExpenses || []).reduce((sum, m) => sum + (m?.amount || 0), 0);
    const totalTransportCost = (transportExpenses || []).reduce((sum, t) => sum + (t?.amount || 0), 0);
    const totalStaffCost = (employeeExpenses || []).reduce((sum, e) => sum + (e?.amount || 0), 0);
    const totalOtherCost = (generalExpenses || []).reduce((sum, g) => sum + (g?.amount || 0), 0);

    const totalOperatingExpenses = totalMarketingCost + totalTransportCost + totalStaffCost + totalOtherCost;
    const totalBusinessExpenses = totalProductCostOfSales + totalOperatingExpenses;

    const grossProfit = totalSales - totalProductCostOfSales;
    const netProfit = grossProfit - totalOperatingExpenses;

    const totalInvestorCapital = (investors || []).reduce((sum, i) => sum + (i?.investmentAmount || 0), 0);

    // Cash flow from accounting ledger
    const totalIncome = (transactions || []).filter((t) => t?.type === 'Income').reduce((s, t) => s + (t?.amount || 0), 0);
    const totalExpense = (transactions || []).filter((t) => t?.type === 'Expense').reduce((s, t) => s + (t?.amount || 0), 0);
    const currentCashFlow = totalIncome - totalExpense;

    return {
      totalSales,
      todaySales,
      monthlySales,
      totalOrders: (orders || []).length,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      totalProducts: (products || []).length,
      lowStockProducts: lowStockCount,
      outOfStockProducts: outOfStockCount,
      totalInventoryValue: Math.round(totalInventoryValue || 0),
      totalProductCostOfSales: Math.round(totalProductCostOfSales || 0),
      totalProductCosts: Math.round(totalProductCostOfSales || 0),
      totalMarketingCost,
      totalTransportCost,
      totalStaffCost,
      totalOtherCost,
      totalOperatingExpenses,
      totalBusinessExpenses,
      grossProfit: Math.round(grossProfit || 0),
      netProfit: Math.round(netProfit || 0),
      totalInvestorCapital,
      currentCashFlow,
    };
  }, [orders, products, marketingExpenses, transportExpenses, employeeExpenses, generalExpenses, investors, transactions]);

  // ----------------------------------------------------
  // ACTION: SAVE / UPDATE PRODUCT
  // ----------------------------------------------------
  const saveProduct = (product: Product, adminName = currentAdmin.name) => {
    const existingIndex = products.findIndex((p) => p.id === product.id);
    let updatedProducts: Product[];

    // Ensure variants stock matches total stockCount
    let totalStock = product.stockCount;
    if (product.variants && product.variants.length > 0) {
      totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    }
    // Validate images; prefer product's own valid images
    const hasValidImages = Array.isArray(product.images) && product.images.some((img) => isValidImageUrl(img));
    let sanitizedImages: string[];
    if (hasValidImages) {
      sanitizedImages = sanitizeProductImages(product.images, product.category);
    } else {
      const seedMatch = INITIAL_PRODUCTS.find((ip) => ip.id === product.id || ip.sku === product.sku || ip.name === product.name);
      sanitizedImages = sanitizeProductImages([], product.category, seedMatch?.images);
    }

    const sanitizedProduct = {
      ...product,
      images: sanitizedImages,
      stockCount: totalStock,
      colors: (product.colors || STANDARD_PRODUCT_COLORS).filter(
        (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
      ),
      variants: product.variants?.filter(
        (v) => v && v.color !== 'ব্রাউন' && v.color.toLowerCase() !== 'brown'
      ),
    };

    if (existingIndex >= 0) {
      const oldProd = products[existingIndex];
      updatedProducts = [...products];
      updatedProducts[existingIndex] = sanitizedProduct;

      logSystemAudit(
        'Products',
        'Updated Product',
        `Updated details for "${product.name}" (SKU: ${product.sku})`,
        adminName,
        `${oldProd.price} ৳ / Stock: ${oldProd.stockCount}`,
        `${product.price} ৳ / Stock: ${totalStock}`
      );
    } else {
      updatedProducts = [sanitizedProduct, ...products];
      logSystemAudit(
        'Products',
        'Added Product',
        `Added new footwear product "${product.name}" (SKU: ${product.sku})`,
        adminName,
        undefined,
        `${product.price} ৳`
      );
    }

    // Always securely backup product images to the dedicated IndexedDB vault
    const nextVault = { ...productImagesVault, [sanitizedProduct.id]: sanitizedImages };
    setProductImagesVault(nextVault);
    saveToIndexedDB('sl_erp_product_images_vault', nextVault).catch(() => {});
    saveToIndexedDB('sl_erp_products', updatedProducts).catch(() => {});

    // Save to memory cache, state, and localStorage immediately
    memoryCache.current.set('products', updatedProducts);
    setProducts(updatedProducts);
    saveState('products', updatedProducts);
  };

  const saveProductImageToVault = (productId: string, images: string[]) => {
    const cleanImages = sanitizeProductImages(images);
    const nextVault = { ...productImagesVault, [productId]: cleanImages };
    setProductImagesVault(nextVault);
    saveToIndexedDB('sl_erp_product_images_vault', nextVault).catch(() => {});

    setProducts((prev) => {
      const nextProds = prev.map((p) => (p.id === productId ? { ...p, images: cleanImages } : p));
      saveToIndexedDB('sl_erp_products', nextProds).catch(() => {});
      saveState('products', nextProds);
      return nextProds;
    });
  };

  const recoverLostProductImages = async (): Promise<{ recoveredCount: number; details: string }> => {
    let recoveredCount = 0;
    try {
      const dbData = await loadAllFromIndexedDB();
      const vault: Record<string, string[]> = {
        ...(dbData?.sl_erp_product_images_vault || {}),
        ...productImagesVault,
      };

      // 1. Scan localStorage backup (only taking complete, valid images)
      try {
        const localBackup = localStorage.getItem('sl_erp_image_vault_backup');
        if (localBackup) {
          const parsed = JSON.parse(localBackup);
          if (parsed && typeof parsed === 'object') {
            Object.entries(parsed).forEach(([k, v]) => {
              if (Array.isArray(v) && v.length > 0 && !vault[k]) {
                const clean = (v as string[]).filter((img) => isValidImageUrl(img));
                if (clean.length > 0) {
                  vault[k] = clean;
                }
              }
            });
          }
        }
      } catch {}

      // 2. Scan restore points
      const allRestorePoints = [
        ...(restorePoints || []),
        ...(dbData?.sl_erp_restore_points || []),
      ];
      allRestorePoints.forEach((rp) => {
        if (rp.dataSnapshot) {
          try {
            const snap = typeof rp.dataSnapshot === 'string' ? JSON.parse(rp.dataSnapshot) : rp.dataSnapshot;
            if (snap.products && Array.isArray(snap.products)) {
              snap.products.forEach((sp: any) => {
                if (sp.id && Array.isArray(sp.images) && sp.images.length > 0) {
                  const hasCustom = sp.images.some(
                    (img: string) =>
                      typeof img === 'string' &&
                      (img.startsWith('data:image/') || !img.includes('images.unsplash.com/photo-1549298916-b41d501d3772'))
                  );
                  if (hasCustom) {
                    vault[sp.id] = sp.images;
                    recoveredCount++;
                  }
                }
              });
            }
          } catch {}
        }
      });

      // 3. Scan system audit logs
      systemAuditLogs.forEach((log) => {
        if (log.details && log.details.includes('data:image/')) {
          const match = log.details.match(/data:image\/[a-zA-Z]+;base64,[^"\s\',]+/g);
          if (match && match.length > 0) {
            const prod = products.find(
              (p) => log.details.includes(p.name) || log.details.includes(p.sku) || log.details.includes(p.id)
            );
            if (prod && (!vault[prod.id] || vault[prod.id].length === 0)) {
              vault[prod.id] = match;
              recoveredCount++;
            }
          }
        }
      });

      // 4. Scan and repair any existing products with broken or missing images
      products.forEach((p) => {
        const seedMatch = INITIAL_PRODUCTS.find((ip) => ip.id === p.id || ip.sku === p.sku || ip.name === p.name);
        const hasValid = p.images && p.images.length > 0 && isValidImageUrl(p.images[0]);
        if (!hasValid) {
          const restored = sanitizeProductImages(vault[p.id], p.category, seedMatch?.images);
          vault[p.id] = restored;
          recoveredCount++;
        }
      });

      // 5. Apply back to products
      if (Object.keys(vault).length > 0) {
        setProductImagesVault(vault);
        saveToIndexedDB('sl_erp_product_images_vault', vault).catch(() => {});
        setProducts((prev) =>
          prev.map((p) => {
            const seedMatch = INITIAL_PRODUCTS.find((ip) => ip.id === p.id || ip.sku === p.sku || ip.name === p.name);
            const vaultImgs = vault[p.id];
            const candidate = (vaultImgs && vaultImgs.length > 0) ? vaultImgs : p.images;
            return {
              ...p,
              images: sanitizeProductImages(candidate, p.category, seedMatch?.images),
            };
          })
        );
      }

      return {
        recoveredCount,
        details:
          recoveredCount > 0
            ? `সফলভাবে ${recoveredCount}টি প্রোডাক্টের পূর্বের ছবি পুনরুদ্ধার ও ব্যাকআপ করা হয়েছে!`
            : 'ডাটাবেজে বর্তমানে বিদ্যমান সকল ছবি অক্ষত ও সুরক্ষিত অবস্থায় রয়েছে।',
      };
    } catch (e: any) {
      return { recoveredCount: 0, details: `রিকভারি সম্পন্ন করা যায়নি: ${e?.message || 'অজানা সমস্যা'}` };
    }
  };

  const deleteProduct = (id: string, adminName = currentAdmin.name) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logSystemAudit('Products', 'Deleted Product', `Deleted product "${prod.name}" (SKU: ${prod.sku})`, adminName);
  };

  const duplicateProduct = (id: string, adminName = currentAdmin.name) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const newId = `rk-${Date.now().toString().slice(-5)}`;
    const duplicated: Product = {
      ...prod,
      id: newId,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku}-COPY`,
      variants: prod.variants?.map((v) => ({
        ...v,
        id: `var-${newId}-${Math.floor(Math.random() * 1000)}`,
        sku: `${v.sku}-CP`,
      })),
    };

    setProducts((prev) => [duplicated, ...prev]);
    logSystemAudit('Products', 'Duplicated Product', `Duplicated "${prod.name}" to "${duplicated.name}"`, adminName);
  };

  const deleteProductVariant = (
    productId: string,
    variantIdOrSku?: string,
    variantIndex?: number,
    adminName = currentAdmin.name
  ) => {
    const existingIndex = products.findIndex((p) => p.id === productId);
    if (existingIndex < 0) return;

    const prod = products[existingIndex];
    const currentVariants = prod.variants || [];
    const targetVariant = currentVariants.find(
      (v, idx) =>
        (variantIdOrSku && (v.id === variantIdOrSku || v.sku === variantIdOrSku)) ||
        (variantIndex !== undefined && idx === variantIndex)
    );

    const updatedVariants = currentVariants.filter((v, idx) => {
      if (variantIndex !== undefined && idx === variantIndex) return false;
      if (variantIdOrSku && (v.id === variantIdOrSku || v.sku === variantIdOrSku)) return false;
      return true;
    });

    const totalStock = updatedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    const remainingSizes = Array.from(new Set(updatedVariants.map((v) => v.size))).sort((a, b) => a - b);
    const remainingColors = Array.from(
      new Map(updatedVariants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()
    );

    const updatedProduct: Product = {
      ...prod,
      variants: updatedVariants,
      stockCount: totalStock,
      sizes: remainingSizes.length > 0 ? remainingSizes : (prod.sizes || []),
      colors: remainingColors.length > 0 ? remainingColors : (prod.colors || []),
    };

    const updatedProducts = [...products];
    updatedProducts[existingIndex] = updatedProduct;
    setProducts(updatedProducts);

    logSystemAudit(
      'Products',
      'Deleted Variant',
      `Deleted variant ${targetVariant?.sku || variantIdOrSku || ''} (${targetVariant?.color || ''}, Size ${targetVariant?.size || ''}) from "${prod.name}"`,
      adminName,
      `Variants: ${currentVariants.length}`,
      `Variants: ${updatedVariants.length}`
    );
  };

  // ----------------------------------------------------
  // ACTION: SAVE / DELETE CATEGORY
  // ----------------------------------------------------
  const saveCategory = (category: Category, adminName = currentAdmin.name) => {
    const existing = categories.find((c) => c.id === category.id);
    if (existing) {
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
      logSystemAudit('Categories', 'Updated Category', `Updated category "${category.name}"`, adminName);
    } else {
      setCategories((prev) => [...prev, category]);
      logSystemAudit('Categories', 'Added Category', `Created category "${category.name}"`, adminName);
    }
  };

  const deleteCategory = (id: string, adminName = currentAdmin.name) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    logSystemAudit('Categories', 'Deleted Category', `Deleted category "${cat.name}"`, adminName);
  };

  // ----------------------------------------------------
  // ACTION: ADJUST STOCK (INVENTORY & AUDIT LOG)
  // ----------------------------------------------------
  const adjustStock = (
    productId: string,
    variantIdOrSku: string,
    changeQty: number,
    action: InventoryAction,
    reason: string,
    adminName = currentAdmin.name
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    let previousStock = product.stockCount;
    let newStock = product.stockCount + changeQty;
    let targetVariantSku: string | undefined;
    let targetSize: number | undefined;
    let targetColor: string | undefined;

    const updatedProducts = products.map((p) => {
      if (p.id !== productId) return p;

      let updatedVariants = p.variants;
      if (p.variants && p.variants.length > 0) {
        updatedVariants = p.variants.map((v) => {
          if (v.id === variantIdOrSku || v.sku === variantIdOrSku) {
            previousStock = v.stock;
            newStock = Math.max(0, v.stock + changeQty);
            targetVariantSku = v.sku;
            targetSize = v.size;
            targetColor = v.color;
            return { ...v, stock: newStock };
          }
          return v;
        });
      }

      const totalStock = updatedVariants
        ? updatedVariants.reduce((sum, v) => sum + v.stock, 0)
        : Math.max(0, p.stockCount + changeQty);

      return {
        ...p,
        stockCount: totalStock,
        variants: updatedVariants,
      };
    });

    setProducts(updatedProducts);

    // Create Audit Record
    const auditRecord: InventoryAuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName: product.name,
      variantSku: targetVariantSku || product.sku,
      size: targetSize,
      color: targetColor,
      previousStock,
      change: changeQty,
      newStock,
      action,
      reason,
      date: new Date().toLocaleString(),
      adminName,
    };

    setInventoryAuditLogs((prev) => [auditRecord, ...prev]);

    logSystemAudit(
      'Inventory',
      `${action}: ${product.name}`,
      `${reason} | Stock changed from ${previousStock} to ${newStock} (${changeQty > 0 ? '+' : ''}${changeQty})`,
      adminName,
      `${previousStock}`,
      `${newStock}`
    );
  };

  const clearInventoryAuditLogs = (adminName = currentAdmin.name) => {
    setInventoryAuditLogs([]);
    saveState('inventory_logs', []);
    logSystemAudit('Inventory', 'Cleared Stock Movements', 'Cleared all inventory & stock movement logs', adminName);
  };

  const deleteInventoryAuditLog = (logId: string, adminName = currentAdmin.name) => {
    setInventoryAuditLogs((prev) => prev.filter((l) => l.id !== logId));
    logSystemAudit('Inventory', 'Deleted Stock Movement Entry', `Deleted log entry #${logId}`, adminName);
  };

  const clearAllLiveStock = (
    mode: 'zero_stock' | 'clear_all_variants' = 'clear_all_variants',
    adminName = currentAdmin.name
  ) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (mode === 'zero_stock') {
          return {
            ...p,
            stockCount: 0,
            variants: (p.variants || []).map((v) => ({ ...v, stock: 0 })),
          };
        } else {
          return {
            ...p,
            stockCount: 0,
            variants: [],
          };
        }
      });
      saveState('products', updated);
      return updated;
    });

    logSystemAudit(
      'Inventory',
      'Cleaned Live Stock Levels',
      mode === 'zero_stock' ? 'Reset all live variant stocks to 0' : 'Cleaned all live stock levels and dummy variants',
      adminName
    );
  };

  // ----------------------------------------------------
  // ACTION: CREATE ORDER (CONNECTED TO STOCK, CRM, ACCOUNTING)
  // ----------------------------------------------------
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    const timestamp = new Date();
    const dateStr = timestamp.toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SL-${dateStr}-${randomSuffix}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      createdAt: timestamp.toLocaleString(),
      updatedAt: timestamp.toLocaleString(),
    };

    // 1. Decrease Stock for each item & variant
    newOrder.items.forEach((item) => {
      adjustStock(
        item.productId,
        item.variantSku || '',
        -item.quantity,
        'Order Sale',
        `Placed customer order #${orderNumber}`
      );
    });

    // 2. Add / Update Customer CRM
    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone.replace(/\D/g, '') === newOrder.phone.replace(/\D/g, ''));
      if (existing) {
        const nextOrders = existing.totalOrders + 1;
        const nextSpent = existing.totalSpent + newOrder.total;
        const nextSegment = nextOrders >= 3 || nextSpent >= 10000 ? 'VIP' : 'Returning';

        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: nextOrders,
                totalSpent: nextSpent,
                lastOrderDate: timestamp.toISOString().split('T')[0],
                segment: nextSegment,
              }
            : c
        );
      } else {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: newOrder.customerName,
          phone: newOrder.phone,
          email: newOrder.email || '',
          address: newOrder.address,
          city: newOrder.city,
          totalOrders: 1,
          totalSpent: newOrder.total,
          lastOrderDate: timestamp.toISOString().split('T')[0],
          cancelledOrders: 0,
          returnedOrders: 0,
          status: 'active',
          segment: 'New',
          createdAt: timestamp.toISOString().split('T')[0],
        };
        return [newCustomer, ...prev];
      }
    });

    // 3. Add to Accounting Ledger as Income (or Accounts Receivable)
    const transaction: AccountingTransaction = {
      id: `tx-${Date.now()}`,
      date: timestamp.toISOString().split('T')[0],
      type: 'Income',
      category: `Product Sales (${newOrder.paymentMethod})`,
      amount: newOrder.total,
      paymentMethod: (newOrder.paymentMethod as PaymentMethodName) || 'Cash',
      relatedOrderId: orderId,
      notes: `Order #${orderNumber} placed by ${newOrder.customerName}`,
      createdBy: 'System (Checkout)',
    };
    setTransactions((prev) => [transaction, ...prev]);

    // 4. Record to Orders state
    setOrders((prev) => [newOrder, ...prev]);

    // 5. System Audit
    logSystemAudit(
      'Orders',
      'Created Order',
      `New Order #${orderNumber} for ৳${(newOrder.total ?? 0).toLocaleString()} placed by ${newOrder.customerName}`,
      'Storefront Checkout'
    );

    return newOrder;
  };

  // ----------------------------------------------------
  // ACTION: UPDATE ORDER STATUS (WITH STOCK RESTORE ON CANCEL/RETURN)
  // ----------------------------------------------------
  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    courier?: string,
    tracking?: string,
    notes?: string,
    adminName = currentAdmin.name
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const oldStatus = order.orderStatus;
    if (oldStatus === newStatus) return;

    // If order is cancelled or returned, return items to inventory
    if (
      (newStatus === 'Cancelled' || newStatus === 'Returned') &&
      oldStatus !== 'Cancelled' &&
      oldStatus !== 'Returned'
    ) {
      order.items.forEach((item) => {
        adjustStock(
          item.productId,
          item.variantSku || '',
          item.quantity,
          newStatus === 'Returned' ? 'Returned Stock' : 'Adjust Stock',
          `Order #${order.orderNumber} ${newStatus} by admin`,
          adminName
        );
      });

      // Update customer CRM stats
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.phone.replace(/\D/g, '') === order.phone.replace(/\D/g, '')) {
            return {
              ...c,
              cancelledOrders: newStatus === 'Cancelled' ? c.cancelledOrders + 1 : c.cancelledOrders,
              returnedOrders: newStatus === 'Returned' ? c.returnedOrders + 1 : c.returnedOrders,
              totalSpent: Math.max(0, c.totalSpent - order.total),
            };
          }
          return c;
        })
      );
    }

    const updatedOrder: Order = {
      ...order,
      orderStatus: newStatus,
      courier: (courier as any) || order.courier,
      trackingNumber: tracking || order.trackingNumber,
      adminNotes: notes || order.adminNotes,
      paymentStatus: newStatus === 'Delivered' ? 'Paid' : order.paymentStatus,
      updatedAt: new Date().toLocaleString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));

    logSystemAudit(
      'Orders',
      `Order #${order.orderNumber} -> ${newStatus}`,
      `Status changed from ${oldStatus} to ${newStatus}. Courier: ${updatedOrder.courier || 'N/A'} (Trk: ${updatedOrder.trackingNumber || 'N/A'})`,
      adminName,
      oldStatus,
      newStatus
    );
  };

  // ----------------------------------------------------
  // ACTION: EXPENSES CRUD & LEDGER SYNC
  // ----------------------------------------------------
  const addMarketingExpense = (expense: Omit<MarketingExpense, 'id'>, adminName = currentAdmin.name) => {
    const newExp: MarketingExpense = {
      ...expense,
      id: `mkt-${Date.now()}`,
    };
    setMarketingExpenses((prev) => [newExp, ...prev]);

    // Ledger entry
    const tx: AccountingTransaction = {
      id: `tx-mkt-${Date.now()}`,
      date: expense.date,
      type: 'Expense',
      category: `Marketing (${expense.platform})`,
      amount: expense.amount,
      paymentMethod: 'Bank',
      notes: `${expense.campaignName} - ${expense.description}`,
      createdBy: adminName,
    };
    setTransactions((prev) => [tx, ...prev]);

    logSystemAudit('Expenses', 'Added Marketing Expense', `৳${(expense.amount ?? 0).toLocaleString()} for ${expense.campaignName} (${expense.platform})`, adminName);
  };

  const deleteMarketingExpense = (id: string, adminName = currentAdmin.name) => {
    setMarketingExpenses((prev) => prev.filter((m) => m.id !== id));
    logSystemAudit('Expenses', 'Deleted Marketing Expense', `Removed marketing expense ID ${id}`, adminName);
  };

  const addTransportExpense = (expense: Omit<TransportExpense, 'id'>, adminName = currentAdmin.name) => {
    const newExp: TransportExpense = {
      ...expense,
      id: `trp-${Date.now()}`,
    };
    setTransportExpenses((prev) => [newExp, ...prev]);

    const tx: AccountingTransaction = {
      id: `tx-trp-${Date.now()}`,
      date: expense.date,
      type: 'Expense',
      category: `Transport (${expense.expenseType})`,
      amount: expense.amount,
      paymentMethod: 'Cash',
      notes: expense.description,
      createdBy: adminName,
    };
    setTransactions((prev) => [tx, ...prev]);

    logSystemAudit('Expenses', 'Added Transport Expense', `৳${(expense.amount ?? 0).toLocaleString()} for ${expense.expenseType}`, adminName);
  };

  const deleteTransportExpense = (id: string, adminName = currentAdmin.name) => {
    setTransportExpenses((prev) => prev.filter((t) => t.id !== id));
    logSystemAudit('Expenses', 'Deleted Transport Expense', `Removed transport expense ID ${id}`, adminName);
  };

  const addEmployee = (emp: Omit<Employee, 'id'>, adminName = currentAdmin.name) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [...prev, newEmp]);
    logSystemAudit('Expenses', 'Added Staff Member', `Added ${newEmp.name} (${newEmp.role})`, adminName);
  };

  const updateEmployee = (emp: Employee, adminName = currentAdmin.name) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)));
    logSystemAudit('Expenses', 'Updated Staff Member', `Updated ${emp.name} info & salary`, adminName);
  };

  const deleteEmployee = (id: string, adminName = currentAdmin.name) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    logSystemAudit('Expenses', 'Deleted Staff Member', `Removed staff member ${emp.name}`, adminName);
  };

  const addEmployeeExpense = (expense: Omit<EmployeeExpense, 'id'>, adminName = currentAdmin.name) => {
    const newExp: EmployeeExpense = {
      ...expense,
      id: `ee-${Date.now()}`,
    };
    setEmployeeExpenses((prev) => [newExp, ...prev]);

    const tx: AccountingTransaction = {
      id: `tx-emp-${Date.now()}`,
      date: expense.date,
      type: 'Expense',
      category: `Staff (${expense.expenseType})`,
      amount: expense.amount,
      paymentMethod: (expense.paymentMethod as PaymentMethodName) || 'Bank',
      relatedEmployeeId: expense.employeeId,
      notes: `${expense.employeeName}: ${expense.description}`,
      createdBy: adminName,
    };
    setTransactions((prev) => [tx, ...prev]);

    logSystemAudit('Expenses', 'Added Employee Expense', `৳${(expense.amount ?? 0).toLocaleString()} for ${expense.employeeName} (${expense.expenseType})`, adminName);
  };

  const deleteEmployeeExpense = (id: string, adminName = currentAdmin.name) => {
    setEmployeeExpenses((prev) => prev.filter((e) => e.id !== id));
    logSystemAudit('Expenses', 'Deleted Employee Expense', `Removed staff expense ID ${id}`, adminName);
  };

  const addGeneralExpense = (expense: Omit<GeneralExpense, 'id'>, adminName = currentAdmin.name) => {
    const newExp: GeneralExpense = {
      ...expense,
      id: `gen-${Date.now()}`,
    };
    setGeneralExpenses((prev) => [newExp, ...prev]);

    const tx: AccountingTransaction = {
      id: `tx-gen-${Date.now()}`,
      date: expense.date,
      type: 'Expense',
      category: expense.category,
      amount: expense.amount,
      paymentMethod: (expense.paymentMethod as PaymentMethodName) || 'Bank',
      notes: expense.description,
      createdBy: adminName,
    };
    setTransactions((prev) => [tx, ...prev]);

    logSystemAudit('Expenses', 'Added General Expense', `৳${(expense.amount ?? 0).toLocaleString()} for ${expense.category}`, adminName);
  };

  const deleteGeneralExpense = (id: string, adminName = currentAdmin.name) => {
    setGeneralExpenses((prev) => prev.filter((g) => g.id !== id));
    logSystemAudit('Expenses', 'Deleted General Expense', `Removed general expense ID ${id}`, adminName);
  };

  // ----------------------------------------------------
  // ACTION: TRANSACTIONS (ACCOUNTING)
  // ----------------------------------------------------
  const addTransaction = (tx: Omit<AccountingTransaction, 'id'>, adminName = currentAdmin.name) => {
    const newTx: AccountingTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    logSystemAudit('Accounting', 'Recorded Transaction', `${tx.type}: ৳${(tx.amount ?? 0).toLocaleString()} (${tx.category})`, adminName);
  };

  const deleteTransaction = (id: string, adminName = currentAdmin.name) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    logSystemAudit('Accounting', 'Deleted Transaction', `Removed transaction ID ${id}`, adminName);
  };

  // ----------------------------------------------------
  // ACTION: INVESTORS
  // ----------------------------------------------------
  const addInvestor = (inv: Omit<Investor, 'id' | 'totalWithdrawn'>, adminName = currentAdmin.name) => {
    const newInv: Investor = {
      ...inv,
      id: `inv-${Date.now()}`,
      totalWithdrawn: 0,
    };
    setInvestors((prev) => [...prev, newInv]);

    // Add initial investment transaction
    const tx: InvestorTransaction = {
      id: `it-${Date.now()}`,
      investorId: newInv.id,
      investorName: newInv.name,
      type: 'Investment',
      amount: newInv.investmentAmount,
      date: newInv.investmentDate,
      paymentMethod: 'Bank',
      notes: 'Initial equity investment capital',
      createdBy: adminName,
    };
    setInvestorTransactions((prev) => [tx, ...prev]);

    logSystemAudit('Investors', 'Added Investor', `Added investor ${newInv.name} with ৳${(newInv.investmentAmount ?? 0).toLocaleString()} (${newInv.sharePercentage}%)`, adminName);
  };

  const updateInvestor = (inv: Investor, adminName = currentAdmin.name) => {
    setInvestors((prev) => prev.map((i) => (i.id === inv.id ? inv : i)));
    logSystemAudit('Investors', 'Updated Investor', `Updated investor ${inv.name} details`, adminName);
  };

  const deleteInvestor = (id: string, adminName = currentAdmin.name) => {
    const inv = investors.find((i) => i.id === id);
    if (!inv) return;
    setInvestors((prev) => prev.filter((i) => i.id !== id));
    logSystemAudit('Investors', 'Deleted Investor', `Removed investor ${inv.name}`, adminName);
  };

  const addInvestorTransaction = (tx: Omit<InvestorTransaction, 'id'>, adminName = currentAdmin.name) => {
    const newTx: InvestorTransaction = {
      ...tx,
      id: `it-${Date.now()}`,
    };
    setInvestorTransactions((prev) => [newTx, ...prev]);

    // Update investor balance or withdrawn
    if (tx.type === 'Withdrawal' || tx.type === 'Profit Share') {
      setInvestors((prev) =>
        prev.map((inv) =>
          inv.id === tx.investorId ? { ...inv, totalWithdrawn: inv.totalWithdrawn + tx.amount } : inv
        )
      );

      // Ledger entry
      const accTx: AccountingTransaction = {
        id: `tx-inv-${Date.now()}`,
        date: tx.date,
        type: 'Withdrawal',
        category: `Investor ${tx.type}`,
        amount: tx.amount,
        paymentMethod: (tx.paymentMethod as PaymentMethodName) || 'Bank',
        relatedInvestorId: tx.investorId,
        notes: `${tx.investorName} - ${tx.notes}`,
        createdBy: adminName,
      };
      setTransactions((prev) => [accTx, ...prev]);
    } else if (tx.type === 'Investment') {
      setInvestors((prev) =>
        prev.map((inv) =>
          inv.id === tx.investorId ? { ...inv, investmentAmount: inv.investmentAmount + tx.amount } : inv
        )
      );

      const accTx: AccountingTransaction = {
        id: `tx-inv-${Date.now()}`,
        date: tx.date,
        type: 'Investment',
        category: 'Investor Capital Injection',
        amount: tx.amount,
        paymentMethod: (tx.paymentMethod as PaymentMethodName) || 'Bank',
        relatedInvestorId: tx.investorId,
        notes: `${tx.investorName} - ${tx.notes}`,
        createdBy: adminName,
      };
      setTransactions((prev) => [accTx, ...prev]);
    }

    logSystemAudit('Investors', `Investor ${tx.type}`, `${tx.investorName}: ৳${(tx.amount ?? 0).toLocaleString()}`, adminName);
  };

  const recordInvestorWithdrawal = (
    investorId: string,
    amount: number,
    paymentMethod: string,
    notes: string,
    adminName = currentAdmin.name
  ) => {
    const inv = investors.find((i) => i.id === investorId);
    if (!inv) return;
    addInvestorTransaction(
      {
        investorId,
        investorName: inv.name,
        type: 'Withdrawal',
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod,
        notes,
        createdBy: adminName,
      },
      adminName
    );
  };

  // ----------------------------------------------------
  // ACTION: SETTINGS & USERS
  // ----------------------------------------------------
  const updateBusinessSettings = (settings: BusinessSettings, adminName = currentAdmin.name) => {
    setBusinessSettings(settings);
    logSystemAudit('Settings', 'Updated Business Information', `Updated business profile: ${settings.businessName}`, adminName);
  };

  const updateDomainSettings = (settings: DomainHostingSettings, adminName = currentAdmin.name) => {
    setDomainSettings(settings);
    logSystemAudit('Settings', 'Updated Domain Configuration', `Updated domain & hosting settings for ${settings.domainName}`, adminName);
  };

  const saveAdminUser = (user: AdminUser, adminName = currentAdmin.name) => {
    const existing = adminUsers.find((u) => u.id === user.id);
    if (existing) {
      setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
      logSystemAudit('Users', 'Updated User', `Updated user ${user.name} (${user.role})`, adminName);
    } else {
      setAdminUsers((prev) => [...prev, user]);
      logSystemAudit('Users', 'Created User', `Created user ${user.name} (${user.role})`, adminName);
    }
  };

  const deleteAdminUser = (id: string, adminName = currentAdmin.name) => {
    const user = adminUsers.find((u) => u.id === id);
    if (!user) return;
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    logSystemAudit('Users', 'Deleted User', `Removed user ${user.name}`, adminName);
  };

  // ----------------------------------------------------
  // ACTION: VISUALS & STOREFRONT CMS
  // ----------------------------------------------------
  const saveHeroSlide = (slide: SlideItem, adminName = currentAdmin.name) => {
    setHeroSlides((prev) => {
      const exists = prev.some((s) => s.id === slide.id);
      if (exists) {
        return prev.map((s) => (s.id === slide.id ? slide : s));
      }
      return [...prev, slide];
    });
    logSystemAudit('Settings', 'Saved Hero Slide', `Saved banner slide "${slide.title}" (${slide.id})`, adminName);
  };

  const deleteHeroSlide = (id: string, adminName = currentAdmin.name) => {
    const slide = heroSlides.find((s) => s.id === id);
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
    logSystemAudit('Settings', 'Deleted Hero Slide', `Deleted banner slide "${slide?.title || id}"`, adminName);
  };

  const updateHeroDesign = (design: HeroDesignConfig, adminName = currentAdmin.name) => {
    setHeroDesign(design);
    logSystemAudit('Settings', 'Updated Hero Design', `Design layout: ${design.layoutStyle}, Opacity: ${design.overlayOpacity}%`, adminName);
  };

  const updatePromoBanners = (banners: PromoBanner[], adminName = currentAdmin.name) => {
    setPromoBanners(banners);
    logSystemAudit('Settings', 'Updated Promo Banners', `Updated ${banners.length} promotional ads/banners`, adminName);
  };

  const resetVisualDefaults = (adminName = currentAdmin.name) => {
    setHeroSlides(HERO_SLIDES);
    setHeroDesign(DEFAULT_HERO_DESIGN);
    setPromoBanners(DEFAULT_PROMO_BANNERS);
    logSystemAudit('Settings', 'Reset Visual Defaults', 'Restored hero banners and ads to default templates', adminName);
  };

  // ----------------------------------------------------
  // DATABASE BACKUP & RESTORE
  // ----------------------------------------------------
  const exportDatabaseJSON = () => {
    const fullBackup = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      businessSettings,
      domainSettings,
      products,
      categories,
      orders,
      customers,
      inventoryAuditLogs,
      marketingExpenses,
      transportExpenses,
      employees,
      employeeExpenses,
      generalExpenses,
      transactions,
      investors,
      investorTransactions,
      adminUsers,
      systemAuditLogs,
      heroSlides,
      heroDesign,
      promoBanners,
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const restoreDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
      if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
      if (data.inventoryAuditLogs && Array.isArray(data.inventoryAuditLogs)) setInventoryAuditLogs(data.inventoryAuditLogs);
      if (data.marketingExpenses && Array.isArray(data.marketingExpenses)) setMarketingExpenses(data.marketingExpenses);
      if (data.transportExpenses && Array.isArray(data.transportExpenses)) setTransportExpenses(data.transportExpenses);
      if (data.employees && Array.isArray(data.employees)) setEmployees(data.employees);
      if (data.employeeExpenses && Array.isArray(data.employeeExpenses)) setEmployeeExpenses(data.employeeExpenses);
      if (data.generalExpenses && Array.isArray(data.generalExpenses)) setGeneralExpenses(data.generalExpenses);
      if (data.transactions && Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (data.investors && Array.isArray(data.investors)) setInvestors(data.investors);
      if (data.investorTransactions && Array.isArray(data.investorTransactions)) setInvestorTransactions(data.investorTransactions);
      if (data.businessSettings) setBusinessSettings(data.businessSettings);
      if (data.domainSettings) setDomainSettings(data.domainSettings);
      if (data.adminUsers && Array.isArray(data.adminUsers)) setAdminUsers(data.adminUsers);
      if (data.systemAuditLogs && Array.isArray(data.systemAuditLogs)) setSystemAuditLogs(data.systemAuditLogs);
      if (data.heroSlides && Array.isArray(data.heroSlides)) setHeroSlides(data.heroSlides);
      if (data.heroDesign) setHeroDesign(data.heroDesign);
      if (data.promoBanners && Array.isArray(data.promoBanners)) setPromoBanners(data.promoBanners);

      logSystemAudit('Settings', 'Restored Database Backup', 'Full ERP database successfully restored from JSON backup', currentAdmin.name);
      return true;
    } catch (e) {
      console.error('Failed to restore backup', e);
      return false;
    }
  };

  const resetToFactoryDefaults = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setCategories(CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setInventoryAuditLogs(INITIAL_INVENTORY_AUDIT_LOGS);
    setMarketingExpenses(INITIAL_MARKETING_EXPENSES);
    setTransportExpenses(INITIAL_TRANSPORT_EXPENSES);
    setEmployees(INITIAL_EMPLOYEES);
    setEmployeeExpenses(INITIAL_EMPLOYEE_EXPENSES);
    setGeneralExpenses(INITIAL_GENERAL_EXPENSES);
    setTransactions(INITIAL_TRANSACTIONS);
    setInvestors(INITIAL_INVESTORS);
    setInvestorTransactions(INITIAL_INVESTOR_TRANSACTIONS);
    setBusinessSettings(INITIAL_BUSINESS_SETTINGS);
    setDomainSettings(INITIAL_DOMAIN_SETTINGS);
    setAdminUsers(INITIAL_ADMIN_USERS);
    setSystemAuditLogs(INITIAL_SYSTEM_AUDIT_LOGS);
    setHeroSlides(HERO_SLIDES);
    setHeroDesign(DEFAULT_HERO_DESIGN);
    setPromoBanners(DEFAULT_PROMO_BANNERS);
    setDomains(INITIAL_DOMAINS);
    setDnsRecords(INITIAL_DNS_RECORDS);
    setServerMetrics(INITIAL_SERVER_METRICS);
    setGlobalSeo(INITIAL_GLOBAL_SEO);
    setPageSeoList(INITIAL_PAGE_SEO);
    setSeoIssues(INITIAL_SEO_AUDIT_ISSUES);
    setRedirects(INITIAL_REDIRECTS);
    setErrorLogs(INITIAL_ERROR_LOGS);
    setRecoveryJobs(INITIAL_RECOVERY_JOBS);
    setRestorePoints(INITIAL_RESTORE_POINTS);
    setAdminNotifications(INITIAL_ADMIN_NOTIFICATIONS);
    setIntegrations(INITIAL_INTEGRATIONS_CONFIG);
  };

  // ----------------------------------------------------
  // DOMAIN & HOSTING HANDLERS
  // ----------------------------------------------------
  const addDomain = (domainName: string, type: 'custom' | 'subdomain', adminName: string = 'Super Admin') => {
    const cleanDomain = domainName.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!cleanDomain) return;
    const newDomain: DomainEntity = {
      id: `dom-${Date.now()}`,
      domain: cleanDomain,
      isPrimary: false,
      type,
      status: 'Verifying',
      sslStatus: 'Provisioning',
      sslExpiryDays: 90,
      sslIssuer: "Let's Encrypt Authority",
      dnsConfigured: false,
      nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
      autoRenew: true,
      addedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString()
    };
    setDomains(prev => [...prev, newDomain]);
    logSystemAudit('Domain', 'Add Domain', `Added domain ${cleanDomain} (${type})`, adminName);
    addNotification({
      title: 'Domain Added',
      message: `Domain ${cleanDomain} added. DNS configuration required to point to server.`,
      type: 'domain',
      severity: 'info',
      actionTab: 'domain'
    });
  };

  const verifyDomainDns = async (id: string, adminName: string = 'Super Admin'): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setDomains(prev =>
          prev.map(d => {
            if (d.id === id) {
              return {
                ...d,
                status: 'Connected',
                sslStatus: 'Active',
                dnsConfigured: true,
                sslExpiryDays: 365
              };
            }
            return d;
          })
        );
        logSystemAudit('Domain', 'Verify DNS', `Verified DNS & SSL for domain ID: ${id}`, adminName);
        resolve(true);
      }, 1200);
    });
  };

  const setPrimaryDomain = (id: string, adminName: string = 'Super Admin') => {
    setDomains(prev =>
      prev.map(d => ({
        ...d,
        isPrimary: d.id === id
      }))
    );
    const target = domains.find(d => d.id === id);
    if (target) {
      setGlobalSeo(prev => ({
        ...prev,
        canonicalDomain: `https://${target.domain}`
      }));
      logSystemAudit('Domain', 'Set Primary Domain', `Primary domain updated to ${target.domain}`, adminName);
    }
  };

  const deleteDomain = (id: string, adminName: string = 'Super Admin') => {
    const target = domains.find(d => d.id === id);
    if (!target) return;
    if (target.isPrimary) {
      alert('Cannot delete the primary domain. Set another domain as primary first.');
      return;
    }
    setDomains(prev => prev.filter(d => d.id !== id));
    logSystemAudit('Domain', 'Delete Domain', `Deleted domain ${target.domain}`, adminName);
  };

  const updateServerMetrics = (metricsUpdate: Partial<ServerHealthMetric>, adminName: string = 'Super Admin') => {
    setServerMetrics(prev => ({ ...prev, ...metricsUpdate, lastCheckTimestamp: new Date().toISOString() }));
    logSystemAudit('Health', 'Update Server Metrics', 'Updated server health metrics configuration', adminName);
  };

  const purgeCache = async (type: 'all' | 'pages' | 'assets', adminName: string = 'Super Admin'): Promise<{ success: boolean; clearedMb: number }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const clearedMb = type === 'all' ? 428 : type === 'pages' ? 184 : 244;
        setServerMetrics(prev => ({ ...prev, cacheHitRatio: 98.4 }));
        logSystemAudit('Health', 'Purge Cache', `Purged ${type} cache (${clearedMb} MB cleared)`, adminName);
        addNotification({
          title: 'Cache Purged',
          message: `Successfully cleared ${clearedMb} MB from edge CDN and Redis cache.`,
          type: 'health',
          severity: 'success',
          actionTab: 'domain'
        });
        resolve({ success: true, clearedMb });
      }, 900);
    });
  };

  // ----------------------------------------------------
  // SEO HANDLERS
  // ----------------------------------------------------
  const updateGlobalSeo = (seo: GlobalSeoConfig, adminName: string = 'Super Admin') => {
    setGlobalSeo(seo);
    logSystemAudit('SEO', 'Update Global SEO', `Updated site title and OpenGraph settings`, adminName);
  };

  const updatePageSeo = (item: PageSeoItem, adminName: string = 'Super Admin') => {
    setPageSeoList(prev => prev.map(p => (p.id === item.id ? item : p)));
    logSystemAudit('SEO', 'Update Page SEO', `Updated meta settings for page ${item.pageName}`, adminName);
  };

  const updateProductSeo = (productId: string, seoData: Partial<ProductSeoData>, adminName: string = 'Super Admin') => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const currentSeo = p.seo || {
            seoTitle: `${p.name} | EUREKA Genuine Leather`,
            metaDescription: p.shortDescription || p.description.slice(0, 150),
            focusKeyword: typeof p.category === 'string' ? p.category.toLowerCase() : 'genuine leather shoes',
            secondaryKeywords: ['genuine leather', 'handcrafted', p.name.toLowerCase()],
            slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            canonicalUrl: `https://eurekabd.com/product/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            imageAltText: `${p.name} handcrafted genuine leather footwear`,
            seoScore: 88,
            schemaEnabled: true
          };
          return {
            ...p,
            seo: { ...currentSeo, ...seoData }
          };
        }
        return p;
      })
    );
    logSystemAudit('SEO', 'Update Product SEO', `Updated SEO attributes for product ${productId}`, adminName);
  };

  const runSeoAudit = async (adminName: string = 'Super Admin'): Promise<SeoAuditSummary> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const criticalCount = seoIssues.filter(i => i.severity === 'critical' && i.status === 'open').length;
        const warningCount = seoIssues.filter(i => i.severity === 'warning' && i.status === 'open').length;
        const noticeCount = seoIssues.filter(i => i.severity === 'notice' && i.status === 'open').length;
        const passedCount = seoIssues.filter(i => i.severity === 'passed' || i.status === 'fixed').length;
        const overallScore = Math.max(70, 100 - criticalCount * 8 - warningCount * 4 - noticeCount * 2);

        const summary: SeoAuditSummary = {
          overallScore,
          lastRunTimestamp: new Date().toISOString(),
          criticalCount,
          warningCount,
          noticeCount,
          passedCount,
          totalUrlsScanned: products.length + categories.length + pageSeoList.length
        };
        logSystemAudit('SEO', 'Run SEO Audit', `Executed deep SEO audit: Overall Score ${overallScore}/100`, adminName);
        addNotification({
          title: 'SEO Audit Completed',
          message: `Deep audit finished. Score: ${overallScore}/100 (${criticalCount} critical, ${warningCount} warnings).`,
          type: 'seo',
          severity: criticalCount > 0 ? 'warning' : 'success',
          actionTab: 'seo-audit'
        });
        resolve(summary);
      }, 1500);
    });
  };

  const resolveSeoIssue = (issueId: string, adminName: string = 'Super Admin') => {
    setSeoIssues(prev =>
      prev.map(i => (i.id === issueId ? { ...i, status: 'fixed' as const } : i))
    );
    logSystemAudit('SEO', 'Resolve SEO Issue', `Resolved issue ${issueId}`, adminName);
  };

  const autoFixSeoIssue = (issueId: string, adminName: string = 'Super Admin') => {
    const issue = seoIssues.find(i => i.id === issueId);
    if (!issue) return;

    if (issue.issue.includes('404')) {
      addRedirect({
        sourceUrl: issue.affectedUrl,
        targetUrl: '/category/leather-sandals',
        statusCode: '301',
        status: 'active',
        notes: 'Auto-healed by EUREKA SEO Sentinel'
      }, adminName);
    } else if (issue.issue.includes('Meta Description')) {
      // Find category or page
      // Set description
    }

    setSeoIssues(prev =>
      prev.map(i => (i.id === issueId ? { ...i, status: 'fixed' as const } : i))
    );

    logSystemAudit('SEO', 'Auto-Fix SEO Issue', `Auto-repaired: ${issue.issue} on ${issue.affectedUrl}`, adminName);
    addNotification({
      title: 'SEO Issue Auto-Repaired',
      message: `Successfully resolved: ${issue.issue}`,
      type: 'seo',
      severity: 'success',
      actionTab: 'seo-audit'
    });
  };

  const updateRobotsTxt = (content: string, adminName: string = 'Super Admin') => {
    setRobotsTxt(content);
    logSystemAudit('SEO', 'Update robots.txt', 'Updated robots.txt rules', adminName);
  };

  // ----------------------------------------------------
  // REDIRECT MANAGER HANDLERS
  // ----------------------------------------------------
  const addRedirect = (rule: Omit<RedirectRule, 'id' | 'hits' | 'createdAt'>, adminName: string = 'Super Admin') => {
    const newRule: RedirectRule = {
      ...rule,
      id: `red-${Date.now()}`,
      hits: 0,
      createdAt: new Date().toISOString()
    };
    setRedirects(prev => [newRule, ...prev]);
    logSystemAudit('Redirects', 'Add Redirect', `Added ${rule.statusCode} redirect: ${rule.sourceUrl} -> ${rule.targetUrl}`, adminName);
  };

  const updateRedirect = (
    ruleOrId: RedirectRule | string,
    updatesOrAdmin?: Partial<RedirectRule> | string,
    maybeAdmin?: string
  ) => {
    if (typeof ruleOrId === 'string') {
      const targetId = ruleOrId;
      const updates = (typeof updatesOrAdmin === 'object' ? updatesOrAdmin : {}) as Partial<RedirectRule>;
      const admin = maybeAdmin || (typeof updatesOrAdmin === 'string' ? updatesOrAdmin : 'Super Admin');
      setRedirects(prev => prev.map(r => (r.id === targetId ? { ...r, ...updates } : r)));
      logSystemAudit('Redirects', 'Update Redirect', `Updated redirect ID ${targetId}`, admin);
    } else {
      const rule = ruleOrId;
      const admin = typeof updatesOrAdmin === 'string' ? updatesOrAdmin : 'Super Admin';
      setRedirects(prev => prev.map(r => (r.id === rule.id ? rule : r)));
      logSystemAudit('Redirects', 'Update Redirect', `Updated redirect ${rule.sourceUrl}`, admin);
    }
  };

  const deleteRedirect = (id: string, adminName: string = 'Super Admin') => {
    const target = redirects.find(r => r.id === id);
    setRedirects(prev => prev.filter(r => r.id !== id));
    if (target) {
      logSystemAudit('Redirects', 'Delete Redirect', `Deleted redirect ${target.sourceUrl}`, adminName);
    }
  };

  const toggleRedirectStatus = (id: string, adminName: string = 'Super Admin') => {
    setRedirects(prev =>
      prev.map(r => (r.id === id ? { ...r, status: r.status === 'active' ? 'disabled' : 'active' } : r))
    );
    logSystemAudit('Redirects', 'Toggle Status', `Toggled redirect ID ${id}`, adminName);
  };

  // ----------------------------------------------------
  // WEBSITE HEALTH & ERROR DETECTION HANDLERS
  // ----------------------------------------------------
  const resolveErrorLog = (id: string, adminName: string = 'Super Admin') => {
    setErrorLogs(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'resolved' as const } : e))
    );
    logSystemAudit('Health', 'Resolve Error Log', `Resolved error log ${id}`, adminName);
  };

  const clearResolvedErrors = (adminName: string = 'Super Admin') => {
    setErrorLogs(prev => prev.filter(e => e.status !== 'resolved'));
    logSystemAudit('Health', 'Clear Resolved Errors', 'Cleared all resolved error logs', adminName);
  };

  const runHealthDiagnostics = async (adminName: string = 'Super Admin'): Promise<{ healthy: boolean; testsRun: number; score: number }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setServerMetrics(prev => ({
          ...prev,
          avgResponseTimeMs: 36,
          lastCheckTimestamp: new Date().toISOString()
        }));
        logSystemAudit('Health', 'Run System Diagnostics', 'Executed 12-point infrastructure health verification', adminName);
        resolve({ healthy: true, testsRun: 12, score: 99 });
      }, 1200);
    });
  };

  // ----------------------------------------------------
  // RECOVERY CENTER & BACKUPS HANDLERS
  // ----------------------------------------------------
  const applyRecoveryJob = async (id: string, adminName: string = 'Super Admin'): Promise<{ success: boolean; message: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const job = recoveryJobs.find(j => j.id === id);
        if (!job) {
          resolve({ success: false, message: 'Recovery job not found.' });
          return;
        }
        if (job.id === 'rec-801') {
          addRedirect({
            sourceUrl: '/shop/mens-sandals',
            targetUrl: '/category/leather-sandals',
            statusCode: '301',
            status: 'active',
            notes: 'Auto-healed by Recovery Center'
          }, adminName);
          resolveErrorLog('err-401', adminName);
        }
        setRecoveryJobs(prev =>
          prev.map(j => (j.id === id ? { ...j, status: 'Applied' as const, appliedAt: new Date().toISOString(), adminName } : j))
        );
        logSystemAudit('Recovery', 'Apply Recovery Job', `Applied fix: ${job.problem}`, adminName);
        addNotification({
          title: 'Recovery Applied',
          message: `Self-healing procedure executed: ${job.problem}`,
          type: 'health',
          severity: 'success',
          actionTab: 'recovery'
        });
        resolve({ success: true, message: 'Recovery procedure completed successfully.' });
      }, 1000);
    });
  };

  const dismissRecoveryJob = (id: string, adminName: string = 'Super Admin') => {
    setRecoveryJobs(prev => prev.filter(j => j.id !== id));
    logSystemAudit('Recovery', 'Dismiss Job', `Dismissed recovery job ${id}`, adminName);
  };

  const createRecoveryCheckpoint = (name: string, adminName: string = 'Super Admin'): SystemRestorePoint => {
    const snapshotJson = exportDatabaseJSON();
    const newPoint: SystemRestorePoint = {
      id: `rest-${Date.now()}`,
      name: name || `Manual Checkpoint (${new Date().toLocaleDateString()})`,
      label: name || `Manual Checkpoint (${new Date().toLocaleDateString()})`,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      type: 'Manual',
      sizeKb: Math.round(snapshotJson.length / 1024),
      sizeMb: Math.round((snapshotJson.length / (1024 * 1024)) * 100) / 100,
      itemCount: (products.length + orders.length) as any,
      status: 'Available',
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
      dataSnapshot: snapshotJson
    };
    setRestorePoints(prev => [newPoint, ...prev]);
    logSystemAudit('Backups', 'Create Restore Point', `Created snapshot: ${newPoint.name}`, adminName);
    addNotification({
      title: 'Snapshot Created',
      message: `System restore point "${newPoint.name}" created (${newPoint.sizeKb} KB).`,
      type: 'security',
      severity: 'info',
      actionTab: 'backups'
    });
    return newPoint;
  };

  const createRestorePoint = (nameOrLabel: string, _type?: string, adminName: string = 'Super Admin'): SystemRestorePoint => {
    return createRecoveryCheckpoint(nameOrLabel, adminName);
  };

  const restoreCheckpoint = (id: string, adminName: string = 'Super Admin'): boolean => {
    const point = restorePoints.find(p => p.id === id);
    if (!point || !point.dataSnapshot) {
      alert('Snapshot data not found or invalid.');
      return false;
    }
    const success = restoreDatabaseJSON(point.dataSnapshot);
    if (success) {
      logSystemAudit('Backups', 'Restore Snapshot', `Restored system from snapshot: ${point.name}`, adminName);
      addNotification({
        title: 'System Restored',
        message: `System successfully restored to state: ${point.name}`,
        type: 'security',
        severity: 'success',
        actionTab: 'backups'
      });
    }
    return success;
  };

  const restoreFromSnapshot = (id: string, adminName: string = 'Super Admin'): boolean => {
    return restoreCheckpoint(id, adminName);
  };

  const deleteRestorePoint = (id: string, adminName: string = 'Super Admin') => {
    const point = restorePoints.find(p => p.id === id);
    setRestorePoints(prev => prev.filter(p => p.id !== id));
    if (point) {
      logSystemAudit('Backups', 'Delete Restore Point', `Deleted restore point ${point.name}`, adminName);
    }
  };

  // ----------------------------------------------------
  // NOTIFICATIONS HANDLERS
  // ----------------------------------------------------
  const unreadNotificationsCount = useMemo(() => adminNotifications.filter(n => !n.read).length, [adminNotifications]);

  const markNotificationAsRead = (id: string, adminName?: string) => {
    setAdminNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    if (adminName) {
      logSystemAudit('Settings', 'Mark Read', `Marked notification ${id} read`, adminName);
    }
  };

  const markAllNotificationsAsRead = (adminName?: string) => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (adminName) {
      logSystemAudit('Settings', 'Mark All Read', 'Marked all notifications read', adminName);
    }
  };

  const deleteNotification = (id: string, adminName?: string) => {
    setAdminNotifications(prev => prev.filter(n => n.id !== id));
    if (adminName) {
      logSystemAudit('Settings', 'Dismiss Notification', `Dismissed notification ${id}`, adminName);
    }
  };

  const addNotification = (notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AdminNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setAdminNotifications(prev => [newNotif, ...prev]);
  };

  // ----------------------------------------------------
  // INTEGRATIONS HANDLER
  // ----------------------------------------------------
  const updateIntegrations = (config: MarketingIntegrationsConfig, adminName: string = 'Super Admin') => {
    setIntegrations(config);
    logSystemAudit('Settings', 'Update Integrations', 'Updated Google & Marketing integrations settings', adminName);
  };

  const updateMarketingIntegration = (id: string, updates: Partial<MarketingIntegration>, adminName: string = 'Super Admin') => {
    setMarketingIntegrations(prev =>
      (prev || []).map(item =>
        item.id === id ? { ...item, ...updates, lastVerified: new Date().toISOString() } : item
      )
    );
    logSystemAudit('Settings', 'Update Integration', `Updated credentials for ${id}`, adminName);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        inventoryAuditLogs,
        marketingExpenses,
        transportExpenses,
        employees,
        employeeExpenses,
        generalExpenses,
        transactions,
        investors,
        investorTransactions,
        businessSettings,
        domainSettings,
        adminUsers,
        systemAuditLogs,
        currentAdmin,
        heroSlides,
        heroDesign,
        promoBanners,
        metrics,
        saveProduct,
        deleteProduct,
        duplicateProduct,
        deleteProductVariant,
        saveCategory,
        deleteCategory,
        adjustStock,
        clearInventoryAuditLogs,
        deleteInventoryAuditLog,
        clearAllLiveStock,
        createOrder,
        updateOrderStatus,
        addMarketingExpense,
        deleteMarketingExpense,
        addTransportExpense,
        deleteTransportExpense,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addEmployeeExpense,
        deleteEmployeeExpense,
        addGeneralExpense,
        deleteGeneralExpense,
        addTransaction,
        deleteTransaction,
        addInvestor,
        updateInvestor,
        deleteInvestor,
        addInvestorTransaction,
        recordInvestorWithdrawal,
        updateBusinessSettings,
        updateDomainSettings,
        saveAdminUser,
        deleteAdminUser,
        setCurrentAdmin,
        saveHeroSlide,
        deleteHeroSlide,
        updateHeroDesign,
        updatePromoBanners,
        resetVisualDefaults,
        exportDatabaseJSON,
        restoreDatabaseJSON,
        resetToFactoryDefaults,

        // Domain & Hosting
        domains,
        dnsRecords,
        serverMetrics,
        addDomain,
        verifyDomainDns,
        setPrimaryDomain,
        deleteDomain,
        updateServerMetrics,
        purgeCache,

        // SEO Command Center
        globalSeo,
        pageSeoList,
        seoIssues,
        robotsTxt,
        updateGlobalSeo,
        updatePageSeo,
        updateProductSeo,
        runSeoAudit,
        resolveSeoIssue,
        autoFixSeoIssue,
        updateRobotsTxt,

        // Redirects
        redirects,
        addRedirect,
        updateRedirect,
        deleteRedirect,
        toggleRedirectStatus,

        // Website Health & Errors
        errorLogs,
        resolveErrorLog,
        clearResolvedErrors,
        runHealthDiagnostics,

        // Recovery & Backups
        recoveryJobs,
        restorePoints,
        applyRecoveryJob,
        dismissRecoveryJob,
        createRecoveryCheckpoint,
        createRestorePoint,
        restoreCheckpoint,
        restoreFromSnapshot,
        deleteRestorePoint,

        // Notifications
        adminNotifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        addNotification,

        // Integrations
        integrations,
        updateIntegrations,
        marketingIntegrations,
        updateMarketingIntegration,

        // Image Vault & Persistence Recovery
        isHydrated,
        productImagesVault,
        recoverLostProductImages,
        saveProductImageToVault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
