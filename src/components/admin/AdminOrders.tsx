import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, CourierName } from '../../types';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  Clock,
  Printer,
  ChevronRight,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Package,
} from 'lucide-react';

const ORDER_STATUS_TABS: { label: string; status: 'all' | OrderStatus }[] = [
  { label: 'All Orders', status: 'all' },
  { label: 'New', status: 'New' },
  { label: 'Pending', status: 'Pending' },
  { label: 'Confirmed', status: 'Confirmed' },
  { label: 'Processing', status: 'Processing' },
  { label: 'Shipped', status: 'Shipped' },
  { label: 'Delivered', status: 'Delivered' },
  { label: 'Cancelled', status: 'Cancelled' },
  { label: 'Returned', status: 'Returned' },
];

export const AdminOrders: React.FC<{ onOpenInvoice?: (order: Order) => void }> = ({ onOpenInvoice }) => {
  const { orders, updateOrderStatus, currentAdmin, businessSettings } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Change Drawer state
  const [editingStatus, setEditingStatus] = useState<OrderStatus>('Confirmed');
  const [courierProvider, setCourierProvider] = useState<CourierName>('Steadfast');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'all' || o.orderStatus === activeTab;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      (o.city && o.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const openOrderDrawer = (order: Order) => {
    setSelectedOrder(order);
    setEditingStatus(order.orderStatus);
    setCourierProvider(order.courier || 'Steadfast');
    setTrackingNumber(order.trackingNumber || '');
    setAdminNotes(order.adminNotes || '');
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(
      selectedOrder.id,
      editingStatus,
      courierProvider,
      trackingNumber,
      adminNotes,
      currentAdmin.name
    );

    // Update local selected state
    setSelectedOrder({
      ...selectedOrder,
      orderStatus: editingStatus,
      courier: courierProvider,
      trackingNumber,
      adminNotes,
    });
  };

  const printInvoiceDirect = (order: Order) => {
    if (onOpenInvoice) {
      onOpenInvoice(order);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-600" /> Order Fulfillment Pipeline
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time status changes automatically trigger stock adjustments and ledger accounting updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-stone-100 rounded-lg text-stone-800">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 gap-1 pb-1 text-xs font-semibold scrollbar-none">
        {ORDER_STATUS_TABS.map((tab) => {
          const count =
            tab.status === 'all'
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab.status).length;

          return (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={`px-3 py-2 rounded-t-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.status
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.status ? 'bg-amber-800 text-amber-100' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. SL-260904-01), customer name, phone number, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items & Variants</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Courier & Tracking</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-gray-900 block">{order.orderNumber}</span>
                    <span className="text-[10px] text-gray-500">{order.createdAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900 block">{order.customerName}</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" /> {order.phone}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate max-w-[150px] block">
                      {order.city}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {order.items.map((it, i) => (
                        <div key={i} className="text-[11px]">
                          <span className="font-medium text-gray-900">{it.productName}</span>{' '}
                          <span className="text-gray-500">
                            ({it.color} / Sz {it.size}) × {it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">৳{order.total.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500">
                      Del: ৳{order.deliveryCharge} | Sub: ৳{order.subtotal}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="block font-medium text-gray-800">{order.paymentMethod}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      ● {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.courier ? (
                      <div>
                        <span className="font-semibold text-gray-900 block">{order.courier}</span>
                        <span className="text-[10px] font-mono text-gray-500">
                          {order.trackingNumber || 'No tracking ID'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-[11px]">Not assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-indigo-100 text-indigo-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : order.orderStatus === 'Returned'
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openOrderDrawer(order)}
                        className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER MANAGEMENT DRAWER / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-400" /> Order Details: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-300">Placed on {selectedOrder.createdAt}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              {/* Customer & Address Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1">
                    Customer Info
                  </h4>
                  <p className="font-semibold text-gray-800">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-gray-400" /> {selectedOrder.phone}
                  </p>
                  {selectedOrder.email && <p className="text-gray-500">{selectedOrder.email}</p>}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Delivery Address
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedOrder.address}</p>
                  <p className="text-gray-900 font-semibold mt-1">{selectedOrder.city}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Ordered Footwear</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {it.image && (
                          <img src={it.image} alt={it.productName} className="w-10 h-10 object-cover rounded-lg border" />
                        )}
                        <div>
                          <span className="font-semibold text-gray-900 block">{it.productName}</span>
                          <span className="text-[11px] text-gray-500">
                            Color: {it.color} | Size: {it.size} | Qty: {it.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">৳{it.totalPrice.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="p-3 bg-stone-50 space-y-1 text-right">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee:</span>
                      <span>৳{selectedOrder.deliveryCharge.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-stone-200">
                      <span>Total Payable:</span>
                      <span className="text-amber-700">৳{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Status Form */}
              <form onSubmit={handleStatusUpdate} className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-gray-900 text-xs">Update Fulfillment & Courier Dispatch</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Order Status</label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold"
                    >
                      <option value="New">New</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled (Restores Stock)</option>
                      <option value="Returned">Returned (Restores Stock)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Courier Partner</label>
                    <select
                      value={courierProvider}
                      onChange={(e) => setCourierProvider(e.target.value as CourierName)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    >
                      <option value="Steadfast">Steadfast Courier</option>
                      <option value="Pathao Courier">Pathao Courier</option>
                      <option value="RedX">RedX Logistics</option>
                      <option value="Paperfly">Paperfly</option>
                      <option value="eCourier">eCourier</option>
                      <option value="In-House Rider">In-House Rider</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Tracking ID / Consignment</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. SF-982410"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Internal Admin Note</label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Called customer for size re-confirmation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => printInvoiceDirect(selectedOrder)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Official Invoice
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow"
                  >
                    Save & Sync Everything
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
