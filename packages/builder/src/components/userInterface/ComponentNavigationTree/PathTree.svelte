<script>
  import { writable } from "svelte/store"
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import instantiateStore from "./dragDropStore"

  import ComponentTree from "./ComponentTree.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenDropdownMenu from "./ScreenDropdownMenu.svelte"

  const dragDropStore = instantiateStore();

  export let route
  export let path
  export let indent

  $: selectedScreen = $store.currentPreviewItem

  const changeScreen = screenId => {
    // select the route
    store.actions.screens.select(screenId)
    $goto(`./screens/${screenId}`)
  }
</script>

<NavItem
  icon="ri-folder-line"
  text={path}
  opened={true}
  withArrow={route.subpaths} />

{#each Object.entries(route.subpaths) as [url, subpath]}
  {#each Object.values(subpath.screens) as screenId}
    <NavItem
      icon="ri-artboard-2-line"
      indentLevel={indent || 1}
      selected={$store.currentPreviewItem._id === screenId}
      opened={$store.currentPreviewItem._id === screenId}
      text={url === '/' ? 'Home' : url}
      withArrow={route.subpaths}
      on:click={() => changeScreen(screenId)}>
      <ScreenDropdownMenu {screenId} />
    </NavItem>
    {#if selectedScreen?._id === screenId}
      <ComponentTree
        components={selectedScreen.props._children}
        currentComponent={$store.currentComponentInfo}
        {dragDropStore}
      />
    {/if}
  {/each}
{/each}
