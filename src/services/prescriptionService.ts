import { Prescription, PrescriptionItem } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';
import { jsPDF } from 'jspdf';

export interface CreatePrescriptionInput {
    consultationId?: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorQualification?: string;
    hospitalName?: string;
    diagnosis: string;
    items: Omit<PrescriptionItem, 'id'>[];
    adviceNotes?: string;
    validUntil?: string;
}

export function createPrescription(input: CreatePrescriptionInput): Prescription {
    const db = getLocalDB();

    const itemsWithIds: PrescriptionItem[] = input.items.map((it, idx) => ({
        ...it,
        id: `item-${Date.now()}-${idx}`
    }));

    const newRx: Prescription = {
        id: `rx-${Date.now()}`,
        consultationId: input.consultationId,
        patientId: input.patientId,
        patientName: input.patientName,
        patientAge: input.patientAge,
        doctorId: input.doctorId,
        doctorName: input.doctorName,
        doctorSpecialty: input.doctorSpecialty,
        doctorQualification: input.doctorQualification || 'MD, MBBS',
        hospitalName: input.hospitalName || 'CareBridge Rural Telemedicine Mission',
        diagnosis: input.diagnosis,
        items: itemsWithIds,
        adviceNotes: input.adviceNotes,
        validUntil: input.validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };

    db.prescriptions.unshift(newRx);

    // Update Care Journey to Prescription stage
    if (db.careJourneys && db.careJourneys.length > 0) {
        db.careJourneys[0].prescription = 'completed';
        db.careJourneys[0].medicineDelivery = 'active';
    }

    // Add Notification for Patient
    db.notifications.unshift({
        id: `notif-rx-${Date.now()}`,
        recipientRole: 'patient',
        userId: input.patientId,
        title: 'New Digital Prescription Available',
        message: `${input.doctorName} uploaded your prescription for ${input.diagnosis}. Click to view & download.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString()
    });

    saveLocalDB(db);
    return newRx;
}

export function getPrescriptions(patientId?: string): Prescription[] {
    const db = getLocalDB();
    if (patientId) {
        return db.prescriptions.filter((p: Prescription) => p.patientId === patientId);
    }
    return db.prescriptions || [];
}

export function downloadPrescriptionPDF(rx: Prescription) {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Colors
        const navy = '#0F172A';
        const blue = '#0284C7';
        const darkGray = '#334155';

        // Header Banner
        doc.setFillColor(2, 132, 199); // #0284C7
        doc.rect(0, 0, 210, 28, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('CAREBRIDGE RURAL TELEMEDICINE', 14, 14);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('"Healthcare shouldn\'t depend on where you live."', 14, 20);

        doc.setFontSize(8);
        doc.text(`Rx ID: ${rx.id.toUpperCase()}`, 160, 14);
        doc.text(`Date: ${new Date(rx.createdAt).toLocaleDateString()}`, 160, 20);

        // Doctor & Hospital Info Block
        let y = 38;
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(rx.doctorName, 14, y);

        y += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(`${rx.doctorSpecialty} | ${rx.doctorQualification}`, 14, y);

        y += 5;
        doc.text(rx.hospitalName, 14, y);

        // Divider Line
        y += 5;
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y, 196, y);

        // Patient Info Card Box
        y += 6;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y, 182, 20, 2, 2, 'F');

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Patient Name: ${rx.patientName}`, 18, y + 7);
        doc.text(`Age: ${rx.patientAge} Yrs`, 120, y + 7);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Diagnosis: ${rx.diagnosis}`, 18, y + 14);
        doc.text(`Valid Until: ${rx.validUntil}`, 120, y + 14);

        // Medicines Header
        y += 28;
        doc.setFillColor(224, 242, 254);
        doc.rect(14, y, 182, 8, 'F');
        doc.setTextColor(3, 105, 161);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('MEDICINE & DOSAGE INSTRUCTIONS', 18, y + 5.5);
        doc.text('FREQUENCY / DURATION', 130, y + 5.5);

        y += 10;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);

        rx.items.forEach((item, index) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}. ${item.medicineName} (${item.dosage})`, 18, y);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`${item.frequency} - ${item.duration}`, 130, y);

            if (item.instructions) {
                y += 4.5;
                doc.setTextColor(100, 116, 139);
                doc.setFontSize(8);
                doc.text(`   Note: ${item.instructions}`, 18, y);
                doc.setTextColor(15, 23, 42);
            }

            y += 7;
            doc.setDrawColor(241, 245, 249);
            doc.line(18, y - 2, 192, y - 2);
        });

        // Special Advice Notes
        if (rx.adviceNotes) {
            y += 6;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(3, 105, 161);
            doc.text('DOCTOR ADVICE & INSTRUCTIONS:', 14, y);

            y += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            doc.text(rx.adviceNotes, 14, y, { maxWidth: 180 });
            y += 12;
        }

        // Digital Sign Stamp Footer
        y = Math.max(y + 10, 245);
        doc.setDrawColor(203, 213, 225);
        doc.line(14, y, 196, y);

        y += 8;
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('Digitally signed and generated via CareBridge Rural Telemedicine Platform.', 14, y);
        doc.text('Verified Doctor Electronic Authorization', 140, y);

        doc.save(`CareBridge_Prescription_${rx.patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
        console.error('PDF Generation failed:', err);
        alert('Failed to generate PDF document. Please try again.');
    }
}
