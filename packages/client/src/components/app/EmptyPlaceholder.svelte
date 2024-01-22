<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { builderStore, componentStore } = getContext("sdk")

  $: definition = componentStore.actions.getComponentDefinition($component.type)
</script>

{#if $builderStore.inBuilder}
  <div class="component-placeholder">
    {$component.name || definition?.name || "Component"}
  </div>
{/if}

<style>
  .component-placeholder {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    gap: var(--spacing-s);
  }
</style>
