import { z } from "zod"
import {
  FieldType,
  FormFieldType,
  FormPayload,
  RequiredKeys,
  type FieldSchema,
  type FormFieldPayload,
} from "@budibase/types"
import { newTool } from ".."
import sdk from "../../../sdk"
import { utils } from "@budibase/shared-core"

export default [
  newTool({
    name: "render_table_form",
    description: `Render an interactive form component for a Budibase table so the user can create or edit records directly in the UI. Call this tool when the user needs a form-driven workflow instead of plain-text instructions.
When you include the tool result in your reply, write natural-language guidance, then place {{toolResult:component:<toolCallId>}} exactly where the form should appear (no code fences, no field lists). The client will replace that token with the actual component.`,
    parameters: z.object({
      tableId: z
        .string()
        .describe("Table ID of the table to render the form for."),
      submitButtonText: z
        .string()
        .describe("Text to display on the form submit button."),
      columns: z
        .array(z.string())
        .describe(
          "List of column to include in the form. It should from come from the table schema."
        ),
    }),
    handler: async ({
      tableId,
      submitButtonText,
      columns,

      toolCallId,
    }) => {
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
            return {
              name: column.name,
              type: FormFieldType.Input,
              // helpText: column.description,
              errorText: `Please provide a valid ${column.name}.`,
            }
          case FieldType.DATETIME:
            return {
              name: column.name,
              type: FormFieldType.Date,
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
            // @ts-expect-error TODO implement all field types
            throw utils.unreachable(column.type)
        }
      }

      const component: RequiredKeys<FormPayload> = {
        type: "Form",
        componentId: toolCallId,
        props: {
          title: table.name,
          submitButtonText,
          tableId,
          fields: selectedColumns.map(([_, fieldSchema]) =>
            mapField(fieldSchema)
          ),
        },
      }

      return JSON.stringify({
        instructions:
          `When replying to the user:\n` +
          `1. Acknowledge the form you are providing in natural language.\n` +
          `2. Do not describe or list individual fields, inputs, or defaults—the UI component already shows them.\n` +
          `3. Insert the placeholder {{toolResult:component:${toolCallId}}} exactly where the form should render. Do not wrap it in backticks or code fences.\n` +
          `4. Continue your response if additional guidance is needed.\n`,
        type: "component",
        component,
      })
    },
  }),
  newTool({
    name: "submit_form_data",
    description:
      "Persist data submitted from a render_table_form component. Use this after the user submits a FORM_SUBMISSION payload.",
    parameters: z.object({
      tableId: z
        .string()
        .describe("Table ID that the form submission should write to."),
      values: z
        .any()
        .describe(
          "Submitted form values. Accepts a JSON object or JSON string."
        ),
      componentId: z
        .string()
        .describe(
          "Component identifier associated with the form submission. Use the componentId from the FORM_SUBMISSION payload."
        ),
    }),
    handler: async ({ tableId, values, componentId }) => {
      let parsedValues: Record<string, unknown>
      if (typeof values === "string") {
        try {
          parsedValues = JSON.parse(values)
        } catch (error) {
          return `Error: Invalid JSON provided for values: ${String(error)}`
        }
      } else {
        parsedValues = values
      }

      const table = await sdk.tables.getTable(tableId)
      const schemaEntries = Object.entries(table.schema ?? {})
      const allowedColumns = new Set(
        schemaEntries.map(([columnName]) => columnName)
      )
      const displayNameToId = new Map<string, string>()
      for (const [columnId, schema] of schemaEntries) {
        if (schema.name) {
          displayNameToId.set(schema.name, columnId)
        }
      }

      const sanitized = Object.entries(parsedValues).reduce(
        (acc, [key, value]) => {
          if (key === "_id" || key === "id") {
            acc._id = value
            return acc
          }
          let targetKey = key
          if (!allowedColumns.has(targetKey)) {
            const mappedKey = displayNameToId.get(key)
            if (mappedKey) {
              targetKey = mappedKey
            }
          }
          if (allowedColumns.has(targetKey)) {
            acc[targetKey] = value
          }
          return acc
        },
        {} as Record<string, unknown>
      )

      if (!Object.keys(sanitized).length) {
        return `Error: No valid columns supplied for table "${table.name}".`
      }

      const row = await sdk.rows.save(tableId, sanitized, undefined)
      return JSON.stringify({
        componentId,
        message: `Form submission processed successfully for component ${componentId}.`,
        row,
      })

      // TODO: handle errors
      // TODO: find a way to alter the chat messages, to remove the tools and calls related to this component. This will tidy the llm message and it will remove the component from the frontend.
    },
  }),
]
