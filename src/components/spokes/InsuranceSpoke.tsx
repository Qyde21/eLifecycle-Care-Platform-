import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Smartphone, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { Device, InsurancePolicy, SpokeId } from '../../types';

interface InsuranceSpokeProps {
  activeDevice: Device;
  policies: InsurancePolicy[];
  onActivatePolicy: (policy: InsurancePolicy) => void;
  onOpenMPesa: (amount: number, purpose: string, ref: string) => void;
  onNavigateSpoke: (spoke: SpokeId) => void;
  onClaimSubmitted?: (device: Device) => void;
  onSimulatePolicyTelemetry?: (policy: InsurancePolicy) => void;
}

export const InsuranceSpoke: React.FC<InsuranceSpokeProps> = ({
  activeDevice,
  policies,
  onActivatePolicy,
  onOpenMPesa,
  onNavigateSpoke,
  onClaimSubmitted,
  onSimulatePolicyTelemetry,
}) => {
  const [selectedTier, setSelectedTier] = useState<'Standard Care' | 'Comprehensive Protection' | 'Mission-Critical Swap'>('Comprehensive Protection');
  const [claimFiled, setClaimFiled] = useState(false);

  // Dynamic calculation based on device health score and age
  const deviceAgeYears = Math.max(1, new Date().getFullYear() - activeDevice.manufactureYear);
  const healthFactor = Math.max(0.6, (100 - activeDevice.healthScore) / 100);
  
  const baseMonthly = activeDevice.category === 'solar-inverter' ? 3500 : activeDevice.category === 'laptop' ? 1400 : 900;
  const calculatedStandard = Math.round(baseMonthly * (1 + deviceAgeYears * 0.1) * (0.8 + healthFactor * 0.4));
  const calculatedComprehensive = Math.round(calculatedStandard * 1.55);
  const calculatedMissionCritical = Math.round(calculatedStandard * 2.4);

  const activePolicy = policies.find(p => p.deviceId === activeDevice.id);

  const handleActivatePlan = (tier: 'Standard Care' | 'Comprehensive Protection' | 'Mission-Critical Swap', premium: number) => {
    onOpenMPesa(
      premium,
      `ELCI Policy Activation: ${tier} for ${activeDevice.name}`,
      `ELCI-POL-${Date.now().toString(36).toUpperCase()}`
    );
  };

  const handleFileClaim = () => {
    setClaimFiled(true);
    onClaimSubmitted?.(activeDevice);
    setTimeout(() => {
      onNavigateSpoke('repair');
    }, 1800);
  };


  return (
    <div id="insurance-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/60">
                  Spoke 07 : Insurance (ELCI)
                </span>
                <span className="text-xs text-slate-400">Electronics Lifecycle Care Insurance</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                Dynamic Health-Score Based Electronics Insurance
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Premiums automatically calibrated from real-time device age, operating telemetry, and screening grade.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">Policy Status:</span>
            {activePolicy ? (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active ({activePolicy.policyId})
              </span>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Uninsured / Ready to Activate
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Premium Calculation Matrix */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200 block">Dynamic Actuarial Multiplier</span>
            <span className="text-slate-400">
              Age: {deviceAgeYears} Years | Health Score: {activeDevice.healthScore}% | Lifecycle: {activeDevice.lifecycleStage}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-slate-300 font-mono text-[11px]">
            Health Discount Applied: <strong className="text-emerald-400 font-bold">14% Discount</strong>
          </div>
          {activePolicy && (
            <button
              id="simulate-policy-update-btn"
              onClick={() => onSimulatePolicyTelemetry?.(activePolicy)}
              className="py-1 px-2.5 rounded-lg bg-violet-950/80 hover:bg-violet-900/80 border border-violet-500/40 text-violet-300 text-[10px] font-bold font-mono transition-colors cursor-pointer flex items-center gap-1"
              title="Simulate continuous IoT telemetry recalibration and send push notification"
            >
              <Sparkles className="w-3 h-3 text-violet-400" />
              Simulate Telemetry Update Alert
            </button>
          )}
        </div>
      </div>


      {/* 3 Insurance Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tier 1: Standard */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Entry Tier</div>
            <h3 className="text-lg font-bold text-slate-100 mt-0.5">Standard Care</h3>
            <p className="text-xs text-slate-400 mt-1">Essential coverage against internal component drift and power surges.</p>

            <div className="my-4 py-3 border-y border-slate-800">
              <span className="text-2xl font-black text-white font-mono">
                KSh {calculatedStandard.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                100% Micro-soldering labor covered
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Power surge & lightning protection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Deductible: KSh 2,500 per claim
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleActivatePlan('Standard Care', calculatedStandard)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Activate via M-Pesa
          </button>
        </div>

        {/* Tier 2: Comprehensive Protection (Popular) */}
        <div className="bg-slate-900/90 border-2 border-violet-500 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative shadow-lg shadow-violet-500/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
            Recommended Tier
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-violet-400">Full Shield</div>
            <h3 className="text-lg font-bold text-white mt-0.5">Comprehensive Protection</h3>
            <p className="text-xs text-slate-400 mt-1">Full protection including accidental drops, cracked displays & liquid exposure.</p>

            <div className="my-4 py-3 border-y border-slate-800">
              <span className="text-2xl font-black text-violet-400 font-mono">
                KSh {calculatedComprehensive.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Accidental drop, screen & liquid damage
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Free battery renewal when health &lt; 80%
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Reduced Deductible: KSh 1,200
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Worldwide travel repair voucher
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleActivatePlan('Comprehensive Protection', calculatedComprehensive)}
            className="w-full py-2.5 px-4 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-violet-500/20 cursor-pointer"
          >
            Activate via M-Pesa
          </button>
        </div>

        {/* Tier 3: Mission-Critical Swap */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Enterprise SLA</div>
            <h3 className="text-lg font-bold text-slate-100 mt-0.5">Mission-Critical Swap</h3>
            <p className="text-xs text-slate-400 mt-1">Zero downtime SLA for solar microgrids, hospitals & logistics fleets.</p>

            <div className="my-4 py-3 border-y border-slate-800">
              <span className="text-2xl font-black text-amber-400 font-mono">
                KSh {calculatedMissionCritical.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Zero-Deductible (KSh 0) on all repairs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                4-Hour Standby Swap Unit Deployment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Free quarterly IoT preventative audit
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleActivatePlan('Mission-Critical Swap', calculatedMissionCritical)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Activate via M-Pesa
          </button>
        </div>
      </div>

      {/* Instant Claim Submission Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              Instant ELCI Auto-Claim Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Claims are automatically verified and pre-approved using diagnosis reports from Spoke 1 (Testing) and Spoke 2 (Screening).
            </p>
          </div>

          <button
            onClick={handleFileClaim}
            disabled={claimFiled}
            className="py-2.5 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            {claimFiled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Claim Pre-Approved! Routing to EMROC...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Submit 1-Tap Claim for {activeDevice.name}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
