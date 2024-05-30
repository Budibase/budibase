<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Icon, notifications } from "@budibase/bbui"
  import { licensing } from "stores/portal"
  import { getColumnIcon } from "../lib/utils"
  import ToggleActionButtonGroup from "./ToggleActionButtonGroup.svelte"

  export let allowReadonlyColumns = false

  const { columns, datasource, stickyColumn, dispatch } = getContext("grid")

  let open = false
  let anchor

  $: anyHidden = $columns.some(col => !col.visible)
  $: text = getText($columns)

  const toggleColumn = async (column, permission) => {
    const visible = permission !== PERMISSION_OPTIONS.HIDDEN
    const readonly = permission === PERMISSION_OPTIONS.READONLY

    datasource.actions.addSchemaMutation(column.name, { visible, readonly })
    try {
      await datasource.actions.saveSchemaMutations()
    } catch (e) {
      notifications.error(e.message)
    }
    dispatch(visible ? "show-column" : "hide-column")
  }

  const getText = columns => {
    const restricted = columns.filter(
      col => !col.visible || col.readonly
    ).length
    return restricted ? `Columns (${restricted} restricted)` : "Columns"
  }

  $: isViewReadonlyColumnsEnabled = $licensing.isViewReadonlyColumnsEnabled

  const PERMISSION_OPTIONS = {
    WRITABLE: "writable",
    READONLY: "readonly",
    HIDDEN: "hidden",
  }

  const EDIT_OPTION = {
    icon: "Edit",
    value: PERMISSION_OPTIONS.WRITABLE,
    tooltip: "Writable",
  }
  $: READONLY_OPTION = {
    icon: "Visibility",
    value: PERMISSION_OPTIONS.READONLY,
    tooltip: isViewReadonlyColumnsEnabled
      ? "Read only"
      : "Read only (premium feature)",
    disabled: !isViewReadonlyColumnsEnabled,
  }
  const HIDDEN_OPTION = {
    icon: "VisibilityOff",
    value: PERMISSION_OPTIONS.HIDDEN,
    tooltip: "Hidden",
  }

  $: options = allowReadonlyColumns
    ? [EDIT_OPTION, READONLY_OPTION, HIDDEN_OPTION]
    : [EDIT_OPTION, HIDDEN_OPTION]

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

        <ToggleActionButtonGroup
          disabled
          value={PERMISSION_OPTIONS.WRITABLE}
          options={options.map(o => ({ ...o, disabled: true }))}
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
