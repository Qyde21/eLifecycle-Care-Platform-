import React, { useEffect } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  Bell, 
  X, 
  ArrowRight, 
  Sparkles,
  CalendarClock
} from 'lucide-react';
import { AppNotification, SpokeId } from '../types';

interface ToastContainerProps {
  toasts: AppNotification[];
  onDismiss: (id: string) => void;
  onNavigateSpoke: (spoke: SpokeId) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onNavigateSpoke,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      id="notification-toast-container" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isRepair = toast.type === 'repair';
        const isInsurance = toast.type === 'insurance';

        const Icon = isRepair 
          ? CalendarClock 
          : isInsurance 
          ? ShieldCheck 
          : Bell;

        const borderClass = isRepair
          ? 'border-amber-500/60 shadow-amber-500/10'
          : isInsurance
          ? 'border-violet-500/60 shadow-violet-500/10'
          : 'border-cyan-500/60 shadow-cyan-500/10';

        const badgeBg = isRepair
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : isInsurance
          ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

        const iconBg = isRepair
          ? 'bg-amber-500/20 text-amber-400'
          : isInsurance
          ? 'bg-violet-500/20 text-violet-400'
          : 'bg-cyan-500/20 text-cyan-400';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto bg-slate-900/95 backdrop-blur-xl border ${borderClass} rounded-2xl p-4 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border ${badgeBg}`}>
                    {toast.type === 'repair' ? 'EMROC Repair Alert' : toast.type === 'insurance' ? 'ELCI Policy Update' : 'System Notice'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {toast.timestamp}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {toast.spokeTarget ? (
                    <button
                      onClick={() => {
                        onNavigateSpoke(toast.spokeTarget!);
                        onDismiss(toast.id);
                      }}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Open in {toast.spokeTarget === 'repair' ? 'Repair Bench' : toast.spokeTarget === 'insurance' ? 'Insurance Care' : 'Module'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">eLifecycle Care Alert</span>
                  )}

                  <button
                    onClick={() => onDismiss(toast.id)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-slate-200 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-800/50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
