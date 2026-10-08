import { MedicineOrder, OrderStatus, Prescription } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';

export interface CreateOrderInput {
    prescriptionId: string;
    patientId: string;
    patientName: string;
    pharmacyName: string;
    deliveryAddress: string;
    items: any[];
    totalAmount: number;
}

export function createMedicineOrder(input: CreateOrderInput): MedicineOrder {
    const db = getLocalDB();

    const newOrder: MedicineOrder = {
        id: `order-${Date.now()}`,
        prescriptionId: input.prescriptionId,
        patientId: input.patientId,
        patientName: input.patientName,
        pharmacyName: input.pharmacyName,
        deliveryAddress: input.deliveryAddress,
        items: input.items,
        totalAmount: input.totalAmount,
        status: 'Confirmed',
        estimatedDelivery: 'Today by 5:00 PM (Express Village Courier)',
        createdAt: new Date().toISOString()
    };

    db.medicineOrders.unshift(newOrder);

    // Update Care Journey
    if (db.careJourneys && db.careJourneys.length > 0) {
        db.careJourneys[0].medicineDelivery = 'active';
    }

    // Add Notification
    db.notifications.unshift({
        id: `notif-med-${Date.now()}`,
        recipientRole: 'patient',
        userId: input.patientId,
        title: 'Medicine Delivery Request Confirmed',
        message: `Your prescription medicines from ${input.pharmacyName} are out for express delivery to ${input.deliveryAddress}.`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString()
    });

    saveLocalDB(db);
    return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus): MedicineOrder | null {
    const db = getLocalDB();
    const order = db.medicineOrders.find((o: MedicineOrder) => o.id === orderId);
    if (!order) return null;

    order.status = newStatus;

    if (newStatus === 'Delivered') {
        if (db.careJourneys && db.careJourneys.length > 0) {
            db.careJourneys[0].medicineDelivery = 'completed';
            db.careJourneys[0].followup = 'active';
        }
    }

    saveLocalDB(db);
    return order;
}

export function getMedicineOrders(patientId?: string): MedicineOrder[] {
    const db = getLocalDB();
    if (patientId) {
        return db.medicineOrders.filter((m: MedicineOrder) => m.patientId === patientId);
    }
    return db.medicineOrders || [];
}
