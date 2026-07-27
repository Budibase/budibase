<script lang="ts">
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import "@spectrum-css/treeview/dist/index-vars.css"
  import type { TreeViewContext } from "./context"

  export let quiet: boolean = false
  export let standalone: boolean = true
  export let width: string = "250px"
  export let selectable: boolean = false

  const treeViewContext: TreeViewContext = {
    selectable: writable(selectable),
    quiet: writable(quiet),
  }
  setContext("bbui-treeview", treeViewContext)

  $: treeViewContext.selectable.set(selectable)
  $: treeViewContext.quiet.set(quiet)
</script>

<ul
  class:spectrum-TreeView--standalone={standalone}
  class:spectrum-TreeView--quiet={quiet}
  class="spectrum-TreeView"
  style="width: {width}"
>
  <slot />
</ul>
