import React from 'react';
import { Order, BusinessSettings } from '../../types';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  order: Order;
  settings: BusinessSettings;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<Props> = ({ order, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none animate-in fade-in zoom-in-95 my-auto">
        {/* Actions bar (hidden in print) */}
        <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Invoice #{order.orderNumber}</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-semibold">
              Official Tax Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print Invoice
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-stone-800 rounded-lg text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 space-y-6 text-gray-800 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-6 border-stone-200">
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">{settings.storeName}</h1>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">{settings.tagline}</p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">{settings.address}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Hotline: {settings.phone} | WhatsApp: {settings.whatsappNumber}
              </p>
            </div>

            <div className="text-right">
              <div className="text-lg font-black text-stone-900">INVOICE</div>
              <p className="font-mono font-bold text-stone-800 text-xs mt-0.5">{order.orderNumber}</p>
              <p className="text-gray-500 text-[11px] mt-1">Date: {order.createdAt}</p>
              <div className="mt-2 inline-block px-2.5 py-1 bg-stone-100 rounded text-[10px] font-bold text-stone-800">
                Payment: {order.paymentMethod} ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Bill & Ship To:
              </span>
              <p className="font-bold text-sm text-stone-900">{order.customerName}</p>
              <p className="text-gray-700 font-medium mt-0.5">{order.phone}</p>
              <p className="text-gray-600 mt-1 leading-relaxed">{order.address}</p>
              <p className="font-semibold text-stone-800 mt-0.5">{order.city}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Logistics & Dispatch:
              </span>
              <p className="font-semibold text-stone-900">Courier: {order.courier || 'Steadfast Courier'}</p>
              <p className="text-gray-600 font-mono text-[11px] mt-0.5">
                Tracking: {order.trackingNumber || 'Pending Dispatch'}
              </p>
              <p className="text-emerald-700 font-medium text-[11px] mt-2 flex items-center justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Leather Guarantee
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-100 text-stone-700 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Color</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-bold text-stone-900">{item.productName}</td>
                    <td className="py-3 px-3 text-gray-600">{item.color}</td>
                    <td className="py-3 px-3 font-semibold text-stone-800">{item.size}</td>
                    <td className="py-3 px-3 text-right text-gray-700">৳{(item.unitPrice ?? item.price ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-bold text-stone-900">
                      ৳{item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Footer */}
            <div className="bg-stone-50 border-t border-stone-200 p-4 space-y-1.5 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery & Courier Charge:</span>
                <span className="font-semibold">৳{order.deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>TOTAL PAYABLE:</span>
                <span className="text-amber-800">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Warranty & Exchange Policy Note */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-amber-700" /> Snap Leather Customer Care & Return Policy:
            </p>
            <p className="text-stone-600 leading-relaxed">
              If you encounter any sizing fit issues, you are entitled to a free size exchange within{' '}
              {settings.returnWindowDays} days. Footwear must remain unworn on outdoor surfaces and in its original box.
              For assistance, call {settings.phone}.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end text-[10px] text-gray-500">
            <div>
              <div className="w-36 border-b border-gray-400 mb-1"></div>
              <span>Customer Signature</span>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-gray-400 mb-1 ml-auto"></div>
              <span>Authorized Signature ({settings.storeName})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
