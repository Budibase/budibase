import { derived, get } from "svelte/store"
import { getDatasourceDefinition, getDatasourceSchema } from "../../../fetch"
import { memo } from "../../../utils"

export const createStores = () => {
  const definition = memo(null)
  const schemaMutations = memo({})

  return {
    definition,
    schemaMutations,
  }
}

export const deriveStores = context => {
  const {
    API,
    definition,
    schemaOverrides,
    columnWhitelist,
    datasource,
    schemaMutations,
  } = context

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

  // Derives the total enriched schema, made up of the saved schema and any
  // prop and user overrides
  const enrichedSchema = derived(
    [schema, schemaOverrides, schemaMutations, columnWhitelist],
    ([$schema, $schemaOverrides, $schemaMutations, $columnWhitelist]) => {
      if (!$schema) {
        return null
      }
      let enrichedSchema = {}
      Object.keys($schema).forEach(field => {
        // Apply whitelist if provided
        if ($columnWhitelist?.length && !$columnWhitelist.includes(field)) {
          return
        }
        enrichedSchema[field] = {
          ...$schema[field],
          ...$schemaOverrides?.[field],
          ...$schemaMutations[field],
        }
      })
      return enrichedSchema
    }
  )

  const hasBudibaseIdentifiers = derived(datasource, $datasource => {
    let type = $datasource?.type
    if (type === "provider") {
      type = $datasource.value?.datasource?.type
    }
    return ["table", "viewV2", "link"].includes(type)
  })

  return {
    schema,
    enrichedSchema,
    hasBudibaseIdentifiers,
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
    schemaMutations,
    schema,
    notifications,
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
    const originalDefinition = get(definition)
    definition.set(newDefinition)

    // Update server
    if (get(config).canSaveSchema) {
      try {
        await getAPI()?.actions.saveDefinition(newDefinition)

        // Broadcast change so external state can be updated, as this change
        // will not be received by the builder websocket because we caused it
        // ourselves
        dispatch("updatedatasource", newDefinition)
      } catch (error) {
        const msg = error?.message || error || "Unknown error"
        get(notifications).error(`Error saving schema: ${msg}`)

        // Reset the definition if saving failed
        definition.set(originalDefinition)
      }
    }
  }

  // Updates the datasources primary display column
  const changePrimaryDisplay = async column => {
    return await saveDefinition({
      ...get(definition),
      primaryDisplay: column,
    })
  }

  // Adds a schema mutation for a single field
  const addSchemaMutation = (field, mutation) => {
    if (!field || !mutation) {
      return
    }
    schemaMutations.update($schemaMutations => {
      return {
        ...$schemaMutations,
        [field]: {
          ...$schemaMutations[field],
          ...mutation,
        },
      }
    })
  }

  // Adds schema mutations for multiple fields at once
  const addSchemaMutations = mutations => {
    const fields = Object.keys(mutations || {})
    if (!fields.length) {
      return
    }
    schemaMutations.update($schemaMutations => {
      let newSchemaMutations = { ...$schemaMutations }
      fields.forEach(field => {
        newSchemaMutations[field] = {
          ...newSchemaMutations[field],
          ...mutations[field],
        }
      })
      return newSchemaMutations
    })
  }

  // Saves schema changes to the server, if possible
  const saveSchemaMutations = async () => {
    // If we can't save schema changes then we just want to keep this in memory
    if (!get(config).canSaveSchema) {
      return
    }
    const $definition = get(definition)
    const $schemaMutations = get(schemaMutations)
    const $schema = get(schema)
    let newSchema = {}

    // Build new updated datasource schema
    Object.keys($schema).forEach(column => {
      newSchema[column] = {
        ...$schema[column],
        ...$schemaMutations[column],
      }
    })

    // Save the changes, then reset our local mutations
    await saveDefinition({
      ...$definition,
      schema: newSchema,
    })
    resetSchemaMutations()
  }

  const resetSchemaMutations = () => {
    schemaMutations.set({})
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
        changePrimaryDisplay,
        addSchemaMutation,
        addSchemaMutations,
        saveSchemaMutations,
        resetSchemaMutations,
      },
    },
  }
}
