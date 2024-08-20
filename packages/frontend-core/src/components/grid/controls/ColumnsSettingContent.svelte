<script>
  import { getContext } from "svelte"
  import { Icon, notifications, ActionButton, Popover } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"
  import ToggleActionButtonGroup from "./ToggleActionButtonGroup.svelte"
  import { helpers } from "@budibase/shared-core"
  import { FieldType } from "@budibase/types"
  import { tables } from "stores/builder"
  import { FieldPermissions } from "../../../constants"

  export let permissions = [FieldPermissions.WRITABLE, FieldPermissions.HIDDEN]
  export let disabledPermissions = []
  export let columns

  const { datasource, dispatch } = getContext("grid")
  $: permissionsObj = permissions.reduce(
    (acc, c) => ({
      ...acc,
      [c]: {
        disabled: disabledPermissions.includes(c),
      },
    }),
    {}
  )

  $: allowRelationshipSchemas = true // TODO
  let relationshipPanelOpen = false
  let relationshipPanelAnchor
  let relationshipPanelColumns = []

  const toggleColumn = async (column, permission) => {
    const visible = permission !== FieldPermissions.HIDDEN
    const readonly = permission === FieldPermissions.READONLY

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

  $: displayColumns = columns.map(c => {
    const isRequired =
      c.primaryDisplay || helpers.schema.isRequired(c.schema.constraints)

    const defaultPermission = permissions[0]
    const requiredTooltips = {
      [FieldPermissions.WRITABLE]: (() => {
        if (defaultPermission === FieldPermissions.WRITABLE) {
          if (c.primaryDisplay) {
            return "Display column must be writable"
          }
          if (isRequired) {
            return "Required columns must be writable"
          }
        }
      })(),
      [FieldPermissions.READONLY]: (() => {
        if (defaultPermission === FieldPermissions.WRITABLE) {
          if (c.primaryDisplay) {
            return "Display column cannot be read-only"
          }
          if (isRequired) {
            return "Required columns cannot be read-only"
          }
        }
        if (defaultPermission === FieldPermissions.READONLY) {
          if (c.primaryDisplay) {
            return "Display column must be read-only"
          }
          if (isRequired) {
            return "Required columns must be read-only"
          }
        }
      })(),
      [FieldPermissions.HIDDEN]: (() => {
        if (c.primaryDisplay) {
          return "Display column cannot be hidden"
        }
        if (isRequired) {
          return "Required columns cannot be hidden"
        }
      })(),
    }

    const options = []

    let permission
    if ((permission = permissionsObj[FieldPermissions.WRITABLE])) {
      const tooltip = requiredTooltips[FieldPermissions.WRITABLE] || "Writable"
      options.push({
        icon: "Edit",
        value: FieldPermissions.WRITABLE,
        tooltip,
        disabled: isRequired || permission.disabled,
      })
    }

    if ((permission = permissionsObj[FieldPermissions.READONLY])) {
      const tooltip =
        (requiredTooltips[FieldPermissions.READONLY] || "Read-only") +
        (permission.disabled ? " (premium feature)" : "")
      options.push({
        icon: "Visibility",
        value: FieldPermissions.READONLY,
        tooltip,
        disabled: permission.disabled || isRequired,
      })
    }

    if ((permission = permissionsObj[FieldPermissions.HIDDEN])) {
      const tooltip = requiredTooltips[FieldPermissions.HIDDEN] || "Hidden"
      options.push({
        icon: "VisibilityOff",
        value: FieldPermissions.HIDDEN,
        disabled: permission.disabled || isRequired,
        tooltip,
      })
    }

    return { ...c, options }
  })

  function columnToPermissionOptions(column) {
    if (column.schema.visible === false) {
      return FieldPermissions.HIDDEN
    }

    if (column.schema.readonly) {
      return FieldPermissions.READONLY
    }

    return FieldPermissions.WRITABLE
  }

  function onRelationshipOpen(column, domElement) {
    const relTable = $tables.list.find(
      table => table._id === column.schema.tableId
    )
    relationshipPanelColumns = Object.values(relTable?.schema || {})
      .filter(
        schema => ![FieldType.LINK, FieldType.FORMULA].includes(schema.type)
      )
      .map(column => {
        const isPrimaryDisplay = relTable.primaryDisplay === column.name
        return {
          name: column.name,
          label: column.name,
          primaryDisplay: isPrimaryDisplay,
          schema: {
            ...column,
            visible: !!isPrimaryDisplay,
            readonly: isPrimaryDisplay || column.readonly,
          },
        }
      })
      .sort((a, b) =>
        a.primaryDisplay === b.primaryDisplay ? 0 : a.primaryDisplay ? -1 : 1
      )

    relationshipPanelAnchor = domElement
    relationshipPanelOpen = !relationshipPanelOpen
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
              on:click={e => onRelationshipOpen(column, e.currentTarget)}
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
      columns={relationshipPanelColumns}
      permissions={[FieldPermissions.READONLY, FieldPermissions.HIDDEN]}
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
