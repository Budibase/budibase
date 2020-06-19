import regexparam from "regexparam"
import { routerStore } from "../state/store"
import { getAppId } from "./getAppId"

export const screenRouter = ({ screens, onScreenSelected, window }) => {
  const makeRootedPath = url => {
    if (
      window.location &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      const appId = getAppId(window.document.cookie)
      if (url) {
        if (url.startsWith(appId)) return url
        return `/${appId}${url.startsWith("/") ? "" : "/"}${url}`
      }
      return appId
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

    routerStore.update(state => {
      state["##routeParams"] = params
      return state
    })

    const screenIndex = current !== -1 ? current : fallback

    onScreenSelected(screens[screenIndex], _url)

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

    const target = (x && x.target) || "_self"
    if (!y || target !== "_self" || x.host !== location.host) return

    e.preventDefault()
    route(y)
  }

  addEventListener("popstate", route)
  addEventListener("pushstate", route)
  addEventListener("click", click)

  return route
}
