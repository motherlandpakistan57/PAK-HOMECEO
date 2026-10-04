import React, { useState } from 'react';
import { Product, PaymentMethod, Order, OrderBriefData } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import {
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  CreditCard,
  Layers,
  ArrowRight,
  User,
  Phone,
  Home,
  AlertCircle,
} from 'lucide-react';

interface OrderBriefModalProps {
  product: Product | null;
  isPreOrder: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const OrderBriefModal: React.FC<OrderBriefModalProps> = ({
  product,
  isPreOrder,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { placeOrder, showToast } = useApp();
  const { t, isRtl, language } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [customizationRequirements, setCustomizationRequirements] = useState('');
  const [preferredDeliveryTiming, setPreferredDeliveryTiming] = useState(
    isPreOrder ? 'batch_release' : 'standard'
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Customer information
  const [customerName, setCustomerName] = useState('Amina Siddiqui');
  const [customerCity, setCustomerCity] = useState('Islamabad');
  const [customerPhone, setCustomerPhone] = useState('0300-9844921');
  const [customerAddress, setCustomerAddress] = useState('House 14-B, Street 32, Sector F-7/2');
  const [contactEmail, setContactEmail] = useState('amina.siddiqui@gmail.com');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');

  if (!isOpen || !product) return null;

  const totalPKR = product.pricePKR * quantity;
  const artisanSharePKR = Math.round((totalPKR * product.artisanSplitPercent) / 100);

  // Auto-synthesized structured brief summary
  const generateBriefSummary = () => {
    const parts = [
      `${quantity}x ${product.title}`,
      `Timing: ${
        preferredDeliveryTiming === 'urgent'
          ? 'Priority 3-Day Crafting'
          : preferredDeliveryTiming === 'batch_release'
          ? 'Next Batch Cluster Release'
          : 'Standard Handcrafted 5-7 Days'
      }`,
    ];
    if (customizationRequirements.trim()) {
      parts.push(`Customization: "${customizationRequirements.trim()}"`);
    }
    if (specialInstructions.trim()) {
      parts.push(`Notes: "${specialInstructions.trim()}"`);
    }
    return parts.join(' | ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerAddress.trim() || !customerPhone.trim()) {
      showToast('Please provide your name, phone and delivery address.', 'warning');
      return;
    }

    const briefData: OrderBriefData = {
      orderType: isPreOrder ? 'pre_order' : 'order',
      customizationRequirements: customizationRequirements.trim() || 'Standard craft blueprint specification',
      preferredDeliveryTiming:
        preferredDeliveryTiming === 'urgent'
          ? 'Priority Expedited (3-4 Days)'
          : preferredDeliveryTiming === 'batch_release'
          ? 'Next Scheduled Batch Release (10-14 Days)'
          : 'Standard Handcrafted (5-7 Days)',
      specialInstructions: specialInstructions.trim() || 'Standard safe packaging with artisan authenticity card.',
      additionalRequirements: additionalRequirements.trim(),
      contactEmail: contactEmail.trim(),
      briefSummary: generateBriefSummary(),
    };

    const newOrder = placeOrder({
      productId: product.id,
      quantity,
      customerName,
      customerCity,
      customerPhone,
      customerAddress,
      paymentMethod,
      isPreOrder,
      orderBrief: briefData,
      priority: preferredDeliveryTiming === 'urgent' ? 'high' : 'normal',
    });

    onSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#01411C] via-[#025c27] to-[#1A2E22] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{isPreOrder ? t('action.preOrder') : t('brief.title')}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {isPreOrder ? 'Pre-Order Handcrafted Batch' : 'Intelligent Order Brief'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl leading-relaxed">
            {t('brief.subtitle')}
          </p>
        </div>

        {/* Selected Product Card Banner */}
        <div className="bg-[#FAF9F6] border-b border-stone-200 p-4 sm:p-5 flex items-center gap-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shadow-2xs"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#01411C]/10 text-[#01411C]">
                {product.category}
              </span>
              <span className="text-xs text-[#4A5D52]">
                Crafted by <strong>{product.producerName}</strong> ({product.city})
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#1A2E22] truncate mt-0.5">
              {product.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="font-extrabold text-[#01411C]">
                PKR {product.pricePKR.toLocaleString()} / unit
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500">
                Direct to artisan: <strong>PKR {Math.round((product.pricePKR * product.artisanSplitPercent) / 100).toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[68vh] overflow-y-auto">
          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Quantity to Handcraft
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 font-mono font-extrabold text-sm text-[#1A2E22]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#4A5D52]">
                Total: <strong className="text-[#01411C] font-mono text-sm">PKR {totalPKR.toLocaleString()}</strong> ({product.artisanSplitPercent}% to {product.producerName})
              </span>
            </div>
          </div>

          {/* Customization Requirements */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t('brief.customization')}
              </label>
              <span className="text-[11px] text-[#01411C] font-semibold">Sent to Master Artisan</span>
            </div>
            <textarea
              rows={2}
              value={customizationRequirements}
              onChange={(e) => setCustomizationRequirements(e.target.value)}
              placeholder={t('brief.customizationPlaceholder')}
              className="w-full px-3.5 py-2.5 text-xs text-stone-800 bg-[#FAF9F6] border border-stone-300 rounded-2xl focus:outline-none focus:border-[#01411C] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Preferred Delivery Timing */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              {t('brief.timing')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  preferredDeliveryTiming === 'standard'
                    ? 'border-[#01411C] bg-[#F0FDF4] text-[#01411C] font-bold shadow-2xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Standard</span>
                  <input
                    type="radio"
                    name="timing"
                    value="standard"
                    checked={preferredDeliveryTiming === 'standard'}
                    onChange={(e) => setPreferredDeliveryTiming(e.target.value)}
                    className="accent-[#01411C]"
                  />
                </div>
                <span className="text-[11px] text-stone-500 font-normal">5-7 Days Handcraft</span>
              </label>

              <label
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  preferredDeliveryTiming === 'urgent'
                    ? 'border-[#01411C] bg-[#F0FDF4] text-[#01411C] font-bold shadow-2xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Expedited</span>
                  <input
                    type="radio"
                    name="timing"
                    value="urgent"
                    checked={preferredDeliveryTiming === 'urgent'}
                    onChange={(e) => setPreferredDeliveryTiming(e.target.value)}
                    className="accent-[#01411C]"
                  />
                </div>
                <span className="text-[11px] text-stone-500 font-normal">3-4 Days Priority</span>
              </label>

              <label
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  preferredDeliveryTiming === 'batch_release'
                    ? 'border-[#01411C] bg-[#F0FDF4] text-[#01411C] font-bold shadow-2xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Cluster Batch</span>
                  <input
                    type="radio"
                    name="timing"
                    value="batch_release"
                    checked={preferredDeliveryTiming === 'batch_release'}
                    onChange={(e) => setPreferredDeliveryTiming(e.target.value)}
                    className="accent-[#01411C]"
                  />
                </div>
                <span className="text-[11px] text-stone-500 font-normal">Next 10-14 Day Batch</span>
              </label>
            </div>
          </div>

          {/* Contact & Delivery Information */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              {t('brief.contactInfo')}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t('brief.fullName')}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t('brief.phone')}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t('brief.city')}
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C] bg-white cursor-pointer"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Bahawalpur">Bahawalpur</option>
                    <option value="Sargodha">Sargodha</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t('brief.address')}
                </label>
                <div className="relative">
                  <Home className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                    placeholder="Street, Sector/Mohallah, Landmark..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {t('brief.specialInstructions')}
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t('brief.specialInstructionsPlaceholder')}
              className="w-full px-3.5 py-2 text-xs text-stone-800 bg-[#FAF9F6] border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              {t('brief.paymentMethod')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'jazzcash', name: 'JazzCash Escrow' },
                { id: 'easypaisa', name: 'EasyPaisa' },
                { id: 'card', name: 'Debit/Credit Card' },
                { id: 'cod', name: 'Cash on Delivery' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-[#01411C] bg-[#F0FDF4] text-[#01411C] shadow-2xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Structured Order Brief Summary Box (Auto-generated) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <FileText className="w-3.5 h-3.5 text-amber-800" />
              <span>Structured Order Brief Summary</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed font-mono">
              {generateBriefSummary()}
            </p>
            <div className="text-[10px] text-amber-700/80 pt-1 border-t border-amber-200/60 flex items-center justify-between">
              <span>Transmitted directly to Product Manager & Artisan upon confirmation.</span>
              <span className="font-bold">~70% Escrow Direct</span>
            </div>
          </div>

          {/* Submission button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="executiveGreen"
              size="lg"
              className="w-full font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>{isPreOrder ? t('brief.submitPreOrder') : t('brief.submitOrder')}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              {t('impact.dignity')} · Real-time operational tracking assigned instantly
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
