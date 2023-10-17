<script>
  export let horizontal = false
  export let paddingX = "M"
  export let paddingY = "M"
  export let noPadding = false
  export let gap = "M"
  export let noGap = false
  export let alignContent = "normal"
  export let justifyItems = "stretch"
</script>

<div
  style="align-content:{alignContent};justify-items:{justifyItems};"
  class:horizontal
  class="container paddingX-{!noPadding && paddingX} paddingY-{!noPadding &&
    paddingY} gap-{!noGap && gap}"
>
  <slot />
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr;
    position: relative;
  }
  .paddingX-S {
    padding-left: var(--spacing-s);
    padding-right: var(--spacing-s);
  }
  .paddingX-M {
    padding-left: var(--spacing-m);
    padding-right: var(--spacing-m);
  }
  .paddingX-L {
    padding-left: var(--spacing-l);
    padding-right: var(--spacing-l);
  }
  .paddingX-XL {
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
  }
  .paddingX-XXL {
    padding-left: var(--spectrum-alias-grid-gutter-large);
    padding-right: var(--spectrum-alias-grid-gutter-large);
  }
  .paddingY-S {
    padding-top: var(--spacing-s);
    padding-bottom: var(--spacing-s);
  }
  .paddingY-M {
    padding-top: var(--spacing-m);
    padding-bottom: var(--spacing-m);
  }
  .paddingY-L {
    padding-top: var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }
  .paddingY-XL {
    padding-top: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
  }
  .paddingY-XXL {
    padding-top: var(--spectrum-alias-grid-gutter-large);
    padding-bottom: var(--spectrum-alias-grid-gutter-large);
  }
  .gap-XXS {
    grid-gap: var(--spacing-xs);
  }
  .gap-XS {
    grid-gap: var(--spacing-s);
  }
  .gap-S {
    grid-gap: var(--spectrum-alias-grid-gutter-xsmall);
  }
  .gap-M {
    grid-gap: var(--spectrum-alias-grid-gutter-small);
  }
  .gap-L {
    grid-gap: var(--spectrum-alias-grid-gutter-medium);
  }
  .gap-XL {
    grid-gap: var(--spectrum-alias-grid-gutter-large);
  }
  .horizontal.gap-S :global(*) + :global(*) {
    margin-left: var(--spectrum-alias-grid-gutter-xsmall);
  }
  .horizontal.gap-M :global(*) + :global(*) {
    margin-left: var(--spectrum-alias-grid-gutter-small);
  }
  .horizontal.gap-L :global(*) + :global(*) {
    margin-left: var(--spectrum-alias-grid-gutter-medium);
  }
</style>
