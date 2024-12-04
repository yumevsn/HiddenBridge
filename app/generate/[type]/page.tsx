'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generateCallLink } from '@/utils/callLinks'

export default function GenerateLink() {
  const [link, setLink] = useState('')
  const params = useParams()
  const router = useRouter()
  const callType = params.type as 'voice' | 'video'

  useEffect(() => {
    setLink(generateCallLink(callType))
  }, [callType])

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard!')
  }

  const startCall = () => {
    router.push(link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your {callType} Call Link</CardTitle>
          <CardDescription>Share this link with your penpal to start the call. The link will expire in 24 hours.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={link} readOnly className="bg-gray-100 dark:bg-gray-700" />
          <Button onClick={copyLink} className="w-full">Copy Link</Button>
          <Button onClick={startCall} className="w-full">Start Call</Button>
          <div className="h-4"></div>
          <Link href="/">
            <Button variant="outline" className="w-full">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

