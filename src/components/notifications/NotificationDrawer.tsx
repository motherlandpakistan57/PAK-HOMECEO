import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  ShoppingBag,
  Layers,
  CreditCard,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { NotificationType } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const navigate = useNavigate();

  if (!isNotificationsOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIconForType = (type?: NotificationType) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-700" />;
      case 'production':
        return <Layers className="w-4 h-4 text-[#01411C]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-800" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-700" />;
      case 'action_required':
        return <AlertTriangle className="w-4 h-4 text-amber-700" />;
      default:
        return <Bell className="w-4 h-4 text-stone-700" />;
    }
  };

  const getBgForType = (type?: NotificationType) => {
    switch (type) {
      case 'order':
        return 'bg-[#F0FDF4] border-[#BBF7D0]';
      case 'production':
        return 'bg-emerald-50 border-emerald-200';
      case 'payment':
        return 'bg-emerald-50/80 border-emerald-200';
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'action_required':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-stone-50 border-stone-200';
    }
  };

  const handleNotificationClick = (id: string, actionUrl?: string) => {
    markNotificationRead(id);
    if (actionUrl) {
      setIsNotificationsOpen(false);
      navigate(actionUrl);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsNotificationsOpen(false)}
    >
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col font-sans border-l border-stone-200 animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#01411C]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1A2E22] font-sans">
                  Notification Center
                </h3>
                <p className="text-[11px] text-[#4A5D52] font-sans">
                  {unreadCount} unread operational update{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  title="Mark all as read"
                  className="p-1.5 text-xs text-[#01411C] hover:bg-[#F0FDF4] rounded-lg transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Read all</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-2.5 bg-white border-b border-stone-200 overflow-x-auto text-[11px] font-semibold">
            {[
              { id: 'all', label: 'All' },
              { id: 'order', label: 'Orders' },
              { id: 'production', label: 'Production' },
              { id: 'payment', label: 'Payments' },
              { id: 'message', label: 'Messages' },
              { id: 'action_required', label: 'Action Required' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#01411C] text-white shadow-xs'
                    : 'text-[#4A5D52] hover:bg-[#F0FDF4] hover:text-[#01411C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-[#1A2E22]">No notifications</h4>
                <p className="text-[11px] text-[#718579] mt-1 max-w-xs mx-auto">
                  You have reviewed all updates in this category. New platform alerts will appear here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.actionUrl)}
                  className={`p-3.5 rounded-xl border transition-all text-left relative cursor-pointer group ${
                    notif.read
                      ? 'bg-white border-stone-200 hover:border-[#BBF7D0] hover:bg-[#FAF9F6]'
                      : 'bg-[#F0FDF4]/70 border-[#BBF7D0] hover:bg-[#F0FDF4]'
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#01411C]" />
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getBgForType(
                        notif.type
                      )}`}
                    >
                      {getIconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#1A2E22] truncate group-hover:text-[#01411C] font-sans">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-[#718579] shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A5D52] font-sans mt-1 leading-normal line-clamp-2">
                        {notif.message}
                      </p>
                      {notif.actionUrl && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#01411C]">
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-[#718579]">
            <span>Real-time enterprise channel</span>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(false);
                navigate('/settings');
              }}
              className="text-[#01411C] font-semibold hover:underline cursor-pointer text-[11px]"
            >
              Alert Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
