<script>
  import { getContext } from "svelte"
  import { builderStore } from "stores"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  $: focusSetting = $component.missingRequiredSettings?.[0]
</script>

{#if $builderStore.inBuilder && focusSetting}
  <div use:styleable={$component.styles}>
    <div class="component-placeholder">
      <span>
        Add the <mark>{focusSetting?.label}</mark> setting to start using your component
        &nbsp;
      </span>
      <span
        class="spectrum-Link"
        on:click={() => {
          builderStore.actions.setFocus([
            {
              location: "component_settings",
              key: focusSetting.key,
              target: $component.id,
            },
          ])
        }}
      >
        Show me
      </span>
    </div>
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
