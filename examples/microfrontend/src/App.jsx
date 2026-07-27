import { useEffect, useMemo, useRef, useState } from "react"
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"

const AUTH_MODE = (import.meta.env.VITE_AUTH_MODE || "none").toLowerCase()
const OIDC_AUTH_MODE = "oidc"

const parseConfiguredBudibaseUrl = () => {
  const raw = window.__BUDIBASE_APP_URL__
  if (!raw || typeof raw !== "string") {
    throw new Error(
      "window.__BUDIBASE_APP_URL__ is required and must be an absolute URL."
    )
  }

  const parsed = new URL(raw)
  if (parsed.origin !== window.location.origin) {
    throw new Error(
      "window.__BUDIBASE_APP_URL__ must use the same origin as the host shell."
    )
  }

  const appPath = parsed.pathname.replace(/\/$/, "")
  if (!appPath.startsWith("/app/") && !appPath.startsWith("/app-chat/")) {
    throw new Error(
      "window.__BUDIBASE_APP_URL__ path must start with /app/ or /app-chat/."
    )
  }

  return { appUrl: parsed.toString(), appPath }
}

const normalizePath = path => {
  if (!path) {
    return "/"
  }
  const [pathname = "/", query = ""] = path.split("?")
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`
  return query ? `${normalizedPathname}?${query}` : normalizedPathname
}

const toHash = routePath => {
  const normalized = normalizePath(routePath)
  return normalized === "/" ? "" : `#${normalized}`
}

const buildReturnTo = appPath => {
  const fallback = appPath || "/"
  if (window.location.pathname.startsWith("/auth/")) {
    return `${fallback}${window.location.hash || ""}`
  }
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

const checkSessionState = async () => {
  try {
    const bffSession = await fetch("/auth/session", {
      credentials: "same-origin",
    })

    const hasOidcSession = bffSession.ok
    const budibaseSession = await fetch("/api/global/self", {
      credentials: "same-origin",
    })
    const hasBudibaseSession = budibaseSession.ok
    return { hasOidcSession, hasBudibaseSession }
  } catch (_error) {
    return { hasOidcSession: false, hasBudibaseSession: false }
  }
}

const fetchMicrofrontendBootstrap = async appPath => {
  const response = await fetch(
    `/api/microfrontend/bootstrap?appPath=${encodeURIComponent(appPath)}`,
    {
      credentials: "same-origin",
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch microfrontend bootstrap for path: ${appPath}`)
  }

  const bootstrap = await response.json()
  if (!bootstrap?.appId || !bootstrap?.clientLibPath) {
    throw new Error("Bootstrap response is missing required fields")
  }

  return bootstrap
}

const BudibaseRoute = ({ appUrl, appPath }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const targetRef = useRef(null)
  const mountHandleRef = useRef(null)
  const currentHostUrlRef = useRef(`${location.pathname}${location.hash || ""}`)
  const [status, setStatus] = useState("Loading Budibase app...")
  const [isOidcAuthenticated, setIsOidcAuthenticated] = useState(false)
  const [isBudibaseAuthenticated, setIsBudibaseAuthenticated] = useState(false)
  const oidcModeEnabled = AUTH_MODE === OIDC_AUTH_MODE

  const initialBudibaseRoute = useMemo(() => {
    const rawHashPath = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : ""
    return normalizePath(rawHashPath || "/")
  }, [location.hash])

  currentHostUrlRef.current = `${location.pathname}${location.hash || ""}`

  useEffect(() => {
    let isMounted = true

    const mountRemote = async () => {
      try {
        if (oidcModeEnabled) {
          setStatus("Checking OIDC and Budibase sessions...")
          const sessionState = await checkSessionState()
          if (!isMounted) {
            return
          }

          setIsOidcAuthenticated(sessionState.hasOidcSession)
          setIsBudibaseAuthenticated(sessionState.hasBudibaseSession)

          if (!sessionState.hasOidcSession) {
            setStatus("OIDC mode: click Login to start authentication.")
          } else if (!sessionState.hasBudibaseSession) {
            setStatus("OIDC active: click Login to bridge Budibase session.")
          } else {
            setStatus("Authenticated. Loading Budibase app...")
          }
        }

        setStatus("Loading Budibase app metadata...")
        const bootstrap = await fetchMicrofrontendBootstrap(appPath)

        setStatus("Loading Budibase client bundle...")
        const remote = await import(/* @vite-ignore */ bootstrap.clientLibPath)

        if (!isMounted) {
          return
        }

        if (typeof remote.mountBudibaseApp !== "function") {
          setStatus("Client bundle loaded, but mountBudibaseApp was not found")
          return
        }

        const handle = await remote.mountBudibaseApp({
          target: targetRef.current,
          appUrl,
          appId: bootstrap.appId,
          initialPath: initialBudibaseRoute,
          onNavigate: nextPath => {
            const targetHash = toHash(nextPath)
            const nextHostUrl = `${appPath}${targetHash}`

            if (nextHostUrl !== currentHostUrlRef.current) {
              navigate(
                {
                  pathname: appPath,
                  hash: targetHash,
                },
                { replace: true }
              )
            }
          },
        })

        if (!isMounted) {
          handle?.()
          return
        }

        mountHandleRef.current = handle
        setStatus("Budibase app mounted")
      } catch (error) {
        console.error(error)
        setStatus("Failed to load Budibase app")
      }
    }

    mountRemote()

    return () => {
      isMounted = false
      if (typeof mountHandleRef.current === "function") {
        mountHandleRef.current()
      }
      mountHandleRef.current = null
    }
  }, [appPath, appUrl, navigate, oidcModeEnabled])

  useEffect(() => {
    const handle = mountHandleRef.current
    if (!handle?.navigate) {
      return
    }

    const currentRemotePath = handle.getCurrentPath?.()
    if (currentRemotePath === initialBudibaseRoute) {
      return
    }

    handle.navigate(initialBudibaseRoute)
  }, [initialBudibaseRoute])

  const login = () => {
    if (!oidcModeEnabled) {
      return
    }

    const returnTo = buildReturnTo(appPath)
    window.location.assign(
      `/auth/login?returnTo=${encodeURIComponent(returnTo)}&bridgeBudibase=1`
    )
  }

  const logout = () => {
    if (!oidcModeEnabled) {
      return
    }

    const returnTo = buildReturnTo(appPath)
    window.location.assign(`/auth/logout?returnTo=${encodeURIComponent(returnTo)}`)
  }

  return (
    <div className="mf-shell">
      <header className="mf-header">
        <div className="mf-header-row">
          <div>
            <h1>Budibase Host Shell (Unified PoC)</h1>
            <p>Status: {status}</p>
          </div>
          {oidcModeEnabled ? (
            <div className="mf-header-actions">
              {isOidcAuthenticated && isBudibaseAuthenticated ? (
                <button
                  type="button"
                  className="mf-login-button"
                  onClick={logout}
                >
                  Logout
                </button>
              ) : (
                <button type="button" className="mf-login-button" onClick={login}>
                  Login
                </button>
              )}
            </div>
          ) : null}
        </div>
      </header>
      <main className="mf-canvas">
        <div ref={targetRef} className="mf-budibase-target" />
      </main>
    </div>
  )
}

const App = () => {
  const config = useMemo(() => parseConfiguredBudibaseUrl(), [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={<BudibaseRoute appUrl={config.appUrl} appPath={config.appPath} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
