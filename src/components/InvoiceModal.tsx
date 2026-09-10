import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Phone, MapPin, Download } from 'lucide-react';
import { EurekaLogo } from './EurekaLogo';

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea: 'dhaka' | 'outside';
  deliveryFee: number;
  paymentMethod: string;
  items: Array<{
    name: string;
    size: number;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  invoice: InvoiceData | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, invoice, onClose }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:m-0 print:static">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity print:hidden"
      />

      {/* Modal / Printable Invoice Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 z-10 print:shadow-none print:max-w-none print:w-full print:p-8 print:max-h-none print:static">
        
        {/* Action Header Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Order Confirmed
            </span>
            <span className="text-xs text-gray-500 font-mono">#{invoice.orderId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#282828] hover:bg-[#b71218] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div id="printable-invoice" className="text-gray-800 space-y-6">
          
          {/* Brand & Invoice Meta Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <EurekaLogo size="lg" variant="red" />
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Handcrafted Genuine Leather Shoes &amp; Footwear
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#e30613]" /> Showroom: Sector 3, Uttara &amp; Lalmatia, Dhaka
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-[#e30613]" /> Hotline: +880 1711-234567
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block px-2.5 py-1 bg-red-50 text-[#e30613] font-mono font-black text-sm rounded border border-red-200">
                INVOICE #{invoice.orderId}
              </span>
              <p className="text-xs text-gray-500">
                <strong>Date:</strong> {invoice.orderDate}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Payment:</strong> <span className="font-semibold text-gray-800">{invoice.paymentMethod}</span>
              </p>
              <p className="text-xs text-gray-500">
                <strong>Status:</strong> <span className="text-green-700 font-bold">Processing</span>
              </p>
            </div>
          </div>

          {/* Customer Delivery Details Box */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Deliver To (গ্রাহকের তথ্য)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Customer Name:</p>
                <p className="font-bold text-gray-900 text-sm">{invoice.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number:</p>
                <p className="font-bold text-gray-900 font-mono text-sm">{invoice.customerPhone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Delivery Address:</p>
                <p className="font-medium text-gray-800">{invoice.customerAddress}</p>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                <span><strong>Area:</strong> {invoice.deliveryArea === 'dhaka' ? 'Inside Dhaka (৳80)' : 'Outside Dhaka (৳135)'}</span>
                <span>•</span>
                <span><strong>Delivery Type:</strong> 100% Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-100 text-gray-700">
                  <th className="py-2.5 px-3 font-bold">Item Description</th>
                  <th className="py-2.5 px-2 font-bold text-center">Size</th>
                  <th className="py-2.5 px-2 font-bold text-center">Color</th>
                  <th className="py-2.5 px-2 font-bold text-center">Qty</th>
                  <th className="py-2.5 px-3 font-bold text-right">Price</th>
                  <th className="py-2.5 px-3 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-10 object-cover rounded border border-gray-200 shrink-0 print:hidden"
                          />
                        )}
                        <span className="font-semibold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-gray-700">
                      {item.size || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-600">{item.color || 'Standard'}</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-800">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-gray-700">
                      {item.price.toLocaleString()} ৳
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString()} ৳
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (সাবটোটাল):</span>
                <span className="font-mono font-semibold">{invoice.subtotal.toLocaleString()} ৳</span>
              </div>

              {invoice.discount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Discount (ডিসকাউন্ট):</span>
                  <span className="font-mono">- {invoice.discount.toLocaleString()} ৳</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>
                  Delivery Charge ({invoice.deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):
                </span>
                <span className="font-mono font-semibold">{invoice.deliveryFee} ৳</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#e30613] pt-2 border-t-2 border-gray-300">
                <span>Grand Total (সর্বমোট বিল):</span>
                <span className="font-mono text-lg">{invoice.total.toLocaleString()} ৳</span>
              </div>

              <p className="text-[11px] text-gray-500 text-right italic pt-1">
                * Amount payable in cash upon receiving parcel (ক্যাশ অন ডেলিভারি)
              </p>
            </div>
          </div>

          {/* Genuine Leather & Delivery Note */}
          <div className="p-3.5 bg-[#fff7f7] border border-[#f78da7]/40 rounded-xl flex items-start gap-3 text-xs text-gray-700">
            <ShieldCheck className="w-5 h-5 text-[#00d084] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">
                ১০০% জেনুইন লেদার ও প্রিমিয়াম কোয়ালিটি অ্যাসিওরেন্স
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                ডেলিভারি ম্যানের সামনে পণ্য চেক করে বুঝে নিন। যেকোনো সহযোগিতায় আমাদের হেল্পলাইনে যোগাযোগ করুন (#{invoice.orderId})।
              </p>
            </div>
          </div>

          {/* Footer Signoff */}
          <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-200">
            <p>Thank you for choosing <strong>eureka®</strong> – Handcrafted with pride.</p>
            <p className="text-[10px] mt-0.5">Support WhatsApp / Hotline: +880 1711-234567 | www.eureka.bd</p>
          </div>

        </div>

      </div>
    </div>
  );
};
