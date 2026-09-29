"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Truck, 
  Store, 
  AlertCircle, 
  Check, 
  Plus, 
  Minus, 
  ShoppingBag, 
  SlidersHorizontal,
  ChevronLeft,
  Wand2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { ProductItem, ProductCategory, OfferFlyer, DeliverySettings, CartItem } from "@/types/boraey";

interface StorefrontViewProps {
  products: ProductItem[];
  flyer: OfferFlyer;
  deliverySettings: DeliverySettings;
  cartItems: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenFlyerModal: () => void;
  onOpenCart: () => void;
  onGoToAdmin: () => void;
}

const CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: "all", label: "كافة العروض", icon: "🔥" },
  { id: "grocery", label: "بقالة وتموين", icon: "🌾" },
  { id: "dairy", label: "ألبان وأجبان", icon: "🧀" },
  { id: "frozen", label: "مجمدات وبانيه", icon: "🍗" },
  { id: "spices_oils", label: "زيوت وسمن", icon: "🛢️" },
  { id: "cleaning", label: "منظفات وتوفير", icon: "🧼" },
  { id: "beverages", label: "شاي ومشروبات", icon: "☕" },
];

export function StorefrontView({
  products,
  flyer,
  deliverySettings,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenFlyerModal,
  onOpenCart,
  onGoToAdmin,
}: StorefrontViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hotOffersOnly, setHotOffersOnly] = useState(false);
  const [addedItemAnim, setAddedItemAnim] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesHot = !hotOffersOnly || p.isHotOffer;
    return matchesCategory && matchesSearch && matchesHot;
  });

  const getItemQuantityInCart = (productId: string) => {
    const item = cartItems.find((ci) => ci.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAdd = (product: ProductItem) => {
    onAddToCart(product);
    setAddedItemAnim(product.id);
    setTimeout(() => setAddedItemAnim(null), 1200);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Delivery Status Announcement Banner */}
      {!deliverySettings.isDeliveryEnabled ? (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-amber-300">
                تنبيه: خدمة التوصيل متوقفة حالياً للتجهيز — الاستلام الفوري متاح من فرع زفتى!
              </h4>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                {deliverySettings.pauseReasonNotice}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 self-start sm:self-center shrink-0">
            الاستلام بالفرع متاح 🏬
          </span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-300">
                خدمة التوصيل السريع متاحة الآن في زفتى والقرى المجاورة! 🛵
              </h4>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                توصيل طلباتك لحد باب بيتك في خلال {deliverySettings.estimatedTimeMinutes} دقيقة - مصاريف الشحن {deliverySettings.deliveryFee} ج.م فقط!
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 bg-emerald-400/20 border border-emerald-400/40 rounded-full text-emerald-300 self-start sm:self-center shrink-0">
            دليفري فوري 🚀
          </span>
        </div>
      )}

      {/* Hero Banner: El Boraey Grand Offers Festival */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أكبر مهرجان عروض وتخفيضات في الغربية</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              الأسعار قطاعي <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                بسعر جملة الجملة! 💙
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              وفر ميزانية بيتك مع عروض هايبر ماركت البرعي الأسبوعية.. سلع تموينية، ألبان، مجمدات، ومنظفات بأعلى جودة وأقل سعر في السوق مباشرة من المعلم سامح!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenFlyerModal}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>تصفح مجلة العروض الورقية الرقمية 📖</span>
              </button>

              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>عرض السلة ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              </button>
            </div>
          </div>

          {/* Quick Magazine Teaser Card */}
          <div 
            onClick={onOpenFlyerModal}
            className="w-full sm:w-80 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-xl cursor-pointer hover:border-cyan-400 transition-all group"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-black text-white">{flyer.title}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {flyer.weekLabel}
              </span>
            </div>

            <div className="py-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>فترة العرض:</span>
                <span className="text-slate-200 font-medium">{flyer.startDate} - {flyer.endDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>عدد المنتجات بالعرض:</span>
                <span className="font-mono text-cyan-400 font-bold">{flyer.products.length} منتج توفير</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>افتح المجلة للشراء المباشر</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Sameh Admin Teaser Bar */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
            <Wand2 className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-purple-300">
              أهلاً بالمعلم سامح! عاوز ترفع ورقة خط الإيد أو تولد مجلة جديدة بالذكاء الاصطناعي؟
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              صور الورقة بالكشكول والذكاء الاصطناعي هيقرأ الأسعار ويولد مجلة وتصميمات فيسبوك وريلز بضغطة زر واحدة!
            </p>
          </div>
        </div>

        <button
          onClick={onGoToAdmin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-black text-xs shadow-md transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <span>دخول بوابة المعلم سامح</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>

      {/* Filters, Categories and Search */}
      <div className="space-y-3">
        {/* Search & Quick Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن اسم المنتج، زيت، أرز، سكر، بانيه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Hot Offers Toggle & Total Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setHotOffersOnly(!hotOffersOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                hotOffersOnly
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${hotOffersOnly ? "text-amber-400 fill-amber-400" : "text-slate-500"}`} />
              <span>عروض نار فقط 🔥</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              المعروض: <strong className="text-cyan-400 font-mono">{filteredProducts.length}</strong> منتج
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/10"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => {
          const qty = getItemQuantityInCart(prod.id);
          const isJustAdded = addedItemAnim === prod.id;

          return (
            <div
              key={prod.id}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden p-4"
            >
              {/* Discount Tag */}
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-rose-600 text-white shadow-md flex items-center gap-0.5">
                  <span>وفر {Math.round(prod.originalPrice - prod.offerPrice)} ج</span>
                  <span className="text-[10px] font-normal opacity-90">({prod.discountPercentage}%)</span>
                </span>
              </div>

              {/* Hot Offer Tag */}
              {prod.isHotOffer && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow">
                    <Flame className="w-3 h-3 fill-slate-950" />
                    <span>عرض الأسبوع</span>
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 mb-3 group-hover:scale-102 transition-transform duration-300">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-white leading-snug group-hover:text-cyan-300 transition-colors">
                    {prod.name}
                  </h3>
                  <span className="text-xs text-slate-400 block mt-1">
                    {prod.unit}
                  </span>
                  {prod.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  )}
                </div>

                {/* Pricing & Add to Cart */}
                <div className="pt-3 border-t border-slate-800/80 mt-3 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500 line-through block">
                        {prod.originalPrice} ج.م
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-cyan-400 font-mono">
                          {prod.offerPrice}
                        </span>
                        <span className="text-xs font-bold text-slate-300">ج.م</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      سعر جملة الجملة ⚡
                    </span>
                  </div>

                  {/* Quantity Modifier or Add Button */}
                  {qty > 0 ? (
                    <div className="flex items-center justify-between bg-slate-950 border border-cyan-500/40 rounded-xl p-1">
                      <button
                        onClick={() => onUpdateCartQuantity(prod.id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-white font-mono">{qty} في العربة</span>
                        <span className="text-[9px] text-cyan-400 font-mono font-bold">
                          {qty * prod.offerPrice} ج.م
                        </span>
                      </div>

                      <button
                        onClick={() => onUpdateCartQuantity(prod.id, 1)}
                        className="w-8 h-8 rounded-lg bg-cyan-600 hover:bg-cyan-500 flex items-center justify-center text-slate-950 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(prod)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isJustAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>تمت الإضافة بنجاح!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>أضف للسلة بسعر العرض</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
