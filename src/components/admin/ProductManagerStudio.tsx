"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Check, 
  Flame, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Building2,
  ExternalLink,
  Store
} from "lucide-react";
import { ProductItem, ProductCategory, BranchInfo } from "@/types/boraey";
import { enhanceImageBase64 } from "@/lib/imageDownloader";

interface ProductManagerStudioProps {
  products: ProductItem[];
  branches: BranchInfo[];
  onUpdateProducts: (products: ProductItem[]) => void;
  onAddToFlyer?: (product: ProductItem) => void;
}

const CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: "all", label: "جميع الأقسام", icon: "🛒" },
  { id: "grocery", label: "بقالة وسلع", icon: "🌾" },
  { id: "dairy", label: "ألبان وأجبان", icon: "🧀" },
  { id: "frozen", label: "مجمدات ولحوم", icon: "🥩" },
  { id: "spices_oils", label: "زيوت وعطارة", icon: "🫒" },
  { id: "cleaning", label: "منظفات", icon: "🧼" },
  { id: "beverages", label: "مشروبات", icon: "🧃" },
  { id: "produce", label: "خضار وفواكه", icon: "🍎" },
];

export function ProductManagerStudio({
  products,
  branches,
  onUpdateProducts,
  onAddToFlyer,
}: ProductManagerStudioProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("all");
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("grocery");
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [unit, setUnit] = useState("قطعة");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isHotOffer, setIsHotOffer] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["branch-1", "branch-2"]);
  const [addToCurrentFlyer, setAddToCurrentFlyer] = useState(false);

  // Upload & Enhance state
  const [isUploading, setIsUploading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategory("grocery");
    setOriginalPrice(0);
    setOfferPrice(0);
    setUnit("قطعة");
    setImage("https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80");
    setDescription("");
    setInStock(true);
    setIsHotOffer(false);
    setSelectedBranches(["branch-1", "branch-2"]);
    setAddToCurrentFlyer(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setOriginalPrice(prod.originalPrice);
    setOfferPrice(prod.offerPrice);
    setUnit(prod.unit);
    setImage(prod.image);
    setDescription(prod.description || "");
    setInStock(prod.inStock);
    setIsHotOffer(!!prod.isHotOffer);
    setSelectedBranches(prod.branchIds || ["branch-1", "branch-2"]);
    setAddToCurrentFlyer(false);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage("جاري رفع الصورة إلى سيرفر الصور...");

    try {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const base64Data = uploadEvent.target?.result as string;
        
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageBase64: base64Data,
              name: file.name.replace(/\.[^/.]+$/, ""),
            }),
          });
          const data = await res.json();
          if (data.url) {
            setImage(data.url);
            setStatusMessage("✅ تم رفع الصورة بنجاح!");
          } else {
            // fallback to client base64 preview
            setImage(base64Data);
            setStatusMessage("✅ تم تحميل الصورة محلياً بنجاح!");
          }
        } catch {
          setImage(base64Data);
          setStatusMessage("✅ تم اعتماد الصورة بنجاح");
        } finally {
          setIsUploading(false);
          setTimeout(() => setStatusMessage(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      setStatusMessage("حدث خطأ أثناء قراءة الملف");
    }
  };

  const handleEnhanceImage = async () => {
    if (!image) return;
    setIsEnhancing(true);
    setStatusMessage("جاري تحسين تباين وإشراق الصورة بالذكاء الاصطناعي...");

    try {
      const enhanced = await enhanceImageBase64(image);
      setImage(enhanced);
      setStatusMessage("✨ تم تحسين ألوان وإشراق الصورة بنجاح!");
    } catch {
      setStatusMessage("تعذر تحسين الصورة تلقائياً، يمكنك استخدام الصورة الحالية");
    } finally {
      setIsEnhancing(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || offerPrice <= 0) {
      alert("برجاء إدخال اسم الصنف وسعر العرض بشكل صحيح");
      return;
    }

    const calculatedDiscount = originalPrice > offerPrice 
      ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100) 
      : 0;

    if (editingProduct) {
      // Edit existing
      const updatedProducts = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name,
            category,
            originalPrice: originalPrice > 0 ? originalPrice : offerPrice,
            offerPrice,
            discountPercentage: calculatedDiscount,
            unit,
            image,
            description,
            inStock,
            isHotOffer,
            branchIds: selectedBranches,
          };
        }
        return p;
      });
      onUpdateProducts(updatedProducts);
    } else {
      // Add new
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        name,
        category,
        originalPrice: originalPrice > 0 ? originalPrice : offerPrice,
        offerPrice,
        discountPercentage: calculatedDiscount,
        unit,
        image,
        description,
        inStock,
        isHotOffer,
        branchIds: selectedBranches,
      };
      onUpdateProducts([newProd, ...products]);

      if (addToCurrentFlyer && onAddToFlyer) {
        onAddToFlyer(newProd);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string, prodName: string) => {
    if (confirm(`هل أنت متأكد من حذف المنتج: (${prodName})؟`)) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleToggleStock = (id: string) => {
    onUpdateProducts(
      products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleToggleHot = (id: string) => {
    onUpdateProducts(
      products.map((p) => (p.id === id ? { ...p, isHotOffer: !p.isHotOffer } : p))
    );
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesBranch = selectedBranchFilter === "all" || (p.branchIds && p.branchIds.includes(selectedBranchFilter));
    return matchesSearch && matchesCategory && matchesBranch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Quick Action */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              إدارة المنتجات والمخزون بفرعي زفتى
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتعديل أصناف الهايبر، التحكم في أسعار جملة الجملة، تخصيص الأصناف لكل فرع، ورفع صور المنتجات الحقيقية.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة منتج جديد للهايبر</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو الوصف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400"
            >
              <option value="all">كافة الفروع (الجيش + سعد زغلول)</option>
              <option value="branch-1">فرع شارع الجيش (الرئيسي)</option>
              <option value="branch-2">فرع شارع سعد زغلول</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Count and Grid */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>عرض {filteredProducts.length} من إجمالي {products.length} صنف</span>
        <span>الأسعار قطاعي بسعر جملة الجملة 💙</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const discount = product.originalPrice > product.offerPrice
            ? Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className={`rounded-2xl border p-4 bg-slate-900/90 transition-all flex flex-col justify-between ${
                product.inStock ? "border-slate-800" : "border-rose-900/40 opacity-70"
              }`}
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {product.isHotOffer && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        <Flame className="w-3 h-3 fill-amber-300" />
                        <span>سوبر عرض</span>
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                        خصم {discount}%
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    product.inStock 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {product.inStock ? "متوفر" : "نفد من المخزن"}
                  </span>
                </div>

                {/* Product Image & Info */}
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <Image
                      src={product.image || "/boraey-logo.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      الوحدة: {product.unit}
                    </p>

                    {/* Price Tag */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-base font-black text-cyan-400 font-mono">
                        {product.offerPrice} ج.م
                      </span>
                      {product.originalPrice > product.offerPrice && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          {product.originalPrice} ج.م
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Branch availability indicator */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>الفروع المتوفر بها:</span>
                  <div className="flex items-center gap-1 font-bold">
                    {(!product.branchIds || product.branchIds.length === 2) ? (
                      <span className="text-blue-300">الفرعين معاً</span>
                    ) : product.branchIds.includes("branch-1") ? (
                      <span className="text-cyan-300">شارع الجيش</span>
                    ) : (
                      <span className="text-amber-300">سعد زغلول</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleToggleStock(product.id)}
                  title={product.inStock ? "تحويل إلى غير متوفر" : "تحويل إلى متوفر"}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                    product.inStock 
                      ? "bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-400" 
                      : "bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60"
                  }`}
                >
                  {product.inStock ? "إيقاف" : "تفعيل"}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleHot(product.id)}
                  title="تبديل شارة العرض الساخن"
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                    product.isHotOffer
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  نار 🔥
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(product)}
                  className="py-1.5 rounded-lg text-[10px] font-bold bg-cyan-950/30 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/50 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>تعديل</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  className="py-1.5 rounded-lg text-[10px] font-bold bg-rose-950/30 text-rose-300 border border-rose-900/40 hover:bg-rose-900/50 transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black">
                  {editingProduct ? `تعديل صنف: ${editingProduct.name}` : "إضافة صنف جديد للهايبر"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                إغلاق ✕
              </button>
            </div>

            {/* Status Alert */}
            {statusMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Product Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  اسم الصنف والعلامة التجارية: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: زيت عافية ذرة نقي 1.6 لتر"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    القسم / التصنيف:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    الوحدة أو حجم العبوة:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: زجاجة 1.6 لتر / شيكارة 5 كجم"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    السعر الأصلي (قبل الخصم):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="مثال: 175"
                    value={originalPrice || ""}
                    onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    سعر العرض عند البرعي (جملة الجملة): *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="مثال: 139"
                    value={offerPrice || ""}
                    onChange={(e) => setOfferPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 font-bold placeholder-slate-600 focus:outline-hidden focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  صورة المنتج الحقيقية:
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                    <Image
                      src={image || "/boraey-logo.jpg"}
                      alt="معاينة"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* File upload input */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <span>{isUploading ? "جاري الرفع..." : "اختر صورة من جهازك"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>

                      {/* AI Enhance button */}
                      <button
                        type="button"
                        onClick={handleEnhanceImage}
                        disabled={!image || isEnhancing}
                        className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>{isEnhancing ? "جاري التحسين..." : "تحسين الفلاتر ✨"}</span>
                      </button>
                    </div>

                    {/* Or Image URL */}
                    <input
                      type="url"
                      placeholder="أو ضع رابط مباشر للصورة هنا..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Branches availability */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  الفروع المتوفر بها هذا الصنف:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-cyan-500/40 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedBranches.includes("branch-1")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBranches([...selectedBranches, "branch-1"]);
                        } else {
                          setSelectedBranches(selectedBranches.filter(b => b !== "branch-1"));
                        }
                      }}
                      className="rounded accent-cyan-500 w-4 h-4"
                    />
                    <span>فرع شارع الجيش (الرئيسي)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-cyan-500/40 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedBranches.includes("branch-2")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBranches([...selectedBranches, "branch-2"]);
                        } else {
                          setSelectedBranches(selectedBranches.filter(b => b !== "branch-2"));
                        }
                      }}
                      className="rounded accent-cyan-500 w-4 h-4"
                    />
                    <span>فرع شارع سعد زغلول</span>
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <span>متوفر بالمخزن وجاهز للطلب</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isHotOffer}
                    onChange={(e) => setIsHotOffer(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span>تمييز كعرض ناري 🔥</span>
                </label>
              </div>

              {!editingProduct && (
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-purple-300 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={addToCurrentFlyer}
                    onChange={(e) => setAddToCurrentFlyer(e.target.checked)}
                    className="rounded accent-purple-500 w-4 h-4"
                  />
                  <span>إضافة الصنف تلقائياً إلى مجلة عروض الأسبوع الحالية</span>
                </label>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  وصف الصنف أو تفاصيل العرض:
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: زيت ذرة نقي عالي الجودة للطهي الصحي بسعر جملة الجملة"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer text-center"
                >
                  {editingProduct ? "حفظ التعديلات" : "إضافة الصنف للمتجر"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
