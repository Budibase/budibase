import { z } from "zod"
import { utils } from "@budibase/shared-core"
import { AttachmentSubType, FieldType, RelationshipType } from "@budibase/types"
import { TableSchemaFromAI } from "../types"

export function tableDataStructuredOutput(tables: TableSchemaFromAI[]) {
  let structure = z.object({})

  for (const table of tables) {
    const tableStructure: Record<string, z.ZodTypeAny> = {
      _id: z.string().describe("Unique ID for the row"),
    }
    const imageType = z.union([
      z
        .literal("https://picsum.photos/600/600")
        .describe("For profile pictures and similar"),
      z
        .literal("https://picsum.photos/1920/1080")
        .describe("For anything else"),
    ])

    const attachmentType = z.object({
      fileName: z.string(),
      extension: z.enum([".pdf", ".txt"]),
      content: z.string().describe("Random content for the file"),
    })
    // .describe("If the data is not an image")
    for (const field of Object.values(table.schema)) {
      const { type } = field
      switch (type) {
        case FieldType.STRING:
        case FieldType.LONGFORM:
          tableStructure[field.name] = z.string()
          break
        case FieldType.NUMBER:
        case FieldType.BIGINT:
          tableStructure[field.name] = z.number()
          break
        case FieldType.BOOLEAN:
          tableStructure[field.name] = z.boolean()
          break
        case FieldType.DATETIME:
          tableStructure[field.name] = z
            .string()
            .describe(
              `ISO datetime. Use realistic dates, based on today's date, ${new Date().toISOString()}`
            )
          break
        case FieldType.ATTACHMENT_SINGLE:
          if (field.subtype === AttachmentSubType.IMAGE) {
            tableStructure[field.name] = imageType
          } else {
            tableStructure[field.name] = attachmentType
          }
          break
        case FieldType.ATTACHMENTS:
          if (field.subtype === AttachmentSubType.IMAGE) {
            tableStructure[field.name] = z.array(imageType)
          } else {
            tableStructure[field.name] = z.array(attachmentType)
          }
          tableStructure[field.name] = tableStructure[field.name].describe(
            "Between 2 and 5 items."
          )
          break
        case FieldType.OPTIONS:
          tableStructure[field.name] = z.enum(
            field.constraints.inclusion as any
          )
          break

        case FieldType.LINK:
          {
            const link = z
              .string()
              .describe(
                `Match one of the _ids created for table "${field.tableId}"`
              )
            if (field.relationshipType === RelationshipType.ONE_TO_MANY) {
              tableStructure[field.name] = z
                .array(link)
                .describe("Array with a single item")
            } else if (
              field.relationshipType === RelationshipType.MANY_TO_MANY
            ) {
              tableStructure[field.name] = z
                .array(link)
                .describe(
                  "Array with a one or many items. You can repeat the same ids between rows"
                )
            }
          }
          break
        case FieldType.ARRAY:
          tableStructure[field.name] = z.array(
            z.enum(field.constraints.inclusion as any)
          )
          break

        case FieldType.AI:
        case FieldType.AUTO:
        case FieldType.SIGNATURE_SINGLE:
        case FieldType.BB_REFERENCE:
        case FieldType.JSON:
        case FieldType.FORMULA:
        case FieldType.INTERNAL:
        case FieldType.BARCODEQR:
        case FieldType.BB_REFERENCE_SINGLE:
          // Do nothing
          break
        default:
          throw utils.unreachable(type)
      }
    }

    structure = structure
      .extend({
        [table.name]: z.array(z.object(tableStructure)),
      })
      .describe(
        `Each table should include at least a few items (min 3, max 18). The number of items should not be evenly distributed. Instead, follow natural relationships and usage patterns based on the tables nature. For example:
                1. If we have posts and comments, there should be more posts than users, and more comments than posts.
                2. If it's a ticketing system, there may be more tickets than users, and some users may have submitted several tickets.
                3. In a CRM, there are fewer users than customers, and customers may have many deals.
                4. In a project management tool, projects might have many tasks, and tasks might have multiple comments.`
      )
  }

  return structure
}
