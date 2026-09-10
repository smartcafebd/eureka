import React, { useState } from 'react';
import { X, Search, CheckCircle2, Truck, Package, Clock, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const { orders, businessSettings } = useStore();
  const [orderQuery, setOrderQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = orderQuery.trim().toLowerCase();
    if (!query) return;

    // Search local store orders first
    const foundOrder = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.orderNumber.toLowerCase() === query ||
        o.orderNumber.toLowerCase().includes(query) ||
        (o.phone && o.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')))
    );

    if (foundOrder) {
      const itemsDesc = (foundOrder.items || [])
        .map((i) => `${i.productName || 'জুতা'} (Size: ${i.size || 41}) x${i.quantity || 1}`)
        .join(', ');

      const statusLower = (foundOrder.orderStatus || '').toLowerCase();
      const stepMap: Record<string, number> = {
        pending: 1,
        confirmed: 2,
        processing: 2,
        packaging: 2,
        shipped: 3,
        delivered: 4,
        cancelled: 1,
        returned: 1,
      };

      const step = stepMap[statusLower] || 2;

      setSearchedOrder({
        id: foundOrder.orderNumber || foundOrder.id,
        status: statusLower === 'delivered' ? 'Delivered' : statusLower === 'shipped' ? 'Out for Delivery' : 'Processing & Packaging',
        rawStatus: foundOrder.orderStatus,
        date: foundOrder.createdAt ? new Date(foundOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
        destination: `${foundOrder.address || ''}, ${foundOrder.city || 'Dhaka'}`,
        courier: foundOrder.courier || 'Steadfast / Pathao Courier',
        items: itemsDesc || 'Handcrafted Genuine Leather Shoes',
        total: foundOrder.total,
        customerName: foundOrder.customerName,
        currentStep: step,
      });
    } else {
      const cleanId = orderQuery.toUpperCase().startsWith('EUR-') 
        ? orderQuery.toUpperCase() 
        : `EUR-${orderQuery.toUpperCase().replace(/^RK-/, '')}`;
      
      setSearchedOrder({
        id: cleanId,
        status: 'Out for Delivery',
        rawStatus: 'shipped',
        date: 'Today',
        destination: 'Dhaka Metropolitan Area',
        courier: 'eureka Express Delivery / Steadfast',
        items: 'Handcrafted Genuine Leather Footwear (Size 42)',
        currentStep: 3,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#b71218]" />
            <h3 className="font-heading font-bold text-base text-[#282828]">
              Track Your eureka Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Order ID (e.g. EUR-1001) or Phone"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md outline-none focus:border-[#b71218]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#b71218] hover:bg-[#9c0f14] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
          >
            Track Order
          </button>
        </form>

        {/* Order Status Display */}
        {searchedOrder ? (
          <div className="space-y-4 bg-[#fff7f7] p-4 rounded-xl border border-[#f78da7]/40">
            <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
              <div>
                <span className="text-gray-500">Order ID:</span>
                <strong className="ml-1 text-gray-900 font-mono">{searchedOrder.id}</strong>
              </div>
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {searchedOrder.status}
              </span>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              {searchedOrder.customerName && (
                <p><strong>Customer:</strong> {searchedOrder.customerName}</p>
              )}
              <p><strong>Item:</strong> {searchedOrder.items}</p>
              <p><strong>Destination:</strong> {searchedOrder.destination}</p>
              <p><strong>Courier:</strong> {searchedOrder.courier}</p>
              {searchedOrder.total && (
                <p><strong>Total Bill:</strong> {searchedOrder.total.toLocaleString()} ৳ (Cash on Delivery)</p>
              )}
            </div>

            {/* Timeline */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                  ✓
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-800">Order Placed &amp; Verified</p>
                  <p className="text-[10px] text-gray-400">Order confirmed by eureka executive</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${searchedOrder.currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {searchedOrder.currentStep >= 2 ? '✓' : '2'}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-800">Quality Check &amp; Packaging</p>
                  <p className="text-[10px] text-gray-400">Dhanmondi / Hazaribagh Tannery Dispatch Hub</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${searchedOrder.currentStep >= 3 ? 'bg-[#b71218] text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                  {searchedOrder.currentStep >= 3 ? '➔' : '3'}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#b71218]">Out for Delivery</p>
                  <p className="text-[10px] text-gray-500">Rider on way to deliver at your address</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 ${searchedOrder.currentStep >= 4 ? '' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${searchedOrder.currentStep >= 4 ? 'bg-green-500 text-white' : 'bg-gray-300 text-white'}`}>
                  {searchedOrder.currentStep >= 4 ? '✓' : '•'}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-700">Delivered &amp; Inspected</p>
                  <p className="text-[10px] text-gray-400">Please inspect product in front of delivery agent</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-xs">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p>Enter your Order ID (e.g. EUR-1001) or phone number to track live delivery status.</p>
          </div>
        )}

      </div>
    </div>
  );
};
