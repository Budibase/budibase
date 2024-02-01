import { vi } from "vitest"

vi.mock("@google-cloud/firestore", () => {
  return {
    Firestore: vi.fn(() => ({
      collection: vi.fn(() => ({
        doc: vi.fn(() => ({
          get: vi.fn(() => ({
            data: vi.fn(() => ({ result: "test" })),
          })),
          update: vi.fn(),
          set: vi.fn(),
          delete: vi.fn(),
          id: "test_id",
        })),
        where: vi.fn(() => ({
          get: vi.fn(() => [
            {
              data: vi.fn(() => ({ result: "test" })),
            },
          ]),
        })),
        collection: vi.fn(() => ({
          doc: vi.fn(() => ({
            get: vi.fn(() => ({
              data: vi.fn(() => ({ result: "test" })),
            })),
            update: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            id: "test_id",
          })),
          where: vi.fn(() => ({
            get: vi.fn(() => [
              {
                data: vi.fn(() => ({ result: "test" })),
              },
            ]),
          })),
        })),
      })),
    })),
  }
})
