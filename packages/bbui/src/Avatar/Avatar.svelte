<script>
    import "@spectrum-css/avatar/dist/index-vars.css"
    export let url = "";
    export let disabled = false;
</script>

<img class:is-disabled={disabled} class="spectrum-Avatar" src={url} alt="Avatar">