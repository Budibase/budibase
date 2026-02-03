import { buildImportFn } from "../../../src/sdk/publicApi/applications"
import { context } from "@budibase/backend-core"
import { isExpandedPublicApiEnabled } from "../../../src/sdk/features"

jest.mock("@budibase/backend-core", () => ({
  context: {
    doInWorkspaceContext: jest.fn(),
  },
}))

jest.mock("../../../src/sdk/features", () => ({
  isExpandedPublicApiEnabled: jest.fn(),
}))

type Mocked<T> = jest.Mocked<T>

describe("applications public API import", () => {
  const mockedContext = context as Mocked<typeof context>
  const mockedFeatureCheck = isExpandedPublicApiEnabled as jest.MockedFunction<
    typeof isExpandedPublicApiEnabled
  >

  beforeEach(() => {
    jest.clearAllMocks()
    mockedFeatureCheck.mockResolvedValue(true)
    mockedContext.doInWorkspaceContext.mockImplementation(
      (_appId: string, work: () => unknown) => Promise.resolve(work())
    )
  })

  it("falls back to the generic file field when appExport is missing", async () => {
    const importFn = jest.fn().mockResolvedValue(undefined)
    const handler = buildImportFn(importFn)
    const ctx: any = {
      request: {
        files: {
          file: {
            filepath: "/tmp/app-export.json",
          },
        },
        body: {},
      },
      params: {
        appId: "app-123",
      },
      throw: jest.fn((status: number, message: string) => {
        throw new Error(`${status}: ${message}`)
      }),
    }
    const next = jest.fn()

    await handler(ctx, next)

    expect(mockedContext.doInWorkspaceContext).toHaveBeenCalledWith(
      "app-123",
      expect.any(Function)
    )
    expect(importFn).toHaveBeenCalledWith(ctx)
    expect(ctx.throw).not.toHaveBeenCalled()
    expect(ctx.status).toBe(204)
    expect(ctx.body).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  it("prefers the appExport file field when present", async () => {
    const importFn = jest.fn().mockResolvedValue(undefined)
    const handler = buildImportFn(importFn)
    const ctx: any = {
      request: {
        files: {
          appExport: {
            filepath: "/tmp/app-export.json",
          },
        },
        body: {},
      },
      params: {
        appId: "app-456",
      },
      throw: jest.fn((status: number, message: string) => {
        throw new Error(`${status}: ${message}`)
      }),
    }
    const next = jest.fn()

    await handler(ctx, next)

    expect(mockedContext.doInWorkspaceContext).toHaveBeenCalledWith(
      "app-456",
      expect.any(Function)
    )
    expect(importFn).toHaveBeenCalledWith(ctx)
    expect(ctx.throw).not.toHaveBeenCalled()
    expect(ctx.status).toBe(204)
    expect(ctx.body).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })
})
