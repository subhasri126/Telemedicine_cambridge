import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createMedicineOrder, getMedicineOrders, updateOrderStatus } from '../../services/medicineService';
import { getPrescriptions } from '../../services/prescriptionService';
import { MedicineOrder, Prescription } from '../../types';
import { Truck, CheckCircle2, MapPin, Clock, ShieldCheck, Pill, ArrowRight } from 'lucide-react';

export const PharmacyPage: React.FC = () => {
    const { patientData } = useAuth();

    const [orders, setOrders] = useState<MedicineOrder[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState('Kollumangudi Express Rural Pharmacy');
    const [deliveryAddress, setDeliveryAddress] = useState(patientData?.location || 'House No. 42, Main Road, Kollumangudi Village');
    const [isPlacing, setIsPlacing] = useState(false);

    useEffect(() => {
        const loadOrders = () => {
            const list = getMedicineOrders(patientData?.id);
            setOrders(list);
            const rxList = getPrescriptions(patientData?.id);
            setPrescriptions(rxList);
        };

        loadOrders();
        window.addEventListener('carebridge_db_updated', loadOrders);
        return () => window.removeEventListener('carebridge_db_updated', loadOrders);
    }, [patientData?.id]);

    const activeRx = prescriptions[0];

    const handlePlaceOrder = () => {
        setIsPlacing(true);
        setTimeout(() => {
            createMedicineOrder({
                prescriptionId: activeRx?.id || 'rx-01',
                patientId: patientData?.id || 'patient-priya-01',
                patientName: patientData?.fullName || 'Priya Sundaram',
                pharmacyName: selectedPharmacy,
                deliveryAddress,
                items: activeRx?.items || [
                    { medicineName: 'Salbutamol Nebulizer Respules', dosage: '2.5ml', frequency: '8 Hourly', duration: '3 Days' },
                    { medicineName: 'Prednisolone 40mg', dosage: '40mg', frequency: 'Once Daily', duration: '5 Days' }
                ],
                totalAmount: 180.00
            });
            setIsPlacing(false);
        }, 600);
    };

    const handleAdvanceOrder = (orderId: string, currentStatus: string) => {
        const nextMap: Record<string, any> = {
            'Requested': 'Confirmed',
            'Confirmed': 'Out for Delivery',
            'Out for Delivery': 'Delivered'
        };
        if (nextMap[currentStatus]) {
            updateOrderStatus(orderId, nextMap[currentStatus]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900">Doorstep Medicine Delivery</h1>
                            <p className="text-xs text-slate-500">Rural health worker & express pharmacy courier service</p>
                        </div>
                    </div>
                </div>

                {/* Place Order Box */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                        <h2 className="font-extrabold text-base text-slate-900">Request Doorstep Delivery for Active Prescription</h2>
                        <p className="text-xs text-slate-500">Select local pharmacy partner and confirm village drop address.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                            <label className="font-bold text-slate-700">Select Pharmacy Unit:</label>
                            <select
                                value={selectedPharmacy}
                                onChange={(e) => setSelectedPharmacy(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="Kollumangudi Express Rural Pharmacy">Kollumangudi Express Rural Pharmacy (In Stock • 2.4 km)</option>
                                <option value="District Central Mission Pharmacy">District Central Mission Pharmacy (In Stock • 8.1 km)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-bold text-slate-700">Delivery Address:</label>
                            <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isPlacing}
                        className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <Truck className="w-4 h-4" />
                        <span>{isPlacing ? 'Placing Order...' : 'Request Doorstep Delivery'}</span>
                    </button>
                </div>

                {/* Existing Delivery Orders List */}
                <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-slate-900">Active Delivery Trackers</h3>

                    {orders.map((order) => {
                        const steps = ['Requested', 'Confirmed', 'Out for Delivery', 'Delivered'];
                        const currentIdx = steps.indexOf(order.status);

                        return (
                            <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-medical space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-sm text-slate-900">Order #{order.id.toUpperCase()}</span>
                                            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">{order.pharmacyName} • {order.deliveryAddress}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-slate-700 block">ETA: {order.estimatedDelivery}</span>
                                        <button
                                            onClick={() => handleAdvanceOrder(order.id, order.status)}
                                            className="text-[11px] text-amber-700 font-bold hover:underline mt-0.5"
                                        >
                                            Advance Status →
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Steps */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                                    {steps.map((st, i) => (
                                        <div
                                            key={st}
                                            className={`p-3 rounded-2xl border text-center text-xs font-bold ${i <= currentIdx
                                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center mb-1 text-[10px] ${i <= currentIdx ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <span>{st}</span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
