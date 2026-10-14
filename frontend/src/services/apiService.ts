import type {
  Patient,
  AiChatMessage,
} from '../types/index.ts';

// Simulated latency to mirror real-world networking while keeping UI snappy

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * MediFlow API & Integration Service Layer
 *
 * NOTE FOR BACKEND INTEGRATION:
 * When your backend service is running (e.g. at http://localhost:4000/api),
 * set `VITE_USE_MOCK_API=false` in `.env` and set `VITE_API_URL`.
 * The interfaces match the canonical Mediflow backend schema defined in MASTER_PROMPT.md.
 */
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  useMock: import.meta.env.VITE_USE_MOCK_API !== 'false',
};

export const aiClinicalService = {
  async consult(
    prompt: string,
    patientContext?: Patient | null
  ): Promise<AiChatMessage> {
    await delay(350); // slight delay for natural conversational feel

    const lower = prompt.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Scenario 1: SOAP Note generation
    if (lower.includes('soap') || lower.includes('clinical note') || lower.includes('note')) {
      const pName = patientContext ? `${patientContext.firstName} ${patientContext.lastName}` : 'Patient';
      const mrn = patientContext ? patientContext.mrn : 'MRN-84920';
      const vitals = patientContext?.vitals
        ? `BP: ${patientContext.vitals.bloodPressure}, HR: ${patientContext.vitals.heartRate} bpm, SpO2: ${patientContext.vitals.oxygenSaturation}%, Temp: ${patientContext.vitals.temperature}°F`
        : 'BP: 128/82 mmHg, HR: 74 bpm, SpO2: 98%, Temp: 98.6°F';

      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        category: 'soap',
        text: `Here is the standardized clinical SOAP documentation for ${pName} (${mrn}):`,
        structuredData: {
          title: `Clinical SOAP Record — ${pName}`,
          sections: [
            {
              label: 'Subjective (S)',
              content:
                'Patient presents for evaluation. Reports gradual onset of exertional discomfort over past 48 hours. Denies acute diaphoresis, syncope, or radiating jaw pain. Reports compliant medication intake.',
            },
            {
              label: 'Objective (O)',
              content: `Vitals recorded: ${vitals}. Physical Exam: Regular rhythm, normal S1/S2 without murmurs. Lungs clear to percussion and auscultation bilaterally. No peripheral pedal edema.`,
            },
            {
              label: 'Assessment (A)',
              content:
                '1. Exertional discomfort, low-to-intermediate cardiovascular risk profile.\n2. Chronic hypertension, moderately controlled.\n3. Type 2 Diabetes Mellitus, well controlled without microvascular complications.',
            },
            {
              label: 'Plan (P)',
              content:
                '1. Order 12-lead resting ECG and high-sensitivity Troponin I surveillance.\n2. Fasting lipid panel and HbA1c requisition.\n3. Titrate antihypertensive regimen as indicated by 7-day ambulatory log.\n4. Patient educated on red flag symptoms requiring immediate Emergency Department presentation.',
            },
          ],
          recommendations: [
            'Follow-up visit scheduled in 14 days or earlier if symptoms progress.',
            'Maintain continuous cardiology registry tracking.',
          ],
        },
      };
    }

    // Scenario 2: Drug interaction checker
    if (
      lower.includes('interaction') ||
      lower.includes('drug') ||
      lower.includes('warfarin') ||
      lower.includes('metoprolol') ||
      lower.includes('aspirin')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        category: 'interaction',
        text: 'MediFlow Clinical Pharmacology Engine: Drug-to-Drug Interaction Analysis complete.',
        structuredData: {
          title: 'Pharmacovigilance Interaction Report',
          sections: [
            {
              label: 'Evaluated Regimen',
              content:
                'Metoprolol Succinate (Beta-blocker) + Atorvastatin (HMG-CoA Reductase Inhibitor) + Low-dose Aspirin (81mg)',
            },
            {
              label: 'Mechanism of Action & Synergy',
              content:
                'Cardiovascular co-prescription provides synergistic secondary prevention for atherosclerotic ischemic disease. Concomitant low-dose aspirin and beta-blockade exhibits no clinically adverse pharmacokinetic interference.',
            },
            {
              label: 'Monitoring Parameters',
              content:
                'Monitor resting heart rate (< 55 bpm threshold for bradycardia), blood pressure, and annual hepatic transaminases for statin tolerability.',
            },
          ],
          warnings: [
            'Caution: If initiating NSAIDs (e.g. Ibuprofen), beware of attenuated antihypertensive efficacy and elevated GI bleeding risk with Aspirin.',
            'Avoid co-administration with strong CYP2D6 inhibitors (e.g. Fluoxetine) which can elevate Metoprolol plasma concentrations.',
          ],
          recommendations: [
            'Safe to administer as co-prescribed.',
            'Ensure routine eGFR and electrolyte checks every 6 months.',
          ],
        },
      };
    }

    // Scenario 3: Triage / Risk scoring
    if (lower.includes('triage') || lower.includes('risk') || lower.includes('emergency') || lower.includes('stroke')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        category: 'triage',
        text: 'Clinical Decision Support: Emergency Severity Index (ESI) & Triage Risk Stratification.',
        structuredData: {
          title: 'Acute Triage Assessment Matrix',
          sections: [
            {
              label: 'Stratification Score',
              content: 'ESI Level 2 (High Risk / Urgent Intervention Required within 15 minutes).',
            },
            {
              label: 'Clinical Red Flags Identified',
              content:
                'Acute focal neurological deficit or acute coronary syndrome indicators detected. Patient requires immediate bed assignment with continuous multi-lead cardiac and pulse oximetry monitoring.',
            },
            {
              label: 'Stat Orders Recommended',
              content:
                '1. Non-contrast CT scan / MRI perfusion stroke protocol.\n2. Point-of-care capillary blood glucose.\n3. STAT CBC, CMP, Coagulation profile (PT/INR, aPTT), Troponin.\n4. Establish two large-bore IV access sites (18-gauge).',
            },
          ],
          warnings: [
            'Critical: Verify last known normal (LKN) time to assess thrombolytic / mechanical thrombectomy eligibility window.',
          ],
        },
      };
    }

    // Scenario 4: Dosage calculator
    if (lower.includes('dosage') || lower.includes('dose') || lower.includes('pediatric') || lower.includes('amoxicillin')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        category: 'dosage',
        text: 'MediFlow Weight-Based Pediatric Dosing Assistant calculation:',
        structuredData: {
          title: 'Weight-Based Dosage Calculation (Amoxicillin / Clavulanate)',
          sections: [
            {
              label: 'Patient Parameters',
              content: 'Standard reference: 25 kg pediatric patient (Age ~7-8 yrs). Indication: Acute Otitis Media / Lower Respiratory tract infection.',
            },
            {
              label: 'Recommended Dose Calculation',
              content:
                'High-dose protocol: 80 - 90 mg/kg/day divided into 2 daily doses (every 12 hours).\nTotal Daily Dose: 25 kg x 90 mg/kg = 2,250 mg/day.\nPer Dose: 1,125 mg orally twice daily (BID) for 7-10 days.',
            },
            {
              label: 'Suspension Volume (400mg/5mL formulation)',
              content: 'Take 14 mL (approx. 1,120 mg) orally every 12 hours with meals.',
            },
          ],
          warnings: [
            'Contraindicated if patient has confirmed IgE-mediated beta-lactam anaphylaxis.',
            'Co-administer with food to reduce gastrointestinal upset.',
          ],
        },
      };
    }

    // Default general assistant response
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      category: 'general',
      text: `MediFlow AI Clinical Assistant response to: "${prompt}"\n\nClinical Decision Support Summary:\nBased on current clinical practice guidelines, patient safety guidelines, and established hospital diagnostic pathways, the recommended approach prioritizes comprehensive symptom history, vital sign trend correlation, and evidence-based diagnostic workup.\n\nKey Recommendations:\n• Check current electronic health record for active allergies and drug cross-reactivity.\n• Ensure timely documentation in compliance with hospital SOAP formatting standards.\n• For urgent symptom escalation, notify the attending physician or trigger Code Triage.`,
      structuredData: {
        title: 'Clinical Summary & Guidance',
        recommendations: [
          'Review patient past medical history & medication compliance.',
          'Verify lab results and radiology findings before modifying treatment plans.',
          'Access prompt shortcuts above for instant SOAP notes or drug interaction screening.',
        ],
      },
    };
  },
};
