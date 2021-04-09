<script>
    import "@spectrum-css/link/dist/index-vars.css"

    export let href = "#"
    export let size = "M"
    export let quiet = false;
    export let primary = false;
    export let secondary = false;
    export let overBackground = false
</script>

<a {href} class="spectrum-Link 
    spectrum-Link--size{size}
    {primary && 'spectrum-Link--primary'}
    {secondary && 'spectrum-Link--secondary'}
    {overBackground && 'spectrum-Link--overBackground'}
    {quiet && 'spectrum-Link--quiet'}"><slot /></a>