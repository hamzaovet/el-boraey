"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Scan, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Wand2, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Flame, 
  Check, 
  RefreshCw,
  Eye,
  Bot
} from "lucide-react";
import { HandwrittenSample, ProductItem, ProductCategory } from "@/types/boraey";
import { HANDWRITTEN_SAMPLE } from "@/data/boraeyMockData";

interface HandwritingOcrStudioProps {
  onGenerateFlyerFromOcr: (products: ProductItem[]) => void;
}

export function HandwritingOcrStudio({ onGenerateFlyerFromOcr }: HandwritingOcrStudioProps) {
  const [sample, setSample] = useState<HandwrittenSample>(HANDWRITTEN_SAMPLE);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState<string>("");
  const [scannedProducts, setScannedProducts] = useState<ProductItem[]>(
    sample.detectedProducts.map((p, idx) => ({ ...p, id: `ocr-${idx + 1}` }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(true);

  const startAiScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanStage("تحسين جودة صورة الورقة ومعالجة التباين البصري...");

    setTimeout(() => {
      setScanProgress(35);
      setScanStage("فحص خط الإيد والتعرف على الكلمات العربية والأرقام...");
    }, 900);

    setTimeout(() => {
      setScanProgress(70);
      setScanStage("استخراج أسعار السلع، نسب الخصومات، وكلمات العروض...");
    }, 1800);

    setTimeout(() => {
      setScanProgress(95);
      setScanStage("مطابقة الأصناف مع أقسام هايبر ماركت البرعي وربط الصور...");
    }, 2600);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setHasScanned(true);
      setScannedProducts(
        sample.detectedProducts.map((p, idx) => ({ ...p, id: `ocr-${Date.now()}-${idx}` }))
      );
    }, 3200);
  };

  const handleUpdateProduct = (id: string, field: keyof ProductItem, value: any) => {
    setScannedProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "originalPrice" || field === "offerPrice") {
            const orig = field === "originalPrice" ? Number(value) : item.originalPrice;
            const off = field === "offerPrice" ? Number(value) : item.offerPrice;
            if (orig > 0) {
              updated.discountPercentage = Math.round(((orig - off) / orig) * 100);
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleDeleteProduct = (id: string) => {
    setScannedProducts((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddNewItem = () => {
    const newItem: ProductItem = {
      id: `ocr-${Date.now()}`,
      name: "صنف جديد من المعلم سامح",
      category: "grocery",
      originalPrice: 100,
      offerPrice: 79,
      discountPercentage: 21,
      unit: "عبوة 1 كجم",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
      inStock: true,
      isHotOffer: true,
      description: "عرض إضافي بسعر جملة الجملة",
    };
    setScannedProducts([...scannedProducts, newItem]);
    setEditingId(newItem.id);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950 border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                فاحص ورقة خط الإيد بالذكاء الاصطناعي (AI Handwriting Scanner)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                راحة تامة للمعلم سامح ☕
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              المعلم سامح مبيحبش يكتب على الكومبيوتر.. اكتب عروض الأسبوع في ورقة أو كشكول وصورها، والسيستم هيقرأ الخط والأسعار ويجهز جدول المجلة في ثواني!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={startAiScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري مسح الورقة بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>مسح الورقة النموذجية للمعلم سامح</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split: Note Preview + Extracted Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): The Handwritten Note & OCR Scanner */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>ورقة العروض المكتوبة بخط اليد</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                صورة ملتقطة بالموبايل 📸
              </span>
            </div>

            {/* Note Canvas Container with Scanning Animation */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-amber-50 p-4 font-mono text-slate-800 shadow-inner min-h-[300px] flex flex-col justify-between">
              
              {/* Laser Line Scanning Effect when active */}
              {isScanning && (
                <div className="absolute inset-0 bg-purple-600/10 z-20 pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400 animate-pulse" 
                       style={{ 
                         position: 'absolute', 
                         top: `${scanProgress}%`, 
                         transition: 'top 0.4s ease-out' 
                       }} 
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 text-cyan-300 p-3 rounded-xl border border-cyan-500/40 text-xs font-sans text-center shadow-xl">
                    <p className="font-bold">{scanStage}</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Note Content representation */}
              <div className="space-y-2 text-xs leading-relaxed font-bold text-slate-900 select-none">
                <div className="border-b-2 border-red-400/60 pb-1.5 flex items-center justify-between text-red-900">
                  <span>ورقة المعلم سامح - عروض الهايبر الجديدة:</span>
                  <span className="text-[10px]">الأسبوع الحالي</span>
                </div>
                <div className="space-y-1.5 text-blue-950 pt-1">
                  <p>1) زيت عافية ذرة 1.6 لتر: كان 175 نخليه 139 ج (عرض حارق)</p>
                  <p>2) أرز الضحى 5 كيلو: كان 210 خليه 168 ج</p>
                  <p>3) سكر كريستال 1 ك: كان 42 خليه 32.5 ج</p>
                  <p>4) تونة صن شاين قطع 3 علب: كانت 195 نخليها 149 ج</p>
                  <p>5) كوكي بانيه كرانشي 1 كجم: كان 240 خليه 189 ج</p>
                  <p>6) جبنة دومتي فيتا 500 جم: كانت 48 خليها 36 ج</p>
                  <p>7) مسحوق أريال لافندر 4ك + 1ك هدية: كان 360 خليه 279 ج</p>
                  <p>8) شاي العروسة 250 جم: كان 62 خليه 49 ج</p>
                </div>
                <div className="pt-2 border-t border-red-300/80 text-[11px] text-red-700 italic">
                  💡 ملحوظة: شعارنا "قطاعي بسعر جملة الجملة" يتحط في أول الصفحة بالبنط العريض!
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>دقة استخراج الخط: 99.4% (Vision AI)</span>
                </span>
                <span>8 منتجات مستخرجة</span>
              </div>
            </div>

            {/* Note upload actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={startAiScan}
                disabled={isScanning}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>رفع صورة ورقة جديدة</span>
              </button>

              <button
                onClick={startAiScan}
                disabled={isScanning}
                className="py-2.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-xs font-bold text-purple-300 border border-purple-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>إعادة معالجة OCR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Extracted Products Table & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>جدول المنتجات المستخرج آلياً ({scannedProducts.length} أصناف)</span>
                </h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  تم استخراج وتصنيف كافة الأسعار والخصومات.. يمكنك مراجعة وتعديل أي سعر قبل توليد المجلة
                </span>
              </div>

              <button
                onClick={handleAddNewItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة صنف يدوي</span>
              </button>
            </div>

            {/* Editable Products Table */}
            <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2.5">
              {scannedProducts.map((prod) => {
                const isEditing = editingId === prod.id;
                return (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Product Basic Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <input
                            type="text"
                            value={prod.name}
                            onChange={(e) => handleUpdateProduct(prod.id, "name", e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-hidden focus:border-cyan-400"
                          />
                        ) : (
                          <h4 className="text-xs font-bold text-white truncate">
                            {prod.name}
                          </h4>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {prod.unit}
                        </span>
                      </div>
                    </div>

                    {/* Pricing Inputs */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        {/* Original Price */}
                        <div className="text-center">
                          <span className="text-[9px] text-slate-500 block">قبل</span>
                          {isEditing ? (
                            <input
                              type="number"
                              value={prod.originalPrice}
                              onChange={(e) => handleUpdateProduct(prod.id, "originalPrice", Number(e.target.value))}
                              className="w-16 px-1.5 py-1 text-center rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
                            />
                          ) : (
                            <span className="text-xs text-slate-400 line-through font-mono">
                              {prod.originalPrice} ج
                            </span>
                          )}
                        </div>

                        {/* Offer Price */}
                        <div className="text-center">
                          <span className="text-[9px] text-cyan-400 font-bold block">سعر العرض</span>
                          {isEditing ? (
                            <input
                              type="number"
                              value={prod.offerPrice}
                              onChange={(e) => handleUpdateProduct(prod.id, "offerPrice", Number(e.target.value))}
                              className="w-16 px-1.5 py-1 text-center rounded bg-slate-900 border border-cyan-400 text-xs font-mono font-bold text-cyan-400"
                            />
                          ) : (
                            <span className="text-xs font-black text-cyan-400 font-mono">
                              {prod.offerPrice} ج
                            </span>
                          )}
                        </div>

                        {/* Discount Badge */}
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                          -{prod.discountPercentage}%
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingId(isEditing ? null : prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title={isEditing ? "حفظ" : "تعديل"}
                        >
                          {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Generate Master Button */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>جاهز للخطوة التالية: توليد مجلة العروض بتصاميم متعددة مبهرة</span>
              </div>

              <button
                onClick={() => onGenerateFlyerFromOcr(scannedProducts)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-slate-950" />
                <span>توليد تصميمات المجلة الآن (AI Multi-Theme) 🚀</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
