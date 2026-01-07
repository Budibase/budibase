import { derived, writable, get } from "svelte/store"
import { keepOpen, notifications } from "@budibase/bbui"
import { datasources, tables, integrations } from "@/stores/builder"
import {
  Datasource,
  DatasourceRelationshipConfig,
  DatasourceRelationshipType,
  FieldType,
  Table,
  TableSchema,
  FieldSchema,
} from "@budibase/types"
import { RelationshipType } from "@/constants/backend"
import { integrationForDatasource } from "@/stores/selectors"

export const createRelationshipSelectionStore = (datasource: Datasource) => {
  const relationshipsStore = writable<DatasourceRelationshipConfig[]>([])
  const selectedRelationshipsStore = writable<DatasourceRelationshipConfig[]>(
    []
  )
  const errorStore = writable<Error | null>(null)
  const loadingStore = writable<boolean>(true)

  datasources.getRelationships(datasource).then(relationships => {
    relationshipsStore.set(relationships)
    selectedRelationshipsStore.set(
      relationships.filter(_relationship => {
        // For now, select all relationships by default
        // In the future, we might check if relationships are already defined
        return true
      })
    )
    loadingStore.set(false)
  })

  const setSelectedRelationships = (
    selectedRelationships: DatasourceRelationshipConfig[]
  ) => {
    selectedRelationshipsStore.set(selectedRelationships)
  }

  const importSelectedRelationships = async (onComplete: () => any) => {
    errorStore.set(null)

    try {
      const _selectedRelationships = get(selectedRelationshipsStore)
      let importedCount = 0

      // Collect junction tables that need to be imported
      const junctionTablesToImport = new Set<string>()
      for (const relationship of _selectedRelationships) {
        if (
          relationship.relationshipType ===
            DatasourceRelationshipType.MANY_TO_MANY &&
          relationship.junctionTable
        ) {
          // Check if junction table is already imported
          if (!datasource.entities?.[relationship.junctionTable]) {
            junctionTablesToImport.add(relationship.junctionTable)
          }
        }
      }

      // Import junction tables if any
      if (junctionTablesToImport.size > 0) {
        const existingTableNames = Object.keys(datasource.entities || {})
        const allTableNames = [...existingTableNames, ...junctionTablesToImport]

        await datasources.updateSchema(datasource, allTableNames)

        // Refresh the datasource from the store
        await datasources.fetch()
        // Get the updated datasource
        const updatedDatasources = (get(datasources) as any).list
        const updatedDatasource = updatedDatasources.find(
          (ds: any) => ds._id === datasource._id
        )
        if (updatedDatasource) {
          datasource = updatedDatasource
        }
      }

      // Create relationship columns for each selected relationship
      for (const relationship of _selectedRelationships) {
        const wasCreated = await createRelationshipColumns(
          datasource,
          relationship
        )
        if (wasCreated) {
          importedCount++
        }
      }

      // Only save if we actually created new relationships
      if (importedCount > 0) {
        // Save the updated datasource
        const integration = integrationForDatasource(
          get(integrations),
          datasource
        )
        await datasources.save({ datasource, integration })

        // Refresh tables to show the new relationship columns
        await tables.fetch()

        const skippedCount = _selectedRelationships.length - importedCount
        let message = `Successfully imported ${importedCount} relationship${importedCount !== 1 ? "s" : ""}.`
        if (skippedCount > 0) {
          message += ` ${skippedCount} relationship${skippedCount !== 1 ? "s" : ""} already existed and were skipped.`
        }
        if (junctionTablesToImport.size > 0) {
          message += ` ${junctionTablesToImport.size} junction table${junctionTablesToImport.size !== 1 ? "s" : ""} were also imported.`
        }
        notifications.success(message)
      } else {
        notifications.info("All selected relationships already exist.")
      }

      await onComplete()
    } catch (err: any) {
      errorStore.set(err)
      return keepOpen
    }
  }

  const createRelationshipColumns = async (
    datasource: Datasource,
    relationship: DatasourceRelationshipConfig
  ): Promise<boolean> => {
    // Ensure the tables exist in the datasource
    if (!datasource.entities) {
      datasource.entities = {}
    }
    if (!datasource.entities[relationship.sourceTable]) {
      throw new Error(
        `Source table '${relationship.sourceTable}' not found in datasource`
      )
    }
    if (!datasource.entities[relationship.targetTable]) {
      throw new Error(
        `Target table '${relationship.targetTable}' not found in datasource`
      )
    }

    const sourceTable = datasource.entities[relationship.sourceTable]
    const targetTable = datasource.entities[relationship.targetTable]

    // Check if this relationship already exists
    const junctionTableId =
      relationship.relationshipType ===
        DatasourceRelationshipType.MANY_TO_MANY && relationship.junctionTable
        ? datasource.entities[relationship.junctionTable]?._id
        : undefined
    if (
      relationshipExists(
        sourceTable,
        targetTable,
        relationship,
        junctionTableId
      )
    ) {
      // Relationship already exists, skip creating it
      return false
    }

    if (
      relationship.relationshipType === DatasourceRelationshipType.MANY_TO_MANY
    ) {
      // For many-to-many relationships, we need the junction table
      if (!relationship.junctionTable) {
        throw new Error(
          `Junction table not specified for many-to-many relationship between ${relationship.sourceTable} and ${relationship.targetTable}`
        )
      }

      // Get the junction table entity
      const junctionTable = datasource.entities[relationship.junctionTable]
      if (!junctionTable) {
        throw new Error(
          `Junction table '${relationship.junctionTable}' not found in datasource`
        )
      }

      // Generate unique column names
      const sourceColumnName = generateRelationshipColumnName(
        sourceTable.schema,
        relationship.targetTable,
        relationship.sourceColumn
      )

      const targetColumnName = generateRelationshipColumnName(
        targetTable.schema,
        relationship.sourceTable,
        relationship.targetColumn
      )

      // Create many-to-many relationship columns
      // Source table column
      sourceTable.schema[sourceColumnName] = {
        type: FieldType.LINK,
        name: sourceColumnName,
        fieldName: targetTable.primary?.[0] || relationship.targetColumn, // Primary key of target table
        tableId: targetTable._id!,
        relationshipType: RelationshipType.MANY_TO_MANY,
        through: junctionTable._id!, // Table ID, not name
        throughFrom: relationship.targetColumn, // FK column in junction table pointing to target
        throughTo: relationship.sourceColumn, // FK column in junction table pointing to source
        main: true,
      }

      // Target table column
      targetTable.schema[targetColumnName] = {
        type: FieldType.LINK,
        name: targetColumnName,
        fieldName: sourceTable.primary?.[0] || relationship.sourceColumn, // Primary key of source table
        tableId: sourceTable._id!,
        relationshipType: RelationshipType.MANY_TO_MANY,
        through: junctionTable._id!, // Table ID, not name
        throughFrom: relationship.sourceColumn, // FK column in junction table pointing to source
        throughTo: relationship.targetColumn, // FK column in junction table pointing to target
      }
    } else {
      // Handle many-to-one relationships (existing logic)
      // Generate unique column names with improved naming convention
      // Source table (FK side): first try foreign table name, then foreignTable_sourceColumn
      const sourceColumnName = generateRelationshipColumnName(
        sourceTable.schema,
        relationship.targetTable, // table name
        relationship.sourceColumn // column name
      )

      // Target table (PK side): first try foreign table name (plural), then foreignTable_targetColumn
      const targetColumnName = generateRelationshipColumnName(
        targetTable.schema,
        relationship.sourceTable, // table name
        relationship.targetColumn // column name
      )

      // Create the relationship columns
      // Source table column (one-to-many relationship) - FK side shows related PK records
      sourceTable.schema[sourceColumnName] = {
        type: FieldType.LINK,
        name: sourceColumnName,
        fieldName: relationship.targetColumn, // PK column we're linking to
        tableId: targetTable._id!,
        relationshipType: RelationshipType.ONE_TO_MANY,
        foreignKey: relationship.sourceColumn, // FK column linking out
      }

      // Target table column (many-to-one relationship) - PK side points to FK side
      targetTable.schema[targetColumnName] = {
        type: FieldType.LINK,
        name: targetColumnName,
        fieldName: relationship.sourceColumn, // FK column we're linking to
        tableId: sourceTable._id!,
        relationshipType: RelationshipType.MANY_TO_ONE,
        foreignKey: relationship.targetColumn, // PK column linking out
        main: true,
      }
    }

    return true
  }

  const relationshipExists = (
    sourceTable: Table,
    targetTable: Table,
    relationship: DatasourceRelationshipConfig,
    junctionTableId?: string
  ): boolean => {
    // Check if there's already a link column that represents this relationship
    // regardless of column name - check the actual relationship definition
    const sourceLinks = Object.values(sourceTable.schema || {}).filter(
      (col): col is FieldSchema => col.type === FieldType.LINK
    )

    const targetLinks = Object.values(targetTable.schema || {}).filter(
      (col): col is FieldSchema => col.type === FieldType.LINK
    )

    if (
      relationship.relationshipType === DatasourceRelationshipType.MANY_TO_MANY
    ) {
      // For many-to-many, check if there's already a link with the same through table and FK mappings
      const sourceMatch = sourceLinks.some(
        (link: any) =>
          link.tableId === targetTable._id &&
          link.through === junctionTableId &&
          link.relationshipType === RelationshipType.MANY_TO_MANY &&
          link.throughFrom === relationship.targetColumn &&
          link.throughTo === relationship.sourceColumn
      )

      const targetMatch = targetLinks.some(
        (link: any) =>
          link.tableId === sourceTable._id &&
          link.through === junctionTableId &&
          link.relationshipType === RelationshipType.MANY_TO_MANY &&
          link.throughFrom === relationship.sourceColumn &&
          link.throughTo === relationship.targetColumn
      )

      return sourceMatch && targetMatch
    } else {
      // Check if any existing link in source table matches this relationship definition
      const sourceMatch = sourceLinks.some(
        (link: any) =>
          link.tableId === targetTable._id &&
          link.fieldName === relationship.targetColumn &&
          link.foreignKey === relationship.sourceColumn
      )

      // Check if any existing link in target table matches this relationship definition
      const targetMatch = targetLinks.some(
        (link: any) =>
          link.tableId === sourceTable._id &&
          link.fieldName === relationship.sourceColumn &&
          link.foreignKey === relationship.targetColumn
      )

      return sourceMatch && targetMatch
    }
  }

  const generateRelationshipColumnName = (
    schema: TableSchema,
    tableName: string,
    _columnName: string
  ): string => {
    // First try: just the table name
    if (!schema[tableName]) {
      return tableName
    }

    // tableName format with incrementing counter
    let counter = 1
    let uniqueName = `${tableName}_${counter}`
    while (schema[uniqueName]) {
      counter++
      uniqueName = `${tableName}_${counter}`
    }

    return uniqueName
  }

  const combined = derived(
    [relationshipsStore, selectedRelationshipsStore, errorStore, loadingStore],
    ([
      $relationshipsStore,
      $selectedRelationshipsStore,
      $errorStore,
      $loadingStore,
    ]) => {
      return {
        relationshipOptions: $relationshipsStore.map(rel => ({
          id: rel._id,
          label: rel.label,
        })),
        selectedRelationshipIds: $selectedRelationshipsStore.map(
          rel => rel._id
        ),
        relationships: $relationshipsStore,
        selectedRelationships: $selectedRelationshipsStore,
        error: $errorStore,
        loading: $loadingStore,
        hasSelected: $selectedRelationshipsStore.length > 0,
      }
    }
  )

  return {
    subscribe: combined.subscribe,
    setSelectedRelationships,
    importSelectedRelationships,
  }
}
