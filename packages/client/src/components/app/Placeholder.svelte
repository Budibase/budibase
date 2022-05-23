<script>
  import { getContext } from "svelte"

  const { builderStore } = getContext("sdk")
  const component = getContext("component")

  export let text
</script>

{#if $builderStore.inBuilder}
  <div class="placeholder_wrap">
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
    padding: var(--spacing-xs);
  }
  :global(div.placeholder_wrap mark) {
    background-color: var(--spectrum-global-color-gray-400);
    padding: 0px 2px;
    border-radius: 2px;
  }
  :global(div.placeholder_wrap .showMe) {
    cursor: pointer;
  }
  :global(div.placeholder_wrap .showMe:hover) {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
