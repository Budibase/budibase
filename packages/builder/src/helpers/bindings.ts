import { makePropSafe } from "@budibase/string-templates"
import { UIBinding } from "@budibase/types"

export function extractRelationships(bindings: UIBinding[]) {
  return (
    bindings
      // Get only link bindings
      .filter(x => x.fieldSchema?.type === "link")
      // Filter out bindings provided by forms
      .filter(x => !x.component?.endsWith("/form"))
      .map(binding => {
        const { providerId, readableBinding, fieldSchema } = binding || {}
        const { name, tableId } = fieldSchema || {}
        const safeProviderId = makePropSafe(providerId)
        return {
          providerId,
          label: readableBinding,
          fieldName: name,
          tableId,
          type: "link",
          // These properties will be enriched by the client library and provide
          // details of the parent row of the relationship field, from context
          rowId: `{{ ${safeProviderId}.${makePropSafe("_id")} }}`,
          rowTableId: `{{ ${safeProviderId}.${makePropSafe("tableId")} }}`,
        }
      })
  )
}

export function extractFields(bindings: UIBinding[]) {
  return bindings
    .filter(
      x =>
        x.fieldSchema?.type === "attachment" ||
        (x.fieldSchema?.type === "array" && x.tableId)
    )
    .map(binding => {
      const { providerId, readableBinding, runtimeBinding } = binding
      const { name, type, tableId } = binding.fieldSchema!
      return {
        providerId,
        label: readableBinding,
        fieldName: name,
        fieldType: type,
        tableId,
        type: "field",
        value: `{{ literal ${runtimeBinding} }}`,
      }
    })
}

export function extractJSONArrayFields(bindings: UIBinding[]) {
  return bindings
    .filter(
      x =>
        x.fieldSchema?.type === "jsonarray" ||
        (x.fieldSchema?.type === "json" && x.fieldSchema?.subtype === "array")
    )
    .map(binding => {
      const { providerId, readableBinding, runtimeBinding, tableId } = binding
      const { name, type, prefixKeys, subtype } = binding.fieldSchema!
      return {
        providerId,
        label: readableBinding,
        fieldName: name,
        fieldType: type,
        tableId,
        prefixKeys,
        type: type === "jsonarray" ? "jsonarray" : "queryarray",
        subtype,
        value: `{{ literal ${runtimeBinding} }}`,
      }
    })
}
