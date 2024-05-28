<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Toggle, Icon } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"

  const { columns, datasource, stickyColumn, dispatch } = getContext("grid")

  let open = false
  let anchor

  $: anyHidden = $columns.some(col => !col.visible)
  $: text = getText($columns)

  const toggleColumn = async (column, visible) => {
    datasource.actions.addSchemaMutation(column.name, { visible })
    await datasource.actions.saveSchemaMutations()
    dispatch(visible ? "show-column" : "hide-column")
  }

  const toggleAll = async visible => {
    let mutations = {}
    $columns.forEach(column => {
      mutations[column.name] = { visible }
    })
    datasource.actions.addSchemaMutations(mutations)
    await datasource.actions.saveSchemaMutations()
    dispatch(visible ? "show-column" : "hide-column")
  }

  const getText = columns => {
    const hidden = columns.filter(col => !col.visible).length
    return hidden ? `Columns (${hidden})` : "Columns"
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="ColumnSettings"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open || anyHidden}
    disabled={!$columns.length}
  >
    {text}
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <div class="columns">
      {#if $stickyColumn}
        <div class="column">
          <Icon size="S" name={getColumnIcon($stickyColumn)} />
          {$stickyColumn.label}
        </div>
        <Toggle disabled size="S" value={true} />
      {/if}
      {#each $columns as column}
        <div class="column">
          <Icon size="S" name={getColumnIcon(column)} />
          {column.label}
        </div>
        <Toggle
          size="S"
          value={column.visible}
          on:change={e => toggleColumn(column, e.detail)}
          disabled={column.primaryDisplay}
        />
      {/each}
    </div>
    <div class="buttons">
      <ActionButton on:click={() => toggleAll(true)}>Show all</ActionButton>
      <ActionButton on:click={() => toggleAll(false)}>Hide all</ActionButton>
    </div>
  </div>
</Popover>

<style>
  .content {
    padding: 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
  .columns {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
  }
  .columns :global(.spectrum-Switch) {
    margin-right: 0;
  }
  .column {
    display: flex;
    gap: 8px;
  }
</style>
