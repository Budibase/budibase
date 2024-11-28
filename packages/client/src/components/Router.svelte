<script>
  import { setContext, onMount } from "svelte"
  import Router, { querystring } from "svelte-spa-router"
  import {
    routeStore,
    stateStore,
    appStore,
    builderStore,
    orgStore,
    screenStore,
  } from "stores"
  import Screen from "./Screen.svelte"
  import { get } from "svelte/store"
  import Layout from "./Layout.svelte"

  setContext("screenslot", true)

  $: config = {
    routes: getRouterConfig($routeStore.routes),
    id: $routeStore.routeSessionId,
  }

  // Keep query params up to date
  $: routeStore.actions.setQueryParams(parseQueryString($querystring))

  // Get settings for the root layout
  $: screen = $screenStore.activeScreen
  $: embedded = $appStore.embedded
  $: application = $appStore.application
  $: navigation = $builderStore.navigation
  $: logoUrl = $orgStore?.logoUrl
  $: layoutSettings = getLayoutSettings(
    screen,
    embedded,
    application,
    navigation,
    logoUrl
  )

  const getLayoutSettings = (screen, embedded, app, navigation, logoUrl) => {
    let settings = {
      embedded,
      ...app?.navigation,
      ...navigation,
    }

    // Migrate some settings
    settings.pageWidth = screen?.width || settings.width || "Large"
    settings.navWidth = settings.navWidth || settings.width || "Large"

    // Default some settings
    if (!settings.navigation) {
      settings.navigation = "Top"
    }
    if (!settings.pageWidth) {
      settings.pageWidth = "Large"
    }
    if (!settings.title && !settings.hideTitle) {
      settings.title = app?.name
    }
    if (!settings.logoUrl) {
      settings.logoUrl = logoUrl
    }

    // Hide nav if required
    if (!screen?.showNavigation) {
      settings.navigation = "None"
    }

    return settings
  }

  const parseQueryString = query => {
    let queryParams = {}
    if (query) {
      const urlSearchParams = new URLSearchParams(query)
      for (const [key, value] of urlSearchParams) {
        queryParams[key] = value
      }
    }
    return queryParams
  }

  const getRouterConfig = routes => {
    let config = {}
    routes.forEach(route => {
      config[route.path] = Screen
    })

    // Add catch-all route so that we serve the Screen component always
    config["*"] = Screen
    return config
  }

  const onRouteLoading = ({ detail }) => {
    routeStore.actions.setRouteParams(detail.params || {})
    routeStore.actions.setActiveRoute(detail.route)
  }

  // Initialise state store from query string on initial load
  onMount(() => {
    const queryParams = parseQueryString(get(querystring))
    if (queryParams.state) {
      try {
        const state = JSON.parse(atob(queryParams.state))
        stateStore.actions.initialise(state)
      } catch (error) {
        // Swallow error and do nothing
      }
    }
  })
</script>

<Layout {...layoutSettings}>
  {#key config.id}
    <Router on:routeLoading={onRouteLoading} routes={config.routes} />
  {/key}
</Layout>
