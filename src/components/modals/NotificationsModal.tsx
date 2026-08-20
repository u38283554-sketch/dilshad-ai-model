import React from 'react';
import { Bell, CheckCheck, Sparkles, X, Info } from 'lucide-react';
import { NotificationItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-4 mr-0 md:mr-8"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
                Notifications
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark read</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="my-2 space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-500">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition ${
                    n.read
                      ? 'border-neutral-800/60 bg-neutral-950/40 text-neutral-400'
                      : 'border-indigo-500/30 bg-indigo-950/20 text-neutral-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-indigo-400 mt-0.5">
                      {n.type === 'feature' ? (
                        <Sparkles className="h-3.5 w-3.5" />
                      ) : (
                        <Info className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold">{n.title}</p>
                        <span className="text-[10px] text-neutral-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{n.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
