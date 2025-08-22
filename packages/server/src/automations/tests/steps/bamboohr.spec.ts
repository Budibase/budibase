import * as setup from "../utilities"
import { BambooHRStepInputs } from "@budibase/types"
const { createAutomationBuilder } = setup.structures

// Mock fetch
global.fetch = jest.fn()

describe("test the bamboohr action", () => {
  let { config } = setup.structures

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should be able to run the bamboohr action - getAll employees", async () => {
    const mockResponse = {
      employees: [
        { id: 1, firstName: "John", lastName: "Doe", workEmail: "john.doe@example.com" },
        { id: 2, firstName: "Jane", lastName: "Smith", workEmail: "jane.smith@example.com" }
      ]
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockResponse))
    })

    const inputs: BambooHRStepInputs = {
      subdomain: "test-company",
      apiKey: "test-api-key",
      resource: "employee",
      operation: "getAll"
    }

    const builder = createAutomationBuilder({
      name: "Test BambooHR",
      stepId: "BAMBOOHR",
      stepName: "BambooHR",
      stepType: "ACTION",
      inputs
    })

    const results = await builder.run()

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs.success).toBe(true)
    expect(results.steps[0].outputs.response).toEqual(mockResponse)
  })

  it("should handle errors gracefully", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

    const inputs: BambooHRStepInputs = {
      subdomain: "test-company",
      apiKey: "test-api-key",
      resource: "employee",
      operation: "getAll"
    }

    const builder = createAutomationBuilder({
      name: "Test BambooHR Error",
      stepId: "BAMBOOHR",
      stepName: "BambooHR",
      stepType: "ACTION",
      inputs
    })

    const results = await builder.run()

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs.success).toBe(false)
    expect(results.steps[0].outputs.response.message).toContain("Network error")
  })

  it("should validate required fields", async () => {
    const inputs: Partial<BambooHRStepInputs> = {
      resource: "employee",
      operation: "getAll"
      // Missing subdomain and apiKey
    }

    const builder = createAutomationBuilder({
      name: "Test BambooHR Validation",
      stepId: "BAMBOOHR",
      stepName: "BambooHR",
      stepType: "ACTION",
      inputs: inputs as BambooHRStepInputs
    })

    const results = await builder.run()

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs.success).toBe(false)
    expect(results.steps[0].outputs.response.message).toContain("subdomain and API key are required")
  })

  it("should support employee creation", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: {
        get: (name: string) => name === "location" ? "https://api.bamboohr.com/api/gateway.php/test/v1/employees/123" : null
      },
      text: () => Promise.resolve("")
    })

    const inputs: BambooHRStepInputs = {
      subdomain: "test-company",
      apiKey: "test-api-key",
      resource: "employee",
      operation: "create",
      employeeData: {
        firstName: "John",
        lastName: "Doe",
        workEmail: "john.doe@example.com"
      }
    }

    const builder = createAutomationBuilder({
      name: "Test BambooHR Create",
      stepId: "BAMBOOHR",
      stepName: "BambooHR",
      stepType: "ACTION",
      inputs
    })

    const results = await builder.run()

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs.success).toBe(true)
    expect(results.steps[0].outputs.response.id).toBe("123")
  })
})