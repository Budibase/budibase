import { useEffect, useMemo, useRef, useState } from "react"

const DEFAULT_MFE_URL = "/app/mfe/budibase-client.js"
const DEFAULT_APP_URL = "/app/my-workspace#/employees"

const App = () => {
  const targetRef = useRef(null)
  const [status, setStatus] = useState("Loading remote module...")

  const mfeUrl = useMemo(() => {
    return import.meta.env.VITE_BUDIBASE_MFE_URL || DEFAULT_MFE_URL
  }, [])

  const appUrl = useMemo(() => {
    return import.meta.env.VITE_BUDIBASE_APP_URL || DEFAULT_APP_URL
  }, [])

  useEffect(() => {
    let cleanup
    let active = true

    const mountRemote = async () => {
      try {
        const remote = await import(/* @vite-ignore */ mfeUrl)
        if (!active) {
          return
        }

        if (typeof remote.mountBudibaseApp !== "function") {
          setStatus("Remote loaded, but mountBudibaseApp was not found")
          return
        }

        cleanup = await remote.mountBudibaseApp({
          target: targetRef.current,
          appUrl,
        })
        setStatus("Budibase app mounted")
      } catch (error) {
        console.error(error)
        setStatus("Failed to load remote module. Check Budibase server and URL.")
      }
    }

    mountRemote()

    return () => {
      active = false
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [appUrl, mfeUrl])

  return (
    <div className="shell">
      <header className="header">
        <h1>Budibase App Microfrontend PoC</h1>
        <p>Remote URL: {mfeUrl}</p>
        <p>App URL: {appUrl}</p>
        <p>Status: {status}</p>
      </header>
      <main className="canvas">
        <div ref={targetRef} className="budibase-target" />
      </main>
    </div>
  )
}

export default App
