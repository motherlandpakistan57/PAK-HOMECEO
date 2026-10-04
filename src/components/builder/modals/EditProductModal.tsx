import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product, ProductCategory, ProductStatus, ProductAvailability } from '../../../types';
import { Button } from '../../ui/Button';
import { X, Sparkles, AlertTriangle, Archive, Pause, Play, Trash2 } from 'lucide-react';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { skillPartners, updateProduct, updateProductStatus, openConfirmDialog } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('HUNAR');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(20);
  const [producerId, setProducerId] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [availability, setAvailability] = useState<ProductAvailability>('made_to_order');
  const [productionTime, setProductionTime] = useState(7);
  const [status, setStatus] = useState<ProductStatus>('published');

  useEffect(() => {
    if (product) {
      setName(product.title);
      setCategory(product.category);
      setSubCategory(product.subCategory || '');
      setDescription(product.description || '');
      setPrice(product.pricePKR || 0);
      setCapacity(product.capacityMonthly || 20);
      setProducerId(product.producerId || '');
      setStory(product.story || '');
      setImageUrl(product.imageUrl || product.images?.[0] || '');
      setAvailability(product.availability || 'made_to_order');
      setProductionTime(product.productionTimeDays || 7);
      setStatus(product.status || 'published');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = skillPartners.find((sp) => sp.id === producerId) || skillPartners[0];

    updateProduct(product.id, {
      title: name.trim(),
      category,
      subCategory,
      pricePKR: Number(price),
      description: description.trim(),
      story: story.trim(),
      producerId: partner?.id || product.producerId,
      producerName: partner?.name || product.producerName,
      producerCode: partner?.anonymizedCode || product.producerCode,
      city: partner?.city || product.city,
      capacityMonthly: Number(capacity),
      productionTimeDays: Number(productionTime),
      availability,
      status,
      imageUrl,
      images: [imageUrl],
    });

    onClose();
  };

  const handleStatusChange = (newStatus: ProductStatus) => {
    updateProductStatus(product.id, newStatus);
    setStatus(newStatus);
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
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                {product.id}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  status === 'published'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'paused'
                    ? 'bg-amber-100 text-amber-800'
                    : status === 'draft'
                    ? 'bg-stone-200 text-stone-700'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-[#1A2E22]">Edit Product Details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Lifecycle Actions Bar */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 px-6 text-xs">
          <span className="font-bold text-stone-700">Lifecycle State:</span>
          <div className="flex items-center gap-1.5">
            {status !== 'published' && (
              <Button
                type="button"
                size="sm"
                variant="executiveGreen"
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={() => handleStatusChange('published')}
              >
                Publish
              </Button>
            )}
            {status === 'published' && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                leftIcon={<Pause className="w-3.5 h-3.5 text-amber-700" />}
                onClick={() => handleStatusChange('paused')}
              >
                Pause
              </Button>
            )}
            {status !== 'draft' && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange('draft')}
              >
                Draft
              </Button>
            )}
            {status !== 'archived' && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                leftIcon={<Archive className="w-3.5 h-3.5 text-stone-500" />}
                onClick={() => handleStatusChange('archived')}
              >
                Archive
              </Button>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
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
                <option value="HUNAR">HUNAR (Crafts)</option>
                <option value="RASOI">RASOI (Foods)</option>
                <option value="KNOWLEDGE">KNOWLEDGE (Archives)</option>
                <option value="SERVICES">SERVICES (Tailoring)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Subcategory</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Price (PKR) *</label>
              <input
                type="number"
                required
                min={500}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Capacity (Units/Mo)</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Production Time (Days)</label>
              <input
                type="number"
                value={productionTime}
                onChange={(e) => setProductionTime(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Producer & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Producer Attributed</label>
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

          {/* Image */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 p-2.5 text-xs border border-stone-300 rounded-xl"
              />
              <img
                src={imageUrl}
                alt="Product preview"
                className="w-10 h-10 rounded-xl object-cover border border-stone-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          {/* Story */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Artisan Story</label>
            <textarea
              rows={2}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="executiveGreen" size="md">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
