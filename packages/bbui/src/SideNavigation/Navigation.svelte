<script>
  import { setContext } from "svelte"
  import "@spectrum-css/sidenav/dist/index-vars.css"

  export let multilevel = false
  setContext("sidenav-type", multilevel)
</script>

<nav>
  <ul class="spectrum-SideNav" class:spectrum-SideNav--multiLevel={multilevel}>
    <slot />
  </ul>
</nav>
