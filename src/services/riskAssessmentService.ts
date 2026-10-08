import { SymptomAssessment, HealthVitals, RiskLevel } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';

export interface AssessmentInput {
    patientId: string;
    patientName: string;
    symptoms: string[];
    freeTextDescription?: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    vitals: HealthVitals;
}

export function evaluateHealthRisk(input: AssessmentInput): SymptomAssessment {
    const { symptoms, vitals, severity } = input;

    let riskLevel: RiskLevel = 'GREEN';
    let summaryParts: string[] = [];

    // Check SpO2
    if (vitals.spo2Percentage && vitals.spo2Percentage < 90) {
        riskLevel = 'RED';
        summaryParts.push(`Critically low oxygen saturation (SpO2: ${vitals.spo2Percentage}%)`);
    } else if (vitals.spo2Percentage && vitals.spo2Percentage <= 94) {
        if (riskLevel === 'GREEN') riskLevel = 'YELLOW';
        summaryParts.push(`Moderately reduced oxygen saturation (SpO2: ${vitals.spo2Percentage}%)`);
    }

    // Check Heart Rate
    if (vitals.heartRateBpm && vitals.heartRateBpm > 115) {
        riskLevel = 'RED';
        summaryParts.push(`Elevated heart rate (${vitals.heartRateBpm} bpm)`);
    } else if (vitals.heartRateBpm && vitals.heartRateBpm > 100) {
        if (riskLevel === 'GREEN') riskLevel = 'YELLOW';
        summaryParts.push(`Slightly elevated pulse (${vitals.heartRateBpm} bpm)`);
    }

    // Check Temperature
    if (vitals.temperatureF && vitals.temperatureF >= 102.5) {
        if (riskLevel === 'GREEN') riskLevel = 'YELLOW';
        summaryParts.push(`High fever (${vitals.temperatureF}°F)`);
    }

    // Check critical symptoms
    const criticalSymptoms = ['Breathing difficulty', 'Chest discomfort', 'Heavy Bleeding', 'Unconsciousness'];
    const hasCriticalSymptom = symptoms.some((s) => criticalSymptoms.includes(s));

    if (hasCriticalSymptom || severity === 'Severe') {
        riskLevel = 'RED';
        summaryParts.push(`Severe clinical symptom presentation (${symptoms.join(', ')})`);
    }

    if (summaryParts.length === 0) {
        summaryParts.push('Vital signs and reported symptoms are within stable baseline limits.');
    }

    let recommendedAction = 'Routine consultation recommended with a general physician.';
    if (riskLevel === 'RED') {
        recommendedAction = 'URGENT EVALUATION RECOMMENDED: Immediate doctor alert and hospital referral options enabled.';
    } else if (riskLevel === 'YELLOW') {
        recommendedAction = 'TIMELY CONSULTATION RECOMMENDED: Schedule a video or audio consultation today.';
    }

    const assessment: SymptomAssessment = {
        id: `assess-${Date.now()}`,
        patientId: input.patientId,
        patientName: input.patientName,
        symptoms: input.symptoms,
        freeTextDescription: input.freeTextDescription,
        severity: input.severity,
        vitals: input.vitals,
        riskLevel,
        riskSummary: summaryParts.join('. '),
        recommendedAction,
        createdAt: new Date().toISOString()
    };

    // Save to persistent DB
    const db = getLocalDB();
    db.assessments.unshift(assessment);
    saveLocalDB(db);

    return assessment;
}
