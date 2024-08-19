<script>
  import { getContext } from "svelte"
  import { Icon, notifications, ActionButton, Popover } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"
  import ToggleActionButtonGroup from "./ToggleActionButtonGroup.svelte"
  import { helpers } from "@budibase/shared-core"
  import { FieldType } from "@budibase/types"
  import { tables } from "stores/builder"

  export let allowViewReadonlyColumns
  export let columns

  const { datasource, dispatch } = getContext("grid")

  $: allowRelationshipSchemas = true // TODO
  let relationshipPanelOpen = false
  let relationshipPanelAnchor
  let relationshipPanelColumns = []

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

  $: displayColumns = columns.map(c => {
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
      <div class="column-options">
        <ToggleActionButtonGroup
          on:click={e => toggleColumn(column, e.detail)}
          value={columnToPermissionOptions(column)}
          options={column.options}
        />
        {#if allowRelationshipSchemas && column.schema.type === FieldType.LINK}
          <div class="relationship-columns">
            <ActionButton
              on:click={e => {
                const relTable = $tables.list.find(
                  table => table._id === column.schema.tableId
                )
                relationshipPanelColumns = Object.values(relTable?.schema || {})
                  .filter(
                    schema =>
                      ![FieldType.LINK, FieldType.FORMULA].includes(schema.type)
                  )
                  .map(schema => ({
                    name: schema.name,
                    label: schema.name,
                    schema,
                  }))
                console.warn({
                  columns,
                  relationshipPanelColumns,
                })
                relationshipPanelAnchor = e.currentTarget
                relationshipPanelOpen = !relationshipPanelOpen
              }}
              size="S"
              icon="ChevronRight"
              quiet
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

{#if allowRelationshipSchemas}
  <Popover
    bind:open={relationshipPanelOpen}
    anchor={relationshipPanelAnchor}
    align="right-outside"
  >
    <svelte:self
      {allowViewReadonlyColumns}
      columns={relationshipPanelColumns}
    />
  </Popover>
{/if}

<style>
  .relationship-columns :global(.spectrum-ActionButton) {
    width: 28px;
    height: 28px;
  }

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
  .column-options {
    display: flex;
    gap: var(--spacing-xs);
  }
</style>
