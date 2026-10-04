import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SkillPartnerProfile } from '../../../types';
import { Button } from '../../ui/Button';
import { X, Briefcase, Calendar } from 'lucide-react';

interface AssignWorkModalProps {
  partner: SkillPartnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignWorkModal: React.FC<AssignWorkModalProps> = ({ partner, isOpen, onClose }) => {
  const { products, batches, assignTaskToPartner, showToast } = useApp();

  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(5);
  const [deadline, setDeadline] = useState('2026-10-28');
  const [batchId, setBatchId] = useState(batches[0]?.id || 'batch-101');
  const [instructionsText, setInstructionsText] = useState('Counted resham thread tension must be held uniform. Ensure outer hem is pressed with clean muslin.');
  const [urduText, setUrduText] = useState('دھاگے کا تناؤ برابر رکھیں۔ ہر شیشے کے گرد 14 دھاگوں کا حساب رکھیں۔');

  if (!isOpen || !partner) return null;

  const selectedProduct = products.find((p) => p.id === productId) || products[0];
  const unitPay = Math.round((selectedProduct?.pricePKR || 5000) * 0.7);
  const totalPay = unitPay * quantity;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();

    assignTaskToPartner({
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      productImage: selectedProduct.imageUrl,
      category: selectedProduct.category,
      quantity: Number(quantity),
      completedUnits: 0,
      deadline,
      batchId,
      batchCode: batches.find((b) => b.id === batchId)?.batchCode || 'BATCH-MLT-101',
      unitPayPKR: unitPay,
      totalPayPKR: totalPay,
      status: 'Assigned',
      instructions: {
        title: `${selectedProduct.title} Production Guidance`,
        steps: [
          instructionsText,
          'Keep needle storage secure and protected from dust.',
          'Doorstep collection coordinated by Field Connector Fatima.',
        ],
        safetyTip: 'Store fine sewing needles in protective wooden kit.',
        urduText,
      },
      notesFromBuilder: `Assigned directly by Zainab Malik. Quantity: ${quantity} units.`,
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
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#01411C] text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2E22]">Assign Production Work</h2>
              <p className="text-xs text-[#4A5D52]">
                Assign to {partner.name} ({partner.anonymizedCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Select Product *</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
            >
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.title} (PKR {prod.pricePKR.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Quantity (Units) *</label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Target Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Compensation Pill */}
          <div className="p-3 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#718579] block">
                Direct Artisan Compensation
              </span>
              <span className="font-mono text-base font-extrabold text-[#01411C]">
                PKR {totalPay.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#01411C]">
              PKR {unitPay.toLocaleString()} / unit
            </span>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Associate with Batch</label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white font-mono"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batchCode} - {b.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Technical Guidance (English)</label>
            <textarea
              rows={2}
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Urdu Verbal Guidance Script</label>
            <textarea
              rows={2}
              value={urduText}
              onChange={(e) => setUrduText(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl text-right font-serif"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="executiveGreen" size="md">
              Assign Work Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
