<script>
  import { writable, get } from "svelte/store"
  import { setContext, onMount } from "svelte"
  import { Layout, Heading, Body } from "@budibase/bbui"
  import ErrorSVG from "@budibase/frontend-core/assets/error.svg"
  import { Constants, CookieUtils } from "@budibase/frontend-core"
  import Component from "./Component.svelte"
  import SDK from "sdk"
  import {
    createContextStore,
    initialise,
    screenStore,
    authStore,
    routeStore,
    builderStore,
    themeStore,
    appStore,
    devToolsStore,
  } from "stores"
  import NotificationDisplay from "components/overlay/NotificationDisplay.svelte"
  import ConfirmationDisplay from "components/overlay/ConfirmationDisplay.svelte"
  import PeekScreenDisplay from "components/overlay/PeekScreenDisplay.svelte"
  import UserBindingsProvider from "components/context/UserBindingsProvider.svelte"
  import DeviceBindingsProvider from "components/context/DeviceBindingsProvider.svelte"
  import StateBindingsProvider from "components/context/StateBindingsProvider.svelte"
  import RowSelectionProvider from "components/context/RowSelectionProvider.svelte"
  import SettingsBar from "components/preview/SettingsBar.svelte"
  import SelectionIndicator from "components/preview/SelectionIndicator.svelte"
  import HoverIndicator from "components/preview/HoverIndicator.svelte"
  import CustomThemeWrapper from "./CustomThemeWrapper.svelte"
  import DNDHandler from "components/preview/DNDHandler.svelte"
  import KeyboardManager from "components/preview/KeyboardManager.svelte"
  import DevToolsHeader from "components/devtools/DevToolsHeader.svelte"
  import DevTools from "components/devtools/DevTools.svelte"

  // Provide contexts
  setContext("sdk", SDK)
  setContext("component", writable({}))
  setContext("context", createContextStore())

  let dataLoaded = false
  let permissionError = false

  // Load app config
  onMount(async () => {
    await initialise()
    await authStore.actions.fetchUser()
    dataLoaded = true
    if (get(builderStore).inBuilder) {
      builderStore.actions.notifyLoaded()
    } else {
      builderStore.actions.pingEndUser()
    }
  })

  // Handle no matching route - this is likely a permission error
  $: {
    if (dataLoaded && $routeStore.routerLoaded && !$routeStore.activeRoute) {
      if ($authStore) {
        // There is a logged in user, so handle them
        if ($screenStore.screens.length) {
          let firstRoute

          // If using devtools, find the first screen matching our role
          if ($devToolsStore.role) {
            const roleRoutes = $screenStore.screens.filter(
              screen => screen.routing?.roleId === $devToolsStore.role
            )
            firstRoute = roleRoutes[0]?.routing?.route || "/"
          }

          // Otherwise just use the first route
          else {
            firstRoute = $screenStore.screens[0]?.routing?.route ?? "/"
          }

          // Screens exist so navigate back to the home screen
          routeStore.actions.navigate(firstRoute)
        } else {
          // No screens likely means the user has no permissions to view this app
          permissionError = true
        }
      } else {
        // The user is not logged in, redirect them to login
        const returnUrl = `${window.location.pathname}${window.location.hash}`
        CookieUtils.setCookie(Constants.Cookies.ReturnUrl, returnUrl)
        window.location = "/builder/auth/login"
      }
    }
  }

  $: isDevPreview = $appStore.isDevApp && !$builderStore.inBuilder
</script>

{#if dataLoaded}
  <div
    id="spectrum-root"
    lang="en"
    dir="ltr"
    class="spectrum spectrum--medium {$themeStore.theme}"
  >
    {#if permissionError}
      <div class="error">
        <Layout justifyItems="center" gap="S">
          {@html ErrorSVG}
          <Heading size="L">You don't have permission to use this app</Heading>
          <Body size="S">Ask your administrator to grant you access</Body>
        </Layout>
      </div>
    {:else if $screenStore.activeLayout}
      <UserBindingsProvider>
        <DeviceBindingsProvider>
          <StateBindingsProvider>
            <RowSelectionProvider>
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
                class:tablet-preview={$builderStore.previewDevice === "tablet"}
                class:mobile-preview={$builderStore.previewDevice === "mobile"}
              >
                <!-- Actual app -->
                <div id="app-root">
                  {#if isDevPreview}
                    <DevToolsHeader />
                  {/if}

                  <div id="app-body">
                    <CustomThemeWrapper>
                      {#key `${$screenStore.activeLayout._id}-${$builderStore.previewType}`}
                        <Component
                          isLayout
                          instance={$screenStore.activeLayout.props}
                        />
                      {/key}

                      <!--
                        Flatpickr needs to be inside the theme wrapper.
                        It also needs its own container because otherwise it hijacks
                        key events on the whole page. It is painful to work with.
                      -->
                      <div id="flatpickr-root" />

                      <!-- Modal container to ensure they sit on top -->
                      <div class="modal-container" />

                      <!-- Layers on top of app -->
                      <NotificationDisplay />
                      <ConfirmationDisplay />
                      <PeekScreenDisplay />
                    </CustomThemeWrapper>

                    {#if $appStore.isDevApp && !$builderStore.inBuilder}
                      <DevTools />
                    {/if}
                  </div>
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
                {/if}
              </div>
            </RowSelectionProvider>
          </StateBindingsProvider>
        </DeviceBindingsProvider>
      </UserBindingsProvider>
    {/if}
  </div>
  <KeyboardManager />
{/if}

<style>
  #spectrum-root {
    padding: 0;
    margin: 0;
    overflow: hidden;
    height: 100%;
    width: 100%;
    background: transparent;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  #clip-root {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: transparent;
  }

  #app-root {
    overflow: hidden;
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
  }

  .error {
    position: absolute;
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
  /* The additional 6px of size is to account for 4px padding and 2px border */
  #clip-root.preview {
    padding: 2px;
  }

  #clip-root.tablet-preview {
    width: calc(1024px + 6px);
    height: calc(768px + 6px);
  }

  #clip-root.mobile-preview {
    width: calc(390px + 6px);
    height: calc(844px + 6px);
  }

  .preview #app-root {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
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
