import React from 'react';
import { NotificationItem as NotificationType, UserRole } from '../../types';
import { Briefcase, HeartHandshake, MapPin, Sparkles, Bell } from 'lucide-react';

export interface NotificationItemProps {
  notification: NotificationType;
  onRead?: (id: string) => void;
  className?: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  className = '',
}) => {
  const roleIcons: Record<UserRole, React.ReactNode> = {
    builder: <Briefcase className="w-4 h-4 text-[#01411C]" />,
    partner: <HeartHandshake className="w-4 h-4 text-amber-600" />,
    connector: <MapPin className="w-4 h-4 text-emerald-600" />,
    citizen: <Sparkles className="w-4 h-4 text-indigo-600" />,
    patron: <Sparkles className="w-4 h-4 text-indigo-600" />,
  };

  const icon = notification.targetRole ? roleIcons[notification.targetRole] : <Bell className="w-4 h-4 text-[#01411C]" />;

  return (
    <div
      onClick={() => onRead?.(notification.id)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer font-sans ${
        notification.read
          ? 'bg-white border-stone-200/80 text-[#4A5D52]'
          : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#1A2E22] shadow-2xs'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-xs font-bold truncate">{notification.title}</h4>
            <span className="font-mono text-[10px] text-[#718579] tabular-nums shrink-0">
              {notification.timestamp}
            </span>
          </div>
          <p className="text-[11px] text-[#4A5D52] mt-0.5 leading-relaxed line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
};
