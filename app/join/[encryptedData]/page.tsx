'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { validateCallLink } from '@/utils/callLinks'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function JoinCall() {
  const params = useParams()
  const router = useRouter()
  const encryptedData = params.encryptedData as string

  useEffect(() => {
    const { isValid, callType, roomId } = validateCallLink(encryptedData)
    if (!isValid) {
      alert('This call link has expired or is invalid.')
      router.push('/')
    } else if (callType && roomId) {
      router.push(`/call/${callType}/${roomId}`)
    }
  }, [encryptedData, router])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Joining Call</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Validating call link...</p>
          <Button onClick={() => router.push('/')} variant="outline" className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

