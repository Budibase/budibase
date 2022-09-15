<script>
  import { getContext } from "svelte"
  import { builderStore } from "stores"

  const component = getContext("component")

  $: requiredSetting = $component.missingRequiredSettings?.[0]
</script>

{#if $builderStore.inBuilder && requiredSetting}
  <div class="component-placeholder">
    <span>
      Add the <mark>{requiredSetting.label}</mark> setting to start using your component
      -
    </span>
    <span
      class="spectrum-Link"
      on:click={() => {
        builderStore.actions.highlightSetting(requiredSetting.key)
      }}
    >
      Show me
    </span>
  </div>
{/if}

<style>
  .component-placeholder {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-xs);
  }
  .component-placeholder mark {
    background-color: var(--spectrum-global-color-gray-400);
    padding: 0 2px;
    border-radius: 2px;
  }
  .component-placeholder .spectrum-Link {
    cursor: pointer;
  }
</style>
