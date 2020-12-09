<script>
  import { writable } from "svelte/store"
  import { goto } from "@sveltech/routify"
  import { store, selectedComponent, currentAsset } from "builderStore"
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

  $: selectedScreen = $currentAsset

  const changeScreen = screenId => {
    // select the route
    store.actions.screens.select(screenId)
    $goto(`./${screenId}`)
  }
</script>

<NavItem
  icon="ri-folder-line"
  text={path}
  opened={true}
  {border}
  withArrow={route.subpaths} />

{#each Object.entries(route.subpaths) as [url, subpath]}
  {#each Object.entries(subpath.screens) as [role, screenId]}
    <NavItem
      icon="ri-artboard-2-line"
      indentLevel={indent || 1}
      selected={$store.currentAssetId === screenId}
      opened={$store.currentAssetId === screenId}
      text={ROUTE_NAME_MAP[url]?.[role] || url}
      withArrow={route.subpaths}
      on:click={() => changeScreen(screenId)}>
      <ScreenDropdownMenu {screenId} />
    </NavItem>
    {#if selectedScreen?._id === screenId}
      <ComponentTree
        level={1}
        components={selectedScreen.props._children}
        currentComponent={$selectedComponent}
        {dragDropStore} />
    {/if}
  {/each}
{/each}
