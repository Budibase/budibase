<script>
  import { store } from "builderStore"
  import PathTree from "./PathTree.svelte"

  $: paths = Object.keys($store.routes || {}).sort()
</script>

<div class="root">
  {#each paths as path}
    <PathTree {path} route={$store.routes[path]} />
  {/each}
</div>
