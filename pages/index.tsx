import Head from 'next/head'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>HiddenBridge - Anonymous and Secure Calls</title>
        <meta name="description" content="Connect anonymously and securely with HiddenBridge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-extrabold text-gray-900">HiddenBridge</h1>
                <p>Connect anonymously and securely with your penpals.</p>
                <ul className="list-disc space-y-2">
                  <li>No accounts required</li>
                  <li>End-to-end encrypted calls</li>
                  <li>Temporary, one-time use links</li>
                  <li>Voice and video call options</li>
                </ul>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <Link href="/generate/voice" className="text-cyan-600 hover:text-cyan-700">
                  Start a Voice Call &rarr;
                </Link>
                <br />
                <Link href="/generate/video" className="text-cyan-600 hover:text-cyan-700">
                  Start a Video Call &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

