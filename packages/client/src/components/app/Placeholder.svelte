<script>
  import { getContext } from "svelte"

  const { builderStore } = getContext("sdk")
  const component = getContext("component")

  export let text
</script>

{#if $builderStore.inBuilder}
  <div>
    {#if !$$slots.content}
      {text || $component.name || "Placeholder"}
    {/if}
    <slot name="content" />
  </div>
{/if}

<style>
  div {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
  }
</style>
