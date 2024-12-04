export const config = {
  appName: 'HiddenBridge',
  description: 'Anonymous and secure voice & video calls',
  // Automatically use the deployment URL or fallback to localhost
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  // Default STUN servers (for development)
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
      ],
    },
  ],
}

