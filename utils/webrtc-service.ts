import Peer from 'simple-peer'
import { io, Socket } from 'socket.io-client'
import { webRTCConfig } from './webrtc-config'

export class WebRTCService {
  private peer: Peer.Instance | null = null
  private socket: Socket | null = null
  private stream: MediaStream | null = null

  constructor(
    private roomId: string,
    private isInitiator: boolean,
    private onStream: (stream: MediaStream) => void,
    private onConnected: () => void,
    private onDisconnected: () => void
  ) {}

  async initialize() {
    try {
      // Connect to signaling server
      this.socket = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER || 'https://your-signaling-server.com')
      
      // Join room
      this.socket.emit('join-room', this.roomId)

      // Handle socket events
      this.setupSocketListeners()

      return true
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error)
      return false
    }
  }

  async startCall(videoEnabled: boolean) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: true
      })

      this.peer = new Peer({
        initiator: this.isInitiator,
        stream: this.stream,
        config: webRTCConfig,
        trickle: false
      })

      this.setupPeerListeners()

      return this.stream
    } catch (error) {
      console.error('Failed to start call:', error)
      throw error
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return

    this.socket.on('user-connected', () => {
      this.onConnected()
    })

    this.socket.on('user-disconnected', () => {
      this.onDisconnected()
    })

    this.socket.on('signal', (data: any) => {
      this.peer?.signal(data)
    })
  }

  private setupPeerListeners() {
    if (!this.peer || !this.socket) return

    this.peer.on('signal', (data: any) => {
      this.socket?.emit('signal', { roomId: this.roomId, signal: data })
    })

    this.peer.on('stream', (stream: MediaStream) => {
      this.onStream(stream)
    })

    this.peer.on('error', (err: any) => {
      console.error('Peer error:', err)
      this.onDisconnected()
    })
  }

  toggleAudio(enabled: boolean) {
    this.stream?.getAudioTracks().forEach(track => {
      track.enabled = enabled
    })
  }

  toggleVideo(enabled: boolean) {
    this.stream?.getVideoTracks().forEach(track => {
      track.enabled = enabled
    })
  }

  disconnect() {
    this.stream?.getTracks().forEach(track => track.stop())
    this.peer?.destroy()
    this.socket?.disconnect()
  }
}

