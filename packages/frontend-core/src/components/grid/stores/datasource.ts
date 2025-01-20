// TODO: datasource and defitions are unions of the different implementations. At this point, the datasource does not know what type is being used, and the assignations will cause TS exceptions. Casting it "as any" for now. This should be fixed improving the type usages.

import { derived, get, Readable, Writable } from "svelte/store"
import {
  DataFetchDefinition,
  getDatasourceDefinition,
  getDatasourceSchema,
} from "../../../fetch"
import { enrichSchemaWithRelColumns, memo } from "../../../utils"
import { cloneDeep } from "lodash"
import {
  SaveRowRequest,
  SaveTableRequest,
  UIDatasource,
  UIFieldMutation,
  UIFieldSchema,
  UIRow,
  UpdateViewRequest,
  ViewV2Type,
} from "@budibase/types"
import { Store as StoreContext, BaseStoreProps } from "."
import { DatasourceActions } from "./datasources"

interface DatasourceStore {
  definition: Writable<DataFetchDefinition | null>
  schemaMutations: Writable<Record<string, UIFieldMutation>>
  subSchemaMutations: Writable<Record<string, Record<string, UIFieldMutation>>>
}

interface DerivedDatasourceStore {
  schema: Readable<Record<string, UIFieldSchema> | null>
  enrichedSchema: Readable<Record<string, UIFieldSchema> | null>
  hasBudibaseIdentifiers: Readable<boolean>
}

interface ActionDatasourceStore {
  datasource: BaseStoreProps["datasource"] & {
    actions: DatasourceActions & {
      refreshDefinition: () => Promise<void>
      changePrimaryDisplay: (column: string) => Promise<void>
      addSchemaMutation: (field: string, mutation: UIFieldMutation) => void
      addSubSchemaMutation: (
        field: string,
        fromField: string,
        mutation: UIFieldMutation
      ) => void
      saveSchemaMutations: () => Promise<void>
      resetSchemaMutations: () => void
    }
  }
}

export type Store = DatasourceStore &
  DerivedDatasourceStore &
  ActionDatasourceStore

export const createStores = (): DatasourceStore => {
  const definition = memo(null)
  const schemaMutations = memo({})
  const subSchemaMutations = memo({})

  return {
    definition,
    schemaMutations,
    subSchemaMutations,
  }
}

export const deriveStores = (context: StoreContext): DerivedDatasourceStore => {
  const {
    API,
    definition,
    schemaOverrides,
    datasource,
    schemaMutations,
    subSchemaMutations,
  } = context

  const schema = derived(definition, $definition => {
    const schema: Record<string, any> | undefined = getDatasourceSchema({
      API,
      datasource: get(datasource) as any, // TODO: see line 1
      definition: $definition ?? undefined,
    })
    if (!schema) {
      return null
    }

    // Ensure schema is configured as objects.
    // Certain datasources like queries use primitives.
    Object.keys(schema).forEach(key => {
      if (typeof schema[key] !== "object") {
        schema[key] = { name: key, type: schema[key] }
      }
    })

    return schema
  })

  // Derives the total enriched schema, made up of the saved schema and any
  // prop and user overrides
  const enrichedSchema = derived(
    [schema, schemaOverrides, schemaMutations, subSchemaMutations],
    ([$schema, $schemaOverrides, $schemaMutations, $subSchemaMutations]) => {
      if (!$schema) {
        return null
      }

      const schemaWithRelatedColumns = enrichSchemaWithRelColumns($schema)

      const enrichedSchema: Record<string, UIFieldSchema> = {}
      Object.keys(schemaWithRelatedColumns || {}).forEach(field => {
        enrichedSchema[field] = {
          ...schemaWithRelatedColumns?.[field],
          ...$schemaOverrides?.[field],
          ...$schemaMutations[field],
        }

        if ($subSchemaMutations[field]) {
          enrichedSchema[field].columns ??= {}
          for (const fieldName of Object.keys($subSchemaMutations[field])) {
            const mutation = $subSchemaMutations[field][fieldName]
            enrichedSchema[field].columns[fieldName] = {
              ...enrichedSchema[field].columns[fieldName],
              ...mutation,
            }
          }
        }
      })
      return enrichedSchema
    }
  )

  const hasBudibaseIdentifiers = derived(
    [datasource, definition],
    ([$datasource, $definition]) => {
      let type = $datasource?.type
      // @ts-expect-error
      if (type === "provider") {
        type = ($datasource as any).value?.datasource?.type // TODO: see line 1
      }
      // Handle calculation views
      if (
        type === "viewV2" &&
        $definition &&
        "type" in $definition &&
        $definition.type === ViewV2Type.CALCULATION
      ) {
        return false
      }
      return !!type && ["table", "viewV2", "link"].includes(type)
    }
  )

  return {
    schema,
    enrichedSchema,
    hasBudibaseIdentifiers,
  }
}

export const createActions = (context: StoreContext): ActionDatasourceStore => {
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
    subSchemaMutations,
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
      datasource: get(datasource) as any, // TODO: see line 1
    })
    definition.set(def as any) // TODO: see line 1
  }

  // Saves the datasource definition
  const saveDefinition = async (
    newDefinition: SaveTableRequest | UpdateViewRequest
  ) => {
    // Update local state
    const originalDefinition = get(definition)
    definition.set(newDefinition)

    // Update server
    if (get(config).canSaveSchema) {
      try {
        await getAPI()?.actions.saveDefinition(newDefinition as never)

        // Broadcast change so external state can be updated, as this change
        // will not be received by the builder websocket because we caused it
        // ourselves
        dispatch("updatedatasource", newDefinition)
      } catch (error: any) {
        const msg = error?.message || error || "Unknown error"
        get(notifications).error(`Error saving schema: ${msg}`)

        // Reset the definition if saving failed
        definition.set(originalDefinition)
      }
    }
  }

  // Updates the datasources primary display column
  const changePrimaryDisplay = async (column: string) => {
    let newDefinition = cloneDeep(get(definition)!)

    // Update primary display
    newDefinition.primaryDisplay = column

    if (newDefinition.schema) {
      // Sanitise schema to ensure field is required and has no default value
      if (!newDefinition.schema[column].constraints) {
        newDefinition.schema[column].constraints = {}
      }
      newDefinition.schema[column].constraints.presence = { allowEmpty: false }
      if ("default" in newDefinition.schema[column]) {
        delete newDefinition.schema[column].default
      }
    }
    return await saveDefinition(newDefinition as any) // TODO: see line 1
  }

  // Adds a schema mutation for a single field
  const addSchemaMutation = (field: string, mutation: UIFieldMutation) => {
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

  // Adds a nested schema mutation for a single field
  const addSubSchemaMutation = (
    field: string,
    fromField: string,
    mutation: UIFieldMutation
  ) => {
    if (!field || !fromField || !mutation) {
      return
    }
    subSchemaMutations.update($subSchemaMutations => {
      return {
        ...$subSchemaMutations,
        [fromField]: {
          ...$subSchemaMutations[fromField],
          [field]: {
            ...($subSchemaMutations[fromField] || {})[field],
            ...mutation,
          },
        },
      }
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
    const $subSchemaMutations = get(subSchemaMutations)
    const $schema = get(schema) || {}
    let newSchema: Record<string, UIFieldSchema> = {}

    // Build new updated datasource schema
    Object.keys($schema).forEach(column => {
      newSchema[column] = {
        ...$schema[column],
        ...$schemaMutations[column],
      }
      if ($subSchemaMutations[column]) {
        newSchema[column].columns ??= {}
        for (const fieldName of Object.keys($subSchemaMutations[column])) {
          const mutation = $subSchemaMutations[column][fieldName]
          newSchema[column].columns[fieldName] = {
            ...newSchema[column].columns[fieldName],
            ...mutation,
          }
        }
      }
    })

    // Save the changes, then reset our local mutations
    await saveDefinition({
      ...$definition,
      schema: newSchema,
    } as any) // TODO: see line 1
    resetSchemaMutations()
  }

  const resetSchemaMutations = () => {
    schemaMutations.set({})
    subSchemaMutations.set({})
  }

  // Adds a row to the datasource
  const addRow = async (row: SaveRowRequest) => {
    return await getAPI()?.actions.addRow(row)
  }

  // Updates an existing row in the datasource
  const updateRow = async (row: SaveRowRequest) => {
    return await getAPI()?.actions.updateRow(row)
  }

  // Deletes rows from the datasource
  const deleteRows = async (rows: UIRow[]) => {
    return await getAPI()?.actions.deleteRows(rows)
  }

  // Gets a single row from a datasource
  const getRow = async (id: string) => {
    return await getAPI()?.actions.getRow(id)
  }

  // Checks if a certain datasource config is valid
  const isDatasourceValid = (datasource: UIDatasource) => {
    return getAPI()?.actions.isDatasourceValid(datasource)
  }

  // Checks if this datasource can use a specific column by name
  const canUseColumn = (name: string) => {
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
        addSubSchemaMutation,
        saveSchemaMutations,
        resetSchemaMutations,
      },
    },
  }
}
