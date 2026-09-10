import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminExpenses } from './AdminExpenses';
import { AdminAccounting } from './AdminAccounting';
import { AdminProfitLoss } from './AdminProfitLoss';
import { AdminInvestors } from './AdminInvestors';
import { AdminCRM } from './AdminCRM';
import { AdminSettings } from './AdminSettings';
import { AdminCategories } from './AdminCategories';
import { AdminInvoiceModal } from './AdminInvoiceModal';
import { AdminDomainHosting } from './AdminDomainHosting';
import { AdminSEOManager } from './AdminSEOManager';
import { AdminSEOAudit } from './AdminSEOAudit';
import { AdminWebsiteHealth } from './AdminWebsiteHealth';
import { AdminRecoveryCenter } from './AdminRecoveryCenter';
import { AdminRedirectManager } from './AdminRedirectManager';
import { AdminSitemapRobots } from './AdminSitemapRobots';
import { AdminIntegrations } from './AdminIntegrations';
import { AdminBackupRestore } from './AdminBackupRestore';
import { AdminNotificationModal } from './AdminNotificationModal';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Receipt,
  CreditCard,
  TrendingUp,
  Users,
  UserCheck,
  Settings,
  ExternalLink,
  Menu,
  X,
  Bell,
  LogOut,
  Shield,
  Lock as LockIcon,
  ChevronRight,
  Sparkles,
  Palette,
  Layers,
  Globe,
  Search,
  FileSearch,
  Activity,
  LifeBuoy,
  ArrowRightLeft,
  FileCode2,
  Share2,
  HardDriveDownload
} from 'lucide-react';

interface AdminLayoutProps {
  onExitAdmin: () => void;
  onLockAdmin?: () => void;
  activeTab?: AdminModuleTab;
  onTabChange?: (tab: AdminModuleTab) => void;
}

export type AdminModuleTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'expenses'
  | 'accounting'
  | 'profitloss'
  | 'investors'
  | 'crm'
  | 'domain'
  | 'seo'
  | 'seo-audit'
  | 'health'
  | 'recovery'
  | 'redirects'
  | 'sitemap'
  | 'integrations'
  | 'backups'
  | 'visuals'
  | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitAdmin, onLockAdmin, activeTab, onTabChange }) => {
  const {
    currentAdmin,
    businessSettings,
    orders,
    products,
    metrics,
    categories,
    seoIssues,
    errorLogs,
    adminNotifications,
    serverMetrics
  } = useStore();

  const [internalTab, setInternalTab] = useState<AdminModuleTab>(activeTab || 'overview');

  React.useEffect(() => {
    if (activeTab && activeTab !== internalTab) {
      setInternalTab(activeTab);
    }
  }, [activeTab, internalTab]);

  const currentTab = activeTab || internalTab;

  const handleSelectTab = (tab: AdminModuleTab) => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Badge calculations
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'New' || o.orderStatus === 'Pending').length;
  const lowStockCount = products.filter((p) => {
    const stock = p.variants ? p.variants.reduce((s, v) => s + v.stock, 0) : p.stockCount;
    return stock <= (p.lowStockAlert || 5);
  }).length;
  const criticalAuditCount = seoIssues.filter(i => i.severity === 'critical' && i.status === 'open').length;
  const openErrorsCount = errorLogs.filter(e => e.status === 'open').length;
  const unreadAlertsCount = adminNotifications.filter(n => !n.read).length;

  const navSections = [
    {
      groupTitle: 'Core Commerce',
      items: [
        {
          id: 'overview' as AdminModuleTab,
          label: 'Executive Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'products' as AdminModuleTab,
          label: 'Products & Variants',
          icon: Package,
          badge: `${products.length}`,
        },
        {
          id: 'categories' as AdminModuleTab,
          label: 'Categories & Images',
          icon: Layers,
          badge: `${categories.length}`,
          badgeColor: 'bg-amber-600 text-white',
        },
        {
          id: 'inventory' as AdminModuleTab,
          label: 'Inventory & Stock',
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
          badgeColor: 'bg-rose-500 text-white',
        },
        {
          id: 'orders' as AdminModuleTab,
          label: 'Orders & Fulfillment',
          icon: ShoppingCart,
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
          badgeColor: 'bg-amber-500 text-white',
        },
        {
          id: 'crm' as AdminModuleTab,
          label: 'Customers (CRM)',
          icon: UserCheck,
          badge: null,
        },
      ]
    },
    {
      groupTitle: 'SEO & System Health',
      items: [
        {
          id: 'domain' as AdminModuleTab,
          label: 'Domain & Hosting',
          icon: Globe,
          badge: 'Online',
          badgeColor: 'bg-emerald-600 text-white',
        },
        {
          id: 'seo' as AdminModuleTab,
          label: 'SEO Command Center',
          icon: Search,
          badge: 'AI Powered',
          badgeColor: 'bg-amber-500/20 text-amber-800 font-bold',
        },
        {
          id: 'seo-audit' as AdminModuleTab,
          label: 'Automatic SEO Audit',
          icon: FileSearch,
          badge: criticalAuditCount > 0 ? `${criticalAuditCount} Fix` : '88/100',
          badgeColor: criticalAuditCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white',
        },
        {
          id: 'health' as AdminModuleTab,
          label: 'Website Health & Errors',
          icon: Activity,
          badge: openErrorsCount > 0 ? `${openErrorsCount} Errors` : `${serverMetrics.avgResponseTimeMs}ms`,
          badgeColor: openErrorsCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white',
        },
        {
          id: 'recovery' as AdminModuleTab,
          label: 'Recovery Center',
          icon: LifeBuoy,
          badge: 'Self-Heal',
          badgeColor: 'bg-blue-600 text-white',
        },
        {
          id: 'redirects' as AdminModuleTab,
          label: 'Redirects (301/302)',
          icon: ArrowRightLeft,
          badge: null,
        },
        {
          id: 'sitemap' as AdminModuleTab,
          label: 'Sitemap & Robots.txt',
          icon: FileCode2,
          badge: 'XML Live',
          badgeColor: 'bg-stone-200 text-stone-700',
        },
        {
          id: 'integrations' as AdminModuleTab,
          label: 'Google & Marketing',
          icon: Share2,
          badge: 'GA4 / Pixel',
          badgeColor: 'bg-stone-100 text-stone-700',
        },
        {
          id: 'backups' as AdminModuleTab,
          label: 'Backup & Restore',
          icon: HardDriveDownload,
          badge: null,
        },
      ]
    },
    {
      groupTitle: 'Finance & Partners',
      items: [
        {
          id: 'expenses' as AdminModuleTab,
          label: 'Expense Management',
          icon: Receipt,
          badge: null,
        },
        {
          id: 'accounting' as AdminModuleTab,
          label: 'Accounting & Ledger',
          icon: CreditCard,
          badge: null,
        },
        {
          id: 'profitloss' as AdminModuleTab,
          label: 'Profit & Loss (P&L)',
          icon: TrendingUp,
          badge: null,
        },
        {
          id: 'investors' as AdminModuleTab,
          label: 'Investors & Partners',
          icon: Users,
          badge: null,
        },
      ]
    },
    {
      groupTitle: 'Branding & Store CMS',
      items: [
        {
          id: 'visuals' as AdminModuleTab,
          label: 'Hero Banners & Visuals',
          icon: Palette,
          badge: 'CMS',
          badgeColor: 'bg-emerald-600 text-white',
        },
        {
          id: 'settings' as AdminModuleTab,
          label: 'Settings & Branding',
          icon: Settings,
          badge: null,
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans antialiased text-stone-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-stone-800 rounded-lg lg:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-bold text-base tracking-tight">{businessSettings.storeName}</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono font-semibold">
                ERP & SEO COMMAND
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell Button */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition"
              title="Notifications & System Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700/60 text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-300">Signed in as:</span>
              <span className="font-bold text-white">{currentAdmin.name}</span>
              <span className="text-[10px] text-amber-400">({currentAdmin.role})</span>
            </div>

            {onLockAdmin && (
              <button
                onClick={onLockAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold border border-stone-700 transition cursor-pointer"
                title="ইআরপি লক করুন"
              >
                <LockIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">লক করুন</span>
              </button>
            )}

            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Visit Storefront
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col pt-16 lg:pt-0 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Business Mini Badge */}
          <div className="px-4 py-3 border-b border-gray-100 bg-stone-50/50">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Business Operations</div>
          </div>

          {/* Grouped Navigation List */}
          <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="px-3 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  {section.groupTitle}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleSelectTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs font-bold'
                          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600' : 'text-stone-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            item.badgeColor || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Quick Metrics Footer in Sidebar */}
          <div className="p-4 border-t border-gray-200 bg-stone-50 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600 text-[11px]">
              <span>Server Latency:</span>
              <span className="font-bold font-mono text-emerald-700">{serverMetrics.avgResponseTimeMs}ms (Online)</span>
            </div>
            <div className="flex justify-between text-gray-600 text-[11px]">
              <span>Uptime SLA:</span>
              <span className="font-bold text-gray-900">{serverMetrics.uptimePercentage}%</span>
            </div>
            <div className="flex justify-between text-gray-600 text-[11px]">
              <span>Today's Sales:</span>
              <span className="font-bold text-gray-900">৳{(metrics?.todaySales ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'overview' && <AdminOverview onNavigateTab={(tab) => handleSelectTab(tab as any)} />}
          {currentTab === 'products' && <AdminProducts />}
          {currentTab === 'categories' && <AdminCategories />}
          {currentTab === 'inventory' && <AdminInventory />}
          {currentTab === 'orders' && (
            <AdminOrders onOpenInvoice={(order) => setActiveInvoiceOrder(order)} />
          )}
          {currentTab === 'expenses' && <AdminExpenses />}
          {currentTab === 'accounting' && <AdminAccounting />}
          {currentTab === 'profitloss' && <AdminProfitLoss />}
          {currentTab === 'investors' && <AdminInvestors />}
          {currentTab === 'crm' && <AdminCRM />}
          {currentTab === 'domain' && <AdminDomainHosting />}
          {currentTab === 'seo' && <AdminSEOManager onNavigateTab={(tab) => handleSelectTab(tab as any)} />}
          {currentTab === 'seo-audit' && <AdminSEOAudit />}
          {currentTab === 'health' && <AdminWebsiteHealth />}
          {currentTab === 'recovery' && <AdminRecoveryCenter />}
          {currentTab === 'redirects' && <AdminRedirectManager />}
          {currentTab === 'sitemap' && <AdminSitemapRobots />}
          {currentTab === 'integrations' && <AdminIntegrations />}
          {currentTab === 'backups' && <AdminBackupRestore />}
          {currentTab === 'visuals' && <AdminSettings initialTab="hero" />}
          {currentTab === 'settings' && <AdminSettings initialTab="brand" />}
        </main>
      </div>

      {/* INVOICE MODAL */}
      {activeInvoiceOrder && (
        <AdminInvoiceModal
          order={activeInvoiceOrder}
          settings={businessSettings}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}

      {/* NOTIFICATIONS MODAL */}
      <AdminNotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={(tab) => handleSelectTab(tab as any)}
      />
    </div>
  );
};
