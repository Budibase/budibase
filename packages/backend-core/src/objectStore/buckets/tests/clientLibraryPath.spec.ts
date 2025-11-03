jest.mock("../../objectStore", () => ({
  sanitizeKey: jest.requireActual("../../objectStore").sanitizeKey,
  objectExists: jest.fn(),
}))

import * as objectStore from "../../objectStore"
import { clientLibraryPath } from "../app"

const mockObjectExists = objectStore.objectExists as jest.MockedFunction<
  typeof objectStore.objectExists
>

describe("clientLibraryPath", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return the client path", () => {
    const result = clientLibraryPath("app_123")

    expect(result).toBe("app_123/budibase-client.js")

    expect(mockObjectExists).not.toHaveBeenCalled()
  })
})
