import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app';


const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;

let activeSessions = 0;

io.on('connection', (socket) => {

  activeSessions++;

  io.emit('activeSessions', activeSessions);

  socket.on('disconnect', () => {
    activeSessions--;
    io.emit('activeSessions', activeSessions);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});