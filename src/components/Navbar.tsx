import React, { useState } from 'react';
import { 
  Wrench, 
  Scan, 
  CalendarClock, 
  Cpu, 
  Activity, 
  Recycle, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  Plus, 
  Smartphone, 
  Coins, 
  ChevronDown, 
  User, 
  Building2,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { AppNotification, Device, NotificationType, SpokeId } from '../types';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  activeSpoke: SpokeId;
  onSelectSpoke: (spoke: SpokeId) => void;
  devices: Device[];
  activeDevice: Device;
  onSelectDevice: (device: Device) => void;
  onOpenRegisterModal: () => void;
  circularityCredits: number;
  notifications: AppNotification[];
  browserPermission: NotificationPermission | 'unsupported';
  onRequestPermission: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAllNotifications: () => void;
  onTriggerTestNotification: (type: NotificationType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSpoke,
  onSelectSpoke,
  devices,
  activeDevice,
  onSelectDevice,
  onOpenRegisterModal,
  circularityCredits,
  notifications,
  browserPermission,
  onRequestPermission,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAllNotifications,
  onTriggerTestNotification,
}) => {
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);


  const SPOKE_NAV_ITEMS: { id: SpokeId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Ecosystem Hub', icon: LayoutGrid },
    { id: 'testing', label: '1. Testing', icon: Wrench },
    { id: 'screening', label: '2. Screening', icon: Scan },
    { id: 'repair', label: '3. Repair', icon: CalendarClock },
    { id: 'spares', label: '4. Spares', icon: Cpu },
    { id: 'performance', label: '5. Performance', icon: Activity },
    { id: 'circularity', label: '6. Circularity', icon: Recycle },
    { id: 'insurance', label: '7. Insurance', icon: ShieldCheck },
    { id: 'analytics', label: '8. Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top tier brand and identity bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Identity matching infographic */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectSpoke('overview')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-cyan-400 p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-black text-white text-xs tracking-tighter">
                eLC
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-tight uppercase group-hover:text-amber-400 transition-colors">
                  eLifecycle Care
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  MRO Core Hub
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                Eight Services, One Ecosystem
              </span>
            </div>
          </button>
        </div>

        {/* Center/Right: Device Switcher & Circularity Wallet */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Device Dropdown */}
          <div className="relative">
            <button
              id="active-device-picker-btn"
              onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-xs text-slate-200 transition-all cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-mono">Active Asset</span>
                <span className="font-bold text-slate-100 max-w-[140px] truncate block">
                  {activeDevice.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {deviceDropdownOpen && (
              <div 
                id="device-dropdown-menu"
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 text-[10px] uppercase font-mono font-bold text-slate-400 border-b border-slate-800 flex justify-between items-center">
                  <span>Unified Registry</span>
                  <span>{devices.length} Assets</span>
                </div>

                <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                  {devices.map((dev) => (
                    <button
                      key={dev.id}
                      onClick={() => {
                        onSelectDevice(dev);
                        setDeviceDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        activeDevice.id === dev.id
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-100 block truncate">{dev.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{dev.serialNumber}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                        {dev.healthScore}%
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    id="dropdown-add-device-btn"
                    onClick={() => {
                      onOpenRegisterModal();
                      setDeviceDropdownOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    Register New Asset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Circularity Credits Badge */}
          <button
            onClick={() => onSelectSpoke('circularity')}
            className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-500/60 flex items-center gap-2 text-xs transition-colors cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <div className="text-left">
              <span className="text-[9px] text-emerald-300 uppercase font-mono block">eLC Credits</span>
              <span className="font-bold text-emerald-400 font-mono">
                {circularityCredits.toLocaleString()}
              </span>
            </div>
          </button>

          {/* Browser & In-App Notification Center */}
          <NotificationCenter
            notifications={notifications}
            browserPermission={browserPermission}
            onRequestPermission={onRequestPermission}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onClearAll={onClearAllNotifications}
            onNavigateSpoke={onSelectSpoke}
            onTriggerTestNotification={onTriggerTestNotification}
          />
        </div>
      </div>


      {/* Spoke Navigation Sub-bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar border-t border-slate-900 py-1.5 flex items-center gap-1">
        {SPOKE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isCurrent = activeSpoke === item.id;
          return (
            <button
              key={item.id}
              id={`nav-spoke-${item.id}`}
              onClick={() => onSelectSpoke(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
