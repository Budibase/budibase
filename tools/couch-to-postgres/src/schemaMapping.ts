import type { FieldSchema } from "./types.js"

export interface ColumnMapping {
  column: string
  pgType: string
  migratable: true
}

export interface SkippedColumn {
  column: string
  fieldType: string
  migratable: false
  reason: string
}

export type MappedColumn = ColumnMapping | SkippedColumn

const AUTO_SUBTYPE_PG_TYPE: Record<string, string> = {
  createdAt: "timestamptz",
  updatedAt: "timestamptz",
  autoID: "bigint",
  createdBy: "jsonb",
  updatedBy: "jsonb",
}

const DIRECT_PG_TYPE: Record<string, string> = {
  string: "text",
  longform: "text",
  options: "text",
  number: "numeric",
  boolean: "boolean",
  array: "jsonb",
  datetime: "timestamptz",
  json: "jsonb",
  barcodeqr: "text",
  bigint: "bigint",
  bb_reference_single: "text",
  bb_reference: "jsonb",
}

const UNSUPPORTED_REASON: Record<string, string> = {
  attachment: "attachments are stored in object storage, not as row data",
  attachment_single:
    "attachments are stored in object storage, not as row data",
  signature_single:
    "signatures are stored in object storage, not as row data",
  formula: "formula columns are computed at read time, not stored",
  ai: "AI columns are computed at read time, not stored",
  link: "relationships require the related table to be migrated first",
  internal: "internal-only bookkeeping field",
}

export function mapColumn(field: FieldSchema): MappedColumn {
  if (field.type === "auto") {
    const pgType = field.subtype ? AUTO_SUBTYPE_PG_TYPE[field.subtype] : undefined
    if (!pgType) {
      return {
        column: field.name,
        fieldType: field.type,
        migratable: false,
        reason: `unrecognised auto-column subtype "${field.subtype}"`,
      }
    }
    return { column: field.name, pgType, migratable: true }
  }

  const direct = DIRECT_PG_TYPE[field.type]
  if (direct) {
    return { column: field.name, pgType: direct, migratable: true }
  }

  const reason = UNSUPPORTED_REASON[field.type] ?? `unsupported field type "${field.type}"`
  return {
    column: field.name,
    fieldType: field.type,
    migratable: false,
    reason,
  }
}

export function mapSchema(
  schema: Record<string, FieldSchema>
): { migratable: ColumnMapping[]; skipped: SkippedColumn[] } {
  const migratable: ColumnMapping[] = []
  const skipped: SkippedColumn[] = []
  for (const field of Object.values(schema)) {
    const mapped = mapColumn(field)
    if (mapped.migratable) {
      migratable.push(mapped)
    } else {
      skipped.push(mapped)
    }
  }
  return { migratable, skipped }
}
