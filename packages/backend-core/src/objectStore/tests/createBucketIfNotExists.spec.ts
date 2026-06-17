import { createBucketIfNotExists } from "../objectStore"

const mockHeadBucket = jest.fn()
const mockCreateBucket = jest.fn()

const mockClient = {
  headBucket: mockHeadBucket,
  createBucket: mockCreateBucket,
} as any

describe("createBucketIfNotExists", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns exists=true without creating when bucket already exists", async () => {
    mockHeadBucket.mockResolvedValue({})

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: false, exists: true })
    expect(mockCreateBucket).not.toHaveBeenCalled()
  })

  it("creates the bucket when headBucket returns 404 via statusCode", async () => {
    const error: any = new Error("Not Found")
    error.statusCode = 404
    mockHeadBucket.mockRejectedValue(error)
    mockCreateBucket.mockResolvedValue({})

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: true, exists: false })
    expect(mockCreateBucket).toHaveBeenCalledWith({ Bucket: "test-bucket" })
  })

  it("creates the bucket when headBucket returns 404 via $response", async () => {
    const error: any = new Error("Not Found")
    error.$response = { statusCode: 404 }
    mockHeadBucket.mockRejectedValue(error)
    mockCreateBucket.mockResolvedValue({})

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: true, exists: false })
    expect(mockCreateBucket).toHaveBeenCalledWith({ Bucket: "test-bucket" })
  })

  it("creates the bucket when headBucket returns 404 via $metadata (SDK v3 / Ceph)", async () => {
    const error: any = new Error("Not Found")
    error.$metadata = { httpStatusCode: 404 }
    mockHeadBucket.mockRejectedValue(error)
    mockCreateBucket.mockResolvedValue({})

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: true, exists: false })
    expect(mockCreateBucket).toHaveBeenCalledWith({ Bucket: "test-bucket" })
  })

  it("attempts creation when headBucket fails with an unrecognised status code", async () => {
    const error: any = new Error("Bad Request")
    error.$metadata = { httpStatusCode: 400 }
    mockHeadBucket.mockRejectedValue(error)
    mockCreateBucket.mockResolvedValue({})

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: true, exists: false })
    expect(mockCreateBucket).toHaveBeenCalledWith({ Bucket: "test-bucket" })
  })

  it("attempts creation when headBucket fails with no status code at all", async () => {
    mockHeadBucket.mockRejectedValue(new Error("network error"))
    mockCreateBucket.mockResolvedValue({})

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: true, exists: false })
  })

  it("throws when headBucket returns 403", async () => {
    const error: any = new Error("Forbidden")
    error.statusCode = 403
    mockHeadBucket.mockRejectedValue(error)

    await expect(
      createBucketIfNotExists(mockClient, "test-bucket")
    ).rejects.toThrow("Access denied to object store bucket.")

    expect(mockCreateBucket).not.toHaveBeenCalled()
  })

  it("swallows BucketAlreadyOwnedByYou via err.Code (race condition)", async () => {
    const headError: any = new Error("Not Found")
    headError.statusCode = 404
    mockHeadBucket.mockRejectedValue(headError)

    const createError: any = new Error("BucketAlreadyOwnedByYou")
    createError.Code = "BucketAlreadyOwnedByYou"
    mockCreateBucket.mockRejectedValue(createError)

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: true, exists: false })
  })

  it("swallows BucketAlreadyOwnedByYou via err.name (Ceph SDK v3 format)", async () => {
    const headError: any = new Error("Not Found")
    headError.$metadata = { httpStatusCode: 404 }
    mockHeadBucket.mockRejectedValue(headError)

    const createError: any = new Error("BucketAlreadyOwnedByYou")
    createError.name = "BucketAlreadyOwnedByYou"
    mockCreateBucket.mockRejectedValue(createError)

    const result = await createBucketIfNotExists(mockClient, "test-bucket")

    expect(result).toEqual({ created: true, exists: false })
  })

  it("propagates unexpected createBucket errors", async () => {
    const headError: any = new Error("Not Found")
    headError.statusCode = 404
    mockHeadBucket.mockRejectedValue(headError)

    mockCreateBucket.mockRejectedValue(new Error("InternalError"))

    await expect(
      createBucketIfNotExists(mockClient, "test-bucket")
    ).rejects.toThrow("InternalError")
  })
})
