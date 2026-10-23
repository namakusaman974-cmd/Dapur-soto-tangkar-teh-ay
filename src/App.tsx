import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Receipt,
  CreditCard,
  QrCode,
  Banknote,
  Printer,
  History,
  TrendingUp,
  Store,
  Clock,
  User,
  Coffee,
  Pizza,
  Sparkles,
  CheckCircle2,
  X,
  PlusCircle,
  Tag,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Award,
  Check,
  Palette,
  Settings,
  Grid3X3,
  List,
  Sun,
  Moon,
  LayoutGrid,
  Pencil,
  RotateCcw,
  Save,
  AlertTriangle,
  CheckSquare,
  Square,
  Filter,
  Smartphone,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  category: 'makanan' | 'snack' | 'minuman' | 'paket';
  price: number;
  stock: number;
  image: string;
  isPopular?: boolean;
  description: string;
}

interface CartItem {
  food: FoodItem;
  qty: number;
  note?: string;
}

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  customerName: string;
  orderType: 'dine-in' | 'take-away' | 'delivery';
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'qris' | 'debit';
  cashReceived?: number;
  change?: number;
  cashierName: string;
}

export interface StoreTemplate {
  id: string;
  name: string;
  emoji: string;
  themeColor: 'amber' | 'emerald' | 'indigo' | 'rose' | 'slate';
  storeName: string;
  storeTagline: string;
  storeAddress: string;
  storePhone: string;
  receiptFooter: string;
  menuLayout: 'grid' | 'compact' | 'list';
  isDarkMode: boolean;
}

const DEFAULT_TEMPLATES: StoreTemplate[] = [
  {
    id: 'resto',
    name: 'Resto Tradisional',
    emoji: '🍛',
    themeColor: 'amber',
    storeName: 'Dapur Nusantara Resto',
    storeTagline: 'Resto & Kuliner Masakan Tradisional',
    storeAddress: 'Jl. Kuliner Rasa No. 88, Jakarta Selatan',
    storePhone: '0812-3456-7890',
    receiptFooter: 'Terima Kasih Atas Kunjungan Anda!',
    menuLayout: 'grid',
    isDarkMode: false
  },
  {
    id: 'coffee',
    name: 'Kedai Kopi & Cafe',
    emoji: '☕',
    themeColor: 'emerald',
    storeName: 'Kopi Senja & Roastery',
    storeTagline: 'Artisan Coffee, Pastry & Workspace',
    storeAddress: 'Jl. Senopati Raya No. 12, Jakarta',
    storePhone: '0821-9988-7766',
    receiptFooter: 'Nikmati Hari Anda Bersama Secangkir Kopi!',
    menuLayout: 'compact',
    isDarkMode: false
  },
  {
    id: 'bakery',
    name: 'Toko Roti & Bakery',
    emoji: '🥐',
    themeColor: 'rose',
    storeName: 'Sweet Bakery & Cake',
    storeTagline: 'Fresh Bread, Cookies & Dessert',
    storeAddress: 'Ruko Gardenia Blok B-05, Tangerang',
    storePhone: '0857-1122-3344',
    receiptFooter: 'Roti Hangat & Manis Setiap Hari!',
    menuLayout: 'grid',
    isDarkMode: false
  },
  {
    id: 'lounge',
    name: 'Modern Bistro & Lounge',
    emoji: '🍸',
    themeColor: 'slate',
    storeName: 'The Urban Bistro & Lounge',
    storeTagline: 'Modern Western & Asian Dining',
    storeAddress: 'Central Plaza Lt. 3, Jakarta Pusat',
    storePhone: '0811-5566-7788',
    receiptFooter: 'Thank You For Dining With Us!',
    menuLayout: 'list',
    isDarkMode: true
  }
];

const INITIAL_MENU: FoodItem[] = [
  {
    id: 'f1',
    name: 'Nasi Goreng Spesial Nusantara',
    category: 'makanan',
    price: 32000,
    stock: 25,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    description: 'Nasi goreng harum rempah dengan suwiran ayam, sosis sapi, telur mata sapi, dan kerupuk udang.'
  },
  {
    id: 'f2',
    name: 'Ayam Bakar Madu Pedas Manis',
    category: 'makanan',
    price: 38000,
    stock: 20,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    description: 'Paha ayam kampung bakar bumbu madu legit disajikan dengan sambal bajak dan lalapan segar.'
  },
  {
    id: 'f3',
    name: 'Rendang Sapi Daging Empuk',
    category: 'makanan',
    price: 45000,
    stock: 15,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    description: 'Rendang otentik khas Minang dimasak lambat 6 jam dengan santan kental dan kelapa sangrai.'
  },
  {
    id: 'f4',
    name: 'Soto Betawi Daging Kuah Santan',
    category: 'makanan',
    price: 40000,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1572656639199-311292081265?auto=format&fit=crop&w=600&q=80',
    description: 'Kuah santan susu gurih kaya rempah, irisan daging sapi empuk, emping melinjo renyah, dan acar.'
  },
  {
    id: 'f5',
    name: 'Mie Goreng Seafood Spesial',
    category: 'makanan',
    price: 35000,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    description: 'Mie kuning kenyal dengan udang segar, cumi, sayuran segar, dan bumbu saus tiram gurih.'
  },
  {
    id: 'f6',
    name: 'Paket Komplit Ayam Geprek Keju',
    category: 'paket',
    price: 30000,
    stock: 30,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    description: 'Sudah termasuk Nasi putih pulen + Ayam geprek sambal bawang pedas nampol + Es Teh Manis Jumbo.'
  },
  {
    id: 'f7',
    name: 'Paket Hemat Bebek Goreng Krispi',
    category: 'paket',
    price: 42000,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&w=600&q=80',
    description: 'Nasi, bebek goreng renyah bumbu rempah kuning, serundeng kelapa, sambal korek, dan teh tawar.'
  },
  {
    id: 's1',
    name: 'Pisang Goreng Keju Aren',
    category: 'snack',
    price: 18000,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    description: 'Pisang raja manis renyah dengan lelehan saus gula aren dan parutan keju cheddar melimpah.'
  },
  {
    id: 's2',
    name: 'Tahu Cabe Garam Crispy',
    category: 'snack',
    price: 16000,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Potongan tahu sutra digoreng renyah ditaburi bawang putih cincang, daun bawang, dan cabai rawit.'
  },
  {
    id: 's3',
    name: 'Kentang Goreng Truffle Seasoning',
    category: 'snack',
    price: 22000,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    description: 'Kentang stik renyah dibumbui minyak truffle aromatik, keju parmesan, dan saus cocolan mayo.'
  },
  {
    id: 'd1',
    name: 'Kopi Susu Gula Aren Asli',
    category: 'minuman',
    price: 20000,
    stock: 50,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    description: 'Espresso biji Arabika pilihan dipadu susu creamy dan gula aren murni berkualitas tinggi.'
  },
  {
    id: 'd2',
    name: 'Es Jeruk Murni Peras Segar',
    category: 'minuman',
    price: 15000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    description: 'Jeruk peras manis segar tanpa pemanis buatan, disajikan dengan es batu dingin menyegarkan.'
  },
  {
    id: 'd3',
    name: 'Es Teh Manis Melati Jumbo',
    category: 'minuman',
    price: 8000,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    description: 'Teh melati wangi khas diseduh tradisional dengan es batu dingin berukuran jumbo.'
  },
  {
    id: 'd4',
    name: 'Jus Alpukat Kocok Cokelat',
    category: 'minuman',
    price: 24000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    description: 'Alpukat mentega kental manis berlimpah dipadu siraman susu cokelat kental manis.'
  }
];

export default function App() {
  // Store Customization & Theme Settings State
  const [storeName, setStoreName] = useState(() => localStorage.getItem('dapur_store_name') || 'Dapur Nusantara POS');
  const [storeTagline, setStoreTagline] = useState(() => localStorage.getItem('dapur_store_tagline') || 'Resto, Kafe & Kuliner Tradisional');
  const [storeAddress, setStoreAddress] = useState(() => localStorage.getItem('dapur_store_address') || 'Jl. Kuliner Rasa No. 88, Jakarta Selatan');
  const [storePhone, setStorePhone] = useState(() => localStorage.getItem('dapur_store_phone') || '0812-3456-7890');
  const [receiptFooter, setReceiptFooter] = useState(() => localStorage.getItem('dapur_receipt_footer') || 'Terima Kasih Atas Kunjungan Anda!');
  const [themeColor, setThemeColor] = useState<'amber' | 'emerald' | 'indigo' | 'rose' | 'slate'>(() => {
    return (localStorage.getItem('dapur_theme_color') as any) || 'amber';
  });
  const [menuLayout, setMenuLayout] = useState<'grid' | 'compact' | 'list'>(() => {
    return (localStorage.getItem('dapur_menu_layout') as any) || 'grid';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('dapur_dark_mode') === 'true');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopiedShareLink, setIsCopiedShareLink] = useState(false);
  const [activeUrlType, setActiveUrlType] = useState<'dev' | 'shared'>('dev');

  // Android & Shared App URLs
  const devUrl = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return 'https://ais-dev-eqyk63lav4cxdrxqpqpzzj-97236636813.asia-east1.run.app';
  }, []);

  const sharedUrl = 'https://ais-pre-eqyk63lav4cxdrxqpqpzzj-97236636813.asia-east1.run.app';
  const currentSelectedUrl = activeUrlType === 'dev' ? devUrl : sharedUrl;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(currentSelectedUrl);
    setIsCopiedShareLink(true);
    setTimeout(() => setIsCopiedShareLink(false), 2500);
  };

  // Dynamic Store Templates State (Editable Manually)
  const [templates, setTemplates] = useState<StoreTemplate[]>(() => {
    const saved = localStorage.getItem('dapur_store_templates');
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
  });
  const [editingTemplate, setEditingTemplate] = useState<StoreTemplate | null>(null);
  const [isCreatingNewTemplate, setIsCreatingNewTemplate] = useState(false);
  const [templateForm, setTemplateForm] = useState<StoreTemplate>({
    id: '',
    name: '',
    emoji: '🍛',
    themeColor: 'amber',
    storeName: '',
    storeTagline: '',
    storeAddress: '',
    storePhone: '',
    receiptFooter: '',
    menuLayout: 'grid',
    isDarkMode: false
  });

  // Core POS State
  const [menuItems, setMenuItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('dapur_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dapur_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>(() => {
    const saved = localStorage.getItem('dapur_order_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<'pos' | 'history' | 'menu-mgmt' | 'report'>('pos');

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Order Details
  const [orderType, setOrderType] = useState<'dine-in' | 'take-away' | 'delivery'>('dine-in');
  const [customerName, setCustomerName] = useState('Pelanggan');
  const [tableNumber, setTableNumber] = useState('05');
  const [cashierName, setCashierName] = useState(() => localStorage.getItem('dapur_cashier_name') || 'Budi Santoso');

  // Discount & Tax settings
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxEnabled, setTaxEnabled] = useState<boolean>(true); // 10% PB1 Restaurant Tax

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'debit'>('cash');
  const [cashAmountReceived, setCashAmountReceived] = useState<number | ''>('');

  // Receipt Modal State
  const [completedOrder, setCompletedOrder] = useState<OrderHistoryItem | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // New Menu Item Modal State
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newMenuForm, setNewMenuForm] = useState({
    name: '',
    category: 'makanan' as 'makanan' | 'snack' | 'minuman' | 'paket',
    price: '',
    stock: '',
    description: '',
    image: ''
  });

  // Menu Management Search, Filter & Deletion States
  const [menuMgmtSearch, setMenuMgmtSearch] = useState('');
  const [menuMgmtCategory, setMenuMgmtCategory] = useState('all');
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<FoodItem | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<FoodItem | null>(null);

  // Note Modal for Cart Item
  const [editingItemNote, setEditingItemNote] = useState<{ id: string; name: string; note: string } | null>(null);

  // Current Time Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('dapur_store_name', storeName);
    localStorage.setItem('dapur_store_tagline', storeTagline);
    localStorage.setItem('dapur_store_address', storeAddress);
    localStorage.setItem('dapur_store_phone', storePhone);
    localStorage.setItem('dapur_receipt_footer', receiptFooter);
    localStorage.setItem('dapur_theme_color', themeColor);
    localStorage.setItem('dapur_menu_layout', menuLayout);
    localStorage.setItem('dapur_dark_mode', String(isDarkMode));
    localStorage.setItem('dapur_cashier_name', cashierName);
  }, [storeName, storeTagline, storeAddress, storePhone, receiptFooter, themeColor, menuLayout, isDarkMode, cashierName]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dapur_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('dapur_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dapur_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('dapur_store_templates', JSON.stringify(templates));
  }, [templates]);

  // Theme styling definitions
  const theme = useMemo(() => {
    switch (themeColor) {
      case 'emerald':
        return {
          headerBg: 'bg-emerald-900 border-emerald-950',
          headerLogo: 'from-emerald-400 to-teal-500 text-stone-950',
          badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
          primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          accentText: 'text-emerald-700',
          activeTab: 'bg-emerald-500 text-stone-950',
          activeFilter: 'bg-emerald-600 text-white border-emerald-600',
          activeCardRing: 'border-emerald-500 ring-2 ring-emerald-500/20',
          lightBg: 'bg-emerald-50 text-emerald-800'
        };
      case 'indigo':
        return {
          headerBg: 'bg-indigo-950 border-indigo-900',
          headerLogo: 'from-indigo-400 to-blue-500 text-white',
          badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
          primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          accentText: 'text-indigo-700',
          activeTab: 'bg-indigo-500 text-white',
          activeFilter: 'bg-indigo-600 text-white border-indigo-600',
          activeCardRing: 'border-indigo-500 ring-2 ring-indigo-500/20',
          lightBg: 'bg-indigo-50 text-indigo-800'
        };
      case 'rose':
        return {
          headerBg: 'bg-rose-950 border-rose-900',
          headerLogo: 'from-rose-400 to-pink-500 text-white',
          badge: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
          primaryBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
          accentText: 'text-rose-700',
          activeTab: 'bg-rose-500 text-white',
          activeFilter: 'bg-rose-600 text-white border-rose-600',
          activeCardRing: 'border-rose-500 ring-2 ring-rose-500/20',
          lightBg: 'bg-rose-50 text-rose-800'
        };
      case 'slate':
        return {
          headerBg: 'bg-slate-900 border-slate-950',
          headerLogo: 'from-amber-400 to-amber-500 text-slate-950',
          badge: 'bg-slate-700 text-amber-300 border-slate-600',
          primaryBtn: 'bg-slate-800 hover:bg-slate-700 text-white',
          accentText: 'text-slate-800',
          activeTab: 'bg-amber-400 text-slate-950',
          activeFilter: 'bg-slate-800 text-white border-slate-800',
          activeCardRing: 'border-slate-800 ring-2 ring-slate-800/20',
          lightBg: 'bg-slate-100 text-slate-800'
        };
      case 'amber':
      default:
        return {
          headerBg: 'bg-amber-900 border-amber-950',
          headerLogo: 'from-amber-500 to-amber-600 text-stone-900',
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
          primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
          accentText: 'text-amber-700',
          activeTab: 'bg-amber-500 text-stone-950',
          activeFilter: 'bg-amber-600 text-white border-amber-600',
          activeCardRing: 'border-amber-500 ring-2 ring-amber-500/20',
          lightBg: 'bg-amber-50 text-amber-800'
        };
    }
  }, [themeColor]);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.food.price * item.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * discountPercent) / 100);
  }, [subtotal, discountPercent]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxEnabled ? Math.round(taxableAmount * 0.1) : 0;
  const grandTotal = taxableAmount + taxAmount;

  // Filtered Menu Items
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (food: FoodItem) => {
    if (food.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        if (existing.qty >= food.stock) return prev;
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { food, qty: 1, note: '' }];
    });
  };

  const updateCartQty = (foodId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.food.id === foodId) {
            const newQty = item.qty + delta;
            if (newQty > item.food.stock) return item;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  const removeCartItem = (foodId: string) => {
    setCart((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  const clearCart = () => {
    if (window.confirm('Bersihkan semua menu di dalam keranjang?')) {
      setCart([]);
    }
  };

  const saveItemNote = (foodId: string, noteText: string) => {
    setCart((prev) =>
      prev.map((item) => (item.food.id === foodId ? { ...item, note: noteText } : item))
    );
    setEditingItemNote(null);
  };

  // Open Checkout
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setCashAmountReceived(grandTotal);
    setIsCheckoutOpen(true);
  };

  // Quick Cash suggestions
  const quickCashOptions = useMemo(() => {
    const total = grandTotal;
    const options = new Set<number>();
    options.add(total);
    if (total % 10000 !== 0) options.add(Math.ceil(total / 10000) * 10000);
    if (total % 50000 !== 0) options.add(Math.ceil(total / 50000) * 50000);
    if (total % 100000 !== 0) options.add(Math.ceil(total / 100000) * 100000);
    [50000, 100000, 200000, 500000].forEach((val) => {
      if (val > total) options.add(val);
    });
    return Array.from(options).sort((a, b) => a - b).slice(0, 5);
  }, [grandTotal]);

  // Process Completed Order
  const handleCompleteTransaction = () => {
    const received = paymentMethod === 'cash' ? Number(cashAmountReceived || grandTotal) : grandTotal;
    if (paymentMethod === 'cash' && received < grandTotal) {
      alert('Nominal uang yang diterima kurang dari total tagihan!');
      return;
    }

    const change = paymentMethod === 'cash' ? Math.max(0, received - grandTotal) : 0;
    const now = new Date();
    const orderNum = `DN-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${(orderHistory.length + 1).toString().padStart(3, '0')}`;

    const newOrder: OrderHistoryItem = {
      id: Date.now().toString(),
      orderNumber: orderNum,
      date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      customerName: customerName.trim() || 'Pelanggan Umum',
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
      cashReceived: received,
      change,
      cashierName
    };

    // Update stocks
    setMenuItems((prev) =>
      prev.map((item) => {
        const cartItem = cart.find((ci) => ci.food.id === item.id);
        if (cartItem) {
          return { ...item, stock: Math.max(0, item.stock - cartItem.qty) };
        }
        return item;
      })
    );

    setOrderHistory((prev) => [newOrder, ...prev]);
    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);
    setCart([]);
  };

  // Add Custom Menu
  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuForm.name || !newMenuForm.price) return;
    const newItem: FoodItem = {
      id: `custom-${Date.now()}`,
      name: newMenuForm.name,
      category: newMenuForm.category,
      price: parseInt(newMenuForm.price) || 10000,
      stock: parseInt(newMenuForm.stock) || 30,
      description: newMenuForm.description || 'Menu lezat pilihan.',
      image:
        newMenuForm.image.trim() ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    };
    setMenuItems((prev) => [newItem, ...prev]);
    setIsAddMenuOpen(false);
    setNewMenuForm({
      name: '',
      category: 'makanan',
      price: '',
      stock: '',
      description: '',
      image: ''
    });
  };

  // Filtered menu for Menu Management
  const filteredMgmtMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = menuMgmtCategory === 'all' || item.category === menuMgmtCategory;
      const matchQuery =
        item.name.toLowerCase().includes(menuMgmtSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(menuMgmtSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [menuItems, menuMgmtCategory, menuMgmtSearch]);

  // Delete a single menu item
  const handleDeleteSingleMenu = (item: FoodItem) => {
    setDeleteConfirmItem(item);
  };

  const confirmDeleteSingleMenu = () => {
    if (!deleteConfirmItem) return;
    setMenuItems((prev) => prev.filter((m) => m.id !== deleteConfirmItem.id));
    setCart((prev) => prev.filter((c) => c.food.id !== deleteConfirmItem.id));
    setSelectedMenuIds((prev) => prev.filter((id) => id !== deleteConfirmItem.id));
    setDeleteConfirmItem(null);
  };

  // Toggle selection for bulk delete
  const handleToggleSelectMenu = (id: string) => {
    setSelectedMenuIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select / Deselect All in management view
  const handleSelectAllFilteredMenu = () => {
    const allFilteredIds = filteredMgmtMenu.map((m) => m.id);
    const areAllSelected = allFilteredIds.every((id) => selectedMenuIds.includes(id));
    if (areAllSelected) {
      setSelectedMenuIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedMenuIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  // Bulk delete selected menus
  const handleBulkDeleteSelected = () => {
    if (selectedMenuIds.length === 0) return;
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedMenuIds.length} menu yang dipilih secara permanen dari daftar?`
      )
    ) {
      setMenuItems((prev) => prev.filter((m) => !selectedMenuIds.includes(m.id)));
      setCart((prev) => prev.filter((c) => !selectedMenuIds.includes(c.food.id)));
      setSelectedMenuIds([]);
      setIsMultiSelectMode(false);
    }
  };

  // Reset menu back to default factory list
  const handleResetToDefaultMenu = () => {
    if (
      window.confirm(
        'Kembalikan daftar menu ke menu awal pabrik (14 menu asli lengkap Nusantara)? Menu tambahan kustom akan terhapus.'
      )
    ) {
      setMenuItems(INITIAL_MENU);
      setSelectedMenuIds([]);
      setIsMultiSelectMode(false);
    }
  };

  // Update existing menu item
  const handleUpdateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem || !editingMenuItem.name.trim()) return;
    setMenuItems((prev) =>
      prev.map((item) => (item.id === editingMenuItem.id ? editingMenuItem : item))
    );
    // Also update in cart if present
    setCart((prev) =>
      prev.map((ci) => (ci.food.id === editingMenuItem.id ? { ...ci, food: editingMenuItem } : ci))
    );
    setEditingMenuItem(null);
  };

  // Printing thermal receipt simulation
  const handlePrint = () => {
    window.print();
  };

  // Daily statistics
  const stats = useMemo(() => {
    const totalOmzet = orderHistory.reduce((sum, order) => sum + order.total, 0);
    const totalTransactions = orderHistory.length;
    const totalItemsSold = orderHistory.reduce(
      (sum, order) => sum + order.items.reduce((iSum, it) => iSum + it.qty, 0),
      0
    );
    const cashTotal = orderHistory
      .filter((o) => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + o.total, 0);
    const qrisTotal = orderHistory
      .filter((o) => o.paymentMethod === 'qris')
      .reduce((sum, o) => sum + o.total, 0);
    const debitTotal = orderHistory
      .filter((o) => o.paymentMethod === 'debit')
      .reduce((sum, o) => sum + o.total, 0);

    return { totalOmzet, totalTransactions, totalItemsSold, cashTotal, qrisTotal, debitTotal };
  }, [orderHistory]);

  // Dynamic Store Template Actions
  const applyTemplate = (tpl: StoreTemplate) => {
    setStoreName(tpl.storeName);
    setStoreTagline(tpl.storeTagline);
    setStoreAddress(tpl.storeAddress);
    setStorePhone(tpl.storePhone);
    setReceiptFooter(tpl.receiptFooter);
    setThemeColor(tpl.themeColor);
    setMenuLayout(tpl.menuLayout);
    setIsDarkMode(tpl.isDarkMode);
  };

  const handleOpenEditTemplate = (tpl: StoreTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplateForm({ ...tpl });
    setEditingTemplate(tpl);
    setIsCreatingNewTemplate(false);
  };

  const handleOpenCreateTemplate = () => {
    setTemplateForm({
      id: `tpl-${Date.now()}`,
      name: 'Template Baru',
      emoji: '🏪',
      themeColor: themeColor || 'amber',
      storeName: storeName || 'Nama Toko Saya',
      storeTagline: storeTagline || 'Slogan Usaha Kuliner',
      storeAddress: storeAddress || 'Alamat Toko',
      storePhone: storePhone || '0812-0000-0000',
      receiptFooter: receiptFooter || 'Terima Kasih Atas Kunjungan Anda!',
      menuLayout: menuLayout || 'grid',
      isDarkMode: isDarkMode || false
    });
    setEditingTemplate(null);
    setIsCreatingNewTemplate(true);
  };

  const handleSaveCurrentAsTemplate = () => {
    const customName = prompt('Beri nama untuk template baru dari pengaturan saat ini:', `${storeName} Custom`);
    if (!customName || !customName.trim()) return;
    const newTpl: StoreTemplate = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      emoji: '⭐',
      themeColor,
      storeName,
      storeTagline,
      storeAddress,
      storePhone,
      receiptFooter,
      menuLayout,
      isDarkMode
    };
    setTemplates((prev) => [...prev, newTpl]);
    alert(`Template "${newTpl.name}" berhasil disimpan ke daftar!`);
  };

  const handleSaveTemplateForm = (applyNow: boolean = false) => {
    if (!templateForm.name.trim() || !templateForm.storeName.trim()) {
      alert('Nama label template dan nama toko tidak boleh kosong!');
      return;
    }

    if (isCreatingNewTemplate) {
      const newTpl: StoreTemplate = {
        ...templateForm,
        id: templateForm.id || `tpl-${Date.now()}`
      };
      setTemplates((prev) => [...prev, newTpl]);
      if (applyNow) applyTemplate(newTpl);
    } else if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? { ...templateForm, id: t.id } : t))
      );
      if (applyNow) applyTemplate(templateForm);
    }

    setEditingTemplate(null);
    setIsCreatingNewTemplate(false);
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (templates.length <= 1) {
      alert('Minimal harus ada 1 template yang tersisa!');
      return;
    }
    if (window.confirm('Hapus template ini dari daftar pilihan?')) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (editingTemplate && editingTemplate.id === id) {
        setEditingTemplate(null);
      }
    }
  };

  const handleResetTemplates = () => {
    if (window.confirm('Kembalikan semua template ke pengaturan awal bawaan?')) {
      setTemplates(DEFAULT_TEMPLATES);
      setEditingTemplate(null);
      setIsCreatingNewTemplate(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans select-none transition-colors duration-200 ${
        isDarkMode ? 'bg-stone-900 text-stone-100' : 'bg-stone-100 text-stone-800'
      }`}
    >
      {/* Top Bar / POS Header */}
      <header className={`${theme.headerBg} text-white shadow-md sticky top-0 z-40 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${theme.headerLogo} flex items-center justify-center font-black shadow-inner`}
            >
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none text-white">
                  {storeName}
                </h1>
                <span
                  className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${theme.badge}`}
                >
                  Shift Aktif
                </span>
              </div>
              <p className="text-xs text-stone-200/80 mt-0.5 truncate max-w-xs">
                {storeTagline}
              </p>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setCurrentView('pos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                currentView === 'pos' ? theme.activeTab : 'text-stone-200 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Kasir (POS)</span>
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                currentView === 'history' ? theme.activeTab : 'text-stone-200 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Riwayat Nota</span>
              {orderHistory.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                  {orderHistory.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                currentView === 'report' ? theme.activeTab : 'text-stone-200 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Laporan Kas</span>
            </button>
            <button
              onClick={() => setCurrentView('menu-mgmt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                currentView === 'menu-mgmt' ? theme.activeTab : 'text-stone-200 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kelola Menu</span>
            </button>
          </div>

          {/* Customizer Button, Android Link & Cashier Info */}
          <div className="flex items-center gap-2 text-xs">
            {/* Open on Android Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all active:scale-95"
              title="Buka link aplikasi ini di HP Android atau bagikan via WhatsApp"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span>Buka di Android</span>
            </button>

            {/* Direct Appearance Customizer Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold shadow-xs transition-all"
              title="Ubah tema warna, nama toko, dan tata letak tampilan"
            >
              <Palette className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Ubah Tampilan</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 text-stone-200">
              <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-mono text-white">
                  {currentTime.toLocaleTimeString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* VIEW: MAIN CASHIER / POS */}
      {currentView === 'pos' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: FOOD CATALOG (8 Columns on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
            {/* Search, Order Type & Quick Layout Toggle Bar */}
            <div
              className={`rounded-2xl p-3 sm:p-4 shadow-xs border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              }`}
            >
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari makanan, minuman, cemilan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all border ${
                    isDarkMode
                      ? 'bg-stone-900 border-stone-700 text-stone-100 placeholder:text-stone-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Order Mode Selector */}
              <div
                className={`flex items-center p-1 rounded-xl text-xs font-semibold ${
                  isDarkMode ? 'bg-stone-900 text-stone-300' : 'bg-stone-100 text-stone-600'
                }`}
              >
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    orderType === 'dine-in' ? `${theme.primaryBtn} shadow-xs font-bold` : 'hover:text-stone-900'
                  }`}
                >
                  Dine In
                </button>
                <button
                  onClick={() => setOrderType('take-away')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    orderType === 'take-away' ? `${theme.primaryBtn} shadow-xs font-bold` : 'hover:text-stone-900'
                  }`}
                >
                  Take Away
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    orderType === 'delivery' ? `${theme.primaryBtn} shadow-xs font-bold` : 'hover:text-stone-900'
                  }`}
                >
                  Delivery
                </button>
              </div>

              {/* Layout Switcher (Grid vs Compact vs List) */}
              <div
                className={`hidden md:flex items-center p-1 rounded-xl border ${
                  isDarkMode ? 'bg-stone-900 border-stone-700 text-stone-400' : 'bg-stone-100 border-stone-200 text-stone-600'
                }`}
              >
                <button
                  onClick={() => setMenuLayout('grid')}
                  title="Tampilan Gambar Besar"
                  className={`p-1.5 rounded-lg transition-all ${
                    menuLayout === 'grid'
                      ? isDarkMode
                        ? 'bg-stone-800 text-white'
                        : 'bg-white text-stone-900 shadow-xs'
                      : 'hover:text-stone-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMenuLayout('compact')}
                  title="Tampilan Kartu Ringkas (Tablet Kasir)"
                  className={`p-1.5 rounded-lg transition-all ${
                    menuLayout === 'compact'
                      ? isDarkMode
                        ? 'bg-stone-800 text-white'
                        : 'bg-white text-stone-900 shadow-xs'
                      : 'hover:text-stone-900'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMenuLayout('list')}
                  title="Tampilan Daftar / List"
                  className={`p-1.5 rounded-lg transition-all ${
                    menuLayout === 'list'
                      ? isDarkMode
                        ? 'bg-stone-800 text-white'
                        : 'bg-white text-stone-900 shadow-xs'
                      : 'hover:text-stone-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'Semua Menu', icon: Sparkles },
                { id: 'makanan', label: 'Makanan Utama', icon: Utensils },
                { id: 'paket', label: 'Paket Hemat', icon: Award },
                { id: 'snack', label: 'Cemilan & Snack', icon: Pizza },
                { id: 'minuman', label: 'Minuman Segar', icon: Coffee }
              ].map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive
                        ? theme.activeFilter
                        : isDarkMode
                        ? 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Menu Items Container based on layout */}
            {menuLayout === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 pb-4">
                {filteredMenu.map((food) => {
                  const inCart = cart.find((item) => item.food.id === food.id);
                  return (
                    <div
                      key={food.id}
                      onClick={() => addToCart(food)}
                      className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between group hover:shadow-md relative ${
                        isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
                      } ${
                        food.stock <= 0
                          ? 'opacity-50 pointer-events-none'
                          : inCart
                          ? theme.activeCardRing
                          : 'hover:border-stone-400'
                      }`}
                    >
                      <div className="relative h-32 w-full overflow-hidden bg-stone-100">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {food.isPopular && (
                          <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Flame className="w-3 h-3" />
                            <span>Favorit</span>
                          </div>
                        )}
                        {inCart && (
                          <div
                            className={`absolute top-2 right-2 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 ${theme.primaryBtn}`}
                          >
                            {inCart.qty}
                          </div>
                        )}
                        <div className="absolute bottom-1 right-2 bg-stone-900/75 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                          Stok: {food.stock}
                        </div>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3
                            className={`font-bold text-xs sm:text-sm line-clamp-1 transition-colors ${
                              isDarkMode ? 'text-stone-100' : 'text-stone-900'
                            }`}
                          >
                            {food.name}
                          </h3>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                            {food.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 dark:border-stone-700">
                          <span className={`text-xs sm:text-sm font-extrabold ${theme.accentText}`}>
                            Rp {food.price.toLocaleString('id-ID')}
                          </span>
                          <button
                            type="button"
                            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${
                              isDarkMode
                                ? 'bg-stone-700 text-stone-200 group-hover:bg-amber-600 group-hover:text-white'
                                : 'bg-stone-100 text-stone-800 group-hover:bg-amber-600 group-hover:text-white'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {menuLayout === 'compact' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 pb-4">
                {filteredMenu.map((food) => {
                  const inCart = cart.find((item) => item.food.id === food.id);
                  return (
                    <div
                      key={food.id}
                      onClick={() => addToCart(food)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
                      } ${inCart ? theme.activeCardRing : 'hover:border-stone-400'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-stone-400">
                            {food.category}
                          </span>
                          <h4 className="font-bold text-xs line-clamp-2 text-stone-900 dark:text-stone-100 mt-0.5">
                            {food.name}
                          </h4>
                        </div>
                        {inCart && (
                          <span
                            className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${theme.primaryBtn}`}
                          >
                            {inCart.qty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-700">
                        <span className={`text-xs font-bold ${theme.accentText}`}>
                          Rp {food.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-stone-400">Stok: {food.stock}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {menuLayout === 'list' && (
              <div
                className={`rounded-2xl border divide-y overflow-y-auto max-h-[calc(100vh-270px)] ${
                  isDarkMode
                    ? 'bg-stone-800 border-stone-700 divide-stone-700'
                    : 'bg-white border-stone-200 divide-stone-100'
                }`}
              >
                {filteredMenu.map((food) => {
                  const inCart = cart.find((item) => item.food.id === food.id);
                  return (
                    <div
                      key={food.id}
                      onClick={() => addToCart(food)}
                      className={`p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors ${
                        inCart ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                              {food.name}
                            </h4>
                            {food.isPopular && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded">
                                Favorit
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">
                            Stok: {food.stock} porsi
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-extrabold ${theme.accentText}`}>
                          Rp {food.price.toLocaleString('id-ID')}
                        </span>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            inCart
                              ? `${theme.primaryBtn} shadow-xs`
                              : isDarkMode
                              ? 'bg-stone-700 text-stone-200 hover:bg-stone-600'
                              : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                          }`}
                        >
                          {inCart ? `+ ${inCart.qty}` : 'Tambah'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredMenu.length === 0 && (
              <div
                className={`py-12 text-center rounded-2xl border border-dashed ${
                  isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-300'
                }`}
              >
                <Utensils className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Menu tidak ditemukan
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Coba ganti kata kunci pencarian atau kategori filter
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: TICKET / CART PANEL (4-5 Columns on desktop) */}
          <div
            className={`lg:col-span-5 xl:col-span-4 rounded-2xl border shadow-sm flex flex-col h-[calc(100vh-110px)] sticky top-16 ${
              isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
            }`}
          >
            {/* Ticket Header & Customer details */}
            <div
              className={`p-4 border-b space-y-3 rounded-t-2xl ${
                isDarkMode ? 'bg-stone-800/80 border-stone-700' : 'bg-stone-50/80 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className={`w-4 h-4 ${theme.accentText}`} />
                  <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Pesanan Aktif
                  </h2>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.lightBg}`}
                  >
                    {cart.reduce((total, it) => total + it.qty, 0)} Porsi
                  </span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>

              {/* Customer & Table inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                    Pelanggan:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama pemesan"
                    className={`w-full px-2.5 py-1.5 rounded-lg border font-medium focus:ring-1 focus:outline-none ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100 focus:ring-amber-400'
                        : 'bg-white border-stone-200 text-stone-900 focus:ring-amber-500'
                    }`}
                  />
                </div>
                {orderType === 'dine-in' ? (
                  <div>
                    <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                      No. Meja:
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Contoh: Meja 05"
                      className={`w-full px-2.5 py-1.5 rounded-lg border font-medium focus:ring-1 focus:outline-none ${
                        isDarkMode
                          ? 'bg-stone-900 border-stone-700 text-stone-100 focus:ring-amber-400'
                          : 'bg-white border-stone-200 text-stone-900 focus:ring-amber-500'
                      }`}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                      Status Bawa:
                    </label>
                    <span
                      className={`inline-block w-full px-2.5 py-1.5 rounded-lg font-semibold text-[11px] ${
                        isDarkMode ? 'bg-stone-700 text-stone-300' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {orderType === 'take-away' ? 'Bungkus / Box' : 'Kirim / Ojek'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      isDarkMode ? 'bg-stone-700' : 'bg-stone-100'
                    }`}
                  >
                    <Receipt className="w-8 h-8 text-stone-400" />
                  </div>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Keranjang Masih Kosong
                  </p>
                  <p className="text-xs text-stone-400 max-w-xs mt-1">
                    Klik menu makanan atau minuman di samping untuk menambahkan ke pesanan pelanggan.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.food.id}
                    className={`p-2.5 rounded-xl border transition-colors space-y-2 ${
                      isDarkMode
                        ? 'bg-stone-900/60 border-stone-700'
                        : 'bg-stone-50/50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 leading-tight">
                          {item.food.name}
                        </h4>
                        <div className={`text-[11px] font-semibold mt-0.5 ${theme.accentText}`}>
                          Rp {item.food.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          Rp {(item.food.price * item.qty).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {/* Note & Quantity controls */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() =>
                          setEditingItemNote({
                            id: item.food.id,
                            name: item.food.name,
                            note: item.note || ''
                          })
                        }
                        className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                          item.note
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                            : isDarkMode
                            ? 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                            : 'bg-white text-stone-500 border-stone-200 hover:text-stone-800'
                        }`}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        <span>{item.note ? `Catatan: ${item.note}` : '+ Catatan khusus'}</span>
                      </button>

                      <div
                        className={`flex items-center gap-1.5 border rounded-lg p-0.5 shadow-2xs ${
                          isDarkMode
                            ? 'bg-stone-800 border-stone-700'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <button
                          onClick={() => updateCartQty(item.food.id, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:text-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900 dark:text-stone-100">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.food.id, 1)}
                          className={`w-5 h-5 rounded flex items-center justify-center text-white ${theme.primaryBtn}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Checkout Button */}
            <div
              className={`p-4 border-t rounded-b-2xl space-y-3 ${
                isDarkMode ? 'bg-stone-800/90 border-stone-700' : 'bg-stone-50/90 border-stone-200'
              }`}
            >
              {/* Discount & Tax Options */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200/70 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-medium">Diskon:</span>
                  <select
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className={`border rounded px-1.5 py-0.5 text-xs font-semibold ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-200'
                        : 'bg-white border-stone-200 text-stone-800'
                    }`}
                  >
                    <option value={0}>0% (Tanpa Diskon)</option>
                    <option value={5}>5% (Member)</option>
                    <option value={10}>10% (Promo Spesial)</option>
                    <option value={15}>15% (Kupon Diskon)</option>
                    <option value={20}>20% (Karyawan/VIP)</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-300 font-medium">
                  <input
                    type="checkbox"
                    checked={taxEnabled}
                    onChange={(e) => setTaxEnabled(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Pajak Resto (10%)</span>
                </label>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>Subtotal:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon ({discountPercent}%):</span>
                    <span className="font-semibold">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {taxEnabled && (
                  <div className="flex justify-between text-stone-500 dark:text-stone-400">
                    <span>Pajak PB1 Resto (10%):</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      Rp {taxAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-stone-900 dark:text-stone-100 pt-1.5 border-t border-stone-200 dark:border-stone-700">
                  <span>Total Tagihan:</span>
                  <span className={theme.accentText}>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                disabled={cart.length === 0}
                onClick={handleOpenCheckout}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                  cart.length === 0
                    ? 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-98'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Bayar Sekarang (Rp {grandTotal.toLocaleString('id-ID')})</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ORDER HISTORY */}
      {currentView === 'history' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <History className={`w-5 h-5 ${theme.accentText}`} />
                Riwayat Transaksi Nota Selesai
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Semua struk dan nota penjualan tersimpan otomatis untuk rekap harian
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${
                  isDarkMode
                    ? 'bg-stone-800 border-stone-700 text-stone-200'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                Total Transaksi: <strong className={theme.accentText}>{orderHistory.length}</strong>
              </span>
            </div>
          </div>

          {orderHistory.length === 0 ? (
            <div
              className={`rounded-2xl border p-12 text-center max-w-md mx-auto ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              }`}
            >
              <Receipt className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 dark:text-stone-200 text-base">
                Belum Ada Transaksi
              </h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Selesaikan transaksi di menu Kasir (POS) untuk melihat daftar riwayat struk penjualan.
              </p>
              <button
                onClick={() => setCurrentView('pos')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${theme.primaryBtn}`}
              >
                Buka Kasir Sekarang
              </button>
            </div>
          ) : (
            <div
              className={`rounded-2xl border overflow-hidden shadow-xs ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b font-bold uppercase tracking-wider text-[11px] ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-400'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <tr>
                      <th className="py-3 px-4">No. Struk</th>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Pelanggan</th>
                      <th className="py-3 px-4">Tipe / Meja</th>
                      <th className="py-3 px-4">Rincian Menu</th>
                      <th className="py-3 px-4">Metode Bayar</th>
                      <th className="py-3 px-4 text-right">Total Tagihan</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDarkMode ? 'divide-stone-700' : 'divide-stone-200'
                    }`}
                  >
                    {orderHistory.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-amber-50/20 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                          <div>{order.date}</div>
                          <div className="text-[10px] text-stone-500">{order.time}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              order.orderType === 'dine-in'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                : order.orderType === 'take-away'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                            }`}
                          >
                            {order.orderType === 'dine-in'
                              ? `Dine In (${order.tableNumber || '-'})`
                              : order.orderType === 'take-away'
                              ? 'Take Away'
                              : 'Delivery'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                          <div className="max-w-xs truncate">
                            {order.items.map((it) => `${it.qty}x ${it.food.name}`).join(', ')}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold uppercase text-stone-700 dark:text-stone-300">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-extrabold text-stone-900 dark:text-stone-100">
                          Rp {order.total.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setCompletedOrder(order);
                              setIsReceiptOpen(true);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] inline-flex items-center gap-1 border ${
                              isDarkMode
                                ? 'bg-stone-700 border-stone-600 text-stone-200 hover:bg-stone-600'
                                : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            <Printer className="w-3 h-3" />
                            <span>Lihat Nota</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: END OF SHIFT REPORT / OMZET */}
      {currentView === 'report' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${theme.accentText}`} />
              Laporan Rekap Penjualan & Kas Hari Ini
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Ringkasan pendapatan omzet toko {storeName}, rincian kas tunai di laci vs transaksi non-tunai
            </p>
          </div>

          {/* Cards metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-2xl border shadow-xs ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              }`}
            >
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Total Omzet Pendapatan
              </span>
              <div className={`text-2xl font-black mt-1 ${theme.accentText}`}>
                Rp {stats.totalOmzet.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Dari {stats.totalTransactions} transaksi berhasil
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xs ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              }`}
            >
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Kas Tunai (Cash di Laci)
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                Rp {stats.cashTotal.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Wajib disetor saat tutup shift</p>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xs ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              }`}
            >
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Pembayaran QRIS Digital
              </span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                Rp {stats.qrisTotal.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Masuk rekening QRIS toko</p>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xs ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              }`}
            >
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Total Porsi Terjual
              </span>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                {stats.totalItemsSold}{' '}
                <span className="text-sm font-normal text-stone-500">Porsi</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Semua kategori hidangan</p>
            </div>
          </div>

          {/* Detailed summary */}
          <div
            className={`rounded-2xl border p-6 space-y-4 ${
              isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
            }`}
          >
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Rekapitulasi Shift Kasir: {cashierName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div
                className={`p-3.5 rounded-xl border ${
                  isDarkMode ? 'bg-stone-900 border-stone-700' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Penerimaan Kasir
                </span>
                <div className="space-y-1 text-stone-600 dark:text-stone-400">
                  <div className="flex justify-between">
                    <span>Tunai (Cash):</span>
                    <span className="font-bold">Rp {stats.cashTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>QRIS / E-Wallet:</span>
                    <span className="font-bold">Rp {stats.qrisTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kartu Debit / EDC:</span>
                    <span className="font-bold">Rp {stats.debitTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  isDarkMode ? 'bg-stone-900 border-stone-700' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Informasi Shift
                </span>
                <div className="space-y-1 text-stone-600 dark:text-stone-400">
                  <div className="flex justify-between">
                    <span>Nama Kasir:</span>
                    <span className="font-bold">{cashierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <span className="font-bold">{new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status Operasional:</span>
                    <span className="font-bold text-emerald-600">Buka / Normal</span>
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  isDarkMode ? 'bg-stone-900 border-stone-700' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Aksi Tutup Kasir
                  </span>
                  <p className="text-stone-500">
                    Cetak rekapan shift untuk dilampirkan bersama uang fisik laci.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className={`mt-3 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 ${theme.primaryBtn}`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Rekap Shift (End of Day)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MENU MANAGEMENT */}
      {currentView === 'menu-mgmt' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <SlidersHorizontal className={`w-5 h-5 ${theme.accentText}`} />
                  Daftar & Kelola Menu Toko
                </h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.lightBg}`}>
                  {menuItems.length} Menu
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Tambah menu baru, edit rincian harga/stok, atau hapus menu lama yang sudah tidak dijual
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAddMenuOpen(true)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all ${theme.primaryBtn}`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Menu Baru</span>
              </button>

              <button
                onClick={() => {
                  setIsMultiSelectMode(!isMultiSelectMode);
                  if (isMultiSelectMode) setSelectedMenuIds([]);
                }}
                className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border ${
                  isMultiSelectMode
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : isDarkMode
                    ? 'bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
                title="Pilih beberapa menu untuk dihapus sekaligus"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{isMultiSelectMode ? 'Batal Seleksi' : 'Pilih Banyak'}</span>
              </button>

              {isMultiSelectMode && selectedMenuIds.length > 0 && (
                <button
                  onClick={handleBulkDeleteSelected}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all animate-in zoom-in-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus ({selectedMenuIds.length}) Terpilih</span>
                </button>
              )}

              <button
                onClick={handleResetToDefaultMenu}
                className={`p-2 rounded-xl border text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors ${
                  isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
                }`}
                title="Kembalikan ke daftar menu awal pabrik (14 menu asli)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div
            className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
              isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
            }`}
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari menu yang ingin diubah atau dihapus..."
                value={menuMgmtSearch}
                onChange={(e) => setMenuMgmtSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 border ${
                  isDarkMode
                    ? 'bg-stone-900 border-stone-700 text-stone-100 placeholder:text-stone-500'
                    : 'bg-stone-50 border-stone-200 text-stone-900'
                }`}
              />
              {menuMgmtSearch && (
                <button
                  onClick={() => setMenuMgmtSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'makanan', label: 'Makanan' },
                { id: 'paket', label: 'Paket' },
                { id: 'snack', label: 'Snack' },
                { id: 'minuman', label: 'Minuman' }
              ].map((cat) => {
                const isActive = menuMgmtCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setMenuMgmtCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive
                        ? theme.activeFilter
                        : isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-400 hover:text-stone-200'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multi-Select Toolbar if active */}
          {isMultiSelectMode && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <span>
                  <strong>{selectedMenuIds.length}</strong> menu terpilih dari {filteredMgmtMenu.length} menu yang tampil.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllFilteredMenu}
                  className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg font-semibold text-[11px] hover:bg-stone-100"
                >
                  {filteredMgmtMenu.every((m) => selectedMenuIds.includes(m.id))
                    ? 'Batal Pilih Semua'
                    : 'Pilih Semua'}
                </button>
              </div>
            </div>
          )}

          {/* Menu Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMgmtMenu.map((item) => {
              const isSelected = selectedMenuIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border overflow-hidden shadow-2xs p-3.5 flex flex-col justify-between space-y-3 transition-all relative ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
                  } ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20'
                      : 'hover:border-stone-400'
                  }`}
                >
                  {/* Select Checkbox for bulk delete */}
                  {isMultiSelectMode && (
                    <div
                      onClick={() => handleToggleSelectMenu(item.id)}
                      className="absolute top-2 right-2 z-10 cursor-pointer"
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-md transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-white/90 text-stone-400 border border-stone-300'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </div>
                    </div>
                  )}

                  {/* Menu Image & Info */}
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.lightBg}`}
                        >
                          {item.category}
                        </span>
                        {item.isPopular && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full">
                            Favorit
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 mt-1 line-clamp-1">
                        {item.name}
                      </h4>
                      <div className={`text-xs font-extrabold mt-0.5 ${theme.accentText}`}>
                        Rp {item.price.toLocaleString('id-ID')}
                      </div>
                      <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Stock & Action Buttons (Edit, Stock, Delete) */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-700 gap-1">
                    <span className="text-stone-500 text-[11px]">
                      Stok: <strong className="text-stone-800 dark:text-stone-200">{item.stock}</strong>
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Change Stock */}
                      <button
                        onClick={() => {
                          const newStock = prompt(`Ubah stok untuk ${item.name}:`, String(item.stock));
                          if (newStock !== null) {
                            const parsed = parseInt(newStock) || 0;
                            setMenuItems(menuItems.map((m) => (m.id === item.id ? { ...m, stock: parsed } : m)));
                          }
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                          isDarkMode
                            ? 'bg-stone-700 text-stone-200 hover:bg-stone-600'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                        title="Ubah jumlah stok porsi"
                      >
                        Stok
                      </button>

                      {/* Edit Menu */}
                      <button
                        onClick={() => setEditingMenuItem(item)}
                        className="p-1 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-amber-100 text-stone-600 dark:text-stone-300 hover:text-amber-800 transition-colors"
                        title="Edit rincian menu"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Hapus Menu (Single Delete) */}
                      <button
                        onClick={() => handleDeleteSingleMenu(item)}
                        className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 dark:border-rose-800/60 transition-colors"
                        title="Hapus menu ini dari daftar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMgmtMenu.length === 0 && (
              <div
                className={`col-span-full py-12 text-center rounded-2xl border border-dashed ${
                  isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-300'
                }`}
              >
                <Utensils className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Tidak ada menu yang sesuai
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Coba ubah kata kunci pencarian atau bersihkan filter kategori
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS & APPEARANCE CUSTOMIZER MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border animate-in zoom-in-95 my-6 ${
              isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-800'
            }`}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 ${theme.headerBg} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-bold">Kustomisasi Tampilan & Identitas Toko</h3>
                  <p className="text-xs text-stone-200">
                    Ubah warna, nama usaha, alamat struk, dan tata letak sesuai selera Anda
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* 1. Dynamic Store Templates (Editable Manually) */}
              <div className="space-y-3 pb-2 border-b border-stone-200 dark:border-stone-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block text-xs">
                      1. Template Toko (Dapat Diedit Manual & 1-Klik Terapkan):
                    </label>
                    <span className="text-[11px] text-stone-500">
                      Klik <strong>"Gunakan"</strong> untuk menerapkan, atau ikon <strong>pensil</strong> untuk mengedit template secara manual.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenCreateTemplate}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs"
                      title="Buat template baru dari awal"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Buat Baru</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCurrentAsTemplate}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all border ${
                        isDarkMode
                          ? 'bg-stone-700 border-stone-600 text-stone-200 hover:bg-stone-600'
                          : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                      }`}
                      title="Simpan pengaturan toko yang sedang aktif sebagai template baru"
                    >
                      <Save className="w-3 h-3" />
                      <span>Simpan Saat Ini</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetTemplates}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                      title="Kembalikan semua template ke default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* INLINE TEMPLATE MANUAL EDITOR FORM */}
                {(editingTemplate || isCreatingNewTemplate) && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 space-y-3 animate-in fade-in-50">
                    <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
                      <span className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5 text-amber-600" />
                        {isCreatingNewTemplate ? 'Buat Template Toko Baru' : `Edit Manual Template: "${editingTemplate?.name}"`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTemplate(null);
                          setIsCreatingNewTemplate(false);
                        }}
                        className="text-stone-400 hover:text-stone-600 text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      {/* Template Label */}
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          Nama Label Template:
                        </label>
                        <input
                          type="text"
                          value={templateForm.name}
                          onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                          placeholder="Contoh: Kedai Kopi Senja, Resto Padang, dll."
                          className={`w-full p-2 rounded-lg border font-bold ${
                            isDarkMode
                              ? 'bg-stone-900 border-stone-700 text-stone-100'
                              : 'bg-white border-stone-300 text-stone-900'
                          }`}
                        />
                      </div>

                      {/* Emoji Icon */}
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          Ikon Emoji:
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={templateForm.emoji}
                            onChange={(e) => setTemplateForm({ ...templateForm, emoji: e.target.value })}
                            className={`w-12 p-2 text-center text-sm rounded-lg border ${
                              isDarkMode
                                ? 'bg-stone-900 border-stone-700 text-stone-100'
                                : 'bg-white border-stone-300 text-stone-900'
                            }`}
                          />
                          <div className="flex gap-1 overflow-x-auto py-1">
                            {['🍛', '☕', '🥐', '🍸', '🍜', '🍔', '🍕', '🍰', '🍱', '🥤'].map((em) => (
                              <button
                                key={em}
                                type="button"
                                onClick={() => setTemplateForm({ ...templateForm, emoji: em })}
                                className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 hover:scale-110 text-xs border border-stone-200 dark:border-stone-700"
                              >
                                {em}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Theme Color */}
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          Warna Tema:
                        </label>
                        <select
                          value={templateForm.themeColor}
                          onChange={(e) => setTemplateForm({ ...templateForm, themeColor: e.target.value as any })}
                          className={`w-full p-2 rounded-lg border font-semibold ${
                            isDarkMode
                              ? 'bg-stone-900 border-stone-700 text-stone-100'
                              : 'bg-white border-stone-300 text-stone-900'
                          }`}
                        >
                          <option value="amber">Warm Amber (Resto/Otentik)</option>
                          <option value="emerald">Emerald Green (Cafe/Segar)</option>
                          <option value="indigo">Indigo Blue (Modern)</option>
                          <option value="rose">Ruby Rose (Bakery/Manis)</option>
                          <option value="slate">Slate Dark (Bistro/Lounge)</option>
                        </select>
                      </div>

                      {/* Store Name */}
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          Nama Usaha / Toko:
                        </label>
                        <input
                          type="text"
                          value={templateForm.storeName}
                          onChange={(e) => setTemplateForm({ ...templateForm, storeName: e.target.value })}
                          placeholder="Nama yang muncul di header & nota"
                          className={`w-full p-2 rounded-lg border font-bold ${
                            isDarkMode
                              ? 'bg-stone-900 border-stone-700 text-stone-100'
                              : 'bg-white border-stone-300 text-stone-900'
                          }`}
                        />
                      </div>

                      {/* Tagline */}
                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          Slogan / Sub-judul Toko:
                        </label>
                        <input
                          type="text"
                          value={templateForm.storeTagline}
                          onChange={(e) => setTemplateForm({ ...templateForm, storeTagline: e.target.value })}
                          placeholder="Contoh: Aneka Masakan Tradisional Lezat"
                          className={`w-full p-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-stone-900 border-stone-700 text-stone-100'
                              : 'bg-white border-stone-300 text-stone-900'
                          }`}
                        />
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          Alamat Tercetak di Struk:
                        </label>
                        <input
                          type="text"
                          value={templateForm.storeAddress}
                          onChange={(e) => setTemplateForm({ ...templateForm, storeAddress: e.target.value })}
                          placeholder="Jl. Mawar No. 10, Jakarta"
                          className={`w-full p-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-stone-900 border-stone-700 text-stone-100'
                              : 'bg-white border-stone-300 text-stone-900'
                          }`}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          No. Telp / WhatsApp:
                        </label>
                        <input
                          type="text"
                          value={templateForm.storePhone}
                          onChange={(e) => setTemplateForm({ ...templateForm, storePhone: e.target.value })}
                          placeholder="0812-3456-7890"
                          className={`w-full p-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-stone-900 border-stone-700 text-stone-100'
                              : 'bg-white border-stone-300 text-stone-900'
                          }`}
                        />
                      </div>

                      {/* Receipt Footer */}
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                          Pesan Penutup Struk:
                        </label>
                        <input
                          type="text"
                          value={templateForm.receiptFooter}
                          onChange={(e) => setTemplateForm({ ...templateForm, receiptFooter: e.target.value })}
                          placeholder="Terima Kasih Atas Kunjungan Anda!"
                          className={`w-full p-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-stone-900 border-stone-700 text-stone-100'
                              : 'bg-white border-stone-300 text-stone-900'
                          }`}
                        />
                      </div>

                      {/* Layout & Dark Mode */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                            Layout Menu:
                          </label>
                          <select
                            value={templateForm.menuLayout}
                            onChange={(e) => setTemplateForm({ ...templateForm, menuLayout: e.target.value as any })}
                            className={`w-full p-2 rounded-lg border ${
                              isDarkMode
                                ? 'bg-stone-900 border-stone-700 text-stone-100'
                                : 'bg-white border-stone-300 text-stone-900'
                            }`}
                          >
                            <option value="grid">Grid Foto</option>
                            <option value="compact">Compact Tablet</option>
                            <option value="list">Daftar List</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/20">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTemplate(null);
                          setIsCreatingNewTemplate(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-semibold text-xs"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveTemplateForm(false)}
                        className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-bold text-xs"
                      >
                        Simpan Template Saja
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveTemplateForm(true)}
                        className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                      >
                        Simpan & Terapkan Sekarang
                      </button>
                    </div>
                  </div>
                )}

                {/* TEMPLATE CARDS LIST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {templates.map((tpl) => {
                    const isSelected =
                      storeName === tpl.storeName && themeColor === tpl.themeColor;
                    const colorBadge =
                      tpl.themeColor === 'amber'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : tpl.themeColor === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : tpl.themeColor === 'indigo'
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                        : tpl.themeColor === 'rose'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-slate-200 text-slate-800 border-slate-300';

                    return (
                      <div
                        key={tpl.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col justify-between group ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                            : isDarkMode
                            ? 'bg-stone-900 border-stone-700 hover:border-stone-500'
                            : 'bg-stone-50/80 border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{tpl.emoji}</span>
                              <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                {tpl.name}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorBadge}`}>
                              {tpl.themeColor}
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-600 dark:text-stone-400 font-medium line-clamp-1">
                            {tpl.storeName}
                          </div>
                          <div className="text-[10px] text-stone-400 dark:text-stone-500 line-clamp-1 italic">
                            {tpl.storeTagline}
                          </div>
                        </div>

                        {/* Actions: Apply & Edit */}
                        <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                          <button
                            type="button"
                            onClick={() => applyTemplate(tpl)}
                            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-amber-600 hover:text-white hover:border-amber-600'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Sedang Digunakan</span>
                              </>
                            ) : (
                              <span>Gunakan Template Ini</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleOpenEditTemplate(tpl, e)}
                            className="p-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-amber-600 hover:border-amber-400 transition-colors"
                            title="Edit manual template ini"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {templates.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                              className="p-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
                              title="Hapus template ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Palet Warna Tema */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-2">
                  2. Pilih Warna Tema Aplikasi:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'amber', name: 'Warm Amber', bg: 'bg-amber-600' },
                    { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600' },
                    { id: 'indigo', name: 'Indigo Blue', bg: 'bg-indigo-600' },
                    { id: 'rose', name: 'Ruby Rose', bg: 'bg-rose-600' },
                    { id: 'slate', name: 'Slate Dark', bg: 'bg-slate-800' }
                  ].map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id as any)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        themeColor === color.id
                          ? 'border-amber-600 ring-2 ring-amber-500/30 font-bold'
                          : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${color.bg} shadow-xs`}></span>
                      <span className="text-[10px] text-center">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Mode Tampilan Kartu & Dark Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                    3. Tata Letak Menu:
                  </label>
                  <select
                    value={menuLayout}
                    onChange={(e) => setMenuLayout(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-200'
                        : 'bg-white border-stone-200 text-stone-800'
                    }`}
                  >
                    <option value="grid">Grid Foto Besar</option>
                    <option value="compact">Ringkas (Tablet Kasir)</option>
                    <option value="list">Daftar List Cepat</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                    Mode Gelap / Terang:
                  </label>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-full p-2 rounded-xl border flex items-center justify-center gap-2 font-semibold ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-amber-300'
                        : 'bg-stone-100 border-stone-200 text-stone-800'
                    }`}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDarkMode ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}</span>
                  </button>
                </div>
              </div>

              {/* 4. Identitas Usaha & Struk */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200 dark:border-stone-700">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  4. Identitas Toko & Informasi Struk:
                </label>
                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Nama Toko / Resto:</span>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className={`w-full p-2 rounded-lg border font-semibold ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Slogan / Keterangan:</span>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-stone-500 block mb-1">Alamat di Struk:</span>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-stone-900 border-stone-700 text-stone-100'
                          : 'bg-white border-stone-300 text-stone-900'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block mb-1">No. WhatsApp / Telp:</span>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-stone-900 border-stone-700 text-stone-100'
                          : 'bg-white border-stone-300 text-stone-900'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Nama Kasir Saat Ini:</span>
                  <input
                    type="text"
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Pesan Penutup Struk:</span>
                  <input
                    type="text"
                    value={receiptFooter}
                    onChange={(e) => setReceiptFooter(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsSettingsOpen(false)}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-sm transition-all ${theme.primaryBtn}`}
              >
                Simpan & Terapkan Tampilan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className={`px-6 py-4 ${theme.headerBg} text-white flex items-center justify-between`}>
              <div>
                <h3 className="text-base font-bold">Proses Pembayaran Kasir</h3>
                <p className="text-xs text-stone-200">
                  Total Tagihan: <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  Pilih Metode Pembayaran:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Uang Tunai</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">QRIS / E-Wallet</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('debit')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'debit'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span className="text-xs">Kartu Debit</span>
                  </button>
                </div>
              </div>

              {/* CASH PAYMENT UI */}
              {paymentMethod === 'cash' && (
                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Nominal Uang Diterima dari Pelanggan:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={cashAmountReceived}
                        onChange={(e) => setCashAmountReceived(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl font-bold text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Quick Cash Buttons */}
                  <div>
                    <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                      Pecahan Cepat Uang Rupiah:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickCashOptions.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setCashAmountReceived(amount)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            cashAmountReceived === amount
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {amount === grandTotal
                            ? 'Uang Pas'
                            : `Rp ${amount.toLocaleString('id-ID')}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kembalian Calculation */}
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-600">Kembalian:</span>
                    <span
                      className={`text-lg font-black ${
                        Number(cashAmountReceived || 0) < grandTotal
                          ? 'text-rose-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {Number(cashAmountReceived || 0) < grandTotal
                        ? `Kurang Rp ${(grandTotal - Number(cashAmountReceived || 0)).toLocaleString('id-ID')}`
                        : `Rp ${Math.max(0, Number(cashAmountReceived || 0) - grandTotal).toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>
              )}

              {/* QRIS PAYMENT UI */}
              {paymentMethod === 'qris' && (
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center space-y-3">
                  <div className="bg-white p-3 rounded-xl border border-stone-200 inline-block shadow-xs">
                    <div className="w-40 h-40 bg-stone-900 mx-auto rounded-lg flex flex-col items-center justify-center text-white p-2">
                      <QrCode className="w-24 h-24 text-amber-400" />
                      <span className="text-[9px] font-mono tracking-widest mt-1 text-stone-300">
                        NMD-QRIS-99238
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">
                      Scan QRIS {storeName}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Mendukung GoPay, OVO, ShopeePay, DANA, BCA, Mandiri & Mobile Banking
                    </p>
                    <div className="mt-2 text-sm font-black text-amber-800">
                      Total: Rp {grandTotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              )}

              {/* DEBIT CARD UI */}
              {paymentMethod === 'debit' && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="font-semibold text-stone-700">Mesin EDC Siap Gesek / Tap</div>
                  <p className="text-stone-500">
                    Silakan gesek atau masukkan kartu debit pelanggan pada mesin EDC kasir dengan total tagihan <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>.
                  </p>
                  <div className="p-2.5 bg-white border border-stone-200 rounded-lg text-emerald-700 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>EDC Terhubung & Transaksi Terverifikasi</span>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleCompleteTransaction}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Selesaikan & Cetak Struk Belanja</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL RECEIPT MODAL */}
      {isReceiptOpen && completedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-300 animate-in zoom-in-95 my-8">
            {/* Modal Controls */}
            <div className="p-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between no-print">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-amber-700" />
                Nota Penjualan Selesai
              </span>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Thermal Receipt Paper */}
            <div
              id="printable-receipt"
              className="p-6 font-mono text-xs text-stone-800 bg-white space-y-3 leading-tight"
            >
              {/* Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-400">
                <h3 className="font-bold text-base text-stone-900 tracking-wider">
                  {storeName.toUpperCase()}
                </h3>
                <p className="text-[10px] text-stone-600">
                  {storeAddress}
                </p>
                <p className="text-[10px] text-stone-600">Telp / WA: {storePhone}</p>
              </div>

              {/* Order Info */}
              <div className="text-[11px] space-y-1 pb-3 border-b border-dashed border-stone-400 text-stone-700">
                <div className="flex justify-between">
                  <span>No. Nota:</span>
                  <span className="font-bold">{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>
                    {completedOrder.date} {completedOrder.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir:</span>
                  <span>{completedOrder.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span>{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Layanan:</span>
                  <span className="font-bold uppercase">
                    {completedOrder.orderType === 'dine-in'
                      ? `Dine In (${completedOrder.tableNumber || '-'})`
                      : completedOrder.orderType}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 pb-3 border-b border-dashed border-stone-400">
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span className="flex-1 pr-2">{it.food.name}</span>
                      <span>Rp {(it.food.price * it.qty).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-500">
                      <span>
                        {it.qty} x Rp {it.food.price.toLocaleString('id-ID')}
                      </span>
                      {it.note && <span className="italic">*{it.note}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Totals */}
              <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {completedOrder.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Diskon:</span>
                    <span>- Rp {completedOrder.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {completedOrder.tax > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>PB1 Pajak Resto (10%):</span>
                    <span>Rp {completedOrder.tax.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-300">
                  <span>TOTAL:</span>
                  <span>Rp {completedOrder.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-stone-600 pt-1">
                  <span>Metode:</span>
                  <span className="uppercase font-semibold">{completedOrder.paymentMethod}</span>
                </div>
                {completedOrder.paymentMethod === 'cash' && (
                  <>
                    <div className="flex justify-between">
                      <span>Tunai Diterima:</span>
                      <span>Rp {(completedOrder.cashReceived || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-stone-800">
                      <span>Kembalian:</span>
                      <span>Rp {(completedOrder.change || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-2 text-[10px] text-stone-500 space-y-1">
                <p className="font-semibold text-stone-700">
                  {receiptFooter}
                </p>
                <p>Makanan Halal & Berkualitas</p>
                <p className="text-[9px] pt-1">Simpan struk ini sebagai bukti pembayaran sah.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex gap-2 no-print">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Nota Thermal</span>
              </button>
              <button
                onClick={() => {
                  setIsReceiptOpen(false);
                  setCurrentView('pos');
                }}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold text-xs"
              >
                Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTE EDIT MODAL */}
      {editingItemNote && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border ${
              isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
            }`}
          >
            <div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Catatan Khusus Pesanan
              </h4>
              <p className="text-xs text-stone-500">{editingItemNote.name}</p>
            </div>
            <textarea
              rows={3}
              value={editingItemNote.note}
              onChange={(e) =>
                setEditingItemNote({ ...editingItemNote, note: e.target.value })
              }
              placeholder="Contoh: Sangat pedas, tanpa daun bawang, sedikit es, kuah dipisah..."
              className={`w-full p-3 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                isDarkMode
                  ? 'bg-stone-900 border-stone-700 text-stone-100'
                  : 'bg-white border-stone-300 text-stone-900'
              }`}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingItemNote(null)}
                className="px-3 py-1.5 text-xs text-stone-500 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => saveItemNote(editingItemNote.id, editingItemNote.note)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg ${theme.primaryBtn}`}
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MENU MODAL */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border ${
              isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Tambah Menu Makanan Baru
              </h3>
              <button onClick={() => setIsAddMenuOpen(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMenu} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nama Menu:
                </label>
                <input
                  type="text"
                  required
                  value={newMenuForm.name}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, name: e.target.value })}
                  placeholder="Contoh: Sate Ayam Madura"
                  className={`w-full p-2.5 border rounded-xl ${
                    isDarkMode
                      ? 'bg-stone-900 border-stone-700 text-stone-100'
                      : 'bg-white border-stone-300 text-stone-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Kategori:
                  </label>
                  <select
                    value={newMenuForm.category}
                    onChange={(e) =>
                      setNewMenuForm({
                        ...newMenuForm,
                        category: e.target.value as any
                      })
                    }
                    className={`w-full p-2.5 border rounded-xl ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  >
                    <option value="makanan">Makanan Utama</option>
                    <option value="paket">Paket Hemat</option>
                    <option value="snack">Cemilan / Snack</option>
                    <option value="minuman">Minuman Segar</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Harga (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={newMenuForm.price}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, price: e.target.value })}
                    placeholder="25000"
                    className={`w-full p-2.5 border rounded-xl ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Stok Porsi:
                  </label>
                  <input
                    type="number"
                    value={newMenuForm.stock}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, stock: e.target.value })}
                    placeholder="25"
                    className={`w-full p-2.5 border rounded-xl ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    URL Gambar (Opsional):
                  </label>
                  <input
                    type="url"
                    value={newMenuForm.image}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, image: e.target.value })}
                    placeholder="https://..."
                    className={`w-full p-2.5 border rounded-xl ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Deskripsi Singkat:
                </label>
                <textarea
                  rows={2}
                  value={newMenuForm.description}
                  onChange={(e) =>
                    setNewMenuForm({ ...newMenuForm, description: e.target.value })
                  }
                  placeholder="Kelezatan olahan daging empuk..."
                  className={`w-full p-2.5 border rounded-xl ${
                    isDarkMode
                      ? 'bg-stone-900 border-stone-700 text-stone-100'
                      : 'bg-white border-stone-300 text-stone-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold rounded-xl ${theme.primaryBtn}`}
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MENU CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-sm w-full p-6 shadow-2xl border animate-in zoom-in-95 space-y-4 ${
              isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Hapus Menu Ini?
                </h3>
                <p className="text-xs text-stone-500">
                  Tindakan ini akan menghapus menu secara permanen.
                </p>
              </div>
            </div>

            {/* Menu details box */}
            <div
              className={`p-3 rounded-2xl border flex items-center gap-3 ${
                isDarkMode ? 'bg-stone-900 border-stone-700' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <img
                src={deleteConfirmItem.image}
                alt={deleteConfirmItem.name}
                className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs truncate">{deleteConfirmItem.name}</div>
                <div className="text-[11px] text-stone-500">
                  Kategori: <span className="capitalize">{deleteConfirmItem.category}</span>
                </div>
                <div className="text-xs font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
                  Rp {deleteConfirmItem.price.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Menu ini tidak akan lagi muncul di katalog pemesanan kasir POS. Apakah Anda yakin ingin melanjutkannya?
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteSingleMenu}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Menu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MENU MODAL */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-md w-full p-6 shadow-2xl border animate-in zoom-in-95 space-y-4 ${
              isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-800'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Edit Menu Makanan
                </h3>
              </div>
              <button onClick={() => setEditingMenuItem(null)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nama Menu:
                </label>
                <input
                  type="text"
                  required
                  value={editingMenuItem.name}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl font-bold ${
                    isDarkMode
                      ? 'bg-stone-900 border-stone-700 text-stone-100'
                      : 'bg-white border-stone-300 text-stone-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Kategori:
                  </label>
                  <select
                    value={editingMenuItem.category}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        category: e.target.value as any
                      })
                    }
                    className={`w-full p-2.5 border rounded-xl ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  >
                    <option value="makanan">Makanan Utama</option>
                    <option value="paket">Paket Hemat</option>
                    <option value="snack">Cemilan / Snack</option>
                    <option value="minuman">Minuman Segar</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Harga Jual (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={editingMenuItem.price}
                    onChange={(e) =>
                      setEditingMenuItem({ ...editingMenuItem, price: parseInt(e.target.value) || 0 })
                    }
                    className={`w-full p-2.5 border rounded-xl font-bold ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Stok Porsi:
                  </label>
                  <input
                    type="number"
                    value={editingMenuItem.stock}
                    onChange={(e) =>
                      setEditingMenuItem({ ...editingMenuItem, stock: parseInt(e.target.value) || 0 })
                    }
                    className={`w-full p-2.5 border rounded-xl ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    URL Gambar:
                  </label>
                  <input
                    type="url"
                    value={editingMenuItem.image}
                    onChange={(e) =>
                      setEditingMenuItem({ ...editingMenuItem, image: e.target.value })
                    }
                    className={`w-full p-2.5 border rounded-xl ${
                      isDarkMode
                        ? 'bg-stone-900 border-stone-700 text-stone-100'
                        : 'bg-white border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Deskripsi Menu:
                </label>
                <textarea
                  rows={2}
                  value={editingMenuItem.description}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, description: e.target.value })
                  }
                  className={`w-full p-2.5 border rounded-xl ${
                    isDarkMode
                      ? 'bg-stone-900 border-stone-700 text-stone-100'
                      : 'bg-white border-stone-300 text-stone-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(null)}
                  className="px-4 py-2 font-semibold text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold rounded-xl ${theme.primaryBtn}`}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OPEN ON ANDROID / SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border animate-in zoom-in-95 my-6 ${
              isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-800'
            }`}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Buka Aplikasi di Android</h3>
                  <p className="text-[11px] text-emerald-200">Gunakan sebagai mesin kasir di smartphone atau tablet</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Notice explaining Page Not Found */}
              <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Mengapa Muncul "Page not found"?</span>
                </div>
                <p className="leading-snug text-stone-600 dark:text-stone-300">
                  Link Publik (<em>ais-pre-...</em>) hanya aktif jika Anda sudah menekan tombol <strong>"Share" / "Bagikan"</strong> di pojok kanan atas AI Studio.
                  <br />
                  👉 <strong>Solusi:</strong> Gunakan opsi <strong>"Link Sesi Aktif"</strong> di bawah ini yang <strong>sudah aktif langsung</strong> tanpa perlu deploy!
                </p>
              </div>

              {/* URL Switcher Tabs */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Pilih Jenis Link untuk Android:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveUrlType('dev')}
                    className={`py-2 px-2.5 rounded-lg font-bold text-center transition-all text-xs ${
                      activeUrlType === 'dev'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    🟢 Link Sesi Aktif (Aktif Sekarang)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveUrlType('shared')}
                    className={`py-2 px-2.5 rounded-lg font-bold text-center transition-all text-xs ${
                      activeUrlType === 'shared'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    🌐 Link Publik (Setelah Share)
                  </button>
                </div>
              </div>

              {/* QR Code Scan Section */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <span className="font-bold text-stone-700 dark:text-stone-300 text-xs mb-2">
                  Scan QR Code Ini dengan Kamera HP / Google Lens
                </span>
                <div className="p-2.5 bg-white rounded-xl shadow-xs border border-stone-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentSelectedUrl)}`}
                    alt="QR Code Link Aplikasi Kasir"
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-2 max-w-xs">
                  {activeUrlType === 'dev'
                    ? 'QR Code ini mengarah ke Link Sesi Aktif yang langsung aktif sekarang di HP Android Anda!'
                    : 'QR Code ini mengarah ke Link Publik setelah Anda menekan tombol Share di AI Studio.'}
                </p>
              </div>

              {/* Direct Link & Copy */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  Link Aplikasi Kasir:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={currentSelectedUrl}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-medium truncate ${
                      isDarkMode ? 'bg-stone-900 border-stone-700 text-emerald-400' : 'bg-stone-50 border-stone-300 text-emerald-700'
                    }`}
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                      isCopiedShareLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800'
                    }`}
                  >
                    {isCopiedShareLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick WhatsApp Share Button */}
              <div>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Halo, ini link aplikasi kasir ' + storeName + ' untuk dibuka di HP Android: ' + currentSelectedUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Kirim Link ke WhatsApp Saya / Karyawan</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </a>
              </div>

              {/* Step by step install as Android App */}
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] space-y-2 text-stone-700 dark:text-stone-300">
                <div className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Jadikan Aplikasi Layar Penuh di Android (Add to Home screen):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 dark:text-stone-400">
                  <li>Buka link di browser <strong>Google Chrome</strong> di HP Android Anda.</li>
                  <li>Ketuk tombol <strong>titik tiga (⋮)</strong> di pojok kanan atas browser Chrome.</li>
                  <li>Pilih menu <strong>"Tambahkan ke Layar Utama" (Add to Home screen)</strong> atau <strong>"Instal Aplikasi"</strong>.</li>
                  <li>Selesai! Ikon aplikasi kasir akan langsung muncul di menu HP Anda dan berjalan <strong>layar penuh (fullscreen)</strong>.</li>
                </ol>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
