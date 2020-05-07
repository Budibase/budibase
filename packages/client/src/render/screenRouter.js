import regexparam from "regexparam"
import { writable } from "svelte/store"

export const screenRouter = (screens, onScreenSelected, appRootPath) => {
  const makeRootedPath = url => {
    if (appRootPath) {
      if (url) return `${appRootPath}${url.startsWith("/") ? "" : "/"}${url}`
      return appRootPath
    }
    return url
  }

  const routes = screens.map(s => makeRootedPath(s.route))
  let fallback = routes.findIndex(([p]) => p === "*")
  if (fallback < 0) fallback = 0

  let current

  function route(url) {
    const _url = makeRootedPath(url.state || url)
    current = routes.findIndex(
      p => p !== "*" && new RegExp("^" + p + "$").test(_url)
    )

    const params = {}

    if (current === -1) {
      routes.forEach((p, i) => {
        const pm = regexparam(p)
        const matches = pm.pattern.exec(_url)

        if (!matches) return

        let j = 0
        while (j < pm.keys.length) {
          params[pm.keys[j]] = matches[++j] || null
        }

        current = i
      })
    }

    const storeInitial = {}
    storeInitial["##routeParams"] = params
    const store = writable(storeInitial)

    const screenIndex = current !== -1 ? current : fallback

    onScreenSelected(screens[screenIndex], store, _url)

    try {
      !url.state && history.pushState(_url, null, _url)
    } catch (_) {
      // ignoring an exception here as the builder runs an iframe, which does not like this
    }
  }

  function click(e) {
    const x = e.target.closest("a")
    const y = x && x.getAttribute("href")

    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.shiftKey ||
      e.button ||
      e.defaultPrevented
    )
      return

    if (!y || x.target || x.host !== location.host) return

    e.preventDefault()
    route(y)
  }

  addEventListener("popstate", route)
  addEventListener("pushstate", route)
  addEventListener("click", click)

  return route
}
