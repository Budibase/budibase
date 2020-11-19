<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import PathTree from "./PathTree.svelte"

  export let routes = {}
</script>

<div class="root">
  {#each Object.keys(routes) as path}
    <PathTree {path} route={routes[path]} />
  {/each}
</div>
