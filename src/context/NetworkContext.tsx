import React, { createContext, useContext, useState } from 'react';
import { BandwidthMode } from '../types';

interface NetworkContextType {
    bandwidthMode: BandwidthMode;
    setBandwidthMode: (mode: BandwidthMode) => void;
    getRecommendedConsultationMode: () => 'video' | 'audio' | 'chat';
    latencyMs: number;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bandwidthMode, setBandwidthMode] = useState<BandwidthMode>('Good');

    const getRecommendedConsultationMode = (): 'video' | 'audio' | 'chat' => {
        switch (bandwidthMode) {
            case 'Excellent':
            case 'Good':
                return 'video';
            case 'Fair':
            case 'Poor':
                return 'audio';
            case 'Offline':
                return 'chat';
            default:
                return 'video';
        }
    };

    const latencyMsMap: Record<BandwidthMode, number> = {
        Excellent: 24,
        Good: 65,
        Fair: 210,
        Poor: 680,
        Offline: 9999,
    };

    return (
        <NetworkContext.Provider
            value={{
                bandwidthMode,
                setBandwidthMode,
                getRecommendedConsultationMode,
                latencyMs: latencyMsMap[bandwidthMode],
            }}
        >
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (!context) {
        throw new Error('useNetwork must be used within a NetworkProvider');
    }
    return context;
};
