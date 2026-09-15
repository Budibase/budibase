import {
  FieldType,
  type FieldSchema,
  type Row,
  type Table,
} from "@budibase/types"

export interface SchemaValueResolvers {
  getLinkedRow: (tableId: string, rowId: string) => Promise<Row>
  getTable: (tableId: string) => Promise<Table>
  getUser: (userId: string) => Promise<Record<string, unknown>>
}

const identifier = (value: unknown): string => {
  if (value === null) {
    return "null"
  }
  if (value === undefined) {
    return "[UNDEFINED]"
  }
  if (typeof value !== "object") {
    return String(value)
  }
  if (Array.isArray(value)) {
    return value.map(identifier).join(", ")
  }
  const record = value as Record<string, unknown>
  const concise =
    record.primaryDisplay ??
    record.email ??
    record.name ??
    record.filename ??
    record._id ??
    record.id
  return concise === undefined ? "[OBJECT]" : String(concise)
}

const items = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [value]

const resolveLink = async ({
  value,
  field,
  resolvers,
}: {
  value: unknown
  field: FieldSchema
  resolvers: SchemaValueResolvers
}): Promise<string> => {
  if (field.type !== FieldType.LINK || !field.tableId) {
    return identifier(value)
  }
  let linkedTable: Table | undefined
  const displays = await Promise.all(
    items(value).map(async item => {
      if (item && typeof item === "object") {
        return identifier(item)
      }
      const rowId = String(item)
      try {
        linkedTable ??= await resolvers.getTable(field.tableId)
        const row = await resolvers.getLinkedRow(field.tableId, rowId)
        const displayField = linkedTable.primaryDisplay
        return displayField ? identifier(row[displayField]) : identifier(row)
      } catch (_error) {
        return rowId
      }
    })
  )
  return displays.join(", ")
}

const resolveUsers = async ({
  value,
  resolvers,
}: {
  value: unknown
  resolvers: SchemaValueResolvers
}): Promise<string> => {
  const displays = await Promise.all(
    items(value).map(async item => {
      if (item && typeof item === "object") {
        return identifier(item)
      }
      const userId = String(item)
      try {
        return identifier(await resolvers.getUser(userId))
      } catch (_error) {
        return userId
      }
    })
  )
  return displays.join(", ")
}

const attachmentNames = (value: unknown): string =>
  items(value)
    .map(item => {
      if (!item || typeof item !== "object") {
        return identifier(item)
      }
      const attachment = item as Record<string, unknown>
      return identifier(attachment.name ?? attachment.filename ?? attachment.key)
    })
    .join(", ")

const compactJson = (value: unknown): string => {
  try {
    return JSON.stringify(value)
  } catch (_error) {
    return identifier(value)
  }
}

export const resolveSchemaReviewValues = async ({
  input,
  paths,
  table,
  resolvers,
}: {
  input: unknown
  paths?: string[]
  table: Table
  resolvers: SchemaValueResolvers
}): Promise<Record<string, string>> => {
  if (!input || typeof input !== "object") {
    return {}
  }
  const data = (input as Record<string, unknown>).data
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {}
  }

  const resolved: Record<string, string> = {}
  await Promise.all(
    (paths ?? []).map(async path => {
      const match = path.match(/^\/data\/([^/]+)$/)
      if (!match) {
        return
      }
      const fieldName = match[1].replace(/~1/g, "/").replace(/~0/g, "~")
      const field = table.schema[fieldName]
      if (!field) {
        return
      }
      const value = (data as Record<string, unknown>)[fieldName]
      switch (field.type) {
        case FieldType.LINK:
          resolved[path] = await resolveLink({ value, field, resolvers })
          break
        case FieldType.BB_REFERENCE:
        case FieldType.BB_REFERENCE_SINGLE:
          resolved[path] = await resolveUsers({ value, resolvers })
          break
        case FieldType.ATTACHMENTS:
        case FieldType.ATTACHMENT_SINGLE:
          resolved[path] = attachmentNames(value)
          break
        case FieldType.JSON:
          resolved[path] = compactJson(value)
          break
        case FieldType.ARRAY:
        case FieldType.OPTIONS:
          resolved[path] = items(value).map(identifier).join(", ")
          break
        default:
          resolved[path] = identifier(value)
      }
    })
  )
  return resolved
}
