import { derived, get } from "svelte/store"
import { getDatasourceDefinition, getDatasourceSchema } from "../../../fetch"
import { memo } from "../../../utils"

export const createStores = () => {
  const definition = memo(null)

  return {
    definition,
  }
}

export const deriveStores = context => {
  const { API, definition, schemaOverrides, columnWhitelist, datasource } =
    context

  const schema = derived(definition, $definition => {
    let schema = getDatasourceSchema({
      API,
      datasource: get(datasource),
      definition: $definition,
    })
    if (!schema) {
      return null
    }

    // Ensure schema is configured as objects.
    // Certain datasources like queries use primitives.
    Object.keys(schema || {}).forEach(key => {
      if (typeof schema[key] !== "object") {
        schema[key] = { type: schema[key] }
      }
    })

    return schema
  })

  const enrichedSchema = derived(
    [schema, schemaOverrides, columnWhitelist],
    ([$schema, $schemaOverrides, $columnWhitelist]) => {
      if (!$schema) {
        return null
      }
      let enrichedSchema = { ...$schema }

      // Apply schema overrides
      Object.keys($schemaOverrides || {}).forEach(field => {
        if (enrichedSchema[field]) {
          enrichedSchema[field] = {
            ...enrichedSchema[field],
            ...$schemaOverrides[field],
          }
        }
      })

      // Apply whitelist if specified
      if ($columnWhitelist?.length) {
        const sortedColumns = {}

        $columnWhitelist.forEach((columnKey, idx) => {
          const enrichedColumn = enrichedSchema[columnKey]
          if (enrichedColumn) {
            sortedColumns[columnKey] = {
              ...enrichedColumn,
              order: idx,
              visible: true,
            }
          }
        })

        return sortedColumns
      }

      return enrichedSchema
    }
  )

  const isDatasourcePlus = derived(datasource, $datasource => {
    return ["table", "viewV2"].includes($datasource?.type)
  })

  return {
    schema,
    enrichedSchema,
    isDatasourcePlus,
  }
}

export const createActions = context => {
  const {
    API,
    datasource,
    definition,
    config,
    dispatch,
    table,
    viewV2,
    nonPlus,
  } = context

  // Gets the appropriate API for the configured datasource type
  const getAPI = () => {
    const $datasource = get(datasource)
    const type = $datasource?.type
    if (!type) {
      return null
    }
    switch (type) {
      case "table":
        return table
      case "viewV2":
        return viewV2
      default:
        return nonPlus
    }
  }

  // Refreshes the datasource definition
  const refreshDefinition = async () => {
    const def = await getDatasourceDefinition({
      API,
      datasource: get(datasource),
    })
    definition.set(def)
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
