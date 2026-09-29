"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Crown, 
  Scan, 
  Palette, 
  Share2, 
  Video, 
  Package, 
  Truck, 
  Sliders, 
  Store, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Flame,
  ArrowRight
} from "lucide-react";
import { 
  DeliverySettings, 
  OfferFlyer, 
  ProductItem, 
  CustomerOrder,
  OrderStatus 
} from "@/types/boraey";
import { HandwritingOcrStudio } from "./HandwritingOcrStudio";
import { FlyerGeneratorStudio } from "./FlyerGeneratorStudio";
import { FacebookAutoPoster } from "./FacebookAutoPoster";
import { ReelsStudio } from "./ReelsStudio";
import { OrdersManager } from "./OrdersManager";

interface AdminDashboardProps {
  deliverySettings: DeliverySettings;
  onUpdateDeliverySettings: (settings: DeliverySettings) => void;
  flyer: OfferFlyer;
  onUpdateFlyer: (flyer: OfferFlyer) => void;
  products: ProductItem[];
  onUpdateProducts: (products: ProductItem[]) => void;
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenStorefront: () => void;
}

export function AdminDashboard({
  deliverySettings,
  onUpdateDeliverySettings,
  flyer,
  onUpdateFlyer,
  products,
  onUpdateProducts,
  orders,
  onUpdateOrderStatus,
  onOpenStorefront,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'ocr' | 'flyer' | 'facebook' | 'reels' | 'orders' | 'settings'>('ocr');
  const [toggleNotice, setToggleNotice] = useState<string | null>(null);

  const handleToggleDelivery = () => {
    const updated = {
      ...deliverySettings,
      isDeliveryEnabled: !deliverySettings.isDeliveryEnabled,
    };
    onUpdateDeliverySettings(updated);
    setToggleNotice(
      updated.isDeliveryEnabled 
        ? "✅ تم تفعيل خدمة التوصيل المنزلي لجميع العملاء بنجاح!" 
        : "⏸️ تم إيقاف خدمة الدليفري وتحويل كافة الطلبات للاستلام من الفرع تلقائياً!"
    );
    setTimeout(() => setToggleNotice(null), 3500);
  };

  const handleGenerateFlyerFromOcr = (detectedProducts: ProductItem[]) => {
    const updatedFlyer: OfferFlyer = {
      ...flyer,
      products: detectedProducts,
    };
    onUpdateFlyer(updatedFlyer);
    onUpdateProducts(detectedProducts);
    setActiveTab('flyer');
  };

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast Alert for Delivery Setting change */}
      {toggleNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 border border-cyan-400 text-white text-xs font-bold shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toggleNotice}</span>
        </div>
      )}

      {/* Top Executive Header for Teacher Sameh */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-zinc-900 to-black p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400 shadow-xl bg-black shrink-0">
              <Image src="/boraey-logo.jpg" alt="المعلم سامح - البرعي" fill className="object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  بوابة المعلم سامح الذكية (El Boraey AI Super-Hub)
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                التحكم الكامل في الهايبر، تحويل الورقة المكتوبة بخط الإيد إلى مجلة أسبوعية، وصناعة منشورات الفيسبوك وريلز بضغطة زر!
              </p>
            </div>
          </div>

          {/* Quick Delivery Switcher Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl flex items-center justify-between sm:justify-start gap-4">
            <div className="text-right">
              <span className="text-xs font-black text-white block">
                حالة خدمة التوصيل للمنازل (Delivery):
              </span>
              <span className={`text-[11px] font-bold ${deliverySettings.isDeliveryEnabled ? "text-emerald-400" : "text-amber-400"}`}>
                {deliverySettings.isDeliveryEnabled ? "مفعلة وتستقبل طلبات التوصيل 🛵" : "متوقفة (استلام بالفرع فقط) 🏬"}
              </span>
            </div>

            {/* Toggle Button */}
            <button
              onClick={handleToggleDelivery}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                deliverySettings.isDeliveryEnabled ? "bg-emerald-600" : "bg-slate-700"
              }`}
              title="اضغط لتشغيل أو إيقاف الدليفري"
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  deliverySettings.isDeliveryEnabled ? "translate-x-0" : "-translate-x-8"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">طلبات اليوم:</span>
            <span className="text-base font-black text-white font-mono">{orders.length} طلبات</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">مبيعات الحجوزات:</span>
            <span className="text-base font-black text-cyan-400 font-mono">{totalSales} ج.م</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">منتجات المجلة:</span>
            <span className="text-base font-black text-amber-400 font-mono">{flyer.products.length} صنف</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">قالب المجلة الحالي:</span>
            <span className="text-xs font-bold text-purple-300">
              {flyer.theme === "metallic" ? "ميتاليك الفاخر ⭐" : flyer.theme === "dynamite" ? "ديناميت ناري 🔥" : flyer.theme === "fresh" ? "سوق التوفير 🌿" : "المواسم الذهبية ✨"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs for AI Modules */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('ocr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
            activeTab === 'ocr'
              ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Scan className="w-4 h-4 text-purple-300" />
          <span>1. فاحص ورقة خط الإيد (AI Vision OCR)</span>
        </button>

        <button
          onClick={() => setActiveTab('flyer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
            activeTab === 'flyer'
              ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/20"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Palette className="w-4 h-4 text-cyan-300" />
          <span>2. استوديو مجلات العروض (4 قوالب مبهرة)</span>
        </button>

        <button
          onClick={() => setActiveTab('facebook')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
            activeTab === 'facebook'
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Share2 className="w-4 h-4 text-blue-300" />
          <span>3. استوديو فيسبوك التلقائي</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
            activeTab === 'reels'
              ? "bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-600/20"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4 text-pink-300" />
          <span>4. استوديو ريلز 9:16 الذكي</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
            activeTab === 'orders'
              ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Package className="w-4 h-4 text-emerald-300" />
          <span>5. إدارة ومتابعة الطلبات ({orders.length})</span>
        </button>
      </div>

      {/* Render Active Sub-View */}
      {activeTab === 'ocr' && (
        <HandwritingOcrStudio onGenerateFlyerFromOcr={handleGenerateFlyerFromOcr} />
      )}

      {activeTab === 'flyer' && (
        <FlyerGeneratorStudio
          currentFlyer={flyer}
          onUpdateFlyer={onUpdateFlyer}
          onPublishToStore={(f) => {
            onUpdateFlyer(f);
            onUpdateProducts(f.products);
          }}
          onSendToFacebookStudio={() => setActiveTab('facebook')}
          onSendToReelsStudio={() => setActiveTab('reels')}
        />
      )}

      {activeTab === 'facebook' && (
        <FacebookAutoPoster
          products={products}
          onOpenStorefront={onOpenStorefront}
        />
      )}

      {activeTab === 'reels' && (
        <ReelsStudio onBackToFlyer={() => setActiveTab('flyer')} />
      )}

      {activeTab === 'orders' && (
        <OrdersManager
          orders={orders}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      )}
    </div>
  );
}
