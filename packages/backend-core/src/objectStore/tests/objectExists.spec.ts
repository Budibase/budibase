const mockHeadObject = jest.fn()
jest.mock("@aws-sdk/client-s3", () => ({
  S3: jest.fn(() => ({
    headObject: mockHeadObject,
  })),
}))

import { objectExists } from "../objectStore"

describe("objectExists", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return true when object exists", async () => {
    mockHeadObject.mockResolvedValue({})

    const result = await objectExists("test-bucket", "test-key")

    expect(result).toBe(true)
    expect(mockHeadObject).toHaveBeenCalledWith({
      Bucket: "test-bucket",
      Key: "test-key",
    })
  })

  it("should return false when object does not exist (404 error)", async () => {
    const error: any = new Error("Not Found")
    error.statusCode = 404
    mockHeadObject.mockRejectedValue(error)

    const result = await objectExists("test-bucket", "test-key")

    expect(result).toBe(false)
    expect(mockHeadObject).toHaveBeenCalledWith({
      Bucket: "test-bucket",
      Key: "test-key",
    })
  })

  it("should return false when object does not exist (404 error with $response)", async () => {
    const error: any = new Error("Not Found")
    error.$response = { statusCode: 404 }
    mockHeadObject.mockRejectedValue(error)

    const result = await objectExists("test-bucket", "test-key")

    expect(result).toBe(false)
  })

  it("should throw error for other errors", async () => {
    const error: any = new Error("Access Denied")
    error.statusCode = 403
    mockHeadObject.mockRejectedValue(error)

    await expect(objectExists("test-bucket", "test-key")).rejects.toThrow(
      "Access Denied"
    )
  })

  it("should sanitize bucket and path", async () => {
    mockHeadObject.mockResolvedValue({})

    await objectExists("dev_app_123", "some\\path/with\\backslashes")

    expect(mockHeadObject).toHaveBeenCalledWith({
      Bucket: "dev_app_123", // The bucket sanitization only applies to the workspace dev prefix
      Key: "some/path/with/backslashes",
    })
  })
})
