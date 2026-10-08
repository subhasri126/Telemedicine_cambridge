-- =======================================================
-- CAREBRIDGE RURAL — SUPABASE POSTGRESQL DATABASE SCHEMA
-- =======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Shared between Auth & Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    age INT,
    gender TEXT,
    blood_group TEXT,
    location TEXT NOT NULL DEFAULT 'Rural Health Centre, Village District',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    medical_history TEXT[],
    current_medications TEXT[],
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    specialty TEXT NOT NULL, -- General Medicine, Pediatrics, Cardiology, Gynecology, Dermatology
    qualification TEXT NOT NULL,
    experience_years INT DEFAULT 5,
    languages TEXT[] DEFAULT ARRAY['English', 'Tamil'],
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 4.9,
    current_queue_count INT DEFAULT 0,
    hospital_affiliation TEXT DEFAULT 'District Care Hospital',
    consultation_fee INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HEALTH ASSESSMENTS / TRIAGE TABLE
CREATE TABLE IF NOT EXISTS public.symptom_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    symptoms TEXT[] NOT NULL,
    free_text_description TEXT,
    severity TEXT CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
    temperature_f DECIMAL(4, 1),
    heart_rate_bpm INT,
    spo2_percentage INT,
    blood_pressure TEXT,
    risk_level TEXT CHECK (risk_level IN ('GREEN', 'YELLOW', 'RED')),
    risk_summary TEXT,
    recommended_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EMERGENCY CASES TABLE
CREATE TABLE IF NOT EXISTS public.emergency_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    assigned_doctor_id UUID REFERENCES public.doctors(id),
    assigned_hospital_id UUID,
    assigned_transport_id UUID,
    location TEXT NOT NULL,
    symptoms TEXT[] NOT NULL,
    vitals JSONB,
    risk_level TEXT DEFAULT 'RED',
    status TEXT NOT NULL CHECK (status IN (
        'SOS Raised', 
        'Doctor Alerted', 
        'Hospital Alerted', 
        'Transport Assigned', 
        'Hospital Accepted', 
        'Patient Arrived',
        'Resolved'
    )),
    eta_minutes INT DEFAULT 18,
    doctor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    distance_km DECIMAL(4, 1),
    has_emergency_unit BOOLEAN DEFAULT TRUE,
    available_beds INT DEFAULT 12,
    icu_available BOOLEAN DEFAULT TRUE,
    specialties TEXT[],
    contact_phone TEXT NOT NULL
);

-- 7. TRANSPORT UNITS (AMBULANCE / RURAL MOBILE VAN)
CREATE TABLE IF NOT EXISTS public.transport_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'Emergency Ambulance', 'Rural Mobile Care Van'
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    status TEXT CHECK (status IN ('Available', 'Assigned', 'En Route', 'Arrived')),
    current_location TEXT,
    eta_minutes INT DEFAULT 15
);

-- 8. CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    mode TEXT CHECK (mode IN ('video', 'audio', 'chat')),
    status TEXT CHECK (status IN ('scheduled', 'waiting', 'in_progress', 'completed', 'cancelled')),
    network_mode TEXT DEFAULT 'Good', -- 'Excellent', 'Good', 'Fair', 'Poor', 'Offline'
    clinical_notes TEXT,
    diagnosis TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES public.consultations(id),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    advice_notes TEXT,
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PRESCRIPTION ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL, -- e.g. '500mg'
    frequency TEXT NOT NULL, -- e.g. '1-0-1 (After Meals)'
    duration TEXT NOT NULL, -- e.g. '5 Days'
    instructions TEXT
);

-- 11. MEDICINE ORDERS / DELIVERY TABLE
CREATE TABLE IF NOT EXISTS public.medicine_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES public.prescriptions(id),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    pharmacy_name TEXT NOT NULL DEFAULT 'Rural Care Express Pharmacy',
    delivery_address TEXT NOT NULL,
    total_amount DECIMAL(8, 2) DEFAULT 0.00,
    status TEXT CHECK (status IN ('Requested', 'Confirmed', 'Out for Delivery', 'Delivered')),
    estimated_delivery TEXT DEFAULT 'Today by 5:00 PM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. FOLLOWUPS TABLE
CREATE TABLE IF NOT EXISTS public.followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. CARE JOURNEY TRACKER TABLE
CREATE TABLE IF NOT EXISTS public.care_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    health_assessment_status TEXT DEFAULT 'completed', -- 'completed', 'active', 'pending'
    doctor_consultation_status TEXT DEFAULT 'pending',
    treatment_decision_status TEXT DEFAULT 'pending',
    prescription_status TEXT DEFAULT 'pending',
    medicine_delivery_status TEXT DEFAULT 'pending',
    followup_status TEXT DEFAULT 'pending',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. REALTIME NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_role TEXT CHECK (recipient_role IN ('patient', 'doctor', 'hospital', 'all')),
    user_id UUID,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'warning', 'emergency', 'success'
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow public reads for demoware & authenticated queries
CREATE POLICY "Public profile access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public patient access" ON public.patients FOR ALL USING (true);
CREATE POLICY "Public doctor access" ON public.doctors FOR ALL USING (true);
CREATE POLICY "Public symptom assessment access" ON public.symptom_assessments FOR ALL USING (true);
CREATE POLICY "Public emergency case access" ON public.emergency_cases FOR ALL USING (true);
CREATE POLICY "Public consultation access" ON public.consultations FOR ALL USING (true);
CREATE POLICY "Public prescription access" ON public.prescriptions FOR ALL USING (true);
CREATE POLICY "Public medicine order access" ON public.medicine_orders FOR ALL USING (true);
CREATE POLICY "Public notification access" ON public.notifications FOR ALL USING (true);
