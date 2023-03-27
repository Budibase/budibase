<script>
  import { getContext } from "svelte"
  import { builderStore } from "stores"
  import { Icon } from "@budibase/bbui"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  $: requiredSetting = $component.missingRequiredSettings?.[0]
  $: styles = { ...$component.styles, normal: {}, custom: null }
</script>

{#if $builderStore.inBuilder && requiredSetting}
  <div class="component-placeholder" use:styleable={styles}>
    <Icon name="Alert" color="var(--spectrum-global-color-static-red-600)" />
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
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-xs);
    gap: var(--spacing-s);
  }
  .component-placeholder mark {
    background-color: var(--spectrum-global-color-gray-400);
    padding: 0 4px;
    border-radius: 2px;
  }
  .component-placeholder .spectrum-Link {
    cursor: pointer;
  }
</style>
