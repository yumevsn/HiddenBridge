import { Server } from 'socket.io'
import { createServer } from 'http'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', socket.id)
  })

  socket.on('signal', ({ roomId, signal }) => {
    socket.to(roomId).emit('signal', signal)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`)
})

