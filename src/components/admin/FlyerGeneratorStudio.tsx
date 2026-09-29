"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Palette, 
  Wand2, 
  Sparkles, 
  Check, 
  Download, 
  Share2, 
  BookOpen, 
  Flame, 
  Calendar, 
  Eye, 
  Layers,
  ArrowRight,
  Send,
  Video,
  FileCheck,
  Plus,
  Trash2,
  Edit3,
  Smile,
  MessageSquare,
  Search
} from "lucide-react";
import { OfferFlyer, FlyerTheme, ProductItem, ProductCategory } from "@/types/boraey";
import { downloadElementAsImage } from "@/lib/imageDownloader";

interface FlyerGeneratorStudioProps {
  currentFlyer: OfferFlyer;
  onUpdateFlyer: (flyer: OfferFlyer) => void;
  onPublishToStore: (flyer: OfferFlyer) => void;
  onSendToFacebookStudio: () => void;
  onSendToReelsStudio: () => void;
  availableProducts?: ProductItem[];
}

const THEMES: { id: FlyerTheme; name: string; desc: string; badge: string; gradient: string }[] = [
  {
    id: "metallic",
    name: "ميتاليك البرعي الفاخر (Metallic Platinum)",
    desc: "تصميم فخم أسود ومعدن فضي 3D مستوحى من الهوية الرسمية لشعار البرعي",
    badge: "الأكثر طلباً ⭐",
    gradient: "from-slate-900 via-zinc-800 to-black border-slate-600",
  },
  {
    id: "dynamite",
    name: "سوبر ماركت ديناميت (Hyper Dynamite)",
    desc: "ألوان حماسية باللونين الأحمر والأصفر لأسلوب تحطيم وتفجير الأسعار",
    badge: "حماسي وناري 🔥",
    gradient: "from-red-950 via-red-900 to-amber-950 border-red-500",
  },
  {
    id: "fresh",
    name: "سوق التوفير الأخضر (Fresh Market)",
    desc: "درجات الزمرد والأكوا العصرية، تعطي شعوراً بالطزاجة والراحة العائلية",
    badge: "منعش وعصري 🌿",
    gradient: "from-emerald-950 via-teal-900 to-slate-950 border-teal-500",
  },
  {
    id: "festive",
    name: "المواسم الذهبية (Golden Festive)",
    desc: "ستايل ذهبي وأرجواني فاخر للمناسبات، الأعياد، وعروض بداية الشهر",
    badge: "احتفالي ومميز ✨",
    gradient: "from-purple-950 via-amber-950 to-slate-950 border-amber-500",
  },
];

export function FlyerGeneratorStudio({
  currentFlyer,
  onUpdateFlyer,
  onPublishToStore,
  onSendToFacebookStudio,
  onSendToReelsStudio,
  availableProducts = [],
}: FlyerGeneratorStudioProps) {
  const [selectedTheme, setSelectedTheme] = useState<FlyerTheme>(currentFlyer.theme);
  const [title, setTitle] = useState(currentFlyer.title);
  const [subtitle, setSubtitle] = useState(currentFlyer.subtitle);
  const [weekLabel, setWeekLabel] = useState(currentFlyer.weekLabel);
  const [isPublished, setIsPublished] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isMascotMode, setIsMascotMode] = useState(true);

  // Dynamic Product Modal state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'existing' | 'custom'>('existing');
  const [searchQuery, setSearchQuery] = useState("");

  // Custom product form inputs
  const [customName, setCustomName] = useState("");
  const [customOfferPrice, setCustomOfferPrice] = useState<number>(0);
  const [customOriginalPrice, setCustomOriginalPrice] = useState<number>(0);
  const [customUnit, setCustomUnit] = useState("قطعة");
  const [customQuote, setCustomQuote] = useState("");

  const handleSelectTheme = (theme: FlyerTheme) => {
    setSelectedTheme(theme);
    const updated = { ...currentFlyer, theme };
    onUpdateFlyer(updated);
  };

  const handlePublish = () => {
    const updated: OfferFlyer = {
      ...currentFlyer,
      title,
      subtitle,
      weekLabel,
      theme: selectedTheme,
    };
    onPublishToStore(updated);
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 3000);
  };

  const handleDownloadPdf = async () => {
    setIsDownloaded(true);
    await downloadElementAsImage("flyer-live-preview", "elboraey-weekly-flyer.png");
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  // Add existing product from hypermarket stock into flyer
  const handleAddExistingProduct = (prod: ProductItem) => {
    if (currentFlyer.products.some(p => p.id === prod.id)) {
      alert("هذا المنتج موجود بالفعل في المجلة الأسبوعية!");
      return;
    }
    const updatedProducts = [...currentFlyer.products, prod];
    onUpdateFlyer({
      ...currentFlyer,
      products: updatedProducts,
    });
  };

  // Add new custom product directly to flyer
  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || customOfferPrice <= 0) {
      alert("برجاء إدخال اسم المنتج وسعر العرض بشكل صحيح");
      return;
    }

    const calculatedDiscount = customOriginalPrice > customOfferPrice 
      ? Math.round(((customOriginalPrice - customOfferPrice) / customOriginalPrice) * 100) 
      : 0;

    const newProd: ProductItem = {
      id: `flyer-prod-${Date.now()}`,
      name: customName,
      category: "grocery",
      originalPrice: customOriginalPrice > 0 ? customOriginalPrice : customOfferPrice,
      offerPrice: customOfferPrice,
      discountPercentage: calculatedDiscount,
      unit: customUnit,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
      inStock: true,
      isHotOffer: true,
      mascotImage: "/mascots/oil-bottle.jpg",
      mascotQuote: customQuote || "يا بلاش.. قطاعي بسعر جملة الجملة! 🔥",
    };

    onUpdateFlyer({
      ...currentFlyer,
      products: [...currentFlyer.products, newProd],
    });

    setCustomName("");
    setCustomOfferPrice(0);
    setCustomOriginalPrice(0);
    setCustomQuote("");
    setIsAddProductModalOpen(false);
  };

  // Remove product from flyer
  const handleRemoveProductFromFlyer = (prodId: string) => {
    const updated = currentFlyer.products.filter(p => p.id !== prodId);
    onUpdateFlyer({
      ...currentFlyer,
      products: updated,
    });
  };

  // Preview styling based on selected theme
  const getPreviewStyles = () => {
    switch (selectedTheme) {
      case "dynamite":
        return {
          headerBg: "bg-gradient-to-r from-red-600 via-amber-500 to-red-700 text-white",
          bodyBg: "bg-slate-950 border-red-500/40",
          cardBg: "bg-slate-900/90 border-red-500/30",
          badgeBg: "bg-red-600 text-yellow-300 border-yellow-300/40",
          priceText: "text-amber-400",
        };
      case "fresh":
        return {
          headerBg: "bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-700 text-white",
          bodyBg: "bg-slate-950 border-emerald-500/40",
          cardBg: "bg-slate-900/90 border-emerald-500/30",
          badgeBg: "bg-emerald-600 text-white border-emerald-300/40",
          priceText: "text-emerald-400",
        };
      case "festive":
        return {
          headerBg: "bg-gradient-to-r from-amber-600 via-purple-700 to-amber-700 text-amber-100",
          bodyBg: "bg-slate-950 border-amber-500/40",
          cardBg: "bg-slate-900/90 border-amber-500/30",
          badgeBg: "bg-amber-500 text-slate-950 border-amber-300",
          priceText: "text-amber-300",
        };
      case "metallic":
      default:
        return {
          headerBg: "bg-gradient-to-r from-slate-900 via-zinc-800 to-slate-950 text-white border-b border-cyan-500/40",
          bodyBg: "bg-zinc-950 border-slate-700",
          cardBg: "bg-zinc-900/90 border-slate-800",
          badgeBg: "bg-cyan-500 text-slate-950 border-cyan-300",
          priceText: "text-cyan-400",
        };
    }
  };

  const previewStyle = getPreviewStyles();

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-950 border border-blue-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                استوديو مجلات عروض البرعي (A4 Flyer Designer)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                إضافة وحذف ديناميكي ⚡
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              اختر قالب المجلة، أضف أو احذف أي صنف ديناميكياً، وفعل وضع كارتون المنتجات المتحدثة، ونزل المجلة بصيغة A4 جاهزة للطباعة فوراً!
            </p>
          </div>
        </div>

        {/* Master Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-cyan-400" />}
            <span>{isDownloaded ? "تم التنزيل بنجاح!" : "تحميل المجلة (A4 PNG)"}</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {isPublished ? <Check className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
            <span>{isPublished ? "تم النشر في المتجر!" : "اعتماد ونشر في المتجر 🚀"}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Controls & Right Magazine Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 Cols): Controls & Dynamic Product Management */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Theme Switcher */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>1. اختيار نمط وهوية المجلة:</span>
            </h3>

            <div className="space-y-2.5">
              {THEMES.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    selectedTheme === theme.id
                      ? "bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{theme.name}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {theme.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 mr-4">
                    {theme.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Product Management in Magazine */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>2. أصناف المجلة الأسبوعية ({currentFlyer.products.length} صنف):</span>
              </h3>

              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>إضافة صنف</span>
              </button>
            </div>

            {/* Mascot Toggle Button */}
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smile className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="text-xs font-black text-purple-200 block">
                    وضع شخصيات كارتون المنتجات المتكلمة 🎭
                  </span>
                  <span className="text-[10px] text-purple-300/80">
                    عرض كارتون المنتجات مع بالونات كلام مضحكة لجذب انتباه الزبائن!
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMascotMode(!isMascotMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  isMascotMode ? "bg-purple-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
                    isMascotMode ? "translate-x-0" : "-translate-x-5"
                  }`}
                />
              </button>
            </div>

            {/* Dynamic Items List with delete button */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {currentFlyer.products.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800">
                      <Image
                        src={(isMascotMode && p.mascotImage) ? p.mascotImage : p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-white font-bold block truncate max-w-[170px]">{p.name}</span>
                      <span className="text-cyan-400 font-mono text-[11px]">{p.offerPrice} ج (بدل {p.originalPrice})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveProductFromFlyer(p.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="حذف من المجلة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Texts & Headers Live Tuning */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>3. نصوص وعناوين المجلة:</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">عنوان الغلاف الرئيسي:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">الشعار الترويجي (الفرعي):</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">شارة مدة العرض:</label>
                <input
                  type="text"
                  value={weekLabel}
                  onChange={(e) => setWeekLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onSendToFacebookStudio}
              className="p-3 rounded-2xl bg-blue-950/30 hover:bg-blue-900/50 border border-blue-800/40 text-blue-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>استوديو فيسبوك 🚀</span>
            </button>

            <button
              onClick={onSendToReelsStudio}
              className="p-3 rounded-2xl bg-pink-950/30 hover:bg-pink-900/50 border border-pink-800/40 text-pink-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4 text-pink-400" />
              <span>استوديو ريلز 9:16 🔥</span>
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): Real-time Interactive A4 Magazine Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>المعاينة الحية لمجلة العروض (Live A4 Preview)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                جاهزة للطباعة والنشر 🖨️
              </span>
            </div>

            {/* Flyer Simulation Container (Exported to PNG) */}
            <div id="flyer-live-preview" className={`rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 ${previewStyle.bodyBg}`}>
              
              {/* Flyer Cover Banner */}
              <div className={`p-6 text-center shadow-lg relative overflow-hidden ${previewStyle.headerBg}`}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 relative bg-black shadow-md shrink-0">
                      <Image src="/boraey-logo.jpg" alt="البرعي" fill className="object-cover" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl sm:text-2xl font-black drop-shadow-md">
                        {title}
                      </h3>
                      <p className="text-xs font-bold opacity-90">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[11px] font-bold border border-white/20 mt-1">
                    <span className="text-amber-300 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-300" />
                      <span>{weekLabel}</span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>ساري حتى السبت المقبل بفرعي زفتى</span>
                  </div>
                </div>
              </div>

              {/* Products Grid in Magazine */}
              <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
                {currentFlyer.products.map((prod) => (
                  <div
                    key={prod.id}
                    className={`rounded-xl border p-2 flex flex-col justify-between transition-all relative group ${previewStyle.cardBg}`}
                  >
                    {/* Delete hover button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveProductFromFlyer(prod.id)}
                      className="absolute top-1 left-1 z-10 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      title="حذف من المجلة"
                    >
                      ✕
                    </button>

                    {/* Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${previewStyle.badgeBg}`}>
                        -{prod.discountPercentage}%
                      </span>
                      <span className="text-[8px] font-bold text-slate-400">
                        جملة الجملة
                      </span>
                    </div>

                    {/* Product Image OR Cartoon Mascot */}
                    <div className="relative w-full h-24 rounded-lg overflow-hidden bg-slate-800 mb-2">
                      <Image
                        src={(isMascotMode && prod.mascotImage) ? prod.mascotImage : prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Mascot Comic Speech Bubble */}
                    {isMascotMode && (
                      <div className="mb-1.5 p-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-[9px] font-bold text-amber-200 text-center leading-tight">
                        {prod.mascotQuote || "💬 قطاعي بسعر جملة الجملة!"}
                      </div>
                    )}

                    {/* Info & Price */}
                    <div>
                      <h5 className="text-[11px] font-bold text-white truncate" title={prod.name}>
                        {prod.name}
                      </h5>
                      <span className="text-[9px] text-slate-400 block">
                        {prod.unit}
                      </span>
                      
                      <div className="flex items-baseline justify-between pt-1 mt-1 border-t border-slate-800">
                        <span className="text-[9px] text-slate-500 line-through">
                          {prod.originalPrice} ج
                        </span>
                        <span className={`text-xs font-black font-mono ${previewStyle.priceText}`}>
                          {prod.offerPrice} ج
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 bg-black/60 border-t border-slate-800 text-center text-[10px] text-slate-400">
                <p>فرعا زفتى بشارع الجيش: بجوار الوحدة الزراعية & أمام جامع الشحري | الأسعار شاملة ضريبة القيمة المضافة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product to Magazine Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>إضافة صنف لمجلة عروض الأسبوع</span>
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕ إغلاق
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setModalTab('existing')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'existing'
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                اختيار من مخزون الهايبر ({availableProducts.length})
              </button>

              <button
                type="button"
                onClick={() => setModalTab('custom')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'custom'
                    ? "bg-amber-500/20 text-amber-300 border border-amber-400"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                + صنف مخصص جديد
              </button>
            </div>

            {/* Tab 1: Pick from existing products */}
            {modalTab === 'existing' ? (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث في أصناف الهايبر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-9 pl-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-80">
                  {availableProducts
                    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((prod) => {
                      const isAlreadyInFlyer = currentFlyer.products.some(p => p.id === prod.id);

                      return (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                              <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white truncate max-w-[220px]">{prod.name}</h4>
                              <span className="text-cyan-400 font-mono font-black">{prod.offerPrice} ج.م</span>
                              <span className="text-slate-500 line-through text-[11px] mr-2">{prod.originalPrice} ج.م</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isAlreadyInFlyer}
                            onClick={() => handleAddExistingProduct(prod)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              isAlreadyInFlyer
                                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                                : "bg-cyan-500/20 text-cyan-300 border border-cyan-400 hover:bg-cyan-500/30"
                            }`}
                          >
                            {isAlreadyInFlyer ? "مضاف للمجلة ✓" : "+ إضافة"}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              /* Tab 2: Custom new product form */
              <form onSubmit={handleAddCustomProduct} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">اسم الصنف: *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شاي لبتون أصفر 250 جم"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">السعر الأصلي:</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="60"
                      value={customOriginalPrice || ""}
                      onChange={(e) => setCustomOriginalPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-amber-300 block mb-1">سعر العرض (جملة الجملة): *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      placeholder="45"
                      value={customOfferPrice || ""}
                      onChange={(e) => setCustomOfferPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 font-bold focus:outline-hidden focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">الوحدة:</label>
                    <input
                      type="text"
                      placeholder="باكيت 250 جم"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-300 block mb-1">عبارة الكارتون المضحكة 💬:</label>
                    <input
                      type="text"
                      placeholder="أنا شاي مظبوط وهيعدل مزاجك!"
                      value={customQuote}
                      onChange={(e) => setCustomQuote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-xs text-purple-300 focus:outline-hidden focus:border-purple-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer text-center"
                >
                  إضافة الصنف للمجلة فوراً
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
