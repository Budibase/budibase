import { FIELDS } from "constants/backend"
import { tables } from "stores/backend"
import { get as svelteGet } from "svelte/store"
import { _ } from "../../../../lang/i18n"

// currently supported level of relationship depth (server side)
const MAX_DEPTH = 1

//https://github.com/Budibase/budibase/issues/3030
const internalType = "internal"

const TYPES_TO_SKIP = [
  FIELDS.FORMULA.type,
  FIELDS.LONGFORM.type,
  FIELDS.ATTACHMENT.type,
  internalType,
]

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
  for (let [column, schema] of Object.entries(table.schema)) {
    const isRelationship = schema.type === FIELDS.LINK.type
    // skip relationships after a certain depth and types which
    // can't bind to
    if (
      TYPES_TO_SKIP.includes(schema.type) ||
      (isRelationship && depth >= MAX_DEPTH)
    ) {
      continue
    }
    category =
      category == null
        ? `${table.name} ${$_("components.backend.DataTable.formula.Fields")}`
        : category
    if (isRelationship && depth < MAX_DEPTH) {
      const relatedTable = svelteGet(tables).list.find(
        table => table._id === schema.tableId
      )
      const relatedBindings = bindings.concat(
        getBindings({
          table: relatedTable,
          path: column,
          category: `${column} ${$_(
            "components.backend.DataTable.formula.Relationships"
          )}`,
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
    // only supply a description for relationship paths
    const description =
      path == null
        ? undefined
        : `${$_("components.backend.DataTable.formula.Update")}`
    bindings.push({
      label: label,
      type:
        field.name === FIELDS.LINK.name
          ? $_("components.backend.DataTable.formula.Array")
          : field.name,
      category,
      path: label,
      description,
      // don't include path, it messes things up, relationship path
      // will be replaced by the main array binding
      readableBinding: label,
      runtimeBinding: binding,
    })
  }
  return bindings
}
