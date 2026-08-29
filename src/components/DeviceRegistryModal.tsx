import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Sun, 
  Cpu, 
  Plus, 
  X, 
  CheckCircle2, 
  ScanLine, 
  ShieldCheck 
} from 'lucide-react';
import { Device, LifecycleStage } from '../types';

interface DeviceRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (device: Device) => void;
}

export const DeviceRegistryModal: React.FC<DeviceRegistryModalProps> = ({
  isOpen,
  onClose,
  onAddDevice,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Device['category']>('telecom-rru');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState(`SN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [manufactureYear, setManufactureYear] = useState(2023);
  const [ownerName, setOwnerName] = useState('Eng. Peter Odhiambo');
  const [organization, setOrganization] = useState('Safaricom Tower Operations');
  const [healthScore, setHealthScore] = useState(88);
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage>('active-care');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDev: Device = {
      id: `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || `${category.toUpperCase()} Unit ${serialNumber.slice(-4)}`,
      category,
      model: model || 'Standard Industrial Build',
      serialNumber,
      purchaseDate: new Date().toISOString().slice(0, 10),
      manufactureYear,
      healthScore,
      lifecycleStage,
      ownerName,
      organization,
      currentIssues: [],
      batteryHealth: 92,
      operatingHours: 1200,
      carbonAvoidedKg: 45.0,
      insuranceActive: true,
    };

    onAddDevice(newDev);
    onClose();
  };

  return (
    <div id="device-registry-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="device-registry-card"
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Unified Device Registry</h3>
              <p className="text-xs text-slate-400">Onboard asset into eLC 8-Spoke ecosystem</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Asset Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'telecom-rru', label: 'Remote Radio Unit (RRU)' },
                { id: 'telecom-antenna', label: 'MIMO / Panel Antenna' },
                { id: 'optical-splicer', label: 'Fusion Splicer' },
                { id: 'otdr-tester', label: 'OTDR & Loss Tester' },
                { id: 'microwave-link', label: 'Microwave Backhaul' },
                { id: 'solar-inverter', label: 'BTS Solar Inverter' },
                { id: 'base-band-unit', label: 'Baseband Unit (BBU)' },
                { id: 'industrial-iot', label: 'Tower IoT Gateway' },
                { id: 'laptop', label: 'Field Tech Rugged Laptop' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    category === c.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Asset Name & Model
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Huawei 5G RRU 5502, Fujikura 90S+ Splicer, or Kathrein MIMO Antenna"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-100 focus:border-amber-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Serial Number / Barcode
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:border-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Manufacture Year
              </label>
              <input
                type="number"
                value={manufactureYear}
                onChange={(e) => setManufactureYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:border-amber-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Owner / Assigned Custodian
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Enterprise Fleet / Org
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Initial Health Score ({healthScore}%)
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={healthScore}
                onChange={(e) => setHealthScore(Number(e.target.value))}
                className="w-full accent-amber-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Initial Lifecycle Stage
              </label>
              <select
                value={lifecycleStage}
                onChange={(e) => setLifecycleStage(e.target.value as LifecycleStage)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
              >
                <option value="active-care">Active Care</option>
                <option value="refurbish">Refurbish</option>
                <option value="harvest-spares">Harvest-Spares</option>
                <option value="end-of-life">End-of-Life</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="submit-register-device-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Asset to eLifecycle Core
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
