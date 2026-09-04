import React from 'react'

export default function App(): JSX.Element {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [installed, setInstalled] = React.useState(false)

  React.useEffect(() => {
    function beforeInstallHandler(e: Event) {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      setDeferredPrompt(e)
    }

    function appInstalled() {
      setInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', beforeInstallHandler as EventListener)
    window.addEventListener('appinstalled', appInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler as EventListener)
      window.removeEventListener('appinstalled', appInstalled)
    }
  }, [])

  async function handleInstallClick() {
    if (!deferredPrompt) return
    // Show the browser prompt
    // @ts-ignore - some browsers type this as any
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    // @ts-ignore
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult && choiceResult.outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
  }

  return (
    <div className="app">
      <header>
        <h1>Hello World</h1>
        <p>This is a simple PWA-ready React app (TypeScript).</p>
        {installed ? (
          <p>App installed ✅</p>
        ) : deferredPrompt ? (
          <button onClick={handleInstallClick}>Install app</button>
        ) : (
          <p>Open this site on Android Chrome to get an install prompt, or on iOS use "Add to Home Screen" from the Share menu.</p>
        )}
      </header>
    </div>
  )
}
