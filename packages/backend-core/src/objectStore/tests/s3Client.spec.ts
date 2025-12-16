import https from "https"

// Capture S3 constructor calls
let s3ConstructorCalls: any[] = []

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3: jest.fn().mockImplementation(config => {
      s3ConstructorCalls.push(config)
      return {
        headBucket: jest.fn(),
        headObject: jest.fn(),
      }
    }),
    GetObjectCommand: jest.fn(),
  }
})

jest.mock("@smithy/node-http-handler", () => {
  return {
    NodeHttpHandler: jest.fn().mockImplementation(config => ({
      _config: config,
    })),
  }
})

describe("ObjectStore S3 client configuration", () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    s3ConstructorCalls = []
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  const getObjectStore = (envOverrides: Record<string, string | undefined>) => {
    // Set environment variables before importing
    for (const [key, value] of Object.entries(envOverrides)) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }

    // Re-import to pick up new env values
    jest.resetModules()
    s3ConstructorCalls = []
    const { ObjectStore } = require("../objectStore")
    return ObjectStore
  }

  describe("S3_IGNORE_SELF_SIGNED", () => {
    it("should not configure custom request handler when S3_IGNORE_SELF_SIGNED is not set", () => {
      const ObjectStore = getObjectStore({
        MINIO_ACCESS_KEY: "test-access-key",
        MINIO_SECRET_KEY: "test-secret-key",
        AWS_REGION: "us-east-1",
        MINIO_URL: "https://minio.example.com:9000",
        S3_IGNORE_SELF_SIGNED: undefined,
      })

      ObjectStore()

      expect(s3ConstructorCalls).toHaveLength(1)
      expect(s3ConstructorCalls[0].requestHandler).toBeUndefined()
    })

    it("should not configure custom request handler when S3_IGNORE_SELF_SIGNED is 'false'", () => {
      const ObjectStore = getObjectStore({
        MINIO_ACCESS_KEY: "test-access-key",
        MINIO_SECRET_KEY: "test-secret-key",
        AWS_REGION: "us-east-1",
        MINIO_URL: "https://minio.example.com:9000",
        S3_IGNORE_SELF_SIGNED: "false",
      })

      ObjectStore()

      expect(s3ConstructorCalls).toHaveLength(1)
      expect(s3ConstructorCalls[0].requestHandler).toBeUndefined()
    })

    it("should configure custom request handler when S3_IGNORE_SELF_SIGNED is 'true'", () => {
      const ObjectStore = getObjectStore({
        MINIO_ACCESS_KEY: "test-access-key",
        MINIO_SECRET_KEY: "test-secret-key",
        AWS_REGION: "us-east-1",
        MINIO_URL: "https://minio.example.com:9000",
        S3_IGNORE_SELF_SIGNED: "true",
      })

      ObjectStore()

      expect(s3ConstructorCalls).toHaveLength(1)
      expect(s3ConstructorCalls[0].requestHandler).toBeDefined()
      expect(s3ConstructorCalls[0].requestHandler._config).toBeDefined()
      expect(
        s3ConstructorCalls[0].requestHandler._config.httpsAgent
      ).toBeInstanceOf(https.Agent)
      expect(
        s3ConstructorCalls[0].requestHandler._config.httpsAgent.options
          .rejectUnauthorized
      ).toBe(false)
    })

    it("should work with HTTPS endpoints when S3_IGNORE_SELF_SIGNED is enabled", () => {
      const ObjectStore = getObjectStore({
        MINIO_ACCESS_KEY: "test-access-key",
        MINIO_SECRET_KEY: "test-secret-key",
        AWS_REGION: "us-east-1",
        MINIO_URL: "https://self-signed-s3.local:9000",
        S3_IGNORE_SELF_SIGNED: "true",
      })

      ObjectStore()

      expect(s3ConstructorCalls).toHaveLength(1)
      expect(s3ConstructorCalls[0].endpoint).toBe(
        "https://self-signed-s3.local:9000"
      )
      expect(s3ConstructorCalls[0].requestHandler).toBeDefined()
    })

    it("should still configure request handler even for HTTP endpoints when S3_IGNORE_SELF_SIGNED is enabled", () => {
      const ObjectStore = getObjectStore({
        MINIO_ACCESS_KEY: "test-access-key",
        MINIO_SECRET_KEY: "test-secret-key",
        AWS_REGION: "us-east-1",
        MINIO_URL: "http://minio.example.com:9000",
        S3_IGNORE_SELF_SIGNED: "true",
      })

      ObjectStore()

      expect(s3ConstructorCalls).toHaveLength(1)
      expect(s3ConstructorCalls[0].endpoint).toBe(
        "http://minio.example.com:9000"
      )
      expect(s3ConstructorCalls[0].requestHandler).toBeDefined()
    })
  })

  describe("endpoint configuration", () => {
    it("should set endpoint from MINIO_URL", () => {
      const ObjectStore = getObjectStore({
        MINIO_ACCESS_KEY: "test-access-key",
        MINIO_SECRET_KEY: "test-secret-key",
        AWS_REGION: "us-east-1",
        MINIO_URL: "https://custom-s3.example.com:9000",
        S3_IGNORE_SELF_SIGNED: undefined,
      })

      ObjectStore()

      expect(s3ConstructorCalls).toHaveLength(1)
      expect(s3ConstructorCalls[0].endpoint).toBe(
        "https://custom-s3.example.com:9000"
      )
    })

    it("should not set endpoint when MINIO_URL is not defined", () => {
      const ObjectStore = getObjectStore({
        MINIO_ACCESS_KEY: "test-access-key",
        MINIO_SECRET_KEY: "test-secret-key",
        AWS_REGION: "us-east-1",
        MINIO_URL: undefined,
        S3_IGNORE_SELF_SIGNED: undefined,
      })

      ObjectStore()

      expect(s3ConstructorCalls).toHaveLength(1)
      expect(s3ConstructorCalls[0].endpoint).toBeUndefined()
    })
  })
})
