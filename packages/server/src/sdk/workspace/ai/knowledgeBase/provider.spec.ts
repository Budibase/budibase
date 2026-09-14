import { KnowledgeBaseType } from "@budibase/types"
import { withEnv } from "../../../../environment"
import {
  getKnowledgeBaseProvider,
  isKnowledgeSearchConfigured,
} from "./provider"

describe("knowledge provider configuration", () => {
  it("defaults to Gemini", async () => {
    await withEnv(
      {
        KNOWLEDGE_BASE_PROVIDER: "",
        GEMINI_API_KEY: "test",
        AZURE_OPENAI_API_KEY: "",
      },
      async () => {
        expect(getKnowledgeBaseProvider()).toBe(KnowledgeBaseType.GEMINI)
        expect(isKnowledgeSearchConfigured()).toBe(true)
      }
    )
  })

  it("allows Azure without a Gemini key", async () => {
    await withEnv(
      {
        KNOWLEDGE_BASE_PROVIDER: "azure",
        GEMINI_API_KEY: "",
        AZURE_OPENAI_ENDPOINT: "https://example.com",
        AZURE_OPENAI_API_KEY: "test",
      },
      async () => {
        expect(getKnowledgeBaseProvider()).toBe(KnowledgeBaseType.AZURE)
        expect(isKnowledgeSearchConfigured()).toBe(true)
      }
    )
  })

  it("does not fall back to Gemini when Azure credentials are missing", async () => {
    await withEnv(
      {
        KNOWLEDGE_BASE_PROVIDER: "azure",
        GEMINI_API_KEY: "test",
        AZURE_OPENAI_API_KEY: "",
      },
      async () => {
        expect(isKnowledgeSearchConfigured()).toBe(false)
      }
    )
  })

  it("rejects an invalid provider", async () => {
    await withEnv({ KNOWLEDGE_BASE_PROVIDER: "invalid" }, async () => {
      expect(getKnowledgeBaseProvider).toThrow(
        "KNOWLEDGE_BASE_PROVIDER must be gemini or azure"
      )
    })
  })
})
