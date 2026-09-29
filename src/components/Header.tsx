"use client";

import React from "react";
import Image from "next/image";
import { 
  ShoppingBag, 
  Sparkles, 
  BookOpen, 
  Store, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  Crown
} from "lucide-react";
import { DeliverySettings, CartItem } from "@/types/boraey";

interface HeaderProps {
  activeView: 'store' | 'flyer' | 'admin';
  onViewChange: (view: 'store' | 'flyer' | 'admin') => void;
  deliverySettings: DeliverySettings;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onToggleDelivery: () => void;
}

export function Header({
  activeView,
  onViewChange,
  deliverySettings,
  cartItems,
  onOpenCart,
  onToggleDelivery,
}: HeaderProps) {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.offerPrice * item.quantity), 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Branch & Contact */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>فرع زفتى: شارع الجيش - بجوار الوحدة الزراعية</span>
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <a 
              href={`tel:${deliverySettings.contactPhone}`} 
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{deliverySettings.contactPhone}</span>
            </a>
          </div>

          {/* Delivery Status Indicator & Quick Admin Switch */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
              deliverySettings.isDeliveryEnabled 
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
                : "bg-amber-500/10 text-amber-300 border-amber-500/30"
            }`}>
              <span className={`w-2 h-2 rounded-full ${deliverySettings.isDeliveryEnabled ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span>
                {deliverySettings.isDeliveryEnabled 
                  ? "🚀 التوصيل للمنازل متاح (45 دقيقة)" 
                  : "🏬 الاستلام متاح من الفرع (التوصيل مغلق)"}
              </span>
            </div>

            <button
              onClick={onToggleDelivery}
              title="تغيير حالة الدليفري السريعة"
              className="text-[10px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer hidden md:inline-block"
            >
              (تغيير الحالة)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Logo */}
          <div 
            onClick={() => onViewChange('store')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-cyan-400 transition-all shadow-md bg-black shrink-0">
              <Image 
                src="/boraey-logo.jpg" 
                alt="هايبر ماركت البرعي"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  هايبر ماركت البرعي
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                  زفتى
                </span>
              </div>
              <p className="text-[11px] font-medium text-cyan-400">
                الأسعار قطاعي بسعر جملة الجملة 💙💙
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher Tabs */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onViewChange('store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'store'
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>متجر العروض والطلبات</span>
            </button>

            <button
              onClick={() => onViewChange('flyer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'flyer'
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>مجلة عروض الأسبوع</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono">
                جديد 🔥
              </span>
            </button>

            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'admin'
                  ? "bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/20"
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>بوابة المعلم سامح (AI Hub)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>

          {/* Action buttons (Cart & Mobile Menu/Admin) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Admin switch on small screens */}
            <button
              onClick={() => onViewChange(activeView === 'admin' ? 'store' : 'admin')}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{activeView === 'admin' ? "المتجر" : "المعلم سامح"}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-900/80 leading-none">عربة المشتريات</span>
                <span className="text-xs sm:text-sm font-black font-mono leading-tight">{cartTotal} ج.م</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800">
          <button
            onClick={() => onViewChange('store')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold ${
              activeView === 'store' ? "bg-blue-600/30 text-cyan-300 border border-blue-500/30" : "text-slate-400"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>المتجر</span>
          </button>
          <button
            onClick={() => onViewChange('flyer')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold ${
              activeView === 'flyer' ? "bg-amber-600/30 text-amber-300 border border-amber-500/30" : "text-slate-400"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>مجلة العروض</span>
          </button>
          <button
            onClick={() => onViewChange('admin')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold ${
              activeView === 'admin' ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "text-slate-400"
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>المعلم سامح AI</span>
          </button>
        </div>
      </div>
    </header>
  );
}
