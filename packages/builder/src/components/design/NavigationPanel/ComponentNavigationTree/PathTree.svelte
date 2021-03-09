<script>
  import {
    store,
    selectedComponent,
    currentAsset,
    screenSearchString,
  } from "builderStore"
  import instantiateStore from "./dragDropStore"
  import ComponentTree from "./ComponentTree.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenDropdownMenu from "./ScreenDropdownMenu.svelte"

  const ROUTE_NAME_MAP = {
    "/": {
      BASIC: "Home",
      PUBLIC: "Login",
    },
  }

  const dragDropStore = instantiateStore()

  export let route
  export let path
  export let indent
  export let border

  let routeManuallyOpened = false
  $: selectedScreen = $currentAsset
  $: allScreens = getAllScreens(route)
  $: filteredScreens = getFilteredScreens(allScreens, $screenSearchString)
  $: hasSearchMatch = $screenSearchString && filteredScreens.length > 0
  $: noSearchMatch = $screenSearchString && !filteredScreens.length
  $: routeSelected = route.subpaths[selectedScreen.routing.route] !== undefined
  $: routeOpened = routeManuallyOpened || routeSelected || hasSearchMatch

  const changeScreen = screenId => {
    store.actions.screens.select(screenId)

    // Reset manually opened flag every time a new screen is selected
    routeManuallyOpened = false
  }

  const getAllScreens = route => {
    let screens = []
    Object.entries(route.subpaths).forEach(([route, subpath]) => {
      Object.entries(subpath.screens).forEach(([role, id]) => {
        screens.push({ id, route, role })
      })
    })
    return screens
  }

  const getFilteredScreens = (screens, searchString) => {
    return screens.filter(
      screen => !searchString || screen.route.includes(searchString)
    )
  }
</script>

{#if !noSearchMatch}
  <NavItem
    icon="ri-folder-line"
    text={path}
    on:click={() => (routeManuallyOpened = !routeManuallyOpened)}
    opened={routeOpened}
    {border}
    withArrow={route.subpaths} />

  {#if routeOpened}
    {#each filteredScreens as screen (screen.id)}
      <NavItem
        icon="ri-artboard-2-line"
        indentLevel={indent || 1}
        selected={$store.selectedScreenId === screen.id}
        opened={$store.selectedScreenId === screen.id}
        text={ROUTE_NAME_MAP[screen.route]?.[screen.role] || screen.route}
        withArrow={route.subpaths}
        on:click={() => changeScreen(screen.id)}>
        <ScreenDropdownMenu screenId={screen.id} />
      </NavItem>
      {#if selectedScreen?._id === screen.id}
        <ComponentTree
          level={1}
          components={selectedScreen.props._children}
          currentComponent={$selectedComponent}
          {dragDropStore} />
      {/if}
    {/each}
  {/if}
{/if}
