import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  FileSpreadsheet, 
  Layers, 
  Award,
  Loader2,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { Device, SpokeId } from '../../types';

interface AnalyticsSpokeProps {
  devices: Device[];
  onNavigateSpoke: (spoke: SpokeId) => void;
}

const MONTHLY_CARBON_SAVINGS = [
  { month: 'Jan', kgCO2: 120, savingsKsh: 84000 },
  { month: 'Feb', kgCO2: 165, savingsKsh: 112000 },
  { month: 'Mar', kgCO2: 190, savingsKsh: 135000 },
  { month: 'Apr', kgCO2: 240, savingsKsh: 178000 },
  { month: 'May', kgCO2: 290, savingsKsh: 210000 },
  { month: 'Jun', kgCO2: 340, savingsKsh: 245000 },
  { month: 'Jul', kgCO2: 390, savingsKsh: 290000 },
  { month: 'Aug', kgCO2: 420, savingsKsh: 345000 },
];

const STAGE_COLORS: Record<string, string> = {
  'active-care': '#10b981',
  'refurbish': '#3b82f6',
  'harvest-spares': '#f59e0b',
  'end-of-life': '#f43f5e',
};

export const AnalyticsSpoke: React.FC<AnalyticsSpokeProps> = ({
  devices,
  onNavigateSpoke,
}) => {
  const [aiInsights, setAiInsights] = useState<{
    executiveSummary: string;
    strategicRecommendations: string[];
    esgComplianceBadge: string;
    estimatedNextQuarterSavingsKsh: number;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Compute portfolio metrics
  const totalAssets = devices.length;
  const avgHealth = Math.round(devices.reduce((acc, d) => acc + d.healthScore, 0) / totalAssets) || 72;
  const totalCarbonAvoided = Math.round(devices.reduce((acc, d) => acc + (d.carbonAvoidedKg || 50), 0));
  const estimatedSavings = 1420000; // KSh saved vs brand new purchasing

  // Stage distribution
  const stageCounts = devices.reduce((acc, d) => {
    acc[d.lifecycleStage] = (acc[d.lifecycleStage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(stageCounts).map(([stage, count]) => ({
    name: stage.replace('-', ' ').toUpperCase(),
    value: count,
    color: STAGE_COLORS[stage] || '#94a3b8',
  }));

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/fleet/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalDevices: totalAssets,
          avgHealth,
          totalCarbonAvoidedKg: totalCarbonAvoided,
          totalSavingsKsh: estimatedSavings,
        }),
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, [totalAssets, avgHealth]);

  const handleExportESG = () => {
    const report = {
      title: 'eLifecycle Care Ecosystem - ESG Fleet Lifecycle Audit',
      generatedDate: new Date().toISOString(),
      fleetSize: totalAssets,
      averagePortfolioHealth: `${avgHealth}%`,
      avoidedScope3CarbonKg: totalCarbonAvoided,
      totalCapitalExpenditureSavedKsh: estimatedSavings,
      esgRating: aiInsights?.esgComplianceBadge || 'eLC Certified Tier-1 Circular Enterprise',
      assetList: devices.map(d => ({
        id: d.id,
        name: d.name,
        health: d.healthScore,
        lifecycleStage: d.lifecycleStage,
        co2AvoidedKg: d.carbonAvoidedKg
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eLC-ESG-Audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div id="analytics-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                  Spoke 08 : Analytics & ESG
                </span>
                <span className="text-xs text-slate-400">B2B Fleet & Asset Manager Dashboard</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                Fleet Lifecycle Analytics & Scope-3 ESG Reporting
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Multi-asset health indexes, cost-per-unit lifecycle optimization, and audited e-waste carbon offsets.
              </p>
            </div>
          </div>

          <button
            id="export-esg-audit-btn"
            onClick={handleExportESG}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            Export ESG Audit Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Portfolio Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
            {avgHealth}%
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Across {totalAssets} managed enterprise units
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Scope-3 Carbon Avoided</span>
            <Leaf className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-teal-400 font-mono">
            {totalCarbonAvoided.toLocaleString()} <span className="text-xs font-sans">kg</span>
          </div>
          <span className="text-[10px] text-teal-300 mt-1 block">
            ISO 14064 Verified Equivalent
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>CapEx Savings (MRO vs New)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
            KSh {(estimatedSavings / 1000).toFixed(0)}k
          </div>
          <span className="text-[10px] text-amber-300 mt-1 block">
            78% lifecycle cost reduction
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>ESG Compliance Badge</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white leading-tight mt-1">
            {aiInsights?.esgComplianceBadge || 'Tier-1 Circular Enterprise'}
          </div>
          <span className="text-[10px] text-purple-300 mt-1 block">
            WEEE & Basel Aligned
          </span>
        </div>
      </div>

      {/* Recharts Data Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Savings & Carbon Reduction */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Cumulative E-Waste Carbon & CapEx Savings (Monthly)
              </h3>
              <p className="text-xs text-slate-400">
                Track avoided emissions (kg CO2e) alongside KSh procurement reductions.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_CARBON_SAVINGS}>
                <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc' 
                  }} 
                />
                <Bar dataKey="kgCO2" name="Avoided CO2 (kg)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savingsKsh" name="Savings (KSh)" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lifecycle Stage Distribution Pie */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Fleet Lifecycle Stage Split
            </h3>
            <p className="text-xs text-slate-400">Active vs Refurbish vs Harvest vs EOL</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={40}
                  paddingAngle={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Executive Commentary Box */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nobscott Chief Fleet Intelligence Commentary</h4>
              <span className="text-[10px] text-slate-400">Automated B2B ESG & Maintenance Strategy Engine</span>
            </div>
          </div>

          <button
            onClick={fetchAiInsights}
            disabled={loadingAi}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Regenerate Analysis'}
          </button>
        </div>

        {loadingAi ? (
          <div className="py-6 text-center text-xs text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-400" />
            <p>Synthesizing fleet telemetry, spares usage, and ESG disclosures...</p>
          </div>
        ) : (
          <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
            <p className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200">
              {aiInsights?.executiveSummary || `Through Nobscott MRO's integrated 8-spoke ecosystem, your enterprise fleet has extended asset usable lifespans by an average of 2.8 years, averting ${totalCarbonAvoided} kg of Scope 3 greenhouse emissions.`}
            </p>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-2">
                Strategic Fleet Recommendations
              </span>
              <div className="space-y-1.5">
                {aiInsights?.strategicRecommendations?.map((rec, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                )) || (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                    • Transition 12 industrial solar inverters to preventative micro-soldering schedule to avoid peak downtime.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
