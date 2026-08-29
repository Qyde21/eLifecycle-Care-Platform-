import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  ShoppingBag, 
  ArrowRight,
  Zap,
  Tag,
  Leaf
} from 'lucide-react';
import { Device, SparePart, SpokeId } from '../../types';

interface SparesMarketplaceSpokeProps {
  activeDevice: Device;
  sparesList: SparePart[];
  onOpenMPesa: (amount: number, purpose: string, ref: string) => void;
  onNavigateSpoke: (spoke: SpokeId) => void;
}

export const SparesMarketplaceSpoke: React.FC<SparesMarketplaceSpokeProps> = ({
  activeDevice,
  sparesList,
  onOpenMPesa,
  onNavigateSpoke,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterCondition, setFilterCondition] = useState<'All' | 'Harvested' | 'OEM'>('All');
  const [compatibilityOnly, setCompatibilityOnly] = useState(false);

  const categories = ['All', 'Power Electronics', 'Sensors & Optics', 'RF & Microwave', 'Optics & Interconnects', 'Passive Components'];

  const filteredSpares = sparesList.filter((part) => {
    const matchesSearch = 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.compatibility.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
    
    const matchesCondition = 
      filterCondition === 'All' ||
      (filterCondition === 'Harvested' && part.condition.includes('Harvested')) ||
      (filterCondition === 'OEM' && part.condition.includes('OEM'));

    const matchesCompatibility = 
      !compatibilityOnly || 
      part.compatibility.some(c => c.toLowerCase().includes(activeDevice.name.toLowerCase()) || c.toLowerCase().includes(activeDevice.model.toLowerCase()));

    return matchesSearch && matchesCategory && matchesCondition && matchesCompatibility;
  });

  const handleBuyPart = (part: SparePart) => {
    onOpenMPesa(
      part.priceKsh,
      `Spare Component: ${part.name} (${part.partNumber})`,
      `SPR-ORD-${Date.now().toString(36).toUpperCase()}`
    );
  };

  return (
    <div id="spares-marketplace-spoke-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  Spoke 04 : Spares Pool
                </span>
                <span className="text-xs text-slate-400">M-Pesa Native Marketplace</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                OEM-Grade & Certified-Harvested Spares Pool
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Sourced from cleanroom harvested supply and tier-1 OEM manufacturers with verified health ratings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Payment System</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <Smartphone className="w-3.5 h-3.5" />
                M-Pesa Express Native
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="spares-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search component name, part number, chip, or compatible model..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompatibilityOnly(!compatibilityOnly)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                compatibilityOnly
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Fit for {activeDevice.name.split(' ')[0]} Only
            </button>

            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              {(['All', 'Harvested', 'OEM'] as const).map((cond) => (
                <button
                  key={cond}
                  onClick={() => setFilterCondition(cond)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterCondition === cond
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white border-cyan-500 font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Spares Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSpares.map((part) => {
          const isHarvested = part.condition.includes('Harvested');
          const isCompatible = part.compatibility.some(c => 
            c.toLowerCase().includes(activeDevice.name.toLowerCase()) || 
            c.toLowerCase().includes(activeDevice.model.toLowerCase())
          );

          return (
            <div
              key={part.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Image & Health Rating Badge */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase font-mono tracking-wider border ${
                      isHarvested 
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80' 
                        : 'bg-cyan-950/90 text-cyan-300 border-cyan-700/80'
                    }`}>
                      {isHarvested ? '🌱 Certified Harvested' : '⚡ OEM Tier-1 New'}
                    </span>

                    {isCompatible && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-mono">
                        ✓ Fit Verified for Active Unit
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs">
                    <span className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-cyan-300 font-mono px-2 py-0.5 rounded">
                      Health: {part.healthRating}%
                    </span>
                    <span className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 font-mono text-[11px] px-2 py-0.5 rounded">
                      Stock: {part.inStock} units
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider font-mono text-cyan-400">
                    {part.partNumber} • {part.category}
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm line-clamp-2 leading-snug">
                    {part.name}
                  </h3>

                  <div className="text-[11px] text-slate-400 pt-1">
                    <strong className="text-slate-300">Compatible with:</strong>{' '}
                    {part.compatibility.join(', ')}
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Tested by {part.testedBy}
                  </div>
                </div>
              </div>

              {/* Price & M-Pesa Buy Button */}
              <div className="p-4 pt-0 border-t border-slate-800/80 mt-2">
                <div className="flex items-baseline justify-between py-2">
                  <div>
                    <span className="text-lg font-extrabold text-white font-mono">
                      KSh {part.priceKsh.toLocaleString()}
                    </span>
                    {part.originalPriceKsh && (
                      <span className="text-xs text-slate-500 line-through ml-2 font-mono">
                        KSh {part.originalPriceKsh.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {part.warrantyMonths}M Warranty
                  </span>
                </div>

                <button
                  id={`buy-part-btn-${part.id}`}
                  onClick={() => handleBuyPart(part)}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Smartphone className="w-4 h-4 text-slate-950" />
                  Instant M-Pesa STK Purchase
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
