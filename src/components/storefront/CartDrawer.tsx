"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  MessageSquare,
  CreditCard,
  Banknote,
  Smartphone
} from "lucide-react";
import { CartItem, DeliverySettings, CustomerOrder, PaymentMethod, OrderDeliveryType } from "@/types/boraey";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  deliverySettings: DeliverySettings;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: CustomerOrder) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  deliverySettings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}: CartDrawerProps) {
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>(
    deliverySettings.isDeliveryEnabled ? "delivery" : "pickup"
  );
  const [pickupBranchId, setPickupBranchId] = useState<string>(
    deliverySettings.defaultBranchId || (deliverySettings.branches[0]?.id ?? "branch-1")
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.offerPrice * item.quantity), 0);
  const deliveryFee = (deliveryType === "delivery" && deliverySettings.isDeliveryEnabled) ? deliverySettings.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  const selectedBranch = deliverySettings.branches.find(b => b.id === pickupBranchId) || deliverySettings.branches[0];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("برجاء إدخال الاسم ورقم الهاتف لإتمام الطلب");
      return;
    }

    if (deliveryType === "delivery" && deliverySettings.isDeliveryEnabled && !customerAddress) {
      alert("برجاء إدخال عنوان التوصيل بالتفصيل");
      return;
    }

    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `BR-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      deliveryType: deliverySettings.isDeliveryEnabled ? deliveryType : "pickup",
      pickupBranchId: deliveryType === "pickup" || !deliverySettings.isDeliveryEnabled ? pickupBranchId : undefined,
      address: (deliveryType === "delivery" && deliverySettings.isDeliveryEnabled) ? customerAddress : undefined,
      notes: customerNotes || undefined,
      paymentMethod,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      total: grandTotal,
      status: "new",
      createdAt: "الآن",
    };

    onOrderPlaced(newOrder);
    setCompletedOrder(newOrder);
    onClearCart();
  };

  const getWhatsAppLink = (order: CustomerOrder) => {
    const itemsList = order.items
      .map((it) => `- ${it.product.name} (عدد ${it.quantity}) بسعر ${it.product.offerPrice * it.quantity} ج`)
      .join("%0A");

    const orderBranch = deliverySettings.branches.find(b => b.id === order.pickupBranchId) || deliverySettings.branches[0];
    const targetPhone = orderBranch?.whatsapp || deliverySettings.whatsappNumber || "201023456789";

    const branchLine = (order.deliveryType === "pickup" && orderBranch)
      ? `فرع الاستلام: ${orderBranch.name} (${orderBranch.address})%0A`
      : "";

    const message = `طلب جديد من موقع هايبر ماركت البرعي 🛒%0A` +
      `رقم الطلب: ${order.orderNumber}%0A` +
      `الاسم: ${order.customerName}%0A` +
      `الهاتف: ${order.customerPhone}%0A` +
      `نوع الطلب: ${order.deliveryType === "delivery" ? "توصيل منزلي 🛵" : "استلام من الفرع 🏬"}%0A` +
      branchLine +
      (order.address ? `عنوان التوصيل: ${order.address}%0A` : "") +
      `طريقة الدفع: ${order.paymentMethod === "cash" ? "كاش" : order.paymentMethod === "instapay" ? "إنستاباي" : "فودافون كاش"}%0A` +
      `الأصناف المطلوبة:%0A${itemsList}%0A` +
      `إجمالي الطلب: ${order.total} جنيه مصري%0A` +
      `شكراً يا معلم سامح وفي انتظار التجهيز! 💙`;

    return `https://wa.me/${targetPhone}?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-r border-slate-800 text-white h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-black">
              عربة المشتريات ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Order Confirmation View */}
        {completedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                تم استلام طلبك بنجاح!
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                رقم طلبك: <span className="text-cyan-400 font-mono">{completedOrder.orderNumber}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                سيقوم فريق هايبر ماركت البرعي بتجهيز طلبك فوراً بسعر جملة الجملة 💙
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">العميل:</span>
                <span className="font-bold text-white">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">الهاتف:</span>
                <span className="font-bold text-white font-mono">{completedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">نوع الاستلام:</span>
                <span className="font-bold text-cyan-300">
                  {completedOrder.deliveryType === "delivery" ? "🛵 دليفري وتوصيل للمنزل" : "🏬 استلام فوري من الفرع (زفتى)"}
                </span>
              </div>
              {completedOrder.address && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">العنوان:</span>
                  <span className="font-bold text-white">{completedOrder.address}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 pt-2">
                <span className="font-bold text-slate-300">الإجمالي النهائي:</span>
                <span className="font-black text-cyan-400 font-mono text-sm">{completedOrder.total} ج.م</span>
              </div>
            </div>

            {/* WhatsApp 1-Click Send Button */}
            <div className="space-y-2 pt-2">
              <a
                href={getWhatsAppLink(completedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>إرسال وتأكيد الطلب عبر واتساب الهايبر فوراً</span>
              </a>

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                إغلاق والعودة للتسوق
              </button>
            </div>
          </div>
        ) : (
          /* Normal Cart & Checkout View */
          <div className="flex-1 overflow-y-auto flex flex-col justify-between">
            {cartItems.length === 0 ? (
              <div className="p-12 text-center space-y-3 my-auto">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-300">عربة المشتريات فارغة</h4>
                <p className="text-xs text-slate-500">
                  تصفح المنتجات ومجلة العروض وأضف منتجاتك بأسعار جملة الجملة!
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-400">المنتجات المختارة</span>
                    <button
                      onClick={onClearCart}
                      className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      تفريغ العربة
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">
                            {item.product.name}
                          </h5>
                          <span className="text-[10px] text-cyan-400 font-mono font-bold block mt-0.5">
                            {item.product.offerPrice} ج.م × {item.quantity} = {item.product.offerPrice * item.quantity} ج
                          </span>
                        </div>

                        {/* Quantity Modifier */}
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-black px-1.5 text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Notice / Toggle Handling */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">طريقة الاستلام:</label>

                  {!deliverySettings.isDeliveryEnabled ? (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>خدمة التوصيل المنزلي متوقفة حالياً</span>
                      </div>
                      <p className="text-[11px] text-amber-200/80 leading-relaxed">
                        {deliverySettings.pauseReasonNotice}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        <Store className="w-4 h-4 text-cyan-400" />
                        <span>متاح تلقائياً: الاستلام المباشر من فرع زفتى (مجاناً وبدون انتظار)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("delivery")}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          deliveryType === "delivery"
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>توصيل للمنزل (+{deliverySettings.deliveryFee} ج)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType("pickup")}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          deliveryType === "pickup"
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span>استلام من الفرع (مجاناً)</span>
                      </button>
                    </div>
                  )}

                  {/* Branch Selection for Pickup */}
                  {(deliveryType === "pickup" || !deliverySettings.isDeliveryEnabled) && (
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-slate-300 block">اختر فرع الاستلام في زفتى:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {deliverySettings.branches.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setPickupBranchId(b.id)}
                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                              pickupBranchId === b.id
                                ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-black text-xs text-white">{b.name}</span>
                              {b.isMain && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">الرئيسي</span>}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{b.address}</p>
                            <p className="text-[10px] text-emerald-400 font-mono mt-1">📞 {b.phone}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkout Form */}
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      اسم العميل الكريم: *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد عبد الله"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      رقم الهاتف / الواتساب: *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {deliverySettings.isDeliveryEnabled && deliveryType === "delivery" && (
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        عنوان التوصيل بالتفصيل (زفتى والقرى المجاورة): *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="المنطقة، اسم الشارع، رقم العمارة والدور"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      طريقة الدفع:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          paymentMethod === "cash"
                            ? "bg-blue-600/30 text-cyan-300 border-cyan-400"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        <span>كاش</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("instapay")}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          paymentMethod === "instapay"
                            ? "bg-purple-600/30 text-purple-300 border-purple-400"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-purple-400" />
                        <span>إنستاباي</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("vodafone_cash")}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          paymentMethod === "vodafone_cash"
                            ? "bg-rose-600/30 text-rose-300 border-rose-400"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-rose-400" />
                        <span>فودافون كاش</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      ملاحظات على الطلب (اختياري):
                    </label>
                    <input
                      type="text"
                      placeholder="أي تعليمات خاصة بالطلب أو ميعاد الاستلام"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                </form>

                {/* Totals Summary & Submit Button */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مجموع المنتجات:</span>
                    <span className="font-mono text-white">{subtotal} ج.م</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مصاريف التوصيل:</span>
                    <span className="font-mono text-white">
                      {deliveryFee > 0 ? `${deliveryFee} ج.م` : "مجاناً"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-800/80">
                    <span className="text-white">الإجمالي النهائي:</span>
                    <span className="text-cyan-400 font-mono text-base">{grandTotal} ج.م</span>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full mt-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>تأكيد وإرسال الطلب الآن</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
