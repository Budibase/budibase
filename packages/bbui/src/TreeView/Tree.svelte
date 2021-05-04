<script>
  import "@spectrum-css/treeview/dist/index-vars.css"

  export let quiet = false
  export let standalone = true
  export let width = "250px"
</script>

<ul
  class:spectrum-TreeView--standalone={standalone}
  class:spectrum-TreeView--quiet={quiet}
  class="spectrum-TreeView"
  style="width: {width}"
>
  <slot />
</ul>
