import { z } from "zod"
import {
  FieldType,
  FormFieldType,
  type ComponentPayload,
  type FieldSchema,
  type FormFieldPayload,
  type FormPayload,
  type RequiredKeys,
} from "@budibase/types"
import { newTool } from ".."
import sdk from "../../../sdk"
import { utils } from "@budibase/shared-core"

const buttonComponentSchema: z.ZodType<ComponentPayload> = z.object({
  componentId: z
    .string()
    .describe("A unique id to keep track of the component"),
  type: z.literal("Button"),
  props: z.object({
    text: z.string(),
    primary: z.boolean(),
    onClick: z
      .string()
      .describe(
        "A valid stringify function, without parameters. It will be executed on click"
      ),
  }),
})

const componentSchema: z.ZodType<ComponentPayload> = z.union([
  buttonComponentSchema,
  buttonComponentSchema,
])

export const componentToolResultSchema = z.object({
  type: z.literal("component"),
  component: componentSchema,
  message: z.string().optional(),
})

export default [
  newTool({
    name: "build_component",
    description:
      "Allow rendering components from the Budibase UI. Call this when you want to present an interactive component to the user. This will return a payload that will be used in the frontend to render. Do not try to render or return plain HTML.",
    parameters: z.object({
      component: componentSchema.describe("The component to render."),
      message: z
        .string()
        .describe(
          "Optional short assistant message to accompany the component."
        ),
    }),
    handler: async ({ component, message }) => {
      return JSON.stringify(
        componentToolResultSchema.parse({
          type: "component",
          component,
          message,
        })
      )
    },
  }),
  newTool({
    name: "render_table_form",
    description:
      "Render a form component for a given table. Use this when the user wants to create or edit data for a specific table, to show an interactive form instead of replying with static text.",
    parameters: z.object({
      tableId: z
        .string()
        .describe("Table ID of the table to render the form for."),
      columns: z
        .array(z.string())
        .describe(
          "List of column to include in the form. It should from come from the table schema."
        ),
      componentId: z.string().describe("Explicit component identifier."),
      message: z
        .string()
        .nullish()
        .describe("Optional message to accompany the component."),
    }),
    handler: async ({ tableId, columns, componentId, message }) => {
      const table = await sdk.tables.getTable(tableId)
      const tableColumns = Object.entries(table.schema ?? {}).filter(
        ([key, schema]) => {
          if (schema.autocolumn) {
            return false
          }
          return !key.startsWith("_")
        }
      )

      if (!tableColumns.length) {
        return `Error: Table "${table.name}" does not have any user-configurable columns.`
      }

      const selectedColumns =
        columns && columns.length
          ? tableColumns.filter(([column]) => columns.includes(column))
          : tableColumns

      if (!selectedColumns.length) {
        return `Error: None of the requested columns are available on table "${table.name}".`
      }

      function mapField(column: FieldSchema): FormFieldPayload {
        switch (column.type) {
          case FieldType.STRING:
          case FieldType.DATETIME:
            return {
              name: column.name,
              type: FormFieldType.Input,
              // helpText: column.description,
              errorText: `Please provide a valid ${column.name}.`,
            }
          case FieldType.NUMBER:
            return {
              name: column.name,
              type: FormFieldType.InputNumber,
              // helpText: column.description,
              errorText: `Please provide a valid ${column.name}.`,
            }
          case FieldType.BOOLEAN:
            return {
              name: column.name,
              type: FormFieldType.Toggle,
              // helpText: column.description,
              errorText: `Please provide a valid ${column.name}.`,
            }
          case FieldType.LONGFORM:
            return {
              name: column.name,
              type: FormFieldType.TextArea,
              // helpText: column.description,
              errorText: `Please provide a valid ${column.name}.`,
            }
          case FieldType.OPTIONS:
          case FieldType.ARRAY:
            return {
              name: column.name,
              type: FormFieldType.Select,
              // helpText: column.description,
              options: column.constraints.inclusion,
              errorText: `Please provide a valid ${column.name}.`,
            }
          case FieldType.ATTACHMENTS:
            return {
              name: column.name,
              type: FormFieldType.Input,
              // helpText: column.description,
              errorText: `Please provide a valid ${column.name}.`,
            }
          default:
            throw utils.unreachable(column.type)
        }
      }

      const component: RequiredKeys<FormPayload> = {
        type: "Form",
        componentId,
        props: {
          title: table.name,
          message: message ?? undefined,
          fields: selectedColumns.map(([_, fieldSchema]) =>
            mapField(fieldSchema)
          ),
        },
      }

      return JSON.stringify({ type: "component", component })
    },
  }),
]
