<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Toggle } from "@budibase/bbui"

  const { columns } = getContext("sheet")

  let open = false
  let anchor

  $: anyHidden = $columns.some(col => !col.visible)

  const toggleVisibility = (column, visible) => {
    columns.update(state => {
      const index = state.findIndex(col => col.name === column.name)
      state[index].visible = visible
      return state.slice()
    })
  }

  const showAll = () => {
    columns.update(state => {
      return state.map(col => ({
        ...col,
        visible: true,
      }))
    })
  }

  const hideAll = () => {
    columns.update(state => {
      return state.map(col => ({
        ...col,
        visible: false,
      }))
    })
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
    Hide columns
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <div class="columns">
      {#each $columns as column}
        <Toggle
          size="S"
          value={column.visible}
          on:change={e => toggleVisibility(column, e.detail)}
        />
        <span>{column.name}</span>
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
    grid-template-columns: auto 1fr;
  }
</style>
