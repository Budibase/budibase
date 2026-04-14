<script lang="ts">
  import { setContext } from "svelte"
  import "@spectrum-css/treeview/dist/index-vars.css"

  export let quiet: boolean = false
  export let standalone: boolean = true
  export let width: string = "250px"
  export let selectable: boolean = false

  interface TreeViewContext {
    selectable: boolean
  }

  const treeViewContext: TreeViewContext = { selectable }
  setContext("bbui-treeview", treeViewContext)

  $: treeViewContext.selectable = selectable
</script>

<ul
  class:spectrum-TreeView--standalone={standalone}
  class:spectrum-TreeView--quiet={quiet}
  class="spectrum-TreeView"
  style="width: {width}"
>
  <slot />
</ul>
