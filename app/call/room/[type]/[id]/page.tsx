"use client"

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Phone } from 'lucide-react'
import { WebRTCService } from '@/utils/webrtc-service'
import { toast } from 'react-hot-toast'
import { CallJoinPopup } from '@/components/CallJoinPopup'
import MainContent from '@/app/components/MainContent'

export default function CallRoom() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isCallStarted, setIsCallStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoudSpeaker, setIsLoudSpeaker] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showJoinPopup, setShowJoinPopup] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const waitingAudioRef = useRef<HTMLAudioElement>(null)
  const callStartAudioRef = useRef<HTMLAudioElement>(null)
  const callEndAudioRef = useRef<HTMLAudioElement>(null)
  const params = useParams()
  const router = useRouter()
  const { type, id: roomId } = params

  useEffect(() => {
    const isInitiator = !window.location.search.includes('join=true')
    if (!isInitiator) {
      setShowJoinPopup(true)
    } else {
      startCall()
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCallStarted) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isCallStarted])

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

      const webRTC = new WebRTCService(
        roomId as string,
        !window.location.search.includes('join=true'),
        (remoteStream) => {
          setRemoteStream(remoteStream)
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
          setIsCallStarted(true)
          playSound(callStartAudioRef)
        },
        () => {
          setIsCallStarted(true)
          toast.success('Peer connected')
          playSound(callStartAudioRef)
        },
        () => {
          setIsCallStarted(false)
          toast.error('Peer disconnected')
          playSound(callEndAudioRef)
        }
      )

      await webRTC.initialize()
      await webRTC.startCall(type === 'video')

      if (!isCallStarted) {
        playSound(waitingAudioRef, true)
      }

      return () => {
        stream.getTracks().forEach(track => track.stop())
        webRTC.disconnect()
        stopSound(waitingAudioRef)
      }
    } catch (err) {
      console.error('Failed to start call:', err)
      toast.error('Failed to access camera/microphone')
    }
  }

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

  const toggleLoudSpeaker = () => {
    setIsLoudSpeaker(!isLoudSpeaker)
    if (remoteVideoRef.current) {
      remoteVideoRef.current.volume = isLoudSpeaker ? 1 : 0.5
    }
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    playSound(callEndAudioRef)
    router.push('/')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>, loop: boolean = false) => {
    if (audioRef.current) {
      audioRef.current.loop = loop
      audioRef.current.play()
    }
  }

  const stopSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <MainContent>
      {showJoinPopup && (
        <CallJoinPopup 
          onAccept={() => {
            setShowJoinPopup(false)
            startCall()
          }} 
          onReject={() => router.push('/')}
        />
      )}
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative py-3">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 dark:from-cyan-600 dark:to-sky-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <Card className="relative bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl overflow-hidden">
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-2xl font-semibold text-foreground mb-2 md:mb-0">
                  {type === 'video' ? 'Video' : 'Voice'} Call
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">
                    {isCallStarted ? formatTime(callDuration) : 'Waiting...'}
                  </span>
                  <span className="text-xs text-green-500">End-to-end encrypted</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                  {type === 'video' && (
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">
                    You
                  </div>
                </div>
                <div className="aspect-video bg-muted relative rounded-lg overflow-hidden flex items-center justify-center">
                  {isCallStarted ? (
                    type === 'video' ? (
                      <video 
                        ref={remoteVideoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl text-muted-foreground">Voice Call Connected</span>
                    )
                  ) : (
                    <span className="text-xl text-muted-foreground">Waiting for peer to join...</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleMute}
                  className="min-w-[120px]"
                >
                  {isMuted ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                
                {type === 'video' && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={toggleVideo}
                    className="min-w-[120px]"
                  >
                    {isVideoOff ? <VideoOff className="mr-2 h-5 w-5" /> : <Video className="mr-2 h-5 w-5" />}
                    {isVideoOff ? 'Show Video' : 'Hide Video'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleLoudSpeaker}
                  className="min-w-[120px]"
                >
                  {isLoudSpeaker ? <Volume2 className="mr-2 h-5 w-5" /> : <VolumeX className="mr-2 h-5 w-5" />}
                  {isLoudSpeaker ? 'Speaker Off' : 'Speaker On'}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="min-w-[120px]"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  End Call
                </Button>
              </div>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <audio ref={waitingAudioRef} src="/sounds/waiting.mp3" />
      <audio ref={callStartAudioRef} src="/sounds/call-start.mp3" />
      <audio ref={callEndAudioRef} src="/sounds/call-end.mp3" />
    </MainContent>
  )
}

