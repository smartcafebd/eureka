import {
  DomainEntity,
  DnsRecord,
  ServerHealthMetric,
  GlobalSeoConfig,
  SeoAuditIssue,
  RedirectRule,
  ErrorLogItem,
  RecoveryActionJob,
  SystemRestorePoint,
  AdminNotification,
  MarketingIntegrationsConfig,
  PageSeoItem
} from '../types';

export const INITIAL_DOMAINS: DomainEntity[] = [
  {
    id: 'dom-1',
    domain: 'eurekabd.com',
    isPrimary: true,
    type: 'primary',
    status: 'Connected',
    sslStatus: 'Active',
    sslExpiryDays: 248,
    sslIssuer: "Let's Encrypt Authority X3 (TLS 1.3)",
    dnsConfigured: true,
    nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
    autoRenew: true,
    addedAt: '2025-01-10T00:00:00.000Z',
    expiresAt: '2027-01-10T00:00:00.000Z'
  },
  {
    id: 'dom-2',
    domain: 'shop.eurekabd.com',
    isPrimary: false,
    type: 'custom',
    status: 'Connected',
    sslStatus: 'Active',
    sslExpiryDays: 312,
    sslIssuer: "Cloudflare Managed CA (TLS 1.3)",
    dnsConfigured: true,
    nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
    autoRenew: true,
    addedAt: '2025-04-15T00:00:00.000Z',
    expiresAt: '2027-04-15T00:00:00.000Z'
  },
  {
    id: 'dom-3',
    domain: 'eureka-shoes.store',
    isPrimary: false,
    type: 'custom',
    status: 'Verifying',
    sslStatus: 'Provisioning',
    sslExpiryDays: 0,
    sslIssuer: 'Pending DNS Propagation',
    dnsConfigured: false,
    nameservers: ['ns1.p04.dynect.net', 'ns2.p04.dynect.net'],
    autoRenew: false,
    addedAt: '2026-09-01T12:00:00.000Z',
    expiresAt: '2027-09-01T12:00:00.000Z'
  }
];

export const INITIAL_DNS_RECORDS: DnsRecord[] = [
  {
    type: 'A',
    name: '@ (root domain)',
    value: '199.36.158.100',
    ttl: '3600 (1 hour)',
    status: 'Propagated'
  },
  {
    type: 'CNAME',
    name: 'www',
    value: 'domains.eurekabd.com',
    ttl: '3600 (1 hour)',
    status: 'Propagated'
  },
  {
    type: 'TXT',
    name: '@ (Google Site Verification)',
    value: 'google-site-verification=EUR-9x882a0b12cd991',
    ttl: '3600',
    status: 'Propagated'
  },
  {
    type: 'MX',
    name: '@ (Mail Server)',
    value: 'mail.eurekabd.com (Priority 10)',
    ttl: '14400',
    status: 'Propagated'
  },
  {
    type: 'TXT',
    name: '@ (SPF Security)',
    value: 'v=spf1 include:_spf.google.com ~all',
    ttl: '3600',
    status: 'Propagated'
  },
  {
    type: 'TXT',
    name: '_dmarc (DMARC Policy)',
    value: 'v=DMARC1; p=reject; sp=reject; rua=mailto:dmarc@eurekabd.com',
    ttl: '3600',
    status: 'Propagated'
  }
];

export const INITIAL_SERVER_METRICS: ServerHealthMetric = {
  serverStatus: 'Online',
  uptimePercentage: 99.98,
  avgResponseTimeMs: 38,
  phpVersion: 'PHP 8.3.6 (OPcache Active)',
  nodeVersion: 'Node.js v22.14.0 LTS',
  databaseStatus: 'Connected (Healthy)',
  databaseLatencyMs: 3.8,
  storageUsedGb: 14.8,
  storageTotalGb: 50.0,
  bandwidthUsedGb: 134.2,
  bandwidthTotalGb: 500.0,
  cdnStatus: 'Active (Anycast CDN)',
  cdnProvider: 'Cloudflare Enterprise Edge (285 Global PoPs)',
  cacheHitRatio: 94.6,
  emailConfig: {
    spf: true,
    dkim: true,
    dmarc: true
  },
  lastCheckTimestamp: new Date().toISOString()
};

export const INITIAL_GLOBAL_SEO: GlobalSeoConfig = {
  siteTitle: 'EUREKA | Handcrafted Genuine Leather Footwear',
  titleFormat: '{title} | EUREKA Luxury Footwear',
  metaDescription: 'Shop handcrafted luxury men\'s genuine leather footwear. Goodyear welted Oxfords, Italian loafers, Chelsea boots & anatomic sandals with 100% Cash on Delivery.',
  metaKeywords: 'handcrafted leather shoes, luxury footwear, goodyear welt oxfords, penny loafers, genuine leather boots, leather sandals, bespoke shoes',
  canonicalDomain: 'https://eurekabd.com',
  robotsDefault: 'index, follow',
  ogTitle: 'EUREKA | Handcrafted Genuine Leather Footwear & Boots',
  ogDescription: 'Luxury men\'s footwear handcrafted from Tuscan calfskin and French suede. Goodyear welted with anatomic arch support.',
  ogImage: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  googleVerificationTag: 'google-site-verification=EUR-9x882a0b12cd991',
  bingVerificationTag: 'msvalidate.01=BING99214481239A',
  faviconUrl: '/eureka-logo.png',
  organizationSchemaJson: JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'EUREKA Footwear',
      url: 'https://eurekabd.com',
      logo: 'https://eurekabd.com/eureka-logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+880 1700-000000',
        contactType: 'customer service',
        areaServed: ['BD', 'Worldwide'],
        availableLanguage: ['English', 'Bengali']
      },
      sameAs: [
        'https://facebook.com/eurekafootwear',
        'https://instagram.com/eurekafootwear',
        'https://tiktok.com/@eurekafootwear'
      ]
    },
    null,
    2
  ),
  websiteSchemaJson: JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'EUREKA',
      url: 'https://eurekabd.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://eurekabd.com/?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    null,
    2
  )
};

export const INITIAL_PAGE_SEO: PageSeoItem[] = [
  {
    id: 'page-home',
    pageName: 'Homepage',
    path: '/',
    title: 'EUREKA – Handcrafted Genuine Leather Footwear & Boots',
    description: 'Shop luxury handcrafted men\'s footwear. Goodyear welted Oxfords, Belgian loafers, Chelsea boots & anatomic sandals in Bangladesh.',
    keywords: 'genuine leather shoes, leather boots, loafers, sandals, bangladesh footwear',
    canonical: 'https://eurekabd.com/',
    schemaType: 'WebPage'
  },
  {
    id: 'page-shop',
    pageName: 'All Footwear Collection (Shop)',
    path: '/shop',
    title: 'Shop All Genuine Leather Shoes & Boots | EUREKA',
    description: 'Explore the complete EUREKA footwear collection. Filter by style, leather type, size, and occasions.',
    keywords: 'buy leather shoes online, dress shoes, boots collection, casual sneakers',
    canonical: 'https://eurekabd.com/shop',
    schemaType: 'CollectionPage'
  },
  {
    id: 'page-about',
    pageName: 'Our Story & Craftsmanship',
    path: '/about',
    title: 'The Art of Leather Shoemaking | About EUREKA',
    description: 'Learn about our heritage master craftsmen, vegetable tanning techniques, and obsession with comfort and endurance.',
    keywords: 'leather craftsmanship, goodyear welt process, about eureka, handmade boots',
    canonical: 'https://eurekabd.com/about',
    schemaType: 'AboutPage'
  },
  {
    id: 'page-contact',
    pageName: 'Contact & Atelier Showroom',
    path: '/contact',
    title: 'Contact Concierge & Showrooms | EUREKA',
    description: 'Get in touch with our footwear styling advisors, inquire about custom sizing, or visit our flagship studio.',
    keywords: 'eureka showroom, customer support, shoe repair, custom sizing',
    canonical: 'https://eurekabd.com/contact',
    schemaType: 'ContactPage'
  },
  {
    id: 'page-faq',
    pageName: 'Frequently Asked Questions',
    path: '/faq',
    title: 'Sizing, Shipping & Warranty FAQ | EUREKA',
    description: 'Find answers about Cash on Delivery, home try-on, size conversions, returns, and shoe care advice.',
    keywords: 'shoe size chart, cod delivery, return policy, leather shoe warranty',
    canonical: 'https://eurekabd.com/faq',
    schemaType: 'FAQPage'
  }
];

export const INITIAL_SEO_AUDIT_ISSUES: SeoAuditIssue[] = [
  {
    id: 'audit-1',
    issue: 'Missing Meta Description',
    affectedUrl: '/category/accessories',
    severity: 'critical',
    category: 'Meta Tags',
    explanation: 'Search engines generate generic auto-snippets when meta description is empty, which can lower Organic Click-Through Rate (CTR) by up to 35%.',
    recommendedFix: 'Generate a 150-160 character description highlighting handcrafted leather belts, beeswax polish, and cedar shoe trees.',
    autoFixable: true,
    status: 'open',
    detectedAt: '2026-09-06T09:30:00.000Z'
  },
  {
    id: 'audit-2',
    issue: 'Deprecated Route Returning 404',
    affectedUrl: '/shop/mens-sandals',
    severity: 'critical',
    category: 'Links & URLs',
    explanation: 'External traffic and backlinks hitting /shop/mens-sandals receive HTTP 404, causing lost organic ranking and bounce rate spikes.',
    recommendedFix: 'Provision a 301 Permanent Redirect pointing /shop/mens-sandals to /category/leather-sandals.',
    autoFixable: true,
    status: 'open',
    detectedAt: '2026-09-06T09:44:00.000Z'
  },
  {
    id: 'audit-3',
    issue: 'Missing Image ALT Attribute on Product Thumbnail',
    affectedUrl: '/product/regent-hand-burnished-chelsea-boot',
    severity: 'warning',
    category: 'Images & Alt',
    explanation: 'One product thumbnail image has empty ALT text, failing WCAG AA accessibility standards and missing Google Image Search ranking opportunities.',
    recommendedFix: 'Set ALT attribute to "EUREKA Regent Hand-Burnished Chelsea Boot Side Profile Dainite Sole".',
    autoFixable: true,
    status: 'open',
    detectedAt: '2026-09-06T10:00:00.000Z'
  },
  {
    id: 'audit-4',
    issue: 'Product Schema Missing ItemAvailability Enum',
    affectedUrl: '/product/vanderbilt-double-monkstrap',
    severity: 'warning',
    category: 'Schema & Structured',
    explanation: 'Google Search Console warns that JSON-LD Product schema is missing offer availability (https://schema.org/InStock).',
    recommendedFix: 'Inject ItemAvailability::InStock into the product microdata script tag.',
    autoFixable: true,
    status: 'open',
    detectedAt: '2026-09-06T10:05:00.000Z'
  },
  {
    id: 'audit-5',
    issue: 'Multiple Redirect Chains Detected',
    affectedUrl: '/shoes/oxford -> /products/oxford -> /product/sovereign-cap-toe-oxford',
    severity: 'notice',
    category: 'Links & URLs',
    explanation: 'A 2-hop redirect chain introduces 120ms extra latency for search engine crawlers.',
    recommendedFix: 'Point initial URL /shoes/oxford directly to destination /product/sovereign-cap-toe-oxford.',
    autoFixable: true,
    status: 'open',
    detectedAt: '2026-09-06T10:10:00.000Z'
  },
  {
    id: 'audit-6',
    issue: 'Self-Referencing Canonical Tag Verified',
    affectedUrl: '/',
    severity: 'passed',
    category: 'Performance & Indexing',
    explanation: 'Canonical URL properly declared and matches primary domain https://eurekabd.com.',
    recommendedFix: 'No action required.',
    autoFixable: false,
    status: 'fixed',
    detectedAt: '2026-09-06T09:00:00.000Z'
  },
  {
    id: 'audit-7',
    issue: 'XML Sitemap Formatted Correctly & Accessible',
    affectedUrl: '/sitemap.xml',
    severity: 'passed',
    category: 'Performance & Indexing',
    explanation: 'Sitemap contains 38 indexed URLs, all with valid <lastmod> and <priority> parameters.',
    recommendedFix: 'No action required.',
    autoFixable: false,
    status: 'fixed',
    detectedAt: '2026-09-06T09:00:00.000Z'
  },
  {
    id: 'audit-8',
    issue: 'Valid robots.txt File Configured',
    affectedUrl: '/robots.txt',
    severity: 'passed',
    category: 'Performance & Indexing',
    explanation: 'Search crawlers can index public catalog while admin and checkout routes are safely protected.',
    recommendedFix: 'No action required.',
    autoFixable: false,
    status: 'fixed',
    detectedAt: '2026-09-06T09:00:00.000Z'
  }
];

export const INITIAL_REDIRECTS: RedirectRule[] = [
  {
    id: 'red-1',
    sourceUrl: '/old-sandals-collection',
    targetUrl: '/category/leather-sandals',
    statusCode: '301',
    hits: 142,
    status: 'active',
    notes: 'Legacy seasonal marketing campaign link',
    createdAt: '2026-08-10T12:00:00.000Z',
    lastAccessedAt: '2026-09-06T08:14:00.000Z'
  },
  {
    id: 'red-2',
    sourceUrl: '/shoes/oxford-captoe',
    targetUrl: '/product/sovereign-cap-toe-oxford',
    statusCode: '301',
    hits: 395,
    status: 'active',
    notes: 'Previous platform URL migration mapping',
    createdAt: '2026-08-12T14:30:00.000Z',
    lastAccessedAt: '2026-09-06T09:12:00.000Z'
  },
  {
    id: 'red-3',
    sourceUrl: '/promotions/eid-special',
    targetUrl: '/shop',
    statusCode: '302',
    hits: 87,
    status: 'active',
    notes: 'Temporary festival campaign redirect',
    createdAt: '2026-08-20T10:00:00.000Z',
    lastAccessedAt: '2026-09-05T18:22:00.000Z'
  },
  {
    id: 'red-4',
    sourceUrl: '/delivery-terms',
    targetUrl: '/shipping-policy',
    statusCode: '301',
    hits: 218,
    status: 'active',
    notes: 'Static policy URL consolidation',
    createdAt: '2026-08-01T09:00:00.000Z',
    lastAccessedAt: '2026-09-06T07:45:00.000Z'
  }
];

export const INITIAL_ERROR_LOGS: ErrorLogItem[] = [
  {
    id: 'err-401',
    type: '404',
    url: '/shop/mens-sandals',
    timestamp: '2026-09-06T09:44:12.000Z',
    severity: 'critical',
    message: 'HTTP 404 Not Found: Inbound referral traffic from Google Search failed to resolve to active route.',
    referrer: 'https://www.google.com/',
    ip: '103.221.254.12',
    status: 'open',
    hitCount: 24
  },
  {
    id: 'err-402',
    type: '404',
    url: '/product/leather-belt-cognac-old',
    timestamp: '2026-09-06T08:15:20.000Z',
    severity: 'warning',
    message: 'HTTP 404 Not Found: Direct link to deprecated single accessory URL.',
    referrer: 'Direct / Bookmark',
    ip: '180.211.214.88',
    status: 'open',
    hitCount: 8
  },
  {
    id: 'err-403',
    type: 'BrokenImage',
    url: '/assets/campaign/summer-preview.webp',
    timestamp: '2026-09-05T16:04:00.000Z',
    severity: 'warning',
    message: '404 Asset Error: Promotional banner image file not located on storage bucket.',
    referrer: '/ (Homepage Banner #2)',
    status: 'open',
    hitCount: 15
  },
  {
    id: 'err-404',
    type: 'API',
    url: '/api/v1/courier-rates',
    timestamp: '2026-09-05T22:15:00.000Z',
    severity: 'info',
    message: 'Courier third-party webhook API rate limit reached; internal caching layer successfully served fallback standard rates.',
    status: 'resolved',
    hitCount: 1
  }
];

export const INITIAL_RECOVERY_JOBS: RecoveryActionJob[] = [
  {
    id: 'rec-801',
    problem: 'Broken 404 URL /shop/mens-sandals costing organic traffic',
    rootCause: 'Category slug was renamed to /category/leather-sandals without creating a permanent alias rule.',
    affectedArea: 'Category Routing & Inbound SEO (~140 estimated weekly visitors)',
    proposedFix: 'Automatically provision a 301 Permanent Redirect from /shop/mens-sandals to /category/leather-sandals and purge CDN route cache.',
    riskLevel: 'Low',
    expectedResult: 'Instant HTTP 301 resolution; visitors seamlessly arrive at the active Leather Sandals collection without drop-off.',
    status: 'Proposed',
    adminName: 'EUREKA System Sentinel'
  },
  {
    id: 'rec-802',
    problem: 'Missing Image Asset on Promotional Banner slot',
    rootCause: 'Image URL refers to unuploaded draft asset summer-preview.webp.',
    affectedArea: 'Homepage Promotional Banner Component',
    proposedFix: 'Automatically update image reference to fallback high-res banner asset or re-link to active cloud CDN image.',
    riskLevel: 'Low',
    expectedResult: 'Banner renders crisp artisanal footwear visuals with zero missing asset icons or layout shifts.',
    status: 'Proposed',
    adminName: 'EUREKA Asset Sentinel'
  },
  {
    id: 'rec-803',
    problem: 'Orphaned Inventory Variant References Check',
    rootCause: 'Historical draft testing entries in staging.',
    affectedArea: 'Database Integrity (Variants table)',
    proposedFix: 'Safely re-index database foreign keys without deleting any products or sales records.',
    riskLevel: 'Low',
    expectedResult: '100% database schema consistency verified with clean index integrity.',
    status: 'Applied',
    appliedAt: '2026-09-06T06:00:00.000Z',
    adminName: 'Alexander Sterling'
  }
];

export const INITIAL_RESTORE_POINTS: SystemRestorePoint[] = [
  {
    id: 'rest-1',
    name: 'Pre-Deployment Production Baseline Snapshot (v2.4.0)',
    createdAt: '2026-09-06T00:00:00.000Z',
    type: 'Scheduled Daily',
    sizeKb: 1420,
    status: 'Available',
    checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'rest-2',
    name: 'Weekly Full Catalog, Inventory & Accounting Checkpoint',
    createdAt: '2026-09-01T00:00:00.000Z',
    type: 'Scheduled Daily',
    sizeKb: 1390,
    status: 'Available',
    checksum: 'sha256:c2b189ff740a12e84d2919bb110034a1768f54316d2e680a96932a39281a0391'
  },
  {
    id: 'rest-3',
    name: 'Manual Backup Before Category Restructure',
    createdAt: '2026-08-25T14:20:00.000Z',
    type: 'Manual',
    sizeKb: 1350,
    status: 'Available',
    checksum: 'sha256:a12b449910c2847a9e18b871900138da018274bc7389104871928019ab234509'
  }
];

export const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: '404 Inbound Spike Detected',
    message: '24 visitors received HTTP 404 on /shop/mens-sandals. One-click 301 fix available in Recovery Center.',
    type: 'health',
    severity: 'critical',
    timestamp: '2026-09-06T09:44:12.000Z',
    read: false,
    actionTab: 'recovery'
  },
  {
    id: 'notif-2',
    title: 'SSL Certificate Auto-Renew Verified',
    message: 'SSL/TLS certificate for eurekabd.com is healthy and valid for 248 days with automatic renewal enabled.',
    type: 'ssl',
    severity: 'success',
    timestamp: '2026-09-06T07:00:00.000Z',
    read: false,
    actionTab: 'domain'
  },
  {
    id: 'notif-3',
    title: 'SEO Audit: Missing Meta Description',
    message: 'Category "Leather Care & Goods" is missing meta description, affecting Google organic CTR.',
    type: 'seo',
    severity: 'warning',
    timestamp: '2026-09-06T09:30:00.000Z',
    read: false,
    actionTab: 'seo-audit'
  },
  {
    id: 'notif-4',
    title: 'Server Latency Healthy (38ms)',
    message: 'Global edge response time averaged 38ms over the last 24 hours with 99.98% uptime.',
    type: 'health',
    severity: 'info',
    timestamp: '2026-09-06T08:00:00.000Z',
    read: true,
    actionTab: 'health'
  },
  {
    id: 'notif-5',
    title: 'Low Stock Alert: The Regent Chelsea Boot',
    message: 'Only 8 pairs remaining across all sizes. Restock batch suggested.',
    type: 'stock',
    severity: 'warning',
    timestamp: '2026-09-05T18:40:00.000Z',
    read: true,
    actionTab: 'inventory'
  }
];

export const INITIAL_INTEGRATIONS_CONFIG: MarketingIntegrationsConfig = {
  googleSearchConsole: {
    enabled: true,
    verificationTag: 'google-site-verification=EUR-9x882a0b12cd991',
    sitemapSubmitted: true,
    lastCrawlDate: '2026-09-06T04:20:00.000Z',
    indexedPagesCount: 38
  },
  googleAnalytics4: {
    enabled: true,
    measurementId: 'G-EUR8821901',
    enhancedEcommerce: true
  },
  googleTagManager: {
    enabled: true,
    containerId: 'GTM-WK88201'
  },
  googleMerchantCenter: {
    enabled: true,
    merchantId: 'EUR-MC-90812',
    feedUrl: 'https://eurekabd.com/api/feeds/google-merchant.xml',
    currency: 'BDT',
    productCount: 42,
    lastSyncedAt: '2026-09-06T06:00:00.000Z'
  },
  metaPixel: {
    enabled: true,
    pixelId: '89127491028301',
    conversionsApiToken: 'EAAG...k92841_token',
    testEventCode: 'TEST28491'
  },
  alerts: {
    adminEmailAlerts: true,
    alertEmail: 'admin@eurekabd.com',
    telegramWebhookUrl: 'https://api.telegram.org/bot7819284:AAHq_telegram_webhook',
    slackWebhookUrl: 'https://hooks.slack.com/services/T00/B00/eureka-alerts',
    notifyOnSslExpiry: true,
    notifyOn404Spike: true,
    notifyOnServerDowntime: true
  }
};
