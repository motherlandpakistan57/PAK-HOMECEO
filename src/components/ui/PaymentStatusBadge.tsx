import React from 'react';
import { PaymentStatus } from '../../types';

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className = '' }) => {
  const configs: Record<PaymentStatus, { bg: string; text: string; label: string; dot: string }> = {
    paid: {
      bg: 'bg-[#F0FDF4] border-[#BBF7D0]',
      text: 'text-[#01411C]',
      label: 'Paid (Settled)',
      dot: 'bg-[#01411C]',
    },
    escrow_hold: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-900',
      label: 'Escrow Protected',
      dot: 'bg-blue-600',
    },
    pending_cod: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-900',
      label: 'Cash on Delivery',
      dot: 'bg-amber-600',
    },
    settled: {
      bg: 'bg-[#01411C] border-[#002C12]',
      text: 'text-white',
      label: 'Disbursed to Artisan',
      dot: 'bg-[#86EFAC]',
    },
  };

  const config = configs[status] || configs.paid;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
