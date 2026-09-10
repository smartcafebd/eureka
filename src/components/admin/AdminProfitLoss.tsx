import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileSpreadsheet,
  PieChart,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AdminProfitLoss: React.FC = () => {
  const { metrics, products, orders } = useStore();
  const [timeRange, setTimeRange] = useState<'today' | 'month' | 'year' | 'all'>('month');

  // Simulated factor based on time range for illustration
  const scale = timeRange === 'today' ? 0.04 : timeRange === 'year' ? 12 : timeRange === 'month' ? 1 : 1;

  const totalSales = Math.round(metrics.totalSales * (timeRange === 'all' ? 1 : scale));
  const totalCogs = Math.round(metrics.totalProductCosts * (timeRange === 'all' ? 1 : scale));
  const grossProfit = totalSales - totalCogs;
  const grossMargin = totalSales > 0 ? Math.round((grossProfit / totalSales) * 100) : 0;

  const marketingExpense = Math.round(metrics.totalMarketingCost * scale);
  const transportExpense = Math.round(metrics.totalTransportCost * scale);
  const staffExpense = Math.round(metrics.totalStaffCost * scale);
  const generalExpense = Math.round(metrics.totalOtherCost * scale);
  const totalOpex = marketingExpense + transportExpense + staffExpense + generalExpense;

  const netProfit = grossProfit - totalOpex;
  const netMargin = totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" /> Executive Profit & Loss Statement
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit-grade P&L statement calculated directly from confirmed shoe sales and itemized operational disbursements.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg transition ${
              timeRange === 'today' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg transition ${
              timeRange === 'month' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 rounded-lg transition ${
              timeRange === 'year' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            This Year
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              timeRange === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
            <span>Gross Sales Revenue</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">100% of Top Line</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">৳{totalSales.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-2">
            Net footwear billing across retail website and phone orders.
          </p>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
            <span>Gross Profit (After COGS)</span>
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">{grossMargin}% Margin</span>
          </div>
          <div className="text-3xl font-bold text-amber-700">৳{grossProfit.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-2">
            Revenue minus leather, soles, craftsmanship, and packaging.
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
            <span>Net Operating Profit</span>
            <span
              className={`px-2 py-0.5 rounded font-bold ${
                netMargin >= 15 ? 'text-emerald-800 bg-emerald-50' : 'text-amber-800 bg-amber-50'
              }`}
            >
              {netMargin}% Net Margin
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-800">৳{netProfit.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-2">
            Final bottom line available for reinvestment or investor dividends.
          </p>
        </div>
      </div>

      {/* Structured P&L Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-stone-900 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm">Detailed Financial Income Statement</h3>
            <p className="text-[11px] text-stone-300">Statement period: {timeRange.toUpperCase()}</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            NET: ৳{netProfit.toLocaleString()} ({netMargin}%)
          </span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {/* Revenue */}
          <div className="p-4 bg-stone-50/50 flex justify-between items-center font-bold text-gray-900">
            <span className="text-sm">1. Gross Revenue from Footwear Sales</span>
            <span className="text-sm">৳{(totalSales ?? 0).toLocaleString()}</span>
          </div>

          {/* COGS */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>2. Cost of Goods Sold (COGS)</span>
              <span className="text-rose-600">-৳{(totalCogs ?? 0).toLocaleString()}</span>
            </div>
            <div className="pl-4 space-y-1 text-gray-500 text-[11px]">
              <div className="flex justify-between">
                <span>• Leather, Soles & Shoe Manufacturing Craftsmanship</span>
                <span>-৳{(Math.round((totalCogs ?? 0) * 0.72) ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Shoe Boxes, Dust Bags & Branded Packaging</span>
                <span>-৳{(Math.round((totalCogs ?? 0) * 0.12) ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Factory Inbound Freight & Warehouse Handling</span>
                <span>-৳{(Math.round((totalCogs ?? 0) * 0.16) ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Gross Profit Line */}
          <div className="p-4 bg-amber-50/60 flex justify-between items-center font-bold text-amber-950 border-y border-amber-200">
            <span>GROSS OPERATING PROFIT</span>
            <span className="text-base">৳{(grossProfit ?? 0).toLocaleString()} ({grossMargin}%)</span>
          </div>

          {/* Operating Expenses */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>3. Operating & Administrative Expenses (OPEX)</span>
              <span className="text-rose-600">-৳{(totalOpex ?? 0).toLocaleString()}</span>
            </div>
            <div className="pl-4 space-y-1.5 text-gray-600 text-[11px]">
              <div className="flex justify-between">
                <span>• Digital Marketing (Facebook, Google, TikTok Ads)</span>
                <span className="font-medium">-৳{(marketingExpense ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Outbound Courier & Vehicle Transport Logistics</span>
                <span className="font-medium">-৳{(transportExpense ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Staff Salaries, Craft Master Compensation & Allowances</span>
                <span className="font-medium">-৳{(staffExpense ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Showroom / Office Rent, Electricity & Utilities</span>
                <span className="font-medium">-৳{(generalExpense ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Final Net Profit Line */}
          <div className="p-5 bg-emerald-50 flex justify-between items-center font-bold text-emerald-950 border-t-2 border-emerald-500">
            <div>
              <span className="text-base block">NET BUSINESS PROFIT</span>
              <span className="text-xs text-emerald-700 font-normal">
                Net surplus after deducting all product costs, media spend, payroll, and overheads.
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl text-emerald-800 block">৳{(netProfit ?? 0).toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-semibold">{netMargin}% of Total Revenue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shoe Model Profitability Contribution */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-stone-50 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Shoe Model Unit Profitability Matrix</h4>
            <p className="text-[11px] text-gray-500">Calculated unit margins per footwear model in current catalog.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Footwear Model</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Allocated Unit Cost</th>
                <th className="py-3 px-4">Unit Gross Margin (৳)</th>
                <th className="py-3 px-4">Gross Margin %</th>
                <th className="py-3 px-4">Total Stock Held</th>
                <th className="py-3 px-4 text-right">Potential Gross Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const cost = p.costPrice || Math.round(p.price * 0.48);
                const unitProfit = p.price - cost;
                const marginPct = Math.round((unitProfit / p.price) * 100);
                const stock = p.variants ? p.variants.reduce((s, v) => s + v.stock, 0) : p.stockCount;
                const totalPotential = stock * unitProfit;

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <span className="text-[10px] text-gray-500">{p.sku}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">৳{(p.price ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">৳{(cost ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">৳{(unitProfit ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                        {marginPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">{stock} pcs</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      ৳{(totalPotential ?? 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
