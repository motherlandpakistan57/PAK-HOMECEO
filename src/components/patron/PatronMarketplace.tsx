import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory, PaymentMethod, Order, ProductAvailability } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';
import { Stepper } from '../ui/Stepper';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Avatar } from '../ui/Avatar';
import {
  ShoppingBag,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Eye,
  CreditCard,
  MessageSquare,
  Sparkles,
  ArrowRight,
  User,
  HeartHandshake,
  Search,
  Filter,
  X,
  Plus,
  Minus,
  Trash2,
  Bookmark,
  Share2,
  Compass,
  Layers,
  MapPin,
  Clock,
  Award,
  Check,
} from 'lucide-react';
import { OrderBriefModal } from './OrderBriefModal';
import { VisualReferenceModal } from '../visuals/VisualReferenceModal';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';
import { useLanguage } from '../../context/LanguageContext';

interface CartItem {
  product: Product;
  quantity: number;
}

export interface PatronMarketplaceProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const PatronMarketplace: React.FC<PatronMarketplaceProps> = ({
  activeTab: externalTab,
  setActiveTab: setExternalTab,
}) => {
  const { t, language } = useLanguage();
  const {
    products,
    orders,
    placeOrder,
    submitOrderFeedback,
    skillPartners,
    metrics,
    showToast,
    switchRole,
  } = useApp();

  // Navigation tab: 'home' | 'discovery' | 'orders' | 'impact'
  const [internalTab, setInternalTab] = useState<'home' | 'discovery' | 'orders' | 'impact'>('home');
  const currentTab = (externalTab as 'home' | 'discovery' | 'orders' | 'impact') || internalTab;
  const setTab = setExternalTab ? (t: string) => setExternalTab(t) : setInternalTab;

  // Discovery Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('ALL');
  const [selectedProducer, setSelectedProducer] = useState<string>('ALL');
  const [priceRange, setPriceRange] = useState<'ALL' | 'under2500' | '2500to6000' | 'over6000'>('ALL');

  // Product Detail Modal state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Intelligent Order & Pre-Order Brief Questionnaire Modal state
  const [briefModalProduct, setBriefModalProduct] = useState<Product | null>(null);
  const [isPreOrderBrief, setIsPreOrderBrief] = useState(false);
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);

  const handleOpenBrief = (product: Product, preOrder: boolean = false) => {
    setBriefModalProduct(product);
    setIsPreOrderBrief(preOrder);
  };

  const handleBriefSuccess = (order: Order) => {
    setBriefModalProduct(null);
    setDetailProduct(null);
    setConfirmedOrder(order);
  };

  // Saved / Wishlist items
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout info
  const [customerName, setCustomerName] = useState('Amina Siddiqui');
  const [customerCity, setCustomerCity] = useState('Islamabad');
  const [customerPhone, setCustomerPhone] = useState('0300-9844921');
  const [customerAddress, setCustomerAddress] = useState('House 14-B, Street 32, Sector F-7/2');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');

  // Confirmed Order State for Modal
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Feedback State
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);
  const deliveryFee = cartSubtotal > 10000 || cart.length === 0 ? 0 : 250;
  const cartTotal = cartSubtotal + deliveryFee;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add to cart
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added "${product.title}" to cart.`, 'success', 'Cart Updated');
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  // Toggle Save / Wishlist
  const handleToggleSave = (productId: string) => {
    setSavedProductIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your collection!', 'success', 'Saved');
        return [...prev, productId];
      }
    });
  };

  // Place Order from Cart (Closed Loop Trigger)
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Place the primary order with the first item or aggregated title
    const primaryItem = cart[0];
    const orderTitle =
      cart.length > 1
        ? `${primaryItem.product.title} + ${cart.length - 1} other item(s)`
        : primaryItem.product.title;

    const newOrder = placeOrder({
      productId: primaryItem.product.id,
      quantity: primaryItem.quantity,
      customerName,
      customerCity,
      customerPhone,
      customerAddress,
      paymentMethod,
    });

    // Clear cart and show order confirmation
    setCart([]);
    setIsCartOpen(false);
    setConfirmedOrder(newOrder);
    showToast(`Order ${newOrder.trackingNumber} placed successfully!`, 'success', 'Order Confirmed');
  };

  // Instant 1-click Order Now from detail
  const handleDirectOrderNow = (product: Product) => {
    const newOrder = placeOrder({
      productId: product.id,
      quantity: 1,
      customerName,
      customerCity,
      customerPhone,
      customerAddress,
      paymentMethod,
    });
    setDetailProduct(null);
    setConfirmedOrder(newOrder);
    showToast(`Order placed for ${product.title}!`, 'success', 'Order Confirmed');
  };

  // Submit Feedback
  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackOrderId) return;
    submitOrderFeedback(feedbackOrderId, feedbackRating, feedbackComment);
    setFeedbackOrderId(null);
    setFeedbackComment('');
    showToast('Thank you for rating your handmade piece!', 'success', 'Feedback Submitted');
  };

  // Filtered products for Discovery
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.producerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.craftHeritage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    const matchesAvailability =
      selectedAvailability === 'ALL' ||
      (selectedAvailability === 'in_stock' && p.stockReadyUnits > 0) ||
      (selectedAvailability === 'made_to_order' && p.availability === 'made_to_order');

    const matchesProducer = selectedProducer === 'ALL' || p.producerId === selectedProducer;

    const matchesPrice =
      priceRange === 'ALL' ||
      (priceRange === 'under2500' && p.pricePKR < 2500) ||
      (priceRange === '2500to6000' && p.pricePKR >= 2500 && p.pricePKR <= 6000) ||
      (priceRange === 'over6000' && p.pricePKR > 6000);

    return matchesSearch && matchesCategory && matchesAvailability && matchesProducer && matchesPrice;
  });

  // Featured products (top 3)
  const featuredProducts = products.slice(0, 3);
  const newThisWeek = products.slice(2, 5);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A2E22] font-sans">
      {/* Top Marketplace Navigation Bar */}
      <div className="bg-white border-b border-stone-200/90 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#01411C] block">
                PAK-HOMECEO
              </span>
              <span className="text-base font-extrabold text-[#1A2E22] leading-none">
                Citizen Marketplace
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTab('home')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'home'
                    ? 'bg-[#01411C] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Marketplace Home
              </button>

              <button
                type="button"
                onClick={() => setTab('discovery')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'discovery'
                    ? 'bg-[#01411C] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Discover Products ({products.length})
              </button>

              <button
                type="button"
                onClick={() => setTab('orders')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'orders'
                    ? 'bg-[#01411C] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>Track Orders</span>
                {orders.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    currentTab === 'orders' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTab('impact')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'impact'
                    ? 'bg-[#01411C] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Verified Impact
              </button>
            </nav>
          </div>

          {/* Cart & Visual Library Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsVisualModalOpen(true)}
              className="text-xs font-bold text-[#01411C] hover:text-[#01411C]/80 px-2.5 py-1.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] hover:bg-[#DCFCE7] transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
              title="Open Official Visual Reference Library"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Visual Library</span>
            </button>

            <Button
              onClick={() => setIsCartOpen(true)}
              variant="outline"
              size="sm"
              className="relative font-bold"
              leftIcon={<ShoppingBag className="w-4 h-4 text-[#01411C]" />}
            >
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#01411C] text-white text-[10px] font-mono">
                  {totalCartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="md:hidden flex items-center justify-around border-t border-stone-100 py-2 px-3 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setTab('home')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'home' ? 'bg-[#01411C] text-white' : 'text-stone-600'}`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setTab('discovery')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'discovery' ? 'bg-[#01411C] text-white' : 'text-stone-600'}`}
          >
            Discover
          </button>
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'orders' ? 'bg-[#01411C] text-white' : 'text-stone-600'}`}
          >
            Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('impact')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'impact' ? 'bg-[#01411C] text-white' : 'text-stone-600'}`}
          >
            Impact
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ========================================================================= */}
        {/* 1. HOME VIEW (Mandated Sections: Featured, Meet Makers, Categories, New, Impact) */}
        {/* ========================================================================= */}
        {currentTab === 'home' && (
          <div className="space-y-14">
            {/* Banner: Commerce First with Genuine Human Value */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-12 shadow-xl border border-stone-800">
              <img
                src={OFFICIAL_VISUAL_LIBRARY.bazaar_commerce.imageUrl}
                alt="Lahore Old City Community Commerce & Bazaar Discovery"
                className="absolute inset-0 w-full h-full object-cover opacity-30 filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#01411C]/60" />
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#BBF7D0] px-3 py-1 rounded-full bg-[#01411C]/80 border border-[#BBF7D0]/30 inline-block backdrop-blur-xs">
                    Verified Pakistani Craftsmanship
                  </span>
                  <span className="text-[10px] text-stone-300 font-mono">
                    Local Bazaar → Citizen Discovery
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight font-sans">
                  Authentic Crafts with Human Dignity at the Center
                </h1>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  Every product is produced directly by an experienced woman artisan in Pakistan.
                  Transparent value allocation guarantees ~70% direct compensation to her mobile wallet.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Button
                    onClick={() => setTab('discovery')}
                    variant="executiveGreen"
                    size="md"
                    className="font-bold shadow-md"
                  >
                    <span>Browse All Collections</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* SECTION 1: FEATURED PRODUCTS */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22]">
                    Featured Products
                  </h2>
                  <p className="text-xs text-[#4A5D52]">
                    Curated heirloom pieces crafted with generational technique
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('discovery')}
                  className="text-xs font-bold text-[#01411C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredProducts.map((p) => (
                  <ProductCardItem
                    key={p.id}
                    product={p}
                    onViewProduct={() => setDetailProduct(p)}
                    onAddToCart={() => handleAddToCart(p)}
                    onOrderNow={() => handleOpenBrief(p, p.stockReadyUnits <= 0)}
                    isSaved={savedProductIds.includes(p.id)}
                    onToggleSave={() => handleToggleSave(p.id)}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 2: MEET THE MAKERS (Approved Story & Skill without Private Info) */}
            <section className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22]">
                  Meet the Makers
                </h2>
                <p className="text-xs text-[#4A5D52]">
                  Understanding who made your craft, what mastery created it, and why your purchase matters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {skillPartners.map((maker) => (
                  <div
                    key={maker.id}
                    className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Avatar name={maker.name} size="lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-800">
                              {maker.anonymizedCode}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-stone-500">
                              {maker.city}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-[#1A2E22]">{maker.name}</h4>
                          <span className="text-[9px] text-[#01411C] font-semibold block">
                            Fictional Demo Reference
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579] block">
                          Lifelong Skill
                        </span>
                        <p className="text-xs text-stone-700 font-medium line-clamp-2">
                          {maker.skillTitle}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#01411C] block">
                          Why It Matters
                        </span>
                        <p className="text-[11px] text-stone-600 line-clamp-3 leading-relaxed">
                          With {maker.craftExperienceYears} years of mastery, your purchase directly restores domestic dignity and income without leaving home.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Completed Orders: <strong>{maker.completedOrdersCount}</strong></span>
                      <span className="text-amber-700 font-bold">★ {maker.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: POPULAR CATEGORIES */}
            <section className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22]">
                  Popular Categories
                </h2>
                <p className="text-xs text-[#4A5D52]">
                  Explore craft disciplines across heritage textiles, sun-cured foods, and knowledge archives
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    cat: 'HUNAR' as ProductCategory,
                    title: 'HOMECEO HUNAR (ہنر)',
                    desc: 'Handcrafted textiles, Multani Kashidakari, Sindhi Ajrak, and pottery.',
                    icon: '✂️',
                  },
                  {
                    cat: 'RASOI' as ProductCategory,
                    title: 'HOMECEO MENUE (مینو)',
                    desc: 'Sun-cured Sargodha mango achar, raw Potohar honey, and walnut confections.',
                    icon: '🍯',
                  },
                  {
                    cat: 'KNOWLEDGE' as ProductCategory,
                    title: 'HOMECEO KNOWLEDGE (علم)',
                    desc: 'Generational recipes, masterclass guides, and ancestral pattern blueprints.',
                    icon: '📖',
                  },
                  {
                    cat: 'SERVICES' as ProductCategory,
                    title: 'HOMECEO SERVICES (خدمات)',
                    desc: 'Doorstep custom fitting, garment alteration, and trusted community care.',
                    icon: '🧵',
                  },
                ].map((item) => (
                  <div
                    key={item.cat}
                    onClick={() => {
                      setSelectedCategory(item.cat);
                      setTab('discovery');
                    }}
                    className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-[#01411C] shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-2xl block">{item.icon}</span>
                    <h3 className="font-extrabold text-sm text-[#1A2E22] group-hover:text-[#01411C] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#4A5D52] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>



            {/* SECTION 5: IMPACT */}
            <section className="p-8 bg-[#F0FDF4] rounded-3xl border-2 border-[#BBF7D0] space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#01411C]">
                  Real Commercial Proof
                </span>
                <h2 className="text-2xl font-extrabold text-[#01411C]">
                  How Your Purchase Directly Changes Lives
                </h2>
                <p className="text-xs text-[#1A2E22] leading-relaxed">
                  We operate with transparent ledgers. The social impact strengthens the purchase—it does not replace product value.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#BBF7D0] text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Direct Payout Rate</span>
                  <span className="text-2xl font-extrabold font-mono text-[#01411C]">~70%</span>
                  <span className="text-[10px] text-stone-600 block">To home artisan wallet</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#BBF7D0] text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Total Earnings Paid</span>
                  <span className="text-2xl font-extrabold font-mono text-[#01411C]">
                    PKR {(metrics.totalIncomeGeneratedPKR / 1000000).toFixed(2)}M
                  </span>
                  <span className="text-[10px] text-stone-600 block">Cashless escrow verified</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#BBF7D0] text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Quality Verified</span>
                  <span className="text-2xl font-extrabold font-mono text-[#01411C]">100%</span>
                  <span className="text-[10px] text-stone-600 block">Doorstep 6-point audit</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#BBF7D0] text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Repeat Citizens</span>
                  <span className="text-2xl font-extrabold font-mono text-[#01411C]">{metrics.repeatPatronsRate}%</span>
                  <span className="text-[10px] text-stone-600 block">Product-first retention</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. DISCOVERY VIEW (Search, Categories, Filters: Price, Avail, Producer)   */}
        {/* ========================================================================= */}
        {currentTab === 'discovery' && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Explore Verified Craft Collections
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Filter by craft category, price, availability, and master producer attribution.
              </p>
            </div>

            {/* Discovery Control Bar: Search & Category Chips */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title, artisan, craft technique, or city..."
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-stone-300 rounded-2xl bg-white focus:outline-none focus:border-[#01411C] shadow-xs"
                />
              </div>

              {/* Category selector chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {(['ALL', 'HUNAR', 'RASOI', 'KNOWLEDGE', 'SERVICES'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#01411C] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    {cat === 'ALL'
                      ? 'All Disciplines'
                      : cat === 'HUNAR'
                      ? 'Hunar (Crafts & Needlework)'
                      : cat === 'RASOI'
                      ? 'Rasoi (Sun-Cured Preserves)'
                      : cat === 'KNOWLEDGE'
                      ? 'Knowledge (Recipe Archives)'
                      : 'Services (Bespoke Fitting)'}
                  </button>
                ))}
              </div>

              {/* Advanced Filter Row (Price, Availability, Producer) */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 flex flex-wrap items-center gap-4 text-xs">
                {/* Price Filter */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-600">Price:</span>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="p-1.5 text-xs border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    <option value="ALL">All Price Ranges</option>
                    <option value="under2500">Under PKR 2,500</option>
                    <option value="2500to6000">PKR 2,500 – 6,000</option>
                    <option value="over6000">Above PKR 6,000</option>
                  </select>
                </div>

                {/* Availability Filter */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-600">Availability:</span>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="p-1.5 text-xs border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    <option value="ALL">All Availability</option>
                    <option value="in_stock">Ready in Stock</option>
                    <option value="made_to_order">Made to Order (Batched)</option>
                  </select>
                </div>

                {/* Producer Filter */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-600">Producer:</span>
                  <select
                    value={selectedProducer}
                    onChange={(e) => setSelectedProducer(e.target.value)}
                    className="p-1.5 text-xs border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    <option value="ALL">All Master Producers</option>
                    {skillPartners.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name} ({sp.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear filters */}
                {(searchQuery || selectedCategory !== 'ALL' || selectedAvailability !== 'ALL' || selectedProducer !== 'ALL' || priceRange !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                      setSelectedAvailability('ALL');
                      setSelectedProducer('ALL');
                      setPriceRange('ALL');
                    }}
                    className="text-xs text-red-600 font-bold hover:underline cursor-pointer ml-auto"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Discovery Products Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Showing <strong>{filteredProducts.length}</strong> matching verified crafts</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
                  <p className="text-stone-500 text-sm">No crafts found matching the selected filters.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                      setSelectedAvailability('ALL');
                      setSelectedProducer('ALL');
                      setPriceRange('ALL');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCardItem
                      key={p.id}
                      product={p}
                      onViewProduct={() => setDetailProduct(p)}
                      onAddToCart={() => handleAddToCart(p)}
                      onOrderNow={() => handleOpenBrief(p, p.stockReadyUnits <= 0)}
                      isSaved={savedProductIds.includes(p.id)}
                      onToggleSave={() => handleToggleSave(p.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ORDERS & REAL-TIME CLOSED-LOOP TRACKING                                */}
        {/* ========================================================================= */}
        {currentTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                  Your Closed-Loop Orders ({orders.length})
                </h2>
                <p className="text-xs sm:text-sm text-[#4A5D52]">
                  Live physical tracking: see every step from artisan loom to connector quality audit to your doorstep.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setTab('discovery')}
              >
                Continue Shopping
              </Button>
            </div>

            {/* Closed Loop Architecture Callout */}
            <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#01411C]">
              <div>
                <span className="font-extrabold block">Closed-Loop Order Fulfillment Guarantees:</span>
                <span className="text-[#4A5D52]">
                  Your order is verified by Product Manager Zainab Malik → Produced by Master Artisans → Doorstep QA audited by Field Connector Fatima → Real-time tracking delivered to your door.
                </span>
              </div>
              <span className="shrink-0 px-3 py-1 bg-white border border-[#BBF7D0] rounded-xl text-[11px] font-bold text-[#01411C] flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Closed Loop</span>
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-extrabold text-stone-800 text-base">No Orders Yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Browse our authentic collections and place your first patron order with direct artisan attribution.
                </p>
                <Button
                  onClick={() => setTab('discovery')}
                  variant="executiveGreen"
                  size="md"
                >
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6 space-y-5 border-2 border-stone-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {order.trackingNumber}
                          </span>
                          <StatusBadge status={order.status} type="order" />
                          <StatusBadge status={order.paymentStatus} type="payment" />
                        </div>
                        <h4 className="text-base font-extrabold text-stone-900 mt-1">
                          {order.productTitle} × {order.quantity} Unit(s)
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Maker: <strong>{order.skillPartnerName}</strong> ({order.skillPartnerCode}) · Field Connector: {order.connectorName}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-lg font-mono font-extrabold text-stone-900 block">
                          PKR {order.totalPKR.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-[#01411C]">
                          Artisan Share: PKR {order.payoutAmountPKR.toLocaleString()} (70%)
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {order.payoutReleased ? 'Direct Payout Released ✓' : 'Held in Escrow until Delivery'}
                        </span>
                      </div>
                    </div>

                    {/* Stepper with Live Stages */}
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 block mb-2">Live Fulfillment Milestones:</span>
                      <Stepper currentStatus={order.status} />
                    </div>

                    {/* Delivery Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Delivery Address</span>
                        <p className="font-medium text-stone-800">{order.customerAddressMasked}, {order.customerCity}</p>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Estimated Delivery</span>
                        <p className="font-medium text-stone-800">{order.estimatedDeliveryDate} via Inspected Courier</p>
                      </div>
                    </div>

                    {/* Quality Review if Delivered */}
                    {order.status === 'delivered' && (
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        {order.feedback ? (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex-1">
                            <span className="font-bold text-emerald-900">Your Review ({order.feedback.rating}/5 ★):</span>
                            <span className="text-stone-700 italic ml-1">"{order.feedback.comment}"</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                            onClick={() => setFeedbackOrderId(order.id)}
                          >
                            Submit Craft Review
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. IMPACT PROOF VIEW                                                      */}
        {/* ========================================================================= */}
        {currentTab === 'impact' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Ecosystem Impact & Transparency
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Audit-verified telemetry demonstrating direct economic empowerment of Pakistani women.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Direct Artisan Earnings"
                value={`PKR ${(metrics.totalIncomeGeneratedPKR / 1000000).toFixed(2)}M`}
                sublabel="~70% paid into artisan wallets"
                variant="executiveGreen"
                icon={<Award className="w-5 h-5 text-white" />}
              />
              <StatCard
                label="Women Producers"
                value={`${metrics.womenEngaged}+`}
                sublabel="Across 4 craft clusters"
                variant="lightGreen"
                icon={<User className="w-5 h-5 text-[#01411C]" />}
              />
              <StatCard
                label="Orders Delivered"
                value={metrics.ordersCompleted}
                sublabel="100% Doorstep QC Pass"
                variant="default"
                icon={<CheckCircle2 className="w-5 h-5 text-stone-700" />}
              />
              <StatCard
                label="Repeat Citizens"
                value={`${metrics.repeatPatronsRate}%`}
                sublabel="Sustained organic retention"
                variant="ochre"
                icon={<Sparkles className="w-5 h-5 text-amber-800" />}
              />
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PRODUCT DETAIL MODAL (Exact Mandated Structure)                           */}
      {/* Product -> Info -> Producer -> Story -> Craft -> Price -> Avail -> Delivery -> Impact */}
      {/* ========================================================================= */}
      {detailProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 font-sans"
          onClick={() => setDetailProduct(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                  {detailProduct.category}
                </span>
                <span className="text-xs font-bold text-[#01411C]">Authentic Handcrafted Piece</span>
              </div>
              <button
                type="button"
                onClick={() => setDetailProduct(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Structured Product Details */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Product Visual & Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={detailProduct.imageUrl}
                    alt={detailProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#1A2E22] leading-snug">
                      {detailProduct.title}
                    </h2>
                    <p className="text-stone-500 text-xs mt-1">
                      {detailProduct.subCategory} · {detailProduct.city} Cluster
                    </p>
                  </div>

                  {/* Price & Artisan Split */}
                  <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Price</span>
                      <span className="text-2xl font-extrabold font-mono text-[#01411C]">
                        PKR {detailProduct.pricePKR.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#01411C] block">Direct Artisan Share</span>
                      <span className="text-sm font-bold font-mono text-[#01411C]">
                        PKR {Math.round((detailProduct.pricePKR * detailProduct.artisanSplitPercent) / 100).toLocaleString()} (70%)
                      </span>
                    </div>
                  </div>

                  {/* Availability & Delivery */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold">Availability</span>
                      <strong className="text-stone-900">
                        {detailProduct.stockReadyUnits > 0 ? `${detailProduct.stockReadyUnits} Ready in Stock` : 'Made to Order (Batched)'}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold">Delivery Time</span>
                      <strong className="text-stone-900">3-5 Business Days Doorstep</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-1.5 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] uppercase font-extrabold text-[#718579] tracking-wider block">
                  Product Description & Specifications
                </span>
                <p className="text-stone-700 leading-relaxed text-xs">
                  {detailProduct.description}
                </p>
              </div>

              {/* Producer & Short Approved Story (Who made this? What skill? Why it matters? Zero private info) */}
              <div className="p-5 bg-white rounded-2xl border-2 border-[#BBF7D0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center font-bold text-[#01411C]">
                      {detailProduct.producerCode.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1A2E22]">{detailProduct.producerName}</h4>
                      <p className="text-[11px] text-stone-500">Master Producer ({detailProduct.producerCode}) · {detailProduct.city}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-[#01411C] bg-[#DCFCE7] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                    Verified Skill Partner
                  </span>
                </div>

                <div className="space-y-2 pt-1 border-t border-stone-100 text-xs">
                  <div>
                    <strong className="text-[#01411C]">Who made this?</strong>
                    <p className="text-stone-700 mt-0.5">
                      Handcrafted by {detailProduct.producerName}, working with lifelong dedication from her family courtyard in {detailProduct.city}.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#01411C]">What skill created it?</strong>
                    <p className="text-stone-700 mt-0.5">
                      {detailProduct.craftHeritage}. Counted resham silk needlework and authentic natural techniques preserved across generations.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#01411C]">Why does it matter?</strong>
                    <p className="text-stone-700 mt-0.5">
                      Your purchase provides direct, dignified income in later life, replacing isolation with purpose and national participation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Craft/Process */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-[#718579] tracking-wider block">
                  Craft Process & Materials
                </span>
                <p className="text-stone-700 text-xs leading-relaxed">
                  Raw materials inspected and certified by local field connectors. Verified zero chemical additives or machine shortcuts.
                </p>
              </div>
            </div>

            {/* Modal Actions Footer: Order Now & Save */}
            <div className="p-5 border-t border-stone-200 bg-[#FAF9F6] flex items-center justify-between gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<Bookmark className="w-4 h-4" />}
                onClick={() => handleToggleSave(detailProduct.id)}
              >
                {savedProductIds.includes(detailProduct.id) ? 'Saved in Wishlist' : 'Save'}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    handleAddToCart(detailProduct);
                    setDetailProduct(null);
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="border-amber-600 text-amber-900 hover:bg-amber-50"
                  onClick={() => handleOpenBrief(detailProduct, true)}
                >
                  Pre-Order Batch
                </Button>

                <Button
                  type="button"
                  variant="executiveGreen"
                  size="md"
                  className="font-bold shadow-md"
                  onClick={() => handleOpenBrief(detailProduct, false)}
                >
                  Order Now (PKR {detailProduct.pricePKR.toLocaleString()})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CART DRAWER (Quantity, Remove, Price summary, Delivery, Total, Place Order)*/}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150 font-sans"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#01411C]" />
                <h3 className="font-extrabold text-[#1A2E22] text-base">Your Cart ({totalCartCount})</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-stone-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex gap-3 items-center justify-between"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-stone-900 truncate">{item.product.title}</h4>
                      <p className="text-[11px] text-stone-500">Maker: {item.product.producerName}</p>
                      <span className="font-mono font-bold text-[#01411C] text-xs">
                        PKR {item.product.pricePKR.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(item.product.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white border border-stone-300 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-stone-600" />
                      </button>
                      <span className="font-mono font-bold text-xs px-1">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(item.product.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-stone-300 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-stone-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="p-1 text-stone-400 hover:text-red-600 ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Delivery Details Form */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <span className="font-bold text-stone-800 text-xs block">Delivery & Contact Details:</span>
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-0.5">Your Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-0.5">City</label>
                      <input
                        type="text"
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full p-2 text-xs border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-0.5">Phone Number</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2 text-xs border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-0.5">Street Address</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full p-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-0.5">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full p-2 text-xs border border-stone-300 rounded-xl bg-white font-medium"
                    >
                      <option value="jazzcash">JazzCash Mobile Wallet (Escrow Secured)</option>
                      <option value="easypaisa">EasyPaisa (Escrow Secured)</option>
                      <option value="cod">Cash on Delivery (Courier Doorstep)</option>
                      <option value="bank_transfer">Direct Online Bank Transfer</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Summary & Place Order Action */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-[#FAF9F6] space-y-3 text-xs">
                <div className="space-y-1.5 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-stone-900">PKR {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery (Inspected Courier)</span>
                    <span className="font-mono font-bold text-stone-900">
                      {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#1A2E22] pt-2 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span className="font-mono text-[#01411C]">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckoutSubmit}
                  variant="executiveGreen"
                  size="lg"
                  className="w-full font-bold shadow-md"
                >
                  <span>Place Order (PKR {cartTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER CONFIRMATION MODAL (Mandated: Order Confirmed, Number, Items, etc.)  */}
      {/* ========================================================================= */}
      {confirmedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 font-sans"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border-2 border-[#BBF7D0] flex items-center justify-center mx-auto text-[#01411C]">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#01411C] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#BBF7D0]">
                Closed-Loop Order Placed
              </span>
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Order Confirmed
              </h2>
              <p className="text-xs text-[#4A5D52]">
                Thank you, {confirmedOrder.customerName}. Your order has entered the operational closed-loop system!
              </p>
            </div>

            {/* Order Summary Details */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-stone-500">Order Number:</span>
                <strong className="text-stone-900">{confirmedOrder.trackingNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Items:</span>
                <strong className="text-stone-900">{confirmedOrder.productTitle} × {confirmedOrder.quantity}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Amount:</span>
                <strong className="font-mono text-[#01411C] text-sm">PKR {confirmedOrder.totalPKR.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Expected Delivery:</span>
                <strong className="text-stone-900">{confirmedOrder.estimatedDeliveryDate}</strong>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                <span className="text-stone-500">Current Status:</span>
                <StatusBadge status={confirmedOrder.status} type="order" />
              </div>
            </div>

            {/* Closed Loop Explanation Banner */}
            <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] text-left text-[11px] text-[#01411C] space-y-1">
              <span className="font-bold block">Next Operational Step:</span>
              <p className="text-stone-600">
                Dispatched immediately to Product Manager Zainab Malik for batch verification and artisan queue allocation.
              </p>
            </div>

            {/* Actions: Track Order & Close */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                variant="executiveGreen"
                size="md"
                className="w-full font-bold"
                onClick={() => {
                  setConfirmedOrder(null);
                  setTab('orders');
                }}
              >
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {feedbackOrderId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-extrabold text-stone-900">Review Your Handcrafted Piece</h3>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= feedbackRating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Share your appreciation for the artisan's technique and finish..."
              className="w-full p-3 text-xs border border-stone-300 rounded-xl"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setFeedbackOrderId(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="executiveGreen" onClick={handleSendFeedback}>
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Intelligent Order Brief Questionnaire Modal */}
      <OrderBriefModal
        product={briefModalProduct}
        isPreOrder={isPreOrderBrief}
        isOpen={!!briefModalProduct}
        onClose={() => setBriefModalProduct(null)}
        onSuccess={handleBriefSuccess}
      />

      {/* Official Visual Reference Modal */}
      <VisualReferenceModal
        isOpen={isVisualModalOpen}
        onClose={() => setIsVisualModalOpen(false)}
      />
    </div>
  );
};

export const CitizenMarketplace = PatronMarketplace;

// =========================================================================
// REUSABLE PRODUCT CARD ITEM (Mandated by Section: Product Card)
// Display: Product image, Product name, Producer, Price, Availability, Story indicator
// CTA: View Product
// =========================================================================
interface ProductCardItemProps {
  product: Product;
  onViewProduct: () => void;
  onAddToCart: () => void;
  onOrderNow?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

const ProductCardItem: React.FC<ProductCardItemProps> = ({
  product,
  onViewProduct,
  onAddToCart,
  onOrderNow,
  isSaved,
  onToggleSave,
}) => {
  const isAvailable = product.stockReadyUnits > 0;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#01411C]/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 bg-[#01411C]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs">
            {product.category}
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs ${
                isAvailable ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {isAvailable ? 'In Stock' : 'Batch Order'}
            </span>

            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave();
                }}
                className={`p-1.5 rounded-full backdrop-blur-md cursor-pointer transition-colors ${
                  isSaved ? 'bg-amber-500 text-white' : 'bg-stone-900/60 text-white hover:bg-stone-900'
                }`}
                title={isSaved ? 'Saved' : 'Save Item'}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2.5">
          {/* Producer attribution */}
          <div className="flex items-center justify-between text-xs text-[#718579]">
            <span className="font-bold text-[#1A2E22] truncate">
              {product.producerName} ({product.city})
            </span>
            <span className="flex items-center gap-0.5 text-amber-600 font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" /> {product.rating}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-extrabold text-[#1A2E22] leading-snug line-clamp-2">
            {product.title}
          </h3>

          {/* Story Indicator (Approved excerpt showing human connection) */}
          <p className="text-xs text-[#4A5D52] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Heritage Tag */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#01411C] bg-[#F0FDF4] px-2.5 py-1 rounded-lg border border-[#BBF7D0] truncate">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{product.craftHeritage}</span>
          </div>
        </div>
      </div>

      {/* Price & View Product CTA Footer */}
      <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
            Price
          </span>
          <span className="text-lg font-extrabold font-mono text-[#01411C]">
            PKR {product.pricePKR.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onViewProduct}
            className="text-xs"
          >
            View Product
          </Button>

          {onOrderNow && (
            <Button
              size="sm"
              variant="executiveGreen"
              onClick={onOrderNow}
              className="text-xs font-bold shadow-2xs"
            >
              {isAvailable ? 'Order' : 'Pre-Order'}
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={onAddToCart}
            className="p-1.5 text-stone-600 hover:text-[#01411C]"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
