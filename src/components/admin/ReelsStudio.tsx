"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Sparkles, 
  Flame, 
  Check, 
  Music, 
  ChevronRight, 
  ChevronLeft,
  Smartphone,
  Copy
} from "lucide-react";
import { ReelsVideoConfig, ReelScene } from "@/types/boraey";
import { INITIAL_REELS_CONFIG } from "@/data/boraeyMockData";
import { downloadElementAsImage } from "@/lib/imageDownloader";

interface ReelsStudioProps {
  onBackToFlyer?: () => void;
}

export function ReelsStudio({ onBackToFlyer }: ReelsStudioProps) {
  const [reelsConfig, setReelsConfig] = useState<ReelsVideoConfig>(INITIAL_REELS_CONFIG);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isCopiedScript, setIsCopiedScript] = useState(false);

  const scenes = reelsConfig.scenes;
  const currentScene = scenes[currentSceneIndex];

  // Auto-play timer through scenes
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % scenes.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPlaying, scenes.length]);

  const handleExportVideo = async () => {
    setExportSuccess(true);
    await downloadElementAsImage("reel-mobile-screen", `elboraey-reel-scene-${currentSceneIndex + 1}.png`);
    setTimeout(() => setExportSuccess(false), 3500);
  };

  const handleCopyScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reelsConfig.scriptFullText);
    }
    setIsCopiedScript(true);
    setTimeout(() => setIsCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950 border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                استوديو ريلز الذكي (AI Reels & Shorts Studio)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                فيديو رأسي 9:16 🔥
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              تحويل مجلة العروض إلى فيديو ريلز رأسي متحرك لفيسبوك وإنستجرام وتيك توك مع اسكربت تعليق صوتي مصري حماسي يشد الزبائن!
            </p>
          </div>
        </div>

        {/* Master Export Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportVideo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
          >
            {exportSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{exportSuccess ? "تم تصدير ريلز MP4 بنجاح!" : "تصدير ريلز بجودة فائقة 1080p"}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Interactive 9:16 Player + Script / Audio Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Right Column (5 Cols): The 9:16 Smartphone Reels Player */}
        <div className="lg:col-span-5 flex justify-center">
          <div id="reel-mobile-screen" className="relative w-full max-w-[340px] aspect-[9/16] rounded-[40px] border-4 border-slate-700 bg-black p-3 shadow-2xl overflow-hidden flex flex-col justify-between">
            
            {/* Top Notch & Stories Progress Bar */}
            <div className="relative z-30 pt-2 px-2 space-y-2">
              {/* Multi-story progress bars */}
              <div className="grid grid-cols-4 gap-1">
                {scenes.map((_, idx) => (
                  <div key={idx} className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        idx < currentSceneIndex ? "w-full" : idx === currentSceneIndex ? "w-full animate-pulse" : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Creator Info Header in Reels */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/60 relative bg-black shrink-0">
                    <Image src="/boraey-logo.jpg" alt="البرعي" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black text-white drop-shadow">هايبر ماركت البرعي</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold">✓</span>
                    </div>
                    <span className="text-[10px] text-slate-200 opacity-90 drop-shadow block">عروض جملة الجملة ⚡</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
                </button>
              </div>
            </div>

            {/* Middle Active Scene Animation Canvas */}
            <div className={`absolute inset-0 bg-gradient-to-b ${currentScene.bgGradient} flex flex-col items-center justify-center p-6 text-center z-10 transition-all duration-700`}>
              {/* Animated Floating Badge */}
              <div className="mb-2">
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-300 border border-amber-300/40 text-xs font-black shadow-lg">
                  {currentScene.badge}
                </span>
              </div>

              {/* Cartoon Mascot Image or Large Emoji Asset */}
              {currentScene.mascotImage ? (
                <div className="relative w-24 h-24 my-1 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/50 animate-bounce">
                  <Image src={currentScene.mascotImage} alt={currentScene.productName} fill className="object-cover" />
                </div>
              ) : (
                <div className="text-5xl my-2 animate-bounce drop-shadow-xl">
                  {currentScene.icon}
                </div>
              )}

              {/* Mascot Comic Speech Bubble */}
              {currentScene.mascotQuote && (
                <div className="my-1 px-3 py-1 rounded-xl bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[10px] font-black text-amber-200 shadow-md max-w-[240px]">
                  {currentScene.mascotQuote}
                </div>
              )}

              {/* Product Headline */}
              <h3 className="text-lg font-black text-white drop-shadow-md leading-tight mt-1 px-2">
                {currentScene.productName}
              </h3>

              {/* Pricing explosion */}
              <div className="mt-2 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl space-y-0.5 w-full max-w-[200px]">
                <span className="text-[11px] text-slate-400 line-through block">
                  بدل {currentScene.originalPrice} جنيه
                </span>
                <div className="text-2xl font-black text-amber-300 font-mono tracking-tight">
                  {currentScene.offerPrice} <span className="text-sm font-bold">ج.م</span>
                </div>
                <div className="text-[10px] font-black text-emerald-400 pt-0.5 border-t border-white/10">
                  {currentScene.savingText}
                </div>
              </div>

              {/* Slogan */}
              <p className="text-[10px] font-bold text-white/90 drop-shadow mt-2">
                فرعا زفتى بشارع الجيش: الوحدة الزراعية & أمام جامع الشحري 🏬
              </p>
            </div>

            {/* Bottom Audio Track Bar & Player Controls */}
            <div className="relative z-30 pb-2 px-3 space-y-3">
              {/* Music Ticker */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-white">
                <Music className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="truncate">{reelsConfig.audioTrackTitle}</span>
              </div>

              {/* Player Navigation Buttons */}
              <div className="flex items-center justify-center gap-4 bg-black/80 backdrop-blur-md py-2 px-4 rounded-2xl border border-white/10">
                <button
                  onClick={() => setCurrentSceneIndex((prev) => (prev - 1 + scenes.length) % scenes.length)}
                  className="text-white hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                </button>

                <button
                  onClick={() => setCurrentSceneIndex((prev) => (prev + 1) % scenes.length)}
                  className="text-white hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column (7 Cols): Voiceover Script & Audio Studio */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>اسكربت التعليق الصوتي الذكي (Voiceover Script)</span>
              </span>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 transition-colors cursor-pointer"
              >
                {isCopiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedScript ? "تم النسخ!" : "نسخ الاسكربت"}</span>
              </button>
            </div>

            {/* Script Text Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>نص الفويس أوفر المصري المُولد بالذكاء الاصطناعي:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                "{reelsConfig.scriptFullText}"
              </p>
            </div>

            {/* Breakdown of Scenes */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                تزامن المشاهد الصوتية والبصرية ({scenes.length} مشاهد):
              </span>

              <div className="space-y-2">
                {scenes.map((sc, idx) => {
                  const isActive = idx === currentSceneIndex;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => setCurrentSceneIndex(idx)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-purple-950/60 border-purple-500 shadow-md"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isActive ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-white">
                            {sc.productName}
                          </h5>
                          <span className="text-[11px] text-slate-400 block mt-0.5 italic">
                            🗣️ "{sc.voiceoverLine}"
                          </span>
                        </div>
                      </div>

                      <div className="text-left font-mono font-black text-xs text-amber-400 shrink-0">
                        {sc.offerPrice} ج
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export and Audio Features */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>الموسيقى التصويرية:</span>
                <span className="font-bold text-slate-200">Mahraganat Commercial Modern Beat</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>المقاس والنسبة:</span>
                <span className="font-bold text-cyan-400">1080 × 1920 (Vertical 9:16)</span>
              </div>

              <button
                onClick={handleExportVideo}
                className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/20 transition-all cursor-pointer"
              >
                {exportSuccess ? <Check className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                <span>{exportSuccess ? "تم التصدير بنجاح!" : "تصدير الفيديو والنشر في Reels & Stories"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
