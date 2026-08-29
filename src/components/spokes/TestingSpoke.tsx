import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  DollarSign, 
  ShieldAlert, 
  Loader2, 
  CalendarClock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Device, TriageResult, SpokeId } from '../../types';

interface TestingSpokeProps {
  activeDevice: Device;
  onNavigateSpoke: (spoke: SpokeId, contextData?: any) => void;
}

const COMMON_SYMPTOM_TAGS = [
  'Thermal Overheating (>75°C)',
  'Sudden Shutdown Under Heavy Load',
  'Rapid Battery Drain (<2 Hours)',
  'Display Artifacts / Subpixel Lines',
  'IGBT Inverter Error Code 0x14',
  'Touch Digitizer Ghost Clicks',
  'Charging Port Intermittent Disconnect',
  'Fan Bearing Noise / Stalling',
  'Wi-Fi 6 Packet Loss & Drop',
];

export const TestingSpoke: React.FC<TestingSpokeProps> = ({
  activeDevice,
  onNavigateSpoke,
}) => {
  const [symptoms, setSymptoms] = useState(
    activeDevice.currentIssues ? activeDevice.currentIssues.join(', ') : 'Intermittent thermal throttle and battery capacity drop'
  );
  const [logs, setLogs] = useState(
    `[SYS_LOG] Core Temp: 84°C | Rail Voltage: 11.2V | Fan Duty: 100% | BMS Health: ${activeDevice.batteryHealth || 80}%`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  const handleToggleTag = (tag: string) => {
    if (symptoms.includes(tag)) {
      setSymptoms(symptoms.replace(tag, '').replace(/,\s*,/g, ',').trim());
    } else {
      setSymptoms(prev => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  const handleRunTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/diagnostics/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName: activeDevice.name,
          category: activeDevice.category,
          symptoms,
          logs,
          ageYears: new Date().getFullYear() - activeDevice.manufactureYear,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="testing-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                  Spoke 01 : Testing
                </span>
                <span className="text-xs text-slate-400">Powered by Nobscott AI</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                AI-Guided Self-Triage Wizard
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Describe symptoms to calculate exact fault probability, urgency index, and repair-vs-replace economics.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">Target Asset for Triage:</span>
            <span className="text-sm font-bold text-slate-200">{activeDevice.name}</span>
            <span className="text-xs font-mono text-amber-400 block">{activeDevice.serialNumber}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Symptom Description & Telemetry
            </h3>

            <form onSubmit={handleRunTriage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Quick Select Common Symptoms
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {COMMON_SYMPTOM_TAGS.map((tag) => {
                    const isSelected = symptoms.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                            : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Detailed Symptom Notes
                </label>
                <textarea
                  id="triage-symptoms-textarea"
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe failure conditions, ambient temperature, audible noises, or warning LEDs..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  System Diagnostics / Sensor Logs (Optional)
                </label>
                <textarea
                  id="triage-logs-textarea"
                  rows={2}
                  value={logs}
                  onChange={(e) => setLogs(e.target.value)}
                  placeholder="Paste error logs, voltage readings, or error codes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <button
                id="run-triage-ai-btn"
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Nobscott Triage Intelligence...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Triage Assessment
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              Unified Data Layer Integration
            </div>
            <p>
              Triage results automatically feed into Spoke 3 (Repair Booking), Spoke 4 (Spares Matching), and Spoke 7 (ELCI Auto-Claim).
            </p>
          </div>
        </div>

        {/* Results View */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <Wrench className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-200">No Assessment Generated Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Select or describe symptoms on the left and click "Generate Triage Assessment" to get real-time fault probabilities and repair economics.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[380px] space-y-3">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <h4 className="font-bold text-slate-200">Analyzing Micro-Circuitry & Failure Models...</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Querying Nobscott MRO historical repair database and component degradation matrices.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
              {/* Top Summary Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Primary Detected Fault
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {result.faultName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-center px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800">
                    <span className="text-[10px] text-indigo-300 block uppercase font-mono">Probability</span>
                    <span className="text-base font-black text-indigo-400">{result.faultProbability}%</span>
                  </div>

                  <div className={`text-center px-3 py-1.5 rounded-xl border ${
                    result.urgencyScore >= 7 
                      ? 'bg-rose-950/80 border-rose-800 text-rose-400' 
                      : result.urgencyScore >= 4 
                      ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                      : 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                  }`}>
                    <span className="text-[10px] block uppercase font-mono">Urgency Index</span>
                    <span className="text-base font-black">{result.urgencyScore} / 10</span>
                  </div>
                </div>
              </div>

              {/* Economic Comparison: Repair vs Replace */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Lifecycle Economic Analysis
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                    {result.replacementCostSavingsPercent}% Savings vs New
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Nobscott Component Repair</span>
                    <span className="text-lg font-bold text-emerald-400">
                      KSh {result.estimatedRepairCostKsh.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-300 block mt-0.5">Recommended Action</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">New Unit Replacement</span>
                    <span className="text-lg font-bold text-slate-400 line-through">
                      KSh {result.estimatedReplacementCostKsh.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-rose-400 block mt-0.5">Avoidable CapEx Waste</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {result.rationale}
                </p>
              </div>

              {/* Affected Components */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Target Components for Micro-Soldering & Overhaul
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.affectedComponents.map((comp, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Spares in Pool */}
              {result.suggestedSpares && result.suggestedSpares.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Matched Spares in Nobscott Pool (Spoke 4)
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">Instant Dispatch</span>
                  </div>
                  {result.suggestedSpares.map((sp) => (
                    <div key={sp.id} className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-200 font-medium">{sp.name} ({sp.partNumber})</span>
                      <span className="text-emerald-400 font-bold">KSh {sp.priceKsh.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="triage-book-repair-btn"
                  onClick={() => onNavigateSpoke('repair', { triageData: result })}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <CalendarClock className="w-4 h-4" />
                  Book Repair at Nearest EMROC Facility
                </button>

                <button
                  id="triage-order-spares-btn"
                  onClick={() => onNavigateSpoke('spares', { filterCategory: result.affectedComponents[0] })}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Order Certified Spares
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
