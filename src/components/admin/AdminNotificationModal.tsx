import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminNotification, NotificationCategory } from '../../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Check,
  ExternalLink,
  Trash2,
  Filter,
  ArrowRight
} from 'lucide-react';

interface AdminNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const AdminNotificationModal: React.FC<AdminNotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const {
    adminNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    currentAdmin
  } = useStore();

  const [filterCategory, setFilterCategory] = useState<'all' | NotificationCategory>('all');

  if (!isOpen) return null;

  const notificationsList = Array.isArray(adminNotifications) ? adminNotifications : [];
  const unreadCount = notificationsList.filter(n => !n.read).length;

  const filteredNotifications = notificationsList.filter(n => {
    if (filterCategory !== 'all' && n.category !== filterCategory) return false;
    return true;
  });

  const handleActionClick = (notification: AdminNotification) => {
    markNotificationAsRead(notification.id, currentAdmin.name);
    const target = notification.actionTab || notification.actionUrl;
    if (target) {
      onNavigate(target);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-start justify-end p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in slide-in-from-right-4 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">System Alerts & Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {(['all', 'ssl', 'seo', 'domain', 'server', 'error'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat as any)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold transition whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllNotificationsAsRead(currentAdmin.name)}
              className="text-[11px] text-amber-700 hover:text-amber-800 font-bold whitespace-nowrap ml-2"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-stone-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <p className="text-xs font-bold text-stone-700">All alerts cleared</p>
              <p className="text-[11px] text-stone-500">No active system warnings for this category.</p>
            </div>
          ) : (
            filteredNotifications.map(n => (
              <div
                key={n.id}
                className={`p-4 transition flex items-start justify-between gap-3 ${
                  n.read ? 'bg-white hover:bg-stone-50/50' : 'bg-amber-50/40 hover:bg-amber-50/70'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {n.severity === 'critical' ? (
                    <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  ) : n.severity === 'warning' ? (
                    <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
                      <Info className="w-4 h-4" />
                    </span>
                  )}

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs truncate ${n.read ? 'font-semibold text-stone-800' : 'font-bold text-stone-900'}`}>
                        {n.title}
                      </p>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {n.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">{n.message}</p>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(n.timestamp).toLocaleDateString()}
                      </span>

                      {n.actionLabel && (
                        <button
                          onClick={() => handleActionClick(n)}
                          className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800"
                        >
                          <span>{n.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markNotificationAsRead(n.id, currentAdmin.name)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded"
                      title="Mark read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id, currentAdmin.name)}
                    className="p-1 text-stone-300 hover:text-rose-600 rounded"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
