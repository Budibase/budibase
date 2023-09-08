<script>
  import { Icon } from "@budibase/bbui"
  export let datasource
  export let selected = false

  $: icon = datasource.type === "viewV2" ? "Remove" : "Table"
</script>

<div class="data-source-entry" class:selected on:click>
  <Icon name={icon} color="var(--spectrum-global-color-gray-600)" />
  {datasource.label}
  {#if selected}
    <span class="data-source-check">
      <Icon size="S" name="CheckmarkCircle" />
    </span>
  {/if}
</div>

<style>
  .data-source-entry {
    cursor: pointer;
    grid-gap: var(--spacing-m);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  .data-source-entry:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }

  .data-source-check {
    margin-left: auto;
  }
  .data-source-check :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-green-600);
  }
</style>
