<script lang="ts">
  import { Modal, Divider } from "@budibase/bbui"
  import NavItem from "@/components/common/NavItem.svelte"
  import NewPill from "@/components/common/NewPill.svelte"
  import { permittedRoutes, flattenedRoutes } from "@/stores/routing"
  import { bb } from "@/stores/bb"
  import Router from "@/settings/Router.svelte"
  import RouteHeader from "@/settings/RouteHeader.svelte"
  import { tick } from "svelte"
  import { isRouteHREF, isSettingIcon, type Route } from "@/types/routing"
  import { beforeUrlChange, goto } from "@roxi/routify"
  import { onMount } from "svelte"

  export const show = () => {
    modal.show()
  }

  export const hide = () => {
    modal.hide()
  }

  let modal: Modal
  let scrolling = false
  let page: HTMLDivElement
  let settingsModalOpen = false

  $: ({ route, open } = $bb.settings ?? {})
  $: matchedRoute = route

  $beforeUrlChange(() => {
    // Triggered on page change AND when intercepting the modal close
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
  $: toggleSettings(open)

  $: groupEntries = Object.entries(routesByGroup || {})

  // Reset scroll when path changes
  $: resetScroll(matchedRoute?.entry?.path)

  // Pull out the default route
  $: defaultRoute = $flattenedRoutes.find(r => r.path === "/general/info")

  // Default path when none is set
  $: if (!matchedRoute && flattenedRoutes && open) {
    tick().then(() => {
      bb.settings(defaultRoute?.path || "/profile")
    })
  }

  // Handle the modal opening and stop the nav actions from leaving the current page
  $: open && history.pushState({ modal: true }, "", window.location.href)

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLDivElement
    scrolling = target?.scrollTop !== 0
  }

  const resetScroll = (path: string | undefined) => {
    if (page && page?.scrollTop > 0 && path) {
      page.scrollTop = 0
    }
  }

  const toggleSettings = (settingsOpen: boolean) => {
    if (!modal) return
    if (settingsOpen && !settingsModalOpen) {
      settingsModalOpen = true
      modal.show()
    } else {
      settingsModalOpen = false
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

  onMount(() => {
    function handlePopState(event: PopStateEvent) {
      if (open) {
        bb.hideSettings()
        // Prevent navigation as the modal is closing
        event.preventDefault()
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  })
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
        <div class="settings-nav">
          <div class="heading">Settings</div>
          <Divider noMargin size={"S"} />
          <div class="groups">
            {#each groupEntries as [key, group], idx}
              {#if key !== "none"}
                <div class="group-title">
                  {key}
                </div>
              {/if}
              {#each group || [] as route}
                <span
                  class="root-nav"
                  style={route.color ? `--routeColour:${route.color}` : ""}
                >
                  <NavItem
                    icon={typeof route?.icon === "string" ? route?.icon : null}
                    iconColor={route.color ||
                      "var(--spectrum-global-color-gray-800)"}
                    text={route.section || ""}
                    on:click={() => navItemClick(route)}
                    selected={route.section === matchedRoute?.entry?.section}
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
                      {#if route.new}
                        <NewPill />
                      {/if}
                    </svelte:fragment>
                  </NavItem>
                </span>
              {/each}
              {#if idx < groupEntries.length - 1 && idx > 0}
                <div class="group-divider"><Divider size="S" noMargin /></div>
              {/if}
            {/each}
          </div>
        </div>
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
  .setting-main .setting-page {
    padding-left: calc(var(--spacing-xl) * 2);
    padding-right: calc(var(--spacing-xl) * 2);
  }

  .root-nav :global(.custom-icon .spectrum-Avatar) {
    line-height: 0.8em;
  }

  .settings-nav :global(hr),
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
    padding: var(--spacing-s) calc(var(--spacing-l) + 4px);
    color: var(--spectrum-global-color-gray-900);
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

  .settings-nav {
    height: 100%;
    background-color: var(--background-alt);
    display: flex;
    flex-direction: column;
    border-top-left-radius: var(--spectrum-global-dimension-size-100);
    border-bottom-left-radius: var(--spectrum-global-dimension-size-100);
    min-width: 250px;
    border-right: 1px solid var(--spectrum-global-color-gray-300);
  }

  .setting-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
  }

  .settings-nav .heading {
    padding: var(--spacing-l) var(--spacing-xl);
    font-size: 16px;
    font-weight: 600;
    /* To accomodate page header action UI */
    min-height: 32px;
    display: flex;
    align-items: center;
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
</style>
