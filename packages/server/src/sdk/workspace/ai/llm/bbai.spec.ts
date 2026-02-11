import { withEnv } from "@budibase/backend-core"
import { createBBAIClient } from "./bbai"

describe("createBBAIClient", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects unsupported models", async () => {
    await expect(createBBAIClient("unsupported-model")).rejects.toMatchObject({
      status: 400,
    })
  })

  it("requires an OpenAI API key for OpenAI models", async () => {
    await withEnv({ BBAI_OPENAI_API_KEY: "" }, async () => {
      await expect(
        createBBAIClient("budibase/gpt-5-mini")
      ).rejects.toMatchObject({
        status: 500,
        message: "OPENAI API key not configured",
      })
    })
  })

  it("requires MISTRAL_BASE_URL for Mistral models", async () => {
    await withEnv(
      {
        BBAI_MISTRAL_API_KEY: "mistral-key",
        MISTRAL_BASE_URL: "",
      },
      async () => {
        await expect(
          createBBAIClient("budibase/mistral-small-latest")
        ).rejects.toMatchObject({
          status: 500,
          message: "MISTRAL_BASE_URL not configured",
        })
      }
    )
  })
})
