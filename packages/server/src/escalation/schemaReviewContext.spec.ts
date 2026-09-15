import {
  BBReferenceFieldSubType,
  FieldType,
  RelationshipType,
  type Row,
  type Table,
} from "@budibase/types"
import { basicTable } from "../tests/utilities/structures"
import {
  resolveSchemaReviewValues,
  type SchemaValueResolvers,
} from "./schemaReviewContext"

describe("schema-aware escalation review values", () => {
  const linkedTable = basicTable(undefined, {
    _id: "ta_contacts",
    primaryDisplay: "name",
  })
  const table = basicTable(undefined, {
    schema: {
      contact: {
        name: "contact",
        type: FieldType.LINK,
        tableId: "ta_contacts",
        fieldName: "company",
        relationshipType: RelationshipType.MANY_TO_MANY,
      },
      owner: {
        name: "owner",
        type: FieldType.BB_REFERENCE,
        subtype: BBReferenceFieldSubType.USER,
      },
      files: {
        name: "files",
        type: FieldType.ATTACHMENTS,
      },
    },
  })
  const resolvers: SchemaValueResolvers = {
    getTable: jest.fn(async (): Promise<Table> => linkedTable),
    getLinkedRow: jest.fn(
      async (): Promise<Row> => ({ _id: "ro_1", name: "Ada Lovelace" })
    ),
    getUser: jest.fn(async () => ({ email: "owner@example.com" })),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("resolves a bare linked row ID to the linked primary display", async () => {
    const result = await resolveSchemaReviewValues({
      input: { data: { contact: ["ro_1"] } },
      paths: ["/data/contact"],
      table,
      resolvers,
    })

    expect(result).toEqual({ "/data/contact": "Ada Lovelace" })
  })

  it("uses enriched display values without exposing object internals", async () => {
    const result = await resolveSchemaReviewValues({
      input: {
        data: {
          contact: [
            { _id: "ro_1", primaryDisplay: "Ada", secret: "do-not-share" },
          ],
          owner: {
            _id: "us_1",
            email: "owner@example.com",
            roles: { admin: true },
          },
        },
      },
      paths: ["/data/contact", "/data/owner"],
      table,
      resolvers,
    })

    expect(result).toEqual({
      "/data/contact": "Ada",
      "/data/owner": "owner@example.com",
    })
    expect(JSON.stringify(result)).not.toContain("do-not-share")
    expect(JSON.stringify(result)).not.toContain("admin")
  })

  it("renders attachment filenames only", async () => {
    const result = await resolveSchemaReviewValues({
      input: {
        data: {
          files: [
            { name: "invoice.pdf", key: "private/storage/key", size: 42 },
          ],
        },
      },
      paths: ["/data/files"],
      table,
      resolvers,
    })

    expect(result).toEqual({ "/data/files": "invoice.pdf" })
  })

  it("falls back to concise IDs when display resolution fails", async () => {
    const failingResolvers: SchemaValueResolvers = {
      ...resolvers,
      getLinkedRow: jest.fn(async () => {
        throw new Error("not found")
      }),
    }
    const result = await resolveSchemaReviewValues({
      input: { data: { contact: ["ro_missing"] } },
      paths: ["/data/contact"],
      table,
      resolvers: failingResolvers,
    })

    expect(result).toEqual({ "/data/contact": "ro_missing" })
  })
})
