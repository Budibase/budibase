<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Toggle, Icon } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"
  import ToggleActionButtonGroup from "./ToggleActionButtonGroup.svelte"

  const { columns, datasource, stickyColumn, dispatch } = getContext("grid")

  let open = false
  let anchor

  $: anyHidden = $columns.some(col => !col.visible)
  $: text = getText($columns)

  const toggleColumn = async (column, permission) => {
    const visible = permission !== PERMISSION_OPTIONS.HIDDEN
    const readonly = permission === PERMISSION_OPTIONS.READONLY

    datasource.actions.addSchemaMutation(column.name, { visible, readonly })
    await datasource.actions.saveSchemaMutations()
    dispatch(visible ? "show-column" : "hide-column")
  }

  const getText = columns => {
    const hidden = columns.filter(col => !col.visible).length
    return hidden ? `Columns (${hidden})` : "Columns"
  }

  const PERMISSION_OPTIONS = {
    WRITABLE: "writable",
    READONLY: "readonly",
    HIDDEN: "hidden",
  }

  function columnToPermissionOptions(column) {
    if (!column.visible) {
      return PERMISSION_OPTIONS.HIDDEN
    }

    if (column.readonly) {
      return PERMISSION_OPTIONS.READONLY
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
        <Toggle disabled size="S" value={true} />
      {/if}
      {#each $columns as column}
        <div class="column">
          <Icon size="S" name={getColumnIcon(column)} />
          {column.label}
        </div>
        <ToggleActionButtonGroup
          on:change={e => toggleColumn(column, e.detail)}
          value={columnToPermissionOptions(column)}
          options={[
            { icon: "Edit", value: PERMISSION_OPTIONS.WRITABLE },
            { icon: "Visibility", value: PERMISSION_OPTIONS.READONLY },
            { icon: "VisibilityOff", value: PERMISSION_OPTIONS.HIDDEN },
          ]}
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
