<script>
  import { goto } from "@sveltech/routify"
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"
  import { trimCharsStart, trimChars } from "lodash/fp"
  import { pipe } from "../../helpers"
  import { store } from "builderStore"
  import ScreenDropdownMenu from "./ScreenDropdownMenu.svelte"
  import { writable } from "svelte/store"
  import NavItem from "components/common/NavItem.svelte"

  export let screens = []

  $: sortedScreens = screens.sort(
    (s1, s2) => s1.props._instanceName > s2.props._instanceName
  )
  /* 
  Using a store here seems odd.... 
  have a look in the <ComponentsHierarchyChildren /> code file to find out why. 
  I have commented the dragDropStore parameter
  */
  const dragDropStore = writable({})

  let confirmDeleteDialog
  let componentToDelete = ""

  const normalizedName = name =>
    pipe(name, [
      trimCharsStart("./"),
      trimCharsStart("~/"),
      trimCharsStart("../"),
      trimChars(" "),
    ])

  const changeScreen = screen => {
    store.actions.screens.select(screen.props._instanceName)
    $goto(`./:page/${screen.props._instanceName}`)
  }
</script>

<div class="root">
  {#each sortedScreens as screen}
    <NavItem
      icon="ri-artboard-2-line"
      text={screen.props._instanceName}
      withArrow={screen.props._children.length}
      selected={$store.currentComponentInfo._id === screen.props._id}
      opened={$store.currentPreviewItem.name === screen.props._id}
      on:click={() => changeScreen(screen)}>
      <ScreenDropdownMenu {screen} />
    </NavItem>

    {#if $store.currentPreviewItem.props._instanceName && $store.currentPreviewItem.props._instanceName === screen.props._instanceName && screen.props._children}
      <ComponentsHierarchyChildren
        components={screen.props._children}
        currentComponent={$store.currentComponentInfo}
        {dragDropStore} />
    {/if}
  {/each}
</div>
