<script>
  import { Icon } from "@budibase/bbui"

  export let tableOrView
  export let selected = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div role="button" tabindex="0" class="datasource" class:selected on:click>
  <Icon name={tableOrView.icon} />
  <span>{tableOrView.name}</span>
</div>

<style>
  .datasource {
    cursor: pointer;
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: 160ms all;
    border-radius: 4px;
    user-select: none;

    padding: var(--spectrum-alias-item-padding-s);
    display: flex;
    align-items: center;
    grid-gap: var(--spacing-m);
    min-width: 0;
  }

  .datasource :global(svg) {
    transition: 160ms all;
    color: var(--spectrum-global-color-gray-600);
  }

  .datasource span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .datasource:hover {
    border: 1px solid var(--grey-5);
  }

  .selected {
    border: 1px solid var(--blue) !important;
  }
</style>
