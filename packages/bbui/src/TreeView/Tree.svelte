<script lang="ts">
  import "@spectrum-css/treeview/dist/index-vars.css"

  export let quiet: boolean = false
  export let standalone: boolean = true
  export let width: string = "250px"
</script>

<ul
  class:spectrum-TreeView--standalone={standalone}
  class:spectrum-TreeView--quiet={quiet}
  class="spectrum-TreeView"
  style="width: {width}"
>
  <slot />
</ul>
