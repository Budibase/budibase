<script>
  import { GutterWidth } from "../lib/constants"
  import { getContext } from "svelte"
  import { Checkbox, Icon } from "@budibase/bbui"
  import GridCell from "./GridCell.svelte"
  import { createEventDispatcher } from "svelte"

  export let row
  export let rowFocused = false
  export let rowHovered = false
  export let rowSelected = false
  export let expandable = false
  export let disableNumber = false
  export let defaultHeight = false
  export let disabled = false

  const { config, dispatch, selectedRows } = getContext("grid")
  const svelteDispatch = createEventDispatcher()

  const select = e => {
    e.stopPropagation()
    svelteDispatch("select")
    const id = row?._id
    if (id) {
      selectedRows.actions.toggleRow(id)
    }
  }

  const bulkDelete = e => {
    e.stopPropagation()
    dispatch("request-bulk-delete")
  }

  const expand = e => {
    e.stopPropagation()
    svelteDispatch("expand")
  }
</script>

<GridCell
  width={GutterWidth}
  highlighted={rowFocused || rowHovered}
  selected={rowSelected}
  {defaultHeight}
  rowIdx={row?.__idx}
>
  <div class="gutter">
    {#if $$slots.default}
      <slot />
    {:else}
      <div
        on:click={select}
        class="checkbox"
        class:visible={$config.canDeleteRows &&
          (disableNumber || rowSelected || rowHovered || rowFocused)}
      >
        <Checkbox value={rowSelected} {disabled} />
      </div>
      {#if !disableNumber}
        <div
          class="number"
          class:visible={!$config.canDeleteRows ||
            !(rowSelected || rowHovered || rowFocused)}
        >
          {row.__idx + 1}
        </div>
      {/if}
    {/if}
    {#if rowSelected && $config.canDeleteRows}
      <div class="delete" on:click={bulkDelete}>
        <Icon
          name="Delete"
          size="S"
          color="var(--spectrum-global-color-red-400)"
        />
      </div>
    {:else}
      <div class="expand" class:visible={$config.canExpandRows && expandable}>
        <Icon size="S" name="Maximize" hoverable on:click={expand} />
      </div>
    {/if}
  </div>
</GridCell>

<style>
  .gutter {
    flex: 1 1 auto;
    display: grid;
    align-items: center;
    padding: var(--cell-padding);
    grid-template-columns: 1fr auto;
    gap: var(--cell-spacing);
  }
  .checkbox,
  .number {
    display: none;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .checkbox :global(.spectrum-Checkbox) {
    min-height: 0;
    height: 20px;
  }
  .checkbox :global(.spectrum-Checkbox-box) {
    margin: 3px 0 0 0;
  }
  .number {
    color: var(--spectrum-global-color-gray-500);
  }
  .checkbox.visible,
  .number.visible {
    display: flex;
  }
  .delete,
  .expand {
    margin-right: 4px;
  }
  .expand {
    opacity: 0;
  }
  .expand :global(.spectrum-Icon) {
    pointer-events: none;
  }
  .expand.visible {
    opacity: 1;
  }
  .expand.visible :global(.spectrum-Icon) {
    pointer-events: all;
  }

  .delete:hover {
    cursor: pointer;
  }
  .delete:hover :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-red-600) !important;
  }
</style>
