export function setCookie(name, value, domain) {
  if (getCookie(name)) {
    removeCookie(name)
  }
  let cookieString = `${name}=${value}; Path=/;`
  if (domain) {
    cookieString += ` Domain=${domain};`
  }
  window.document.cookie = cookieString
}

export function getCookie(cookieName) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${cookieName}=`)
  if (parts.length === 2) {
    return parts[1].split(";").shift()
  }
}

export function removeCookie(cookieName, domain) {
  if (getCookie(cookieName)) {
    document.cookie = `${cookieName}=; Max-Age=-99999999; Path=/;`
    if (domain) {
      document.cookie = `${cookieName}=; Max-Age=-99999999; Path=/; Domain=${domain};`
    } else if (typeof window !== "undefined") {
      const parts = window.location.hostname.split(".")
      while (parts.length >= 2) {
        const d = parts.join(".")
        document.cookie = `${cookieName}=; Max-Age=-99999999; Path=/; Domain=${d};`
        document.cookie = `${cookieName}=; Max-Age=-99999999; Path=/; Domain=.${d};`
        parts.shift()
      }
    }
  }
}
