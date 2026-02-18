<script>
  import { writable, get } from "svelte/store"
  import { setContext, onMount } from "svelte"
  import { Layout, Heading, Body } from "@budibase/bbui"
  import ErrorSVG from "@budibase/frontend-core/assets/error.svg?raw"
  import {
    Constants,
    CookieUtils,
    invalidationMessage,
    popNumSessionsInvalidated,
  } from "@budibase/frontend-core"
  import { getThemeClassNames } from "@budibase/shared-core"
  import Component from "./Component.svelte"
  import SDK from "@/sdk"
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
    dataSourceStore,
    notificationStore,
    recaptchaStore,
  } from "@/stores"
  import NotificationDisplay from "./overlay/NotificationDisplay.svelte"
  import ConfirmationDisplay from "./overlay/ConfirmationDisplay.svelte"
  import PeekScreenDisplay from "./overlay/PeekScreenDisplay.svelte"
  import InstallPrompt from "./overlay/InstallPrompt.svelte"
  import UserBindingsProvider from "./context/UserBindingsProvider.svelte"
  import DeviceBindingsProvider from "./context/DeviceBindingsProvider.svelte"
  import StateBindingsProvider from "./context/StateBindingsProvider.svelte"
  import TestUrlBindingsProvider from "./context/TestUrlBindingsProvider.svelte"
  import RowSelectionProvider from "./context/RowSelectionProvider.svelte"
  import QueryParamsProvider from "./context/QueryParamsProvider.svelte"
  import SettingsBar from "./preview/SettingsBar.svelte"
  import SelectionIndicator from "./preview/SelectionIndicator.svelte"
  import HoverIndicator from "./preview/HoverIndicator.svelte"
  import CustomThemeWrapper from "./CustomThemeWrapper.svelte"
  import DNDHandler from "./preview/DNDHandler.svelte"
  import GridDNDHandler from "./preview/GridDNDHandler.svelte"
  import KeyboardManager from "./preview/KeyboardManager.svelte"
  import DevToolsHeader from "./devtools/DevToolsHeader.svelte"
  import DevTools from "./devtools/DevTools.svelte"
  import FreeFooter from "./FreeFooter.svelte"
  import MaintenanceScreen from "./MaintenanceScreen.svelte"
  import SnippetsProvider from "./context/SnippetsProvider.svelte"
  import EmbedProvider from "./context/EmbedProvider.svelte"
  import DNDSelectionIndicators from "./preview/DNDSelectionIndicators.svelte"
  import RecaptchaV2 from "./RecaptchaV2.svelte"
  import { ActionTypes } from "@/constants"
  import { API } from "@/api"
  import AppChatbox from "./app/Chatbox.svelte"

  // Provide contexts
  const context = createContextStore()
  setContext("sdk", SDK)
  setContext("component", writable({ id: null, ancestors: [] }))
  setContext("context", context)

  // Seed context with an action to refresh all datasources
  context.actions.provideAction("all", ActionTypes.RefreshDatasource, () => {
    dataSourceStore.actions.refreshAll()
  })

  let dataLoaded = false
  let permissionError = false
  let embedNoScreens = false
  let chatRoutePaused = false

  $: displayPreviewDevice =
    $builderStore.previewModalDevice || $builderStore.previewDevice

  // Determine if we should show devtools or not
  $: showDevTools = $devToolsEnabled && !$routeStore.queryParams?.peek
  $: isChatOnlyRoute =
    typeof window !== "undefined" &&
    (window.location.pathname.replace(/\/$/, "").endsWith("/_chat") ||
      window.location.pathname.startsWith("/app-chat/"))
  $: resolvedThemeClassNames = getThemeClassNames($themeStore.theme)

  // Handle no matching route
  $: {
    if (
      !isChatOnlyRoute &&
      dataLoaded &&
      $routeStore.routerLoaded &&
      !$routeStore.activeRoute
    ) {
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

  const refreshChatRoutePausedState = async () => {
    if (!isChatOnlyRoute || $builderStore.inBuilder) {
      chatRoutePaused = false
      return
    }

    try {
      const chatApp = await API.get({
        url: "/api/chatapps",
        suppressErrors: true,
      })
      chatRoutePaused = chatApp?.live === false
    } catch (error) {
      console.error(error)
      chatRoutePaused = false
    }
  }

  $: if (dataLoaded && isChatOnlyRoute) {
    refreshChatRoutePausedState()
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

    const invalidated = popNumSessionsInvalidated()
    if (invalidated > 0) {
      notificationStore.actions.info(
        invalidationMessage(invalidated),
        true,
        5000
      )
    }

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
    class="spectrum spectrum--medium {resolvedThemeClassNames}"
    class:builder={$builderStore.inBuilder}
    class:show={fontsLoaded && dataLoaded}
  >
    {#if $environmentStore.maintenance.length > 0}
      <MaintenanceScreen maintenanceList={$environmentStore.maintenance} />
    {:else if $featuresStore.recaptchaEnabled && $appStore.application?.features?.recaptchaEnabled && $appStore.recaptchaKey && !$recaptchaStore.verified && !$builderStore.inBuilder}
      <RecaptchaV2 />
    {:else}
      <EmbedProvider>
        <DeviceBindingsProvider>
          <UserBindingsProvider>
            <StateBindingsProvider>
              <RowSelectionProvider>
                <QueryParamsProvider>
                  <TestUrlBindingsProvider>
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
                        class:tablet-preview={displayPreviewDevice === "tablet"}
                        class:mobile-preview={displayPreviewDevice === "mobile"}
                        class:modal-mobile-preview={$builderStore.previewModalDevice ===
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
                            {:else if isChatOnlyRoute}
                              <CustomThemeWrapper>
                                <div class="chat-route-shell">
                                  <div class="chat-app-container">
                                    {#if chatRoutePaused && !$builderStore.inBuilder}
                                      <div class="chat-paused-shell">
                                        <div
                                          class="chat-paused-nav"
                                          aria-hidden="true"
                                        >
                                          <div class="chat-paused-nav-header">
                                            <div
                                              class="chat-paused-line chat-paused-line-title"
                                            ></div>
                                            <div
                                              class="chat-paused-line chat-paused-line-subtitle"
                                            ></div>
                                          </div>
                                          <div class="chat-paused-nav-items">
                                            <div class="chat-paused-item"></div>
                                            <div class="chat-paused-item"></div>
                                            <div class="chat-paused-item"></div>
                                            <div class="chat-paused-item"></div>
                                          </div>
                                        </div>

                                        <div class="chat-paused-main">
                                          <div class="chat-paused-main-header">
                                            <div
                                              class="chat-paused-line chat-paused-line-agent"
                                            ></div>
                                            <div class="chat-paused-badge">
                                              Paused
                                            </div>
                                          </div>

                                          <div class="chat-paused-content">
                                            <Heading size="M"
                                              >Chat is paused</Heading
                                            >
                                            <Body size="S">
                                              This chat app is currently
                                              unavailable. Ask your
                                              administrator to set chat live.
                                            </Body>
                                          </div>

                                          <div class="chat-paused-input">
                                            <Body size="S">Chat is paused.</Body
                                            >
                                          </div>
                                        </div>
                                      </div>
                                    {:else}
                                      <AppChatbox />
                                    {/if}
                                  </div>
                                </div>

                                <!-- Layers on top of app -->
                                <NotificationDisplay />
                                <ConfirmationDisplay />
                                <PeekScreenDisplay />
                                <InstallPrompt />
                              </CustomThemeWrapper>
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
                                <InstallPrompt />
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
                          <DNDSelectionIndicators />
                        {/if}
                      </div>
                    </SnippetsProvider>
                  </TestUrlBindingsProvider>
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

  .chat-paused-shell {
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 0;
    background: transparent;
  }

  .chat-paused-nav {
    width: 340px;
    min-width: 340px;
    border-right: var(--border-light);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
  }

  .chat-paused-nav-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .chat-paused-nav-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .chat-paused-item {
    height: 44px;
    border-radius: 10px;
    background: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .chat-paused-main {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 0 32px 32px;
    box-sizing: border-box;
  }

  .chat-paused-main-header {
    width: 100%;
    padding: var(--spacing-l) 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    border-bottom: var(--border-light);
  }

  .chat-paused-line {
    border-radius: 999px;
    background: var(--spectrum-global-color-gray-200);
  }

  .chat-paused-line-title {
    width: 140px;
    height: 14px;
  }

  .chat-paused-line-subtitle {
    width: 92px;
    height: 10px;
  }

  .chat-paused-line-agent {
    width: 120px;
    height: 14px;
  }

  .chat-paused-badge {
    border-radius: 999px;
    border: 1px solid var(--spectrum-global-color-red-300);
    color: var(--spectrum-global-color-red-700);
    background: var(--spectrum-global-color-red-100);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    padding: 6px 10px;
  }

  .chat-paused-content {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    text-align: center;
    padding: var(--spacing-xxl) var(--spacing-xl);
  }

  .chat-paused-input {
    border: var(--border-light);
    border-radius: 12px;
    min-height: 52px;
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-l);
    background: var(--spectrum-alias-background-color-secondary);
  }

  @media (max-width: 1000px) {
    .chat-paused-shell {
      flex-direction: column;
    }

    .chat-paused-nav {
      width: 100%;
      min-width: 100%;
      border-right: 0;
      border-bottom: var(--border-light);
    }

    .chat-paused-main {
      padding: 0 var(--spacing-l) var(--spacing-l);
    }
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

  .chat-route-shell {
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    padding: var(--spacing-xl);
    background: var(--background-alt);
    box-sizing: border-box;
  }

  .chat-app-container {
    flex: 1 1 auto;
    display: flex;
    border-radius: 24px;
    border: var(--border-light);
    background: transparent;
    overflow: hidden;
    min-width: 0;
    min-height: 0;
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
  #clip-root.modal-mobile-preview {
    padding: 0;
  }
  #clip-root.modal-mobile-preview.mobile-preview {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1000px) {
    .chat-route-shell {
      padding: var(--spacing-m);
    }

    .chat-app-container {
      border-radius: 16px;
    }
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
