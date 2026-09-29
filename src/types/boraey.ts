export type ProductCategory = 
  | 'all'
  | 'grocery'       // بقالة وسلع تموينية
  | 'dairy'         // ألبان وأجبان
  | 'frozen'        // مجمدات ولحوم ودواجن
  | 'beverages'     // مشروبات وعصائر
  | 'produce'       // خضار وفواكه طازجة
  | 'cleaning'      // منظفات وعناية شخصية
  | 'spices_oils';  // عطارة وزيوت

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  unit: string;
  image: string;
  inStock: boolean;
  isHotOffer?: boolean;
  description?: string;
}

export type FlyerTheme = 'metallic' | 'dynamite' | 'fresh' | 'festive';

export interface OfferFlyer {
  id: string;
  title: string;
  subtitle: string;
  weekLabel: string;
  startDate: string;
  endDate: string;
  theme: FlyerTheme;
  products: ProductItem[];
  footerNote: string;
}

export interface DeliverySettings {
  isDeliveryEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedTimeMinutes: number;
  pauseReasonNotice: string;
  contactPhone: string;
  whatsappNumber: string;
  branchAddress: string;
}

export type OrderDeliveryType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'instapay' | 'vodafone_cash';
export type OrderStatus = 'new' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryType: OrderDeliveryType;
  address?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface HandwrittenSample {
  id: string;
  title: string;
  image: string;
  rawNoteText: string;
  detectedProducts: Omit<ProductItem, 'id'>[];
}

export interface SocialMediaPost {
  id: string;
  platform: 'facebook';
  title: string;
  tone: 'energetic' | 'friendly' | 'weekend';
  content: string;
  hashtags: string[];
  suggestedImage: string;
  scheduledTime: string;
  status: 'draft' | 'ready' | 'scheduled' | 'published';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface ReelScene {
  id: number;
  productName: string;
  originalPrice: number;
  offerPrice: number;
  savingText: string;
  badge: string;
  bgGradient: string;
  icon: string;
  voiceoverLine: string;
}

export interface ReelsVideoConfig {
  id: string;
  title: string;
  audioTrackTitle: string;
  durationSeconds: number;
  scenes: ReelScene[];
  scriptFullText: string;
}
