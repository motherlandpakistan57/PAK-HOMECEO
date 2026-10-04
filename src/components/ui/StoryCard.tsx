import React from 'react';
import { Product } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';
import { Button } from './Button';
import { ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export interface StoryCardProps {
  product: Product;
  onProceedOrder?: (product: Product) => void;
  onClose?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  product,
  onProceedOrder,
  onClose,
}) => {
  const directArtisanPKR = Math.round((product.pricePKR * product.artisanSplitPercent) / 100);

  return (
    <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Header: Product & Producer */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#01411C] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
              {product.category}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-[#718579] font-medium">{product.city}, Pakistan</span>
          </div>
          <h2 className="text-xl font-extrabold font-sans text-[#1A2E22] leading-snug">
            {product.title}
          </h2>
          <p className="text-xs font-semibold text-[#01411C] mt-0.5">
            Crafted by {product.producerName} (Code: {product.producerCode})
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[#718579] hover:text-[#1A2E22] text-xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Product Image */}
      <div className="my-4 rounded-xl overflow-hidden">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.title}
          iconType={product.imageIcon}
          title={product.title}
          className="w-full h-56 object-cover"
        />
      </div>

      {/* 2. Human Story Narrative */}
      <div className="space-y-4 text-xs text-[#4A5D52] leading-relaxed">
        <div className="p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
          <h4 className="font-bold text-[#01411C] text-xs uppercase tracking-wider font-sans mb-1">
            Human Narrative & Generational Heritage
          </h4>
          <p className="text-[#1A2E22] leading-relaxed font-sans">{product.story}</p>
        </div>

        {/* 3. Craft & Production Specifications */}
        <div>
          <h4 className="font-bold text-[#1A2E22] text-xs uppercase tracking-wider font-sans mb-1">
            Craft & Material Integrity
          </h4>
          <p>{product.description}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-stone-100 text-[#4A5D52] rounded-md text-[10px] font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Dignity & Privacy Safeguard Note */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#01411C] shrink-0" />
          <p className="text-[11px] text-[#4A5D52] leading-normal font-sans">
            <strong>Dignity & Privacy Safeguard:</strong> The artisan's private contact details and residence are protected. Field fulfillment is managed with honor through assigned Community Connectors.
          </p>
        </div>

        {/* 5. Cost Allocation Split */}
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-[#1A2E22]">Direct Artisan Earnings:</span>
            <span className="font-bold font-mono text-[#01411C]">
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

      {/* 6. Price & Action Footer */}
      <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#718579] block uppercase tracking-wider font-sans font-bold">
            Total Price
          </span>
          <span className="text-xl font-extrabold font-mono tabular-nums text-[#1A2E22]">
            PKR {product.pricePKR.toLocaleString()}
          </span>
        </div>

        {onProceedOrder && (
          <Button
            variant="primary"
            onClick={() => onProceedOrder(product)}
            leftIcon={<HeartHandshake className="w-4 h-4" />}
          >
            Support & Order Unit
          </Button>
        )}
      </div>
    </div>
  );
};
