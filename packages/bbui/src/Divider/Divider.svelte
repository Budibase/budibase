<script>
    import "@spectrum-css/divider/dist/index-vars.css"
    export let l = false
    export let m = false
    export let s = false
    
    export let vertical = false
</script>

<hr
    class:spectrum-Divider--sizeL={l}
    class:spectrum-Divider--sizeM={m}
    class:spectrum-Divider--sizeS={s}
    class="spectrum-Divider spectrum-Divider--{vertical ? 'vertical' : 'horizontal'} spectrum-Dialog-divider">