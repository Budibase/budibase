import { get, type Writable } from "svelte/store"
import { isChangingPage } from "@roxi/routify"
import * as routify from "@roxi/routify"

interface SyncURLToStateOptions<State extends Record<string, any>> {
  urlParam: string
  stateKey: keyof State & string
  validate?: (value: string) => boolean
  update?: (value: string) => void
  fallbackUrl?: string | (() => string)
  store: Writable<State>
  routify: typeof routify
  beforeNavigate?: (
    url: string,
    params: Record<string, unknown>
  ) => {
    url?: string
    params?: Record<string, unknown>
  } | void
  decode?: (value: string) => string
}

export const syncURLToState = <State extends Record<string, any>>(
  options: SyncURLToStateOptions<State>
) => {
  const {
    urlParam,
    stateKey,
    validate,
    update,
    fallbackUrl,
    store,
    routify,
    beforeNavigate,
    decode,
  } = options || {}
  if (
    !urlParam ||
    !stateKey ||
    !urlParam ||
    !store?.subscribe ||
    !routify ||
    !routify.params?.subscribe ||
    !routify.goto?.subscribe ||
    !routify.redirect?.subscribe ||
    !routify.page?.subscribe
  ) {
    console.warn("syncURLToState invoked with missing parameters")
    return
  }

  // Decodes encoded URL params if required
  const decodeParams = (
    urlParams?: Record<string, string | undefined>
  ): Record<string, string | undefined> => {
    if (!decode) {
      return urlParams || {}
    }
    const decoded: typeof urlParams = {}
    if (urlParams) {
      Object.keys(urlParams).forEach(key => {
        decoded[key] = urlParams[key] && decode(urlParams[key])
      })
    }
    return decoded
  }

  // We can't dynamically fetch the value of stateful routify stores so we need
  // to just subscribe and cache the latest versions.
  // We can grab their initial values as this is during component
  // initialisation.
  let cachedParams = decodeParams(get(routify.params))
  let cachedGoto = get(routify.goto)
  let cachedRedirect = get(routify.redirect)
  let cachedPage = get(routify.page)
  const initialPage = cachedPage
  let previousParamsHash: string | null = null
  let debug = false
  const log = (...params: unknown[]) =>
    debug && console.debug(`[${urlParam}]`, ...params)
  const isExitingPage = () => get(routify.page)?.path !== initialPage?.path

  // Navigate to a certain URL
  const gotoUrl = (url: string, params: Record<string, unknown>) => {
    // Clean URL
    if (url?.endsWith("/index")) {
      url = url.replace("/index", "")
    }
    // Allow custom URL handling
    if (beforeNavigate) {
      const res = beforeNavigate(url, params)
      if (res?.url) {
        url = res.url
      }
      if (res?.params) {
        params = res.params
      }
    }
    log("Navigating to", url, "with params", params)
    cachedGoto(url, params)
  }

  // Redirect to a certain URL
  const redirectUrl = (url: string | (() => string)) => {
    const urlString = typeof url === "function" ? url() : url
    log("Redirecting to", urlString)
    cachedRedirect(urlString)
  }

  // Updates state with new URL params
  const mapUrlToState = (params: Record<string, any>) => {
    // Check if we have new URL params
    const paramsHash = JSON.stringify(params)
    const newParams = paramsHash !== previousParamsHash
    previousParamsHash = paramsHash
    const urlValue = params?.[urlParam]
    const stateValue = get(store)?.[stateKey]
    if (!newParams || !urlValue) {
      return
    }

    // Check if new value is valid
    if (validate && fallbackUrl && !isExitingPage()) {
      if (!validate(urlValue)) {
        log("Invalid URL param!", urlValue)
        redirectUrl(fallbackUrl)
        return
      }
    }

    // Only update state if we have a new value
    if (urlValue !== stateValue) {
      log(`state.${stateKey} (${stateValue}) <= url.${urlParam} (${urlValue})`)
      if (update) {
        // Use custom update function if provided
        update(urlValue)
      } else {
        // Otherwise manually update the store
        store.update(state => ({
          ...state,
          [stateKey]: urlValue,
        }))
      }
    }
  }

  // Updates the URL with new state values
  const mapStateToUrl = (state: State) => {
    const urlValue = cachedParams?.[urlParam]
    const stateValue = state?.[stateKey]

    // As the store updated, validate that the current state value is valid
    if (validate && fallbackUrl && !isExitingPage()) {
      if (!validate(stateValue)) {
        log("Invalid state param!", stateValue)
        redirectUrl(fallbackUrl)
        return
      }
    }

    // Avoid updating the URL if not necessary to prevent a wasted render
    // cycle
    if (stateValue === urlValue) {
      return
    }
    log(`url.${urlParam} (${urlValue}) <= state.${stateKey} (${stateValue})`)

    // Navigate to the new URL
    if (!get(isChangingPage)) {
      const newUrlParams = {
        ...cachedParams,
        [urlParam]: stateValue,
      }
      gotoUrl(cachedPage.path, newUrlParams)
    }
  }

  // Initially hydrate state from URL
  mapUrlToState(cachedParams)

  // Subscribe to URL changes and cache them
  const unsubscribeParams = routify.params.subscribe($urlParams => {
    const decodedParams = decodeParams($urlParams)
    cachedParams = decodedParams
    mapUrlToState(decodedParams)
  })

  // Subscribe to routify store changes and cache them
  const unsubscribeGoto = routify.goto.subscribe($goto => {
    cachedGoto = $goto
  })
  const unsubscribeRedirect = routify.redirect.subscribe($redirect => {
    cachedRedirect = $redirect
  })
  const unsubscribePage = routify.page.subscribe($page => {
    cachedPage = $page
  })

  // Subscribe to store changes and keep URL up to date
  const unsubscribeStore = store.subscribe(mapStateToUrl)

  // Return an unsync function to cancel subscriptions
  return () => {
    unsubscribeParams()
    unsubscribeGoto()
    unsubscribeRedirect()
    unsubscribePage()
    unsubscribeStore()
  }
}
