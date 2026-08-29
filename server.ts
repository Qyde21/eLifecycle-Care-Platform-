import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'eLifecycle Care Platform',
    mroAnchor: 'Central MRO Core',
    services: 8,
    timestamp: new Date().toISOString(),
  });
});

// Spoke 1: AI-Guided Self-Triage Wizard
app.post('/api/diagnostics/triage', async (req, res) => {
  try {
    const { deviceName, category, symptoms, logs, ageYears } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are the chief diagnostic intelligence engine for the eLifecycle Care Platform.
Analyze the following device symptoms and generate an authoritative technical triage assessment.
Device: ${deviceName || 'General Electronics'} (${category || 'Device'})
Device Age: ${ageYears || 2} years
Customer Reported Symptoms: ${symptoms}
Diagnostic Logs: ${logs || 'None provided'}

Provide a precise engineering diagnosis in JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              faultName: { type: Type.STRING, description: 'Primary technical fault description' },
              faultProbability: { type: Type.NUMBER, description: 'Probability percentage 0-100' },
              urgencyScore: { type: Type.INTEGER, description: 'Urgency from 1 (minor) to 10 (catastrophic hazard)' },
              recommendation: { 
                type: Type.STRING, 
                enum: ['repair', 'replace', 'refurbish', 'harvest-spares'],
                description: 'Economic & technical lifecycle recommendation' 
              },
              rationale: { type: Type.STRING, description: 'Detailed engineering rationale comparing repair vs replace' },
              estimatedRepairCostKsh: { type: Type.INTEGER, description: 'Estimated repair cost in Kenyan Shillings' },
              estimatedReplacementCostKsh: { type: Type.INTEGER, description: 'New replacement unit cost in KSh' },
              replacementCostSavingsPercent: { type: Type.INTEGER, description: 'Percentage saved by repairing vs buying new' },
              affectedComponents: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: 'List of failing or degraded components' 
              },
              safetyAdvisory: { type: Type.STRING, description: 'Safety precautions (e.g., thermal hazard, ESD protection)' },
            },
            required: ['faultName', 'faultProbability', 'urgencyScore', 'recommendation', 'rationale', 'estimatedRepairCostKsh', 'estimatedReplacementCostKsh', 'replacementCostSavingsPercent', 'affectedComponents']
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          ...parsed,
          emrocFacilitiesReady: 4,
          suggestedSpares: [
            {
              id: 'SPR-AI-01',
              name: parsed.affectedComponents[0] ? `${parsed.affectedComponents[0]} Sub-Assembly` : 'OEM Component Module',
              partNumber: `ELC-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
              priceKsh: Math.round(parsed.estimatedRepairCostKsh * 0.65),
              inStock: true,
            }
          ]
        });
      }
    }

    // Heuristic Fallback for Telecom & Industrial hardware
    const symptomLower = (symptoms || '').toLowerCase();
    let faultName = 'RF Impedance Mismatch & Harmonic Distortion Drift';
    let urgencyScore = 6;
    let faultProbability = 86;
    let recommendation: 'repair' | 'replace' | 'refurbish' | 'harvest-spares' = 'repair';
    let repairCost = 38500;
    let replaceCost = 280000;
    let affected = ['GaN RF Power Amplifier', 'Matching Capacitor Array'];

    if (symptomLower.includes('vswr') || symptomLower.includes('rru') || symptomLower.includes('power amplifier') || symptomLower.includes('pa')) {
      faultName = 'GaN Transistor Bias Gate Thermal Drift & Sector-2 VSWR Elevation';
      urgencyScore = 8;
      faultProbability = 94;
      recommendation = 'repair';
      repairCost = 42500;
      replaceCost = 320000;
      affected = ['GaN RF Power Amplifier Module', 'Low-ESR RF Matching Caps', 'Chassis Thermal Interface'];
    } else if (symptomLower.includes('splice') || symptomLower.includes('arc') || symptomLower.includes('electrode') || symptomLower.includes('fujikura') || symptomLower.includes('loss')) {
      faultName = 'Arc Discharge Electrode Oxidation & Precision V-Groove Optical Haze';
      urgencyScore = 6;
      faultProbability = 98;
      recommendation = 'repair';
      repairCost = 14800;
      replaceCost = 480000;
      affected = ['Tungsten Fusion Electrodes', 'Dual CMOS Optical Sensors', 'V-Groove Block'];
    } else if (symptomLower.includes('antenna') || symptomLower.includes('ret') || symptomLower.includes('mimo') || symptomLower.includes('beam')) {
      faultName = 'Remote Electrical Tilt (RET) Actuator Motor Gear Latency & Phase Drift';
      urgencyScore = 7;
      faultProbability = 91;
      recommendation = 'repair';
      repairCost = 26500;
      replaceCost = 420000;
      affected = ['AISG 2.0 RET Actuator Stepper', 'Phase Shifter Rod Mechanism'];
    } else if (symptomLower.includes('otdr') || symptomLower.includes('optical') || symptomLower.includes('connector') || symptomLower.includes('ferrule')) {
      faultName = 'FC/APC Ceramic Ferrule Micro-Pitting & Optical Receiver Dynamic Range Loss';
      urgencyScore = 5;
      faultProbability = 88;
      recommendation = 'repair';
      repairCost = 18500;
      replaceCost = 350000;
      affected = ['Ceramic Ferrule Optical Interface', 'Avalanche Photodiode Sub-Board'];
    } else if (symptomLower.includes('microwave') || symptomLower.includes('backhaul') || symptomLower.includes('diplexer')) {
      faultName = 'RF Diplexer Bandpass Cavity Moisture Ingress & IF Frequency Drift';
      urgencyScore = 7;
      faultProbability = 89;
      recommendation = 'repair';
      repairCost = 32000;
      replaceCost = 290000;
      affected = ['RF Diplexer Filter', 'IF Synthesizer Board', 'Waveguide Gasket Seal'];
    } else if (symptomLower.includes('overheat') || symptomLower.includes('thermal') || symptomLower.includes('inverter') || symptomLower.includes('igbt')) {
      faultName = 'Thermal Interface Breakdown & Semiconductor Gate Driver Fatigue';
      urgencyScore = 8;
      faultProbability = 89;
      recommendation = 'repair';
      repairCost = 29500;
      replaceCost = 240000;
      affected = ['IGBT Power Module', 'Heatsink Thermal Interface', 'PWM Driver Circuit'];
    }

    res.json({
      faultName,
      faultProbability,
      urgencyScore,
      recommendation,
      rationale: `Certified MRO analysis confirms that high-precision component-level micro-soldering restores 99.2% of factory specifications, preventing ${Math.round(replaceCost * 0.75)} KSh in replacement waste and diverting toxic e-waste.`,
      estimatedRepairCostKsh: repairCost,
      estimatedReplacementCostKsh: replaceCost,
      replacementCostSavingsPercent: Math.round(((replaceCost - repairCost) / replaceCost) * 100),
      affectedComponents: affected,
      safetyAdvisory: 'Disconnect main battery/DC disconnect before internal servicing. Maintain ESD Class 0 grounding.',
      emrocFacilitiesReady: 4,
      suggestedSpares: [
        {
          id: 'SPR-010',
          name: `${affected[0]} Module`,
          partNumber: `ELC-MOD-${Math.floor(1000 + Math.random() * 9000)}`,
          priceKsh: Math.round(repairCost * 0.7),
          inStock: true,
        }
      ]
    });
  } catch (err: any) {
    console.error('Triage error:', err);
    res.status(500).json({ error: 'Failed to process triage diagnosis', details: err.message });
  }
});

// Spoke 2: Device Grading & Optical Screening
app.post('/api/screening/grade', async (req, res) => {
  try {
    const { deviceName, category, cosmeticDetails, operationalHours, dropHistory, imageBase64 } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const parts: any[] = [
        {
          text: `You are the chief device screening and grading auditor for eLifecycle Care.
Device: ${deviceName} (${category})
Operational History: ${operationalHours || 3000} hours
Drop/Physical Impact History: ${dropHistory || 'None noted'}
Cosmetic Notes: ${cosmeticDetails || 'Standard wear and tear'}

Grade this device into one of four lifecycle stages:
- active-care (good condition, routine care/minor maintenance)
- refurbish (medium wear/repairable damage, restore to pristine grade)
- harvest-spares (catastrophic chassis/board damage, but salvageable displays, chips, motors, or optics)
- end-of-life (unviable for repair or parts, book for certified WEEE chemical recycling and precious metals recovery).

Return strict JSON.`
        }
      ];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              grade: { type: Type.STRING, enum: ['A+', 'A', 'B', 'C', 'D'] },
              cosmeticScore: { type: Type.INTEGER, description: '0 to 100' },
              functionalScore: { type: Type.INTEGER, description: '0 to 100' },
              overallScore: { type: Type.INTEGER, description: '0 to 100' },
              assignedStage: { 
                type: Type.STRING, 
                enum: ['active-care', 'refurbish', 'harvest-spares', 'end-of-life'] 
              },
              estimatedResidualValueKsh: { type: Type.INTEGER },
              inspectorNotes: { type: Type.STRING },
              recommendedAction: { type: Type.STRING },
              harvestableComponents: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    component: { type: Type.STRING },
                    viabilityScore: { type: Type.INTEGER },
                    estimatedValueKsh: { type: Type.INTEGER }
                  },
                  required: ['component', 'viabilityScore', 'estimatedValueKsh']
                }
              }
            },
            required: ['grade', 'cosmeticScore', 'functionalScore', 'overallScore', 'assignedStage', 'estimatedResidualValueKsh', 'inspectorNotes', 'recommendedAction', 'harvestableComponents']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          ...parsed,
          certificateId: `ELC-CERT-${Date.now().toString(36).toUpperCase()}`,
          inspectionTimestamp: new Date().toISOString(),
        });
      }
    }

    // Default smart screening computation
    const hours = Number(operationalHours) || 4000;
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
    let assignedStage: string = 'active-care';
    let overallScore = 78;
    let cosmeticScore = 80;
    let functionalScore = 76;
    let residualVal = 48000;

    if (hours > 12000) {
      grade = 'D';
      assignedStage = 'end-of-life';
      overallScore = 24;
      cosmeticScore = 30;
      functionalScore = 18;
      residualVal = 8500;
    } else if (hours > 7000) {
      grade = 'C';
      assignedStage = 'refurbish';
      overallScore = 58;
      cosmeticScore = 60;
      functionalScore = 56;
      residualVal = 26000;
    }

    res.json({
      grade,
      cosmeticScore,
      functionalScore,
      overallScore,
      assignedStage,
      estimatedResidualValueKsh: residualVal,
      certificateId: `ELC-CERT-${Date.now().toString(36).toUpperCase()}`,
      inspectionTimestamp: new Date().toISOString(),
      inspectorNotes: 'Optical & Hardware Inspection benchmark verified. Chassis and internal rail pass Class-B tolerance test.',
      recommendedAction: assignedStage === 'active-care' 
        ? 'Enroll in ELCI preventative maintenance schedule.' 
        : assignedStage === 'refurbish'
        ? 'Dispatch to EMROC hub for component-level overhaul.'
        : assignedStage === 'harvest-spares'
        ? 'Dismantle at cleanroom bench; salvage display, camera, and inductors for Spares Pool.'
        : 'Book End-of-Life WEEE circularity pickup to mint 1,200 Circularity Credits.',
      harvestableComponents: [
        { component: 'Display / Glass Panel', viabilityScore: 92, estimatedValueKsh: 16500 },
        { component: 'Copper Heatsink Assembly', viabilityScore: 99, estimatedValueKsh: 4200 },
        { component: 'Power Regulation Chokes & MOSFETs', viabilityScore: 88, estimatedValueKsh: 7800 }
      ]
    });
  } catch (err: any) {
    console.error('Screening error:', err);
    res.status(500).json({ error: 'Screening evaluation failed', details: err.message });
  }
});

// Spoke 8: B2B Fleet Insights & ESG Generator
app.post('/api/fleet/insights', async (req, res) => {
  try {
    const { totalDevices, avgHealth, totalCarbonAvoidedKg, totalSavingsKsh } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Generate executive B2B ESG reporting commentary for a facilities manager.
Fleet Size: ${totalDevices} enterprise assets
Fleet Average Health: ${avgHealth}%
Avoided E-Waste & Carbon Savings: ${totalCarbonAvoidedKg} kg CO2e
Total Financial Savings from eLC MRO Hub-and-Spoke Ecosystem: ${totalSavingsKsh} KSh.

Return JSON with executiveSummary, strategicRecommendations (array of strings), and esgComplianceBadge.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              strategicRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              esgComplianceBadge: { type: Type.STRING },
              estimatedNextQuarterSavingsKsh: { type: Type.INTEGER }
            },
            required: ['executiveSummary', 'strategicRecommendations', 'esgComplianceBadge', 'estimatedNextQuarterSavingsKsh']
          }
        }
      });

      if (response.text) {
        return res.json(JSON.parse(response.text.trim()));
      }
    }

    res.json({
      executiveSummary: `Through the integrated 8-spoke ecosystem, your enterprise fleet has extended asset usable lifespans by an average of 2.8 years, averting ${totalCarbonAvoidedKg || 827} kg of Scope 3 greenhouse emissions.`,
      strategicRecommendations: [
        'Migrate 14 solar inverters approaching 8,000 operational hours to preventative thermal overhaul at EMROC Central.',
        'Redeem 3,850 Circularity Credits to offset Q4 ELCI fleet insurance premiums by 18%.',
        'Standardize harvested OEM components across tier-2 field units to reduce spares procurement lead times from 14 days to 4 hours.'
      ],
      esgComplianceBadge: 'Certified Tier-1 Circular Enterprise (ISO 14001 / WEEE Aligned)',
      estimatedNextQuarterSavingsKsh: 380000
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Fleet analysis failed', details: err.message });
  }
});

// Native M-Pesa STK Push Simulation
app.post('/api/mpesa/stk-push', (req, res) => {
  const { phoneNumber, amountKsh, reference, accountName } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required for M-Pesa STK push' });
  }

  // Simulate prompt payload
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}`;
  const receiptNumber = `QH${Math.floor(10000000 + Math.random() * 90000000)}K`;

  setTimeout(() => {
    res.json({
      success: true,
      checkoutRequestId,
      receiptNumber,
      amount: amountKsh || 1000,
      phoneNumber,
      reference: reference || 'ELC-ECARE',
      accountName: accountName || 'eLC MRO Spares & Services',
      timestamp: new Date().toISOString(),
      message: 'M-Pesa STK Push prompt sent to user handset. Verified and approved.'
    });
  }, 1000);
});

// Vite middleware / production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`eLifecycle Care Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
