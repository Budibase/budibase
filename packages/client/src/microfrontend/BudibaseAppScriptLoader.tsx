import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react"

const SCRIPT_ID = "budibase-client-script"
const POLL_INTERVAL_MS = 100
const POLL_TIMEOUT_MS = 10_000

export interface BudibaseAppScriptLoaderProps {
  /** Budibase app ID (e.g. "app_123") */
  appId: string
  /** Workspace ID – in Budibase this is the same as appId for the client URL */
  workspaceId: string
  /** Full URL to budibase-client.js (e.g. "http://localhost:10000/api/assets/{workspaceId}/client") */
  clientLibUrl: string
  /** Initial hash route (e.g. "#/employees") so the embedded app opens on that screen */
  initialHash?: string
  onError?: (error: Error) => void
  onLoad?: () => void
  className?: string
  style?: CSSProperties
}

export const BudibaseAppScriptLoader: React.FC<
  BudibaseAppScriptLoaderProps
> = ({
  appId,
  workspaceId,
  clientLibUrl,
  initialHash,
  onError,
  onLoad,
  className,
  style,
}) => {
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  )
  const [error, setError] = useState<Error | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scriptLoadedRef = useRef(false)
  const containerId = `budibase-app-container-${useId().replace(/:/g, "")}`

  const clearPoll = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
  }, [])

  const handleError = useCallback(
    (err: Error) => {
      clearPoll()
      setError(err)
      setStatus("error")
      onError?.(err)
    },
    [clearPoll, onError]
  )

  useEffect(() => {
    if (!appId || !workspaceId || !clientLibUrl) {
      handleError(new Error("appId, workspaceId and clientLibUrl are required"))
      return
    }

    const container = containerRef.current
    if (!container) return // 1. Set window flags before script runs
    ;(window as unknown as Record<string, string>)["##BUDIBASE_APP_ID##"] =
      appId
    ;(window as unknown as Record<string, string>)[
      "##BUDIBASE_APP_EMBEDDED##"
    ] = "true"
    ;(window as unknown as Record<string, string>)[
      "##BUDIBASE_MOUNT_TARGET##"
    ] = `#${containerId}`
    ;(window as unknown as Record<string, string>)[
      "##BUDIBASE_HIDE_DEV_TOOLS##"
    ] = "true"

    if (initialHash) {
      window.location.hash = initialHash.startsWith("#") ? initialHash : `#${initialHash}`
    }

    const runLoadBudibase = () => {
      const loadBudibase = (
        window as unknown as { loadBudibase?: () => Promise<void> }
      ).loadBudibase
      if (typeof loadBudibase === "function") {
        container.innerHTML = ""
        loadBudibase()
          .then(() => {
            setStatus("success")
            onLoad?.()
          })
          .catch(err => {
            handleError(err instanceof Error ? err : new Error(String(err)))
          })
      }
    }

    const existingScript = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null

    if (existingScript && existingScript.src === clientLibUrl) {
      scriptLoadedRef.current = true
      runLoadBudibase()
      return
    }

    if (existingScript) {
      // Script from another instance – wait for it and then just run loadBudibase
      if (
        (window as unknown as { loadBudibase?: () => Promise<void> })
          .loadBudibase
      ) {
        runLoadBudibase()
        return
      }
    }

    // Load script
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.type = "module"
    script.crossOrigin = "anonymous"
    script.src = clientLibUrl

    script.onload = () => {
      scriptLoadedRef.current = true
      const start = Date.now()
      const poll = () => {
        if (
          typeof (window as unknown as { loadBudibase?: () => Promise<void> })
            .loadBudibase === "function"
        ) {
          runLoadBudibase()
          return
        }
        if (Date.now() - start > POLL_TIMEOUT_MS) {
          handleError(
            new Error(
              "loadBudibase() was not available after 10 seconds. Check clientLibUrl and console for script errors."
            )
          )
          return
        }
        pollTimeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS)
      }
      poll()
    }

    script.onerror = () => {
      handleError(
        new Error(
          `Failed to load Budibase client script: ${clientLibUrl}. Check CORS and URL.`
        )
      )
    }

    document.body.appendChild(script)

    return () => {
      clearPoll()
      // Do not remove the script – it may be reused by other instances
    }
  }, [appId, workspaceId, clientLibUrl, initialHash, containerId, handleError, onLoad])

  if (status === "error") {
    return (
      <div
        className={className}
        style={{
          padding: "1rem",
          color: "#c00",
          border: "1px solid #fcc",
          borderRadius: "8px",
          ...style,
        }}
      >
        <p>{error?.message ?? "Failed to load Budibase app"}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ marginTop: "0.5rem" }}
        >
          Retry
        </button>
      </div>
    )
  }

  // Mount container must stay empty – Svelte mounts here. Never put React children inside it
  // or React will try to remove them after innerHTML = "" and cause removeChild errors.
  return (
    <div
      className={className}
      style={{ position: "relative", minHeight: "200px", ...style }}
    >
      {status === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          Loading Budibase app…
        </div>
      )}
      <div
        ref={containerRef}
        id={containerId}
        style={{ minHeight: "200px" }}
        suppressHydrationWarning
      />
    </div>
  )
}

export default BudibaseAppScriptLoader
