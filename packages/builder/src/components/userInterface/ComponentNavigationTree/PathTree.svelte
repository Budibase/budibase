<script>
  import { writable } from "svelte/store"
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import instantiateStore from "./dragDropStore"

  import ComponentsTree from "./ComponentTree.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenDropdownMenu from "./ScreenDropdownMenu.svelte"

  const dragDropStore = instantiateStore()

  export let route
  export let path
  export let indent

  $: selectedScreen = $store.currentPreviewItem

  const changeScreen = screenId => {
    // select the route
    store.actions.screens.select(screenId)
    $goto(`./:page/${screenId}`)
  }
</script>

<NavItem
  icon="ri-route-line"
  text={path}
  opened={true}
  withArrow={route.subpaths}
  on:click={() => console.log(route)} />

{#each Object.keys(route.subpaths) as subpath}
  {#each Object.keys(route.subpaths[subpath].screens) as screen}
    <NavItem
      icon="ri-artboard-2-line"
      indentLevel={indent || 1}
      selected={$store.currentPreviewItem._id === route.subpaths[subpath].screens[screen]}
      opened={$store.currentPreviewItem._id === route.subpaths[subpath].screens[screen]}
      text={subpath}
      withArrow={route.subpaths}
      on:click={() => changeScreen(route.subpaths[subpath].screens[screen])}>
      <ScreenDropdownMenu screen={route.subpaths[subpath].screens[screen]} />
    </NavItem>
    {#if selectedScreen?._id === route.subpaths[subpath].screens[screen]}
      <ComponentsTree
        components={selectedScreen.props._children}
        currentComponent={$store.currentComponentInfo}
        {dragDropStore} />
    {/if}
  {/each}
{/each}
