<script>
  import { store } from "../builderStore"
  import getIcon from "../common/icon"

  export let name = ""
  export let label = ""

  let navActive = ""

  store.subscribe(db => {
    navActive = db.activeNav === name ? "active" : ""
  })

  const setActive = () => store.setActiveNav(name)
</script>

<div class="nav-item {navActive}" on:click={setActive}>{label}</div>

<style>
  .nav-item {
    padding: 1.5rem 1rem 0rem 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    flex: 0 0 auto;
  }

  .nav-item:hover {
    background-color: var(--primary10);
  }

  .active {
    background-color: var(--primary10);
  }
</style>
