<script>
  import { writable, get } from "svelte/store"
  import { setContext, onMount } from "svelte"
  import { Layout, Heading, Body } from "@budibase/bbui"
  import ErrorSVG from "@budibase/frontend-core/assets/error.svg?raw"
  import { Constants, CookieUtils } from "@budibase/frontend-core"
  import { getThemeClassNames } from "@budibase/shared-core"
  import Component from "./Component.svelte"
  import SDK from "sdk"
  import {
    featuresStore,
    createContextStore,
    initialise,
    screenStore,
    authStore,
    routeStore,
    builderStore,
    themeStore,
    appStore,
    devToolsStore,
    devToolsEnabled,
    environmentStore,
    sidePanelStore,
    modalStore,
  } from "stores"
  import NotificationDisplay from "components/overlay/NotificationDisplay.svelte"
  import ConfirmationDisplay from "components/overlay/ConfirmationDisplay.svelte"
  import PeekScreenDisplay from "components/overlay/PeekScreenDisplay.svelte"
  import UserBindingsProvider from "components/context/UserBindingsProvider.svelte"
  import DeviceBindingsProvider from "components/context/DeviceBindingsProvider.svelte"
  import StateBindingsProvider from "components/context/StateBindingsProvider.svelte"
  import RowSelectionProvider from "components/context/RowSelectionProvider.svelte"
  import QueryParamsProvider from "components/context/QueryParamsProvider.svelte"
  import SettingsBar from "components/preview/SettingsBar.svelte"
  import SelectionIndicator from "components/preview/SelectionIndicator.svelte"
  import HoverIndicator from "components/preview/HoverIndicator.svelte"
  import CustomThemeWrapper from "./CustomThemeWrapper.svelte"
  import DNDHandler from "components/preview/DNDHandler.svelte"
  import GridDNDHandler from "components/preview/GridDNDHandler.svelte"
  import KeyboardManager from "components/preview/KeyboardManager.svelte"
  import DevToolsHeader from "components/devtools/DevToolsHeader.svelte"
  import DevTools from "components/devtools/DevTools.svelte"
  import FreeFooter from "components/FreeFooter.svelte"
  import MaintenanceScreen from "components/MaintenanceScreen.svelte"
  import SnippetsProvider from "./context/SnippetsProvider.svelte"
  import EmbedProvider from "./context/EmbedProvider.svelte"

  // Provide contexts
  setContext("sdk", SDK)
  setContext("component", writable({ id: null, ancestors: [] }))
  setContext("context", createContextStore())

  let dataLoaded = false
  let permissionError = false
  let embedNoScreens = false

  // Determine if we should show devtools or not
  $: showDevTools = $devToolsEnabled && !$routeStore.queryParams?.peek

  // Handle no matching route
  $: {
    if (dataLoaded && $routeStore.routerLoaded && !$routeStore.activeRoute) {
      if ($screenStore.screens.length) {
        // If we have some available screens, use the first screen which
        // represents the best route based on rank
        const route = $screenStore.screens[0].routing?.route
        if (!route) {
          permissionError = true
          console.error("No route found but screens exist")
        } else {
          permissionError = false
          routeStore.actions.navigate(route)
        }
      } else if ($authStore) {
        // If the user is logged in but has no screens, they don't have
        // permission to use the app
        permissionError = true
      } else if ($appStore.embedded) {
        embedNoScreens = true
      } else {
        // If they have no screens and are not logged in, it probably means
        // they should log in to gain access
        const returnUrl = `${window.location.pathname}${window.location.hash}`
        CookieUtils.setCookie(Constants.Cookies.ReturnUrl, returnUrl)
        window.location = "/builder/auth/login"
      }
    }
  }

  let fontsLoaded = false

  // Load app config
  onMount(async () => {
    document.fonts.ready.then(() => {
      fontsLoaded = true
    })

    await initialise()
    await authStore.actions.fetchUser()
    dataLoaded = true

    if (get(builderStore).inBuilder) {
      builderStore.actions.notifyLoaded()
    } else {
      builderStore.actions.analyticsPing({
        embedded: !!$appStore.embedded,
      })
    }
    const handleHashChange = () => {
      const { open: sidePanelOpen } = $sidePanelStore
      // only close if the sidepanel is open and theres no onload side panel actions on the screen.
      if (
        sidePanelOpen &&
        !$screenStore.activeScreen.onLoad?.some(
          item => item["##eventHandlerType"] === "Open Side Panel"
        )
      ) {
        sidePanelStore.actions.close()
      }

      const { open: modalOpen } = $modalStore
      // only close if the modal is open and theres onload modals actions on the screen.
      if (
        modalOpen &&
        !$screenStore.activeScreen.onLoad?.some(
          item => item["##eventHandlerType"] === "Open Modal"
        )
      ) {
        modalStore.actions.close()
      }
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  })

  $: {
    if (dataLoaded && fontsLoaded) {
      document.getElementById("clientAppSkeletonLoader")?.remove()
    }
  }
</script>

<svelte:head>
  {#if $builderStore.usedPlugins?.length}
    {#each $builderStore.usedPlugins as plugin (plugin.hash)}
      <script src={`${plugin.jsUrl}`}></script>
    {/each}
  {/if}
</svelte:head>

{#if dataLoaded}
  <div
    id="spectrum-root"
    lang="en"
    dir="ltr"
    class="spectrum spectrum--medium {getThemeClassNames($themeStore.theme)}"
    class:builder={$builderStore.inBuilder}
    class:show={fontsLoaded && dataLoaded}
  >
    {#if $environmentStore.maintenance.length > 0}
      <MaintenanceScreen maintenanceList={$environmentStore.maintenance} />
    {:else}
      <EmbedProvider>
        <DeviceBindingsProvider>
          <UserBindingsProvider>
            <StateBindingsProvider>
              <RowSelectionProvider>
                <QueryParamsProvider>
                  <SnippetsProvider>
                    <!-- Settings bar can be rendered outside of device preview -->
                    <!-- Key block needs to be outside the if statement or it breaks -->
                    {#key $builderStore.selectedComponentId}
                      {#if $builderStore.inBuilder}
                        <SettingsBar />
                      {/if}
                    {/key}

                    <!-- Clip boundary for selection indicators -->
                    <div
                      id="clip-root"
                      class:preview={$builderStore.inBuilder}
                      class:tablet-preview={$builderStore.previewDevice ===
                        "tablet"}
                      class:mobile-preview={$builderStore.previewDevice ===
                        "mobile"}
                    >
                      <!-- Actual app -->
                      <div id="app-root">
                        {#if showDevTools}
                          <DevToolsHeader />
                        {/if}

                        <div id="app-body">
                          {#if permissionError}
                            <div class="error">
                              <Layout justifyItems="center" gap="S">
                                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                {@html ErrorSVG}
                                <Heading size="L">
                                  You don't have permission to use this app
                                </Heading>
                                <Body size="S">
                                  Ask your administrator to grant you access
                                </Body>
                              </Layout>
                            </div>
                          {:else if !$screenStore.activeLayout}
                            <div class="error">
                              <Layout justifyItems="center" gap="S">
                                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                {@html ErrorSVG}
                                <Heading size="L">
                                  Something went wrong rendering your app
                                </Heading>
                                <Body size="S">
                                  Get in touch with support if this issue
                                  persists
                                </Body>
                              </Layout>
                            </div>
                          {:else if embedNoScreens}
                            <div class="error">
                              <Layout justifyItems="center" gap="S">
                                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                {@html ErrorSVG}
                                <Heading size="L">
                                  This Budibase app is not publicly accessible
                                </Heading>
                              </Layout>
                            </div>
                          {:else}
                            <CustomThemeWrapper>
                              {#key $screenStore.activeLayout._id}
                                <Component
                                  isLayout
                                  instance={$screenStore.activeLayout.props}
                                />
                              {/key}

                              <!-- Layers on top of app -->
                              <NotificationDisplay />
                              <ConfirmationDisplay />
                              <PeekScreenDisplay />
                            </CustomThemeWrapper>
                          {/if}

                          {#if showDevTools}
                            <DevTools />
                          {/if}
                        </div>

                        {#if !$builderStore.inBuilder && $featuresStore.logoEnabled}
                          <FreeFooter />
                        {/if}
                      </div>

                      <!-- Preview and dev tools utilities  -->
                      {#if $appStore.isDevApp}
                        <SelectionIndicator />
                      {/if}
                      {#if $builderStore.inBuilder || $devToolsStore.allowSelection}
                        <HoverIndicator />
                      {/if}
                      {#if $builderStore.inBuilder}
                        <DNDHandler />
                        <GridDNDHandler />
                      {/if}
                    </div>
                  </SnippetsProvider>
                </QueryParamsProvider>
              </RowSelectionProvider>
            </StateBindingsProvider>
          </UserBindingsProvider>
        </DeviceBindingsProvider>
      </EmbedProvider>
    {/if}
  </div>
  <KeyboardManager />
{/if}

<style>
  #spectrum-root {
    height: 0;
    visibility: hidden;
    padding: 0;
    margin: 0;
    overflow: clip;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  #spectrum-root.builder {
    background: transparent;
  }

  #clip-root {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: clip;
    background-color: transparent;
  }

  #spectrum-root.show {
    height: 100%;
    visibility: visible;
  }

  #app-root {
    overflow: clip;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  #app-body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    overflow: hidden;
    position: relative;
  }

  .error {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: 1;
    text-align: center;
    padding: 20px;
  }
  .error :global(svg) {
    fill: var(--spectrum-global-color-gray-500);
    width: 80px;
    height: 80px;
  }
  .error :global(h1),
  .error :global(p) {
    color: var(--spectrum-global-color-gray-800);
  }
  .error :global(p) {
    font-style: italic;
    margin-top: -0.5em;
  }
  .error :global(h1) {
    font-weight: 400;
  }

  /* Preview styles */
  #clip-root.preview {
    padding: 6px;
  }
  #clip-root.tablet-preview {
    width: calc(1024px + 12px);
    height: calc(768px + 12px);
  }
  #clip-root.mobile-preview {
    width: calc(390px + 12px);
    height: calc(844px + 12px);
  }

  /* Print styles */
  @media print {
    #spectrum-root,
    #clip-root,
    #app-root,
    #app-body {
      overflow: visible !important;
    }
  }
</style>
