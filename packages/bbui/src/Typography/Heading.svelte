<script>
    import "@spectrum-css/typography/dist/index-vars.css"

    // Level
    export let h1 = false;
    export let h2 = false;
    export let h3 = false;
    export let h4 = false;

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

{#if h1}
    <h1 class="spectrum-Heading"
        class:spectrum-Heading--serif={serif}
        class:spectrum-Heading--sizeXXXL={xxxl}
        class:spectrum-Heading--sizeXXL={xxl}
        class:spectrum-Heading--sizeXL={xl}
        class:spectrum-Heading--sizeL={l}
        class:spectrum-Heading--sizeM={m}
        class:spectrum-Heading--sizeS={s}
        class:spectrum-Heading--sizeXS={xs}
        class:spectrum-Heading--sizeXXS={xxs}>
        <slot />
    </h1>
{:else if  h2}
    <h2 class="spectrum-Heading" 
        class:spectrum-Heading--serif={serif}
        class:spectrum-Heading--sizeXXXL={xxxl}
        class:spectrum-Heading--sizeXXL={xxl}
        class:spectrum-Heading--sizeXL={xl}
        class:spectrum-Heading--sizeL={l}
        class:spectrum-Heading--sizeM={m}
        class:spectrum-Heading--sizeS={s}
        class:spectrum-Heading--sizeXS={xs}
        class:spectrum-Heading--sizeXXS={xxs}>
        <slot />
    </h2>
{:else if  h3}
    <h3 class="spectrum-Heading" 
        class:spectrum-Heading--serif={serif}
        class:spectrum-Heading--sizeXXXL={xxxl}
        class:spectrum-Heading--sizeXXL={xxl}
        class:spectrum-Heading--sizeXL={xl}
        class:spectrum-Heading--sizeL={l}
        class:spectrum-Heading--sizeM={m}
        class:spectrum-Heading--sizeS={s}
        class:spectrum-Heading--sizeXS={xs}
        class:spectrum-Heading--sizeXXS={xxs}>
        <slot />
    </h3>
{:else if  h4}
    <h4 class="spectrum-Heading" 
        class:spectrum-Heading--serif={serif}
        class:spectrum-Heading--sizeXXXL={xxxl}
        class:spectrum-Heading--sizeXXL={xxl}
        class:spectrum-Heading--sizeXL={xl}
        class:spectrum-Heading--sizeL={l}
        class:spectrum-Heading--sizeM={m}
        class:spectrum-Heading--sizeS={s}
        class:spectrum-Heading--sizeXS={xs}
        class:spectrum-Heading--sizeXXS={xxs}>
        <slot />
    </h4>
{:else}
     SPECIFY HEADING SIZE!
{/if}
