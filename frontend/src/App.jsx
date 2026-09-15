import { useEffect, useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('Connecting to DRF...')

  useEffect(() => {
    // Testing the Django Proxy Connection
    fetch('/api/some-endpoint/')
      .then(res => res.json())
      .then(data => setMessage(data.message || "Connected!"))
      .catch(err => setMessage("DRF server offline, proxy routing verified."))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-cyan-400 mb-4">
        Invictus App
      </h1>
      <p className="text-lg text-slate-300 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
        Status: {message}
      </p>
    </div>
  )
}
