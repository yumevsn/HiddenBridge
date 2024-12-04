'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { initializeWebRTC } from '@/utils/webrtc'
import Link from 'next/link'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

export default function Call() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isCallStarted, setIsCallStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const params = useParams()
  const router = useRouter()
  const { type, id: roomId } = params

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCallStarted) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isCallStarted])

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: type === 'video', 
          audio: true 
        })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        const { peer, socket } = initializeWebRTC(roomId as string, stream, window.location.hash === '#init')

        peer.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream)
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
          setIsCallStarted(true)
        })

        return () => {
          stream.getTracks().forEach(track => track.stop())
          peer.destroy()
          socket.disconnect()
        }
      } catch (err) {
        console.error('Failed to start call:', err)
      }
    }

    startCall()
  }, [type, roomId])

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream && type === 'video') {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    router.push('/')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{type === 'video' ? 'Video' : 'Voice'} Call</span>
            <span>{isCallStarted ? formatTime(callDuration) : 'Waiting for peer...'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-video bg-gray-200 relative">
              {type === 'video' && (
                <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-1 text-sm">You</div>
            </div>
            <div className="aspect-video bg-gray-200 relative">
              {isCallStarted ? (
                type === 'video' ? (
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl">Voice Call Connected</span>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl">Waiting for peer to join...</span>
                </div>
              )}
              {isCallStarted && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-1 text-sm">Peer</div>
              )}
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={toggleMute}>
              {isMuted ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            {type === 'video' && (
              <Button onClick={toggleVideo}>
                {isVideoOff ? <VideoOff className="mr-2" /> : <Video className="mr-2" />}
                {isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              </Button>
            )}
            <Button onClick={endCall} variant="destructive">End Call</Button>
          </div>
          <div className="h-4"></div>
          <Link href="/">
            <Button variant="outline" className="w-full">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

