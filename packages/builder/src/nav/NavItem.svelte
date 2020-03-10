<script>
  import { getContext, setContext } from "svelte"; 
  import getIcon from "../common/icon"

  export let name = ""
  export let label = ""

  $: navActive = getContext("activeNav") === name 

  // store.subscribe(db => {
  //   navActive = db.activeNav === name
  // })

  const setActive = () => setContext("activeNav", name);
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
