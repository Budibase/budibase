<script>
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"

  const component = getContext("component")
  const { builderStore, componentStore } = getContext("sdk")

  $: definition = componentStore.actions.getComponentDefinition($component.type)
</script>

{#if $builderStore.inBuilder}
  <div class="component-placeholder">
    <Icon name="Help" color="var(--spectrum-global-color-blue-600)" />
    <span
      class="spectrum-Link"
      on:click={() => {
        builderStore.actions.requestAddComponent()
      }}
    >
      Add components inside your {definition?.name || $component.type}
    </span>
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

  /* Common styles for all error states to use */
  .component-placeholder :global(mark) {
    background-color: var(--spectrum-global-color-gray-400);
    padding: 0 4px;
    border-radius: 2px;
  }
  .component-placeholder :global(.spectrum-Link) {
    cursor: pointer;
  }
</style>
