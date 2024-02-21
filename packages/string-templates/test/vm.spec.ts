jest.mock("../src/utilities", () => {
  const utilities = jest.requireActual("../src/utilities")
  return {
    ...utilities,
    isBackendService: jest.fn().mockReturnValue(true),
  }
})

import { defaultJSSetup, processStringSync, encodeJSBinding } from "../src"
import { isBackendService } from "../src/utilities"

const mockedBackendService = jest.mocked(isBackendService)

const binding = encodeJSBinding("return 1")
describe("confirm VM is available when expected and when not", () => {
  it("shouldn't have JS available in a backend service by default", () => {
    defaultJSSetup()
    const result = processStringSync(binding, {})
    // shouldn't process at all
    expect(result).toBe(binding)
  })

  it("should have JS available in frontend environments", () => {
    mockedBackendService.mockReturnValue(false)
    defaultJSSetup()
    const result = processStringSync(binding, {})
    expect(result).toBe(1)
  })
})
