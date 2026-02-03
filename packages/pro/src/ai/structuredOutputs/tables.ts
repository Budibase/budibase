import {
  AIFieldMetadata,
  AIOperationEnum,
  AttachmentSubType,
  FieldType,
  JsonFieldSubType,
  RelationshipType,
} from "@budibase/types"
import { z } from "zod"
import { TableSchemaFromAI } from "../types"

const baseFieldSchema = z.object({
  name: z
    .string()
    .describe(
      "A human readable name for the field. It MUST be alpha-numeric and capitalised."
    ),
})

const baseRelationshipSchema = baseFieldSchema.extend({
  type: z.literal(FieldType.LINK),
  tableId: z
    .string()
    .describe("This must match one of the generated table names"),
  reverseFieldName: z
    .string()
    .describe(
      "Only the *name* of the field that will appear in the foreign table. Budibase creates this automatically. Do not define the column yourself."
    ),
  relationshipId: z
    .string()
    .describe(
      "The ID of the relationship. It must be used in pairs, paring many-to-ones and one-to-manys, or many-to-manys with each other."
    ),
})

const schema = z.array(
  z.union([
    baseFieldSchema.extend({
      type: z.enum([
        FieldType.STRING,
        FieldType.NUMBER,
        FieldType.BOOLEAN,
        FieldType.LONGFORM,
      ]),
      constraints: z
        .object({
          presence: z.boolean(),
        })
        .optional()
        .nullable(),
    }),
    baseRelationshipSchema
      .extend({
        relationshipType: z.enum([RelationshipType.MANY_TO_ONE]),
      })
      .describe(
        "Many-to-one relationship, where the current table is the 'many' side. Defines the initiating side of the relationship. Only this side should be defined. The reverse column will be created automatically."
      ),
    baseRelationshipSchema
      .extend({
        relationshipType: z.enum([RelationshipType.ONE_TO_MANY]),
      })
      .describe(
        "One-to-many relationship, where the current table is the 'one' side. Defines the initiating side of the relationship. Only this side should be defined. The reverse column will be created automatically."
      ),
    baseRelationshipSchema
      .extend({
        relationshipType: z.enum([RelationshipType.MANY_TO_MANY]),
      })
      .describe(
        "Many to many relationship. Defines the initiating side of the relationship. Only this side should be defined. The reverse column will be created automatically."
      ),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.OPTIONS),
        constraints: z.object({
          inclusion: z.array(z.string()).describe("The options for the field"),
          presence: z.boolean(),
        }),
      })
      .describe("A single option from closed set of options"),
    baseFieldSchema.extend({
      type: z.literal(FieldType.ARRAY),
      constraints: z
        .object({
          inclusion: z.array(z.string()).describe("The options for the field"),
          presence: z.boolean(),
          type: z.literal(JsonFieldSubType.ARRAY),
        })
        .describe("Multiple selected options from closed set of options"),
    }),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.FORMULA),
        formula: z.string().describe(
          `
A JavaScript expression using only previously defined fields.
Reference fields using $("Field name"). Must end with: return ...
Example: return $("Score") + $("Weight")
`
        ),
        responseType: z.enum([
          FieldType.STRING,
          FieldType.NUMBER,
          FieldType.BOOLEAN,
          FieldType.DATETIME,
        ]),
      })
      .describe("Define these types after the other types"),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.DATETIME),
        ignoreTimezones: z.boolean(),
      })
      .describe("A datetime field, storing date and time"),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.DATETIME),
        ignoreTimezones: z.boolean(),
        timeOnly: z.literal(true),
      })
      .describe("A time only field"),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.DATETIME),
        ignoreTimezones: z.boolean(),
        dateOnly: z.literal(true),
      })
      .describe("A date only field"),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.ATTACHMENT_SINGLE),
        subtype: z.literal(AttachmentSubType.IMAGE),
      })
      .describe("Single image column"),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.ATTACHMENT_SINGLE),
      })
      .describe(
        "Single attachment column. It stores a single document: pdf, word, etc. Use an appropriate name for the column, like 'Invoice', 'Document', etc."
      ),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.ATTACHMENTS),
        subtype: z.literal(AttachmentSubType.IMAGE),
      })
      .describe(
        "Multiple images column. Use an appropiate name for the columns, like 'Gallery', 'Photos', etc."
      ),
    baseFieldSchema
      .extend({
        type: z.literal(FieldType.ATTACHMENTS),
      })
      .describe(
        "Multiple attachments column. It might hold different kind of documents mixed up: pdf, txt, etc. Use an appropiate name for the columns, like 'Invoices', 'Documents', 'Attachments', etc."
      ),
  ])
)

export const generationStructure = z.object({
  tables: z.array(
    z.object({
      name: z.string(),
      schema,
      primaryDisplay: z
        .string()
        .describe(
          "The column will be used as display, so pick the clearer option. This must match EXACTLY one of the created fields names in the schema."
        ),
    })
  ),
})

export type GenerationStructure = z.infer<typeof generationStructure>

export function aiColumnSchemas(tables: TableSchemaFromAI[]) {
  let response = z.object({})
  for (const table of tables) {
    const tableSchema = Object.values(table.schema)
    const possibleAIConfigs: [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]] = [
      baseFieldSchema
        .extend({
          type: z.literal(FieldType.AI),
          operation: z.literal(AIOperationEnum.TRANSLATE),
          column: z
            .enum(
              tableSchema
                .filter(f =>
                  [FieldType.STRING, FieldType.LONGFORM].includes(f.type)
                )
                .map(f => f.name) as [string, ...string[]]
            )
            .describe("The columns to translate"),
          language: z.string(),
        })
        .describe(
          "This column will be autogenerated via AI to translate one column. Use it for reasonable cases, like translating descriptions or similar."
        ),
      baseFieldSchema
        .extend({
          type: z.literal(FieldType.AI),
          operation: z.literal(AIOperationEnum.CATEGORISE_TEXT),
          columns: z
            .array(
              z.enum(
                tableSchema
                  .filter(f =>
                    [
                      FieldType.STRING,
                      FieldType.LONGFORM,
                      FieldType.BOOLEAN,
                      FieldType.NUMBER,
                      FieldType.DATETIME,
                    ].includes(f.type)
                  )
                  .map(f => f.name) as [string, ...string[]]
              )
            )
            .describe("The columns to be used as context"),
          categories: z.string().describe("CSV list of categories"),
        })
        .describe(
          "This column will be autogenerated via AI to categorise a row based on one or many columns."
        ),
    ]
    if (tableSchema.some(f => f.type === FieldType.LONGFORM)) {
      possibleAIConfigs.push(
        baseFieldSchema
          .extend({
            type: z.literal(FieldType.AI),
            operation: z.literal(AIOperationEnum.SUMMARISE_TEXT),
            columns: z
              .array(
                z.enum(
                  tableSchema
                    .filter(f =>
                      [FieldType.STRING, FieldType.LONGFORM].includes(f.type)
                    )
                    .map(f => f.name) as [string, ...string[]]
                )
              )
              .describe(
                `Columns, from the current table, to be passed in the context. Use at least one.`
              ),
          })
          .describe(
            "This column will be autogenerated via AI to summarise one or many columns."
          )
      )
    }

    response = response.extend({
      [table.name]: z.array(z.union(possibleAIConfigs)),
    })
  }
  return response
}
export type AIColumnSchemas = Record<string, AIFieldMetadata[]>
