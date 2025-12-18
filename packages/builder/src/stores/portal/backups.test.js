import { it, expect, describe, beforeEach, vi } from "vitest"
import { BackupStore } from "./backups"
import { writable } from "svelte/store"
import { API } from "@/api"

vi.mock("svelte/store", () => {
  return {
    writable: vi.fn(() => ({
      subscribe: vi.fn(),
      update: vi.fn(),
    })),
    derived: vi.fn(() => ({
      subscribe: vi.fn(),
    })),
  }
})

vi.mock("@/api", () => {
  return {
    API: {
      searchBackups: vi.fn(() => "searchBackupsReturn"),
      restoreBackup: vi.fn(() => "restoreBackupReturn"),
      deleteBackup: vi.fn(() => "deleteBackupReturn"),
      createManualBackup: vi.fn(() => "createManualBackupReturn"),
    },
  }
})

describe("backups store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()

    ctx.writableReturn = { update: vi.fn(), subscribe: vi.fn() }
    writable.mockReturnValue(ctx.writableReturn)

    ctx.returnedStore = new BackupStore()
  })

  it("inits the writable store with the default config", () => {
    expect(writable).toHaveBeenCalledTimes(1)
    expect(writable).toHaveBeenCalledWith({})
  })

  describe("createManualBackup", () => {
    beforeEach(async ctx => {
      ctx.appId = "appId"
      ctx.value = await ctx.returnedStore.createManualBackup(ctx.appId)
    })

    it("calls and returns the API createManualBackup method", ctx => {
      expect(API.createManualBackup).toHaveBeenCalledTimes(1)
      expect(API.createManualBackup).toHaveBeenCalledWith(ctx.appId)
      expect(ctx.value).toBe("createManualBackupReturn")
    })
  })

  describe("searchBackups", () => {
    beforeEach(async ctx => {
      ctx.appId = "appId"
      ctx.trigger = "trigger"
      ctx.type = "type"
      ctx.page = "page"
      ctx.startDate = "startDate"
      ctx.endDate = "endDate"
      ctx.value = await ctx.returnedStore.searchBackups(ctx.appId, {
        trigger: ctx.trigger,
        type: ctx.type,
        page: ctx.page,
        startDate: ctx.startDate,
        endDate: ctx.endDate,
      })
    })

    it("calls and returns the API searchBackups method", ctx => {
      expect(API.searchBackups).toHaveBeenCalledTimes(1)
      expect(API.searchBackups).toHaveBeenCalledWith(ctx.appId, {
        trigger: ctx.trigger,
        type: ctx.type,
        page: ctx.page,
        startDate: ctx.startDate,
        endDate: ctx.endDate,
      })
      expect(ctx.value).toBe("searchBackupsReturn")
    })
  })

  describe("selectBackup", () => {
    beforeEach(ctx => {
      ctx.backupId = "backupId"
      ctx.returnedStore.selectBackup(ctx.backupId)
    })

    it("sets the state with the selected backup", ctx => {
      expect(ctx.writableReturn.update).toHaveBeenCalledTimes(1)
      expect(ctx.writableReturn.update.calls[0][0]({})).toEqual({
        selectedBackup: ctx.backupId,
      })
    })
  })

  describe("deleteBackup", () => {
    beforeEach(async ctx => {
      ctx.appId = "appId"
      ctx.backupId = "backupId"
      ctx.value = await ctx.returnedStore.deleteBackup(ctx.appId, ctx.backupId)
    })

    it("calls and returns the API deleteBackup method", ctx => {
      expect(API.deleteBackup).toHaveBeenCalledTimes(1)
      expect(API.deleteBackup).toHaveBeenCalledWith(ctx.appId, ctx.backupId)
      expect(ctx.value).toBe("deleteBackupReturn")
    })
  })

  describe("restoreBackup", () => {
    beforeEach(async ctx => {
      ctx.appId = "appId"
      ctx.backupId = "backupId"
      ctx.$name = "name" // `name` is used by some sort of internal ctx thing and is readonly
      ctx.value = await ctx.returnedStore.restoreBackup(
        ctx.appId,
        ctx.backupId,
        ctx.$name
      )
    })

    it("calls and returns the API restoreBackup method", ctx => {
      expect(API.restoreBackup).toHaveBeenCalledTimes(1)
      expect(API.restoreBackup).toHaveBeenCalledWith(
        ctx.appId,
        ctx.backupId,
        ctx.$name
      )
      expect(ctx.value).toBe("restoreBackupReturn")
    })
  })

  describe("subscribe", () => {
    it("calls and returns the API updateBackup method", ctx => {
      expect(ctx.returnedStore.subscribe).toBe(ctx.writableReturn.subscribe)
    })
  })
})
