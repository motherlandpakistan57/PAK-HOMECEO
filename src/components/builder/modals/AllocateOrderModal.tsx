import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Order } from '../../../types';
import { Button } from '../../ui/Button';
import { X, Layers, AlertCircle, ArrowRight } from 'lucide-react';

interface AllocateOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AllocateOrderModal: React.FC<AllocateOrderModalProps> = ({ order, isOpen, onClose }) => {
  const { batches, allocateOrderToBatch, showToast } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');

  if (!isOpen || !order) return null;

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;

    allocateOrderToBatch(order.id, selectedBatchId);
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
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#01411C] text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2E22]">Allocate Order to Batch</h2>
              <p className="text-xs text-[#4A5D52]">Link demand to artisan production capacity</p>
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

        <form onSubmit={handleAllocate} className="p-5 space-y-4 text-xs">
          {/* Order Summary */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <div className="flex items-center justify-between font-mono font-bold text-stone-900">
              <span>{order.trackingNumber}</span>
              <span className="text-[#01411C]">PKR {order.totalPKR.toLocaleString()}</span>
            </div>
            <p className="font-bold text-stone-800">{order.productTitle}</p>
            <p className="text-stone-500">
              Quantity: <strong>{order.quantity} units</strong> · Customer: {order.customerName} ({order.customerCity})
            </p>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1.5">
              Select Compatible Production Batch:
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {batches.map((batch) => {
                const isSelected = selectedBatchId === batch.id;
                return (
                  <div
                    key={batch.id}
                    onClick={() => setSelectedBatchId(batch.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0FDF4] border-[#01411C] shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-stone-900">
                        {batch.batchCode}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#01411C] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                        {batch.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-bold text-stone-800 text-xs">{batch.title}</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Artisan: {batch.skillPartnerName} · {batch.completedUnits}/{batch.targetUnits} units · Due {batch.deadline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="executiveGreen" size="md">
              Confirm Allocation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
