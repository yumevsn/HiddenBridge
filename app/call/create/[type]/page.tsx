'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CreateCall() {
  const [callId, setCallId] = useState('')
  const params = useParams()
  const router = useRouter()
  const callType = params.type as string

  useEffect(() => {
    // Generate a random room ID
    setCallId(Math.random().toString(36).substring(7))
  }, [])

  const copyLink = () => {
    const link = `${window.location.origin}/call/room/${callType}/${callId}?initiator=false`
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard!')
  }

  const startCall = () => {
    router.push(`/call/room/${callType}/${callId}?initiator=true`)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative py-3">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 dark:from-cyan-600 dark:to-sky-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <Card className="relative bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl">
          <CardHeader>
            <CardTitle>Create {callType} Call</CardTitle>
            <CardDescription>Share this link with your penpal to start the call</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              value={`${window.location.origin}/call/room/${callType}/${callId}?initiator=false`} 
              readOnly 
              className="bg-gray-100 dark:bg-gray-700"
            />
            <Button onClick={copyLink} className="w-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800">Copy Link</Button>
            <Button onClick={startCall} className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700">Start Call</Button>
            <div className="h-4"></div>
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

