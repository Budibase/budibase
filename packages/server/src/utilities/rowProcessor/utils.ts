import { AutoFieldDefaultNames } from "../../constants"
import { processStringSync } from "@budibase/string-templates"
import {
  AutoColumnFieldMetadata,
  FieldSchema,
  Row,
  Table,
  FormulaType,
  AutoFieldSubType,
  FieldType,
  OperationFieldTypeEnum,
  AIOperationEnum,
  AIFieldMetadata,
} from "@budibase/types"
import { OperationFields } from "@budibase/shared-core"
import tracer from "dd-trace"
import { context } from "@budibase/backend-core"
import * as pro from "@budibase/pro"
import { coerce } from "./index"

interface FormulaOpts {
  dynamic?: boolean
  contextRows?: Row[]
}

/**
 * If the subtype has been lost for any reason this works out what
 * subtype the auto column should be.
 */
export function fixAutoColumnSubType(
  column: FieldSchema
): AutoColumnFieldMetadata | FieldSchema {
  if (!column.autocolumn || !column.name || column.subtype) {
    return column
  }
  // the columns which get auto generated
  if (column.name.endsWith(AutoFieldDefaultNames.CREATED_BY)) {
    column.subtype = AutoFieldSubType.CREATED_BY
  } else if (column.name.endsWith(AutoFieldDefaultNames.UPDATED_BY)) {
    column.subtype = AutoFieldSubType.UPDATED_BY
  } else if (column.name.endsWith(AutoFieldDefaultNames.CREATED_AT)) {
    column.subtype = AutoFieldSubType.CREATED_AT
  } else if (column.name.endsWith(AutoFieldDefaultNames.UPDATED_AT)) {
    column.subtype = AutoFieldSubType.UPDATED_AT
  } else if (column.name.endsWith(AutoFieldDefaultNames.AUTO_ID)) {
    column.subtype = AutoFieldSubType.AUTO_ID
  }
  return column
}

/**
 * Looks through the rows provided and finds formulas - which it then processes.
 */
export async function processFormulas<T extends Row | Row[]>(
  table: Table,
  inputRows: T,
  { dynamic, contextRows }: FormulaOpts = { dynamic: true }
): Promise<T> {
  return tracer.trace("processFormulas", {}, async span => {
    const numRows = Array.isArray(inputRows) ? inputRows.length : 1
    span?.addTags({ table_id: table._id, dynamic, numRows })
    const rows = Array.isArray(inputRows) ? inputRows : [inputRows]
    if (rows) {
      // Ensure we have snippet context
      await context.ensureSnippetContext()

      for (let [column, schema] of Object.entries(table.schema)) {
        if (schema.type !== FieldType.FORMULA) {
          continue
        }

        const responseType = schema.responseType
        const isStatic = schema.formulaType === FormulaType.STATIC
        const formula = schema.formula

        // coerce static values
        if (isStatic) {
          rows.forEach(row => {
            if (row[column] && responseType) {
              row[column] = coerce(row[column], responseType)
            }
          })
        }

        if (
          schema.formula == null ||
          (dynamic && isStatic) ||
          (!dynamic && !isStatic)
        ) {
          continue
        }
        // iterate through rows and process formula
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          let context = contextRows ? contextRows[i] : row
          rows[i] = {
            ...row,
            [column]: tracer.trace("processStringSync", {}, span => {
              span?.addTags({ table_id: table._id, column, static: isStatic })
              const result = processStringSync(formula, context)
              try {
                return responseType ? coerce(result, responseType) : result
              } catch (err: any) {
                // if the coercion fails, we return empty row contents
                span?.addTags({ coercionError: err.message })
                return undefined
              }
            }),
          }
        }
      }
    }
    return Array.isArray(inputRows) ? rows : rows[0]
  })
}

/**
 * Looks through the rows provided and finds AI columns - which it then processes.
 */
export async function processAIColumns<T extends Row | Row[]>(
  table: Table,
  inputRows: T,
  { contextRows }: FormulaOpts
): Promise<T> {
  return tracer.trace("processAIColumns", {}, async span => {
    const numRows = Array.isArray(inputRows) ? inputRows.length : 1
    span?.addTags({ table_id: table._id, numRows })
    const rows = Array.isArray(inputRows) ? inputRows : [inputRows]
    const llmWrapper = await pro.ai.LargeLanguageModel.forCurrentTenant(
      "gpt-4o-mini"
    )
    if (rows && llmWrapper.llm) {
      // Ensure we have snippet context
      await context.ensureSnippetContext()

      for (let [column, schema] of Object.entries(table.schema)) {
        if (schema.type !== FieldType.AI) {
          continue
        }

        const operation = schema.operation
        const aiSchema: AIFieldMetadata = schema
        const rowUpdates = rows.map((row, i) => {
          const contextRow = contextRows ? contextRows[i] : row

          // Check if the type is bindable and pass through HBS if so
          const operationField = OperationFields[operation as AIOperationEnum]
          for (const key in schema) {
            const fieldType = operationField[key as keyof typeof operationField]
            if (fieldType === OperationFieldTypeEnum.BINDABLE_TEXT) {
              // @ts-ignore
              schema[key] = processStringSync(schema[key], contextRow)
            }
          }

          const prompt = llmWrapper.buildPromptFromAIOperation({
            schema: aiSchema,
            row,
          })

          return tracer.trace("processAIColumn", {}, async span => {
            span?.addTags({ table_id: table._id, column })
            const llmResponse = await llmWrapper.run(prompt)
            return {
              ...row,
              [column]: llmResponse,
            }
          })
        })

        const processedRows = await Promise.all(rowUpdates)

        // Promise.all is deterministic so can rely on the indexing here
        processedRows.forEach(
          (processedRow, index) => (rows[index] = processedRow)
        )
      }
    }
    return Array.isArray(inputRows) ? rows : rows[0]
  })
}

/**
 * Processes any date columns and ensures that those without the ignoreTimezones
 * flag set are parsed as UTC rather than local time.
 */
export function processDates<T extends Row | Row[]>(
  table: Table,
  inputRows: T
): T {
  let rows = Array.isArray(inputRows) ? inputRows : [inputRows]
  let datesWithTZ: string[] = []
  for (let [column, schema] of Object.entries(table.schema)) {
    if (schema.type !== FieldType.DATETIME) {
      continue
    }
    if (schema.dateOnly) {
      continue
    }
    if (!schema.timeOnly && !schema.ignoreTimezones) {
      datesWithTZ.push(column)
    }
  }

  for (let row of rows) {
    for (let col of datesWithTZ) {
      if (row[col] && typeof row[col] === "string" && !row[col].endsWith("Z")) {
        row[col] = new Date(row[col]).toISOString()
      }
    }
  }

  return Array.isArray(inputRows) ? rows : rows[0]
}
