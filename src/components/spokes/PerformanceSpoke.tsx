import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Flame, 
  Zap, 
  Gauge, 
  BellRing, 
  TrendingDown, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Play, 
  CheckCircle2 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Device, SpokeId } from '../../types';

interface PerformanceSpokeProps {
  activeDevice: Device;
  onNavigateSpoke: (spoke: SpokeId) => void;
}

const GENERATE_TELEMETRY = () => {
  const points = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    points.push({
      time,
      tempC: Math.round(52 + Math.sin(i * 0.5) * 14 + Math.random() * 4),
      voltageV: Number((230 + Math.cos(i * 0.3) * 6 + Math.random() * 2).toFixed(1)),
      efficiency: Math.round(96 - (i * 0.08) - (Math.random() * 1.5)),
      vibrationMmS: Number((1.2 + Math.random() * 0.6).toFixed(2)),
      healthIndex: Math.round(82 - (i * 0.05)),
    });
  }
  return points;
};

export const PerformanceSpoke: React.FC<PerformanceSpokeProps> = ({
  activeDevice,
  onNavigateSpoke,
}) => {
  const [telemetryData, setTelemetryData] = useState(GENERATE_TELEMETRY());
  const [activeMetric, setActiveMetric] = useState<'temp' | 'voltage' | 'efficiency'>('temp');
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryData(prev => {
        const last = prev[prev.length - 1];
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newPoint = {
          time: nextTime,
          tempC: Math.round(54 + Math.random() * 12),
          voltageV: Number((230 + Math.random() * 4 - 2).toFixed(1)),
          efficiency: Math.round(95 + Math.random() * 2),
          vibrationMmS: Number((1.3 + Math.random() * 0.4).toFixed(2)),
          healthIndex: last ? last.healthIndex : 80,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRunOptimization = (actionName: string) => {
    setActionDone(actionName);
    setTimeout(() => setActionDone(null), 3000);
  };

  const currentPoint = telemetryData[telemetryData.length - 1];

  return (
    <div id="performance-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                  Spoke 05 : Performance Optimization
                </span>
                <span className="text-xs text-emerald-400 font-mono">● LIVE IoT Telemetry</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                Connected Asset Health & Degradation Forecasting
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Real-time sensor telemetry stream, automated service-interval notifications, and dynamic thermal curve modeling.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">Connected Asset:</span>
            <span className="text-sm font-bold text-slate-200">{activeDevice.name}</span>
            <span className="text-xs font-mono text-teal-400 block">ID: {activeDevice.serialNumber}</span>
          </div>
        </div>
      </div>

      {/* Real-Time Stat Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveMetric('temp')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'temp' 
              ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/40' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Operating Temp</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currentPoint.tempC}°C
          </div>
          <div className="text-[10px] text-amber-400 font-medium mt-1">
            +4°C above ambient baseline
          </div>
        </div>

        <div 
          onClick={() => setActiveMetric('voltage')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'voltage' 
              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/40' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Voltage Stability</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currentPoint.voltageV} V
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-1">
            Ripple delta &lt; 0.4% RMS
          </div>
        </div>

        <div 
          onClick={() => setActiveMetric('efficiency')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'efficiency' 
              ? 'bg-teal-950/40 border-teal-500 ring-1 ring-teal-500/40' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Conversion Efficiency</span>
            <Gauge className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currentPoint.efficiency}%
          </div>
          <div className="text-[10px] text-teal-300 font-medium mt-1">
            Operating near nominal curve
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Battery / BMS Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {activeDevice.batteryHealth || 84}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Est. replacement in 14 months
          </div>
        </div>
      </div>

      {/* Main Telemetry Line Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              24-Hour Telemetry Stream & Degradation Curve
            </h3>
            <p className="text-xs text-slate-400">
              High-frequency sensor updates relayed via Nobscott Edge Gateway telemetry bus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-semibold">Streaming Live</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryData}>
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={activeMetric === 'temp' ? '#f43f5e' : activeMetric === 'voltage' ? '#f59e0b' : '#14b8a6'} 
                    stopOpacity={0.4}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={activeMetric === 'temp' ? '#f43f5e' : activeMetric === 'voltage' ? '#f59e0b' : '#14b8a6'} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={activeMetric === 'temp' ? 'tempC' : activeMetric === 'voltage' ? 'voltageV' : 'efficiency'} 
                stroke={activeMetric === 'temp' ? '#f43f5e' : activeMetric === 'voltage' ? '#f59e0b' : '#14b8a6'} 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#metricGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Automated Service Interval Alerts & Optimization Commands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automated Alerts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-400" />
            Automated Service-Interval Alerts
          </h4>

          <div className="space-y-2.5">
            <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  Thermal Paste Renewal Due in 18 Days
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Thermal conductivity degraded by 12%. Reapplying liquid interface will prevent IGBT thermal throttling.
                </p>
              </div>
              <button 
                onClick={() => onNavigateSpoke('repair')}
                className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500 text-slate-950 hover:bg-amber-400 shrink-0 cursor-pointer"
              >
                Schedule
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  Electrolytic Capacitor ESR Test Passed
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ripple attenuation steady at 98.4%. Next automated capacitance scan in 45 days.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Nominal</span>
            </div>
          </div>
        </div>

        {/* 1-Click Remote Optimization Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-400" />
            Remote IoT Tuning & Recalibration Controls
          </h4>

          <div className="space-y-2">
            <button
              onClick={() => handleRunOptimization('BMS Micro-Calibration Cycle Initiated')}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 flex items-center justify-between text-xs text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-bold text-slate-200 block">Trigger BMS Cell Balance Recalibration</span>
                <span className="text-[10px] text-slate-400">Equalizes series cell voltages and resets Coulomb counter</span>
              </div>
              <Play className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            </button>

            <button
              onClick={() => handleRunOptimization('Thermal Fan Curve Flushed & Optimized')}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 flex items-center justify-between text-xs text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-bold text-slate-200 block">Deploy Dynamic PWM Fan Speed Preset</span>
                <span className="text-[10px] text-slate-400">Reduces acoustic resonance while boosting thermal headroom</span>
              </div>
              <Play className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            </button>
          </div>

          {actionDone && (
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {actionDone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
