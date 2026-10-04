import React from 'react';
import { OrderStatus, PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | 'forming' | 'allocated' | 'in_progress' | 'quality_check' | 'ready_dispatch';
  type?: 'order' | 'payment' | 'batch';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'order' }) => {
  // Order status styles
  const orderStyles: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-amber-100/80', text: 'text-amber-900', label: 'New' },
    confirmed: { bg: 'bg-blue-100/80', text: 'text-blue-900', label: 'Confirmed' },
    allocated: { bg: 'bg-indigo-100/80', text: 'text-indigo-900', label: 'Allocated' },
    in_production: { bg: 'bg-purple-100/80', text: 'text-purple-900', label: 'In Production' },
    quality_check: { bg: 'bg-amber-100/80', text: 'text-amber-900', label: 'Quality Check' },
    dispatched: { bg: 'bg-indigo-100/80', text: 'text-indigo-900', label: 'Dispatched' },
    delivered: { bg: 'bg-emerald-100/80', text: 'text-emerald-900', label: 'Delivered' },
    completed: { bg: 'bg-[#F0FDF4]', text: 'text-[#01411C]', label: 'Completed' },
    placed: { bg: 'bg-amber-100/80', text: 'text-amber-900', label: 'New' },
    reviewed_batched: { bg: 'bg-blue-100/80', text: 'text-blue-900', label: 'Allocated' },
    quality_verified: { bg: 'bg-emerald-100/80', text: 'text-emerald-900', label: 'Quality Checked' },
  };

  // Payment status styles
  const paymentStyles: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
    paid: { bg: 'bg-emerald-100/80', text: 'text-emerald-900', label: 'Paid' },
    escrow_hold: { bg: 'bg-blue-100/80', text: 'text-blue-900', label: 'In Escrow' },
    pending_cod: { bg: 'bg-amber-100/80', text: 'text-amber-900', label: 'COD Due' },
    settled: { bg: 'bg-emerald-200', text: 'text-emerald-950', label: 'Settled to Artisan' },
  };

  if (type === 'payment' && status in paymentStyles) {
    const config = paymentStyles[status as PaymentStatus];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  }

  if (status in orderStyles) {
    const config = orderStyles[status as OrderStatus];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  }

  // Fallback for batch status
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
      {status.replace('_', ' ')}
    </span>
  );
};
