import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProductCategory, ProductStatus, ProductAvailability } from '../../../types';
import { Button } from '../../ui/Button';
import { X, Sparkles, Image, ShieldCheck } from 'lucide-react';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose }) => {
  const { skillPartners, addNewProduct } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('HUNAR');
  const [subCategory, setSubCategory] = useState('Heritage Craft');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(6500);
  const [capacity, setCapacity] = useState(25);
  const [producerId, setProducerId] = useState(skillPartners[0]?.id || '');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=800&q=80');
  const [availability, setAvailability] = useState<ProductAvailability>('made_to_order');
  const [productionTime, setProductionTime] = useState(7);
  const [status, setStatus] = useState<ProductStatus>('published');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const partner = skillPartners.find((sp) => sp.id === producerId) || skillPartners[0];

    addNewProduct({
      title: name.trim(),
      category,
      subCategory,
      pricePKR: Number(price),
      description: description.trim(),
      story: story.trim() || `Crafted with traditional technique by ${partner?.name || 'Master Artisan'} in ${partner?.city || 'Punjab'}.`,
      producerId: partner?.id || 'sp-1',
      producerName: partner?.name || 'Kalsoom Bibi',
      producerCode: partner?.anonymizedCode || 'KB-MLT-402',
      city: partner?.city || 'Multan',
      materialsCostPKR: Math.round(Number(price) * 0.2),
      logisticsCostPKR: 450,
      artisanSplitPercent: 70,
      builderMarginPercent: 12,
      connectorFeePercent: 6,
      minBatchUnits: 3,
      stockReadyUnits: availability === 'in_stock' ? 4 : 0,
      craftHeritage: `${partner?.city || 'Multan'} ${partner?.skillTitle || 'Handicrafts'}`,
      tags: ['Handcrafted', 'Authentic', 'Women-Led', category],
      colorTheme: 'from-emerald-700/20 to-stone-900/30',
      safetyCertified: true,
      imageIcon: category === 'RASOI' ? 'pickle' : 'shawl',
      imageUrl,
      images: [imageUrl],
      status,
      capacityMonthly: Number(capacity),
      productionTimeDays: Number(productionTime),
      availability,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#01411C] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#1A2E22]">Create & Publish Product</h2>
              <p className="text-xs text-[#4A5D52]">
                Define craft specifications, artisan attribution, and production capacity.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Product Name */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Product Title / Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Multani Hand-Embroidered Kashidakari Pashmina Shawl"
              className="w-full p-3 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
              >
                <option value="HUNAR">HUNAR (Heritage Needlework & Crafts)</option>
                <option value="RASOI">RASOI (Sun-Cured Foods & Preserves)</option>
                <option value="KNOWLEDGE">KNOWLEDGE (Culinary & Craft Archives)</option>
                <option value="SERVICES">SERVICES (Tailoring & Doorstep Fitting)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Subcategory / Technique</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Silk Resham Needlecraft"
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          {/* Price, Capacity, Production Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Price (PKR) *</label>
              <input
                type="number"
                required
                min={500}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono font-bold"
              />
              <span className="text-[10px] text-[#01411C] font-semibold mt-0.5 block">
                Direct Artisan Split (~70%): PKR {Math.round(price * 0.7).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Monthly Capacity (Units)</label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Production Time (Days)</label>
              <input
                type="number"
                min={1}
                value={productionTime}
                onChange={(e) => setProductionTime(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Producer & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Skill Partner (Producer) *</label>
              <select
                value={producerId}
                onChange={(e) => setProducerId(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
              >
                {skillPartners.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({sp.anonymizedCode}) · {sp.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Availability Mode</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as ProductAvailability)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
              >
                <option value="made_to_order">Made to Order (Batched)</option>
                <option value="in_stock">In Stock (Doorstep Ready)</option>
                <option value="seasonal">Seasonal Harvest</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Craft Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 p-2.5 text-xs border border-stone-300 rounded-xl"
              />
              <img
                src={imageUrl}
                alt="Preview"
                className="w-10 h-10 rounded-xl object-cover border border-stone-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Product Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Material, dimensional specifications, finish, packaging..."
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          {/* Story */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Artisan Heritage Story</label>
            <textarea
              rows={2}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="The human narrative behind the craft, cultural significance, and generational technique..."
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          {/* Status selector (Draft vs Publish) */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <span className="font-bold text-stone-800">Initial State</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                />
                <span className="font-semibold text-emerald-900">Publish Immediately</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                />
                <span className="font-semibold text-stone-600">Save as Draft</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="executiveGreen" size="md">
              {status === 'published' ? 'Publish to Marketplace' : 'Save Product Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
