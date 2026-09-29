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
  FileCheck
} from "lucide-react";
import { OfferFlyer, FlyerTheme, ProductItem } from "@/types/boraey";
import { downloadElementAsImage } from "@/lib/imageDownloader";

interface FlyerGeneratorStudioProps {
  currentFlyer: OfferFlyer;
  onUpdateFlyer: (flyer: OfferFlyer) => void;
  onPublishToStore: (flyer: OfferFlyer) => void;
  onSendToFacebookStudio: () => void;
  onSendToReelsStudio: () => void;
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
}: FlyerGeneratorStudioProps) {
  const [selectedTheme, setSelectedTheme] = useState<FlyerTheme>(currentFlyer.theme);
  const [title, setTitle] = useState(currentFlyer.title);
  const [subtitle, setSubtitle] = useState(currentFlyer.subtitle);
  const [weekLabel, setWeekLabel] = useState(currentFlyer.weekLabel);
  const [isPublished, setIsPublished] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

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
                استوديو تصميم وتوليد المجلات الأسبوعية (AI Multi-Theme Flyer Studio)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                تغيير الثيم بضغطة زر 🎨
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              اختر بين 4 ثيمات وتصميمات جبارة للمجلة تتغير كل أسبوع تلقائياً.. مع إمكانية النشر الفوري بالمتجر والتحميل للطباعة!
            </p>
          </div>
        </div>

        {/* Master Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            {isPublished ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            <span>{isPublished ? "تم النشر في المتجر بنجاح!" : "اعتماد ونشر في المتجر للزبائن"}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-cyan-400" />}
            <span>{isDownloaded ? "جاري التنزيل..." : "تحميل PDF عالي الجودة"}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Theme Picker + Live Flyer A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Theme Selector & Quick Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>اختر قالب وثيم المجلة لهذا الأسبوع:</span>
            </span>

            {/* Theme Cards List */}
            <div className="space-y-2.5">
              {THEMES.map((th) => {
                const isSelected = selectedTheme === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => handleSelectTheme(th.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-gradient-to-r ${th.gradient} ${
                      isSelected
                        ? "ring-2 ring-cyan-400 shadow-lg scale-[1.01]"
                        : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full border ${isSelected ? "bg-cyan-400 border-white" : "border-slate-500"}`} />
                        <h4 className="text-xs sm:text-sm font-black text-white">
                          {th.name}
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-slate-200 border border-white/10">
                        {th.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed pr-5">
                      {th.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Header Customizations */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                تعديل نصوص المجلة السريعة:
              </span>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">عنوان المجلة الرئيسي:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">الشعار والوصف الفرعي:</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">اسم الأسبوع / المناسبة:</label>
                <input
                  type="text"
                  value={weekLabel}
                  onChange={(e) => setWeekLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Next Steps for Teacher Sameh */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">خطوات تسويق المجلة بضغطة زر:</span>
              
              <button
                onClick={onSendToFacebookStudio}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>📱</span>
                  <span>توليد منشور فيسبوك تلقائي لهذه العروض</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>

              <button
                onClick={onSendToReelsStudio}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  <span>توليد فيديو ريلز رأسي تلقائي للعروض</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Live Flyer A4 Canvas Preview */}
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

            {/* Flyer Simulation Container */}
            <div id="flyer-live-preview" className={`rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 ${previewStyle.bodyBg}`}>
              
              {/* Flyer Cover Banner */}
              <div className={`p-6 text-center shadow-lg relative overflow-hidden ${previewStyle.headerBg}`}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 relative bg-black shadow-md">
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
                    <span>ساري حتى السبت المقبل</span>
                  </div>
                </div>
              </div>

              {/* Products Grid in Magazine */}
              <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto">
                {currentFlyer.products.map((prod) => (
                  <div
                    key={prod.id}
                    className={`rounded-xl border p-2 flex flex-col justify-between transition-all ${previewStyle.cardBg}`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${previewStyle.badgeBg}`}>
                        -{prod.discountPercentage}%
                      </span>
                      <span className="text-[8px] font-bold text-slate-400">
                        جملة الجملة
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-24 rounded-lg overflow-hidden bg-slate-800 mb-2">
                      <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                    </div>

                    {/* Info & Price */}
                    <div>
                      <h5 className="text-[11px] font-bold text-white truncate">
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
                <p>فرع زفتى: شارع الجيش - بجوار الوحدة الزراعية | الأسعار شاملة ضريبة القيمة المضافة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
