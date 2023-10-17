export function setCookie(name, value) {
  if (getCookie(name)) {
    removeCookie(name)
  }
  window.document.cookie = `${name}=${value}; Path=/;`
}

export function getCookie(cookieName) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${cookieName}=`)
  if (parts.length === 2) {
    return parts[1].split(";").shift()
  }
}

export function removeCookie(cookieName) {
  if (getCookie(cookieName)) {
    document.cookie = `${cookieName}=; Max-Age=-99999999; Path=/;`
  }
}
