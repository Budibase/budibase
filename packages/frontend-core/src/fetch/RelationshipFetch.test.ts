// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest"
import { RelationshipDatasource, Table } from "@budibase/types"
import RelationshipFetch from "./RelationshipFetch"
import { APIClient } from "../api/types"

describe("RelationshipFetch fallback behavior", () => {
  const mockDatasource: RelationshipDatasource = {
    type: "link",
    tableId: "relatedTableId",
    rowId: "temp-uuid-123",
    rowTableId: "parentTableId",
    fieldName: "parentLinkField",
  }

  const mockParentTableDefinition: Table = {
    _id: "relatedTableId",
    name: "relatedTable",
    type: "table",
    primaryDisplay: "name",
    schema: {
      childLinkField: {
        type: "link",
        tableId: "parentTableId",
        fieldName: "parentLinkField",
        name: "childLinkField",
      },
      name: {
        type: "string",
        name: "name",
      },
    },
  } as unknown as Table

  it("returns rows directly from fetchRelationshipData on success", async () => {
    const mockAPI = {
      fetchRelationshipData: vi.fn().mockResolvedValue([{ _id: "row1" }]),
      fetchTableDefinition: vi.fn(),
      searchTable: vi.fn(),
    } as unknown as APIClient

    const fetch = new RelationshipFetch({
      API: mockAPI,
      datasource: mockDatasource,
      query: {},
    })

    const result = await fetch.getData()
    expect(mockAPI.fetchRelationshipData).toHaveBeenCalledWith(
      "parentTableId",
      "temp-uuid-123",
      "parentLinkField"
    )
    expect(result).toEqual({ rows: [{ _id: "row1" }] })
    expect(mockAPI.searchTable).not.toHaveBeenCalled()
  })

  it("falls back to searchTable when fetchRelationshipData fails", async () => {
    const mockAPI = {
      fetchRelationshipData: vi.fn().mockRejectedValue(new Error("Row not found")),
      fetchTableDefinition: vi.fn().mockResolvedValue(mockParentTableDefinition),
      searchTable: vi.fn().mockResolvedValue({ rows: [{ _id: "row2" }] }),
    } as unknown as APIClient

    const fetch = new RelationshipFetch({
      API: mockAPI,
      datasource: mockDatasource,
      query: {},
    })

    const result = await fetch.getData()
    expect(mockAPI.fetchRelationshipData).toHaveBeenCalled()
    expect(mockAPI.fetchTableDefinition).toHaveBeenCalledWith("relatedTableId")
    expect(mockAPI.searchTable).toHaveBeenCalledWith("relatedTableId", {
      query: {
        equal: {
          childLinkField: "temp-uuid-123",
        },
      },
    })
    expect(result).toEqual({ rows: [{ _id: "row2" }] })
  })
})
