import { FieldType } from "@budibase/types"
import { tableForDatasource } from "../../../../tests/utilities/structures"

// Grab the second parameter type of `tableForDatasource`.
// `Parameters<F>` produces a tuple of parameter types; [1] indexes the second.
export type TableArg = Parameters<typeof tableForDatasource>[1]
export type SchemaType = NonNullable<TableArg["schema"]>
export type FieldSchema = SchemaType[string]

/**
 * Create a schema entry object for a given column name and field type.
 *
 * The generic <Type extends FieldType> narrows the return type so that
 * the resulting object is typed as a FieldSchema whose `type` property
 * matches the `type` argument passed in. This makes TypeScript smart enough to know
 * what kind of field you’re working with later. For example, if you call this function
 * with FieldType.NUMBER, TypeScript will remember that and treat the result as a
 * “number field.”
 *
 * Runtime, it returns a plain object with name, type, and an empty
 * constraints object.
 */
export function createSchemaEntry<Type extends FieldType>(
  columnName: string,
  type: Type
): Extract<FieldSchema, { type: Type }> {
  return {
    name: columnName,
    type,
    constraints: {} as any,
  } as Extract<FieldSchema, { type: Type }>
}
