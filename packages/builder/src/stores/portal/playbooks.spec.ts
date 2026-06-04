import { beforeEach, describe, expect, it, vi } from "vitest"
import type { FetchPlaybooksResponse, PlaybookResponse } from "@budibase/types"
import { API } from "@/api"
import { PlaybooksStore } from "./playbooks"

vi.mock("@/api", () => {
  return {
    API: {
      playbooks: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        exportBundle: vi.fn(),
        importBundle: vi.fn(),
      },
    },
  }
})

vi.mock("@budibase/frontend-core", () => {
  return {
    downloadStream: vi.fn(),
  }
})

const fetchPlaybooks = vi.mocked(API.playbooks.fetch)

const defer = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const playbook = (id: string): PlaybookResponse => ({
  _id: id,
  _rev: "1-rev",
  name: id,
  createdAt: "2026-01-01T00:00:00.000Z",
})

describe("PlaybooksStore", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not let an older fetch complete over a newer in-flight fetch", async () => {
    const store = new PlaybooksStore()
    const older = defer<FetchPlaybooksResponse>()
    const newer = defer<FetchPlaybooksResponse>()

    fetchPlaybooks
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise)

    const olderFetch = store.fetch()
    const newerFetch = store.fetch()

    older.resolve({ playbooks: [playbook("stale_playbook")] })
    await olderFetch

    const ensuredFetch = store.ensureFetched()

    expect(fetchPlaybooks).toHaveBeenCalledTimes(2)

    newer.resolve({ playbooks: [playbook("playbook_1")] })

    await expect(newerFetch).resolves.toEqual([playbook("playbook_1")])
    await expect(ensuredFetch).resolves.toEqual([playbook("playbook_1")])
  })
})
