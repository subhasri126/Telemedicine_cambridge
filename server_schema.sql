-- CareBridge Rural Database Schema

CREATE DATABASE IF NOT EXISTS carebridge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carebridge_db;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'admin') NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Patients table
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    full_name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    age INT,
    gender VARCHAR(20),
    village VARCHAR(100),
    district VARCHAR(100),
    preferred_language VARCHAR(50) DEFAULT 'English',
    emergency_contact_name VARCHAR(191),
    emergency_contact_phone VARCHAR(50),
    telegram_chat_id VARCHAR(100),
    blood_group VARCHAR(10) DEFAULT 'O+',
    medical_history_json JSON,
    current_medications_json JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    full_name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    qualification VARCHAR(191) NOT NULL,
    medical_registration_number VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    languages_json JSON,
    hospital_clinic VARCHAR(191),
    address TEXT,
    is_online TINYINT(1) DEFAULT 1,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    rating DECIMAL(3,2) DEFAULT 4.90,
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Doctor Documents table
CREATE TABLE IF NOT EXISTS doctor_documents (
    id VARCHAR(64) PRIMARY KEY,
    doctor_id VARCHAR(64) NOT NULL,
    document_type ENUM('Registration Certificate', 'Qualification Certificate', 'Identity Proof') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Doctor Availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
    id VARCHAR(64) PRIMARY KEY,
    doctor_id VARCHAR(64) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available TINYINT(1) DEFAULT 1,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Emergency Contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL,
    name VARCHAR(191) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(50),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Messages table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL,
    sender_id VARCHAR(64) NOT NULL,
    receiver_id VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Symptom Assessments table
CREATE TABLE IF NOT EXISTS symptom_assessments (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL,
    patient_name VARCHAR(191) NOT NULL,
    symptoms_json JSON NOT NULL,
    free_text TEXT,
    severity ENUM('Mild', 'Moderate', 'Severe') NOT NULL,
    vitals_json JSON NOT NULL,
    risk_level ENUM('RED', 'ORANGE', 'YELLOW', 'GREEN') NOT NULL,
    risk_summary TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Risk Assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL,
    score INT DEFAULT 0,
    priority_level ENUM('RED', 'ORANGE', 'YELLOW', 'GREEN') NOT NULL,
    factors_json JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Consultations table
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(64) PRIMARY KEY,
    room_id VARCHAR(64) NOT NULL UNIQUE,
    patient_id VARCHAR(64) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL,
    mode ENUM('video', 'audio') DEFAULT 'video',
    status ENUM('requested', 'ringing', 'connected', 'completed', 'cancelled') DEFAULT 'requested',
    network_mode VARCHAR(50) DEFAULT 'Good',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Consultation Notes table
CREATE TABLE IF NOT EXISTS consultation_notes (
    id VARCHAR(64) PRIMARY KEY,
    consultation_id VARCHAR(64) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL,
    chief_complaint TEXT,
    clinical_findings TEXT,
    advice TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Emergency Cases table
CREATE TABLE IF NOT EXISTS emergency_cases (
    id VARCHAR(64) PRIMARY KEY,
    case_number VARCHAR(64) NOT NULL UNIQUE,
    patient_id VARCHAR(64) NOT NULL,
    patient_name VARCHAR(191) NOT NULL,
    patient_age INT DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    symptoms_json JSON,
    vitals_json JSON,
    risk_level ENUM('RED', 'ORANGE', 'YELLOW', 'GREEN') DEFAULT 'RED',
    status ENUM('SOS Raised', 'Doctor Alerted', 'Hospital Notified', 'Transport Assigned', 'Hospital Accepted', 'Patient Arrived', 'Resolved') DEFAULT 'SOS Raised',
    eta_minutes INT DEFAULT 15,
    assigned_doctor_name VARCHAR(191),
    assigned_hospital_name VARCHAR(191),
    assigned_transport_code VARCHAR(100),
    doctor_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Emergency Notifications table
CREATE TABLE IF NOT EXISTS emergency_notifications (
    id VARCHAR(64) PRIMARY KEY,
    emergency_case_id VARCHAR(64) NOT NULL,
    recipient_role VARCHAR(50) NOT NULL,
    user_id VARCHAR(64),
    channel ENUM('in_app', 'telegram') DEFAULT 'in_app',
    title VARCHAR(191) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_case_id) REFERENCES emergency_cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 15. Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    location VARCHAR(255) NOT NULL,
    distance_km DECIMAL(5,2) DEFAULT 10.0,
    has_emergency_unit TINYINT(1) DEFAULT 1,
    available_beds INT DEFAULT 10,
    icu_available TINYINT(1) DEFAULT 1,
    specialties_json JSON,
    contact_phone VARCHAR(50)
) ENGINE=InnoDB;

-- 16. Hospital Capabilities table
CREATE TABLE IF NOT EXISTS hospital_capabilities (
    id VARCHAR(64) PRIMARY KEY,
    hospital_id VARCHAR(64) NOT NULL,
    capability_name VARCHAR(191) NOT NULL,
    description TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. Transport Units table
CREATE TABLE IF NOT EXISTS transport_units (
    id VARCHAR(64) PRIMARY KEY,
    vehicle_code VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    driver_name VARCHAR(191) NOT NULL,
    driver_phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    current_location VARCHAR(255),
    eta_minutes INT DEFAULT 15
) ENGINE=InnoDB;

-- 18. Transport Assignments table
CREATE TABLE IF NOT EXISTS transport_assignments (
    id VARCHAR(64) PRIMARY KEY,
    emergency_case_id VARCHAR(64) NOT NULL,
    transport_unit_id VARCHAR(64) NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'En Route',
    FOREIGN KEY (emergency_case_id) REFERENCES emergency_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (transport_unit_id) REFERENCES transport_units(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 19. Hospital Handoffs table
CREATE TABLE IF NOT EXISTS hospital_handoffs (
    id VARCHAR(64) PRIMARY KEY,
    emergency_case_id VARCHAR(64) NOT NULL,
    hospital_id VARCHAR(64) NOT NULL,
    handoff_notes TEXT,
    bed_type VARCHAR(100) DEFAULT 'Emergency ICU',
    status VARCHAR(50) DEFAULT 'Bed Reserved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_case_id) REFERENCES emergency_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 20. Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(64) PRIMARY KEY,
    consultation_id VARCHAR(64),
    patient_id VARCHAR(64) NOT NULL,
    patient_name VARCHAR(191) NOT NULL,
    patient_age INT DEFAULT 0,
    doctor_id VARCHAR(64) NOT NULL,
    doctor_name VARCHAR(191) NOT NULL,
    doctor_specialty VARCHAR(100) NOT NULL,
    doctor_qualification VARCHAR(191),
    hospital_name VARCHAR(191),
    diagnosis VARCHAR(255) NOT NULL,
    advice_notes TEXT,
    valid_until VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 21. Prescription Items table
CREATE TABLE IF NOT EXISTS prescription_items (
    id VARCHAR(64) PRIMARY KEY,
    prescription_id VARCHAR(64) NOT NULL,
    medicine_name VARCHAR(191) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 22. Pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    address TEXT NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- 23. Medicine Orders table
CREATE TABLE IF NOT EXISTS medicine_orders (
    id VARCHAR(64) PRIMARY KEY,
    prescription_id VARCHAR(64) NOT NULL,
    patient_id VARCHAR(64) NOT NULL,
    patient_name VARCHAR(191) NOT NULL,
    pharmacy_name VARCHAR(191) NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('Requested', 'Confirmed', 'Out for Delivery', 'Delivered') DEFAULT 'Requested',
    estimated_delivery VARCHAR(191),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 24. Medicine Order Items table
CREATE TABLE IF NOT EXISTS medicine_order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    medicine_name VARCHAR(191) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES medicine_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 25. Followups table
CREATE TABLE IF NOT EXISTS followups (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL,
    doctor_name VARCHAR(191) NOT NULL,
    scheduled_date VARCHAR(50) NOT NULL,
    scheduled_time VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 26. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    recipient_role VARCHAR(50) NOT NULL,
    title VARCHAR(191) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 27. Care Journeys table
CREATE TABLE IF NOT EXISTS care_journeys (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL UNIQUE,
    health_assessment ENUM('completed', 'active', 'pending') DEFAULT 'completed',
    doctor_consultation ENUM('completed', 'active', 'pending') DEFAULT 'active',
    treatment_decision ENUM('completed', 'active', 'pending') DEFAULT 'pending',
    prescription ENUM('completed', 'active', 'pending') DEFAULT 'pending',
    medicine_delivery ENUM('completed', 'active', 'pending') DEFAULT 'pending',
    followup ENUM('completed', 'active', 'pending') DEFAULT 'pending',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;
