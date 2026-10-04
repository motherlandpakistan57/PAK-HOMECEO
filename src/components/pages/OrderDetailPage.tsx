import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { StatusBadge } from '../ui/StatusBadge';
import { PaymentStatusBadge } from '../ui/PaymentStatusBadge';
import { Button } from '../ui/Button';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  CreditCard,
  Layers,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    orders,
    currentRole,
    runQualityVerification,
    dispatchOrder,
    markOrderDelivered,
    releaseArtisanPayout,
    openConfirmDialog,
    showToast,
  } = useApp();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id) || orders[0];

  // 6-stage lifecycle steps
  const steps: { key: OrderStatus; label: string; description: string }[] = [
    { key: 'placed', label: 'Confirmed', description: 'Order recorded & payment held in escrow' },
    { key: 'reviewed_batched', label: 'Allocated', description: 'Assigned to production batch & materials dropped' },
    { key: 'in_production', label: 'In Production', description: 'Home artisan actively crafting piece' },
    { key: 'quality_verified', label: 'Quality Check', description: '6-point physical verification audit signed off' },
    { key: 'dispatched', label: 'Dispatched', description: 'Handed over to courier with sealed packaging' },
    { key: 'delivered', label: 'Delivered', description: 'Delivered to citizen & payout released' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  const handleAdvanceQC = () => {
    openConfirmDialog({
      title: 'Sign Off Quality Verification Audit',
      message: `Certify that ${order.productTitle} meets the 6-point physical craft standard (Score 98/100)?`,
      confirmLabel: 'Certify & Pass QC',
      variant: 'primary',
      onConfirm: () => {
        runQualityVerification(order.id, true, 98);
      },
    });
  };

  const handleDispatch = () => {
    openConfirmDialog({
      title: 'Dispatch Order for Transit',
      message: `Mark Order ${order.trackingNumber} as securely packaged and dispatched?`,
      confirmLabel: 'Mark Dispatched',
      variant: 'primary',
      onConfirm: () => {
        dispatchOrder(order.id);
      },
    });
  };

  const handleConfirmDeliveryAndPayout = () => {
    openConfirmDialog({
      title: 'Confirm Delivery & Release Payout',
      message: `Confirm customer receipt of Order ${order.trackingNumber} and immediately release direct payout of PKR ${order.payoutAmountPKR.toLocaleString()} to ${order.skillPartnerName}?`,
      confirmLabel: 'Authorize Payout Release',
      variant: 'success',
      onConfirm: () => {
        markOrderDelivered(order.id);
        releaseArtisanPayout(order.id);
      },
    });
  };

  return (
    <PageContainer
      kicker={`Order Tracking / ${order.trackingNumber}`}
      title={order.productTitle}
      description={`Placed on ${order.createdAt} · Customer: ${order.customerName} (${order.customerCity})`}
      secondaryActions={
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A5D52] hover:text-[#01411C] px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#BBF7D0] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </Link>
      }
    >
      <div className="space-y-6 font-sans">
        {/* 6-Stage Progress Indicator */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#718579]">
              6-Stage Order Lifecycle
            </span>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    isCurrent
                      ? 'bg-[#F0FDF4] border-[#01411C] ring-2 ring-[#01411C]/20 shadow-xs'
                      : isPast
                      ? 'bg-[#F0FDF4]/50 border-[#BBF7D0]'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#01411C]">
                      STAGE {idx + 1}
                    </span>
                    {(isPast || (isCurrent && order.status === 'delivered')) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#01411C]" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#1A2E22]">{step.label}</h4>
                  <p className="text-[10px] text-[#4A5D52] mt-1 leading-normal line-clamp-2">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: Product & Producer */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
              Craft & Home Artisan
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1A2E22]">{order.productTitle}</h3>
              <p className="text-xs text-[#4A5D52] mt-0.5">
                Quantity: <strong>{order.quantity}</strong> unit
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] text-[#718579] uppercase block font-bold">Producer</span>
              <p className="text-xs font-bold text-[#01411C] mt-0.5">
                {order.skillPartnerName} ({order.skillPartnerCode})
              </p>
              <p className="text-[11px] text-[#4A5D52]">
                Connector: {order.connectorName}
              </p>
            </div>
          </div>

          {/* Box 2: Customer & Delivery Address */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
              Citizen & Delivery Information
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1A2E22]">{order.customerName}</h3>
              <p className="text-xs text-[#4A5D52] mt-0.5">{order.customerPhoneMasked}</p>
            </div>
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] text-[#718579] uppercase block font-bold">Delivery Destination</span>
              <p className="text-xs text-[#1A2E22] mt-0.5">{order.customerAddressMasked}</p>
              <p className="text-[11px] text-[#718579] mt-1">
                Estimated Delivery: <strong>{order.estimatedDeliveryDate}</strong>
              </p>
            </div>
          </div>

          {/* Box 3: Escrow & Payout */}
          <div className="p-5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#01411C]">
              Financial Settlement
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#4A5D52]">Order Total:</span>
              <span className="text-base font-extrabold text-[#1A2E22] tabular-nums">
                PKR {order.totalPKR.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#01411C] font-semibold">Direct Artisan Remuneration:</span>
              <span className="font-extrabold text-[#01411C] tabular-nums">
                PKR {order.payoutAmountPKR.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-[#BBF7D0] flex items-center justify-between text-xs">
              <span>Payout Status:</span>
              <span className="font-bold text-[#01411C]">
                {order.payoutReleased ? 'Settled to Wallet ✓' : 'Secured in Escrow'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel for Operational Flow */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-[#1A2E22]">
              Operational Lifecycle Actions
            </h4>
            <p className="text-[11px] text-[#4A5D52] mt-0.5">
              Advance this order to the next milestone to trigger notifications and payout ledger updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {order.status === 'in_production' && (
              <Button onClick={handleAdvanceQC} variant="executiveGreen" size="sm">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Verify & Pass QC</span>
              </Button>
            )}

            {order.status === 'quality_verified' && (
              <Button onClick={handleDispatch} variant="executiveGreen" size="sm">
                <Truck className="w-4 h-4 mr-1.5" />
                <span>Dispatch Order</span>
              </Button>
            )}

            {order.status === 'dispatched' && (
              <Button onClick={handleConfirmDeliveryAndPayout} variant="executiveGreen" size="sm">
                <CreditCard className="w-4 h-4 mr-1.5" />
                <span>Confirm Delivery & Disburse Payout</span>
              </Button>
            )}

            {order.status === 'delivered' && (
              <span className="text-xs font-bold text-[#01411C] bg-[#DCFCE7] px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
                Lifecycle Complete · Remuneration Settled
              </span>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
