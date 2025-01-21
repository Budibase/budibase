import { verifyAIConfig } from "../configs"
import { TestConfiguration, structures } from "../../../../tests"
import { AIInnerConfig } from "@budibase/types"

describe("Global configs controller", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Should strip secrets when pulling AI config", async () => {
    const data = structures.configs.ai()
    await config.api.configs.saveConfig(data)
    const response = await config.api.configs.getAIConfig()
    expect(response.body.config).toEqual({
      ai: {
        active: true,
        apiKey: "--secret-value--",
        baseUrl: "https://api.example.com",
        defaultModel: "gpt4",
        isDefault: false,
        name: "Test",
        provider: "OpenAI",
      },
    })
  })

  it("Should not update existing secrets when updating an existing AI Config", async () => {
    const data = structures.configs.ai()
    await config.api.configs.saveConfig(data)

    const newConfig: AIInnerConfig = {
      ai: {
        provider: "OpenAI",
        isDefault: true,
        apiKey: "--secret-value--",
        name: "MyConfig",
        active: true,
        defaultModel: "gpt4",
      },
    }

    await verifyAIConfig(newConfig, data)
    // should be unchanged
    expect(newConfig.ai.apiKey).toEqual("myapikey")
  })
})
