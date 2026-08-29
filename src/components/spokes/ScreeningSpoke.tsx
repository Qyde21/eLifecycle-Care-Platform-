import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Camera, 
  Upload, 
  Sparkles, 
  Award, 
  FileCheck, 
  Cpu, 
  DollarSign, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { Device, ScreeningGradeResult, SpokeId, LifecycleStage } from '../../types';

interface ScreeningSpokeProps {
  activeDevice: Device;
  onNavigateSpoke: (spoke: SpokeId, contextData?: any) => void;
  onUpdateDeviceStage: (deviceId: string, newStage: LifecycleStage, newScore: number) => void;
}

export const ScreeningSpoke: React.FC<ScreeningSpokeProps> = ({
  activeDevice,
  onNavigateSpoke,
  onUpdateDeviceStage,
}) => {
  const [operationalHours, setOperationalHours] = useState(activeDevice.operatingHours || 4500);
  const [dropHistory, setDropHistory] = useState('Minor drops, no structural frame cracks');
  const [cosmeticDetails, setCosmeticDetails] = useState('Minor surface scuffs on corners, original oleophobic coating intact');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningGradeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunScreening = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/screening/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName: activeDevice.name,
          category: activeDevice.category,
          operationalHours,
          dropHistory,
          cosmeticDetails,
          imageBase64: imagePreview,
        }),
      });

      const data: ScreeningGradeResult = await res.json();
      setResult(data);
      onUpdateDeviceStage(activeDevice.id, data.assignedStage, data.overallScore);
    } catch (err) {
      console.error('Screening grading failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStageBadge = (stage: LifecycleStage) => {
    switch (stage) {
      case 'active-care':
        return {
          label: 'Active Care',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: 'High operational integrity. Continue scheduled preventive maintenance.',
        };
      case 'refurbish':
        return {
          label: 'Refurbish',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          desc: 'Component wear detected. Restore to pristine grade at EMROC hub.',
        };
      case 'harvest-spares':
        return {
          label: 'Harvest-Spares',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          desc: 'High-value sub-assemblies (screens, inductors, chips) harvestable for Spares Pool.',
        };
      case 'end-of-life':
        return {
          label: 'End-of-Life (WEEE)',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          desc: 'Chemical recovery & metals extraction. Mint Circularity Credits in Spoke 6.',
        };
    }
  };

  return (
    <div id="screening-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                  Spoke 02 : Screening
                </span>
                <span className="text-xs text-slate-400">Photo-AI & Lifecycle Classifier</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                Device Grading & Optical Inspection
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Evaluates physical wear, thermal history, and assigns the asset to 1 of 4 official lifecycle stages.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">Current Registered Stage:</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              {activeDevice.lifecycleStage.replace('-', ' ')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Health Score: {activeDevice.healthScore}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form and Image Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" />
              Optical Upload & Historical Parameters
            </h3>

            <form onSubmit={handleRunScreening} className="space-y-4">
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Device Photo / Optical Scan (Front/Back/Circuit)
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/50 flex flex-col items-center justify-center min-h-[140px]"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Device inspection" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                        Click to change photo
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-slate-300 font-medium">
                        Drag & Drop or <span className="text-blue-400 underline">Upload Image</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Supports JPG, PNG (or use camera snapshot)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Total Operational Hours
                </label>
                <input
                  type="number"
                  value={operationalHours}
                  onChange={(e) => setOperationalHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs md:text-sm text-slate-100 font-mono focus:border-blue-500 outline-none"
                  placeholder="e.g. 5200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Physical Impact / Drop History
                </label>
                <input
                  type="text"
                  value={dropHistory}
                  onChange={(e) => setDropHistory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:border-blue-500 outline-none"
                  placeholder="e.g. 2 drops from 1m onto concrete, no liquid exposure"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Cosmetic & Chassis Notes
                </label>
                <input
                  type="text"
                  value={cosmeticDetails}
                  onChange={(e) => setCosmeticDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:border-blue-500 outline-none"
                  placeholder="e.g. minor scratches, no dead pixels"
                />
              </div>

              <button
                id="run-screening-grade-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Grading & Classifying Lifecycle Stage...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Perform Optical & History Grading
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results & Digital Certificate */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <Scan className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-200">No Screening Grading Performed</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Upload a photo or input operational hours on the left to generate Nobscott's 4-stage lifecycle classification.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px] space-y-3">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              <h4 className="font-bold text-slate-200">Executing Computer Vision & Component Health Analysis...</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Verifying optical degradation, calculating residual component value, and issuing Nobscott MRO digital seal.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
              {/* Digital Certificate Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-blue-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 font-mono font-black text-2xl">
                    {result.grade}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        Nobscott Certified Seal
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{result.certificateId}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {activeDevice.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Assigned Stage</span>
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStageBadge(result.assignedStage).color}`}>
                    {getStageBadge(result.assignedStage).label}
                  </span>
                </div>
              </div>

              {/* Score Breakdown Bars */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Overall Index</span>
                  <span className="text-xl font-black text-white">{result.overallScore}%</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Cosmetic Integrity</span>
                  <span className="text-xl font-black text-blue-400">{result.cosmeticScore}%</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Functional Health</span>
                  <span className="text-xl font-black text-emerald-400">{result.functionalScore}%</span>
                </div>
              </div>

              {/* Economic Residual Valuation */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Estimated Residual Market Value
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    KSh {result.estimatedResidualValueKsh.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {result.inspectorNotes}
                </p>
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300 font-medium">
                  <strong>Recommended Next Step:</strong> {result.recommendedAction}
                </div>
              </div>

              {/* Harvestable Components Valuation */}
              {result.harvestableComponents && result.harvestableComponents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    Harvestable Spares Viability (Spoke 4 Feed)
                  </h4>
                  <div className="space-y-1.5">
                    {result.harvestableComponents.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-medium text-slate-200">{item.component}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-mono">{item.viabilityScore}% Viable</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            KSh {item.estimatedValueKsh.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action based on assigned stage */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {result.assignedStage === 'active-care' && (
                  <button
                    onClick={() => onNavigateSpoke('performance')}
                    className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-500/20"
                  >
                    View IoT Continuous Health Stream (Spoke 5)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {result.assignedStage === 'refurbish' && (
                  <button
                    onClick={() => onNavigateSpoke('repair')}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    Book Overhaul at Certified EMROC (Spoke 3)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {result.assignedStage === 'harvest-spares' && (
                  <button
                    onClick={() => onNavigateSpoke('spares')}
                    className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    List Harvested Sub-Assemblies on Spares Pool (Spoke 4)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {result.assignedStage === 'end-of-life' && (
                  <button
                    onClick={() => onNavigateSpoke('circularity')}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Schedule E-Waste Recovery & Mint Credits (Spoke 6)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
