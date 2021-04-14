<script>
    import "@spectrum-css/typography/dist/index-vars.css"

    // Sizes
    export let xxxl = false;
    export let xxl = false;
    export let xl = false;
    export let l = false;
    export let m = false;
    export let s = false;
    export let xs = false;
    export let xxs = false;

    export let serif = false;

</script>

<p class="spectrum-Body"
    class:spectrum-Body--serif={serif}
    class:spectrum-Body--sizeXXXL={xxxl}
    class:spectrum-Body--sizeXXL={xxl}
    class:spectrum-Body--sizeXL={xl}
    class:spectrum-Body--sizeL={l}
    class:spectrum-Body--sizeM={m}
    class:spectrum-Body--sizeS={s}
    class:spectrum-Body--sizeXS={xs}
    class:spectrum-Body--sizeXXS={xxs}>
    <slot />
</p>