import MainContent from './components/MainContent'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <MainContent>
      <div className="w-full max-w-md mx-auto text-center">
        <div className="relative py-3">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 dark:from-cyan-600 dark:to-sky-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">HiddenBridge</h1>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Connect anonymously and securely with your penpals.</p>
            <ul className="list-disc text-left space-y-2 mb-8 text-gray-700 dark:text-gray-300">
              <li>No accounts required</li>
              <li>End-to-end encrypted calls</li>
              <li>Temporary, one-time use links</li>
              <li>Voice and video call options</li>
            </ul>
            <div className="space-y-4">
              <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                <Link href="/call/create/voice">Start Voice Call</Link>
              </Button>
              <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                <Link href="/call/create/video">Start Video Call</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  )
}

