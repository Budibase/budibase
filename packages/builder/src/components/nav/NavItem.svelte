<script>
  import { isActive, url, goto } from "@sveltech/routify"
  import getIcon from "../common/icon"
  import { backendUiStore } from "builderStore"

  export let name = ""
  export let label = ""
  export let href

  $: console.log("Active: ", $isActive(href))

  $: navActive = $backendUiStore.leftNavItem === name

  const setActive = () => backendUiStore.actions.navigate(name)
</script>

<div
  on:click={() => $goto($url(href))}
  class="budibase__nav-item backend-nav-item"
  class:selected={$isActive(href)}>
  {label}
</div>

<style>
  .backend-nav-item {
    padding-left: 25px;
    cursor: pointer;
  }
</style>
