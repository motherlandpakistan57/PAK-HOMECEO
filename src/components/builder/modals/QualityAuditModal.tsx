import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Order } from '../../../types';
import { Button } from '../../ui/Button';
import { X, ShieldCheck, CheckSquare, Square, AlertTriangle, Send } from 'lucide-react';

interface QualityAuditModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QualityAuditModal: React.FC<QualityAuditModalProps> = ({ order, isOpen, onClose }) => {
  const { runQualityVerification, showToast } = useApp();

  const [criteria, setCriteria] = useState({
    materialIntegrity: true,
    craftsmanshipFinish: true,
    dimensionalAccuracy: true,
    foodOrPhysicalSafety: true,
    protectivePackaging: true,
    artisanStoryCard: true,
  });

  const [inspectorNotes, setInspectorNotes] = useState('Stitch tension verified. Mirror roundels firmly seated in resham silk.');

  if (!isOpen || !order) return null;

  const toggleCheck = (key: keyof typeof criteria) => {
    setCriteria((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAuditSubmit = (passed: boolean) => {
    const passedCount = Object.values(criteria).filter(Boolean).length;
    const score = Math.round((passedCount / 6) * 100);

    runQualityVerification(order.id, passed, score);
    onClose();
  };

  const allPassed = Object.values(criteria).every(Boolean);

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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2E22]">6-Point Doorstep Quality Audit</h2>
              <p className="text-xs text-[#4A5D52]">Doorstep pre-dispatch compliance verification</p>
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

        <div className="p-5 space-y-4 text-xs">
          {/* Order Snapshot */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex justify-between font-mono font-bold text-stone-900 mb-1">
              <span>{order.trackingNumber}</span>
              <span className="text-[#01411C]">{order.productTitle}</span>
            </div>
            <p className="text-stone-500">
              Artisan: <strong>{order.skillPartnerName} ({order.skillPartnerCode})</strong> · Connector: {order.connectorName}
            </p>
          </div>

          {/* 6 Criteria Checkboxes */}
          <div className="space-y-2">
            <label className="font-bold text-[#1A2E22] block mb-1">
              Mandatory Audit Verification Points:
            </label>

            {[
              { key: 'materialIntegrity', label: '1. Raw Material Authenticity & Purity Verified' },
              { key: 'craftsmanshipFinish', label: '2. Craftsmanship Finish & Tight Stitching / Induction Seal' },
              { key: 'dimensionalAccuracy', label: '3. Dimensional & Weight Accuracy' },
              { key: 'foodOrPhysicalSafety', label: '4. Non-Toxic Dyes / Zero Additive Compliance' },
              { key: 'protectivePackaging', label: '5. Protective Muslin / Corrugated Packaging' },
              { key: 'artisanStoryCard', label: '6. Artisan Bio & Authenticity Card Enclosed' },
            ].map(({ key, label }) => {
              const checked = criteria[key as keyof typeof criteria];
              return (
                <div
                  key={key}
                  onClick={() => toggleCheck(key as keyof typeof criteria)}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                    checked
                      ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#01411C]'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="w-4 h-4 text-[#01411C] rounded cursor-pointer"
                  />
                  <span className="font-medium text-xs flex-1">{label}</span>
                  {checked && <span className="text-[10px] font-bold">Pass ✓</span>}
                </div>
              );
            })}
          </div>

          {/* Inspector Notes */}
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Inspector Quality Log</label>
            <textarea
              rows={2}
              value={inspectorNotes}
              onChange={(e) => setInspectorNotes(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAuditSubmit(false)}
            >
              Flag for Revision
            </Button>
            <Button
              type="button"
              variant="executiveGreen"
              size="md"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => handleAuditSubmit(true)}
            >
              Approve Quality Gate & Release for Dispatch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
