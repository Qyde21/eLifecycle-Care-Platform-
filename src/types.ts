export type SpokeId = 
  | 'overview'
  | 'testing'
  | 'screening'
  | 'repair'
  | 'spares'
  | 'performance'
  | 'circularity'
  | 'insurance'
  | 'analytics';

export type LifecycleStage = 'active-care' | 'refurbish' | 'harvest-spares' | 'end-of-life';

export interface Device {
  id: string;
  name: string;
  category: 'smartphone' | 'laptop' | 'industrial-iot' | 'solar-inverter' | 'medical-telemetry' | 'enterprise-scanner';
  model: string;
  serialNumber: string;
  purchaseDate: string;
  manufactureYear: number;
  healthScore: number; // 0 - 100
  lifecycleStage: LifecycleStage;
  ownerName: string;
  organization?: string;
  currentIssues?: string[];
  batteryHealth?: number;
  operatingHours?: number;
  lastServiceDate?: string;
  screenCondition?: string;
  insuranceActive?: boolean;
  insurancePolicyNumber?: string;
  carbonAvoidedKg?: number;
}

export interface TriageResult {
  faultName: string;
  faultProbability: number; // percentage
  urgencyScore: number; // 1 - 10
  recommendation: 'repair' | 'replace' | 'refurbish' | 'harvest-spares';
  rationale: string;
  estimatedRepairCostKsh: number;
  estimatedReplacementCostKsh: number;
  replacementCostSavingsPercent: number;
  affectedComponents: string[];
  suggestedSpares: {
    id: string;
    name: string;
    partNumber: string;
    priceKsh: number;
    inStock: boolean;
  }[];
  emrocFacilitiesReady: number;
  safetyAdvisory?: string;
}

export interface ScreeningGradeResult {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  cosmeticScore: number;
  functionalScore: number;
  overallScore: number;
  assignedStage: LifecycleStage;
  estimatedResidualValueKsh: number;
  harvestableComponents: {
    component: string;
    viabilityScore: number;
    estimatedValueKsh: number;
  }[];
  certificateId: string;
  inspectionTimestamp: string;
  inspectorNotes: string;
  recommendedAction: string;
}

export interface RepairBooking {
  id: string;
  deviceId: string;
  deviceName: string;
  serviceType: string;
  facilityName: string;
  facilityAddress: string;
  technicianName: string;
  technicianLevel: string;
  technicianAvatar: string;
  status: 'booked' | 'intake' | 'in-diagnosis' | 'micro-soldering' | 'qa-bench-testing' | 'completed' | 'delivered';
  bookedAt: string;
  estimatedCompletion: string;
  currentStepIndex: number;
  costKsh: number;
  isCoveredByELCI: boolean;
  technicianNotes: string[];
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  compatibility: string[];
  condition: 'Certified Harvested' | 'OEM Tier-1 Factory New';
  healthRating: number; // e.g. 98%
  priceKsh: number;
  originalPriceKsh?: number;
  inStock: number;
  warrantyMonths: number;
  image: string;
  testedBy: string;
}

export interface TelemetryPoint {
  timestamp: string;
  voltageV: number;
  currentA: number;
  temperatureC: number;
  efficiencyPercent: number;
  vibrationMmS: number;
}

export interface CircularityRecoveryItem {
  material: string;
  chemicalSymbol: string;
  recoveredGrams: number;
  purityPercent: number;
  estimatedOffsetKgCO2: number;
  creditsEarned: number;
}

export interface CircularityRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  dispositionDate: string;
  weeeCertificateId: string;
  totalWeightKg: number;
  recoveredMaterials: CircularityRecoveryItem[];
  totalCreditsEarned: number;
  status: 'collection-scheduled' | 'in-transit' | 'disassembly' | 'certified-recovered';
}

export interface InsurancePolicy {
  policyId: string;
  deviceId: string;
  deviceName: string;
  tier: 'Standard Care' | 'Comprehensive Protection' | 'Mission-Critical Swap';
  monthlyPremiumKsh: number;
  deductibleKsh: number;
  coverageLimitKsh: number;
  status: 'active' | 'pending' | 'expired';
  validUntil: string;
  includedFeatures: string[];
}

export interface ESGMetric {
  title: string;
  value: string;
  subtext: string;
  trend: string;
  trendUp: boolean;
}

export type NotificationType = 'repair' | 'insurance' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  spokeTarget?: SpokeId;
  metadata?: {
    repairId?: string;
    policyId?: string;
    deviceId?: string;
    stepIndex?: number;
    stepLabel?: string;
    tier?: string;
  };
}

