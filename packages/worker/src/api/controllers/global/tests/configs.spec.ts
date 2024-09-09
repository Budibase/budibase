import { expect } from "vitest"
import { configs } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import * as pro from "@budibase/pro"
import { find, verifyAIConfig } from "../configs"

jest.mock("@budibase/backend-core", () => ({
  ...jest.requireActual("@budibase/backend-core"),
  configs: {
    getConfig: jest.fn(),
    save: jest.fn(),
  },
}))

describe("Global configs controller", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("Should strip secrets when pulling AI config", async () => {
    configs.getConfig.mockResolvedValue({
      config: {
        ai: {
          apiKey: "abc123APIKey",
          baseUrl: "https://api.example.com",
        },
      },
    })
    const ctx = {
      params: {
        type: "ai",
      },
      throw: jest.fn(),
    } as UserCtx

    await find(ctx)

    expect(ctx.body).toEqual({
      config: {
        ai: {
          apiKey: "--secret-value--",
          baseUrl: "https://api.example.com",
        },
      },
    })
  })

  it("Should return the default BB AI config when the feature is turned on", async () => {
    pro.features.isBudibaseAIEnabled = jest.fn(() => true)
    configs.getConfig.mockResolvedValue({
      config: {
        ai: {
          apiKey: "abc123APIKey",
          baseUrl: "https://api.example.com",
        },
      },
    })
    const ctx = {
      params: {
        type: "ai",
      },
      throw: jest.fn(),
    } as UserCtx

    await find(ctx)

    expect(ctx.body).toEqual({
      config: {
        budibase_ai: {
          provider: "OpenAI",
          active: true,
          isDefault: true,
          defaultModel: undefined,
          name: "Budibase AI",
        },
        ai: {
          apiKey: "--secret-value--",
          baseUrl: "https://api.example.com",
        },
      },
    })
  })

  it("Should not update existing secrets when updating an existing AI Config", async () => {
    const newConfig = {
      type: "ai",
      config: {
        aiconfig: {
          provider: "OpenAI",
          isDefault: true,
          name: "MyConfig",
          active: true,
          defaultModel: "gpt4",
          apiKey: "--secret-value--",
        },
      },
    }

    const existingConfig = {
      type: "ai",
      config: {
        aiconfig: {
          provider: "OpenAI",
          isDefault: true,
          name: "MyConfig",
          active: true,
          defaultModel: "gpt4",
          apiKey: "myapikey",
        },
      },
    }

    await verifyAIConfig(newConfig, existingConfig)
    // should be unchanged
    expect(newConfig.config.aiconfig.apiKey === "myapikey")
  })
})
