import React, { useState } from 'react';
import { 
  CalendarClock, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  Building2, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  Activity,
  FileText,
  Play,
  RotateCcw,
  Bell
} from 'lucide-react';
import { Device, RepairBooking, SpokeId } from '../../types';
import { EMROC_FACILITIES } from '../../data/mockData';

interface RepairBookingSpokeProps {
  activeDevice: Device;
  activeRepairs: RepairBooking[];
  onAddNewRepair: (repair: RepairBooking) => void;
  onAdvanceRepairStep?: (repairId: string) => void;
  onResetRepairStep?: (repairId: string) => void;
  onNavigateSpoke: (spoke: SpokeId) => void;
}

const REPAIR_STEPS = [
  { label: 'Booking Confirmed', desc: 'Secure slot reserved at EMROC facility' },
  { label: 'Intake & ESD Check', desc: 'Cleanroom barcoding & physical triage verification' },
  { label: 'Micro-Soldering & Component Overhaul', desc: 'IPC-certified bench replacement using harvested/OEM certified parts' },
  { label: 'QA Bench Testing & Thermal Telemetry', desc: '4-hour burn-in and voltage curve compliance' },
  { label: 'Ready for Dispatch / Pickup', desc: 'Certified with MRO 12-Month Warranty' },
];

export const RepairBookingSpoke: React.FC<RepairBookingSpokeProps> = ({
  activeDevice,
  activeRepairs,
  onAddNewRepair,
  onAdvanceRepairStep,
  onResetRepairStep,
  onNavigateSpoke,
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState(EMROC_FACILITIES[0].id);

  const [serviceDescription, setServiceDescription] = useState(
    activeDevice.currentIssues ? activeDevice.currentIssues.join(' + ') : 'Preventative Component Overhaul & Micro-Soldering'
  );
  const [isBooked, setIsBooked] = useState(false);

  const selectedFacility = EMROC_FACILITIES.find(f => f.id === selectedFacilityId) || EMROC_FACILITIES[0];
  const deviceActiveRepair = activeRepairs.find(r => r.deviceId === activeDevice.id) || activeRepairs[0];

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: RepairBooking = {
      id: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      deviceId: activeDevice.id,
      deviceName: activeDevice.name,
      serviceType: serviceDescription,
      facilityName: selectedFacility.name,
      facilityAddress: selectedFacility.location,
      technicianName: 'Denis Kamau',
      technicianLevel: 'Level 4 Master Micro-Soldering Specialist',
      technicianAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
      status: 'intake',
      bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedCompletion: new Date(Date.now() + 86400000 * 2).toISOString().replace('T', ' ').substring(0, 16),
      currentStepIndex: 1,
      costKsh: 28500,
      isCoveredByELCI: !!activeDevice.insuranceActive,
      technicianNotes: [
        `Intake barcode verified. Assigned to bench 04 at ${selectedFacility.name}.`,
        'Beginning cleanroom micro-soldering and thermal pad overhaul.'
      ]
    };

    onAddNewRepair(newBooking);
    setIsBooked(true);
  };

  return (
    <div id="repair-booking-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                  Spoke 03 : Repair Booking
                </span>
                <span className="text-xs text-slate-400">Certified EMROC Network</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                EMROC Facility Booking & Live Bench Tracker
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                One-tap booking to certified Electronics Maintenance & Repair Operations Centres with live technician assignment.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">ELCI Insurance Status:</span>
            <span className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1 justify-end ${
              activeDevice.insuranceActive ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {activeDevice.insuranceActive ? '100% Covered by ELCI' : 'Out-of-Warranty Rate'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Tracker vs New Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Live Bench Progress Tracker */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Live Repair Job: {deviceActiveRepair.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {deviceActiveRepair.deviceName}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {deviceActiveRepair.serviceType}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Completion</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {deviceActiveRepair.estimatedCompletion}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Live Bench Milestones & Progress
              </h4>

              <div className="space-y-3">
                {REPAIR_STEPS.map((step, idx) => {
                  const isDone = idx < deviceActiveRepair.currentStepIndex;
                  const isCurrent = idx === deviceActiveRepair.currentStepIndex;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        isCurrent
                          ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-400/30'
                          : isDone
                          ? 'bg-slate-950/70 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-950/30 border-slate-800/50 opacity-40'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs animate-pulse">
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-mono">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-amber-300' : isDone ? 'text-slate-100' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bench Milestone Simulation Controller */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[11px] font-bold text-slate-200">
                    Live Bench Simulation Mode
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    (Triggers browser & in-app alerts on transition)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="advance-repair-step-btn"
                    type="button"
                    onClick={() => onAdvanceRepairStep?.(deviceActiveRepair.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Advance Next Step
                  </button>

                  <button
                    id="reset-repair-step-btn"
                    type="button"
                    onClick={() => onResetRepairStep?.(deviceActiveRepair.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset to intake step"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Assigned Master Technician Card */}

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={deviceActiveRepair.technicianAvatar}
                  alt={deviceActiveRepair.technicianName}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{deviceActiveRepair.technicianName}</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-mono block">
                    {deviceActiveRepair.technicianLevel}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Assigned at: {deviceActiveRepair.facilityName}
                  </span>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Cost Assessment</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {deviceActiveRepair.isCoveredByELCI ? 'KSh 0 (ELCI 100%)' : `KSh ${deviceActiveRepair.costKsh.toLocaleString()}`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">eLC 12M Warranty</span>
              </div>
            </div>

            {/* Technician Bench Notes */}
            {deviceActiveRepair.technicianNotes && deviceActiveRepair.technicianNotes.length > 0 && (
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Live Bench Telemetry & Technician Notes
                </h5>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  {deviceActiveRepair.technicianNotes.map((note, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800/60 text-[11px]">
                      • {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Book a New Repair at Certified EMROC Facility */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Book at Certified EMROC Facility
            </h3>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Target Device
                </label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-100 block">{activeDevice.name}</span>
                    <span className="text-slate-400 font-mono">{activeDevice.serialNumber}</span>
                  </div>
                  <span className="text-amber-400 font-mono font-bold">Health: {activeDevice.healthScore}%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Service / Overhaul Description
                </label>
                <input
                  type="text"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:border-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Select Certified EMROC Facility
                </label>
                <div className="space-y-2">
                  {EMROC_FACILITIES.map((facility) => {
                    const isSelected = selectedFacilityId === facility.id;
                    return (
                      <div
                        key={facility.id}
                        onClick={() => setSelectedFacilityId(facility.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                              {facility.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              {facility.location} ({facility.distanceKm} km away)
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                            {facility.leadTimeHours}h Lead Time
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {facility.certifications.map((cert, cidx) => (
                            <span key={cidx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                id="confirm-emroc-booking-btn"
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <CalendarClock className="w-4 h-4" />
                Confirm One-Tap EMROC Booking
              </button>
            </form>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Central Quality Assurance Guarantee
            </div>
            <p>
              Every EMROC repair uses certified micro-soldering, includes high-voltage burn-in bench tests, and comes with a 12-month digital warranty backed by the central MRO hub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
