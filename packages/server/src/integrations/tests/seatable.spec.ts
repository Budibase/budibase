jest.mock("axios", () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }

  const mockAxios: any = {
    get: jest.fn(),
    create: jest.fn(() => mockHttpClient),
    isAxiosError: jest.fn(() => false),
    __mockHttpClient: mockHttpClient,
  }
  return { default: mockAxios, __esModule: true }
})

import axios from "axios"
import { default as SeaTableIntegration } from "../seatable"

const mockAxios = axios as jest.Mocked<typeof axios> & {
  __mockHttpClient: {
    get: jest.Mock
    post: jest.Mock
    put: jest.Mock
    delete: jest.Mock
  }
}

const ACCESS_TOKEN_RESPONSE = {
  data: {
    access_token: "test-base-token",
    dtable_uuid: "test-uuid-456",
    dtable_server: "https://cloud.seatable.io/dtable-server/",
  },
}

function createIntegration() {
  return new SeaTableIntegration.integration({
    serverUrl: "https://cloud.seatable.io",
    apiToken: "test-api-token",
  })
}

describe("SeaTable Integration", () => {
  let integration: any
  const http = mockAxios.__mockHttpClient

  beforeEach(() => {
    jest.clearAllMocks()
    mockAxios.get.mockResolvedValue(ACCESS_TOKEN_RESPONSE)
    integration = createIntegration()
  })

  describe("authentication", () => {
    it("exchanges API token for base token", async () => {
      http.get.mockResolvedValue({ data: { metadata: { tables: [] } } })

      await integration.testConnection()

      expect(mockAxios.get).toHaveBeenCalledWith(
        "https://cloud.seatable.io/api/v2.1/dtable/app-access-token/",
        expect.objectContaining({
          headers: { Authorization: "Bearer test-api-token" },
        })
      )
    })

    it("uses dtable_server from token response as baseURL", async () => {
      http.get.mockResolvedValue({ data: { metadata: { tables: [] } } })

      await integration.testConnection()

      expect(mockAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL:
            "https://cloud.seatable.io/dtable-server/api/v2/dtables/test-uuid-456",
        })
      )
    })

    it("fails when token response is incomplete", async () => {
      mockAxios.get.mockResolvedValue({
        data: { access_token: "tok" },
      })

      const result = await integration.testConnection()
      expect(result.connected).toBe(false)
    })
  })

  describe("testConnection", () => {
    it("returns connected true on success", async () => {
      http.get.mockResolvedValue({ data: { metadata: { tables: [] } } })

      const result = await integration.testConnection()
      expect(result.connected).toBe(true)
    })

    it("returns connected false on failure", async () => {
      http.get.mockRejectedValue(new Error("connection refused"))

      const result = await integration.testConnection()
      expect(result.connected).toBe(false)
      expect(result.error).toContain("connection refused")
    })
  })

  describe("create", () => {
    it("posts a new row", async () => {
      http.post.mockResolvedValue({
        data: { first_row: { _id: "new-row", Name: "Alice" } },
      })

      const result = await integration.create({
        table: "Contacts",
        json: { Name: "Alice" },
      })

      expect(http.post).toHaveBeenCalledWith("/rows/", {
        table_name: "Contacts",
        rows: [{ Name: "Alice" }],
      })
      expect(result).toEqual({ _id: "new-row", Name: "Alice" })
    })

    it("throws on error", async () => {
      http.post.mockRejectedValue(new Error("bad request"))

      await expect(
        integration.create({ table: "T", json: {} })
      ).rejects.toThrow("bad request")
    })
  })

  describe("read", () => {
    it("fetches rows with params", async () => {
      http.get.mockResolvedValue({
        data: { rows: [{ _id: "r1", Name: "Alice" }] },
      })

      const result = await integration.read({
        table: "Contacts",
        numRecords: 50,
        view: "Default",
      })

      expect(http.get).toHaveBeenCalledWith("/rows/", {
        params: {
          table_name: "Contacts",
          start: 0,
          limit: 50,
          convert_keys: true,
          view_name: "Default",
        },
      })
      expect(result).toEqual([{ _id: "r1", Name: "Alice" }])
    })

    it("throws on error instead of returning empty array", async () => {
      http.get.mockRejectedValue(new Error("server error"))

      await expect(
        integration.read({ table: "T", numRecords: 10 })
      ).rejects.toThrow("server error")
    })
  })

  describe("update", () => {
    it("sends updates array", async () => {
      http.put.mockResolvedValue({ data: { success: true } })

      const result = await integration.update({
        table: "Contacts",
        id: "row1",
        json: { Name: "Bob" },
      })

      expect(http.put).toHaveBeenCalledWith("/rows/", {
        table_name: "Contacts",
        updates: [{ row_id: "row1", row: { Name: "Bob" } }],
      })
      expect(result).toEqual({ success: true })
    })

    it("throws on error", async () => {
      http.put.mockRejectedValue(new Error("not found"))

      await expect(
        integration.update({ table: "T", id: "r1", json: {} })
      ).rejects.toThrow("not found")
    })
  })

  describe("delete", () => {
    it("sends row_ids in request body", async () => {
      http.delete.mockResolvedValue({ data: { deleted_rows: 1 } })

      const result = await integration.delete({
        table: "Contacts",
        id: "row1",
      })

      expect(http.delete).toHaveBeenCalledWith("/rows/", {
        data: { table_name: "Contacts", row_ids: ["row1"] },
      })
      expect(result).toEqual({ deleted_rows: 1 })
    })

    it("throws on error", async () => {
      http.delete.mockRejectedValue(new Error("forbidden"))

      await expect(
        integration.delete({ table: "T", id: "r1" })
      ).rejects.toThrow("forbidden")
    })
  })
})
