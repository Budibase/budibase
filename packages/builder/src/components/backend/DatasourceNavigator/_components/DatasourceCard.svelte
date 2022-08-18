<script>
  import { createEventDispatcher } from "svelte"
  import { Heading, Detail } from "@budibase/bbui"
  import { getIcon } from "../icons"

  export let integration
  export let integrationType
  export let schema

  let dispatcher = createEventDispatcher()
</script>

<div
  class:selected={integration.type === integrationType}
  on:click={() => dispatcher("selected", integrationType)}
  class="item hoverable"
>
  <div class="item-body" class:with-type={!!schema.type}>
    <svelte:component
      this={getIcon(integrationType, schema)}
      height="20"
      width="20"
    />
    <div class="text">
      <Heading size="XXS">{schema.friendlyName}</Heading>
      {#if schema.type}
        <Detail size="S">{schema.type || ""}</Detail>
      {/if}
    </div>
  </div>
</div>

<style>
  .item {
    cursor: pointer;
    display: grid;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s)
      var(--spectrum-alias-item-padding-m);
    background: var(--spectrum-alias-background-color-secondary);
    transition: background 0.13s ease-out;
    border: solid var(--spectrum-alias-border-color);
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
  }
  .item:hover,
  .item.selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }

  .item-body {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
  .item-body.with-type {
    align-items: flex-start;
  }
  .item-body.with-type :global(svg) {
    margin-top: 4px;
  }
</style>
