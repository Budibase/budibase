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
  const { datasource, definition, config, dispatch, table, viewV2 } = context

  // Gets the appropriate API for the configured datasource type
  const getAPI = () => {
    const $datasource = get(datasource)
    switch ($datasource?.type) {
      case "table":
        return table
      case "viewV2":
        return viewV2
      default:
        return null
    }
  }

  // Refreshes the datasource definition
  const refreshDefinition = async () => {
    return await getAPI()?.actions.refreshDefinition()
  }

  // Saves the datasource definition
  const saveDefinition = async newDefinition => {
    // Update local state
    definition.set(newDefinition)

    // Update server
    if (get(config).canSaveSchema) {
      await getAPI()?.actions.saveDefinition(newDefinition)
    }

    // Broadcast change to external state can be updated, as this change
    // will not be received by the builder websocket because we caused it ourselves
    dispatch("updatedatasource", newDefinition)
  }

  // Adds a row to the datasource
  const addRow = async row => {
    return await getAPI()?.actions.addRow(row)
  }

  // Updates an existing row in the datasource
  const updateRow = async row => {
    return await getAPI()?.actions.updateRow(row)
  }

  // Deletes rows from the datasource
  const deleteRows = async rows => {
    return await getAPI()?.actions.deleteRows(rows)
  }

  // Gets a single row from a datasource
  const getRow = async id => {
    return await getAPI()?.actions.getRow(id)
  }

  // Checks if a certain datasource config is valid
  const isDatasourceValid = datasource => {
    return getAPI()?.actions.isDatasourceValid(datasource)
  }

  // Checks if this datasource can use a specific column by name
  const canUseColumn = name => {
    return getAPI()?.actions.canUseColumn(name)
  }

  return {
    datasource: {
      ...datasource,
      actions: {
        refreshDefinition,
        saveDefinition,
        addRow,
        updateRow,
        deleteRows,
        getRow,
        isDatasourceValid,
        canUseColumn,
      },
    },
  }
}
