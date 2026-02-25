import {
  buildExportFn,
  buildImportFn,
} from "../../../src/sdk/publicApi/applications"
import { context } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import { isWorkspaceImportExportPublicApiEnabled } from "../../../src/sdk/features"

jest.mock("@budibase/backend-core", () => ({
  context: {
    doInWorkspaceContext: jest.fn(),
  },
}))

jest.mock("../../../src/sdk/features", () => ({
  isWorkspaceImportExportPublicApiEnabled: jest.fn(),
}))

type Mocked<T> = jest.Mocked<T>
type ThrowFn = (status: number, message: string) => never

interface TestCtx {
  request: {
    files?: Record<string, unknown>
    body: Record<string, unknown>
  }
  params: {
    appId: string
  }
  query: Record<string, unknown>
  body?: unknown
  status?: number
  throw: ThrowFn
}

describe("applications public API import", () => {
  const mockedContext = context as Mocked<typeof context>
  const mockedImportExportCheck =
    isWorkspaceImportExportPublicApiEnabled as jest.MockedFunction<
      typeof isWorkspaceImportExportPublicApiEnabled
    >

  beforeEach(() => {
    jest.clearAllMocks()
    mockedImportExportCheck.mockResolvedValue(true)
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

  it("rejects non-enterprise plans", async () => {
    mockedImportExportCheck.mockResolvedValue(false)

    const importFn = jest.fn().mockResolvedValue(undefined)
    const handler = buildImportFn(importFn)
    const ctx: TestCtx = {
      request: {
        files: {
          file: {
            filepath: "/tmp/app-export.json",
          },
        },
        body: {},
      },
      params: {
        appId: "app-789",
      },
      query: {},
      throw: jest.fn((status: number, message: string) => {
        throw new Error(`${status}: ${message}`)
      }),
    }
    const next = jest.fn()

    await expect(handler(ctx as UserCtx, next)).rejects.toThrow(
      "403: Endpoint unavailable, enterprise license required."
    )
    expect(mockedContext.doInWorkspaceContext).not.toHaveBeenCalled()
    expect(importFn).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})

describe("applications public API export", () => {
  const mockedContext = context as Mocked<typeof context>
  const mockedImportExportCheck =
    isWorkspaceImportExportPublicApiEnabled as jest.MockedFunction<
      typeof isWorkspaceImportExportPublicApiEnabled
    >

  beforeEach(() => {
    jest.clearAllMocks()
    mockedImportExportCheck.mockResolvedValue(true)
    mockedContext.doInWorkspaceContext.mockImplementation(
      (_appId: string, work: () => unknown) => Promise.resolve(work())
    )
  })

  it("rejects non-enterprise plans", async () => {
    mockedImportExportCheck.mockResolvedValue(false)

    const exportFn = jest.fn().mockResolvedValue(undefined)
    const handler = buildExportFn(exportFn)
    const ctx: TestCtx = {
      request: {
        body: {
          encryptPassword: "secret",
          excludeRows: false,
        },
      },
      params: {
        appId: "app-456",
      },
      query: {},
      throw: jest.fn((status: number, message: string) => {
        throw new Error(`${status}: ${message}`)
      }),
    }
    const next = jest.fn()

    await expect(handler(ctx as UserCtx, next)).rejects.toThrow(
      "403: Endpoint unavailable, enterprise license required."
    )
    expect(mockedContext.doInWorkspaceContext).not.toHaveBeenCalled()
    expect(exportFn).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})
