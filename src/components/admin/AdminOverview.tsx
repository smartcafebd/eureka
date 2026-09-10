import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  Users,
  Briefcase,
  PieChart,
  Truck,
  Megaphone,
  CreditCard,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { BarChartSimple, DonutProgress } from './AnalyticsCharts';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { metrics, orders, products, updateOrderStatus, currentAdmin } = useStore();

  // Recent 6 orders
  const recentOrders = orders.slice(0, 6);

  // Weekly sales trend data mockup calculated from live store
  const weeklyData = [
    { label: 'Mon', value: Math.round(metrics.monthlySales * 0.12), secondaryValue: Math.round(metrics.totalOperatingExpenses * 0.1) },
    { label: 'Tue', value: Math.round(metrics.monthlySales * 0.15), secondaryValue: Math.round(metrics.totalOperatingExpenses * 0.12) },
    { label: 'Wed', value: Math.round(metrics.monthlySales * 0.18), secondaryValue: Math.round(metrics.totalOperatingExpenses * 0.14) },
    { label: 'Thu', value: Math.round(metrics.monthlySales * 0.14), secondaryValue: Math.round(metrics.totalOperatingExpenses * 0.11) },
    { label: 'Fri', value: Math.round(metrics.monthlySales * 0.22), secondaryValue: Math.round(metrics.totalOperatingExpenses * 0.16) },
    { label: 'Sat', value: Math.round(metrics.monthlySales * 0.25), secondaryValue: Math.round(metrics.totalOperatingExpenses * 0.18) },
    { label: 'Sun', value: Math.max(metrics.todaySales, Math.round(metrics.monthlySales * 0.19)), secondaryValue: Math.round(metrics.totalOperatingExpenses * 0.15) },
  ];

  // Expenses breakdown
  const expenseData = [
    { label: 'Staff Payroll', value: metrics.totalStaffCost, color: 'bg-indigo-600' },
    { label: 'Marketing/Ads', value: metrics.totalMarketingCost, color: 'bg-amber-600' },
    { label: 'Transport/Freight', value: metrics.totalTransportCost, color: 'bg-blue-600' },
    { label: 'Rent & Office', value: metrics.totalOtherCost, color: 'bg-emerald-600' },
  ];

  // Low stock products
  const lowStockList = products
    .filter((p) => {
      const stock = p.variants ? p.variants.reduce((s, v) => s + v.stock, 0) : p.stockCount;
      return stock <= (p.lowStockAlert || 5);
    })
    .slice(0, 5);

  const profitMarginPct = metrics.totalSales > 0 ? (metrics.netProfit / metrics.totalSales) * 100 : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Welcome and Quick Action Buttons */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Executive Live Operations Hub
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Business Intelligence Dashboard</h2>
          <p className="text-stone-300 text-sm mt-1">
            Welcome back, <span className="font-semibold text-white">{currentAdmin.name}</span> ({currentAdmin.role}). All systems synchronized.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl shadow transition"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs rounded-xl border border-stone-700 shadow transition"
          >
            <Package className="w-4 h-4 text-amber-400" /> Stock In / Out
          </button>
          <button
            onClick={() => onNavigateTab('expenses')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs rounded-xl border border-stone-700 shadow transition"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" /> Record Expense
          </button>
        </div>
      </div>

      {/* SECTION 1: CORE SALES & REVENUE KPI METRICS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-600" /> Sales & Revenue Stream
          </h3>
          <span className="text-xs text-gray-700 font-medium">Pipe-to-pipe live revenue</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
              <span>Total Revenue (Sales)</span>
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">৳{(metrics?.totalSales ?? 0).toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>{metrics?.totalOrders ?? 0} total orders processed</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
              <span>Today's Sales</span>
              <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">৳{(metrics?.todaySales ?? 0).toLocaleString()}</div>
            <div className="text-[11px] text-gray-500 mt-1">Real-time daily transactions</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
              <span>Monthly Sales</span>
              <span className="p-1 rounded-md bg-blue-50 text-blue-600">
                <ShoppingCart className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">৳{(metrics?.monthlySales ?? 0).toLocaleString()}</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">Current calendar month</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
              <span>Current Cash Flow</span>
              <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                <CreditCard className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className={`text-2xl font-bold ${(metrics?.currentCashFlow ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ৳{(metrics?.currentCashFlow ?? 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Net ledger inflow minus outflow</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PROFIT & LOSS BREAKDOWN */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" /> Profit & Loss Statement (Real-Time)
          </h3>
          <button
            onClick={() => onNavigateTab('profitloss')}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
          >
            Detailed P&L Statement <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-900">1. Gross Profit</span>
            <div className="text-2xl font-bold text-emerald-800 mt-1">৳{(metrics?.grossProfit ?? 0).toLocaleString()}</div>
            <p className="text-[11px] text-emerald-700 mt-1">
              Sales (৳{(metrics?.totalSales ?? 0).toLocaleString()}) - Cost of Goods (৳{(metrics?.totalProductCostOfSales ?? 0).toLocaleString()})
            </p>
          </div>

          <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200">
            <span className="text-xs font-semibold text-rose-900">2. Operating Expenses</span>
            <div className="text-2xl font-bold text-rose-800 mt-1">৳{(metrics?.totalOperatingExpenses ?? 0).toLocaleString()}</div>
            <p className="text-[11px] text-rose-700 mt-1">Ads + Transport + Payroll + Rent</p>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200">
            <span className="text-xs font-semibold text-amber-900">3. Net Business Profit</span>
            <div className={`text-2xl font-bold mt-1 ${(metrics?.netProfit ?? 0) >= 0 ? 'text-amber-900' : 'text-rose-700'}`}>
              ৳{(metrics?.netProfit ?? 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-700 mt-1">Gross Profit - Operating Expenses</p>
          </div>

          <div className="bg-purple-50/60 rounded-xl p-4 border border-purple-200">
            <span className="text-xs font-semibold text-purple-900">4. Investor Capital & Pool</span>
            <div className="text-2xl font-bold text-purple-900 mt-1">৳{(metrics?.totalInvestorCapital ?? 0).toLocaleString()}</div>
            <p className="text-[11px] text-purple-700 mt-1">Total active external investment equity</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: CHARTS & EXPENSES BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Revenue vs Operating Expense Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Revenue vs. Operating Cost Dynamics</h4>
              <p className="text-xs text-gray-500">Amber = Revenue | Gray = Operating Cost</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" /> Revenue
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-stone-300" /> Expenses
              </span>
            </div>
          </div>
          <BarChartSimple data={weeklyData} height={190} />
        </div>

        {/* Operating Expenses Breakdown Chart */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Operating Expense Allocation</h4>
            <p className="text-xs text-gray-500 mb-4">Total: ৳{(metrics?.totalOperatingExpenses ?? 0).toLocaleString()}</p>

            <div className="space-y-3">
              {expenseData.map((exp, i) => {
                const totalOp = metrics?.totalOperatingExpenses ?? 0;
                const pct = totalOp > 0 ? Math.round(((exp.value ?? 0) / totalOp) * 100) : 0;
                return (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-medium text-gray-700 mb-1">
                      <span>{exp.label}</span>
                      <span>৳{(exp.value ?? 0).toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${exp.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DonutProgress percentage={Math.max(0, profitMarginPct)} size={60} strokeWidth={6} label={`${Math.round(profitMarginPct)}%`} />
              <div>
                <span className="text-xs font-bold text-gray-900">Net Profit Margin</span>
                <p className="text-[11px] text-gray-500">Margin after all costs</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('expenses')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              Manage &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: ORDERS PIPELINE & INVENTORY HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order Lifecycle Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Order Lifecycle Operations</h4>
              <p className="text-xs text-gray-500">{metrics.totalOrders} total customer orders</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
            >
              View All Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Order Status Badges */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
            <div className="bg-amber-50 rounded-lg p-2.5 text-center border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending / New</span>
              <span className="text-lg font-bold text-amber-900">{metrics.pendingOrders}</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-2.5 text-center border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Confirmed</span>
              <span className="text-lg font-bold text-blue-900">{metrics.confirmedOrders}</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-2.5 text-center border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Delivered</span>
              <span className="text-lg font-bold text-emerald-900">{metrics.deliveredOrders}</span>
            </div>
            <div className="bg-rose-50 rounded-lg p-2.5 text-center border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Cancelled</span>
              <span className="text-lg font-bold text-rose-900">{metrics.cancelledOrders}</span>
            </div>
            <div className="bg-stone-100 rounded-lg p-2.5 text-center border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-700 block">Returned</span>
              <span className="text-lg font-bold text-stone-900">{metrics.returnedOrders}</span>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 transition">
                    <td className="py-2.5 px-3 font-mono font-medium text-gray-900">{ord.orderNumber}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-900">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500">{ord.phone}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">৳{(ord.total ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Confirmed' || ord.orderStatus === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-indigo-100 text-indigo-800'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {ord.orderStatus === 'New' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Confirmed')}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700"
                        >
                          Confirm
                        </button>
                      )}
                      {ord.orderStatus === 'Confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Shipped', 'Steadfast')}
                          className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-semibold hover:bg-indigo-700"
                        >
                          Ship
                        </button>
                      )}
                      {ord.orderStatus === 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700"
                        >
                          Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory & Low Stock Alerts */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-gray-900 text-sm">Inventory Watch</h4>
              </div>
              <span className="text-xs font-bold text-gray-500">Valuation: ৳{(metrics?.totalInventoryValue ?? 0).toLocaleString()}</span>
            </div>

            {/* Inventory KPI metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-gray-500 block">Catalog</span>
                <span className="text-sm font-bold text-gray-900">{metrics.totalProducts}</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] text-amber-700 block">Low Stock</span>
                <span className="text-sm font-bold text-amber-900">{metrics.lowStockProducts}</span>
              </div>
              <div className="bg-rose-50 p-2 rounded-lg border border-rose-200">
                <span className="text-[10px] text-rose-700 block">Out of Stock</span>
                <span className="text-sm font-bold text-rose-900">{metrics.outOfStockProducts}</span>
              </div>
            </div>

            {/* Critical Low Stock list */}
            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Critical Stock Warning
            </h5>

            {lowStockList.length === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-lg text-emerald-800 text-xs text-center font-medium">
                ✓ All shoe models and sizes have healthy stock levels.
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockList.map((item) => {
                  const stock = item.variants ? item.variants.reduce((s, v) => s + v.stock, 0) : item.stockCount;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                      <div className="truncate max-w-[170px]">
                        <span className="font-semibold text-gray-900 block truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-500">SKU: {item.sku}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                          {stock} in stock
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Manage Inventory & Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};
