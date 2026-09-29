"use client";

import React, { useState } from "react";
import { 
  Package, 
  Truck, 
  Store, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Search, 
  Phone, 
  User, 
  MapPin, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { CustomerOrder, OrderStatus } from "@/types/boraey";

interface OrdersManagerProps {
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrdersManager({ orders, onUpdateOrderStatus }: OrdersManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === "all" || ord.status === filterStatus;
    const matchesSearch = ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ord.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">جديد ⚡</span>;
      case "preparing":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">قيد التجهيز ⏳</span>;
      case "ready_for_pickup":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">جاهز للاستلام 🏬</span>;
      case "out_for_delivery":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">خرج للدليفري 🛵</span>;
      case "completed":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">تم التسليم ✅</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">ملغي ❌</span>;
    }
  };

  const getCustomerWhatsAppUrl = (order: CustomerOrder) => {
    const cleanPhone = order.customerPhone.startsWith("0") ? "2" + order.customerPhone : order.customerPhone;
    const msg = `أهلاً بحضرتك يا فندم من هايبر ماركت البرعي (فرع زفتى) 💙%0A` +
                `بخصوص طلبك رقم (${order.orderNumber}):%0A` +
                `حالة الطلب الحالية: ${order.status === "ready_for_pickup" ? "طلبك جاهز للاستلام فوراً من الفرع" : "طلبك قيد التجهيز بعناية"}%0A` +
                `إجمالي المبلغ: ${order.total} ج.م%0A` +
                `شكراً لثقتكم في البرعي!`;
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                إدارة ومتابعة طلبات الزبائن الواردة
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {orders.length} طلبات
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              متابعة الطلبات المحجوزة أونلاين وتغيير حالتها فورياً، مع زر التواصل التلقائي مع العميل عبر الواتساب!
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "الكل" },
            { id: "new", label: "جديد" },
            { id: "preparing", label: "قيد التجهيز" },
            { id: "ready_for_pickup", label: "جاهز للاستلام" },
            { id: "completed", label: "مكتمل" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === f.id
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 space-y-2">
            <Package className="w-8 h-8 mx-auto" />
            <p className="text-xs font-bold">لا توجد طلبات تطابق الفلتر الحالي</p>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl"
            >
              {/* Order Head */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-cyan-400">
                    {ord.orderNumber}
                  </span>
                  {getStatusBadge(ord.status)}
                  <span className="text-xs text-slate-500">
                    ({ord.createdAt})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">نوع الطلب:</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    ord.deliveryType === "delivery"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}>
                    {ord.deliveryType === "delivery" ? <Truck className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                    <span>{ord.deliveryType === "delivery" ? "دليفري للمنزل" : "استلام من الفرع"}</span>
                  </span>
                </div>
              </div>

              {/* Order Body info & Items */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Customer Details */}
                <div className="md:col-span-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{ord.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{ord.customerPhone}</span>
                  </div>
                  {ord.address && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{ord.address}</span>
                    </div>
                  )}
                  {ord.notes && (
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300/90 mt-2">
                      ملاحظة: {ord.notes}
                    </div>
                  )}
                </div>

                {/* Items Summary */}
                <div className="md:col-span-5 space-y-1 text-xs">
                  <span className="text-slate-500 block mb-1">المنتجات المحجوزة:</span>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300 text-[11px]">
                        <span className="truncate max-w-[200px]">{it.product.name} (×{it.quantity})</span>
                        <span className="font-mono text-cyan-400 font-bold">{it.product.offerPrice * it.quantity} ج</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Status Modifiers */}
                <div className="md:col-span-3 flex flex-col justify-between items-end text-left">
                  <div>
                    <span className="text-xs text-slate-400 block">إجمالي الطلب:</span>
                    <span className="text-lg font-black text-cyan-400 font-mono">
                      {ord.total} ج.م
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      الدفع: {ord.paymentMethod === "cash" ? "كاش" : ord.paymentMethod === "instapay" ? "إنستاباي" : "فودافون كاش"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <a
                      href={getCustomerWhatsAppUrl(ord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                      title="مراسلة العميل عبر الواتساب"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    {ord.status === "new" && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, "preparing")}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        بدء التجهيز ⏳
                      </button>
                    )}

                    {ord.status === "preparing" && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, ord.deliveryType === "delivery" ? "out_for_delivery" : "ready_for_pickup")}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {ord.deliveryType === "delivery" ? "خرج للتوصيل 🛵" : "جاهز للاستلام 🏬"}
                      </button>
                    )}

                    {(ord.status === "ready_for_pickup" || ord.status === "out_for_delivery") && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, "completed")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        تم التسليم ✅
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
