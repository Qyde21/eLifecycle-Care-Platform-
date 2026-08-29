import React, { useState } from 'react';
import { 
  Bell, 
  ShieldCheck, 
  CalendarClock, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Radio,
  X
} from 'lucide-react';
import { AppNotification, NotificationType, SpokeId } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  browserPermission: NotificationPermission | 'unsupported';
  onRequestPermission: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigateSpoke: (spoke: SpokeId) => void;
  onTriggerTestNotification: (type: NotificationType) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  browserPermission,
  onRequestPermission,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigateSpoke,
  onTriggerTestNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'repair' | 'insurance'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const handleItemClick = (item: AppNotification) => {
    onMarkAsRead(item.id);
    if (item.spokeTarget) {
      onNavigateSpoke(item.spokeTarget);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        id="notification-center-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
        aria-label="Notification center"
        title="Alerts & Notification Center"
      >
        <Bell className="w-4 h-4 text-slate-300" />
        {unreadCount > 0 && (
          <span 
            id="notification-unread-badge"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse border-2 border-slate-950 shadow-md shadow-amber-500/30"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          id="notification-center-dropdown"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Care Alerts & Updates
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {unreadCount} unread / {notifications.length} total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 text-[11px] transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 text-[11px] transition-colors cursor-pointer"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 text-[11px] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Push Permission Banner */}
          <div className="p-3 bg-slate-950 border-b border-slate-800/80 text-xs">
            {browserPermission === 'granted' ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold">Browser Push Alerts Active</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Desktop & Tab
                </span>
              </div>
            ) : browserPermission === 'denied' ? (
              <div className="flex items-start gap-2 text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-[11px]">
                  <span className="font-bold block">Browser Alerts Blocked</span>
                  <span className="text-slate-400 text-[10px]">
                    Unblock in browser address bar permissions to receive background updates.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2 text-slate-300">
                  <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-[11px]">
                    <span className="font-bold text-white block">Enable Native Browser Notifications</span>
                    <span className="text-slate-400 text-[10px]">
                      Get instant alerts when repair technicians update bench progress or insurance policies change.
                    </span>
                  </div>
                </div>
                <button
                  id="grant-browser-notifications-btn"
                  onClick={onRequestPermission}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Enable Push Notifications
                </button>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-3 pt-2 pb-1 border-b border-slate-800 bg-slate-900/60 flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('repair')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                filter === 'repair'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarClock className="w-3 h-3 text-amber-400" />
              Repairs ({notifications.filter((n) => n.type === 'repair').length})
            </button>
            <button
              onClick={() => setFilter('insurance')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                filter === 'insurance'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-violet-400" />
              Insurance ({notifications.filter((n) => n.type === 'insurance').length})
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto max-h-72 p-2 space-y-1.5 divide-y divide-slate-800/40">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-30 text-slate-400" />
                <p>No notifications in this category.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isRepair = item.type === 'repair';
                const isInsurance = item.type === 'insurance';

                const Icon = isRepair ? CalendarClock : isInsurance ? ShieldCheck : Bell;
                const iconBg = isRepair
                  ? 'bg-amber-500/20 text-amber-400'
                  : isInsurance
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-cyan-500/20 text-cyan-400';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3 rounded-xl transition-colors cursor-pointer flex items-start gap-2.5 ${
                      item.read
                        ? 'bg-slate-950/40 hover:bg-slate-800/60 opacity-80'
                        : 'bg-slate-800/70 hover:bg-slate-800 border-l-2 ' + (isRepair ? 'border-amber-400' : isInsurance ? 'border-violet-400' : 'border-cyan-400')
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.timestamp}
                        </span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                        {item.message}
                      </p>

                      {item.spokeTarget && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                          <span>View in {item.spokeTarget === 'repair' ? 'Repair Bench' : 'Insurance'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Simulation Trigger Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px]">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Instant Notification Testing
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="test-repair-notification-btn"
                onClick={() => onTriggerTestNotification('repair')}
                className="py-1.5 px-2 rounded-lg bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 text-amber-300 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <CalendarClock className="w-3 h-3 text-amber-400" />
                Trigger Repair Alert
              </button>
              <button
                id="test-insurance-notification-btn"
                onClick={() => onTriggerTestNotification('insurance')}
                className="py-1.5 px-2 rounded-lg bg-violet-950/60 border border-violet-500/40 hover:bg-violet-900/60 text-violet-300 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-violet-400" />
                Trigger Policy Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
