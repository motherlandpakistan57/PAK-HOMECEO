import React from 'react';
import { OrderStatus } from '../../types';
import { CheckCircle2, Circle } from 'lucide-react';

export interface StepperProps {
  currentStatus: OrderStatus;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ currentStatus, className = '' }) => {
  const steps = [
    { label: 'Confirmed', desc: 'Received & logged' },
    { label: 'Allocated', desc: 'Assigned to artisan' },
    { label: 'In Production', desc: 'Crafting in progress' },
    { label: 'Quality Check', desc: '6-point audit passed' },
    { label: 'Dispatched', desc: 'In transit via courier' },
    { label: 'Delivered', desc: 'Settled to producer' },
  ];

  const statusRank: Record<OrderStatus, number> = {
    new: 0,
    placed: 0,
    confirmed: 0,
    allocated: 1,
    reviewed_batched: 1,
    in_production: 2,
    quality_check: 3,
    quality_verified: 3,
    dispatched: 4,
    delivered: 5,
    completed: 5,
  };

  const currentIndex = statusRank[currentStatus] ?? 0;

  return (
    <div className={`w-full font-sans ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.label}
              className={`p-3 rounded-xl border text-xs transition-all duration-150 ${
                isCurrent
                  ? 'bg-[#F0FDF4] border-2 border-[#01411C] text-[#01411C] shadow-xs'
                  : isDone
                  ? 'bg-white border-stone-200 text-[#1A2E22]'
                  : 'bg-stone-50 border-stone-200/80 text-[#718579]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#01411C] shrink-0" />
                ) : isCurrent ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#01411C] text-white flex items-center justify-center text-[9px] font-mono shrink-0">
                    {idx + 1}
                  </span>
                ) : (
                  <Circle className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                )}
                <span className="truncate">{step.label}</span>
              </div>
              <p className={`text-[10px] truncate ${isCurrent ? 'text-[#01411C]/80 font-medium' : 'text-[#718579]'}`}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
