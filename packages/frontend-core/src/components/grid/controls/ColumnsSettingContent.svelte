<script>
  import { getContext } from "svelte"
  import { Icon, notifications } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"
  import ToggleActionButtonGroup from "./ToggleActionButtonGroup.svelte"
  import { helpers } from "@budibase/shared-core"

  export let allowViewReadonlyColumns = false

  const { columns, datasource, dispatch } = getContext("grid")

  const toggleColumn = async (column, permission) => {
    const visible = permission !== PERMISSION_OPTIONS.HIDDEN
    const readonly = permission === PERMISSION_OPTIONS.READONLY

    await datasource.actions.addSchemaMutation(column.name, {
      visible,
      readonly,
    })
    try {
      await datasource.actions.saveSchemaMutations()
    } catch (e) {
      notifications.error(e.message)
    } finally {
      await datasource.actions.resetSchemaMutations()
      await datasource.actions.refreshDefinition()
    }
    dispatch(visible ? "show-column" : "hide-column")
  }

  const PERMISSION_OPTIONS = {
    WRITABLE: "writable",
    READONLY: "readonly",
    HIDDEN: "hidden",
  }

  $: displayColumns = $columns.map(c => {
    const isRequired = helpers.schema.isRequired(c.schema.constraints)
    const requiredTooltip = isRequired && "Required columns must be writable"
    const editEnabled =
      !isRequired ||
      columnToPermissionOptions(c) !== PERMISSION_OPTIONS.WRITABLE
    const options = [
      {
        icon: "Edit",
        value: PERMISSION_OPTIONS.WRITABLE,
        tooltip: (!editEnabled && requiredTooltip) || "Writable",
        disabled: !editEnabled,
      },
    ]
    if ($datasource.type === "viewV2") {
      options.push({
        icon: "Visibility",
        value: PERMISSION_OPTIONS.READONLY,
        tooltip: allowViewReadonlyColumns
          ? requiredTooltip || "Read only"
          : "Read only (premium feature)",
        disabled: !allowViewReadonlyColumns || isRequired,
      })
    }

    options.push({
      icon: "VisibilityOff",
      value: PERMISSION_OPTIONS.HIDDEN,
      disabled: c.primaryDisplay || isRequired,
      tooltip:
        (c.primaryDisplay && "Display column cannot be hidden") ||
        requiredTooltip ||
        "Hidden",
    })

    return { ...c, options }
  })

  function columnToPermissionOptions(column) {
    if (column.schema.visible === false) {
      return PERMISSION_OPTIONS.HIDDEN
    }

    if (column.schema.readonly) {
      return PERMISSION_OPTIONS.READONLY
    }

    return PERMISSION_OPTIONS.WRITABLE
  }
</script>

<div class="content">
  <div class="columns">
    {#each displayColumns as column}
      <div class="column">
        <Icon size="S" name={getColumnIcon(column)} />
        <div class="column-label" title={column.label}>
          {column.label}
        </div>
      </div>
      <ToggleActionButtonGroup
        on:click={e => toggleColumn(column, e.detail)}
        value={columnToPermissionOptions(column)}
        options={column.options}
      />
    {/each}
  </div>
</div>

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
    grid-row-gap: 8px;
    grid-column-gap: 24px;
  }
  .columns :global(.spectrum-Switch) {
    margin-right: 0;
  }
  .column {
    display: flex;
    gap: 8px;
  }
  .column-label {
    min-width: 80px;
    max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
