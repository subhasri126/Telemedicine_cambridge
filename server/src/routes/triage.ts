import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbPool } from '../db/index.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

export interface CalculateRiskInput {
    patientId: string;
    patientName: string;
    symptoms: string[];
    freeTextDescription?: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    vitals: {
        spo2Percentage?: number;
        heartRateBpm?: number;
        temperatureF?: number;
        bloodPressure?: string;
    };
}

export function calculateClinicalRiskPriority(input: CalculateRiskInput) {
    const { symptoms = [], vitals = {}, severity } = input;
    const spo2 = Number(vitals.spo2Percentage);
    const hr = Number(vitals.heartRateBpm);
    const temp = Number(vitals.temperatureF);

    let riskLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' = 'GREEN';
    let summaryParts: string[] = [];
    let priorityFactors: string[] = [];

    // Critical Emergency Symptoms Check
    const criticalSymptoms = ['Breathing difficulty', 'Chest discomfort', 'Chest tightness', 'Heavy Bleeding', 'Unconsciousness'];
    const hasCriticalSymptom = symptoms.some((s) => criticalSymptoms.includes(s));

    if (hasCriticalSymptom) {
        riskLevel = 'RED';
        summaryParts.push(`Critical symptom present: ${symptoms.filter(s => criticalSymptoms.includes(s)).join(', ')}`);
        priorityFactors.push('CRITICAL_SYMPTOM');
    }

    // Oxygen Saturation SpO2 evaluation
    if (spo2 && spo2 < 90) {
        riskLevel = 'RED';
        summaryParts.push(`Severe hypoxia detected (SpO2: ${spo2}%)`);
        priorityFactors.push('SEVERE_HYPOXIA');
    } else if (spo2 && spo2 <= 94) {
        if (riskLevel !== 'RED') riskLevel = 'ORANGE';
        summaryParts.push(`Moderate oxygen reduction (SpO2: ${spo2}%)`);
        priorityFactors.push('MODERATE_HYPOXIA');
    }

    // Heart Rate evaluation
    if (hr && hr > 120) {
        if (riskLevel !== 'RED') riskLevel = 'ORANGE';
        summaryParts.push(`Severe tachycardia / elevated heart rate (${hr} bpm)`);
        priorityFactors.push('HIGH_TACHYCARDIA');
    } else if (hr && hr > 100) {
        if (riskLevel === 'GREEN') riskLevel = 'YELLOW';
        summaryParts.push(`Mildly elevated pulse rate (${hr} bpm)`);
        priorityFactors.push('MILD_TACHYCARDIA');
    }

    // Temperature evaluation
    if (temp && temp >= 102.5) {
        if (riskLevel === 'GREEN') riskLevel = 'YELLOW';
        summaryParts.push(`High fever detected (${temp}°F)`);
        priorityFactors.push('HIGH_FEVER');
    }

    // Severity grade weighting
    if (severity === 'Severe' && riskLevel !== 'RED') {
        riskLevel = 'ORANGE';
        summaryParts.push('Patient reported high subjective discomfort severity.');
        priorityFactors.push('SUBJECTIVE_SEVERE');
    } else if (severity === 'Moderate' && riskLevel === 'GREEN') {
        riskLevel = 'YELLOW';
        summaryParts.push('Moderate subjective distress reported.');
    }

    if (summaryParts.length === 0) {
        summaryParts.push('Vitals and reported symptoms are within baseline limits.');
        priorityFactors.push('BASELINE_STABLE');
    }

    let recommendedAction = 'Routine consultation recommended with a general physician.';
    if (riskLevel === 'RED') {
        recommendedAction = 'URGENT CLINICAL EVALUATION: Immediate doctor triage alert & hospital referral options enabled.';
    } else if (riskLevel === 'ORANGE') {
        recommendedAction = 'HIGH PRIORITY: Expedited doctor consultation queue placement.';
    } else if (riskLevel === 'YELLOW') {
        recommendedAction = 'TIMELY CONSULTATION RECOMMENDED: Schedule a consultation today.';
    }

    return {
        riskLevel,
        riskSummary: summaryParts.join('. '),
        recommendedAction,
        priorityFactors
    };
}

// REST API for running & saving health triage risk calculation
router.post('/evaluate', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { symptoms, freeTextDescription, severity, vitals } = req.body;

        const patientId = req.user?.profileId || req.user?.id || 'pat-demo-01';
        const patientName = req.user?.email || 'Patient';

        const result = calculateClinicalRiskPriority({
            patientId,
            patientName,
            symptoms: symptoms || [],
            freeTextDescription,
            severity: severity || 'Mild',
            vitals: vitals || {}
        });

        const assessmentId = `assess-${uuidv4()}`;
        const riskId = `risk-${uuidv4()}`;

        // Insert into symptom_assessments
        await dbPool.query(
            `INSERT INTO symptom_assessments (
                id, patient_id, patient_name, symptoms_json, free_text, severity,
                vitals_json, risk_level, risk_summary, recommended_action
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                assessmentId,
                patientId,
                patientName,
                JSON.stringify(symptoms || []),
                freeTextDescription || '',
                severity || 'Mild',
                JSON.stringify(vitals || {}),
                result.riskLevel,
                result.riskSummary,
                result.recommendedAction
            ]
        );

        // Insert into risk_assessments
        const score = result.riskLevel === 'RED' ? 95 : result.riskLevel === 'ORANGE' ? 75 : result.riskLevel === 'YELLOW' ? 50 : 20;
        await dbPool.query(
            `INSERT INTO risk_assessments (id, patient_id, score, priority_level, factors_json) VALUES (?, ?, ?, ?, ?)`,
            [riskId, patientId, score, result.riskLevel, JSON.stringify(result.priorityFactors)]
        );

        return res.json({
            id: assessmentId,
            patientId,
            patientName,
            symptoms: symptoms || [],
            freeTextDescription,
            severity,
            vitals,
            riskLevel: result.riskLevel,
            riskSummary: result.riskSummary,
            recommendedAction: result.recommendedAction,
            createdAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Triage Evaluation Error:', error);
        return res.status(500).json({ error: 'Health triage evaluation failed.' });
    }
});

export default router;
