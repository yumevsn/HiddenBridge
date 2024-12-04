import Peer from 'simple-peer'
import { io, Socket } from 'socket.io-client'

export function initializeWebRTC(roomId: string, stream: MediaStream, isInitiator: boolean) {
  const socket = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER || 'http://localhost:3001')
  
  const peer = new Peer({
    initiator: isInitiator,
    stream: stream,
    trickle: false,
  })

  socket.on('connect', () => {
    socket.emit('join-room', roomId)
  })

  socket.on('user-connected', () => {
    // The other user has joined the room
    console.log('Peer connected')
  })

  socket.on('user-disconnected', () => {
    // The other user has left the room
    console.log('Peer disconnected')
  })

  peer.on('signal', (data) => {
    socket.emit('signal', { roomId, signal: data })
  })

  socket.on('signal', (data) => {
    peer.signal(data.signal)
  })

  return { peer, socket }
}

