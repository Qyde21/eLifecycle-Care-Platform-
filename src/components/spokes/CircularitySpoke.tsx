import React, { useState } from 'react';
import { 
  Recycle, 
  Leaf, 
  Coins, 
  Truck, 
  FileCheck, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Download,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Device, CircularityRecord, SpokeId } from '../../types';

interface CircularitySpokeProps {
  activeDevice: Device;
  circularityRecords: CircularityRecord[];
  circularityCreditsBalance: number;
  onAddCredits: (amount: number) => void;
  onRedeemCredits: (amount: number, purpose: string) => void;
  onNavigateSpoke: (spoke: SpokeId) => void;
}

export const CircularitySpoke: React.FC<CircularitySpokeProps> = ({
  activeDevice,
  circularityRecords,
  circularityCreditsBalance,
  onAddCredits,
  onRedeemCredits,
  onNavigateSpoke,
}) => {
  const [pickupAddress, setPickupAddress] = useState('eLC Telecom Logistics Depot, Enterprise Rd, Nairobi');
  const [scheduled, setScheduled] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const activeRecord = circularityRecords[0];

  const handleBookCollection = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#f59e0b']
    });
    onAddCredits(1250);
  };

  const handleRedeem = (creditsToUse: number, benefit: string) => {
    if (circularityCreditsBalance < creditsToUse) return;
    onRedeemCredits(creditsToUse, benefit);
    setRedeemSuccess(`Successfully redeemed ${creditsToUse} eLC Credits for ${benefit}!`);
    setTimeout(() => setRedeemSuccess(null), 4000);
  };

  return (
    <div id="circularity-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Spoke 06 : Circularity & Recovery
                </span>
                <span className="text-xs text-slate-400">WEEE Certified Material Recovery</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                End-of-Life Disposition & Circularity Credits
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Transparent auditing of recovered precious metals, certified e-waste neutralization, and redeemable credit engine.
              </p>
            </div>
          </div>

          {/* Credits Balance Box */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 text-right shrink-0">
            <div className="flex items-center gap-1.5 justify-end text-[11px] uppercase font-mono text-emerald-300">
              <Coins className="w-3.5 h-3.5" />
              eLC Circularity Credits
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {circularityCreditsBalance.toLocaleString()} <span className="text-xs font-sans text-slate-300">Credits</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              ≈ KSh {circularityCreditsBalance.toLocaleString()} in service buying power
            </span>
          </div>
        </div>
      </div>

      {redeemSuccess && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs md:text-sm text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{redeemSuccess}</span>
          </div>
          <button 
            onClick={() => setRedeemSuccess(null)}
            className="text-xs text-emerald-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Recovery Audit vs Collection Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Materials Recovery Breakdown (Transparent Tracking) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Certified Recovered Asset Audit
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeRecord ? activeRecord.deviceName : activeDevice.name}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Certificate ID: {activeRecord ? activeRecord.weeeCertificateId : 'WEEE-KE-NEMA-2026-991'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Status</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-lg">
                  ✓ 100% Diverted from Landfill
                </span>
              </div>
            </div>

            {/* Recovered Precious Metals List */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Audited Elements & Critical Raw Materials Extracted
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeRecord?.recoveredMaterials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-slate-100">{mat.material}</div>
                        <span className="text-[10px] text-slate-400 font-mono">Purity: {mat.purityPercent}%</span>
                      </div>
                      <span className="text-xs font-black text-amber-400 font-mono bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                        {mat.recoveredGrams}g
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">CO2 Offset: {mat.estimatedOffsetKgCO2} kg</span>
                      <span className="text-emerald-400 font-bold font-mono">+{mat.creditsEarned} Credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official WEEE Certificate Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-100">Official WEEE E-Waste Compliance Certificate</div>
                  <div className="text-[11px] text-slate-400">Validated under Kenya NEMA & Basel Convention Protocols</div>
                </div>
              </div>

              <button
                onClick={() => alert(`Certificate ${activeRecord?.weeeCertificateId} downloaded and verified.`)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Credits Redemption Store */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              Redeem Circularity Credits on Platform Ecosystem
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">KSh 1,000 Repair Voucher</span>
                  <p className="text-[11px] text-slate-400 mt-1">Applies instantly at any EMROC facility (Spoke 3).</p>
                </div>
                <button
                  onClick={() => handleRedeem(1000, 'KSh 1,000 EMROC Repair Voucher')}
                  disabled={circularityCreditsBalance < 1000}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  Use 1,000 Credits
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">15% Off Certified Spares</span>
                  <p className="text-[11px] text-slate-400 mt-1">Discount token for Spares Marketplace (Spoke 4).</p>
                </div>
                <button
                  onClick={() => handleRedeem(800, '15% Spares Marketplace Discount Token')}
                  disabled={circularityCreditsBalance < 800}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  Use 800 Credits
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">1-Month ELCI Insurance</span>
                  <p className="text-[11px] text-slate-400 mt-1">Free 1-month comprehensive cover (Spoke 7).</p>
                </div>
                <button
                  onClick={() => handleRedeem(1500, '1-Month Free ELCI Insurance Cover')}
                  disabled={circularityCreditsBalance < 1500}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  Use 1,500 Credits
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Book End-of-Life Collection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              Book End-of-Life Collection Pickup
            </h3>

            {scheduled ? (
              <div className="p-6 bg-slate-950 border border-emerald-500/40 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-100">Collection Scheduled!</h4>
                <p className="text-xs text-slate-400">
                  Green logistics dispatch scheduled for tomorrow morning. <strong className="text-emerald-400">+1,250 Circularity Credits</strong> credited to your account.
                </p>
                <button
                  onClick={() => setScheduled(false)}
                  className="text-xs text-emerald-400 underline font-semibold mt-2 cursor-pointer"
                >
                  Schedule Another Collection
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookCollection} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    Asset for E-Waste Disposition
                  </label>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-100 block">{activeDevice.name}</span>
                      <span className="text-slate-400 font-mono">{activeDevice.serialNumber}</span>
                    </div>
                    <span className="text-rose-400 font-mono font-bold uppercase text-[11px]">
                      {activeDevice.lifecycleStage.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    Pickup Location / Facility Address
                  </label>
                  <textarea
                    rows={2}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:border-emerald-500 outline-none resize-none"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Estimated Materials Credits:</span>
                    <span className="text-emerald-400 font-bold font-mono">+1,250 eLC</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Scope-3 Carbon Avoided:</span>
                    <span className="text-slate-200">14.2 kg CO2e</span>
                  </div>
                </div>

                <button
                  id="book-circularity-pickup-btn"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  Confirm Free Green Pickup
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
