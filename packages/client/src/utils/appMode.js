export const isChatAppPath = () => {
  if (typeof window === "undefined") {
    return false
  }

  const path = window.location.pathname.replace(/\/$/, "")
  const segments = path.split("/").filter(Boolean)

  if (!segments.length) {
    return false
  }

  if (segments[0] === "app" && segments[2] === "chat") {
    return true
  }

  if (segments[0] === "embed" && segments[2] === "chat") {
    return true
  }

  if (segments[0].startsWith("app_dev_") && segments[1] === "chat") {
    return true
  }

  return false
}

export const isChatAppHash = () => {
  if (typeof window === "undefined") {
    return false
  }

  const hash = window.location.hash.replace(/^#/, "")
  if (!hash) {
    return false
  }

  const hashPath = hash.split("?")[0].replace(/\/$/, "")
  return hashPath === "/chat" || hashPath === "chat"
}
