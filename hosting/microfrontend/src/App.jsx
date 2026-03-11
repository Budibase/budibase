import { useEffect, useMemo, useRef, useState } from "react"

const DEFAULT_APP_URL = "http://localhost:10000/app/my-workspace#/employees"

const getPathname = pathOrUrl => {
  if (!pathOrUrl) {
    return ""
  }
  if (pathOrUrl.startsWith("/")) {
    return pathOrUrl.split("#")[0].split("?")[0]
  }
  try {
    return new URL(pathOrUrl, window.location.origin).pathname
  } catch (error) {
    return pathOrUrl
  }
}

const normalizeAppPath = pathOrUrl => {
  const pathname = getPathname(pathOrUrl).replace(/\/$/, "")
  if (!pathname) {
    return ""
  }
  if (pathname.startsWith("/app/") || pathname.startsWith("/app-chat/")) {
    return pathname
  }
  return pathname.startsWith("/") ? `/app${pathname}` : `/app/${pathname}`
}

const resolvePublishedApp = async appUrl => {
  const appPath = normalizeAppPath(appUrl)
  const response = await fetch(appPath, {
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch app page for path: ${appPath}`)
  }

  const html = await response.text()
  const appIdMatch = html.match(
    /window\["##BUDIBASE_APP_ID##"\]\s*=\s*"([^"]+)"/
  )

  if (!appIdMatch?.[1]) {
    throw new Error(`Could not resolve Budibase app for path: ${appPath}`)
  }

  return {
    appId: appIdMatch[1],
    appPath,
  }
}

const resolveClientLibPath = async ({ appId, appPath }) => {
  const response = await fetch(`/api/applications/${appId}/appPackage`, {
    credentials: "same-origin",
    headers: {
      "x-budibase-embed-location": appPath,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch app package")
  }

  const appPackage = await response.json()
  if (!appPackage?.clientLibPath) {
    throw new Error("App package did not include clientLibPath")
  }

  return appPackage.clientLibPath
}

const App = () => {
  const targetRef = useRef(null)
  const [status, setStatus] = useState("Loading client bundle...")

  const appUrl = useMemo(() => {
    return import.meta.env.VITE_BUDIBASE_APP_URL || DEFAULT_APP_URL
  }, [])

  useEffect(() => {
    let cleanup
    let active = true

    const mountRemote = async () => {
      try {
        const resolvedApp = await resolvePublishedApp(appUrl)
        const clientLibPath = await resolveClientLibPath(resolvedApp)
        const remote = await import(/* @vite-ignore */ clientLibPath)
        if (!active) {
          return
        }

        if (typeof remote.mountBudibaseApp !== "function") {
          setStatus("Client bundle loaded, but mountBudibaseApp was not found")
          return
        }

        const nextCleanup = await remote.mountBudibaseApp({
          target: targetRef.current,
          appUrl,
          appId: resolvedApp.appId,
        })
        if (!active) {
          if (typeof nextCleanup === "function") {
            nextCleanup()
          }
          return
        }
        cleanup = nextCleanup
        setStatus("Budibase app mounted")
      } catch (error) {
        console.error(error)
        setStatus("Failed to load Budibase app via appPackage")
      }
    }

    mountRemote()

    return () => {
      active = false
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [appUrl])

  return (
    <div className="mf-shell">
      <header className="mf-header">
        <h1>Budibase App Microfrontend PoC</h1>
        <p>App URL: {appUrl}</p>
        <p>Status: {status}</p>
      </header>
      <main className="mf-canvas">
        <div ref={targetRef} className="mf-budibase-target" />
      </main>
    </div>
  )
}

export default App
