<script>
  import {
    store,
    selectedComponent,
    currentAsset,
    screenSearchString,
  } from "builderStore"
  import instantiateStore from "./dragDropStore"
  import ComponentTree from "./ComponentTree.svelte"
  import PathDropdownMenu from "./PathDropdownMenu.svelte"
  import { get } from "svelte/store"

  const ROUTE_NAME_MAP = {
    "/": {
      BASIC: "Home",
      PUBLIC: "Home",
      ADMIN: "Home",
      POWER: "Home",
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
  $: hasSearchMatch = $screenSearchString && filteredScreens.length > 0
  $: noSearchMatch = $screenSearchString && !filteredScreens.length
  $: routeSelected =
    route.subpaths[selectedScreen?.routing?.route] !== undefined
  $: routeOpened = routeManuallyOpened || routeSelected || hasSearchMatch

  const changeScreen = screenId => {
    store.actions.screens.select(screenId)
  }

  const toggleManuallyOpened = () => {
    if (get(screenSearchString)) {
      return
    }
    routeManuallyOpened = !routeManuallyOpened
  }
</script>

{#if !noSearchMatch}
  <NavItem
    icon="FolderOutline"
    text={path}
    on:click={toggleManuallyOpened}
    opened={routeOpened}
    {border}
    withArrow={route.subpaths}
  >
    <PathDropdownMenu screens={allScreens} {path} />
  </NavItem>

  {#if routeOpened}{/if}
{/if}
