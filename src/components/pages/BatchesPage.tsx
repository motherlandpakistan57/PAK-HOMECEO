import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { Button } from '../ui/Button';
import {
  Layers,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';
import { ProductCategory } from '../../types';

export const BatchesPage: React.FC = () => {
  const {
    batches,
    skillPartners,
    createProductionBatch,
    incrementBatchProgress,
    markBatchMaterialsDelivered,
    currentRole,
    openConfirmDialog,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('HUNAR');
  const [partnerId, setPartnerId] = useState(skillPartners[0]?.id || '');
  const [targetUnits, setTargetUnits] = useState(12);
  const [deadline, setDeadline] = useState('2026-10-18');
  const [notes, setNotes] = useState('');

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProductionBatch({
      title,
      category,
      skillPartnerId: partnerId,
      targetUnits,
      deadline,
      notes,
    });
    setIsModalOpen(false);
    setTitle('');
  };

  const handleIncrement = (batchId: string, code: string) => {
    incrementBatchProgress(batchId);
  };

  const handleDeliverMaterials = (batchId: string, code: string) => {
    openConfirmDialog({
      title: `Confirm Raw Material Drop: ${code}`,
      message: 'Confirm physical drop-off of silk skeins and mirror discs at the artisan household?',
      confirmLabel: 'Confirm Drop-off',
      variant: 'primary',
      onConfirm: () => {
        markBatchMaterialsDelivered(batchId, 'Verified drop-off by Community Connector.');
      },
    });
  };

  return (
    <PageContainer
      kicker="Production Engine"
      title="Production Batches & Capacity"
      description="Manage cluster production batches, raw material drops, and verified progress milestones."
      primaryAction={
        currentRole === 'builder' ? (
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="executiveGreen"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Start Batch</span>
          </Button>
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {batches.map((batch) => {
          const progressPercent = Math.round((batch.completedUnits / batch.targetUnits) * 100);

          return (
            <div
              key={batch.id}
              className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#BBF7D0] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]">
                    {batch.batchCode}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#718579]">
                    {batch.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#1A2E22] line-clamp-1">{batch.title}</h3>

                <div className="mt-2 text-xs text-[#4A5D52] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Artisan:</span>
                    <strong className="text-[#1A2E22]">{batch.skillPartnerName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>City Cluster:</span>
                    <span>{batch.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Connector:</span>
                    <span>{batch.connectorName}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1A2E22]">
                      Completed: {batch.completedUnits} / {batch.targetUnits} Units
                    </span>
                    <span className="text-[#01411C]">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#01411C] transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Materials delivery status */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#FAF9F6] border border-stone-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-[#4A5D52]">Raw Materials:</span>
                  {batch.rawMaterialsDelivered ? (
                    <span className="text-[#01411C] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Delivered</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeliverMaterials(batch.id, batch.batchCode)}
                      className="text-amber-700 font-bold hover:underline cursor-pointer"
                    >
                      Confirm Drop-off
                    </button>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="text-left">
                  <span className="text-[10px] text-[#718579] block">Total Artisan Remuneration</span>
                  <span className="text-xs font-extrabold text-[#01411C] tabular-nums">
                    PKR {batch.totalBatchPayPKR.toLocaleString()}
                  </span>
                </div>

                {batch.completedUnits < batch.targetUnits ? (
                  <Button
                    onClick={() => handleIncrement(batch.id, batch.batchCode)}
                    variant="executiveGreen"
                    size="sm"
                  >
                    <span>+1 Unit</span>
                  </Button>
                ) : (
                  <span className="text-[10px] font-bold text-[#01411C] bg-[#DCFCE7] px-2 py-1 rounded-lg border border-[#BBF7D0]">
                    Batch Ready for QC
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1A2E22]">Start New Production Batch</h3>
            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                  Batch Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Multani Raw Silk Pashmina Shawls"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  >
                    <option value="HUNAR">HUNAR (Crafts)</option>
                    <option value="RASOI">RASOI (Foods)</option>
                    <option value="KNOWLEDGE">KNOWLEDGE</option>
                    <option value="SERVICES">SERVICES</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                    Target Units
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={targetUnits}
                    onChange={(e) => setTargetUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                  Assigned Home Artisan
                </label>
                <select
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                >
                  {skillPartners.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name} — {sp.specialty} ({sp.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="executiveGreen" size="sm">
                  Create Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
