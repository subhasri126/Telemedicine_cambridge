import bcrypt from 'bcryptjs';
import { dbPool } from './db/index.js';

export async function seedDatabase() {
    console.log('🌱 Starting CareBridge Rural MySQL Data Seeding...');
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('Password123!', salt);

        // 1. Seed Demo Verified Doctor (Dr. Arun Kumar)
        const docUserId = 'usr-doc-arun-01';
        const docId = 'doc-arun-01';

        await connection.query(
            `INSERT INTO users (id, email, password_hash, role)
             VALUES (?, 'arun@carebridge.org', ?, 'doctor')
             ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            [docUserId, passwordHash]
        );

        await connection.query(
            `INSERT INTO doctors (
                id, user_id, full_name, email, phone, specialty, qualification,
                medical_registration_number, experience_years, languages_json,
                hospital_clinic, address, verification_status, is_online, rating, consultation_fee
            ) VALUES (?, ?, 'Dr. Arun Kumar', 'arun@carebridge.org', '+91 98765 43210',
                'General Medicine & Critical Triage', 'MBBS, MD (General Medicine)',
                'TNMC-REG-84920', 14, JSON_ARRAY('English', 'Tamil', 'Hindi'),
                'Mayiladuthurai District Headquarters Hospital', 'District Health Complex, Mayiladuthurai, Tamil Nadu',
                'VERIFIED', 1, 4.95, 0.00
            ) ON DUPLICATE KEY UPDATE verification_status = 'VERIFIED', is_online = 1`,
            [docId, docUserId]
        );

        // 2. Seed Demo Patient (Priya Sundaram)
        const patUserId = 'usr-pat-priya-01';
        const patId = 'patient-priya-01';

        await connection.query(
            `INSERT INTO users (id, email, password_hash, role)
             VALUES (?, 'priya@carebridge.org', ?, 'patient')
             ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            [patUserId, passwordHash]
        );

        await connection.query(
            `INSERT INTO patients (
                id, user_id, full_name, email, phone, date_of_birth, age, gender,
                village, district, preferred_language, emergency_contact_name,
                emergency_contact_phone, telegram_chat_id, blood_group
            ) VALUES (?, ?, 'Priya Sundaram', 'priya@carebridge.org', '+91 94432 10987',
                '1984-06-15', 42, 'Female', 'Kollumangudi Village', 'Nagapattinam District',
                'Tamil', 'Murugan Sundaram (Husband)', '+91 94432 10988', '123456789', 'O+'
            ) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
            [patId, patUserId]
        );

        // 3. Care Journey for Priya
        await connection.query(
            `INSERT INTO care_journeys (id, patient_id, health_assessment, doctor_consultation, treatment_decision, prescription, medicine_delivery, followup)
             VALUES ('cj-priya-01', ?, 'completed', 'active', 'pending', 'pending', 'pending', 'pending')
             ON DUPLICATE KEY UPDATE doctor_consultation = 'active'`,
            [patId]
        );

        // 4. Seed Hospitals
        await connection.query(
            `INSERT INTO hospitals (id, name, location, distance_km, has_emergency_unit, available_beds, icu_available, specialties_json, contact_phone)
             VALUES
             ('hosp-01', 'Mayiladuthurai District Govt Hospital', 'Main Road, Mayiladuthurai', 14.5, 1, 12, 1, JSON_ARRAY('Emergency Medicine', 'Cardiology', 'Pediatrics'), '04364-222108'),
             ('hosp-02', 'Nagapattinam Sub-District Health Center', 'Nagapattinam East', 28.0, 1, 6, 0, JSON_ARRAY('General Medicine', 'Maternity Care'), '04365-240108')
             ON DUPLICATE KEY UPDATE name = VALUES(name)`
        );

        // 5. Seed Transport Units
        await connection.query(
            `INSERT INTO transport_units (id, vehicle_code, type, driver_name, driver_phone, status, current_location, eta_minutes)
             VALUES
             ('tu-104', 'TR-104', '108 Rural Emergency Ambulance', 'S. Ramanathan', '+91 98421 10808', 'En Route', 'Kollumangudi Health Post', 18)
             ON DUPLICATE KEY UPDATE vehicle_code = VALUES(vehicle_code)`
        );

        // 6. Seed Demo Initial Emergency Case
        await connection.query(
            `INSERT INTO emergency_cases (
                id, case_number, patient_id, patient_name, patient_age, location,
                symptoms_json, vitals_json, risk_level, status, eta_minutes,
                assigned_doctor_name, assigned_hospital_name, assigned_transport_code
            ) VALUES (
                'case-priya-01', 'CBR-261009-1042', ?, 'Priya Sundaram', 42, 'Kollumangudi Village Health Post',
                JSON_ARRAY('Chest Tightness', 'Shortness of Breath', 'High Fever'),
                JSON_OBJECT('spo2Percentage', 89, 'heartRateBpm', 112, 'temperatureF', 101.4, 'bloodPressure', '135/88'),
                'RED', 'Doctor Alerted', 18, 'Dr. Arun Kumar', 'Mayiladuthurai District Govt Hospital', 'TR-104'
            ) ON DUPLICATE KEY UPDATE status = VALUES(status)`,
            [patId]
        );

        // 7. Seed Initial Symptom Assessment
        await connection.query(
            `INSERT INTO symptom_assessments (
                id, patient_id, patient_name, symptoms_json, free_text, severity, vitals_json, risk_level, risk_summary, recommended_action
            ) VALUES (
                'assess-priya-01', ?, 'Priya Sundaram',
                JSON_ARRAY('Breathing difficulty', 'Chest tightness'),
                'Struggling to get deep breath since morning. Feeling dizzy when standing.',
                'Severe',
                JSON_OBJECT('spo2Percentage', 89, 'heartRateBpm', 112, 'temperatureF', 101.4, 'bloodPressure', '135/88'),
                'RED',
                'Critically low oxygen saturation (SpO2: 89%). Elevated heart rate (112 bpm). Severe clinical symptom presentation.',
                'URGENT EVALUATION RECOMMENDED: Immediate doctor triage alert and emergency hospital referral options enabled.'
            ) ON DUPLICATE KEY UPDATE risk_level = VALUES(risk_level)`,
            [patId]
        );

        await connection.commit();
        console.log('✅ MySQL Data Seeding Completed Successfully!');
        console.log('----------------------------------------------------');
        console.log('📌 Demo Doctor Credentials:');
        console.log('   Email: arun@carebridge.org');
        console.log('   Password: Password123!');
        console.log('   Status: VERIFIED');
        console.log('----------------------------------------------------');
        console.log('📌 Demo Patient Credentials:');
        console.log('   Email: priya@carebridge.org');
        console.log('   Password: Password123!');
        console.log('----------------------------------------------------');
    } catch (err) {
        await connection.rollback();
        console.error('❌ Data Seeding Error:', err);
    } finally {
        connection.release();
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase().then(() => process.exit(0));
}
