<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Toggle, Icon } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"

  const { columns, stickyColumn, dispatch } = getContext("grid")

  let open = false
  let anchor

  $: anyHidden = $columns.some(col => !col.visible)
  $: text = getText($columns)

  const toggleVisibility = async (column, visible) => {
    columns.update(state => {
      const index = state.findIndex(col => col.name === column.name)
      state[index].visible = visible
      return state.slice()
    })
    await columns.actions.saveChanges()
    dispatch(visible ? "show-column" : "hide-column")
  }

  const showAll = async () => {
    columns.update(state => {
      return state.map(col => ({
        ...col,
        visible: true,
      }))
    })
    await columns.actions.saveChanges()
    dispatch("show-column")
  }

  const hideAll = async () => {
    columns.update(state => {
      return state.map(col => ({
        ...col,
        visible: false,
      }))
    })
    await columns.actions.saveChanges()
    dispatch("hide-column")
  }

  const getText = columns => {
    const hidden = columns.filter(col => !col.visible).length
    return hidden ? `Hide columns (${hidden})` : "Hide columns"
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="VisibilityOff"
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
          on:change={e => toggleVisibility(column, e.detail)}
        />
      {/each}
    </div>
    <div class="buttons">
      <ActionButton on:click={showAll}>Show all</ActionButton>
      <ActionButton on:click={hideAll}>Hide all</ActionButton>
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
