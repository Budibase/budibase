<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import PathTree from "./PathTree.svelte"
</script>

<div class="root">
  {#each Object.keys($store.routes || {}) as path}
    <PathTree {path} route={$store.routes[path]} />
  {/each}
</div>
