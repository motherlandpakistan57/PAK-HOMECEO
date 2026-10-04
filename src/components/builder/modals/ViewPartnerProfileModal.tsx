import React from 'react';
import { SkillPartnerProfile } from '../../../types';
import { Button } from '../../ui/Button';
import { X, ShieldCheck, CheckCircle2, DollarSign, MapPin, Award, Phone, Users } from 'lucide-react';

interface ViewPartnerProfileModalProps {
  partner: SkillPartnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignWork?: (partner: SkillPartnerProfile) => void;
  onMessage?: (partner: SkillPartnerProfile) => void;
}

export const ViewPartnerProfileModal: React.FC<ViewPartnerProfileModalProps> = ({
  partner,
  isOpen,
  onClose,
  onAssignWork,
  onMessage,
}) => {
  if (!isOpen || !partner) return null;

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
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={partner.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
              alt={partner.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#01411C]/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]">
                  {partner.anonymizedCode}
                </span>
                <span className="text-[10px] uppercase font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                  {partner.city}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#1A2E22]">{partner.name}</h2>
              <p className="text-xs text-[#4A5D52]">{partner.skillTitle}</p>
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

        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0]">
              <span className="text-[10px] uppercase font-bold text-[#718579] block">Lifetime Direct Pay</span>
              <span className="text-base font-extrabold font-mono text-[#01411C] tabular-nums block mt-0.5">
                PKR {partner.totalEarningsPKR.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 block">100% fair rate settled</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-[#718579] block">Pending in Escrow</span>
              <span className="text-base font-extrabold font-mono text-stone-900 tabular-nums block mt-0.5">
                PKR {partner.pendingPayoutPKR.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 block">Awaiting doorstep QC</span>
            </div>
          </div>

          {/* Craft Specialty */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
            <span className="font-bold text-[#1A2E22] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#01411C]" />
              <span>Craft Specialty & Heritage Experience</span>
            </span>
            <p className="text-[#4A5D52] leading-relaxed">
              {partner.specialty}
            </p>
            <p className="text-[11px] text-stone-500 pt-1">
              Craft Experience: <strong>{partner.craftExperienceYears} Years</strong> · Completed Orders: <strong>{partner.completedOrdersCount}</strong> · Quality Score: <strong>{partner.rating}/5.0</strong>
            </p>
          </div>

          {/* Local Cluster Operations */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <span className="font-bold text-[#1A2E22] block">Assigned Local Field Connector</span>
            <p className="text-stone-600">
              Field Coordinator: <strong>{partner.assignedConnectorName}</strong>
            </p>
            <p className="text-[11px] text-stone-500">
              Locality: {partner.district}, {partner.city}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onMessage?.(partner);
              }}
            >
              Send Message
            </Button>
            <Button
              type="button"
              variant="executiveGreen"
              size="sm"
              onClick={() => {
                onClose();
                onAssignWork?.(partner);
              }}
            >
              Assign New Work
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
