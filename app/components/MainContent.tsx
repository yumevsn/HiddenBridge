'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from 'react-hot-toast'

export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 md:top-8 md:right-8">
        <ThemeToggle />
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        {children}
      </main>
      <Toaster />
    </>
  )
}

