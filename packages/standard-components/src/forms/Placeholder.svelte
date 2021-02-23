<script>
  import { getContext } from "svelte"
  const { builderStore } = getContext("sdk")
</script>

{#if $builderStore.inBuilder}
  <div>
    <slot />
  </div>
{/if}

<style>
  div {
    height: var(
      --spectrum-alias-item-height-m,
      var(--spectrum-global-dimension-size-400)
    );
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
    font-size: var(
      --spectrum-alias-item-text-size-m,
      var(--spectrum-global-dimension-font-size-100)
    );
    font-style: var(--spectrum-global-font-style-italic, italic);
    font-weight: var(--spectrum-global-font-weight-regular, 400);
  }
</style>
