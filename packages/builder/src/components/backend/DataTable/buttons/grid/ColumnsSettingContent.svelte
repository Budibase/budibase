<script>
  import { getContext } from "svelte"
  import ToggleActionButtonGroup from "@/components/common/ToggleActionButtonGroup.svelte"
  import { helpers } from "@budibase/shared-core"
  import { SchemaUtils } from "@budibase/frontend-core"
  import { Icon, notifications, ActionButton, Popover } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import { FieldPermissions } from "./GridColumnsSettingButton.svelte"

  export let permissions = [FieldPermissions.WRITABLE, FieldPermissions.HIDDEN]
  export let disabledPermissions = []
  export let columns
  export let fromRelationshipField

  const { datasource, dispatch } = getContext("grid")

  let relationshipPanelAnchor
  let relationshipFieldName

  $: relationshipField = columns.find(
    c => c.name === relationshipFieldName
  )?.schema
  $: permissionsObj = permissions.reduce(
    (acc, c) => ({
      ...acc,
      [c]: {
        disabled: disabledPermissions.includes(c),
      },
    }),
    {}
  )

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

  $: relationshipPanelColumns = Object.entries(
    relationshipField?.columns || {}
  ).map(([name, column]) => {
    return {
      name: name,
      label: name,
      schema: {
        type: column.type,
        subtype: column.subtype,
        visible: column.visible,
        readonly: column.readonly,
        icon: column.icon,
      },
    }
  })

  $: hasLinkColumns = columns.some(c => c.schema.type === FieldType.LINK)

  async function toggleColumn(column, permission) {
    const visible = permission !== FieldPermissions.HIDDEN
    const readonly = permission === FieldPermissions.READONLY

    if (!fromRelationshipField) {
      await datasource.actions.addSchemaMutation(column.name, {
        visible,
        readonly,
      })
    } else {
      await datasource.actions.addSubSchemaMutation(
        column.name,
        fromRelationshipField.name,
        {
          visible,
          readonly,
        }
      )
    }
    try {
      await datasource.actions.saveSchemaMutations()
    } catch (e) {
      notifications.error(e.message)
    }
    dispatch(visible ? "show-column" : "hide-column")
  }

  function columnToPermissionOptions(column) {
    if (column.schema.visible === false) {
      return FieldPermissions.HIDDEN
    }

    if (column.schema.readonly) {
      return FieldPermissions.READONLY
    }

    return FieldPermissions.WRITABLE
  }
</script>

<div class="content">
  <div class="columns">
    {#each displayColumns as column}
      <div class="column">
        <Icon size="S" name={SchemaUtils.getColumnIcon(column)} />
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
        {#if column.schema.type === FieldType.LINK && columnToPermissionOptions(column) !== FieldPermissions.HIDDEN}
          <div class="relationship-columns">
            <ActionButton
              on:click={e => {
                relationshipFieldName = column.name
                relationshipPanelAnchor = e.currentTarget
              }}
              size="S"
              icon="ChevronRight"
              quiet
              selected={relationshipFieldName === column.name}
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

{#if hasLinkColumns}
  <Popover
    on:close={() => (relationshipFieldName = null)}
    open={relationshipFieldName}
    anchor={relationshipPanelAnchor}
    align="left"
  >
    <div class="nested">
      {#if relationshipPanelColumns.length}
        <div class="relationship-header">
          {relationshipFieldName} columns
        </div>
      {/if}
      <svelte:self
        columns={relationshipPanelColumns}
        permissions={[FieldPermissions.READONLY, FieldPermissions.HIDDEN]}
        fromRelationshipField={relationshipField}
      />
    </div>
  </Popover>
{/if}

<style>
  .relationship-columns :global(.spectrum-ActionButton) {
    width: 28px;
    height: 28px;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .nested {
    padding: 12px;
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
  .relationship-header {
    color: var(--spectrum-global-color-gray-600);
    margin-bottom: 12px;
  }
</style>
