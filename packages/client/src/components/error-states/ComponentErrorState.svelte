<script lang="ts">
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"
  import type { UIComponentError } from "@budibase/types"
  import ComponentErrorStateCta from "./ComponentErrorStateCTA.svelte"

  export let componentErrors: UIComponentError[] | undefined

  const component = getContext("component")
  const { styleable, builderStore } = getContext("sdk")

  $: styles = { ...$component.styles, normal: {}, custom: null, empty: true }
  $: errorMessage = componentErrors?.[0]
</script>

{#if $builderStore.inBuilder}
  {#if $component.errorState}
    <div class="component-placeholder" use:styleable={styles}>
      <Icon name="Alert" color="var(--spectrum-global-color-static-red-600)" />
      {#if errorMessage}
        <!-- eslint-disable-next-line svelte/no-at-html-tags-->
        {@html errorMessage.message}
        <ComponentErrorStateCta error={errorMessage} />
      {/if}
    </div>
  {/if}
{/if}

<style>
  .component-placeholder {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-xs);
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
