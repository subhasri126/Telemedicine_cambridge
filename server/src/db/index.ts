import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'carebridge_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00'
});

export async function testDbConnection() {
    try {
        const connection = await dbPool.getConnection();
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Failed to connect to MySQL database:', error);
        return false;
    }

}

export async function ensureEmergencySmsTables() {
    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS emergency_sms_messages (
            id VARCHAR(64) PRIMARY KEY,
            emergency_case_id VARCHAR(64) NOT NULL,
            recipient_role ENUM('emergency_contact', 'hospital') NOT NULL,
            recipient_phone VARCHAR(32) NOT NULL,
            message TEXT NOT NULL,
            provider VARCHAR(32) NOT NULL,
            provider_message_id VARCHAR(128),
            status ENUM('pending', 'submitted', 'failed', 'delivered') NOT NULL DEFAULT 'pending',
            failure_reason VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_emergency_sms_case (emergency_case_id),
            INDEX idx_emergency_sms_provider_id (provider_message_id)
        )
    `);

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS emergency_sms_replies (
            id VARCHAR(64) PRIMARY KEY,
            emergency_case_id VARCHAR(64) NOT NULL,
            sender_phone VARCHAR(32) NOT NULL,
            message TEXT NOT NULL,
            provider_message_id VARCHAR(128),
            received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_emergency_sms_replies_case (emergency_case_id)
        )
    `);
}
