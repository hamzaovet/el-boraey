"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { 
  ProductItem, 
  OfferFlyer, 
  DeliverySettings, 
  CartItem, 
  CustomerOrder, 
  OrderStatus 
} from "@/types/boraey";
import { 
  INITIAL_PRODUCTS, 
  INITIAL_FLYER, 
  INITIAL_DELIVERY_SETTINGS, 
  INITIAL_ORDERS 
} from "@/data/boraeyMockData";
import { Header } from "@/components/Header";
import { StorefrontView } from "@/components/storefront/StorefrontView";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { DigitalFlyerModal } from "@/components/storefront/DigitalFlyerModal";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";

export default function BoraeyHomePage() {
  const [boraeyView, setBoraeyView] = useState<'store' | 'flyer' | 'admin'>('store');
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(INITIAL_DELIVERY_SETTINGS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [flyer, setFlyer] = useState<OfferFlyer>(INITIAL_FLYER);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication & Branch states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("branch-1");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("boraey_admin_authenticated") === "true";
      if (isAuth) {
        setIsAdminAuthenticated(true);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdminLogin = () => {
    if (isAdminAuthenticated) {
      setBoraeyView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setBoraeyView('admin');
    showToast("👑 مرحباً بك يا معلم سامح في بوابتك الذكية!");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("boraey_admin_authenticated");
    }
    setBoraeyView('store');
    showToast("🔒 تم قفل البوابة الإدارية والرجوع للمتجر العام");
  };

  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`🛒 تمت إضافة (${product.name}) إلى سلة المشتريات`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);
    showToast(`🎉 تم تسجيل طلبك رقم (${order.orderNumber}) بنجاح!`);
  };

  const handleToggleDelivery = () => {
    setDeliverySettings((prev) => {
      const nextState = !prev.isDeliveryEnabled;
      showToast(
        nextState 
          ? "🚀 تم تفعيل خدمة التوصيل المنزلي لجميع الزبائن!" 
          : "⏸️ تم إيقاف خدمة الدليفري وتحويل الطلبات للاستلام من الفرع"
      );
      return {
        ...prev,
        isDeliveryEnabled: nextState,
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-cyan-300 text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Master Boraey Header */}
      <Header
        activeView={boraeyView}
        onViewChange={(v) => {
          if (v === 'admin' && !isAdminAuthenticated) {
            setIsAdminLoginOpen(true);
            return;
          }
          setBoraeyView(v);
          if (v === 'flyer') setIsFlyerModalOpen(true);
        }}
        deliverySettings={deliverySettings}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleDelivery={handleToggleDelivery}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={handleOpenAdminLogin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6">
        {boraeyView === 'admin' && isAdminAuthenticated ? (
          <AdminDashboard
            deliverySettings={deliverySettings}
            onUpdateDeliverySettings={setDeliverySettings}
            flyer={flyer}
            onUpdateFlyer={setFlyer}
            products={products}
            onUpdateProducts={setProducts}
            orders={orders}
            onUpdateOrderStatus={(ordId, status) => {
              setOrders((prev) =>
                prev.map((o) => (o.id === ordId ? { ...o, status } : o))
              );
            }}
            onOpenStorefront={() => setBoraeyView('store')}
            onLogout={handleAdminLogout}
          />
        ) : (
          <StorefrontView
            products={products}
            flyer={flyer}
            deliverySettings={deliverySettings}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onGoToAdmin={handleOpenAdminLogin}
            isAdminAuthenticated={isAdminAuthenticated}
          />
        )}
      </main>

      {/* Modern Hyper Boraey Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white font-black text-sm">هايبر ماركت البرعي</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-bold">الأسعار قطاعي بسعر جملة الجملة 💙💙</span>
            <span className="text-slate-600">|</span>
            <span>فرع شارع الجيش وفرع شارع سعد زغلول - زفتى</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            {isAdminAuthenticated ? (
              <button
                onClick={handleAdminLogout}
                className="hover:text-rose-400 transition-colors cursor-pointer"
              >
                قفل البوابة الإدارية 🔒
              </button>
            ) : (
              <button
                onClick={handleOpenAdminLogin}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                دخول إدارة المعلم سامح 👑
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Slide-out Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        deliverySettings={deliverySettings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Digital Interactive Weekly Flyer Modal */}
      <DigitalFlyerModal
        isOpen={isFlyerModalOpen}
        onClose={() => {
          setIsFlyerModalOpen(false);
          if (boraeyView === 'flyer') setBoraeyView('store');
        }}
        flyer={flyer}
        onAddToCart={handleAddToCart}
      />

      {/* Teacher Sameh Admin PIN Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
