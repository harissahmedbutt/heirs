'use client'

import { useState } from 'react'

// Must match the key used by CookieConsent.tsx
const STORAGE_KEY = 'heirs-cookie-consent'

export default function ManageCookiesButton() {
  const [done, setDone] = useState(false)

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore storage failures */
    }
    setDone(true)
    // Reload so the cookie banner re-evaluates and shows again.
    window.location.reload()
  }

  return (
    <button type="button" onClick={reset} className="btn-primary not-prose">
      {done ? 'Resetting…' : 'Reset cookie preferences'}
    </button>
  )
}
