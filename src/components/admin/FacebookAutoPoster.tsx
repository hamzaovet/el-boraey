"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Share2, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Download, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  Flame, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  Smile,
  Layers,
  Eye,
  Settings,
  X,
  AlertCircle,
  Plus
} from "lucide-react";
import { SocialMediaPost, ProductItem } from "@/types/boraey";
import { INITIAL_POSTS } from "@/data/boraeyMockData";
import { downloadElementAsImage } from "@/lib/imageDownloader";

interface FacebookAutoPosterProps {
  products: ProductItem[];
  onOpenStorefront: () => void;
}

export function FacebookAutoPoster({ products, onOpenStorefront }: FacebookAutoPosterProps) {
  const [posts, setPosts] = useState<SocialMediaPost[]>(INITIAL_POSTS);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);
  const [isImageDownloaded, setIsImageDownloaded] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'energetic' | 'friendly' | 'weekend'>('energetic');

  // Dynamic Selected Products for the Graphic (1 to 6 items)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products.slice(0, 4).map(p => p.id)
  );

  // Mascot Mode & Graphic Style
  const [isMascotMode, setIsMascotMode] = useState(true);
  const [graphicTheme, setGraphicTheme] = useState<'mascot' | 'dynamite' | 'metallic'>('mascot');

  // Pre-Publish Preview Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Meta Graph API settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pageId, setPageId] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");

  const currentPost = posts[activePostIndex];

  // Active products featured in graphic
  const featuredProducts = products.filter(p => selectedProductIds.includes(p.id));

  const toggleProductSelection = (id: string) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length === 1) {
        alert("يجب اختيار صنف واحد على الأقل ليظهر في تصميم البوست!");
        return;
      }
      setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
    } else {
      if (selectedProductIds.length >= 6) {
        alert("الحد الأقصى للأصناف في تصميم البوست الواحد هو 6 أصناف لضمان وضوح التصميم");
        return;
      }
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentPost.content);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error("Clipboard error:", e);
    }
  };

  const handleDownloadImage = async () => {
    setIsImageDownloaded(true);
    await downloadElementAsImage("facebook-post-graphic", "elboraey-facebook-post.png");
    setTimeout(() => setIsImageDownloaded(false), 2500);
  };

  // Real publishing handler
  const handlePublishNow = async () => {
    setIsPublishing(true);

    try {
      // 1. Download the high-res graphic image to the user's downloads
      await downloadElementAsImage("facebook-post-graphic", "elboraey-facebook-post.png");

      // 2. Copy the caption text to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentPost.content);
      }

      // 3. Call server route
      const res = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: pageId.trim() || undefined,
          pageAccessToken: pageAccessToken.trim() || undefined,
          caption: currentPost.content,
        }),
      });

      const data = await res.json();
      setIsPublishing(false);

      if (data.isLiveGraphApi && data.postUrl) {
        setPublishSuccessMessage(`✅ تم النشر الحقيقي على صفحة الفيسبوك بنجاح! رقم البوست: ${data.postId}`);
        window.open(data.postUrl, "_blank");
      } else {
        // Open Facebook Composer with downloaded image ready
        setPublishSuccessMessage("✅ تم نسخ البوست وتنزيل صورة التصميم لجهازك! جاري فتح فيسبوك للنشر الفوري...");
        setTimeout(() => {
          window.open("https://www.facebook.com/", "_blank");
        }, 800);
      }

      setPosts((prev) =>
        prev.map((p, idx) => (idx === activePostIndex ? { ...p, status: "published" } : p))
      );
      setTimeout(() => setPublishSuccessMessage(null), 5000);
    } catch (err: any) {
      setIsPublishing(false);
      alert("حدث خطأ أثناء محاولة النشر: " + err.message);
    }
  };

  // AI Content Generator with Gemini
  const handleRegeneratePost = async (tone: 'energetic' | 'friendly' | 'weekend') => {
    setSelectedTone(tone);
    setIsAiGenerating(true);

    try {
      const res = await fetch("/api/ai/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5),
          tone,
          isMascotMode,
        }),
      });

      const data = await res.json();
      if (data.postContent) {
        const updatedPost: SocialMediaPost = {
          ...currentPost,
          tone,
          content: data.postContent,
          status: "ready",
        };

        setPosts((prev) =>
          prev.map((p, idx) => (idx === activePostIndex ? updatedPost : p))
        );
        setIsAiGenerating(false);
        return;
      }
    } catch (err) {
      console.warn("AI generation fallback:", err);
    }

    // Dynamic Fallback
    setIsAiGenerating(false);
    const prodLines = featuredProducts
      .map((p) => `✨ ${p.name}: بسعر ${p.offerPrice} بدل ${p.originalPrice} جنيه!`)
      .join("\n");

    let mascotDialog = "";
    if (isMascotMode) {
      mascotDialog = `\n🗣️ المنتجات في الهايبر بتتكلم وبتقولك:\n` +
        featuredProducts
          .map((p) => `💬 ${p.name.split(" ")[0]}: "${p.mascotQuote || "قطاعي بسعر جملة الجملة!"}"`)
          .join("\n") + "\n";
    }

    let newContent = "";
    let newTitle = "";

    if (tone === "energetic") {
      newTitle = "منشور ضرب نار: أسعار جملة الجملة تزلزل السوق 🔥";
      newContent = `تحذير لكل تجار الغلاء في الغربية.. المعلم سامح ولعها تخفيضات في هايبر البرعي! 🔥💣
الأسعار قطاعي بسعر جملة الجملة عشان مفيش بيت في زفتى يحمل هم طلبات الأسبوع 💙
${mascotDialog}
شوفوا العروض اللي بتهز السوق دي:
${prodLines}

تصفحوا مجلة العروض واطلبوا أونلاين بضغطة زر من موقعنا:
🌐 https://boraey-market.com
📍 فروعنا في زفتى بشارع الجيش:
1- فرع شارع الجيش - بجوار الوحدة الزراعية
2- فرع شارع الجيش - أمام جامع الشحري
خدمة العملاء والطلبات واتساب: 01023456789`;
    } else if (tone === "friendly") {
      newTitle = "منشور عائلي هادئ: ميزانية بيتك في أمان مع البرعي 💙";
      newContent = `كل أول شهر وست الكل بتفكر في ميزانية البيت وطلبات المطبخ؟ 🤔
في هايبر ماركت البرعي بنقولك ارتاحي خالص.. أسعارنا قطاعي بسعر جملة الجملة عشان توفري وتملي بيتك بالخير والبركة 💙
${mascotDialog}
وفري في أهم السلع الأساسية للأسبوع:
${prodLines}

ادخلي شوفي مجلة العروض واطلبي من مكانك:
🌐 https://boraey-market.com
📍 متواجدين لخدمتكم في فرعين بزفتى:
1- فرع شارع الجيش - بجوار الوحدة الزراعية
2- فرع شارع الجيش - أمام جامع الشحري`;
    } else {
      newTitle = "منشور عروض الويك إند السريعة: خميس وجمعة توفير ⚡";
      newContent = `عروض الويك إند ولعت في هايبر البرعي! ⚡
خروجة التوفير للأسرة كلها في زفتى.. جهزنا لكم أقوى عروض نهاية الأسبوع:
${mascotDialog}
${prodLines}

الحقوا العروض قبل نفاد الكميات المتاحة في فروعنا:
🌐 https://boraey-market.com
📍 فرعا شارع الجيش بزفتى: بجوار الوحدة الزراعية & أمام جامع الشحري`;
    }

    const updatedPost: SocialMediaPost = {
      ...currentPost,
      title: newTitle,
      tone,
      content: newContent,
      status: "ready",
    };

    setPosts((prev) =>
      prev.map((p, idx) => (idx === activePostIndex ? updatedPost : p))
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {publishSuccessMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-emerald-500 text-white text-xs font-bold shadow-2xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{publishSuccessMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-950 border border-blue-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                استوديو فيسبوك التلقائي وصناعة المحتوى الذكي (AI Auto-Poster)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                صفحة البرعي (92,000 متابع) 🚀
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              اختر الأصناف التي ستظهر في البوست ديناميكياً، وفعل وضع كارتون المنتجات المتكلمة، وعاين البوست قبل نشره الحقيقي!
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            title="إعدادات فيسبوك API"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">إعدادات النشر</span>
          </button>

          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 font-bold text-xs transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>معاينة قبل النشر 👁️</span>
          </button>
        </div>
      </div>

      {/* Optional Meta Graph API Settings Box */}
      {isSettingsOpen && (
        <div className="p-4 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>إعدادات الربط المباشر مع فيسبوك (Meta Graph API - اختياري):</span>
            </h4>
            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ إغلاق</button>
          </div>
          <p className="text-[11px] text-slate-400">
            إذا كان لديك Facebook Page ID و Page Access Token، أدخلهما هنا ليتم النشر المباشر الحقيقي بالـ API. وإذا تركتهما فارغين، سيقوم السيستم بنسخ النص وتنزيل التصميم وفتح فيسبوك فوراً بنقرة واحدة!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">معرف الصفحة (Page ID):</label>
              <input
                type="text"
                placeholder="مثال: 109283746592817"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-hidden focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">رمز الوصول (Page Access Token):</label>
              <input
                type="password"
                placeholder="EAA..."
                value={pageAccessToken}
                onChange={(e) => setPageAccessToken(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-hidden focus:border-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Split: Left Controls & Right Feed Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 Cols): Product Selection, Mascot Toggle, Copywriting */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Dynamic Product Selector */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>1. الأصناف المعروضة في تصميم البوست ({featuredProducts.length} من 6):</span>
              </h3>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                اضغط لاختيار الصنف
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {products.map((prod) => {
                const isSelected = selectedProductIds.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => toggleProductSelection(prod.id)}
                    className={`p-2 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                        : "bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                      <Image
                        src={(isMascotMode && prod.mascotImage) ? prod.mascotImage : prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold block truncate">{prod.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{prod.offerPrice} ج</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Talking Mascots Mode & Graphic Style */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-xs font-black text-white">2. وضع كارتون المنتجات المتكلمة 🎭</h3>
                  <p className="text-[10px] text-purple-300">ظهور شخصيات كارتونية مضحكة للمنتجات ببالونات كلام!</p>
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

            {/* Graphic Themes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 block">شكل وهوية تصميم صورة البوست:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setGraphicTheme('mascot')}
                  className={`py-2 px-1 rounded-xl font-bold border transition-all text-[11px] ${
                    graphicTheme === 'mascot'
                      ? "bg-purple-600/30 text-purple-300 border-purple-400 shadow-md"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  كارتوني فكاهي 🎭
                </button>

                <button
                  type="button"
                  onClick={() => setGraphicTheme('dynamite')}
                  className={`py-2 px-1 rounded-xl font-bold border transition-all text-[11px] ${
                    graphicTheme === 'dynamite'
                      ? "bg-red-600/30 text-amber-300 border-red-500 shadow-md"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  ديناميت ناري 🔥
                </button>

                <button
                  type="button"
                  onClick={() => setGraphicTheme('metallic')}
                  className={`py-2 px-1 rounded-xl font-bold border transition-all text-[11px] ${
                    graphicTheme === 'metallic'
                      ? "bg-cyan-600/30 text-cyan-300 border-cyan-400 shadow-md"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  ميتاليك فخم ⭐
                </button>
              </div>
            </div>
          </div>

          {/* 3. Tone of Voice & AI Copywriting */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>3. نبرة وصياغة البوست بالذكاء الاصطناعي:</span>
              </h3>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Gemini AI 🤖
              </span>
            </div>

            {/* Tone Selector Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRegeneratePost('energetic')}
                disabled={isAiGenerating}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  selectedTone === 'energetic'
                    ? "bg-amber-500/20 text-amber-300 border-amber-400 shadow-md"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                حماسي وناري 🔥
              </button>

              <button
                type="button"
                onClick={() => handleRegeneratePost('friendly')}
                disabled={isAiGenerating}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  selectedTone === 'friendly'
                    ? "bg-blue-500/20 text-cyan-300 border-cyan-400 shadow-md"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                عائلي وتوفير 💙
              </button>

              <button
                type="button"
                onClick={() => handleRegeneratePost('weekend')}
                disabled={isAiGenerating}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  selectedTone === 'weekend'
                    ? "bg-rose-500/20 text-rose-300 border-rose-400 shadow-md"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                ويك إند سريع ⚡
              </button>
            </div>

            {isAiGenerating && (
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>جاري صياغة البوست الذكي بناءً على الأصناف المختارة...</span>
              </div>
            )}

            {/* Editable Content */}
            <div>
              <label className="text-slate-400 text-xs block mb-1">نص المنشور (قابل للتعديل المباشر):</label>
              <textarea
                rows={9}
                value={currentPost.content}
                onChange={(e) => {
                  const updated = { ...currentPost, content: e.target.value };
                  setPosts((prev) =>
                    prev.map((p, idx) => (idx === activePostIndex ? updated : p))
                  );
                }}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white leading-relaxed focus:outline-hidden focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                  <span>{isCopied ? "تم النسخ بنجاح!" : "نسخ نص المنشور"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isImageDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-amber-400" />}
                  <span>{isImageDownloaded ? "جاري التنزيل..." : "تحميل صورة البوست"}</span>
                </button>
              </div>

              {/* Master Publish Button */}
              <button
                type="button"
                onClick={handlePublishNow}
                disabled={isPublishing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري التجهيز والنشر الحقيقي...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>نشر المنشور فوراً على صفحة الفيسبوك 🚀</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Live Realistic Facebook Feed Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>محاكي صفحة فيسبوك الحقيقية (Facebook Feed Simulator)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="text-[10px] text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>تكبير المعاينة</span>
              </button>
            </div>

            {/* Facebook Card Container */}
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 sm:p-5 space-y-3 shadow-2xl">
              
              {/* FB Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 relative bg-black shrink-0">
                    <Image src="/boraey-logo.jpg" alt="البرعي" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-white">
                        هايبر ماركت البرعي
                      </h4>
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span>منذ دقيقة</span>
                      <span>·</span>
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>·</span>
                      <span className="text-cyan-400 font-medium">زفتى (شارع الجيش)</span>
                    </div>
                  </div>
                </div>

                <span className="text-slate-500 text-lg cursor-pointer">•••</span>
              </div>

              {/* FB Post Content Text */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pt-1">
                {currentPost.content}
              </div>

              {/* Dynamic Styled 1080x1080 Graphic Card Container */}
              <div
                id="facebook-post-graphic"
                className={`relative rounded-2xl overflow-hidden border transition-all p-5 text-white shadow-2xl mt-3 ${
                  graphicTheme === 'mascot'
                    ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-purple-500/40"
                    : graphicTheme === 'dynamite'
                    ? "bg-gradient-to-br from-red-950 via-slate-950 to-amber-950 border-red-500/50"
                    : "bg-gradient-to-br from-slate-950 via-zinc-900 to-black border-cyan-500/40"
                }`}
              >
                {/* Header in Graphic */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white/60 bg-black shrink-0">
                      <Image src="/boraey-logo.jpg" alt="البرعي" fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-white block">عروض جملة الجملة الأسبوعية</span>
                      <span className="text-[10px] text-cyan-300 font-bold">هايبر ماركت البرعي - زفتى</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full shadow-lg ${
                    graphicTheme === 'dynamite'
                      ? "bg-red-600 text-yellow-300 animate-pulse"
                      : "bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950"
                  }`}>
                    وفر حتى 35% 🔥
                  </span>
                </div>

                {/* Products Grid in Graphic (Dynamically features selected items!) */}
                <div className={`grid gap-3 py-4 ${
                  featuredProducts.length <= 2 ? "grid-cols-2" : featuredProducts.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                }`}>
                  {featuredProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        graphicTheme === 'mascot'
                          ? "bg-purple-950/40 border-purple-500/30"
                          : graphicTheme === 'dynamite'
                          ? "bg-red-950/40 border-red-500/30"
                          : "bg-slate-900/90 border-slate-800"
                      }`}
                    >
                      {/* Product Image OR Cartoon Mascot */}
                      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-900 mb-2 border border-white/10">
                        <Image
                          src={(isMascotMode && p.mascotImage) ? p.mascotImage : p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Mascot Speech Bubble */}
                      {isMascotMode && (
                        <div className="mb-2 p-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-[9px] font-bold text-amber-200 text-center leading-tight">
                          {p.mascotQuote || "💬 قطاعي بسعر جملة الجملة!"}
                        </div>
                      )}

                      {/* Details */}
                      <div>
                        <h6 className="text-[11px] font-black text-white truncate" title={p.name}>
                          {p.name}
                        </h6>
                        <div className="flex items-baseline justify-between pt-1 mt-1 border-t border-white/10">
                          <span className="text-[10px] text-slate-400 line-through">
                            {p.originalPrice} ج
                          </span>
                          <span className="text-sm font-black font-mono text-cyan-300">
                            {p.offerPrice} ج
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Callout in Graphic */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-cyan-300">🌐 boraey-market.com</span>
                  <span className="text-slate-300">فرعا زفتى بشارع الجيش 🏬</span>
                </div>
              </div>

              {/* FB Post Stats & Interaction Bar */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center">👍</span>
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center -mr-1">❤️</span>
                    <span className="mr-1">{currentPost.engagement.likes} تفاعل</span>
                  </span>
                  <span>{currentPost.engagement.comments} تعليق · {currentPost.engagement.shares} مشاركة</span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/60 text-slate-400 text-xs font-bold text-center">
                  <div className="py-1.5 rounded-lg hover:bg-slate-800/80 flex items-center justify-center gap-1.5 cursor-pointer text-blue-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span>أعجبني</span>
                  </div>
                  <div className="py-1.5 rounded-lg hover:bg-slate-800/80 flex items-center justify-center gap-1.5 cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    <span>تعليق</span>
                  </div>
                  <div className="py-1.5 rounded-lg hover:bg-slate-800/80 flex items-center justify-center gap-1.5 cursor-pointer">
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Publish Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-black">
                  معاينة المنشور الحقيقية قبل النشر على فيسبوك
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕ إغلاق
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 relative bg-black shrink-0">
                  <Image src="/boraey-logo.jpg" alt="البرعي" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1">
                    <span>هايبر ماركت البرعي</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">الآن · 🌐 للعامة</p>
                </div>
              </div>

              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {currentPost.content}
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-xs text-cyan-300 font-bold mb-2">معاينة التصميم الحقيقي (1080x1080):</p>
                <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden border border-slate-700">
                  <Image
                    src={(isMascotMode && featuredProducts[0]?.mascotImage) ? featuredProducts[0].mascotImage : "/boraey-logo.jpg"}
                    alt="تصميم البوست"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 text-center">
                    <div>
                      <span className="text-xs font-black text-amber-300 block mb-1">
                        سيتم تنزيل التصميم الحقيقي عالي الدقة لجهازك
                      </span>
                      <span className="text-[11px] text-white">
                        جاهز للنشر على فيسبوك فوراً! 🚀
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  handlePublishNow();
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer text-center"
              >
                اعتماد ونشر المنشور الآن على فيسبوك 🚀
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                رجوع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
