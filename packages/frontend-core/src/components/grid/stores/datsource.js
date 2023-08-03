import { derived, get, writable } from "svelte/store"

export const createStores = () => {
  const definition = writable(null)

  return {
    definition,
  }
}

export const deriveStores = context => {
  const { definition, schemaOverrides, columnWhitelist } = context

  const schema = derived(
    [definition, schemaOverrides, columnWhitelist],
    ([$definition, $schemaOverrides, $columnWhitelist]) => {
      if (!$definition?.schema) {
        return null
      }
      let newSchema = { ...$definition?.schema }

      // Edge case to temporarily allow deletion of duplicated user
      // fields that were saved with the "disabled" flag set.
      // By overriding the saved schema we ensure only overrides can
      // set the disabled flag.
      // TODO: remove in future
      Object.keys(newSchema).forEach(field => {
        newSchema[field] = {
          ...newSchema[field],
          disabled: false,
        }
      })

      // Apply schema overrides
      Object.keys($schemaOverrides || {}).forEach(field => {
        if (newSchema[field]) {
          newSchema[field] = {
            ...newSchema[field],
            ...$schemaOverrides[field],
          }
        }
      })

      // Apply whitelist if specified
      if ($columnWhitelist?.length) {
        Object.keys(newSchema).forEach(key => {
          if (!$columnWhitelist.includes(key)) {
            delete newSchema[key]
          }
        })
      }

      return newSchema
    }
  )

  return {
    schema,
  }
}

export const createActions = context => {
  const { datasource, definition, API, config, dispatch } = context

  // Refreshes the datasource definition
  const refreshDefinition = async () => {
    const $datasource = get(datasource)
    if ($datasource.type === "table") {
      definition.set(await API.fetchTableDefinition($datasource.tableId))
    } else if ($datasource.type === "viewV2") {
      // const definition = await API.viewsV2.(get(tableId))
      // table.set(definition)
    }
  }

  // Saves the datasource definition
  const saveDefinition = async newDefinition => {
    const $config = get(config)
    const $datasource = get(datasource)

    // Update local state
    definition.set(newDefinition)

    // Update server
    if ($config.canSaveSchema) {
      if ($datasource.type === "table") {
        await API.saveTable(newDefinition)
      } else if ($datasource.type === "viewV2") {
        await API.viewV2.update({ ...newDefinition })
      }
    }

    // Broadcast change to external state can be updated, as this change
    // will not be received by the builder websocket because we caused it ourselves
    dispatch("updatedefinition", newDefinition)
  }

  return {
    datasource: {
      ...datasource,
      actions: {
        refreshDefinition,
        saveDefinition,
      },
    },
  }
}
