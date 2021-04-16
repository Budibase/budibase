<script>
    import "@spectrum-css/treeview/dist/index-vars.css"

    export let quiet = false
    export let width;
</script>

<ul class:spectrum-TreeView--quiet={quiet} class="spectrum-TreeView" style="width: {width}">
    <slot />
</ul>