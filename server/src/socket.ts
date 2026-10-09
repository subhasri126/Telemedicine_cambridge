import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

export function setupSocketIO(server: HTTPServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    console.log('⚡ Socket.IO signaling & chat server initialized');

    io.on('connection', (socket: Socket) => {
        console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

        // Join room (e.g. CBR-ROOM-82931 or conversation_id)
        socket.on('join_room', (roomId: string) => {
            socket.join(roomId);
            console.log(`👤 Socket ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit('user_joined', { socketId: socket.id });
        });

        // Leave room
        socket.on('leave_room', (roomId: string) => {
            socket.leave(roomId);
            console.log(`👤 Socket ${socket.id} left room ${roomId}`);
        });

        // Real-time Chat
        socket.on('send_message', (data: { conversationId: string; senderId: string; receiverId: string; message: string; timestamp?: string }) => {
            io.to(data.conversationId).emit('receive_message', {
                ...data,
                id: `msg-${Date.now()}`,
                sentAt: data.timestamp || new Date().toISOString()
            });
        });

        socket.on('typing_status', (data: { conversationId: string; userId: string; isTyping: boolean }) => {
            socket.to(data.conversationId).emit('user_typing', data);
        });

        // WebRTC Signaling
        socket.on('call_user', (data: { roomId: string; callerId: string; callerName: string; mode: 'video' | 'audio' }) => {
            console.log(`📞 Incoming call in room ${data.roomId} from ${data.callerName}`);
            socket.to(data.roomId).emit('incoming_call', data);
        });

        socket.on('accept_call', (data: { roomId: string; doctorId: string; doctorName: string }) => {
            console.log(`✅ Call accepted in room ${data.roomId} by ${data.doctorName}`);
            io.to(data.roomId).emit('call_accepted', data);
        });

        socket.on('webrtc_offer', (data: { roomId: string; offer: any }) => {
            socket.to(data.roomId).emit('webrtc_offer', { offer: data.offer, from: socket.id });
        });

        socket.on('webrtc_answer', (data: { roomId: string; answer: any }) => {
            socket.to(data.roomId).emit('webrtc_answer', { answer: data.answer, from: socket.id });
        });

        socket.on('webrtc_ice_candidate', (data: { roomId: string; candidate: any }) => {
            socket.to(data.roomId).emit('webrtc_ice_candidate', { candidate: data.candidate, from: socket.id });
        });

        socket.on('end_call', (data: { roomId: string }) => {
            io.to(data.roomId).emit('call_ended', { roomId: data.roomId });
        });

        // SOS Broadcast to all online doctors
        socket.on('emergency_sos_broadcast', (emergencyData: any) => {
            console.log(`🚨 SOS Emergency Alert Broadcast:`, emergencyData.caseNumber);
            io.emit('emergency_alert_received', emergencyData);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });

    return io;
}
