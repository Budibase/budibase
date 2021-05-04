export const Cookies = {
  Auth: "budibase:auth",
  CurrentApp: "budibase:currentapp",
}

export function getCookie(cookieName) {
  return document.cookie.split(";").some(cookie => {
    return cookie.trim().startsWith(`${cookieName}=`)
  })
}

export function removeCookie(cookieName) {
  if (getCookie(cookieName)) {
    document.cookie = `${cookieName}=; Max-Age=-99999999;`
  }
}
