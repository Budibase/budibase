<script>
    import "@spectrum-css/typography/dist/index-vars.css"

    // Sizes
    export let xl = false;
    export let l = false;
    export let m = false;
    export let s = false;

    export let serif = false;

</script>

<p class="spectrum-Detail"
    class:spectrum-Detail--serif={serif}
    class:spectrum-Detail--sizeXL={xl}
    class:spectrum-Detail--sizeL={l}
    class:spectrum-Detail--sizeM={m}
    class:spectrum-Detail--sizeS={s}>
    <slot />
</p>