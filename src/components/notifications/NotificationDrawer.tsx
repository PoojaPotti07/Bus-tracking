import React from 'react';
import { NotificationMessage } from '../../types/transit';
import { Bell, Check, Trash2, X, Clock, AlertTriangle, Compass } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationMessage[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSelectBusNumber?: (busNumber: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  onSelectBusNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-900 transition-transform">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Transit Notifications
            </h3>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-mono">
                {notifications.filter((n) => !n.read).length} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                title="Clear all notifications"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-xs text-slate-400">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <span>No notifications right now</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-xl border p-3 text-xs transition-colors ${
                  notif.read
                    ? 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/60 text-slate-500'
                    : 'border-blue-100 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 text-slate-800 dark:text-slate-200 font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {notif.type === 'delay' ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    <span>{notif.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>

                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {notif.body}
                </p>

                <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {notif.busNumber && onSelectBusNumber ? (
                    <button
                      onClick={() => {
                        onSelectBusNumber(notif.busNumber!);
                        onClose();
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                    >
                      <Compass className="h-3 w-3" />
                      <span>Track Bus {notif.busNumber}</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-3 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 text-[11px] text-slate-400 text-center">
          Alerts auto-refresh during active route tracking.
        </div>

      </div>
    </div>
  );
};
