import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types';
import {
  Users,
  Search,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Star,
  Award,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const AdminCRM: React.FC = () => {
  const { customers, orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState<'all' | 'VIP' | 'Regular' | 'New' | 'Inactive'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSegment = filterSegment === 'all' || c.segment === filterSegment;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSegment && matchesSearch;
  });

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.phone === selectedCustomer.phone || o.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" /> Customer Relationship Management (CRM)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Customer lifetime value, repurchase behavior, delivery history, and VIP tiering.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 bg-stone-100 rounded-lg text-stone-800">
            Total Footwear Buyers: {customers.length}
          </span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name, mobile number, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value as any)}
          className="py-2 px-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value="all">All Buyer Segments</option>
          <option value="VIP">VIP (≥ ৳10,000 spend or 3+ orders)</option>
          <option value="Regular">Regular Repeat Buyers</option>
          <option value="New">New First-Time Buyers</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Location / City</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend (LTV)</th>
                <th className="py-3 px-4">Last Order Date</th>
                <th className="py-3 px-4">Segment Tier</th>
                <th className="py-3 px-4 text-right">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">{cust.name}</span>
                    <span className="text-[10px] text-gray-400">{cust.email || 'No email provided'}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-gray-700">{cust.phone}</td>
                  <td className="py-3 px-4 text-gray-700">
                    <div>{cust.city}</div>
                    <span className="text-[10px] text-gray-400 truncate max-w-xs block">{cust.address}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{cust.totalOrders} orders</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">৳{cust.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-500">{cust.lastOrderDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.segment === 'VIP'
                          ? 'bg-amber-100 text-amber-800'
                          : cust.segment === 'Regular'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {cust.segment === 'VIP' && <Award className="w-3 h-3 text-amber-600" />}
                      {cust.segment}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[11px] font-semibold flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE DRAWER / MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" /> {selectedCustomer.name}
                </h3>
                <p className="text-xs text-stone-300">Customer ID: {selectedCustomer.id}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border">
                  <span className="text-[10px] text-gray-500 block">Total Spend (LTV)</span>
                  <span className="font-bold text-base text-emerald-700">
                    ৳{selectedCustomer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border">
                  <span className="text-[10px] text-gray-500 block">Total Orders</span>
                  <span className="font-bold text-base text-gray-900">{selectedCustomer.totalOrders}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border">
                  <span className="text-[10px] text-gray-500 block">Customer Tier</span>
                  <span className="font-bold text-base text-amber-700">{selectedCustomer.segment}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border">
                  <span className="text-[10px] text-gray-500 block">City</span>
                  <span className="font-bold text-base text-gray-900">{selectedCustomer.city}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Delivery Details & Contact</h4>
                <div className="p-4 bg-stone-50 rounded-xl border space-y-1">
                  <p className="font-semibold text-gray-900">{selectedCustomer.phone}</p>
                  <p className="text-gray-700">{selectedCustomer.address}</p>
                  {selectedCustomer.notes && (
                    <p className="text-amber-800 text-[11px] pt-2 border-t mt-2">
                      <strong>Admin Notes:</strong> {selectedCustomer.notes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Order History ({customerOrders.length})</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {customerOrders.length > 0 ? (
                    customerOrders.map((o) => (
                      <div key={o.id} className="p-3 flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-gray-900 block">{o.orderNumber}</span>
                          <span className="text-[10px] text-gray-500">{o.createdAt}</span>
                          <div className="text-[11px] text-gray-600 mt-1">
                            {o.items.map((it) => `${it.productName} (${it.color}/Sz ${it.size}) × ${it.quantity}`).join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900 block">৳{o.total.toLocaleString()}</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold">
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No previous orders found for this contact.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
