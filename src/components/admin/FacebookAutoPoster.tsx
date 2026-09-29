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
  ExternalLink
} from "lucide-react";
import { SocialMediaPost, ProductItem } from "@/types/boraey";
import { INITIAL_POSTS } from "@/data/boraeyMockData";

interface FacebookAutoPosterProps {
  products: ProductItem[];
  onOpenStorefront: () => void;
}

export function FacebookAutoPoster({ products, onOpenStorefront }: FacebookAutoPosterProps) {
  const [posts, setPosts] = useState<SocialMediaPost[]>(INITIAL_POSTS);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isImageDownloaded, setIsImageDownloaded] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'energetic' | 'friendly' | 'weekend'>('energetic');

  const currentPost = posts[activePostIndex];

  const handleCopyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentPost.content);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePublishNow = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      setPosts((prev) =>
        prev.map((p, idx) =>
          idx === activePostIndex ? { ...p, status: "published" } : p
        )
      );
      setTimeout(() => setPublishSuccess(false), 4000);
    }, 1800);
  };

  const handleDownloadImage = () => {
    setIsImageDownloaded(true);
    setTimeout(() => setIsImageDownloaded(false), 2500);
  };

  const handleRegeneratePost = (tone: 'energetic' | 'friendly' | 'weekend') => {
    setSelectedTone(tone);
    let newContent = "";
    let newTitle = "";

    const topProducts = products.slice(0, 5);
    const prodLines = topProducts
      .map((p) => `✨ ${p.name}: بسعر ${p.offerPrice} بدل ${p.originalPrice} جنيه!`)
      .join("\n");

    if (tone === "energetic") {
      newTitle = "منشور ضرب نار: أسعار جملة الجملة تزلزل السوق 🔥";
      newContent = `🚨 تدمير أسعار وضرب نار من هايبر ماركت البرعي! 🔥
يا صباح الفل والجمال على حبايبنا في زفتى والغربية كلها 💙💙

المعلم سامح حلف ما حد يشتري غالي، والأسعار قطاعي نزلت بسعر جملة الجملة! 💪
شوفوا العروض اللي بتهز السوق دي:
${prodLines}

تصفحوا مجلة العروض واطلبوا أونلاين بضغطة زر من موقعنا:
🌐 https://boraey-market.com
📍 العنوان: زفتى - شارع الجيش - بجوار الوحدة الزراعية.
خدمة العملاء والطلبات واتساب: 01023456789`;
    } else if (tone === "friendly") {
      newTitle = "منشور عائلي هادئ: ميزانية بيتك في أمان مع البرعي 💙";
      newContent = `كل أول شهر وست الكل بتفكر في ميزانية البيت وطلبات المطبخ؟ 🤔
في هايبر ماركت البرعي بنقولك ارتاحي خالص.. أسعارنا قطاعي بسعر جملة الجملة عشان توفري وتملي بيتك بالخير والبركة 💙

وفري في أهم السلع الأساسية للأسبوع:
${prodLines}

ادخلي شوفي مجلة العروض واطلبي من مكانك:
🌐 https://boraey-market.com
📍 زفتى - شارع الجيش - بجوار الوحدة الزراعية`;
    } else {
      newTitle = "منشور عروض الويك إند السريعة: خميس وجمعة توفير ⚡";
      newContent = `عروض الويك إند ولعت في هايبر البرعي! ⚡
خروجة التوفير للأسرة كلها في زفتى.. جهزنا لكم أقوى عروض نهاية الأسبوع على السلع الغذائية والمجمدات والمنظفات:
${prodLines}

الحقوا العروض قبل نفاد الكميات المتاحة في الفرع:
🌐 https://boraey-market.com
📍 زفتى - شارع الجيش - بجوار الوحدة الزراعية`;
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
              السيستم بيصمم وينزل كل يوم منشور أو اتنين تلقائياً على الفيسبوك بالعامية المصرية مع رابط الموقع ورقم الواتساب وصورة جرافيك جاهزة!
            </p>
          </div>
        </div>

        {/* Tone Generator Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handleRegeneratePost("energetic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedTone === "energetic"
                ? "bg-red-600 text-white border-red-500 shadow-md"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-red-500"
            }`}
          >
            🔥 نبرة ضرب نار
          </button>

          <button
            onClick={() => handleRegeneratePost("friendly")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedTone === "friendly"
                ? "bg-cyan-600 text-white border-cyan-500 shadow-md"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-500"
            }`}
          >
            💙 نبرة عائلية وست الكل
          </button>

          <button
            onClick={() => handleRegeneratePost("weekend")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedTone === "weekend"
                ? "bg-amber-600 text-white border-amber-500 shadow-md"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500"
            }`}
          >
            ⚡ عروض الويك إند
          </button>
        </div>
      </div>

      {/* Main Split: Post Editor / Controls + Live Facebook Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Controls & Post Text Editor */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>نص المنشور المُولد بالذكاء الاصطناعي</span>
              </span>
              <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                جاهز للنشر 📱
              </span>
            </div>

            {/* Editable Text Area */}
            <div>
              <textarea
                rows={10}
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

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentPost.hashtags.map((h, i) => (
                <span key={i} className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {h}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyText}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                  <span>{isCopied ? "تم النسخ بنجاح!" : "نسخ نص المنشور"}</span>
                </button>

                <button
                  onClick={handleDownloadImage}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isImageDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-amber-400" />}
                  <span>{isImageDownloaded ? "جاري التنزيل..." : "تحميل صورة البوست"}</span>
                </button>
              </div>

              {/* Master Publish Button */}
              <button
                onClick={handlePublishNow}
                disabled={isPublishing}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري النشر عبر فيسبوك API...</span>
                  </>
                ) : publishSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>تم النشر بنجاح على صفحة هايبر ماركت البرعي!</span>
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
              <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                معاينة حية للمتابعين 👥
              </span>
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
                      <span>منذ دقائق</span>
                      <span>·</span>
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>·</span>
                      <span className="text-cyan-400 font-medium">زفتى، الغربية</span>
                    </div>
                  </div>
                </div>

                <span className="text-slate-500 text-lg cursor-pointer">•••</span>
              </div>

              {/* FB Post Content Text */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pt-1">
                {currentPost.content}
              </div>

              {/* FB Post Graphic Asset (1080x1080 Styled Card) */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-950 via-zinc-900 to-black p-4 text-white shadow-xl mt-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-slate-600 bg-black">
                      <Image src="/boraey-logo.jpg" alt="البرعي" fill className="object-cover" />
                    </div>
                    <span className="text-xs font-black text-white">عروض جملة الجملة الأسبوعية</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">
                    وفر حتى 30% 🔥
                  </span>
                </div>

                {/* 4 Mini Product Highlights in Post Graphic */}
                <div className="grid grid-cols-2 gap-2.5 py-3">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h6 className="text-[10px] font-bold text-white truncate">{p.name}</h6>
                        <span className="text-xs font-black text-cyan-400 font-mono">{p.offerPrice} ج</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Callout in Graphic */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-cyan-300 font-bold">🌐 boraey-market.com</span>
                  <span className="text-slate-400">فرع زفتى - شارع الجيش</span>
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
    </div>
  );
}
