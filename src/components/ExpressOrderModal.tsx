import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Sparkles,
  Phone,
  MapPin,
  User,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, CartItem } from '../types';
import { EurekaLogo } from './EurekaLogo';
import { InvoiceData } from './InvoiceModal';
import { useStore } from '../context/StoreContext';
import { getSafeProductImageUrl, handleImageError } from '../utils/imageUtils';

export interface ExpressOrderPayload {
  product?: Product;
  selectedSize?: number;
  selectedColor?: string;
  quantity?: number;
  cartItems?: CartItem[];
}

interface ExpressOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (invoice: InvoiceData) => void;
  // Flexible props so it works directly from App.tsx or subcomponents
  orderData?: ExpressOrderPayload | null;
  product?: Product | null;
  cartItems?: CartItem[];
  initialSize?: number;
  onClearCart?: () => void;
  onOpenSizeGuide?: () => void;
}

export const ExpressOrderModal: React.FC<ExpressOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  orderData,
  product,
  cartItems,
  initialSize,
  onClearCart,
  onOpenSizeGuide,
}) => {
  const { createOrder } = useStore();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [orderNotes, setOrderNotes] = useState('');

  // Effective product / cart items resolution
  const activeProduct = orderData?.product || product || null;
  const activeCartItems = orderData?.cartItems || cartItems || [];

  const availableColors = (activeProduct?.colors || []).filter(
    (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
  );

  // Item overrides for single product
  const [selectedSize, setSelectedSize] = useState<number>(() => {
    return orderData?.selectedSize || initialSize || activeProduct?.sizes[0] || 41;
  });
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    const raw = orderData?.selectedColor;
    if (raw && raw !== 'ব্রাউন' && raw.toLowerCase() !== 'brown') return raw;
    const valid = (activeProduct?.colors || []).filter(
      (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
    );
    return valid[0]?.name || 'Standard';
  });
  const [quantity, setQuantity] = useState<number>(orderData?.quantity || 1);

  // Order Completion State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<InvoiceData | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize selected values whenever product or orderData changes
  useEffect(() => {
    if (activeProduct) {
      const valid = (activeProduct.colors || []).filter(
        (c) => c && c.name !== 'ব্রাউন' && c.name.toLowerCase() !== 'brown'
      );
      setSelectedSize(orderData?.selectedSize || initialSize || activeProduct.sizes[0] || 41);
      const chosenColor = orderData?.selectedColor;
      if (chosenColor && chosenColor !== 'ব্রাউন' && chosenColor.toLowerCase() !== 'brown') {
        setSelectedColor(chosenColor);
      } else {
        setSelectedColor(valid[0]?.name || 'Standard');
      }
      setQuantity(orderData?.quantity || 1);
    }
  }, [activeProduct, orderData, initialSize]);

  // Reset form when reopened
  useEffect(() => {
    if (isOpen) {
      setCompletedOrder(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine items list
  const isDirectProduct = Boolean(activeProduct);
  const items = isDirectProduct && activeProduct
    ? [
        {
          product: activeProduct,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
          quantity: quantity,
        },
      ]
    : activeCartItems;

  // Calculations: Inside Dhaka ৳80, Outside Dhaka ৳135
  const totalOriginalPrice = items.reduce(
    (sum, it) => sum + (it.product.originalPrice || it.product.price) * it.quantity,
    0
  );
  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const totalSavings = Math.max(0, totalOriginalPrice - subtotal);
  const discountPercentCalculated = totalOriginalPrice > 0 
    ? Math.round((totalSavings / totalOriginalPrice) * 100) 
    : 0;
  const deliveryFee = deliveryArea === 'dhaka' ? 80 : 135;
  const grandTotal = Math.max(0, subtotal + deliveryFee);

  // Generate Reference ID: e.g. RSL-89241 or ERK-89241
  const generateOrderId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `RSL-${randomNum}`;
  };

  // Trigger Confetti
  const triggerConfettiCelebration = () => {
    try {
      // First burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e30613', '#fcb900', '#00d084', '#282828', '#ffffff'],
      });

      // Side fireworks
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#e30613', '#fcb900', '#00d084'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#e30613', '#fcb900', '#00d084'],
        });
      }, 250);
    } catch {
      // Fallback gracefully if canvas unavailable
    }
  };

  // Place 1-Click Order Handler
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('দয়া করে আপনার নাম লিখুন (Please enter your name)');
      return;
    }

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 11) {
      alert('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (Please enter a valid 11-digit Bangladeshi phone number e.g. 017XXXXXXXX)');
      return;
    }

    if (!customerAddress.trim()) {
      alert('আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (Please enter complete delivery address)');
      return;
    }

    setIsSubmitting(true);

    const newOrderId = generateOrderId();
    const invoicePayload: InvoiceData = {
      orderId: newOrderId,
      orderDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      deliveryArea,
      deliveryFee,
      paymentMethod: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
      items: items.map((it) => ({
        name: it.product.name,
        size: it.selectedSize,
        color: it.selectedColor,
        quantity: it.quantity,
        price: it.product.price,
        image: it.product.images[0],
      })),
      subtotal,
      discount: totalSavings,
      total: grandTotal,
      notes: orderNotes.trim() || undefined,
    };

    try {
      createOrder({
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim(),
        city: deliveryArea === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
        items: items.map((it) => {
          const v = it.product.variants?.find(
            (varItem) => varItem.color === it.selectedColor && varItem.size === it.selectedSize
          );
          return {
            productId: it.product.id,
            variantId: v?.id,
            sku: v?.sku || `${it.product.sku}-${it.selectedSize}`,
            productName: it.product.name,
            color: it.selectedColor,
            size: it.selectedSize,
            quantity: it.quantity,
            unitPrice: it.product.price,
            price: it.product.price,
            totalPrice: it.product.price * it.quantity,
            image: it.product.images[0],
          };
        }),
        subtotal,
        discount: totalSavings,
        deliveryCharge: deliveryFee,
        total: grandTotal,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'New',
        adminNotes: orderNotes.trim() || undefined,
      });
    } catch (e) {
      console.error('Error creating order in StoreContext', e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCompletedOrder(invoicePayload);
      triggerConfettiCelebration();

      if (onClearCart && !isDirectProduct) {
        onClearCart();
      }
    }, 600);
  };

  // Copy Order ID
  const handleCopyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.orderId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Build WhatsApp Confirmation URL
  const getWhatsAppUrl = () => {
    if (!completedOrder) return '';
    const text = encodeURIComponent(
      `Hello eureka! I placed an Express Cash on Delivery Order #${completedOrder.orderId}.\n\n` +
      `👤 Name: ${completedOrder.customerName}\n` +
      `📞 Phone: ${completedOrder.customerPhone}\n` +
      `📍 Address: ${completedOrder.customerAddress} (${completedOrder.deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})\n` +
      `👟 Item: ${completedOrder.items.map(i => `${i.name} (Size ${i.size}, ${i.color}) x${i.quantity}`).join(', ')}\n` +
      `💰 Total: ${completedOrder.total} ৳ (Cash on Delivery)\n\n` +
      `Please confirm my shipment!`
    );
    return `https://wa.me/8801711234567?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#282828] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-20 border-b border-[#383838]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e30613] text-white flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg text-white uppercase tracking-tight">
                  Express 1-Click Order
                </h3>
                <span className="bg-[#e30613] text-[10px] font-bold px-2 py-0.5 rounded-full text-white animate-pulse">
                  অর্ডার করুন
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                সরাসরি ক্যাশ অন ডেলিভারিতে অর্ডার করতে নিচের তথ্যগুলো পূরণ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          
          {completedOrder ? (
            /* ================= Success / Order Confirmed View ================= */
            <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
              
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-green-50 text-green-800 text-xs font-extrabold rounded-full border border-green-200 mb-2">
                  🎉 অভিনন্দন! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-[#282828]">
                  Order Placed Successfully!
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-1">
                  আমাদের কাস্টমার প্রতিনিধি শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন।
                </p>
              </div>

              {/* Order Reference Badge with Copy */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-md mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[11px] text-gray-500 font-medium">Order Reference ID</span>
                  <p className="font-mono font-black text-lg text-[#e30613] tracking-wide">
                    {completedOrder.orderId}
                  </p>
                </div>

                <button
                  onClick={handleCopyOrderId}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Order Details Brief */}
              <div className="text-left text-xs bg-[#fff7f7] p-4 rounded-xl border border-[#f78da7]/40 max-w-md mx-auto space-y-2">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-bold text-gray-900">{completedOrder.customerName} ({completedOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium text-gray-800 text-right max-w-[200px] truncate">{completedOrder.customerAddress}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Total Payable:</span>
                  <span className="font-bold font-mono text-base text-[#e30613]">{completedOrder.total.toLocaleString()} ৳</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-600 pt-1">
                  <span>Payment Type:</span>
                  <span className="font-bold text-green-700">Cash on Delivery (হাতে পেয়ে টাকা দিন)</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Printable Invoice */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Order Confirmation</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  onClick={() => {
                    onOrderSuccess(completedOrder);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 bg-[#282828] hover:bg-[#1a1a1a] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>View &amp; Print Invoice</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                >
                  Close and Continue Shopping →
                </button>
              </div>

            </div>
          ) : (
            /* ================= 1-Click Form Checkout View ================= */
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              
              {/* Product Details Overview in Checkout */}
              <div className="bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#e30613]" />
                    <span>Selected Items ({items.length})</span>
                  </span>
                  <span className="text-[11px] text-gray-500">100% Genuine Leather</span>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-white p-2.5 rounded-lg border border-gray-200">
                    <img
                      src={getSafeProductImageUrl(item.product.images?.[0], item.product.category)}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-md border border-gray-200 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, item.product.category)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#282828] truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-gray-500">
                        Size: <strong className="text-gray-800">{item.selectedSize}</strong> • Color: {item.selectedColor}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold font-mono text-[#e30613]">
                          {item.product.price.toLocaleString()} ৳
                        </span>
                        <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-bold">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* If single product ordering, allow changing size, color & quantity in modal */}
                {isDirectProduct && activeProduct && (
                  <div className="pt-3 border-t border-gray-200 space-y-3.5 text-xs">
                    {/* Size Selector */}
                    {activeProduct.sizes && activeProduct.sizes.length > 0 && activeProduct.sizes[0] !== 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-800">
                            সাইজ নির্বাচন করুন (Select Shoe Size): <span className="text-[#e30613] font-bold font-mono">{selectedSize}</span>
                          </label>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {activeProduct.sizes.map((sz) => (
                            <button
                              type="button"
                              key={sz}
                              onClick={() => setSelectedSize(sz)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                selectedSize === sz
                                  ? 'bg-[#e30613] text-white border-[#e30613] shadow-xs'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Variation Selection (কি কালার নিতে চাচ্ছেন) */}
                    {availableColors && availableColors.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-800">
                            কি কালার নিতে চাচ্ছেন (Select Color): <span className="text-[#e30613] font-bold">{selectedColor}</span>
                          </label>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {availableColors.map((c) => {
                            const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                            return (
                              <button
                                type="button"
                                key={c.name}
                                onClick={() => setSelectedColor(c.name)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                  isSelected
                                    ? 'bg-[#fff5f5] text-[#e30613] border-[#e30613] shadow-xs ring-1 ring-[#e30613]'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner shrink-0"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span>{c.name}</span>
                                {isSelected && <Check className="w-3 h-3 text-[#e30613]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="text-xs font-bold text-gray-800">
                        পরিমাণ (Quantity):
                      </label>
                      <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white p-0.5 shadow-xs">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-7 text-gray-600 hover:bg-gray-100 rounded font-bold transition-colors cursor-pointer flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-xs text-gray-800 min-w-[28px] text-center font-mono">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-7 text-gray-600 hover:bg-gray-100 rounded font-bold transition-colors cursor-pointer flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Delivery Information Fields */}
              <div className="space-y-3.5 pt-1">
                <div className="bg-[#fff7f7] border border-[#f78da7]/40 p-3 rounded-xl">
                  <h4 className="text-xs sm:text-sm font-bold text-[#e30613] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#e30613]" />
                    <span>ক্যাশ অন ডেলিভারিতে অর্ডার করতে আপনার তথ্য দিন</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধ করুন। অগ্রিম কোনো টাকা দিতে হবে না।
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    আপনার নাম <span className="text-[#e30613] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="আপনার নাম"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    ফোন নাম্বার <span className="text-[#e30613] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="ফোন নাম্বার"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    এড্রেস <span className="text-[#e30613] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <textarea
                      required
                      rows={2}
                      placeholder="এড্রেস"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <input
                    type="text"
                    placeholder="বিশেষ কোনো নোট বা নির্দেশনা (ঐচ্ছিক)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Shipping Method / শিপিং মেথড (Inside Dhaka ৳80, Outside Dhaka ৳135) */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#e30613]" />
                    <span>শিপিং মেথড</span>
                  </span>
                  <span className="text-[11px] text-gray-500 font-normal">সারা বাংলাদেশ হোম ডেলিভারি</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Inside Dhaka */}
                  <label
                    onClick={() => setDeliveryArea('dhaka')}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryArea === 'dhaka'
                        ? 'border-[#e30613] bg-[#fff7f7] text-[#282828] shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryArea"
                        checked={deliveryArea === 'dhaka'}
                        onChange={() => setDeliveryArea('dhaka')}
                        className="text-[#e30613] focus:ring-[#e30613]"
                      />
                      <div>
                        <p className="font-bold text-xs">ঢাকার ভিতরে (Inside Dhaka)</p>
                        <p className="text-[10px] text-gray-500">২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#e30613] bg-red-50 px-2 py-1 rounded border border-red-200">
                      ৳৮০
                    </span>
                  </label>

                  {/* Outside Dhaka */}
                  <label
                    onClick={() => setDeliveryArea('outside')}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryArea === 'outside'
                        ? 'border-[#e30613] bg-[#fff7f7] text-[#282828] shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryArea"
                        checked={deliveryArea === 'outside'}
                        onChange={() => setDeliveryArea('outside')}
                        className="text-[#e30613] focus:ring-[#e30613]"
                      />
                      <div>
                        <p className="font-bold text-xs">ঢাকার বাইরে (Outside Dhaka)</p>
                        <p className="text-[10px] text-gray-500">২-৩ কার্যদিবসের মধ্যে হোম ডেলিভারি</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#e30613] bg-red-50 px-2 py-1 rounded border border-red-200">
                      ৳১৩৫
                    </span>
                  </label>

                </div>
              </div>

              {/* Pricing Summary & Inventory Breakdown */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100/90 p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#e30613]" />
                    <span>অর্ডার সামারি ও মূল্য তালিকা</span>
                  </span>
                  {totalSavings > 0 && (
                    <span className="bg-red-100 text-[#e30613] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#e30613]" />
                      <span>{discountPercentCalculated}% স্পেশাল ডিসকাউন্ট</span>
                    </span>
                  )}
                </div>

                {/* Regular Price */}
                {totalOriginalPrice > subtotal && (
                  <div className="flex justify-between text-gray-500">
                    <span>পণ্যের নিয়মিত মূল্য (Regular Price):</span>
                    <span className="font-mono line-through font-medium">{totalOriginalPrice.toLocaleString()} ৳</span>
                  </div>
                )}

                {/* Discount Received */}
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>ডিসকাউন্ট পেয়েছেন ({discountPercentCalculated}% ছাড়):</span>
                    <span className="font-mono">- {totalSavings.toLocaleString()} ৳</span>
                  </div>
                )}

                {/* Offer Price / Subtotal */}
                <div className="flex justify-between text-gray-800 font-semibold">
                  <span>পণ্যের মূল্য (Offer Price):</span>
                  <span className="font-mono font-bold">{subtotal.toLocaleString()} ৳</span>
                </div>

                {/* Delivery Charge */}
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ ({deliveryArea === 'dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}):</span>
                  <span className="font-mono font-semibold">{deliveryFee} ৳</span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-center text-base font-extrabold text-[#e30613] pt-2.5 border-t border-gray-300">
                  <span className="text-gray-900 font-heading">সর্বমোট প্রদেয় মূল্য (Grand Total):</span>
                  <span className="font-mono text-xl">{grandTotal.toLocaleString()} ৳</span>
                </div>
              </div>

              {/* 1-Click Order Confirmation Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#e30613] hover:bg-[#c20510] active:scale-[0.99] text-white font-heading font-black text-sm sm:text-base uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>অর্ডার সম্পন্ন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>অর্ডার সম্পন্ন করুন — {grandTotal.toLocaleString()} ৳</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
