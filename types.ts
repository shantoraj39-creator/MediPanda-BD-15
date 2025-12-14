
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PHARMACY_OWNER = 'PHARMACY_OWNER',
  ADMIN = 'ADMIN',
  NONE = 'NONE'
}

export enum AppView {
  HOME = 'HOME',
  AI_ASSISTANT = 'AI_ASSISTANT',
  LIVE_PHARMACIST = 'LIVE_PHARMACIST',
  PRESCRIPTION_EDIT = 'PRESCRIPTION_EDIT',
  PHARMACY_DASHBOARD = 'PHARMACY_DASHBOARD',
  PHARMACY_PENDING = 'PHARMACY_PENDING',
  PHARMACY_REGISTRATION = 'PHARMACY_REGISTRATION',
  PHARMACY_REJECTED = 'PHARMACY_REJECTED',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  CART = 'CART',
  MEDICINE_DETAIL = 'MEDICINE_DETAIL',
  MEDICINE_DIRECTORY = 'MEDICINE_DIRECTORY',
  MEDICINE_REMINDER = 'MEDICINE_REMINDER',
  HEALTH_TIPS = 'HEALTH_TIPS',
  PROFILE = 'PROFILE',
  ORDER_HISTORY = 'ORDER_HISTORY',
  FAVORITES = 'FAVORITES',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP'
}

export type PaymentMethod = 'COD' | 'BKASH' | 'BANK';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  price: number;
  manufacturer?: string; // Added manufacturer
  image?: string;
  category?: string;
  description?: string;
  type?: string;
  store?: string;
  primaryUse?: string;
  sideEffects?: string;
  storage?: string;
}

export interface Pharmacy {
  id: string; // Changed to string for consistency
  name: string;
  address: string;
  ownerName?: string;
  phone?: string;
  licenseNo?: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
  lat?: number;
  lng?: number;
  distance?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingMetadata?: {
    searchChunks?: { web: { uri: string; title: string } }[];
    mapChunks?: { maps: { uri: string; title: string; placeAnswerSources?: any } }[];
  };
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface Reminder {
  id: string;
  name: string;
  dose: string;
  times: string[]; // ["08:00", "20:00"]
  days: number;
  totalQuantity: number;
  startDate: string;
}
