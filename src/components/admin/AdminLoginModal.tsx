"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Crown, KeyRound, X, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (codeToVerify?: string) => {
    const inputCode = (codeToVerify ?? pin).trim();
    setError(null);
    setIsVerifying(true);

    setTimeout(() => {
      // Default authorized PINs for Teacher Sameh
      if (inputCode === "2026" || inputCode === "sameh2026" || inputCode === "0000") {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("boraey_admin_authenticated", "true");
        }
        setIsVerifying(false);
        setPin("");
        onSuccess();
      } else {
        setIsVerifying(false);
        setError("رمز الدخول (PIN) غير صحيح! برجاء التأكد من المعلم سامح.");
      }
    }, 400);
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);
      if (nextPin === "2026") {
        handleVerify(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="text-center relative z-10 space-y-3 mb-6">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-amber-400 shadow-xl bg-black">
            <Image src="/boraey-logo.jpg" alt="هايبر ماركت البرعي" fill className="object-cover" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 fill-amber-300" />
            <span>منطقة الإدارة الحصرية (Restricted Hub)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            بوابة المعلم سامح
          </h2>
          <p className="text-xs text-slate-400">
            أدخل رمز المرور الإداري (PIN) للوصول للوحة التحكم والذكاء الاصطناعي
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Display */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 min-h-[52px]">
            {pin.length === 0 ? (
              <span className="text-slate-600 text-xs flex items-center gap-1">
                <KeyRound className="w-4 h-4" />
                <span>أدخل رمز المرور (الافتراضي: 2026)</span>
              </span>
            ) : (
              <div className="flex gap-2">
                {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full transition-all ${
                      i < pin.length
                        ? "bg-amber-400 shadow-md shadow-amber-400/50 scale-110"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 relative z-10 max-w-xs mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitClick(digit)}
              className="py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-white font-bold text-lg font-mono transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="py-3.5 rounded-2xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/30 text-rose-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            مسح
          </button>

          <button
            type="button"
            onClick={() => handleDigitClick("0")}
            className="py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-white font-bold text-lg font-mono transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            ⌫
          </button>
        </div>

        {/* Action Button */}
        <div className="space-y-2 relative z-10">
          <button
            type="button"
            disabled={isVerifying || pin.length === 0}
            onClick={() => handleVerify()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                <span>جاري التحقق...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>دخول لوحة تحكم المعلم سامح</span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs transition-colors cursor-pointer text-center"
          >
            الرجوع إلى المتجر العام
          </button>
        </div>
      </div>
    </div>
  );
}
