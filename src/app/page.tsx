'use client';

import dynamic from 'next/dynamic';

// Load the app client-side only to avoid hydration mismatch
// (localStorage is only available on the client)
const App = dynamic(() => import('@/components/pnii/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center mesh-bg p-4">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 shadow-lg shadow-violet-500/25 mb-6 animate-pulse" />
      <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-3" />
      <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  ),
});

export default function Home() {
  return <App />;
}
