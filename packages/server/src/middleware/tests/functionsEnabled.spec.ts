jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")

  return {
    ...actual,
    features: {
      ...actual.features,
      isEnabled: jest.fn(),
    },
  }
})

import { features } from "@budibase/backend-core"
import { type Ctx, FeatureFlag } from "@budibase/types"
import Koa from "koa"
import { setEnv } from "../../environment"
import { areFunctionsEnabled, functionsEnabled } from "../functionsEnabled"

describe("Functions enabled middleware", () => {
  let restoreEnvironment: (() => void) | undefined

  beforeEach(() => {
    jest.clearAllMocks()
    restoreEnvironment = undefined
    jest.mocked(features.isEnabled).mockResolvedValue(true)
  })

  afterEach(() => {
    restoreEnvironment?.()
  })

  const setFunctionEnvironment = (
    selfHosted: string,
    functionsEnabled: string
  ) => {
    restoreEnvironment = setEnv({
      SELF_HOSTED: selfHosted,
      BUDIBASE_FUNCTIONS_ENABLED: functionsEnabled,
    })
  }

  it("enables Functions when self-hosting, the admin flag, and rollout flag are enabled", async () => {
    setFunctionEnvironment("true", "true")

    await expect(areFunctionsEnabled()).resolves.toBe(true)
    expect(features.isEnabled).toHaveBeenCalledWith(FeatureFlag.FUNCTIONS)
  })

  it.each(["false", "0"])(
    "does not enable Functions when the admin flag is %s",
    async value => {
      setFunctionEnvironment("true", value)

      await expect(areFunctionsEnabled()).resolves.toBe(false)
      expect(features.isEnabled).not.toHaveBeenCalled()
    }
  )

  it("does not enable Functions when the rollout flag is disabled", async () => {
    setFunctionEnvironment("true", "true")
    jest.mocked(features.isEnabled).mockResolvedValue(false)

    await expect(areFunctionsEnabled()).resolves.toBe(false)
  })

  it("passes through to the next middleware when enabled", async () => {
    setFunctionEnvironment("true", "true")
    const next = jest.fn().mockResolvedValue("next-result")
    const ctx = {} as Ctx

    await expect(functionsEnabled(ctx, next)).resolves.toBe("next-result")
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("throws not found and does not call the next middleware when disabled", async () => {
    setFunctionEnvironment("true", "false")
    const next = jest.fn()
    const ctx = new Koa().context as Ctx
    ctx.throw = jest.fn(() => {
      throw new Error("not found")
    })

    await expect(functionsEnabled(ctx, next)).rejects.toThrow("not found")
    expect(next).not.toHaveBeenCalled()
  })
})
