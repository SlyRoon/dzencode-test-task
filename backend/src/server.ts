import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app'; 

const httpServer = createServer(app);


const io = new Server(httpServer, { 
    path: "/api/socket.io", 
    cors: { origin: '*' } 
});

let activeSessions = 0;

io.on('connection', (socket) => {
    activeSessions++;
    io.emit('activeSessions', activeSessions);

    socket.on('disconnect', () => {
        activeSessions--;
        io.emit('activeSessions', activeSessions);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});