<script>
    import "@spectrum-css/typography/dist/index-vars.css"

    // Sizes
    export let xl = false;
    export let l = false;
    export let m = false;
    export let s = false;
    export let xs = false;

</script>

<code class="spectrum-Code"
    class:spectrum-Code--sizeXL={xl}
    class:spectrum-Code--sizeL={l}
    class:spectrum-Code--sizeM={m}
    class:spectrum-Code--sizeS={s}
    class:spectrum-Code--sizeXS={xs}>
    <slot />
</code>