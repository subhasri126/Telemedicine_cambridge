import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export type Language = 'en' | 'ta';
type TranslationValue = string | ((values: Record<string, string | number>) => string);

const translations: Record<Language, Record<string, TranslationValue>> = {
    en: {
        home: 'Home', services: 'Services', howItWorks: 'How It Works', login: 'Login', getStarted: 'Get Started',
        dashboard: 'Dashboard', findDoctor: 'Find Doctor', patientRecord: 'Patient Record', notifications: 'Notifications',
        noNotifications: 'No new notifications', logout: 'Log out', openMenu: 'Open navigation menu', closeMenu: 'Close navigation menu',
        language: 'Language', tamil: 'தமிழ்', english: 'English', careJourney: 'Your care journey, connected',
        healthcareWithinReach: 'Healthcare Within Reach', heroTitle: 'Quality Healthcare, Closer to Every Community.',
        heroDescription: 'Connect with doctors, access digital health records, and coordinate emergency care from wherever you live.',
        exploreServices: 'Explore Services', secureAccess: 'Secure role-based access', ruralConnectivity: 'Designed for rural connectivity',
        consultation: 'Consultation', healthRecords: 'Health records', emergencySupport: 'Emergency support',
        registerSecurely: 'Register securely', connectCare: 'Connect with care', continueJourney: 'Continue your journey',
        careThatContinues: 'Care that continues beyond the first conversation', ourServices: 'Our Services',
        connectedTools: 'Tools for a connected care journey', careServices: 'Care Services', register: 'Register',
        medicalDisclaimer: 'Medical Disclaimer', emergencyHelp: 'Emergency Support', madeWith: 'Made with',
        footerMission: 'Empowering rural communities with connected healthcare journeys—from AI risk screening to consultation, hospital handoff, and doorstep medicine delivery.',
        footerSecure: 'Secure access and role-based features are provided through the CareBridge portal.',
        footerEmergency: 'For immediate danger, contact your local emergency services. CareBridge SOS access is available after patient authentication.',
        footerMedical: 'CareBridge Rural is an AI-assisted health screening and telemedicine platform designed to connect rural patients with qualified doctors. AI features perform risk triage guidance and do not replace licensed medical diagnosis.',
        roleLogin: 'CareBridge Account Sign In', roleRegister: 'New Portal Registration',
        selectRole: 'Select Your CareBridge Access Role', roleDescription: 'Choose whether you are a patient seeking health consultation or a registered medical practitioner.',
        patientPortal: 'Patient Portal', doctorPortal: 'Doctor Portal', patientSignIn: 'Patient Sign In', doctorSignIn: 'Doctor Sign In',
        registerPatient: 'Register as Patient', registerDoctor: 'Register as Doctor', demoPatient: 'Demo Sign In as Patient (Priya Sundaram)',
        demoDoctor: 'Demo Sign In as Doctor (Dr. Arun Kumar - Verified)', securePortal: 'Secure JWT & MySQL Portal',
        backRole: 'Back to Role Selection', emailAddress: 'Email Address', password: 'Password', phoneNumber: 'Phone Number',
        fullName: 'Full Name', patientRegistration: 'Patient Registration', doctorRegistration: 'Doctor Registration & Credential Verification',
        createPatientAccount: 'Create your CareBridge Rural Patient account',
        doctorVerificationIntro: 'Submit your clinical credentials for CareBridge verification',
        authFailed: 'Invalid email or password.', registrationFailed: 'Registration failed.', authenticating: 'Authenticating...',
        authenticatingDoctor: 'Authenticating Doctor...', orQuickDemo: 'OR QUICK DEMO', verifiedDemoDoctor: 'VERIFIED DEMO DOCTOR',
        noAccountPatient: "Don't have a patient account?", registerHere: 'Register here',
        newDoctor: 'New doctor practitioner?', uploadCredentials: 'Register & Upload Credentials',
        assistant: 'CareBridge Assistant', aiGuidance: 'AI Guidance', smartVoice: 'Smart Voice & Symptom Triage',
        clearChat: 'Clear Chat', typePrompt: 'Type or speak your symptom/request...', listening: 'Listening... Speak now',
        requestingPermission: 'Requesting microphone permission...', startVoice: 'Start voice input', stopListening: 'Stop listening',
        textFallback: 'Voice input is not supported in this browser. You can continue using text.',
        aiThinking: 'CareBridge Assistant is thinking...', switchLanguage: 'Switch Language',
        assistantDisclaimer: 'AI-assisted triage guidance only. Does not replace a qualified medical professional.',
        listeningIn: 'Listening in {{language}}... Speak now', stopMicrophone: 'Stop Microphone',
        ruralPatientPortal: 'Rural Patient Portal', goodMorning: 'Good Morning', askAssistant: 'Ask CareBridge Assistant',
        emergencySOS: 'Emergency SOS', aiAssistant: 'AI Assistant', voiceTextTriage: 'Voice & text triage',
        healthAssessment: 'Health Assessment', multiStepCheck: 'Multi-step check', matchSpecialists: 'Match specialists',
        consultationRoom: 'Consultation Room', videoCall: 'WebRTC video call', prescriptions: 'Prescriptions',
        downloadPdf: 'Download PDF', medicineDelivery: 'Medicine Delivery', doorstepOrder: 'Doorstep order',
        myRecentVitals: 'MY RECENT VITALS & TRIAGE', newHealthAssessment: 'New Health Assessment',
        spo2Level: 'SpO2 Level', pulseRate: 'Pulse Rate', lowOxygen: 'Low Oxygen', elevated: 'Elevated',
        temperature: 'Temperature', bloodPressure: 'Blood Pressure', feverDetected: 'Fever Detected',
        preHypertension: 'Pre-hypertension', latestTriageAlert: 'Latest AI Triage Alert: RED / HIGH PRIORITY',
        respiratoryAlert: 'Respiratory tightness with low SpO2. Emergency doctor alert & transport dispatch active.',
        upcomingConsultation: 'UPCOMING CONSULTATION & RX', active: 'Active', assignedSpecialist: 'Assigned Specialist',
        joinSession: 'Join Session', prescriptionReady: 'Digital Prescription Ready', viewDownload: 'View & Download',
        doorstepDelivery: 'Doorstep Delivery', trackCourier: 'Track Courier',
        credentialsUnderVerification: 'Your credentials are under verification.',
        pendingApproval: 'PENDING APPROVAL',
        credentialsReview: 'Medical Council registration & qualification certificates submitted upon registration are being reviewed by CareBridge clinical administrators.',
        verifyDemo: 'Verify Doctor Credentials (Demo Admin Trigger)', verifying: 'Verifying...',
        dutyStatus: 'Duty Status', onlineAccepting: 'ONLINE & ACCEPTING', offline: 'OFFLINE',
        criticalEmergencyAlert: 'CRITICAL EMERGENCY SOS ALERT', activeCases: 'Active Cases',
        reviewPatient: 'Review Patient & Dispatch', priorityQueue: 'Patient Priority Queue',
        patients: 'Patients', highRisk: 'High Risk (RED)', criticalCases: 'Critical Cases',
        doctorStatus: 'Doctor Status', sortedQueue: 'Sorted by risk priority and waiting time',
        noPatientsQueue: 'No patients currently in queue.', findSpecialistDoctors: 'Find Specialist Doctors',
        doctorsAvailable: 'Connected telemedicine doctors available for consultation',
        searchDoctors: 'Search by doctor name, specialty, or condition...', hospital: 'Hospital',
        experience: 'Experience', years: 'Years', languages: 'Languages', waitingQueue: 'Waiting Queue',
        startTeleConsultation: 'Start Tele-Consultation', digitalPrescriptions: 'Digital Prescriptions',
        verifiedPrescriptions: 'Verified doctor prescriptions and printable PDF records',
        noPrescriptions: 'No prescriptions available yet',
        completeConsultation: 'Complete a doctor consultation to receive your digital prescription.',
        orderMedicine: 'Order Medicine Doorstep', patient: 'Patient', diagnosis: 'Diagnosis',
        validUntil: 'Valid Until', prescribedMedications: 'Prescribed Medications', medicine: 'Medicine',
        dosage: 'Dosage', frequency: 'Frequency', duration: 'Duration', instructions: 'Instructions',
        asDirected: 'As directed',
        sosRaised: 'SOS Raised', doctorConnected: 'Doctor Connected', hospitalNotified: 'Hospital Notified',
        ambulanceDispatched: 'Ambulance Dispatched', bedReserved: 'Bed Reserved', patientArrived: 'Patient Arrived',
        activeEmergencyCase: 'ACTIVE EMERGENCY CASE', location: 'Location', ambulanceEta: 'Ambulance ETA',
        minutes: 'Minutes', advanceEmergencyWorkflow: 'Advance Emergency Workflow',
        emergencySosRequest: 'EMERGENCY SOS REQUEST', emergencyPipeline: 'CareBridge Rural Emergency Response Pipeline',
        sosActiveCase: 'SOS ACTIVE — CASE', emergencyAlerted: 'Emergency response contacts alerted.',
        noVerifiedRecipients: 'No verified SMS recipients were available.',
        smsTo: 'SMS to', trackEmergency: 'Track Emergency Status on Dashboard',
        hospitalHandoff: 'Hospital Handoff & Transport Dispatched', inProgress: 'In Progress',
        submitSos: 'Submit Emergency SOS', symptoms: 'Symptoms', availableLocation: 'Available Location'
    },
    ta: {
        home: 'முகப்பு', services: 'சேவைகள்', howItWorks: 'எப்படி செயல்படுகிறது', login: 'உள்நுழைவு', getStarted: 'தொடங்குங்கள்',
        dashboard: 'முகப்புப் பலகை', findDoctor: 'மருத்துவரைக் கண்டறியவும்', patientRecord: 'நோயாளர் பதிவு', notifications: 'அறிவிப்புகள்',
        noNotifications: 'புதிய அறிவிப்புகள் இல்லை', logout: 'வெளியேறு', openMenu: 'வழிசெலுத்தல் மெனுவைத் திறக்கவும்', closeMenu: 'வழிசெலுத்தல் மெனுவை மூடவும்',
        language: 'மொழி', tamil: 'தமிழ்', english: 'English', careJourney: 'உங்கள் சிகிச்சைப் பயணம், இணைக்கப்பட்டது',
        healthcareWithinReach: 'சுகாதாரம் உங்கள் அருகில்', heroTitle: 'ஒவ்வொரு சமூகத்திற்கும் அருகில் தரமான சுகாதாரம்.',
        heroDescription: 'நீங்கள் எங்கு இருந்தாலும் மருத்துவர்களுடன் இணைந்து, டிஜிட்டல் சுகாதார பதிவுகளை அணுகி, அவசர சிகிச்சையை ஒருங்கிணைக்கவும்.',
        exploreServices: 'சேவைகளைப் பார்க்கவும்', secureAccess: 'பாதுகாப்பான பங்கு அடிப்படையிலான அணுகல்', ruralConnectivity: 'கிராமப்புற இணைப்புக்காக வடிவமைக்கப்பட்டது',
        consultation: 'ஆலோசனை', healthRecords: 'சுகாதார பதிவுகள்', emergencySupport: 'அவசர உதவி',
        registerSecurely: 'பாதுகாப்பாக பதிவு செய்யுங்கள்', connectCare: 'சிகிச்சையுடன் இணையுங்கள்', continueJourney: 'உங்கள் பயணத்தைத் தொடருங்கள்',
        careThatContinues: 'முதல் உரையாடலுக்குப் பிறகும் தொடரும் சிகிச்சை', ourServices: 'எங்கள் சேவைகள்',
        connectedTools: 'இணைக்கப்பட்ட சிகிச்சைப் பயணத்திற்கான கருவிகள்', careServices: 'சிகிச்சை சேவைகள்', register: 'பதிவு',
        medicalDisclaimer: 'மருத்துவ மறுப்பு', emergencyHelp: 'அவசர ஆதரவு', madeWith: 'அன்புடன் உருவாக்கப்பட்டது',
        footerMission: 'AI அபாயத் திரையிடல், ஆலோசனை, மருத்துவமனை ஒப்படைப்பு மற்றும் மருந்து விநியோகம் வரை இணைந்த சுகாதாரப் பயணத்தின் மூலம் கிராமப்புற சமூகங்களை வலுப்படுத்துகிறோம்.',
        footerSecure: 'பாதுகாப்பான அணுகல் மற்றும் பங்கு அடிப்படையிலான அம்சங்கள் CareBridge போர்டல் மூலம் வழங்கப்படுகின்றன.',
        footerEmergency: 'உடனடி ஆபத்து ஏற்பட்டால், உங்கள் உள்ளூர் அவசர சேவையை தொடர்பு கொள்ளவும். நோயாளி அங்கீகாரத்திற்குப் பிறகு CareBridge SOS அணுகல் கிடைக்கும்.',
        footerMedical: 'CareBridge Rural என்பது AI உதவியுடன் செயல்படும் சுகாதாரத் திரையிடல் மற்றும் தொலைமருத்துவ தளம். இது தகுதியான மருத்துவர்களுடன் கிராமப்புற நோயாளிகளை இணைக்க வடிவமைக்கப்பட்டுள்ளது. AI அம்சங்கள் வழிகாட்டுதல் மட்டும் வழங்கும்; மருத்துவ தீர்மானத்தை மாற்றாது.',
        roleLogin: 'CareBridge கணக்கில் உள்நுழைக', roleRegister: 'புதிய போர்டல் பதிவு',
        selectRole: 'உங்கள் CareBridge அணுகல் பங்கைத் தேர்ந்தெடுக்கவும்', roleDescription: 'சிகிச்சை ஆலோசனை தேடும் நோயாளியா அல்லது பதிவு செய்த மருத்துவ நிபுணரா என்பதைத் தேர்ந்தெடுக்கவும்.',
        patientPortal: 'நோயாளர் போர்டல்', doctorPortal: 'மருத்துவர் போர்டல்', patientSignIn: 'நோயாளர் உள்நுழைவு', doctorSignIn: 'மருத்துவர் உள்நுழைவு',
        registerPatient: 'நோயாளியாக பதிவு செய்யுங்கள்', registerDoctor: 'மருத்துவராக பதிவு செய்யுங்கள்', demoPatient: 'டெமோ நோயாளர் உள்நுழைவு (பிரியா சுந்தரம்)',
        demoDoctor: 'டெமோ மருத்துவர் உள்நுழைவு (மருத்துவர் அருண் குமார் - சரிபார்க்கப்பட்டது)', securePortal: 'பாதுகாப்பான JWT & MySQL போர்டல்',
        backRole: 'பங்கு தேர்வு பக்கத்திற்குத் திரும்பு', emailAddress: 'மின்னஞ்சல் முகவரி', password: 'கடவுச்சொல்', phoneNumber: 'தொலைபேசி எண்',
        fullName: 'முழு பெயர்', patientRegistration: 'நோயாளர் பதிவு', doctorRegistration: 'மருத்துவர் பதிவு மற்றும் சான்று சரிபார்ப்பு',
        createPatientAccount: 'உங்கள் CareBridge Rural நோயாளர் கணக்கை உருவாக்குங்கள்',
        doctorVerificationIntro: 'CareBridge சரிபார்ப்புக்காக உங்கள் மருத்துவச் சான்றுகளைச் சமர்ப்பிக்கவும்',
        authFailed: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.', registrationFailed: 'பதிவு தோல்வியடைந்தது.', authenticating: 'சரிபார்க்கப்படுகிறது...',
        authenticatingDoctor: 'மருத்துவர் சரிபார்க்கப்படுகிறார்...', orQuickDemo: 'அல்லது விரைவு டெமோ', verifiedDemoDoctor: 'சரிபார்க்கப்பட்ட டெமோ மருத்துவர்',
        noAccountPatient: 'நோயாளர் கணக்கு இல்லையா?', registerHere: 'இங்கே பதிவு செய்யவும்',
        newDoctor: 'புதிய மருத்துவரா?', uploadCredentials: 'பதிவு செய்து சான்றுகளைப் பதிவேற்றுக',
        assistant: 'CareBridge உதவியாளர்', aiGuidance: 'AI வழிகாட்டுதல்', smartVoice: 'குரல் மற்றும் அறிகுறி வழிகாட்டுதல்',
        clearChat: 'உரையாடலை அழிக்கவும்', typePrompt: 'உங்கள் அறிகுறி அல்லது கேள்வியை உள்ளிடவும்...', listening: 'கேட்கிறது... பேசுங்கள்',
        requestingPermission: 'மைக்ரோஃபோன் அனுமதி கோரப்படுகிறது...', startVoice: 'குரல் உள்ளீட்டைத் தொடங்கவும்', stopListening: 'கேட்பதை நிறுத்தவும்',
        textFallback: 'இந்த உலாவியில் குரல் உள்ளீடு இல்லை. உரை மூலம் தொடரலாம்.',
        aiThinking: 'CareBridge உதவியாளர் யோசிக்கிறார்...', switchLanguage: 'மொழியை மாற்று',
        assistantDisclaimer: 'AI வழிகாட்டுதல் மட்டுமே. இது தகுதியான மருத்துவரை மாற்றாது.',
        listeningIn: '{{language}} மொழியில் கேட்கிறது... பேசுங்கள்', stopMicrophone: 'மைக்ரோஃபோனை நிறுத்து',
        ruralPatientPortal: 'கிராமப்புற நோயாளர் போர்டல்', goodMorning: 'காலை வணக்கம்', askAssistant: 'CareBridge உதவியாளரிடம் கேளுங்கள்',
        emergencySOS: 'அவசர SOS', aiAssistant: 'AI உதவியாளர்', voiceTextTriage: 'குரல் மற்றும் உரை வழிகாட்டுதல்',
        healthAssessment: 'சுகாதார மதிப்பீடு', multiStepCheck: 'பல படி பரிசோதனை', matchSpecialists: 'நிபுணர்களைக் கண்டறிதல்',
        consultationRoom: 'ஆலோசனை அறை', videoCall: 'WebRTC வீடியோ அழைப்பு', prescriptions: 'மருந்துச் சீட்டுகள்',
        downloadPdf: 'PDF பதிவிறக்கவும்', medicineDelivery: 'மருந்து விநியோகம்', doorstepOrder: 'வீட்டு விநியோக ஆர்டர்',
        myRecentVitals: 'எனது சமீபத்திய முக்கிய அறிகுறிகள் மற்றும் மதிப்பீடு', newHealthAssessment: 'புதிய சுகாதார மதிப்பீடு',
        spo2Level: 'SpO2 அளவு', pulseRate: 'நாடித் துடிப்பு', lowOxygen: 'குறைந்த ஆக்சிஜன்', elevated: 'அதிகரித்தது',
        temperature: 'வெப்பநிலை', bloodPressure: 'இரத்த அழுத்தம்', feverDetected: 'காய்ச்சல் கண்டறியப்பட்டது',
        preHypertension: 'முன் உயர் இரத்த அழுத்தம்', latestTriageAlert: 'சமீபத்திய AI மதிப்பீட்டு எச்சரிக்கை: சிவப்பு / அதிக முன்னுரிமை',
        respiratoryAlert: 'குறைந்த SpO2 உடன் சுவாச இறுக்கம். அவசர மருத்துவர் எச்சரிக்கையும் போக்குவரத்து ஏற்பாடும் செயலில் உள்ளன.',
        upcomingConsultation: 'வரவிருக்கும் ஆலோசனை மற்றும் மருந்துச் சீட்டு', active: 'செயலில்', assignedSpecialist: 'ஒதுக்கப்பட்ட நிபுணர்',
        joinSession: 'அமர்வில் சேருங்கள்', prescriptionReady: 'டிஜிட்டல் மருந்துச் சீட்டு தயார்', viewDownload: 'பார்க்கவும் மற்றும் பதிவிறக்கவும்',
        doorstepDelivery: 'வீட்டு விநியோகம்', trackCourier: 'கூரியரைப் பின்தொடரவும்',
        credentialsUnderVerification: 'உங்கள் சான்றுகள் சரிபார்க்கப்படுகின்றன.',
        pendingApproval: 'ஒப்புதல் நிலுவையில்',
        credentialsReview: 'பதிவின் போது சமர்ப்பிக்கப்பட்ட மருத்துவ கவுன்சில் பதிவு மற்றும் தகுதிச் சான்றுகள் CareBridge மருத்துவ நிர்வாகிகளால் பரிசீலிக்கப்படுகின்றன.',
        verifyDemo: 'மருத்துவர் சான்றுகளைச் சரிபார்க்கவும் (டெமோ நிர்வாகி)', verifying: 'சரிபார்க்கப்படுகிறது...',
        dutyStatus: 'பணி நிலை', onlineAccepting: 'ஆன்லைன் மற்றும் ஏற்கிறது', offline: 'ஆஃப்லைன்',
        criticalEmergencyAlert: 'முக்கியமான அவசர SOS எச்சரிக்கை', activeCases: 'செயலில் உள்ள வழக்குகள்',
        reviewPatient: 'நோயாளியைப் பார்த்து அனுப்பவும்', priorityQueue: 'நோயாளர் முன்னுரிமை வரிசை',
        patients: 'நோயாளிகள்', highRisk: 'அதிக ஆபத்து (சிவப்பு)', criticalCases: 'முக்கியமான வழக்குகள்',
        doctorStatus: 'மருத்துவர் நிலை', sortedQueue: 'ஆபத்து முன்னுரிமை மற்றும் காத்திருப்பு நேரப்படி வரிசைப்படுத்தப்பட்டது',
        noPatientsQueue: 'வரிசையில் நோயாளிகள் இல்லை.', findSpecialistDoctors: 'நிபுணர் மருத்துவர்களைக் கண்டறியவும்',
        doctorsAvailable: 'ஆலோசனைக்குக் கிடைக்கும் இணைக்கப்பட்ட தொலைமருத்துவர்கள்',
        searchDoctors: 'மருத்துவர் பெயர், நிபுணத்துவம் அல்லது நிலை மூலம் தேடவும்...', hospital: 'மருத்துவமனை',
        experience: 'அனுபவம்', years: 'ஆண்டுகள்', languages: 'மொழிகள்', waitingQueue: 'காத்திருப்பு வரிசை',
        startTeleConsultation: 'தொலை ஆலோசனையைத் தொடங்கவும்', digitalPrescriptions: 'டிஜிட்டல் மருந்துச் சீட்டுகள்',
        verifiedPrescriptions: 'சரிபார்க்கப்பட்ட மருத்துவர் மருந்துச் சீட்டுகள் மற்றும் அச்சிடக்கூடிய PDF பதிவுகள்',
        noPrescriptions: 'மருந்துச் சீட்டுகள் இன்னும் இல்லை',
        completeConsultation: 'டிஜிட்டல் மருந்துச் சீட்டைப் பெற மருத்துவர் ஆலோசனையை முடிக்கவும்.',
        orderMedicine: 'மருந்தை வீட்டிற்கு ஆர்டர் செய்யவும்', patient: 'நோயாளர்', diagnosis: 'நோயறிதல்',
        validUntil: 'செல்லுபடியாகும் தேதி', prescribedMedications: 'பரிந்துரைக்கப்பட்ட மருந்துகள்', medicine: 'மருந்து',
        dosage: 'அளவு', frequency: 'அடிக்கடி', duration: 'காலம்', instructions: 'வழிமுறைகள்', asDirected: 'வழிகாட்டியபடி',
        sosRaised: 'SOS எழுப்பப்பட்டது', doctorConnected: 'மருத்துவர் இணைக்கப்பட்டார்', hospitalNotified: 'மருத்துவமனைக்கு தெரிவிக்கப்பட்டது',
        ambulanceDispatched: 'ஆம்புலன்ஸ் அனுப்பப்பட்டது', bedReserved: 'படுக்கை ஒதுக்கப்பட்டது', patientArrived: 'நோயாளர் வந்தார்',
        activeEmergencyCase: 'செயலில் உள்ள அவசர வழக்கு', location: 'இடம்', ambulanceEta: 'ஆம்புலன்ஸ் வருகை நேரம்',
        minutes: 'நிமிடங்கள்', advanceEmergencyWorkflow: 'அவசர செயல்முறையை முன்னேற்றவும்',
        emergencySosRequest: 'அவசர SOS கோரிக்கை', emergencyPipeline: 'CareBridge Rural அவசர பதிலளிப்பு செயல்முறை',
        sosActiveCase: 'SOS செயலில் உள்ளது — வழக்கு', emergencyAlerted: 'அவசர பதிலளிப்பு தொடர்புகள் எச்சரிக்கப்பட்டுள்ளன.',
        noVerifiedRecipients: 'சரிபார்க்கப்பட்ட SMS பெறுநர்கள் இல்லை.',
        smsTo: 'SMS பெறுநர்', trackEmergency: 'முகப்புப் பலகையில் அவசர நிலையைப் பின்தொடரவும்',
        hospitalHandoff: 'மருத்துவமனை ஒப்படைப்பு மற்றும் போக்குவரத்து அனுப்பப்பட்டது', inProgress: 'செயலில் உள்ளது',
        submitSos: 'அவசர SOS சமர்ப்பிக்கவும்', symptoms: 'அறிகுறிகள்', availableLocation: 'கிடைக்கும் இடம்'
    }
};

interface I18nContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { role } = useAuth();
    const storageKey = role ? `carebridge_language_${role}` : 'carebridge_language_public';
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('carebridge_language_public');
        return saved === 'ta' ? 'ta' : 'en';
    });

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        setLanguageState(saved === 'ta' ? 'ta' : 'en');
    }, [storageKey]);

    const setLanguage = (next: Language) => {
        setLanguageState(next);
        localStorage.setItem(storageKey, next);
    };

    const value = useMemo(() => ({
        language,
        setLanguage,
        t: (key: string, values: Record<string, string | number> = {}) => {
            const entry = translations[language][key] ?? translations.en[key] ?? key;
            if (typeof entry === 'function') return entry(values);
            return Object.entries(values).reduce((text, [name, value]) => text.replace(`{{${name}}}`, String(value)), entry);
        }
    }), [language, storageKey]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used inside I18nProvider');
    return context;
};
