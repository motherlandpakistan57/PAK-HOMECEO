import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Button } from '../ui/Button';
import {
  ArrowLeft,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Layers,
  MapPin,
  TrendingUp,
  Bookmark,
} from 'lucide-react';
import { OrderBriefModal } from '../patron/OrderBriefModal';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, showToast } = useApp();
  const navigate = useNavigate();
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const product = products.find((p) => p.id === id) || products[0];

  const handleBriefSuccess = (order: any) => {
    setIsBriefModalOpen(false);
    showToast(`Order brief submitted! Tracking code: ${order.trackingNumber}`, 'success', 'Order Confirmed');
    navigate(`/orders/${order.id}`);
  };

  return (
    <PageContainer
      kicker={`Catalog / ${product.category}`}
      title={product.title}
      description={`${product.city} · ${product.subCategory} · Handcrafted by ${product.producerName}`}
      secondaryActions={
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A5D52] hover:text-[#01411C] px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#BBF7D0] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* Left: Product Visual & Verification Banner */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-4/3 shadow-xs">
            <ImageWithFallback
              src={product.imageUrl}
              alt={product.title}
              iconType={product.imageIcon}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Transparent Cost Allocation Card */}
          <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#01411C] uppercase tracking-wider">
                Transparent Value Allocation
              </span>
              <span className="text-xs font-extrabold text-[#01411C]">
                PKR {product.pricePKR.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#1A2E22]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#01411C]" />
                  <span>Direct to Home Artisan ({product.artisanSplitPercent}%)</span>
                </span>
                <span className="font-bold tabular-nums">
                  PKR {Math.round((product.pricePKR * product.artisanSplitPercent) / 100).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#4A5D52]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Enterprise Ops & QC Margin ({product.builderMarginPercent}%)</span>
                </span>
                <span className="tabular-nums">
                  PKR {Math.round((product.pricePKR * product.builderMarginPercent) / 100).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#4A5D52]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Community Connector Logistics ({product.connectorFeePercent}%)</span>
                </span>
                <span className="tabular-nums">
                  PKR {Math.round((product.pricePKR * product.connectorFeePercent) / 100).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structure per Section 9 (Product -> Producer -> Story -> Craft -> Availability -> Price -> Order -> Impact) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Producer & Story */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#01411C]" />
                <span className="text-xs font-bold text-[#1A2E22]">{product.city} Household Cluster</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-stone-100 text-[#01411C] px-2 py-0.5 rounded border border-stone-200">
                {product.producerCode}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#718579]">
                Master Home Producer
              </h3>
              <p className="text-base font-extrabold text-[#1A2E22] mt-0.5">
                {product.producerName}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#718579]">
                Human Story & Heritage Connection
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5D52] mt-1.5 leading-relaxed">
                {product.story}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#718579]">
                Craftsmanship & Technique
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5D52] mt-1.5 leading-relaxed">
                {product.craftHeritage}
              </p>
            </div>
          </div>

          {/* Availability, Price & Order Action */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#718579]">Availability</span>
                <p className="text-xs font-bold text-[#01411C] mt-0.5">
                  {product.stockReadyUnits > 0
                    ? `${product.stockReadyUnits} Ready in Stock`
                    : 'Crafted on Batch Demand (3-5 Days)'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#718579]">Price</span>
                <p className="text-xl font-extrabold text-[#01411C] tabular-nums">
                  PKR {product.pricePKR.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsBriefModalOpen(true)}
                variant="executiveGreen"
                size="lg"
                className="flex-1 font-bold shadow-md"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                <span>{product.stockReadyUnits > 0 ? 'Order Now (Custom Brief)' : 'Pre-Order Brief'}</span>
              </Button>

              <Button
                onClick={() => {
                  setIsSaved(!isSaved);
                  showToast(isSaved ? 'Item removed from saved list.' : 'Item saved to your heritage wishlist!', 'info');
                }}
                variant="outline"
                size="lg"
                className={`font-semibold border-stone-300 ${isSaved ? 'text-[#01411C] bg-[#F0FDF4] border-[#BBF7D0]' : ''}`}
                title={isSaved ? 'Saved' : 'Save'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#01411C] text-[#01411C]' : ''}`} />
                <span className="ml-1.5 hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#718579] pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#01411C]" />
                <span>Escrow Protected (~70% to Maker)</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#01411C]" />
                <span>6-Point Quality Audit</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligent Order Brief Questionnaire Modal */}
      <OrderBriefModal
        product={product}
        isPreOrder={product.stockReadyUnits <= 0}
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        onSuccess={handleBriefSuccess}
      />
    </PageContainer>
  );
};
