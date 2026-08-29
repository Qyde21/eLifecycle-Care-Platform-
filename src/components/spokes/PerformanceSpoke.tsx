import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Flame, 
  Zap, 
  Gauge, 
  BellRing, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Play, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  Info,
  Wrench,
  Cpu,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  ReferenceLine, 
  AreaChart, 
  Area 
} from 'recharts';
import { Device, SpokeId } from '../../types';

interface PerformanceSpokeProps {
  activeDevice: Device;
  onNavigateSpoke: (spoke: SpokeId) => void;
}

interface HealthTimelinePoint {
  date: string;
  timestamp: number;
  healthScore: number;
  unmanagedBaseline: number;
  bmsHealth: number;
  thermalHealth: number;
  isForecast?: boolean;
  event?: string;
  eventType?: 'intake' | 'maintenance' | 'firmware' | 'current' | 'forecast';
}

type TimeframeOption = 'lifetime' | '12m' | '90d';

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

// Generates historically grounded and predictive health timeline progression points
const generateHealthProgression = (device: Device, timeframe: TimeframeOption, simulatedServiceCount: number): HealthTimelinePoint[] => {
  const currentHealth = device.healthScore;
  const purchaseYear = device.manufactureYear || 2023;
  const purchaseDateObj = new Date(device.purchaseDate || `${purchaseYear}-01-15`);
  const now = new Date();
  
  if (timeframe === '90d') {
    // 90 days of weekly/daily resolution
    const points: HealthTimelinePoint[] = [];
    const totalDays = 90;
    const startHealth = Math.min(100, currentHealth + 5);

    for (let day = totalDays; day >= 0; day -= 6) {
      const pointDate = new Date(now.getTime() - day * 24 * 3600 * 1000);
      const progressRatio = (totalDays - day) / totalDays;
      const degradation = (1 - progressRatio) * 5;
      const score = Math.round(startHealth - degradation + (Math.random() * 1.5 - 0.75));
      const unmanaged = Math.round(startHealth - (progressRatio * 14));

      let event: string | undefined;
      let eventType: HealthTimelinePoint['eventType'];

      if (day === 60) {
        event = 'Automated Thermal Recalibration';
        eventType = 'firmware';
      } else if (day === 0) {
        event = 'Live Health Telemetry';
        eventType = 'current';
      }

      points.push({
        date: pointDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: pointDate.getTime(),
        healthScore: day === 0 ? currentHealth : Math.max(10, Math.min(100, score)),
        unmanagedBaseline: Math.max(10, Math.min(100, unmanaged)),
        bmsHealth: Math.round((device.batteryHealth || 85) + (day === 0 ? 0 : 2)),
        thermalHealth: Math.round(92 - (day === 0 ? 8 : 4)),
        isForecast: false,
        event,
        eventType
      });
    }

    // Add 30-day forecast
    for (let day = 6; day <= 30; day += 6) {
      const forecastDate = new Date(now.getTime() + day * 24 * 3600 * 1000);
      const forecastDecay = simulatedServiceCount > 0 ? (day * 0.02) : (day * 0.08);
      const boostedScore = currentHealth + (simulatedServiceCount * 4) - forecastDecay;
      const unmanaged = currentHealth - (day * 0.2);

      points.push({
        date: forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: forecastDate.getTime(),
        healthScore: Math.round(Math.max(10, Math.min(100, boostedScore))),
        unmanagedBaseline: Math.round(Math.max(10, Math.min(100, unmanaged))),
        bmsHealth: Math.max(20, Math.round((device.batteryHealth || 85) - day * 0.05)),
        thermalHealth: Math.round(86 + (simulatedServiceCount > 0 ? 8 : 0)),
        isForecast: true,
        event: day === 30 ? 'Projected 30D Forecast' : undefined,
        eventType: 'forecast'
      });
    }

    return points;
  }

  if (timeframe === '12m') {
    // 12 months historical + 6 months forecast
    const points: HealthTimelinePoint[] = [];
    const months = 12;
    const startHealth = Math.min(99, currentHealth + 12);

    for (let m = months; m >= 0; m--) {
      const pointDate = new Date(now.getFullYear(), now.getMonth() - m, 15);
      const progress = (months - m) / months;
      // Slight rebound at month 4 due to service
      const serviceBump = (m <= 6 && m >= 4) ? 3 : 0;
      const score = Math.round(startHealth - (progress * 12) + serviceBump);
      const unmanaged = Math.round(startHealth - (progress * 24));

      let event: string | undefined;
      let eventType: HealthTimelinePoint['eventType'];

      if (m === 12) {
        event = 'Annual Inspection Log';
        eventType = 'intake';
      } else if (m === 6) {
        event = 'Preventative Benchmark Overhaul';
        eventType = 'maintenance';
      } else if (m === 0) {
        event = 'Current Verified State';
        eventType = 'current';
      }

      points.push({
        date: pointDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        timestamp: pointDate.getTime(),
        healthScore: m === 0 ? currentHealth : Math.max(10, Math.min(100, score)),
        unmanagedBaseline: Math.max(10, Math.min(100, unmanaged)),
        bmsHealth: Math.max(20, Math.round((device.batteryHealth || 85) + (m * 0.8))),
        thermalHealth: Math.round(88 - (m === 0 ? 6 : 2)),
        isForecast: false,
        event,
        eventType
      });
    }

    // Add 6 months forecast
    for (let m = 1; m <= 6; m++) {
      const forecastDate = new Date(now.getFullYear(), now.getMonth() + m, 15);
      const boost = simulatedServiceCount * 5;
      const decay = simulatedServiceCount > 0 ? (m * 0.4) : (m * 1.1);
      const score = currentHealth + boost - decay;
      const unmanaged = currentHealth - (m * 2.8);

      points.push({
        date: forecastDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        timestamp: forecastDate.getTime(),
        healthScore: Math.round(Math.max(10, Math.min(100, score))),
        unmanagedBaseline: Math.round(Math.max(10, Math.min(100, unmanaged))),
        bmsHealth: Math.max(20, Math.round((device.batteryHealth || 85) - m * 0.7)),
        thermalHealth: Math.round(84 + (simulatedServiceCount > 0 ? 10 : 0)),
        isForecast: true,
        event: m === 6 ? '6-Month Projection' : undefined,
        eventType: 'forecast'
      });
    }

    return points;
  }

  // 'lifetime' view (from purchase date to current + 12M predictive forecast)
  const points: HealthTimelinePoint[] = [];
  const startYear = purchaseDateObj.getFullYear();
  const currentYear = now.getFullYear();
  const spanYears = Math.max(1, currentYear - startYear + 1);
  const totalQuarterSteps = spanYears * 4;

  let runningHealth = 99;
  let runningUnmanaged = 99;

  for (let q = 0; q <= totalQuarterSteps; q++) {
    const quarterDate = new Date(startYear, q * 3, 1);
    if (quarterDate.getTime() > now.getTime()) break;

    const fraction = q / Math.max(1, totalQuarterSteps);
    
    // Normal degradation with service rebounds
    let event: string | undefined;
    let eventType: HealthTimelinePoint['eventType'];

    if (q === 0) {
      runningHealth = 99;
      runningUnmanaged = 99;
      event = 'Asset Commissioned';
      eventType = 'intake';
    } else {
      // Step decay
      const normalDecay = 2.2 + Math.random() * 0.8;
      const unmanagedDecay = 5.2 + Math.random() * 1.5;
      
      runningUnmanaged -= unmanagedDecay;

      if (q === 3) {
        runningHealth += 4; // Service rebound
        event = '1st Milestone Cleanroom Tune';
        eventType = 'maintenance';
      } else if (q === 6) {
        runningHealth += 3; // Firmware & Thermal overhaul
        event = 'Thermal Overhaul & Micro-Soldering';
        eventType = 'maintenance';
      } else {
        runningHealth -= normalDecay;
      }
    }

    points.push({
      date: quarterDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      timestamp: quarterDate.getTime(),
      healthScore: Math.round(Math.max(15, Math.min(100, runningHealth))),
      unmanagedBaseline: Math.round(Math.max(10, Math.min(100, runningUnmanaged))),
      bmsHealth: Math.max(20, Math.round(100 - (fraction * 22))),
      thermalHealth: Math.max(20, Math.round(96 - (fraction * 18))),
      isForecast: false,
      event,
      eventType
    });
  }

  // Ensure last past point matches activeDevice.healthScore exactly
  if (points.length > 0) {
    points[points.length - 1].healthScore = currentHealth;
    points[points.length - 1].date = 'Current (Live)';
    points[points.length - 1].event = 'Verified Active State';
    points[points.length - 1].eventType = 'current';
  }

  // Add 4 future quarters forecast (12 months ahead)
  for (let fq = 1; fq <= 4; fq++) {
    const fqDate = new Date(now.getFullYear(), now.getMonth() + (fq * 3), 1);
    const boost = simulatedServiceCount * 6;
    const decay = simulatedServiceCount > 0 ? (fq * 0.6) : (fq * 1.8);
    const score = currentHealth + boost - decay;
    const unmanaged = Math.max(10, (points[points.length - 1]?.unmanagedBaseline || 40) - (fq * 6));

    points.push({
      date: fqDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) + ' (Est)',
      timestamp: fqDate.getTime(),
      healthScore: Math.round(Math.max(10, Math.min(100, score))),
      unmanagedBaseline: Math.round(Math.max(5, unmanaged)),
      bmsHealth: Math.max(15, Math.round((device.batteryHealth || 85) - fq * 1.5)),
      thermalHealth: Math.round(82 + (simulatedServiceCount > 0 ? 12 : 0)),
      isForecast: true,
      event: fq === 4 ? '12M Predictive Threshold' : undefined,
      eventType: 'forecast'
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
  
  // Health Score Progression Line Chart State
  const [timeframe, setTimeframe] = useState<TimeframeOption>('lifetime');
  const [showUnmanagedBaseline, setShowUnmanagedBaseline] = useState<boolean>(true);
  const [showComponentBreakdown, setShowComponentBreakdown] = useState<boolean>(false);
  const [simulatedServiceCycles, setSimulatedServiceCycles] = useState<number>(0);

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

  const handleSimulateService = () => {
    setSimulatedServiceCycles(prev => prev + 1);
    setActionDone('Preventative Service Cycle Projected (+6.2 Health Index Rebound)');
    setTimeout(() => setActionDone(null), 4000);
  };

  const handleResetSimulation = () => {
    setSimulatedServiceCycles(0);
  };

  const currentPoint = telemetryData[telemetryData.length - 1];

  // Generate health chart points based on active device
  const healthTimelineData = useMemo(() => {
    return generateHealthProgression(activeDevice, timeframe, simulatedServiceCycles);
  }, [activeDevice, timeframe, simulatedServiceCycles]);

  // Derived metrics from health progression
  const currentHealthScore = activeDevice.healthScore;
  const healthTier = currentHealthScore >= 80 
    ? { label: 'Optimal / Class-A', color: 'text-emerald-400', badgeBg: 'bg-emerald-950/80 border-emerald-800/80' }
    : currentHealthScore >= 60
    ? { label: 'Active Care Required', color: 'text-amber-400', badgeBg: 'bg-amber-950/80 border-amber-800/80' }
    : { label: 'Refurbish / Harvesting Tier', color: 'text-rose-400', badgeBg: 'bg-rose-950/80 border-rose-800/80' };

  const averageAnnualDegradation = useMemo(() => {
    const years = Math.max(1, new Date().getFullYear() - (activeDevice.manufactureYear || 2023));
    const drop = 100 - activeDevice.healthScore;
    return (drop / years).toFixed(1);
  }, [activeDevice]);

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
                Real-time sensor telemetry stream, automated service-interval notifications, and dynamic health score progression.
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

      {/* PRIMARY FEATURE: Health Score Progression Line Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-100">
                Health Score Progression & Degradation Trajectory
              </h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${healthTier.badgeBg} ${healthTier.color}`}>
                {healthTier.label}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Longitudinal AI telemetry tracking against unmanaged industry baseline, marked with verified maintenance interventions.
            </p>
          </div>

          {/* Timeframe selector & view toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setTimeframe('lifetime')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timeframe === 'lifetime' 
                    ? 'bg-teal-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Full Lifecycle + Forecast
              </button>
              <button
                onClick={() => setTimeframe('12m')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timeframe === '12m' 
                    ? 'bg-teal-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Past 12 Months
              </button>
              <button
                onClick={() => setTimeframe('90d')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timeframe === '90d' 
                    ? 'bg-teal-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                90-Day Telemetry
              </button>
            </div>

            <button
              onClick={() => setShowUnmanagedBaseline(prev => !prev)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                showUnmanagedBaseline 
                  ? 'bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="Toggle unmanaged baseline comparison"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Unmanaged Baseline</span>
            </button>

            <button
              onClick={() => setShowComponentBreakdown(prev => !prev)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                showComponentBreakdown 
                  ? 'bg-teal-950/60 border-teal-700 text-teal-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="Toggle component-level lines"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>BMS & Thermal</span>
            </button>
          </div>
        </div>

        {/* Highlight KPI summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Current Health Score</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-2xl font-extrabold font-mono ${healthTier.color}`}>
                {currentHealthScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400">Live edge reading</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Care Extension Delta</span>
            <div className="flex items-baseline gap-1.5 mt-0.5 text-emerald-400">
              <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
              <span className="text-xl font-extrabold font-mono">+2.8 Yrs</span>
            </div>
            <span className="text-[10px] text-emerald-400/80">vs unmanaged failure</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Annual Degradation Rate</span>
            <div className="flex items-baseline gap-1.5 mt-0.5 text-slate-200">
              <span className="text-xl font-extrabold font-mono">-{averageAnnualDegradation}%</span>
              <span className="text-[10px] text-slate-500">/ yr</span>
            </div>
            <span className="text-[10px] text-amber-400">Industry avg: -12.4%/yr</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Preventative Simulation</span>
              <span className="text-xs font-semibold text-teal-300">
                {simulatedServiceCycles > 0 ? `+${simulatedServiceCycles} Overhaul Cycle(s)` : 'Nominal Schedule'}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={handleSimulateService}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 cursor-pointer"
              >
                + Test Tune
              </button>
              {simulatedServiceCycles > 0 && (
                <button
                  onClick={handleResetSimulation}
                  className="text-[10px] text-slate-400 hover:text-white px-1 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* The Recharts LineChart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthTimelineData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                dy={6}
              />
              
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                domain={[0, 100]} 
                ticks={[0, 20, 40, 60, 80, 100]}
              />

              {/* Critical Care Reference Lines */}
              <ReferenceLine 
                y={80} 
                stroke="#10b981" 
                strokeDasharray="4 4" 
                strokeOpacity={0.6}
                label={{ value: 'Optimal (80+)', fill: '#10b981', fontSize: 10, position: 'right' }} 
              />
              <ReferenceLine 
                y={60} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                strokeOpacity={0.6}
                label={{ value: 'Service Due (60)', fill: '#f59e0b', fontSize: 10, position: 'right' }} 
              />
              <ReferenceLine 
                y={40} 
                stroke="#f43f5e" 
                strokeDasharray="4 4" 
                strokeOpacity={0.6}
                label={{ value: 'Refurbish Threshold (40)', fill: '#f43f5e', fontSize: 10, position: 'right' }} 
              />

              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as HealthTimelinePoint;
                    return (
                      <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl text-xs space-y-2 min-w-[220px]">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-slate-100 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            {data.date}
                          </span>
                          {data.isForecast && (
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                              Forecast
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">eLC Asset Health:</span>
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              {data.healthScore} / 100
                            </span>
                          </div>

                          {showUnmanagedBaseline && (
                            <div className="flex justify-between items-center text-slate-400">
                              <span>Unmanaged Industry Baseline:</span>
                              <span className="font-mono font-semibold text-slate-400">
                                {data.unmanagedBaseline} / 100
                              </span>
                            </div>
                          )}

                          {showComponentBreakdown && (
                            <>
                              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                                <span>BMS Health:</span>
                                <span className="font-mono text-cyan-300">{data.bmsHealth}%</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-slate-400">
                                <span>Thermal Headroom:</span>
                                <span className="font-mono text-rose-300">{data.thermalHealth}%</span>
                              </div>
                            </>
                          )}
                        </div>

                        {data.event && (
                          <div className="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300 flex items-start gap-1">
                            <Wrench className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span><strong>Milestone:</strong> {data.event}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend 
                verticalAlign="bottom" 
                height={32}
                formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
              />

              {/* Primary Active Device Health Score Progression Line */}
              <Line 
                name={`${activeDevice.name} Health Score`}
                type="monotone" 
                dataKey="healthScore" 
                stroke="#14b8a6" 
                strokeWidth={3} 
                dot={({ cx, cy, payload }) => {
                  const isCurrent = payload.eventType === 'current';
                  const hasEvent = !!payload.event;
                  if (isCurrent) {
                    return (
                      <circle 
                        key={`dot-cur-${payload.timestamp}`}
                        cx={cx} 
                        cy={cy} 
                        r={6} 
                        fill="#10b981" 
                        stroke="#ffffff" 
                        strokeWidth={2} 
                        className="animate-pulse"
                      />
                    );
                  }
                  if (hasEvent) {
                    return (
                      <circle 
                        key={`dot-evt-${payload.timestamp}`}
                        cx={cx} 
                        cy={cy} 
                        r={4.5} 
                        fill="#f59e0b" 
                        stroke="#0f172a" 
                        strokeWidth={1.5} 
                      />
                    );
                  }
                  return (
                    <circle 
                      key={`dot-reg-${payload.timestamp}`}
                      cx={cx} 
                      cy={cy} 
                      r={3} 
                      fill="#14b8a6" 
                    />
                  );
                }}
                activeDot={{ r: 7, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              />

              {/* Unmanaged Baseline Line (Dashed) */}
              {showUnmanagedBaseline && (
                <Line 
                  name="Unmanaged Industry Baseline"
                  type="monotone" 
                  dataKey="unmanagedBaseline" 
                  stroke="#64748b" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              )}

              {/* Optional Component-Level Lines */}
              {showComponentBreakdown && (
                <>
                  <Line 
                    name="Battery / BMS Health"
                    type="monotone" 
                    dataKey="bmsHealth" 
                    stroke="#06b6d4" 
                    strokeWidth={1.5} 
                    strokeDasharray="2 2"
                    dot={false}
                  />
                  <Line 
                    name="Thermal Headroom"
                    type="monotone" 
                    dataKey="thermalHealth" 
                    stroke="#f43f5e" 
                    strokeWidth={1.5} 
                    strokeDasharray="2 2"
                    dot={false}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Info Bar at bottom of Health Chart */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>Active Care Curve</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Maintenance Milestones</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Reading ({currentHealthScore}/100)</span>
            </span>
          </div>

          <button
            onClick={() => onNavigateSpoke('repair')}
            className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Book Preventative Checkup (Spoke 03)</span>
            <span>&rarr;</span>
          </button>
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

      {/* 24-Hour Telemetry Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              24-Hour High-Frequency Sensor Stream
            </h3>
            <p className="text-xs text-slate-400">
              High-frequency sensor updates relayed via eLC Edge Gateway telemetry bus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-semibold">Streaming Live</span>
          </div>
        </div>

        <div className="h-56 w-full">
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
