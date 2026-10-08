import React, { createContext, useContext, useState, useEffect } from 'react';
import { CareJourneyState } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';

interface CareJourneyContextType {
    journey: CareJourneyState;
    updateStage: (stage: keyof CareJourneyState, status: 'completed' | 'active' | 'pending') => void;
    resetJourney: () => void;
}

const DEFAULT_JOURNEY: CareJourneyState = {
    healthAssessment: 'completed',
    doctorConsultation: 'active',
    treatmentDecision: 'pending',
    prescription: 'pending',
    medicineDelivery: 'pending',
    followup: 'pending'
};

const CareJourneyContext = createContext<CareJourneyContextType | undefined>(undefined);

export const CareJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [journey, setJourney] = useState<CareJourneyState>(DEFAULT_JOURNEY);

    useEffect(() => {
        const loadJourney = () => {
            const db = getLocalDB();
            if (db.careJourneys && db.careJourneys.length > 0) {
                setJourney(db.careJourneys[0]);
            } else {
                setJourney(DEFAULT_JOURNEY);
            }
        };

        loadJourney();
        window.addEventListener('carebridge_db_updated', loadJourney);
        return () => window.removeEventListener('carebridge_db_updated', loadJourney);
    }, []);

    const updateStage = (stage: keyof CareJourneyState, status: 'completed' | 'active' | 'pending') => {
        setJourney((prev) => {
            const updated = { ...prev, [stage]: status };
            const db = getLocalDB();
            db.careJourneys = [updated];
            saveLocalDB(db);
            return updated;
        });
    };

    const resetJourney = () => {
        setJourney(DEFAULT_JOURNEY);
        const db = getLocalDB();
        db.careJourneys = [DEFAULT_JOURNEY];
        saveLocalDB(db);
    };

    return (
        <CareJourneyContext.Provider value={{ journey, updateStage, resetJourney }}>
            {children}
        </CareJourneyContext.Provider>
    );
};

export const useCareJourney = () => {
    const context = useContext(CareJourneyContext);
    if (!context) {
        throw new Error('useCareJourney must be used within a CareJourneyProvider');
    }
    return context;
};
