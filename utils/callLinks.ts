import { encrypt, decrypt } from './encryption'

const LINK_EXPIRY_TIME = 24 * 60 * 60 * 1000 // 24 hours

export function generateCallLink(callType: 'voice' | 'video'): string {
  const linkData = {
    type: callType,
    createdAt: Date.now(),
    id: Math.random().toString(36).substring(7)
  }
  const encryptedData = encrypt(JSON.stringify(linkData))
  return `${process.env.NEXT_PUBLIC_BASE_URL}/join/${encodeURIComponent(encryptedData)}`
}

export function validateCallLink(encryptedData: string): { isValid: boolean; callType?: 'voice' | 'video'; roomId?: string } {
  try {
    const decryptedData = JSON.parse(decrypt(decodeURIComponent(encryptedData)))
    const now = Date.now()
    if (now - decryptedData.createdAt > LINK_EXPIRY_TIME) {
      return { isValid: false }
    }
    return { isValid: true, callType: decryptedData.type, roomId: decryptedData.id }
  } catch (error) {
    return { isValid: false }
  }
}

