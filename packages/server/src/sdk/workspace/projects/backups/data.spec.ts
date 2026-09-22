import { db } from "@budibase/backend-core"
import {
  AutoFieldSubType,
  BBReferenceFieldSubType,
  FieldType,
  InternalTable,
  type ProjectPackageData,
  RelationshipType,
} from "@budibase/types"
import LinkDocumentImpl from "../../../../db/linkedRows/LinkDocument"
import { basicTable } from "../../../../tests/utilities/structures"
import { prepareProjectData, validateProjectData } from "./data"

const sourceWorkspaceId = "app_dev_source"
const sourceKey = "app_source/attachments/example.png"
const sourceRowId = "ro_ta_source_first"
const relatedRowId = "ro_ta_related_second"

const fixture = () => {
  const sourceTable = basicTable(undefined, {
    _id: "ta_source",
    schema: {
      assignee: {
        name: "assignee",
        type: FieldType.BB_REFERENCE_SINGLE,
        subtype: BBReferenceFieldSubType.USER,
      },
      createdBy: {
        name: "createdBy",
        type: FieldType.AUTO,
        autocolumn: true,
        subtype: AutoFieldSubType.CREATED_BY,
      },
      files: { name: "files", type: FieldType.ATTACHMENTS },
      image: { name: "image", type: FieldType.ATTACHMENT_SINGLE },
      signature: { name: "signature", type: FieldType.SIGNATURE_SINGLE },
      related: {
        name: "related",
        type: FieldType.LINK,
        tableId: "ta_related",
        fieldName: "source",
        relationshipType: RelationshipType.MANY_TO_MANY,
      },
    },
  })
  const relatedTable = basicTable(undefined, {
    _id: "ta_related",
    schema: {
      source: {
        name: "source",
        type: FieldType.LINK,
        tableId: "ta_source",
        fieldName: "related",
        relationshipType: RelationshipType.MANY_TO_MANY,
      },
    },
  })
  const attachment = {
    key: sourceKey,
    name: "example.png",
    extension: "png",
    size: 10,
    url: "https://example.com/expired",
  }
  const data: ProjectPackageData = {
    rows: [
      {
        _id: sourceRowId,
        _rev: "1-source",
        tableId: "ta_source",
        name: "ta_source",
        description: `{{ ${sourceRowId}.name }}`,
        metadata: { table: "ta_source" },
        assignee: "us_author",
        createdBy: ["us_author", "us_other"],
        autoId: 42,
        createdAt: "2026-01-01T00:00:00.000Z",
        files: [attachment],
        image: attachment,
        signature: attachment,
      },
      { _id: relatedRowId, tableId: "ta_related", name: "Related" },
    ],
    relationships: [
      {
        doc1: {
          tableId: "ta_source",
          rowId: sourceRowId,
          fieldName: "related",
        },
        doc2: {
          tableId: "ta_related",
          rowId: relatedRowId,
          fieldName: "source",
        },
      },
    ],
    attachments: [
      { key: sourceKey, path: "attachments/example", contentType: "image/png" },
    ],
  }
  return { tables: [sourceTable, relatedTable], data }
}

const validate = ({ data, tables }: ReturnType<typeof fixture>) =>
  validateProjectData({
    data,
    tables,
    sourceWorkspaceId,
    attachmentPaths: ["attachments/example"],
  })

describe("Project package data", () => {
  it("remaps structural references while preserving starter values", () => {
    const { data, tables } = fixture()
    const result = prepareProjectData({
      data: validate({ data, tables }),
      tables,
      idMap: new Map([
        ["ta_source", "ta_destination"],
        ["ta_related", "ta_other"],
      ]),
      workspaceId: "app_dev_destination",
      userId: db.generateUserMetadataID("us_importer"),
    })
    const row = result.rows[0]
    const key = result.attachments[0].key
    expect(row).toEqual({
      ...data.rows[0],
      _id: expect.stringMatching(/^ro_ta_destination_/),
      _rev: undefined,
      tableId: "ta_destination",
      assignee: "us_importer",
      createdBy: ["us_importer"],
      files: [{ key, name: "example.png", extension: "png", size: 10 }],
      image: { key, name: "example.png", extension: "png", size: 10 },
      signature: { key, name: "example.png", extension: "png", size: 10 },
    })
    expect(result.relationships).toEqual([
      new LinkDocumentImpl(
        "ta_destination",
        "related",
        row._id!,
        "ta_other",
        "source",
        result.rows[1]._id!
      ),
    ])
    expect(result.summary).toEqual({
      tables: 2,
      rows: 2,
      relationships: 1,
      attachments: 1,
    })
  })

  it("rejects user references without an importing user", () => {
    const { data, tables } = fixture()

    expect(() =>
      prepareProjectData({
        data: validate({ data, tables }),
        tables,
        idMap: new Map([
          ["ta_source", "ta_destination"],
          ["ta_related", "ta_other"],
        ]),
        workspaceId: "app_dev_destination",
      })
    ).toThrow("requires an importing user for its user references")
  })

  it("rejects rows without a destination table mapping", () => {
    const { data, tables } = fixture()

    expect(() =>
      prepareProjectData({
        data: validate({ data, tables }),
        tables,
        idMap: new Map(),
        workspaceId: "app_dev_destination",
        userId: "us_importer",
      })
    ).toThrow("could not map an imported table")
  })

  it("allocates independent rows and attachments on repeated imports into the source workspace", () => {
    const { data, tables } = fixture()
    const prepare = () =>
      prepareProjectData({
        data: validate({ data, tables }),
        tables,
        idMap: new Map([
          ["ta_source", "ta_destination"],
          ["ta_related", "ta_other"],
        ]),
        workspaceId: sourceWorkspaceId,
        userId: "us_importer",
      })
    const first = prepare()
    const second = prepare()
    expect(first.rows[0]._id).not.toEqual(second.rows[0]._id)
    expect(first.relationships[0]._id).not.toEqual(second.relationships[0]._id)
    expect(first.attachments[0].key).not.toEqual(second.attachments[0].key)
    expect(first.attachments[0].key).not.toEqual(sourceKey)
  })

  it.each(["duplicate", "external", "users"])("rejects %s rows", kind => {
    const test = fixture()
    if (kind === "duplicate") {
      test.data.rows.push(test.data.rows[0])
    } else if (kind === "external") {
      test.tables[0].sourceId = "ds_external"
    } else {
      test.tables[0]._id = InternalTable.USER_METADATA
      test.data.rows[0].tableId = InternalTable.USER_METADATA
      test.data.rows[0]._id = db.generateUserMetadataID("us_author")
    }
    expect(() => validate(test)).toThrow("invalid or duplicate row")
  })

  it("rejects relationships whose endpoint is not in the package", () => {
    const test = fixture()
    test.data.relationships[0].doc2.rowId = "ro_ta_related_missing"
    expect(() => validate(test)).toThrow("outside its rows or table schema")
  })

  it("rejects a repeated relationship with its endpoints reversed", () => {
    const test = fixture()
    const { doc1, doc2 } = test.data.relationships[0]
    test.data.relationships.push({ doc1: doc2, doc2: doc1 })
    expect(() => validate(test)).toThrow("duplicate relationship")
  })

  it("rejects attachments whose bytes are absent from the package", () => {
    const { data, tables } = fixture()
    expect(() =>
      validateProjectData({
        data,
        tables,
        sourceWorkspaceId,
        attachmentPaths: [],
      })
    ).toThrow("attachments do not match")
  })

  it("rejects attachment objects belonging to another workspace", () => {
    const test = fixture()
    test.data.attachments[0].key = "app_other/attachments/example.png"
    expect(() => validate(test)).toThrow("invalid or unreferenced attachment")
  })
})
