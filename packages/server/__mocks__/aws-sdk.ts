import { vi } from "vitest"

vi.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: vi.fn(() => ({
        put: vi.fn(() => ({
          promise: vi.fn(() => ({})),
        })),
        query: vi.fn(() => ({
          promise: vi.fn(() => ({
            Items: [],
          })),
        })),
        scan: vi.fn(() => ({
          promise: vi.fn(() => ({
            Items: [{ Name: "test" }],
          })),
        })),
        get: vi.fn(() => ({
          promise: vi.fn(() => ({})),
        })),
        update: vi.fn(() => ({
          promise: vi.fn(() => ({})),
        })),
        delete: vi.fn(() => ({
          promise: vi.fn(() => ({})),
        })),
      })),
    },
    S3: vi.fn(() => ({
      listObjects: vi.fn(() => ({
        promise: vi.fn(() => ({
          Contents: [],
        })),
      })),
      createBucket: vi.fn(() => ({
        promise: vi.fn(() => ({
          Contents: {},
        })),
      })),
      deleteObjects: vi.fn(() => ({
        promise: vi.fn(() => ({
          Contents: {},
        })),
      })),
      getSignedUrl: vi.fn((operation, params) => {
        return `http://test.com/${params.Bucket}/${params.Key}`
      }),
      headBucket: vi.fn(() => ({
        promise: vi.fn(() => ({
          Contents: {},
        })),
      })),
      upload: vi.fn(() => ({
        promise: vi.fn(() => ({
          Contents: {},
        })),
      })),
      getObject: vi.fn(() => ({
        promise: vi.fn(() => ({
          Body: "",
        })),
      })),
    })),
    config: {
      update: vi.fn(),
    },
  }
})
