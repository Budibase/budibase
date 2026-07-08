import { context } from "@budibase/backend-core"
import {
  ValidColumnNameRegex,
  dataFilters,
  helpers,
} from "@budibase/shared-core"
import {
  Document,
  FieldType,
  isLogicalSearchOperator,
  LegacyFilter,
  LinkDocument,
  SearchFilterGroup,
  SearchFilters,
  Table,
  UISearchFilter,
  ViewV2,
} from "@budibase/types"
import sdk from "../../sdk"
import { generateLinkID } from "../../db/utils"

// Older versions (<= 3.39.7) allowed relationship columns to be created with a
// `fieldName` containing illegal characters. Once LinkController.validateTable
// started rejecting these, the owning table could no longer be saved/updated,
// leaving it in a "limbo" state. This migration sanitises any illegal
// relationship `fieldName` on internal tables and rewrites every reference the
// schema tracks: the LINK column, the mirrored column in the related table, the
// link documents, and views on any table (own columns + relationship `columns`
// maps + saved filter references in `query`/`queryUI`). It does NOT rewrite
// automation/screen/formula binding strings - the platform does not migrate
// those on a normal rename either, and illegal characters cannot appear in
// those bindings.

interface ColumnRename {
  tableId: string
  old: string
  updated: string
}

const isIllegalName = (name?: string): name is string =>
  !!name && !name.match(new RegExp(ValidColumnNameRegex))

const sanitize = (name: string, taken: Set<string>): string => {
  let base = name
    .replace(/[^_a-zA-Z0-9\s]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
  if (!base) {
    base = "column"
  }
  let candidate = base
  let counter = 1
  while (taken.has(candidate.toLowerCase())) {
    candidate = `${base}_${counter++}`
  }
  return candidate
}

// rewrite field references inside a V2 view's saved filters (`query` in both its
// SearchFilters and legacy-array forms, and the `queryUI` group tree). `match`
// receives each field key with any numeric uniqueness prefix (e.g. `1:`) removed
// and returns the replacement key, or undefined to leave the reference untouched.
// Returns whether any reference was rewritten.
const renameViewFilterFields = (
  view: ViewV2,
  match: (bareKey: string) => string | undefined
): boolean => {
  let changed = false
  const rename = (fieldKey: string): string => {
    const { prefix, key } = dataFilters.getKeyNumbering(fieldKey)
    const renamed = match(key)
    if (renamed === undefined || renamed === key) {
      return fieldKey
    }
    changed = true
    return `${prefix || ""}${renamed}`
  }

  const renameConditionKeys = (filters: SearchFilters) => {
    for (const filterKey of Object.keys(filters) as (keyof SearchFilters)[]) {
      if (isLogicalSearchOperator(filterKey)) {
        for (const condition of filters[filterKey]!.conditions) {
          renameConditionKeys(condition)
        }
        continue
      }
      const operand = filters[filterKey]!
      if (typeof operand !== "object") {
        continue
      }
      for (const key of Object.keys(operand)) {
        const renamed = rename(key)
        if (renamed !== key) {
          operand[renamed] = operand[key]
          delete operand[key]
        }
      }
    }
  }

  const renameLegacyFilters = (filters: LegacyFilter[]) => {
    for (const filter of filters) {
      if ("field" in filter && typeof filter.field === "string") {
        filter.field = rename(filter.field)
      }
    }
  }

  if (Array.isArray(view.query)) {
    renameLegacyFilters(view.query)
  } else if (view.query) {
    renameConditionKeys(view.query)
  }

  const renameGroups = (
    groups: (SearchFilterGroup | UISearchFilter)[] | undefined
  ) => {
    for (const group of groups || []) {
      renameGroups(group.groups)
      if ("filters" in group && group.filters) {
        renameLegacyFilters(group.filters)
      }
    }
  }
  renameGroups(view.queryUI?.groups)

  return changed
}

// rewrite references to a renamed column *within its own table*
const renameOwnReferences = (table: Table, old: string, updated: string) => {
  const field = table.schema[old]
  if (field) {
    field.name = updated
    table.schema[updated] = field
    delete table.schema[old]
  }
  if (table.primaryDisplay === old) {
    table.primaryDisplay = updated
  }
  if (table.constrained) {
    table.constrained = table.constrained.map(c => (c === old ? updated : c))
  }
  if (table.indexes) {
    table.indexes = table.indexes.map(c => (c === old ? updated : c))
  }
  if (table.relatedFormula) {
    table.relatedFormula = table.relatedFormula.map(c =>
      c === old ? updated : c
    )
  }
  for (const view of Object.values(table.views || {})) {
    if (!helpers.views.isV2(view) || !view.schema) {
      continue
    }
    if (view.schema[old]) {
      view.schema[updated] ??= view.schema[old]
      delete view.schema[old]
    }
    if (view.primaryDisplay === old) {
      view.primaryDisplay = updated
    }
    if (view.sort?.field === old) {
      view.sort.field = updated
    }
    // saved filters may reference the column directly (`old`) or filter through
    // it on a sub-column (`old.subField`)
    renameViewFilterFields(view, key => {
      if (key === old) {
        return updated
      }
      if (key.startsWith(`${old}.`)) {
        return `${updated}${key.slice(old.length)}`
      }
      return undefined
    })
  }
}

// rewrite references to `relatedTableId`.`old` inside views of `table` that
// expose the related column through a relationship field - both in the field's
// `columns` map and in saved filters keyed as `relationshipField.old` (or
// `relationshipField.old.subField`). Returns whether anything was rewritten.
const renameRelationshipColumnRefs = (
  table: Table,
  relatedTableId: string,
  old: string,
  updated: string
): boolean => {
  const relFields = Object.entries(table.schema)
    .filter(
      ([, field]) =>
        field.type === FieldType.LINK && field.tableId === relatedTableId
    )
    .map(([fieldName]) => fieldName)
  if (relFields.length === 0) {
    return false
  }

  let changed = false
  for (const view of Object.values(table.views || {})) {
    if (!helpers.views.isV2(view) || !view.schema) {
      continue
    }
    for (const relField of relFields) {
      const viewField = view.schema[relField]
      const columns =
        viewField && "columns" in viewField ? viewField.columns : undefined
      if (columns && columns[old]) {
        columns[updated] = columns[old]
        delete columns[old]
        changed = true
      }
    }
    const filtersChanged = renameViewFilterFields(view, key => {
      for (const relField of relFields) {
        const prefix = `${relField}.`
        if (!key.startsWith(prefix)) {
          continue
        }
        const rest = key.slice(prefix.length)
        if (rest === old) {
          return `${prefix}${updated}`
        }
        if (rest.startsWith(`${old}.`)) {
          return `${prefix}${updated}${rest.slice(old.length)}`
        }
      }
      return undefined
    })
    changed = changed || filtersChanged
  }
  return changed
}

const migration = async () => {
  const db = context.getWorkspaceDB()
  const tables = await sdk.tables.getAllInternalTables()

  const rawTableCache = new Map<string, Table>()
  const getRawTable = async (tableId: string): Promise<Table> => {
    if (!rawTableCache.has(tableId)) {
      rawTableCache.set(tableId, await db.get<Table>(tableId))
    }
    return rawTableCache.get(tableId)!
  }

  const renames: ColumnRename[] = []

  // 1. sanitise illegal LINK fieldNames, fix the owning column's pointer and
  //    rename the mirrored column (+ its own references) in the related table
  for (const table of tables) {
    for (const field of Object.values(table.schema)) {
      if (
        field.type !== FieldType.LINK ||
        field.autocolumn ||
        !isIllegalName(field.fieldName)
      ) {
        continue
      }

      const relatedTableId = field.tableId
      const relatedTable = await getRawTable(relatedTableId)
      const old = field.fieldName

      const taken = new Set(
        Object.keys(relatedTable.schema)
          .filter(key => key !== old)
          .map(key => key.toLowerCase())
      )
      const updated = sanitize(old, taken)

      const owningTable = await getRawTable(table._id!)
      const owningField = owningTable.schema[field.name]
      if (owningField && owningField.type === FieldType.LINK) {
        owningField.fieldName = updated
      }

      renameOwnReferences(relatedTable, old, updated)
      renames.push({ tableId: relatedTableId, old, updated })
    }
  }

  if (renames.length === 0) {
    return
  }

  // 2. rewrite relationship references (view `columns` maps + saved filter keys)
  //    to the renamed column in views across all tables
  for (const rename of renames) {
    for (const table of tables) {
      const relatesToRenamed = Object.values(table.schema).some(
        field =>
          field.type === FieldType.LINK && field.tableId === rename.tableId
      )
      if (!relatesToRenamed) {
        continue
      }
      const wasQueued = rawTableCache.has(table._id!)
      const rawTable = await getRawTable(table._id!)
      const changed = renameRelationshipColumnRefs(
        rawTable,
        rename.tableId,
        rename.old,
        rename.updated
      )
      // only keep the table queued for writing if it (or an earlier step)
      // actually changed it
      if (!changed && !wasQueued) {
        rawTableCache.delete(table._id!)
      }
    }
  }

  const docsToWrite: Document[] = []

  // 3. rewrite link documents - the illegal fieldName is stored on the half
  //    that belongs to the related table (and is embedded in the doc _id)
  const linkDocs = await db.allDocs<LinkDocument>({
    startkey: "li",
    endkey: `li￰`,
    include_docs: true,
  })
  for (const row of linkDocs.rows) {
    const link = row.doc
    if (!link || !link.doc1 || !link.doc2) {
      continue
    }
    let changed = false
    for (const half of [link.doc1, link.doc2]) {
      const match = renames.find(
        r => r.tableId === half.tableId && r.old === half.fieldName
      )
      if (match) {
        half.fieldName = match.updated
        changed = true
      }
    }
    if (changed) {
      const newId = generateLinkID(
        link.doc1.tableId,
        link.doc2.tableId,
        link.doc1.rowId,
        link.doc2.rowId,
        link.doc1.fieldName,
        link.doc2.fieldName
      )
      if (newId !== link._id) {
        docsToWrite.push({ _id: link._id, _rev: link._rev, _deleted: true })
        docsToWrite.push({ ...link, _id: newId, _rev: undefined })
      } else {
        docsToWrite.push(link)
      }
    }
  }

  for (const table of rawTableCache.values()) {
    docsToWrite.push(table)
  }

  await db.bulkDocs(docsToWrite)
}

export default migration
