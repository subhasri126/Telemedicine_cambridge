import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: true,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('⚡ Socket.IO client connected:', socket?.id);
        });

        socket.on('disconnect', () => {
            console.log('⚡ Socket.IO client disconnected');
        });
    }
    return socket;
}

export function joinRoom(roomId: string) {
    const s = getSocket();
    s.emit('join_room', roomId);
}

export function leaveRoom(roomId: string) {
    const s = getSocket();
    s.emit('leave_room', roomId);
}
