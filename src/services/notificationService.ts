import { AppNotification } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';

export function getNotifications(role: 'patient' | 'doctor', userId?: string): AppNotification[] {
    const db = getLocalDB();
    const list: AppNotification[] = db.notifications || [];
    return list.filter((n) => n.recipientRole === role || n.recipientRole === 'all' || n.userId === userId);
}

export function markNotificationRead(id: string) {
    const db = getLocalDB();
    const target = db.notifications.find((n: AppNotification) => n.id === id);
    if (target) {
        target.read = true;
        saveLocalDB(db);
    }
}
