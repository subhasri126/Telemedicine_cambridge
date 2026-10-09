import React, { useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';

interface TestResult {
    caseNumber?: string;
    error?: string;
    smsMode?: string;
    notificationStatus?: string;
    realSmsSent?: boolean;
    duplicateAlertPrevented?: boolean;
    sms?: Array<{ recipientRole: string; status: string; reason?: string; simulated?: boolean }>;
}

export const SmsDevelopmentTestPage: React.FC = () => {
    const { patientData } = useAuth();
    const [result, setResult] = useState<TestResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const runTest = async () => {
        setIsRunning(true);
        setResult(null);
        try {
            const payload = {
                location: patientData?.location || 'Development test location',
                symptoms: ['Development test symptom'],
                vitals: { spo2Percentage: 98, heartRateBpm: 72 }
            };
            const first = await apiRequest<TestResult & { id: string }>('/emergency/sos', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            let duplicateAlertPrevented = false;
            try {
                await apiRequest('/emergency/sos', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            } catch (error) {
                duplicateAlertPrevented = error instanceof Error && (
                    error.message.includes('active emergency') ||
                    error.message.includes('wait before')
                );
            }
            setResult({ ...first, duplicateAlertPrevented });
        } catch (error) {
            setResult({ error: error instanceof Error ? error.message : 'SMS development test failed.' });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-medical">
                <h1 className="text-2xl font-extrabold text-slate-900">SMS Development Test</h1>
                <p className="mt-2 text-sm text-slate-600">
                    This test uses the existing authenticated SOS flow. Demo mode never contacts an SMS provider.
                </p>
                <button
                    onClick={runTest}
                    disabled={isRunning}
                    className="mt-6 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                    {isRunning ? 'Running test...' : 'Create test emergency and check duplicate prevention'}
                </button>

                {result && (
                    <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
                        {result.error ? (
                            <p className="font-semibold text-rose-700">{result.error}</p>
                        ) : (
                            <>
                                <p><strong>Emergency case ID:</strong> {result.caseNumber || 'Unavailable'}</p>
                                <p><strong>SMS mode:</strong> {result.smsMode}</p>
                                <p><strong>Notification status:</strong> {result.notificationStatus}</p>
                                <p><strong>Real SMS sent:</strong> {result.realSmsSent ? 'Yes' : 'No'}</p>
                                <p><strong>Duplicate alert prevented:</strong> {result.duplicateAlertPrevented ? 'Yes' : 'No'}</p>
                                {result.sms?.map((sms) => (
                                    <p key={sms.recipientRole}>
                                        <strong>{sms.recipientRole}:</strong> {sms.status}
                                        {sms.simulated ? ' — SIMULATED — no real SMS sent' : ''}
                                        {sms.reason ? ` — ${sms.reason}` : ''}
                                    </p>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
