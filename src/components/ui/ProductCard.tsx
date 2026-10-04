import React from 'react';
import { Product } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';
import { Button } from './Button';
import { Badge } from './Badge';
import { ShieldCheck, Star, Eye, ShoppingBag } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onSelectStory?: (product: Product) => void;
  onOrder?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectStory,
  onOrder,
  className = '',
}) => {
  const directArtisanPKR = Math.round((product.pricePKR * product.artisanSplitPercent) / 100);
  const isAvailable = product.stockReadyUnits > 0 || product.currentBatchOrders < product.minBatchUnits * 2;

  return (
    <div
      className={`bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#01411C]/40 transition-all duration-200 flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* 1. Product Image with Category Pill & Safety Certification */}
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.title}
            iconType={product.imageIcon}
            title={product.title}
            className="w-full h-52 group-hover:scale-105 transition-transform duration-300 object-cover"
          />

          {/* Category Tag */}
          <div className="absolute top-3 left-3 bg-[#01411C]/90 backdrop-blur-xs text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
            {product.category === 'RASOI' ? 'HOMECEO RASOI' : `HOMECEO ${product.category}`}
          </div>

          {/* Availability Badge */}
          <div className="absolute top-3 right-3">
            {isAvailable ? (
              <Badge variant="lightGreen" dot size="sm">
                Ready in Batch
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                Next Cycle
              </Badge>
            )}
          </div>
        </div>

        {/* 2. Product Name, Producer, Story Indicator & Breakdown */}
        <div className="p-5">
          {/* Producer & Location with Rating */}
          <div className="flex items-center justify-between text-xs text-[#718579] mb-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-[#1A2E22] truncate">{product.producerName}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{product.city}</span>
            </div>
            <span className="flex items-center gap-0.5 text-amber-600 font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" /> {product.rating}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-extrabold font-sans text-[#1A2E22] leading-snug line-clamp-2">
            {product.title}
          </h3>

          {/* Short Story Indicator (Human Connection without exposing private address) */}
          <p className="mt-2 text-xs text-[#4A5D52] line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Heritage Craft Technique Label */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#01411C] font-semibold bg-[#F0FDF4] px-2.5 py-1 rounded-md border border-[#BBF7D0]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{product.craftHeritage}</span>
          </div>

          {/* Transparent Cost Allocation Banner (~70% direct to artisan) */}
          <div className="mt-3 p-3 bg-[#FAF9F6] rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-sans font-bold uppercase tracking-wider text-[#718579] text-[10px]">
                Direct Producer Payout
              </span>
              <span className="font-bold text-[#01411C] font-mono tabular-nums text-xs">
                {product.artisanSplitPercent}% (PKR {directArtisanPKR.toLocaleString()})
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden flex">
              <div style={{ width: `${product.artisanSplitPercent}%` }} className="bg-[#01411C] h-full" />
              <div style={{ width: `${product.builderMarginPercent}%` }} className="bg-amber-600 h-full" />
              <div style={{ width: `${product.connectorFeePercent}%` }} className="bg-emerald-500 h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Price & Order CTA Footer */}
      <div className="px-5 pb-5 pt-3 flex items-center justify-between gap-3 border-t border-stone-100">
        <div>
          <span className="font-sans text-[10px] text-[#718579] font-bold uppercase tracking-wider block">Price</span>
          <span className="text-lg font-extrabold text-[#1A2E22] font-mono tabular-nums">
            PKR {product.pricePKR.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSelectStory && (
            <button
              type="button"
              onClick={() => onSelectStory(product)}
              className="p-2 text-[#4A5D52] hover:text-[#01411C] hover:bg-[#F0FDF4] rounded-lg border border-stone-200 transition-colors cursor-pointer"
              title="Read Artisan Story & Heritage"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {onOrder && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
              onClick={() => onOrder(product)}
            >
              Order Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
