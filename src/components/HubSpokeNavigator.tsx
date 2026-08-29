import React from 'react';
import { 
  Wrench, 
  Scan, 
  CalendarClock, 
  Cpu, 
  Activity, 
  Recycle, 
  ShieldCheck, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  Radio,
  ExternalLink
} from 'lucide-react';
import { SpokeId } from '../types';

interface HubSpokeNavigatorProps {
  activeSpoke: SpokeId;
  onSelectSpoke: (spoke: SpokeId) => void;
}

interface SpokeDefinition {
  id: SpokeId;
  title: string;
  subtitle: string;
  summary: string;
  icon: React.ElementType;
  position: 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
  badgeColor: string;
  accentBorder: string;
  metric: string;
}

export const SPOKES: SpokeDefinition[] = [
  {
    id: 'testing',
    title: 'Testing',
    subtitle: 'AI-Guided Self-Triage',
    summary: 'Customer describes symptoms; app returns fault probability, urgency score and repair-vs-replace recommendation.',
    icon: Wrench,
    position: 'top',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    accentBorder: 'hover:border-indigo-400 group-hover:shadow-indigo-500/20',
    metric: '94.2% AI Accuracy',
  },
  {
    id: 'screening',
    title: 'Screening',
    subtitle: 'Photo-AI & History Grading',
    summary: 'Device grading via photo-AI and self-reported history. Assigns lifecycle stage: active care, refurbish, harvest-spares, or end-of-life.',
    icon: Scan,
    position: 'top-right',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentBorder: 'hover:border-blue-400 group-hover:shadow-blue-500/20',
    metric: '4-Stage Classification',
  },
  {
    id: 'repair',
    title: 'Repair Booking',
    subtitle: 'Certified EMROC Network',
    summary: 'One-tap booking to nearest certified EMROC facility or vetted partner. Live technician assignment, ETA, and in-app progress tracking.',
    icon: CalendarClock,
    position: 'right',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentBorder: 'hover:border-amber-400 group-hover:shadow-amber-500/20',
    metric: '4 Ready Facilities',
  },
  {
    id: 'spares',
    title: 'Spares',
    subtitle: 'OEM & Harvested Marketplace',
    summary: "Marketplace for OEM-grade and certified-refurbished components. Sourced from certified pool of harvested and new parts. M-Pesa payment native.",
    icon: Cpu,
    position: 'bottom-right',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentBorder: 'hover:border-cyan-400 group-hover:shadow-cyan-500/20',
    metric: '1,420 Verified Parts',
  },
  {
    id: 'circularity',
    title: 'Circularity',
    subtitle: 'End-of-Life & Credits',
    summary: 'End-of-life collection booking. Transparent tracking of what was recovered. Circularity credits earned and redeemable against future services.',
    icon: Recycle,
    position: 'bottom',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentBorder: 'hover:border-emerald-400 group-hover:shadow-emerald-500/20',
    metric: '100% WEEE Certified',
  },
  {
    id: 'performance',
    title: 'Performance',
    subtitle: 'IoT Telemetry & Health Alerts',
    summary: 'IoT integration for connected assets. Continuous health monitoring, automated service-interval alerts, degradation trend analysis.',
    icon: Activity,
    position: 'bottom-left',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    accentBorder: 'hover:border-teal-400 group-hover:shadow-teal-500/20',
    metric: 'Live Sensor Stream',
  },
  {
    id: 'insurance',
    title: 'Insurance (ELCI)',
    subtitle: 'Dynamic Age & Health Premiums',
    summary: "In-app activation of Electronics Lifecycle Care Insurance product. Premiums calculated from device age and health score.",
    icon: ShieldCheck,
    position: 'left',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    accentBorder: 'hover:border-violet-400 group-hover:shadow-violet-500/20',
    metric: 'Instant Auto-Claim',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'B2B Fleet ESG & Carbon',
    summary: 'B2B dashboard for fleet owners, OEMs and facilities managers. Device health across portfolios, cost-per-unit, ESG reporting, carbon savings.',
    icon: BarChart3,
    position: 'top-left',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentBorder: 'hover:border-purple-400 group-hover:shadow-purple-500/20',
    metric: 'Scope-3 ESG Ready',
  },
];

export const HubSpokeNavigator: React.FC<HubSpokeNavigatorProps> = ({
  activeSpoke,
  onSelectSpoke,
}) => {
  return (
    <div id="hub-spoke-navigator-container" className="relative w-full space-y-8">
      {/* Editorial Platform Header matching the diagram */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-8 bg-amber-500 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              The Platform Ecosystem
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            eLifecycle Care App: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-teal-300 to-cyan-400">eight services, one ecosystem</span>
          </h1>

          <p className="mt-1 text-sm md:text-base font-semibold text-slate-300 italic">
            A hub-and-spoke architecture with <strong className="text-amber-400 font-bold not-italic">Central MRO Core</strong> at the centre
          </p>

          <p className="mt-4 text-xs md:text-sm text-slate-400 leading-relaxed max-w-3xl">
            The eLC App is not a repair-booking app with a few extra features bolted on. It is a complete platform ecosystem:
            eight integrated service modules that share a single customer identity, a unified device registry, and a common data layer that gets smarter with every interaction. The architecture is deliberately open — designed to onboard certified third-party repair partners, spares suppliers and recyclers — while keeping the central MRO core at the centre as the quality anchor and last-resort service provider.
          </p>
        </div>
      </div>

      {/* Visual Hub & Spoke Diagram Display */}
      <div 
        id="interactive-spoke-canvas"
        className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-10 relative overflow-hidden flex flex-col items-center justify-center min-h-[580px]"
      >
        {/* Subtle radial grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

        {/* Central Hub Node */}
        <div className="relative z-20 flex flex-col items-center my-8 md:my-12">
          <div 
            id="central-mro-hub"
            className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-4 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center text-center p-4 transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
              <div className="w-3 h-3 rounded-full bg-amber-500 absolute -top-1 -right-1" />
              <div className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                Platform Core
              </div>
            </div>

            <div className="text-sm md:text-base font-black tracking-tight text-white uppercase mt-1">
              eLIFECYCLE
            </div>
            <div className="text-xs md:text-sm font-extrabold text-cyan-400 tracking-wider uppercase">
              CARE APP
            </div>

            <div className="mt-2 text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
              Central MRO Anchor
            </div>
          </div>
        </div>

        {/* 8 Spokes Grid representation */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-20">
          {SPOKES.map((spoke) => {
            const Icon = spoke.icon;
            const isSelected = activeSpoke === spoke.id;

            return (
              <button
                key={spoke.id}
                id={`spoke-btn-${spoke.id}`}
                onClick={() => onSelectSpoke(spoke.id)}
                className={`group text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${spoke.badgeColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm group-hover:text-amber-400 transition-colors">
                          {spoke.title}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {spoke.subtitle}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      {spoke.metric}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {spoke.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-amber-400 transition-colors">
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spokes breakdown legend matching exact text from infographic */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          What each spoke does in the eLC Ecosystem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
          {SPOKES.map((spoke) => (
            <div 
              key={spoke.id}
              onClick={() => onSelectSpoke(spoke.id)}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors cursor-pointer flex gap-3 items-start"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-100 font-semibold">{spoke.title}</strong> —{' '}
                <span className="text-slate-400">{spoke.summary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
