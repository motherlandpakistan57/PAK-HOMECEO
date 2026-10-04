import React, { useState } from 'react';
import { SkillPartnerTask, SkillPartnerTaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import {
  X,
  Volume2,
  CheckCircle2,
  Clock,
  Upload,
  Camera,
  Layers,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  FileText,
  DollarSign,
  Send,
} from 'lucide-react';

interface WorkDetailModalProps {
  task: SkillPartnerTask;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkDetailModal: React.FC<WorkDetailModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const {
    acceptAssignedTask,
    updateTaskProgress,
    submitTaskForAudit,
    openConfirmDialog,
    showToast,
  } = useApp();

  const [completedUnits, setCompletedUnits] = useState(task.completedUnits);
  const [artisanNote, setArtisanNote] = useState(task.artisanNote || '');
  const [proofPhoto, setProofPhoto] = useState<string | undefined>(task.proofPhotoUrl);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleAudioPlayback = () => {
    setIsPlayingAudio(true);
    showToast('Playing Urdu voice instructions for this craft pattern...', 'info', 'Voice Guidance');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  const handleConfirmTask = () => {
    acceptAssignedTask(task.id);
  };

  const handleSaveProgress = () => {
    updateTaskProgress(task.id, completedUnits);
    showToast(`Progress logged: ${completedUnits} of ${task.quantity} units finished.`, 'success', 'Progress Updated');
  };

  const handleMarkAllComplete = () => {
    setCompletedUnits(task.quantity);
    updateTaskProgress(task.id, task.quantity);
    showToast(`All ${task.quantity} units marked as completed! You can now submit for audit.`, 'success', 'All Units Complete');
  };

  const handleUploadPhotoSimulate = () => {
    // Provide an authentic high-resolution embroidery proof photo
    const sampleProof = 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=800&q=80';
    setProofPhoto(sampleProof);
    showToast('Craft photograph attached! Ready to submit with your inspection request.', 'success', 'Photo Attached');
  };

  const handleSubmitForAudit = () => {
    openConfirmDialog({
      title: 'Submit Finished Work for Quality Verification',
      message: `Submit all ${task.quantity} finished units of ${task.productTitle} for 6-point physical verification? Community Connector Fatima will visit to inspect and arrange dispatch.`,
      confirmLabel: 'Submit for Audit',
      variant: 'primary',
      onConfirm: () => {
        submitTaskForAudit(task.id, artisanNote, proofPhoto);
        onClose();
      },
    });
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
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-stone-100 bg-[#FAF9F6] flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {task.productImage && (
              <img
                src={task.productImage}
                alt={task.productTitle}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]">
                  {task.batchCode}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#718579]">
                  {task.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    task.status === 'Completed'
                      ? 'bg-[#01411C] text-white border-[#01411C]'
                      : task.status === 'Submitted'
                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                      : task.status === 'In Production'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-[#F0FDF4] text-[#01411C] border-[#BBF7D0]'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1A2E22] truncate">
                {task.productTitle}
              </h2>
              <p className="text-xs text-[#4A5D52]">
                Quantity: <strong>{task.quantity} Units</strong> · Deadline: <strong>{task.deadline}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Compensation Summary Pill */}
          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579] block">
                Direct Artisan Compensation
              </span>
              <span className="text-lg font-extrabold text-[#01411C] font-mono tabular-nums">
                PKR {task.totalPayPKR.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#4A5D52] block mt-0.5">
                (PKR {task.unitPayPKR.toLocaleString()} per completed unit)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#718579] block">
                Payment Guarantee
              </span>
              <span className="text-xs font-bold text-[#01411C] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Held in Escrow</span>
              </span>
            </div>
          </div>

          {/* Voice Guidance & Urdu Step-by-Step Instructions */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#01411C]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22]">
                  Craft Instructions: {task.instructions.title}
                </h3>
              </div>

              {/* Voice playback button */}
              <button
                type="button"
                onClick={handleAudioPlayback}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-[#01411C] text-white animate-pulse'
                    : 'bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0] hover:bg-[#DCFCE7]'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? 'ہدایات جاری ہیں...' : 'Listen in Urdu'}</span>
              </button>
            </div>

            {/* Urdu instruction banner */}
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-right font-medium text-amber-950 leading-relaxed text-sm">
              <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1 font-sans text-left">
                اردو ہدایات (Urdu Guidance)
              </span>
              {task.instructions.urduText}
            </div>

            {/* Step list */}
            <div className="space-y-1.5 pt-1">
              {task.instructions.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[#4A5D52]">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-[#01411C] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            {/* Safety Tip */}
            {task.instructions.safetyTip && (
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-[11px] text-[#718579]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Safety & Workplace Note: {task.instructions.safetyTip}</span>
              </div>
            )}
          </div>

          {/* Progress Counter & Updater */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#1A2E22]">
                  Production Progress Tracker
                </h4>
                <p className="text-[11px] text-[#4A5D52] mt-0.5">
                  Update your completed units as you finish crafting each piece.
                </p>
              </div>

              <span className="font-mono text-base font-extrabold text-[#01411C]">
                {completedUnits} / {task.quantity} Units
              </span>
            </div>

            {/* Big ergonomic touch buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCompletedUnits(Math.max(0, completedUnits - 1))}
                disabled={completedUnits <= 0}
                className="w-12 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 font-extrabold text-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                -1
              </button>

              <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#01411C] transition-all duration-200 rounded-full"
                  style={{ width: `${Math.round((completedUnits / task.quantity) * 100)}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => setCompletedUnits(Math.min(task.quantity, completedUnits + 1))}
                disabled={completedUnits >= task.quantity}
                className="w-12 h-10 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] disabled:opacity-40 text-[#01411C] font-extrabold text-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                +1
              </button>

              <Button
                onClick={handleSaveProgress}
                variant="secondary"
                size="sm"
                className="ml-2"
              >
                Log Progress
              </Button>

              {completedUnits < task.quantity && (
                <Button
                  onClick={handleMarkAllComplete}
                  variant="outline"
                  size="sm"
                >
                  Mark All Complete
                </Button>
              )}
            </div>
          </div>

          {/* Photo Proof Upload & Artisan Note */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-[#1A2E22]">
              Optional Finished Work Photo & Notes
            </h4>

            {/* Photo preview or upload trigger */}
            {proofPhoto ? (
              <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-stone-100 border border-stone-200">
                <img
                  src={proofPhoto}
                  alt="Finished craft proof"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#01411C] text-white text-[10px] font-bold">
                    Proof Attached ✓
                  </span>
                  <button
                    type="button"
                    onClick={() => setProofPhoto(undefined)}
                    className="p-1 rounded-md bg-stone-900/70 text-white hover:bg-stone-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={handleUploadPhotoSimulate}
                className="p-6 border-2 border-dashed border-stone-200 hover:border-[#01411C] rounded-2xl text-center hover:bg-[#F0FDF4] transition-all cursor-pointer group"
              >
                <Camera className="w-6 h-6 text-stone-400 group-hover:text-[#01411C] mx-auto mb-1.5" />
                <p className="text-xs font-bold text-[#1A2E22] group-hover:text-[#01411C]">
                  Tap to Take or Attach Craft Photo
                </p>
                <p className="text-[10px] text-[#718579] mt-0.5">
                  Helps Community Connector Fatima verify stitch tension before doorstep pickup.
                </p>
              </div>
            )}

            {/* Artisan note field */}
            <div>
              <label className="text-[11px] font-semibold text-[#1A2E22] block mb-1">
                Note for Business Builder Zainab or Connector Fatima
              </label>
              <textarea
                rows={2}
                value={artisanNote}
                onChange={(e) => setArtisanNote(e.target.value)}
                placeholder="e.g. Work is ironed and packed in muslin cloth. Ready for doorstep pickup."
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
              />
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>

          <div className="flex items-center gap-2">
            {task.status === 'Assigned' && (
              <Button onClick={handleConfirmTask} variant="executiveGreen" size="md">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Confirm & Accept Task</span>
              </Button>
            )}

            {(task.status === 'Accepted' || task.status === 'In Production') && (
              <Button
                onClick={handleSubmitForAudit}
                variant="executiveGreen"
                size="md"
                disabled={completedUnits < task.quantity}
              >
                <Send className="w-4 h-4 mr-1.5" />
                <span>
                  {completedUnits >= task.quantity
                    ? 'Submit for 6-Point Quality Check'
                    : `Complete All ${task.quantity} Units First (${completedUnits}/${task.quantity})`}
                </span>
              </Button>
            )}

            {task.status === 'Submitted' && (
              <span className="text-xs font-bold text-[#01411C] bg-[#DCFCE7] px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
                Awaiting Connector Fatima’s Physical Audit
              </span>
            )}

            {task.status === 'Completed' && (
              <span className="text-xs font-bold text-[#01411C] bg-[#DCFCE7] px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
                Passed QC & Remuneration Settled ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
