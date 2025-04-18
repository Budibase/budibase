import { FieldType, FormulaType } from "@budibase/types"
import { FIELDS } from "@/constants/backend"
import { tables } from "@/stores/builder"
import { get as svelteGet } from "svelte/store"
import { makeReadableKeyPropSafe } from "@/dataBinding"

// currently supported level of relationship depth (server side)
const MAX_DEPTH = 1

const TYPES_TO_SKIP = [
  FieldType.AI,
  FieldType.LONGFORM,
  FieldType.SIGNATURE_SINGLE,
  FieldType.ATTACHMENTS,
  //https://github.com/Budibase/budibase/issues/3030
  FieldType.INTERNAL,
]

const shouldSkipFieldSchema = fieldSchema => {
  // Skip some types always
  if (TYPES_TO_SKIP.includes(fieldSchema.type)) {
    return true
  }
  // Skip dynamic formula fields
  return (
    fieldSchema.type === FieldType.FORMULA &&
    fieldSchema.formulaType === FormulaType.DYNAMIC
  )
}

export function getBindings({
  table,
  path = null,
  category = null,
  depth = 0,
}) {
  let bindings = []
  if (!table) {
    return bindings
  }
  for (const [column, schema] of Object.entries(table.schema)) {
    const isRelationship = schema.type === FieldType.LINK
    // skip relationships after a certain depth and types which
    // can't bind to
    if (
      shouldSkipFieldSchema(schema) ||
      (isRelationship && depth >= MAX_DEPTH)
    ) {
      continue
    }
    category = category == null ? `${table.name} Fields` : category
    if (isRelationship && depth < MAX_DEPTH) {
      const relatedTable = svelteGet(tables).list.find(
        table => table._id === schema.tableId
      )
      const relatedBindings = bindings.concat(
        getBindings({
          table: relatedTable,
          path: column,
          category: `${column} Relationships`,
          depth: depth + 1,
        })
      )
      // remove the ones that have already been found
      bindings = bindings.concat(
        relatedBindings.filter(
          related => !bindings.find(binding => binding.path === related.path)
        )
      )
    }
    const field = Object.values(FIELDS).find(
      field => field.type === schema.type
    )

    const label = path == null ? column : `${path}.0.${column}`
    const binding = path == null ? `[${column}]` : `[${path}].0.[${column}]`
    const readableBinding = (path == null ? [column] : [path, "0", column])
      .map(makeReadableKeyPropSafe)
      .join(".")

    // only supply a description for relationship paths
    const description =
      path == null
        ? undefined
        : `Update the "0" with the index of relationships or use array helpers`
    bindings.push({
      label: label,
      type: field.name === FIELDS.LINK.name ? "Array" : field.name,
      category,
      path: label,
      description,
      // don't include path, it messes things up, relationship path
      // will be replaced by the main array binding
      readableBinding,
      runtimeBinding: binding,
      display: {
        name: label,
        type: field.name === FIELDS.LINK.name ? "Array" : field.name,
      },
    })
  }
  return bindings
}
