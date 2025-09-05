<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { Heading, Icon, clickOutside } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import NavItem from "./NavItem.svelte"
  import UserMenu from "./UserMenu.svelte"
  import Logo from "./Logo.svelte"
  import {
    getActiveConditions,
    reduceConditionActions,
  } from "@/utils/conditions"

  const sdk = getContext("sdk")
  const {
    routeStore,
    roleStore,
    linkable,
    builderStore,
    sidePanelStore,
    modalStore,
  } = sdk
  const context = getContext("context")
  const navStateStore = writable({})

  // Legacy props which must remain unchanged for backwards compatibility
  export let title
  export let hideTitle = false
  export let logoUrl
  export let hideLogo = false
  export let navigation = "Top"
  export let sticky = false
  export let links
  export let width = "Large"

  // New props from new design UI
  export let navBackground
  export let navTextColor
  export let navWidth
  export let pageWidth
  export let logoLinkUrl
  export let logoHeight
  export let openLogoLinkInNewTab
  export let textAlign
  export let embedded = false

  const NavigationClasses = {
    Top: "top",
    Left: "left",
    None: "none",
  }
  const WidthClasses = {
    Max: "max",
    Large: "l",
    Medium: "m",
    Small: "s",
    "Extra small": "xs",
  }

  export let logoPosition = "top" // "top" or "bottom"
  export let titleSize = "S"
  export let titleColor // CSS color string, only affects title

  let mobileOpen = false

  // Set some layout context. This isn't used in bindings but can be used
  // determine things about the current app layout.
  $: mobile = $context.device.mobile
  const store = writable({ headerHeight: 0 })
  $: store.set({
    screenXOffset: getScreenXOffset(navigation, mobile),
    screenYOffset: getScreenYOffset(navigation, mobile),
  })
  setContext("layout", store)

  $: enrichedNavItems = enrichNavItems(links, $roleStore)
  $: typeClass = NavigationClasses[navigation] || NavigationClasses.None
  $: navWidthClass = WidthClasses[navWidth || width] || WidthClasses.Large
  $: pageWidthClass = WidthClasses[pageWidth || width] || WidthClasses.Large
  $: navStyle = getNavStyle(
    navBackground,
    navTextColor,
    logoHeight,
    $context.device.width,
    $context.device.height
  )
  $: autoCloseSidePanel =
    !$builderStore.inBuilder &&
    $sidePanelStore.open &&
    !$sidePanelStore.ignoreClicksOutside

  $: screenId = $builderStore.inBuilder
    ? `${$builderStore.screen?._id}-screen`
    : "screen"
  $: navigationId = $builderStore.inBuilder
    ? `${$builderStore.screen?._id}-navigation`
    : "navigation"

  // Scroll navigation into view if selected.
  // Memoize into a primitive to avoid spamming this whenever builder store
  // changes.
  $: selected =
    $builderStore.inBuilder &&
    $builderStore.selectedComponentId?.endsWith("-navigation")
  $: {
    if (selected) {
      const node = document.getElementsByClassName("nav-wrapper")?.[0]
      if (node) {
        node.style.scrollMargin = "100px"
        node.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        })
      }
    }
  }

  const enrichNavItem = navItem => {
    const internalLink = isInternal(navItem.url)
    return {
      ...navItem,
      internalLink,
      url: internalLink ? navItem.url : ensureExternal(navItem.url),
    }
  }

  const enrichNavItems = (navItems, userRoleHierarchy) => {
    if (!navItems?.length) {
      return []
    }
    return navItems
      .filter(navItem => {
        // Strip nav items without text
        if (!navItem.text) {
          return false
        }

        // Strip out links without URLs
        if (navItem.type !== "sublinks" && !navItem.url) {
          return false
        }

        // Filter to only links allowed by the current role
        const role = navItem.roleId || Constants.Roles.BASIC
        return userRoleHierarchy?.find(roleId => roleId === role)
      })
      .map(navItem => {
        const enrichedNavItem = enrichNavItem(navItem)
        if (navItem.type === "sublinks" && navItem.subLinks?.length) {
          enrichedNavItem.subLinks = navItem.subLinks
            .filter(subLink => subLink.text && subLink.url)
            .map(enrichNavItem)
        }
        return enrichedNavItem
      })
  }

  function evaluateNavItemConditions(conditions = []) {
    if (!conditions?.length) return true

    // Get only the active (matching) conditions
    const activeConditions = getActiveConditions(conditions)
    const { visible } = reduceConditionActions(activeConditions)

    if (visible == null) {
      // If any show condition exists, default to hidden unless one matches
      const hasShow = conditions.some(cond => cond.action === "show")
      return hasShow ? false : true
    }
    return visible
  }

  const isInternal = url => {
    return url?.startsWith("/")
  }

  const ensureExternal = url => {
    if (!url?.length) {
      return url
    }
    return !url.startsWith("http") ? `http://${url}` : url
  }

  const getScreenXOffset = (navigation, mobile) => {
    if (navigation !== "Left") {
      return 0
    }
    return mobile ? "0px" : "250px"
  }
  const getScreenYOffset = (navigation, mobile) => {
    if (mobile) {
      return !navigation || navigation === "None" ? 0 : "61px"
    } else {
      return navigation === "Top" ? "137px" : "0px"
    }
  }

  const getNavStyle = (
    backgroundColor,
    textColor,
    logoHeight,
    width,
    height
  ) => {
    let style = `--width:${width}px; --height:${height}px;`
    if (backgroundColor) {
      style += `--navBackground:${backgroundColor};`
    }
    if (textColor) {
      style += `--navTextColor:${textColor};`
    }
    style += `--logoHeight:${logoHeight || 24}px;`
    return style
  }

  const getSanitizedUrl = (url, openInNewTab) => {
    if (!isInternal(url)) {
      return ensureExternal(url)
    }
    if (openInNewTab) {
      return `#${url}`
    }
    return url
  }

  const handleClickLink = () => {
    mobileOpen = false
    sidePanelStore.actions.close()
    modalStore.actions.close()
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="component layout layout--{typeClass}"
  class:desktop={!mobile}
  class:mobile={!!mobile}
  data-id={screenId}
  data-name="Screen"
  data-icon="browser"
>
  <div class="screen-wrapper layout-body">
    {#if typeClass !== "none"}
      <div
        class="interactive component {navigationId}"
        data-id={navigationId}
        data-name="Navigation"
        data-icon="eye"
      >
        <div
          class="nav-wrapper {navigationId}-dom"
          class:sticky
          class:hidden={$routeStore.queryParams?.peek}
          class:clickable={$builderStore.inBuilder}
          on:click={$builderStore.inBuilder
            ? builderStore.actions.selectComponent(navigationId)
            : null}
          style={navStyle}
        >
          <div class="nav nav--{typeClass} size--{navWidthClass}">
            <div class="nav-header">
              {#if enrichedNavItems.length}
                <div class="burger">
                  <Icon
                    hoverable
                    name="list"
                    color="var(--navTextColor)"
                    on:click={() => (mobileOpen = !mobileOpen)}
                  />
                </div>
              {/if}
              <div class="logo">
                {#if logoPosition === "top"}
                  <Logo
                    {logoUrl}
                    {logoLinkUrl}
                    {openLogoLinkInNewTab}
                    {hideLogo}
                    {title}
                    {linkable}
                    {isInternal}
                    {getSanitizedUrl}
                  />
                {/if}
                {#if !hideTitle && title}
                  <Heading size={titleSize} {textAlign} color={titleColor}>
                    {title}
                  </Heading>
                {/if}
              </div>
              {#if !embedded}
                <div class="user top">
                  <UserMenu compact />
                </div>
              {/if}
            </div>
            <div
              class="mobile-click-handler"
              class:visible={mobileOpen}
              on:click={() => (mobileOpen = false)}
            />
            {#if enrichedNavItems.length}
              <div class="links" class:visible={mobileOpen}>
                {#each enrichedNavItems as navItem}
                  {#if evaluateNavItemConditions(navItem._conditions)}
                    <NavItem
                      type={navItem.type}
                      text={navItem.text}
                      url={navItem.url}
                      subLinks={navItem.subLinks}
                      icon={navItem.icon}
                      internalLink={navItem.internalLink}
                      customStyles={navItem._styles?.custom}
                      on:clickLink={handleClickLink}
                      leftNav={navigation === "Left"}
                      {mobile}
                      {navStateStore}
                    />
                  {/if}
                {/each}
              </div>
            {/if}
            {#if !embedded}
              <div class="user left">
                <UserMenu />
                {#if logoPosition === "bottom"}
                  <div>
                    <Logo
                      {logoUrl}
                      {logoLinkUrl}
                      {openLogoLinkInNewTab}
                      {hideLogo}
                      {title}
                      {linkable}
                      {isInternal}
                      {getSanitizedUrl}
                    />
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    <div
      class="main-wrapper"
      on:click={() => {
        if ($builderStore.inBuilder) {
          builderStore.actions.selectComponent(screenId)
        }
      }}
    >
      <div class="main size--{pageWidthClass}">
        <slot />
      </div>
    </div>
  </div>
  <div
    id="side-panel-container"
    class:open={$sidePanelStore.open}
    use:clickOutside={autoCloseSidePanel ? sidePanelStore.actions.close : null}
    class:builder={$builderStore.inBuilder}
  >
    <div class="side-panel-header">
      <Icon
        color="var(--spectrum-global-color-gray-600)"
        name="caret-line-right"
        hoverable
        on:click={sidePanelStore.actions.close}
      />
    </div>
  </div>
  <div class="modal-container" />
</div>

<style>
  /*  Main components */
  .layout {
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    z-index: 1;
    overflow: hidden;
    position: relative;

    /* Deliberately unitless as we need to do unitless calculations in grids */
    --grid-spacing: 4;
  }
  .component {
    display: contents;
  }
  .layout-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
    overflow: auto;
    overflow-x: hidden;
    position: relative;
    background: var(--spectrum-alias-background-color-secondary);
  }

  .nav-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    background: var(--navBackground);
    z-index: 2;
  }
  .nav-wrapper.clickable {
    cursor: pointer;
  }
  .nav-wrapper.clickable .nav {
    pointer-events: none;
  }
  .nav-wrapper.hidden {
    display: none;
  }
  .layout--top .nav-wrapper.sticky {
    position: sticky;
    top: 0;
    left: 0;
  }

  .nav {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 18px 32px 18px 32px;
    max-width: 100%;
    gap: var(--spacing-xs);
  }
  .nav :global(.icon) {
    color: var(--navTextColor);
    opacity: 0.75;
  }
  .nav :global(.icon:hover) {
    color: var(--navTextColor);
    opacity: 1;
  }
  .nav :global(h1) {
    color: var(--navTextColor);
  }
  .nav-header {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
  }

  #side-panel-container {
    max-width: calc(100vw - 40px);
    background: var(--spectrum-global-color-gray-50);
    z-index: 3;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: 30px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 130ms ease-out;
    position: absolute;
    width: 400px;
    right: 0;
    transform: translateX(100%);
    height: 100%;
  }
  #side-panel-container.builder {
    transform: translateX(0);
    opacity: 0;
    pointer-events: none;
  }
  #side-panel-container.open {
    transform: translateX(0);
    box-shadow: 0 0 40px 10px rgba(0, 0, 0, 0.1);
  }
  #side-panel-container.builder.open {
    opacity: 1;
    pointer-events: all;
  }
  .side-panel-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .main-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    flex: 1 1 auto;
    z-index: 1;
  }
  .main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    max-width: 100%;
    position: relative;
    padding: 32px;
  }
  .main:not(.size--max):has(.screenslot-dom > .component > .grid) {
    padding: calc(32px - var(--grid-spacing) * 2px);
  }

  .layout--none .main {
    padding: 0;
  }
  .size--xs {
    width: 400px;
  }
  .size--s {
    width: 800px;
  }
  .size--m {
    width: 1100px;
  }
  .size--l {
    width: 1400px;
  }
  .size--max {
    width: 100%;
  }
  .main.size--max {
    padding: 0;
  }

  /*  Nav components */
  .burger {
    display: none;
  }
  .logo {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
    flex: 1 1 auto;
  }
  .logo :global(h1) {
    font-weight: 600;
    flex: 1 1 auto;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .links {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }
  .mobile-click-handler {
    display: none;
  }

  /* Left overrides for both desktop and mobile */
  .nav--left {
    overflow-y: auto;
  }

  /* Desktop nav overrides */
  .desktop.layout--left .layout-body {
    flex-direction: row;
    overflow: hidden;
  }
  .desktop.layout--left .main-wrapper {
    height: 100%;
    overflow: auto;
  }
  .desktop .nav--left {
    width: 250px;
    padding: var(--spacing-xl);
  }
  .desktop .nav--left .links {
    margin-top: var(--spacing-m);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xs);
  }
  .desktop .nav--left .user.top,
  .desktop .nav--top .user.left {
    display: none;
  }

  /* Mobile nav overrides */
  .mobile .nav-wrapper {
    position: sticky;
    top: 0;
    left: 0;
    box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.075);
  }
  .user.left {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .mobile .user.left {
    display: none;
  }

  /* Force standard top bar */
  .mobile .nav {
    padding: var(--spacing-m) 16px;
  }
  .mobile .burger {
    display: grid;
    place-items: center;
  }
  .mobile .logo {
    flex: 0 0 auto;
  }
  .mobile .logo :global(h1) {
    display: none;
  }

  /* Reduce padding */
  .mobile:not(.layout--none) .main {
    padding: 16px;
  }
  .mobile:not(.layout--none)
    .main:not(.size--max):has(.screenslot-dom > .component > .grid) {
    padding: 6px;
  }
  .mobile .main.size--max {
    padding: 0;
  }

  /* Transform links into drawer */
  .mobile .links {
    margin-top: 0;
    position: absolute;
    top: 0;
    left: -250px;
    transform: translateX(0);
    width: 250px;
    max-width: 75%;
    transition:
      transform 0.26s ease-in-out,
      opacity 0.26s ease-in-out;
    height: var(--height);
    opacity: 0;
    background: var(--navBackground);
    z-index: 999;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: var(--spacing-xl);
    overflow-y: auto;
    gap: var(--spacing-xs);
  }
  .mobile .links :global(a) {
    flex: 0 0 auto;
  }
  .mobile .links.visible {
    opacity: 1;
    transform: translateX(250px);
    box-shadow: 0 0 80px 20px rgba(0, 0, 0, 0.3);
  }
  .mobile .mobile-click-handler.visible {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: var(--width);
    height: var(--height);
    z-index: 998;
  }

  /* Print styles */
  @media print {
    .layout,
    .main-wrapper {
      overflow: visible !important;
    }
    .nav-wrapper {
      display: none !important;
    }
    .layout {
      flex-direction: column !important;
      justify-content: flex-start !important;
      align-items: stretch !important;
    }
  }
</style>
