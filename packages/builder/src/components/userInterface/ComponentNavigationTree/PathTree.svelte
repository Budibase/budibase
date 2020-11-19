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
  export let indent

  $: console.log(route)
  $: console.log("preview", $store.currentPreviewItem)
  $: selectedScreen = $store.currentPreviewItem

  const changeScreen = screenId => {
    // select the route
    store.actions.screens.select(screenId)
    $goto(`./:page/${screenId}`)
  }
</script>

<NavItem
  icon="ri-route-line"
  text={route.fullpath}
  withArrow={route.subpaths}
  on:click={() => console.log(route)} />

{#each Object.keys(route.screens) as screen}
  <NavItem
    icon="ri-artboard-2-line"
    indentLevel={indent || 1}
    selected={$store.currentPreviewItem._id === route.screens[screen]}
    opened={$store.currentPreviewItem._id === route.screens[screen]}
    text={screen || 'DEFAULT'}
    withArrow={route.subpaths}
    on:click={() => changeScreen(route.screens[screen])}>
    <ScreenDropdownMenu screen={route.screens[screen]} />
  </NavItem>
  {#if selectedScreen?._id === route.screens[screen]}
    <ComponentsTree
      components={selectedScreen.props._children}
      currentComponent={$store.currentComponentInfo}
      {dragDropStore} />
  {/if}
{/each}
{#each Object.keys(route.subpaths) as subpath}
  <svelte:self route={route.subpaths[subpath]} indent={2} />
{/each}
