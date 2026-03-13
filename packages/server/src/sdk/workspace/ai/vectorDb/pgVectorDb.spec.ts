const mockClient = {
  connect: jest.fn(),
  end: jest.fn(),
  query: jest.fn(),
}

jest.mock("pg", () => ({
  Client: jest.fn(() => mockClient),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: jest.fn(() => "ws_dev_123"),
    },
    db: {
      ...actual.db,
      getProdWorkspaceID: jest.fn((id: string) => id.replace("_dev", "")),
    },
    tenancy: {
      ...actual.tenancy,
      getTenantId: jest.fn(() => "tenant_123"),
    },
  }
})

import { HTTPError } from "@budibase/backend-core"
import { VectorDbProvider } from "@budibase/types"
import { buildPgVectorDbConfig, validatePgVectorDbConfig } from "./pgVectorDb"

describe("pgVectorDb", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("validatePgVectorDbConfig", () => {
    const config = {
      name: "test",
      provider: VectorDbProvider.PGVECTOR,
      host: "localhost",
      port: 5432,
      database: "test",
      user: "user",
      password: "pass",
    }

    it("validates a working pgvector connection", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ "?column?": 1 }] })

      await validatePgVectorDbConfig(config)

      expect(mockClient.connect).toHaveBeenCalledTimes(1)
      expect(mockClient.query).toHaveBeenNthCalledWith(1, "SELECT 1")
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        "SELECT 1 FROM pg_extension WHERE extname = 'vector' LIMIT 1"
      )
      expect(mockClient.end).toHaveBeenCalledTimes(1)
    })

    it("rejects databases without pgvector installed", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rowCount: 0, rows: [] })

      const result = validatePgVectorDbConfig(config)
      await expect(result).rejects.toThrow(HTTPError)
      await expect(result).rejects.toThrow("pgvector extension installed")
    })

    it("surfaces connection failures as validation errors", async () => {
      mockClient.connect.mockRejectedValueOnce(
        new Error("connect ECONNREFUSED")
      )

      await expect(validatePgVectorDbConfig(config)).rejects.toThrow(
        "connect ECONNREFUSED"
      )
      expect(mockClient.end).toHaveBeenCalledTimes(1)
    })
  })

  describe("deleteBySourceIds", () => {
    it("does not throw when the table does not exist", async () => {
      mockClient.query.mockRejectedValue({ code: "42P01" })

      const vectorDb = buildPgVectorDbConfig(
        {
          name: "test",
          provider: VectorDbProvider.PGVECTOR,
          host: "localhost",
          port: 5432,
          database: "test",
          user: "user",
          password: "pass",
        },
        { namespaceId: "agent_123" }
      )

      await vectorDb.deleteBySourceIds(["source_1"])

      expect(mockClient.connect).toHaveBeenCalledTimes(1)
      expect(mockClient.query).toHaveBeenCalledTimes(1)
      expect(mockClient.end).toHaveBeenCalledTimes(1)
    })
  })
})
