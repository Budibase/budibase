import { vi } from "vitest"

vi.mock("mongodb", async () => {
  const ops = {
    insertOne: vi.fn(),
    insertMany: vi.fn(() => ({ toArray: () => [] })),
    find: vi.fn(() => ({ toArray: () => [] })),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    count: vi.fn(),
    deleteOne: vi.fn(),
    deleteMany: vi.fn(() => ({ toArray: () => [] })),
    updateOne: vi.fn(),
    updateMany: vi.fn(() => ({ toArray: () => [] })),
  }
  const collection = vi.fn(() => {
    return { ...ops }
  })

  return {
    MongoClient: {
      connect: vi.fn(),
      close: vi.fn(),
      ...ops,
      collection,
      db: vi.fn(() => ({
        collection,
      })),
    },
    // @ts-ignore
    ObjectId: await vi.importActual("mongodb").ObjectId,
  }
})
