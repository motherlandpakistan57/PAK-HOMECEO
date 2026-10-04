import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  actor?: string;
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex items-start gap-3.5">
            {/* Vertical connector line */}
            {!isLast && (
              <div
                className={`absolute left-3.5 top-6 bottom-0 w-0.5 -ml-px ${
                  event.status === 'completed' ? 'bg-[#01411C]' : 'bg-stone-200'
                }`}
              />
            )}

            {/* Status node */}
            <div className="relative z-10 shrink-0 mt-0.5">
              {event.status === 'completed' ? (
                <div className="w-7 h-7 rounded-full bg-[#F0FDF4] border-2 border-[#01411C] flex items-center justify-center text-[#01411C]">
                  <CheckCircle2 className="w-4 h-4 fill-[#01411C] text-white" />
                </div>
              ) : event.status === 'current' ? (
                <div className="w-7 h-7 rounded-full bg-[#01411C] border-2 border-[#86EFAC] flex items-center justify-center text-white shadow-xs animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-400">
                  <Circle className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4
                  className={`text-xs font-bold leading-tight ${
                    event.status === 'completed' || event.status === 'current'
                      ? 'text-[#1A2E22]'
                      : 'text-[#718579]'
                  }`}
                >
                  {event.title}
                </h4>
                <span className="font-mono text-[11px] text-[#718579] tabular-nums">
                  {event.timestamp}
                </span>
              </div>

              {event.description && (
                <p className="mt-1 text-xs text-[#4A5D52] leading-relaxed">
                  {event.description}
                </p>
              )}

              {event.actor && (
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-[#01411C] bg-[#F0FDF4] px-2 py-0.2 rounded border border-[#BBF7D0]">
                  Facilitator: {event.actor}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
