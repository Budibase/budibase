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

import { VectorDbProvider } from "@budibase/types"
import { buildPgVectorDbConfig } from "./pgVectorDb"

describe("pgVectorDb", () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
        { agentId: "agent_123" }
      )

      await vectorDb.deleteBySourceIds(["source_1"])

      expect(mockClient.connect).toHaveBeenCalledTimes(1)
      expect(mockClient.query).toHaveBeenCalledTimes(1)
      expect(mockClient.end).toHaveBeenCalledTimes(1)
    })
  })
})
