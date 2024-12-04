'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function JoinCall() {
  const params = useParams()
  const router = useRouter()
  const { type, id } = params

  const joinCall = () => {
    router.push(`/call/room/${type}/${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join {type} Call</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center mb-4">You've been invited to join a {type} call</p>
          <Button onClick={joinCall} className="w-full">Join Call</Button>
          <div className="h-4"></div>
          <Link href="/">
            <Button variant="outline" className="w-full">Cancel</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

