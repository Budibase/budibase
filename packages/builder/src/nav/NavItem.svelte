<script>
  import { store } from "../builderStore"
  import getIcon from "../common/icon"

  export let name = ""
  export let label = ""

  let navActive = ""

  store.subscribe(db => {
    navActive = db.activeNav === name
  })

  const setActive = () => store.setActiveNav(name)
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
