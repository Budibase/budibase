<script>
  import getIcon from "../common/icon"
  import { backendUiStore } from "../builderStore";

  export let name = ""
  export let label = ""

  $: navActive = $backendUiStore.leftNavItem === name 

  const setActive = () => backendUiStore.actions.navigate(name)
</script>

<div
  class="budibase__nav-item backend-nav-item"
  class:selected={navActive}
  on:click={setActive}>
  {label}
</div>

<style>
  .backend-nav-item {
    padding-left: 25px;
  }
</style>
