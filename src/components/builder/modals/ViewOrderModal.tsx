import React, { useState } from 'react';
import { Order, OrderStatus } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { Stepper } from '../../ui/Stepper';
import {
  X,
  Package,
  ShieldCheck,
  MapPin,
  DollarSign,
  Clock,
  Truck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  User,
  ArrowRight,
  Send,
  History,
  Check,
} from 'lucide-react';

interface ViewOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAllocate?: (order: Order) => void;
  onReviewQuality?: (order: Order) => void;
}

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onAllocate,
  onReviewQuality,
}) => {
  const {
    confirmOrder,
    dispatchOrder,
    markOrderDelivered,
    releaseArtisanPayout,
    updateOrderStatus,
    acceptOrder,
    clarifyOrRejectOrder,
    assignOrderToArtisan,
    escalateOrder,
    updateOrderWorkflowStatus,
    skillPartners,
    showToast,
  } = useApp();

  const [clarifyText, setClarifyText] = useState('');
  const [showClarifyInput, setShowClarifyInput] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(order?.skillPartnerId || '');
  const [escalateReason, setEscalateReason] = useState('');
  const [showEscalateInput, setShowEscalateInput] = useState(false);

  if (!isOpen || !order) return null;

  const currentTimeline = order.timeline || [
    {
      id: 'tl-init',
      timestamp: order.createdAt,
      actor: `Citizen (${order.customerName})`,
      action: order.isPreOrder ? 'Pre-Order Brief Submitted' : 'Order Placed',
      note: order.orderBrief?.briefSummary || `Initial order created for ${order.quantity}x ${order.productTitle}`,
    },
  ];

  const handleAssignPartner = (partnerId: string) => {
    const partner = skillPartners.find((p) => p.id === partnerId);
    if (!partner) return;
    assignOrderToArtisan(order.id, partner.id, partner.name, `Assigned by Product Manager for craft fulfillment.`);
  };

  const handleClarifySubmit = () => {
    if (!clarifyText.trim()) return;
    clarifyOrRejectOrder(order.id, 'clarify', clarifyText.trim());
    setClarifyText('');
    setShowClarifyInput(false);
  };

  const handleEscalateSubmit = () => {
    if (!escalateReason.trim()) return;
    escalateOrder(order.id, escalateReason.trim());
    setEscalateReason('');
    setShowEscalateInput(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-stone-200 text-stone-900">
                {order.trackingNumber}
              </span>
              <StatusBadge status={order.status} type="order" />
              {order.isPreOrder && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Pre-Order Brief
                </span>
              )}
              {order.priority && order.priority !== 'normal' && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    order.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  Priority: {order.priority}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-[#1A2E22]">{order.productTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Stepper */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <h4 className="font-bold text-stone-800 mb-3 text-xs">Closed-Loop Progression:</h4>
            <Stepper currentStatus={order.status} />
          </div>

          {/* Structured Order Brief (Mandated by Section 4 & 5) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4 text-amber-800" />
                <span>Structured Order Brief (Citizen Request)</span>
              </span>
              <span className="text-[10px] font-semibold text-amber-800 uppercase">
                {order.isPreOrder ? 'Pre-Order Mode' : 'Standard Order'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-stone-800">
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/70">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Customization</span>
                <p className="mt-0.5 text-stone-800 font-medium">
                  {order.orderBrief?.customizationRequirements || 'Standard catalog specification'}
                </p>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/70">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Delivery Timing</span>
                <p className="mt-0.5 text-stone-800 font-medium">
                  {order.orderBrief?.preferredDeliveryTiming || 'Standard Handcrafted (5-7 Days)'}
                </p>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/70 sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Special Instructions</span>
                <p className="mt-0.5 text-stone-800">
                  {order.orderBrief?.specialInstructions || 'Hand-signed artisan authenticity card requested.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Split breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Order Price</span>
              <span className="text-base font-extrabold font-mono text-stone-900 tabular-nums block mt-0.5">
                PKR {order.totalPKR.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-500">Method: {order.paymentMethod.toUpperCase()}</span>
            </div>

            <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0]">
              <span className="text-[10px] uppercase font-bold text-[#01411C] block">Direct Artisan Share</span>
              <span className="text-base font-extrabold font-mono text-[#01411C] tabular-nums block mt-0.5">
                PKR {order.payoutAmountPKR.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-800">
                {order.payoutReleased ? 'Disbursed ✓' : 'Held in Escrow'}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Production Units</span>
              <span className="text-base font-extrabold font-mono text-stone-900 tabular-nums block mt-0.5">
                {order.quantity} Units
              </span>
              <span className="text-[10px] text-stone-500">Est Delivery: {order.estimatedDeliveryDate}</span>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-[#1A2E22] text-xs">Citizen & Shipping Information</h4>
            <p className="text-stone-700">
              <strong>{order.customerName}</strong> · Phone: <span className="font-mono">{order.customerPhoneMasked}</span>
            </p>
            <p className="text-stone-500">
              Address: {order.customerAddressMasked}, {order.customerCity}
            </p>
          </div>

          {/* Assigned Person / Artisan Allocation Dropdown */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-stone-800 block text-xs">Assigned Responsible Producer:</span>
              <span className="text-[11px] text-stone-500">
                Currently: <strong>{order.assignedPerson || order.skillPartnerName}</strong> ({order.skillPartnerCode})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={order.skillPartnerId}
                onChange={(e) => handleAssignPartner(e.target.value)}
                className="p-2 text-xs border border-stone-300 rounded-xl bg-white font-semibold cursor-pointer"
              >
                {skillPartners.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} · {sp.city} ({sp.anonymizedCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Manager Quick Actions (Accept / Clarify / Reject / Escalate) */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A2E22] text-xs">Product Manager Workflow Controls:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs text-amber-800 border-amber-300 hover:bg-amber-50"
                  onClick={() => setShowClarifyInput(!showClarifyInput)}
                >
                  Request Clarification
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                  onClick={() => setShowEscalateInput(!showEscalateInput)}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Escalate
                </Button>
                {(order.status === 'placed' || order.status === 'new') && (
                  <Button
                    size="sm"
                    variant="executiveGreen"
                    onClick={() => acceptOrder(order.id)}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Accept Order
                  </Button>
                )}
              </div>
            </div>

            {/* Clarification Input Drawer */}
            {showClarifyInput && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-2">
                <input
                  type="text"
                  value={clarifyText}
                  onChange={(e) => setClarifyText(e.target.value)}
                  placeholder="Enter clarification message for Citizen (e.g. Confirm dimensions or thread shade)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
                <Button size="sm" variant="executiveGreen" onClick={handleClarifySubmit}>
                  Send
                </Button>
              </div>
            )}

            {/* Escalation Input Drawer */}
            {showEscalateInput && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex gap-2">
                <input
                  type="text"
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  placeholder="Reason for escalation (e.g., Raw material delay, specialized craft required)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-rose-600 text-white hover:bg-rose-700 border-transparent"
                  onClick={handleEscalateSubmit}
                >
                  Log Escalation
                </Button>
              </div>
            )}
          </div>

          {/* Activity Log / Timeline (Mandated: Timeline/activity log) */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-xs">
              <History className="w-4 h-4 text-[#01411C]" />
              <span>Closed-Loop Activity Timeline</span>
            </div>

            <div className="space-y-2 border-l-2 border-emerald-600 pl-3 ml-2">
              {currentTimeline.map((item) => (
                <div key={item.id} className="text-xs space-y-0.5 relative">
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="font-bold text-stone-900">{item.action}</span>
                    <span className="text-[10px] text-stone-400">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans">
                    By <strong>{item.actor}</strong>: {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-200 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2 flex-wrap">
            {(!order.batchId || order.status === 'confirmed') && (
              <Button
                type="button"
                variant="executiveGreen"
                size="sm"
                onClick={() => {
                  onClose();
                  onAllocate?.(order);
                }}
              >
                Allocate to Batch
              </Button>
            )}

            {(order.status === 'quality_check' || order.status === 'quality_verified') && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onReviewQuality?.(order);
                }}
              >
                Run Quality Audit
              </Button>
            )}

            {order.status === 'quality_verified' && (
              <Button
                type="button"
                variant="executiveGreen"
                size="sm"
                onClick={() => dispatchOrder(order.id)}
              >
                Dispatch for Delivery
              </Button>
            )}

            {order.status === 'dispatched' && (
              <Button
                type="button"
                variant="executiveGreen"
                size="sm"
                onClick={() => markOrderDelivered(order.id)}
              >
                Mark Delivered
              </Button>
            )}

            {order.status === 'delivered' && !order.payoutReleased && (
              <Button
                type="button"
                variant="executiveGreen"
                size="sm"
                onClick={() => releaseArtisanPayout(order.id)}
              >
                Release Artisan Escrow
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
