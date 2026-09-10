import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { InventoryAction } from '../../types';
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  History as HistoryIcon,
  Search,
  Filter,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  RotateCcw,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const {
    products,
    inventoryAuditLogs,
    adjustStock,
    clearInventoryAuditLogs,
    deleteInventoryAuditLog,
    clearAllLiveStock,
    currentAdmin,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'stock' | 'audit'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlert, setFilterAlert] = useState<'all' | 'low' | 'out'>('all');

  // Audit Tab Filter State
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('all');

  // Quick Adjustment Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedVariantSku, setSelectedVariantSku] = useState('');
  const [actionType, setActionType] = useState<InventoryAction>('Stock In');
  const [changeQty, setChangeQty] = useState(10);
  const [reason, setReason] = useState('Fresh production batch from workshop');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Flattened inventory variant list for stock view
  const variantInventoryList: {
    productId: string;
    productName: string;
    variantId: string;
    sku: string;
    color: string;
    size: number;
    stock: number;
    lowAlert: number;
    unitCost: number;
    unitPrice: number;
  }[] = [];

  products.forEach((p) => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v) => {
        variantInventoryList.push({
          productId: p.id,
          productName: p.name,
          variantId: v.id,
          sku: v.sku,
          color: v.color,
          size: v.size,
          stock: v.stock,
          lowAlert: p.lowStockAlert || 5,
          unitCost: v.purchaseCost || p.costPrice || 1100,
          unitPrice: v.sellingPrice || p.price,
        });
      });
    } else if (p.stockCount > 0) {
      variantInventoryList.push({
        productId: p.id,
        productName: p.name,
        variantId: p.id,
        sku: p.sku,
        color: 'Main Stock',
        size: p.sizes?.[0] || 41,
        stock: p.stockCount,
        lowAlert: p.lowStockAlert || 5,
        unitCost: p.costPrice || 1100,
        unitPrice: p.price,
      });
    }
  });

  const filteredVariants = variantInventoryList.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAlert =
      filterAlert === 'all'
        ? true
        : filterAlert === 'out'
        ? item.stock === 0
        : item.stock <= item.lowAlert && item.stock > 0;

    return matchesSearch && matchesAlert;
  });

  const handleCleanLiveStock = () => {
    if (variantInventoryList.length === 0) {
      alert('লাইভ স্টক ইতোমধ্যে সম্পূর্ণ ক্লিন রয়েছে!');
      return;
    }
    if (
      window.confirm(
        'আপনি কি সমস্ত লাইভ স্টক ক্লিন (Clean All Live Stock) করতে চান? এটি ডামি ভ্যারিয়েন্ট ও সমস্ত স্টক শূন্য (0) করে ফ্রেশ শুরু করবে।'
      )
    ) {
      clearAllLiveStock('clear_all_variants');
    }
  };

  const handleZeroAllStock = () => {
    if (variantInventoryList.length === 0) {
      alert('কোনো লাইভ স্টক আইটেম নেই।');
      return;
    }
    if (window.confirm('আপনি কি সমস্ত লাইভ ভ্যারিয়েন্টের স্টক সংখ্যা শূন্য (0) করতে চান?')) {
      clearAllLiveStock('zero_stock');
    }
  };

  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    const targetSku = selectedVariantSku || selectedProduct?.sku || '';

    const finalQty =
      actionType === 'Stock Out' || actionType === 'Damaged Stock'
        ? -Math.abs(changeQty)
        : Math.abs(changeQty);

    adjustStock(selectedProductId, targetSku, finalQty, actionType, reason, currentAdmin.name);
    setIsAdjustModalOpen(false);
  };

  const openQuickAdjust = (prodId: string, sku: string, suggestedAction: InventoryAction = 'Stock In') => {
    setSelectedProductId(prodId);
    setSelectedVariantSku(sku);
    setActionType(suggestedAction);
    setChangeQty(suggestedAction === 'Stock In' ? 10 : -2);
    setReason(
      suggestedAction === 'Stock In'
        ? 'Restocking inventory from leather factory'
        : suggestedAction === 'Damaged Stock'
        ? 'Defect found during packaging inspection'
        : 'Physical count discrepancy reconciliation'
    );
    setIsAdjustModalOpen(true);
  };

  const handleClearAllMovements = () => {
    if (inventoryAuditLogs.length === 0) {
      alert('বর্তমানে কোনো মুভমেন্ট হিস্ট্রি নেই।');
      return;
    }
    if (
      window.confirm(
        'আপনি কি নিশ্চিত যে সমস্ত স্টক মুভমেন্ট হিস্ট্রি পুরোপুরি মুছে ফেলতে (Clean) চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।'
      )
    ) {
      clearInventoryAuditLogs();
    }
  };

  const handleDeleteLogEntry = (id: string, prodName: string, action: string) => {
    if (window.confirm(`আপনি কি "${prodName}" এর এই ${action} রেকর্ডটি মুছে ফেলতে চান?`)) {
      deleteInventoryAuditLog(id);
    }
  };

  // Filtered audit logs
  const filteredAuditLogs = inventoryAuditLogs.filter((log) => {
    const matchesSearch =
      auditSearchQuery.trim() === '' ||
      log.productName.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.variantSku.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
      (log.adminName && log.adminName.toLowerCase().includes(auditSearchQuery.toLowerCase()));

    const matchesAction = auditActionFilter === 'all' || log.action === auditActionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" /> Inventory & Stock Movements
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit-backed inventory tracking with SKU-level granularity and automatic order decrementing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {variantInventoryList.length > 0 && (
            <button
              onClick={handleCleanLiveStock}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
              title="সমস্ত লাইভ স্টক ক্লিন করুন"
            >
              <Trash2 className="w-4 h-4 text-rose-600" /> Clean Live Stock
            </button>
          )}
          {inventoryAuditLogs.length > 0 && (
            <button
              onClick={handleClearAllMovements}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
              title="সমস্ত স্টক মুভমেন্ট হিস্ট্রি ক্লিন করুন"
            >
              <Trash2 className="w-4 h-4 text-stone-500" /> Clean Movements
            </button>
          )}
          <button
            onClick={() => {
              if (selectedProduct && selectedProduct.variants && selectedProduct.variants[0]) {
                setSelectedVariantSku(selectedProduct.variants[0].sku);
              } else if (selectedProduct) {
                setSelectedVariantSku(selectedProduct.sku);
              }
              setIsAdjustModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Record Stock Movement
          </button>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'stock'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" /> Live Stock Levels ({filteredVariants.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <HistoryIcon className="w-4 h-4" /> Audit Trail & Movement History ({inventoryAuditLogs.length})
        </button>
      </div>

      {/* LIVE STOCK TAB */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          {/* Filters & Bulk Actions */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search variant SKU, shoe name, color..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <select
                value={filterAlert}
                onChange={(e) => setFilterAlert(e.target.value as any)}
                className="w-full sm:w-auto py-2 px-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-gray-700"
              >
                <option value="all">All Stock Statuses</option>
                <option value="low">Low Stock (≤ 5 units)</option>
                <option value="out">Out of Stock (0 units)</option>
              </select>
            </div>

            {variantInventoryList.length > 0 && (
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleZeroAllStock}
                  className="flex items-center gap-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-semibold text-xs transition cursor-pointer shrink-0"
                  title="সমস্ত ভ্যারিয়েন্টের স্টক ০ করুন"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Set All to 0
                </button>
                <button
                  type="button"
                  onClick={handleCleanLiveStock}
                  className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs transition cursor-pointer shrink-0"
                  title="সমস্ত লাইভ স্টক ক্লিন করুন"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Clean All Stock
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Variant SKU</th>
                    <th className="py-3 px-4">Shoe Model</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Unit Cost</th>
                    <th className="py-3 px-4">Stock Value</th>
                    <th className="py-3 px-4 text-right">Quick Stock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variantInventoryList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2.5 max-w-md mx-auto">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-gray-900 text-sm">লাইভ স্টক সম্পূর্ণ ক্লিন (Cleaned)</p>
                          <p className="text-xs text-gray-500 text-center">
                            বর্তমানে কোনো ডামি ভ্যারিয়েন্ট বা লাইভ স্টক রেকর্ড নেই। আপনি এখন নতুন স্টক যোগ করতে '+ Record Stock Movement' এ ক্লিক করুন অথবা প্রোডাক্টস ট্যাব থেকে ভ্যারিয়েন্ট যোগ করুন।
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedProduct && selectedProduct.variants && selectedProduct.variants[0]) {
                                setSelectedVariantSku(selectedProduct.variants[0].sku);
                              } else if (selectedProduct) {
                                setSelectedVariantSku(selectedProduct.sku);
                              }
                              setIsAdjustModalOpen(true);
                            }}
                            className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition cursor-pointer shadow-xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Record First Stock Movement
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredVariants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-500 text-xs font-medium">
                        সার্চ বা ফিল্টারের সাথে মিলে এমন কোনো লাইভ স্টক আইটেম পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredVariants.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="py-2.5 px-4 font-mono font-medium text-gray-800">{item.sku}</td>
                        <td className="py-2.5 px-4 font-semibold text-gray-900">{item.productName}</td>
                        <td className="py-2.5 px-4">{item.color}</td>
                        <td className="py-2.5 px-4 font-bold text-gray-800">{item.size}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              item.stock === 0
                                ? 'bg-rose-100 text-rose-800'
                                : item.stock <= item.lowAlert
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.stock} pcs
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-600">৳{item.unitCost.toLocaleString()}</td>
                        <td className="py-2.5 px-4 font-semibold text-gray-900">
                          ৳{(item.stock * item.unitCost).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openQuickAdjust(item.productId, item.sku, 'Stock In')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold transition cursor-pointer"
                            >
                              + Stock In
                            </button>
                            <button
                              onClick={() => openQuickAdjust(item.productId, item.sku, 'Damaged Stock')}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-semibold transition cursor-pointer"
                            >
                              - Damaged
                            </button>
                            <button
                              onClick={() => openQuickAdjust(item.productId, item.sku, 'Adjust Stock')}
                              className="px-2 py-1 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded text-[10px] font-semibold transition cursor-pointer"
                            >
                              Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Audit Controls & Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SKU, product, reason, admin..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-gray-700"
              >
                <option value="all">All Movement Actions</option>
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
                <option value="Order Sale">Order Sale</option>
                <option value="Damaged Stock">Damaged Stock</option>
                <option value="Adjust Stock">Adjust Stock</option>
                <option value="Purchase Stock">Purchase Stock</option>
                <option value="Returned Stock">Returned Stock</option>
              </select>

              {inventoryAuditLogs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllMovements}
                  className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs transition cursor-pointer shrink-0"
                  title="সমস্ত স্টক মুভমেন্ট হিস্ট্রি মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clean All History
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-stone-50">
              <div>
                <h4 className="font-bold text-gray-900 text-xs">Inventory Audit Trail & Movements</h4>
                <p className="text-[11px] text-gray-500">Every change records old stock, change delta, new stock, reason and authorized officer.</p>
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {filteredAuditLogs.length} of {inventoryAuditLogs.length} events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Product & Variant</th>
                    <th className="py-3 px-4">Movement Action</th>
                    <th className="py-3 px-4">Stock Change</th>
                    <th className="py-3 px-4">Balance Stock</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">Authorized Admin</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventoryAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <p className="font-semibold text-gray-800 text-sm">স্টক মুভমেন্ট হিস্ট্রি সম্পূর্ণ ক্লিন (Cleaned)</p>
                          <p className="text-xs text-gray-500 max-w-sm">
                            বর্তমানে কোনো স্টক মুভমেন্ট রেকর্ড নেই। নতুন স্টক অ্যাড বা ইনভেন্টরি মুভমেন্ট রেকর্ড করলে এখানে দেখতে পাবেন।
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-500 text-xs font-medium">
                        সার্চ বা ফিল্টারের সাথে মিলে এমন কোনো স্টক মুভমেন্ট লগ পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="py-2.5 px-4 text-gray-500 whitespace-nowrap">{log.date}</td>
                        <td className="py-2.5 px-4">
                          <div className="font-semibold text-gray-900">{log.productName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">
                            {log.variantSku} {log.size ? `(Size ${log.size})` : ''}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              log.action === 'Stock In' || log.action === 'Purchase Stock' || log.action === 'Returned Stock'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.action === 'Order Sale'
                                ? 'bg-blue-100 text-blue-800'
                                : log.action === 'Damaged Stock'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold">
                          <span className={log.change > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {log.change > 0 ? `+${log.change}` : log.change} pcs
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-900">
                          <span className="text-gray-400">{log.previousStock} &rarr; </span>
                          <span className="font-bold">{log.newStock} pcs</span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-700 max-w-xs">{log.reason}</td>
                        <td className="py-2.5 px-4 font-medium text-gray-900">{log.adminName}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteLogEntry(log.id, log.productName, log.action)}
                            title="এই মুভমেন্ট লগটি মুছে ফেলুন"
                            className="inline-flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded text-xs border border-rose-200 hover:border-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছুন</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY ADJUSTMENT MODAL */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" /> Record Stock Movement
              </h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Select Footwear Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod?.variants?.[0]) setSelectedVariantSku(prod.variants[0].sku);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Select Variant (Size & Color)</label>
                <select
                  value={selectedVariantSku}
                  onChange={(e) => setSelectedVariantSku(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                >
                  {selectedProduct?.variants?.map((v) => (
                    <option key={v.id} value={v.sku}>
                      {v.sku} - {v.color} (Size {v.size}) [Current: {v.stock} pcs]
                    </option>
                  )) || <option value={selectedProduct?.sku}>{selectedProduct?.sku} - Default</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Action Type</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Stock In">Stock In (+)</option>
                    <option value="Purchase Stock">Purchase Stock (+)</option>
                    <option value="Returned Stock">Returned Stock (+)</option>
                    <option value="Stock Out">Stock Out (-)</option>
                    <option value="Damaged Stock">Damaged Stock (-)</option>
                    <option value="Adjust Stock">Adjust Stock (+/-)</option>
                    <option value="Transfer Stock">Transfer Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Quantity (Pcs)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={changeQty}
                    onChange={(e) => setChangeQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Reason / Factory Voucher No.</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Batch #458 received from Hazaribagh unit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow"
                >
                  Confirm & Write Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
