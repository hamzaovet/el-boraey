"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  Download, 
  Share2, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Flame, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Printer,
  BadgePercent
} from "lucide-react";
import { OfferFlyer, ProductItem } from "@/types/boraey";

interface DigitalFlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  flyer: OfferFlyer;
  onAddToCart: (product: ProductItem) => void;
}

export function DigitalFlyerModal({
  isOpen,
  onClose,
  flyer,
  onAddToCart,
}: DigitalFlyerModalProps) {
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (product: ProductItem) => {
    onAddToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1800);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  // Theme styling variants
  const getThemeStyles = () => {
    switch (flyer.theme) {
      case "dynamite":
        return {
          wrapper: "bg-gradient-to-b from-red-950 via-slate-950 to-amber-950 border-red-600/40",
          header: "from-red-600 via-amber-500 to-red-700 text-white",
          card: "bg-slate-900/90 border-red-500/30 hover:border-amber-400",
          badge: "bg-red-600 text-yellow-200 border-yellow-300",
          priceTag: "bg-amber-400 text-slate-950",
        };
      case "fresh":
        return {
          wrapper: "bg-gradient-to-b from-teal-950 via-slate-950 to-emerald-950 border-teal-600/40",
          header: "from-emerald-600 via-teal-500 to-cyan-700 text-white",
          card: "bg-slate-900/90 border-emerald-500/30 hover:border-teal-300",
          badge: "bg-emerald-600 text-white border-emerald-400",
          priceTag: "bg-emerald-400 text-slate-950",
        };
      case "festive":
        return {
          wrapper: "bg-gradient-to-b from-purple-950 via-slate-950 to-amber-950 border-amber-600/40",
          header: "from-amber-600 via-purple-700 to-amber-700 text-amber-100",
          card: "bg-slate-900/90 border-amber-500/30 hover:border-amber-300",
          badge: "bg-amber-500 text-purple-950 border-amber-300",
          priceTag: "bg-amber-400 text-slate-950",
        };
      case "metallic":
      default:
        return {
          wrapper: "bg-gradient-to-b from-slate-950 via-zinc-900 to-black border-slate-700",
          header: "from-slate-800 via-zinc-700 to-slate-900 text-white border-b border-cyan-500/30",
          card: "bg-zinc-900/90 border-slate-700/80 hover:border-cyan-400 shadow-xl",
          badge: "bg-cyan-500 text-slate-950 border-cyan-300",
          priceTag: "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950",
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${themeStyle.wrapper}`}>
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-black/60 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold text-cyan-300">النسخة التفاعلية الرقمية لمجلة العروض</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all cursor-pointer"
            >
              {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{downloadSuccess ? "تم التحميل بنجاح!" : "تحميل PDF عالي الجودة"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all cursor-pointer"
            >
              {shareSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
              <span>{shareSuccess ? "تم نسخ الرابط!" : "مشاركة المجلة"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition-all cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Magazine Cover & Header Banner */}
        <div className={`relative px-6 py-8 text-center bg-gradient-to-r ${themeStyle.header} shadow-lg overflow-hidden`}>
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/50 shadow-md relative bg-black">
                <Image src="/boraey-logo.jpg" alt="البرعي" fill className="object-cover" />
              </div>
              <div className="text-right">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                  {flyer.title}
                </h2>
                <p className="text-xs sm:text-sm font-semibold opacity-90">
                  {flyer.subtitle}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-xs font-bold mt-2">
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-amber-300" />
                <span>{flyer.weekLabel}</span>
              </span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-cyan-300" />
                <span>من {flyer.startDate} حتى {flyer.endDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid inside Magazine */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          <div className="text-center">
            <span className="text-xs text-slate-400 font-medium">
              💡 اضغط على زر <strong className="text-cyan-400">«أضف للسلة»</strong> عند أي منتج لحجزه فوراً في طلبك!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flyer.products.map((prod) => {
              const isAdded = addedIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className={`group relative rounded-2xl border p-3 flex flex-col justify-between transition-all duration-300 ${themeStyle.card}`}
                >
                  {/* Discount Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black tracking-wide border shadow-md flex items-center gap-0.5 ${themeStyle.badge}`}>
                      <span>خصم {prod.discountPercentage}%</span>
                    </span>
                  </div>

                  {/* Hot Offer Star */}
                  {prod.isHotOffer && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                        عرض ناري 🔥
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-800/80 mb-3 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {prod.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {prod.unit}
                      </span>
                    </div>

                    {/* Price Block */}
                    <div className="pt-2 border-t border-slate-800 mt-2">
                      <div className="flex items-baseline justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 line-through">
                            {prod.originalPrice} ج.م
                          </span>
                          <span className="text-base sm:text-lg font-black text-cyan-400 font-mono">
                            {prod.offerPrice} <span className="text-[10px] font-sans font-bold">ج.م</span>
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                          جملة الجملة ⚡
                        </span>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => handleAdd(prod)}
                        className={`w-full mt-2.5 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>تمت الإضافة للسلة!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>أضف للسلة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 text-center text-xs text-slate-400">
            <p>{flyer.footerNote}</p>
            <p className="text-[10px] text-slate-500 mt-1">
              هايبر ماركت البرعي - زفتى شارع الجيش - خدمة العملاء: 01023456789
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
