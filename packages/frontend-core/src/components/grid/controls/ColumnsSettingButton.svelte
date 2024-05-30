<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Icon } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"
  import ToggleActionButtonGroup from "./ToggleActionButtonGroup.svelte"

  const { columns, datasource, stickyColumn, dispatch } = getContext("grid")

  let open = false
  let anchor

  $: anyHidden = $columns.some(col => !col.visible)
  $: text = getText($columns)

  const toggleColumn = async (column, permission) => {
    const visible = permission !== PERMISSION_OPTIONS.HIDDEN

    datasource.actions.addSchemaMutation(column.name, { visible })
    await datasource.actions.saveSchemaMutations()
    dispatch(visible ? "show-column" : "hide-column")
  }

  const getText = columns => {
    const hidden = columns.filter(col => !col.visible).length
    return hidden ? `Columns (${hidden} restricted)` : "Columns"
  }

  const PERMISSION_OPTIONS = {
    WRITABLE: "writable",
    HIDDEN: "hidden",
  }

  const options = [
    { icon: "Edit", value: PERMISSION_OPTIONS.WRITABLE, tooltip: "Writable" },
    {
      icon: "VisibilityOff",
      value: PERMISSION_OPTIONS.HIDDEN,
      tooltip: "Hidden",
    },
  ]

  function columnToPermissionOptions(column) {
    if (!column.visible) {
      return PERMISSION_OPTIONS.HIDDEN
    }

    return PERMISSION_OPTIONS.WRITABLE
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

        <ToggleActionButtonGroup
          disabled
          value={PERMISSION_OPTIONS.WRITABLE}
          {options}
        />
      {/if}
      {#each $columns as column}
        <div class="column">
          <Icon size="S" name={getColumnIcon(column)} />
          {column.label}
        </div>
        <ToggleActionButtonGroup
          on:click={e => toggleColumn(column, e.detail)}
          value={columnToPermissionOptions(column)}
          {options}
        />
      {/each}
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
  .columns {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
  .columns :global(.spectrum-Switch) {
    margin-right: 0;
  }
  .column {
    display: flex;
    gap: 8px;
  }
</style>
