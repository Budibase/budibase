jest.mock("../../../db", () => {
  return {
    ...jest.requireActual("../../../db"),
    environmentVariables: {
      update: jest.fn(),
      get: jest.fn().mockImplementation(() => ({ variables: {} })),
    },
  }
})
import { mocks } from "../../../../tests"
import { isValid, update } from "../environmentVariables"
import * as db from "../../../db"

describe("environment variable unit tests", () => {
  beforeAll(() => {
    mocks.licenses.useEnvironmentVariables()
  })

  it("should confirm isValid function works", () => {
    expect(isValid("hello there")).toBe(false)
    expect(isValid("ENV_VAR")).toBe(true)
    expect(isValid("env-1")).toBe(true)
    expect(isValid("Postgres_user")).toBe(true)
    expect(isValid("!!!!")).toBe(false)
    expect(isValid(" ")).toBe(false)
    expect(isValid("\n")).toBe(false)
  })

  it("should be able to update", async () => {
    await update("env-1", { production: "a", development: "a" })
    expect(db.environmentVariables.update).toHaveBeenCalled()
  })

  it("should not be able to update with spaces", async () => {
    let error: any
    try {
      await update("env 1", { production: "a", development: "a" })
    } catch (err: any) {
      error = err
    }
    expect(error).toBeDefined()
  })
})
