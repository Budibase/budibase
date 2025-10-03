<script lang="ts">
  import { Modal, Divider, Body, StatusLight, Icon } from "@budibase/bbui"
  import NewPill from "@/components/common/NewPill.svelte"
  import { permittedRoutes, flattenedRoutes } from "@/stores/routing"
  import { bb } from "@/stores/bb"
  import Router from "@/settings/Router.svelte"
  import RouteHeader from "@/settings/RouteHeader.svelte"
  import { tick } from "svelte"
  import {
    isRouteHREF,
    isSettingIcon,
    type MatchedRoute,
    type Route,
  } from "@/types/routing"
  import { beforeUrlChange, goto } from "@roxi/routify"
  import ModalSideBar from "./ModalSideBar.svelte"
  import SideNavLink from "@/pages/builder/workspace/[application]/_components/SideNav/SideNavLink.svelte"

  export const show = () => modal.show()

  export const hide = () => modal.hide()

  let modal: Modal
  let scrolling = false
  let page: HTMLDivElement
  let modalOpen = false
  let settingsSideBarCollapsed = false
  let settingsNav: ModalSideBar

  $: ({ route, open } = $bb.settings ?? {})
  $: matchedRoute = route

  $beforeUrlChange(() => {
    bb.hideSettings()
    return true
  })

  // Original structure
  $: routes = $permittedRoutes

  // Split by assigned group
  $: routesByGroup = routes.reduce(
    (acc: Record<string, Route[]>, entry: Route) => {
      const group: Route[] = (acc[entry.group || "none"] ??= [])
      group.push(entry)
      return acc
    },
    {}
  )

  // Show/Hide the settings modal as required
  $: modal, toggleSettings(open)

  $: groupEntries = Object.entries(routesByGroup || {})

  // Reset scroll when path changes
  $: resetScroll(matchedRoute?.entry?.path)

  // Pull out the default route
  $: defaultRoute = $flattenedRoutes.find(r => r.path === "/general/info")

  // Determine the path when opened
  $: handlePath($flattenedRoutes, open, matchedRoute)

  const handlePath = (
    routes: Route[],
    open: boolean,
    matchedRoute?: MatchedRoute
  ) => {
    if (routes && open === true) {
      if (!matchedRoute) {
        // Default path when none is set
        tick().then(() => {
          bb.settings(defaultRoute?.path || "/profile")
        })
      } else {
        const isValidPath = routes.find(
          r => r.path === matchedRoute?.entry?.path
        )

        // When the user reopens the modal an the
        if (!isValidPath) {
          tick().then(() => {
            bb.settings(defaultRoute?.path || "/profile")
          })
        }
      }
    }
  }

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLDivElement
    scrolling = target?.scrollTop !== 0
  }

  const resetScroll = (path: string | undefined) => {
    if (page && page?.scrollTop > 0 && path) {
      page.scrollTop = 0
    }
  }

  const toggleSettings = async (settingsOpen: boolean) => {
    if (!modal) return
    if (settingsOpen && !modalOpen) {
      modalOpen = true
      modal.show()
    } else if (!settingsOpen && modalOpen) {
      modalOpen = false
      modal.hide()
    }
  }

  const navItemClick = (route: Route) => {
    const { routes } = route
    let path

    // Handle urls
    if (route.href) {
      if (isRouteHREF(route.href)) {
        const { url, target } = route.href
        window.open(url, target || "_blank")
      } else {
        $goto(route.href)
      }
      return
    }

    if (routes?.length) {
      // Default to first route
      const landing = routes?.[0]
      // NOTE - route.path can be optional
      path = `${route.path}/${landing.path}`
    } else {
      // When there are no routes, defer to the main path
      path = route.path
    }
    bb.settings(`/${path}`)
  }
</script>

<div class="settings-wrap">
  <Modal bind:this={modal} on:hide>
    <div
      class="settings-dialog spectrum-Dialog spectrum-Dialog--extraLarge"
      style="position: relative;"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
    >
      <section class="spectrum-Dialog-content">
        <ModalSideBar
          bind:this={settingsNav}
          on:toggle={e => {
            settingsSideBarCollapsed = e.detail
          }}
        >
          <div slot="header_icon">
            <Icon name="gear" />
          </div>
          <div class="groups" class:full={!settingsSideBarCollapsed}>
            {#each groupEntries as [key, group], idx}
              {#if key !== "none"}
                <div class="group-title">
                  <div class="placeholder">
                    <Icon
                      name="dot-outline"
                      color="var(--spectrum-global-color-gray-700)"
                    />
                  </div>
                  <div class="group-title-text">
                    <Body
                      color="var(--spectrum-global-color-gray-700)"
                      size="XS"
                    >
                      {key}
                    </Body>
                  </div>
                </div>
              {/if}
              {#each group || [] as route}
                {@const selected =
                  route.section === matchedRoute?.entry?.section}
                <span
                  class="root-nav"
                  class:selected
                  class:error={route?.error?.()}
                  style={route.color ? `--routeColour:${route.color}` : ""}
                >
                  {#if (route.new || route?.error?.()) && settingsSideBarCollapsed}
                    <span class="status-indicator">
                      <StatusLight
                        color={route?.error?.()
                          ? "var(--spectrum-global-color-static-red-600)"
                          : "#433872"}
                        size="M"
                      />
                    </span>
                  {/if}
                  <SideNavLink
                    icon={typeof route?.icon === "string"
                      ? route?.icon
                      : undefined}
                    text={route.section || ""}
                    collapsed={settingsSideBarCollapsed}
                    on:click={() => {
                      settingsNav.keepCollapsed()
                      navItemClick(route)
                    }}
                    forceActive={selected}
                    iconColor={route.color ||
                      "var(--spectrum-global-color-gray-800)"}
                  >
                    <svelte:fragment slot="icon">
                      {#if route.icon && isSettingIcon(route.icon)}
                        <div class="custom-icon">
                          <svelte:component
                            this={route.icon.comp}
                            {...route.icon.props}
                          />
                        </div>
                      {/if}
                    </svelte:fragment>

                    <svelte:fragment slot="right">
                      {#if route.error?.()}
                        <StatusLight
                          color={"var(--spectrum-global-color-static-red-600)"}
                          size="M"
                        />
                      {:else if route.new}
                        <NewPill />
                      {/if}
                    </svelte:fragment>
                  </SideNavLink>
                </span>
              {/each}
              {#if idx < groupEntries.length - 1}
                <div class="group-divider"><Divider size="S" noMargin /></div>
              {/if}
            {/each}
          </div>
        </ModalSideBar>
        <div class="setting-main" class:scrolling>
          <RouteHeader />
          <div bind:this={page} class="setting-page" on:scroll={handleScroll}>
            <Router route={matchedRoute} />
          </div>
        </div>
      </section>
    </div>
  </Modal>
</div>

<style>
  .status-indicator {
    position: absolute;
    top: -10px;
    z-index: 3;
    right: -6px;
  }

  .status-indicator :global(.spectrum-StatusLight::before) {
    border: 0.5px solid #5645a1;
  }

  .root-nav .status-indicator :global(.spectrum-StatusLight::before) {
    border: unset;
  }

  .setting-main .setting-page {
    padding-left: calc(var(--spacing-xl) * 2);
    padding-right: calc(var(--spacing-xl) * 2);
  }

  .groups .root-nav:first-of-type {
    height: 48px;
    display: flex;
    width: 100%;
    align-items: center;
  }

  .groups .root-nav:first-of-type :global(.link) {
    width: 100%;
  }

  .groups .group-divider:first-of-type {
    margin-top: 0px;
  }

  .root-nav {
    position: relative;
  }
  .root-nav :global(.custom-icon .spectrum-Avatar) {
    line-height: 0.8em;
  }

  .setting-main :global(hr) {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .groups > .root-nav:first-of-type :global(.nav-item) {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  /* This was breaking the grid layout for pages */
  .setting-page :global(.container .spectrum-Dialog-divider) {
    grid-area: unset;
  }

  .root-nav :global(.nav-item-body) {
    color: var(--routeColour);
    font-size: 14px;
  }

  .group-divider {
    margin: var(--spacing-s) 0px;
  }

  .group-title {
    padding: 0 calc(var(--nav-padding) / 2);
    color: var(--spectrum-global-color-gray-900);
    position: relative;
    padding: 0 calc(var(--nav-padding) / 2);
    margin: 8px 0;
  }

  .group-title .group-title-text {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0ms,
      visibility 0ms;
    position: absolute;
  }

  .groups.full .group-title .group-title-text {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 200ms ease-in,
      visibility 0ms;
    position: static;
  }

  .placeholder {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 200ms ease-in,
      visibility 0ms;
  }

  .groups.full .group-title .placeholder {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0ms,
      visibility 0ms;
    position: absolute;
  }

  .group-title :global(p) {
    text-transform: uppercase;
  }

  .groups:not(.full) .root-nav:not(.selected) .status-indicator {
    top: -5px;
    right: -5px;
  }

  .setting-page {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: var(--spacing-l);
  }

  .setting-page :global(> *) {
    padding-bottom: 30px;
  }

  .setting-main .setting-page {
    transition: box-shadow 0.2s ease;
  }

  .setting-main.scrolling .setting-page {
    box-shadow: inset 0px 15px 10px -10px rgba(0, 0, 0, 0.2);
  }

  .spectrum-Dialog.spectrum-Dialog--extraLarge {
    width: 1150px;
    min-height: 720px;
    height: 720px;
  }

  .spectrum-Dialog-content {
    margin: 0px;
    padding: 0px;
    border-radius: var(--spectrum-global-dimension-size-100);
    width: 100%;
    height: 100%;
  }

  .spectrum-Dialog-content {
    display: flex;
    height: 100%;
  }

  .setting-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
  }

  .custom-icon {
    flex: 0 0 24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
    order: 1;
    margin-right: 2px;
  }

  .spectrum-Dialog-content :global(.nav_wrapper .nav) {
    border-top-left-radius: var(--spectrum-global-dimension-size-100);
    border-bottom-left-radius: var(--spectrum-global-dimension-size-100);
  }

  .spectrum-Dialog-content :global(.nav_header) {
    padding-top: var(--spacing-l);
    padding-bottom: var(--spacing-l);
    flex: 0 0 32px;
  }
</style>
