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
    if (!screen?.showNavigation) {
      return { navigation: "None" }
    }
    let settings = {
      embedded,
      pageWidth: screen?.width,
      ...app?.navigation,
      ...navigation,
    }

    // Migrate legacy width setting
    if (settings.width && !settings.pageWidth) {
      layoutSettings.pageWidth = settings.width
    }
    if (settings.width && !settings.navWidth) {
      settings.navWidth = settings.width
    }

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
