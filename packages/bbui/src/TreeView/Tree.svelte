<script lang="ts">
  import { setContext } from "svelte"
  import "@spectrum-css/treeview/dist/index-vars.css"
  import type { TreeViewContext } from "./context"

  export let quiet: boolean = false
  export let standalone: boolean = true
  export let width: string = "250px"
  export let selectable: boolean = false

  const treeViewContext: TreeViewContext = { selectable, quiet }
  setContext("bbui-treeview", treeViewContext)

  $: treeViewContext.selectable = selectable
  $: treeViewContext.quiet = quiet
</script>

<ul
  class:spectrum-TreeView--standalone={standalone}
  class:spectrum-TreeView--quiet={quiet}
  class="spectrum-TreeView"
  style="width: {width}"
>
  <slot />
</ul>
