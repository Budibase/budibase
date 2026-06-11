import { beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import { SourceName } from "@budibase/types"
import type { Datasource } from "@budibase/types"

const mockStores = vi.hoisted(() => {
  const createStore = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    const store = {
      subscribe: (callback: (value: T) => void) => {
        subscribers.add(callback)
        callback(value)
        return () => subscribers.delete(callback)
      },
      set: (next: T) => {
        value = next
        subscribers.forEach(callback => callback(value))
      },
      update: (updater: (value: T) => T) => {
        store.set(updater(value))
      },
    }
    return store
  }

  return {
    datasourceStore: createStore({ list: [] as Datasource[] }),
    queryStore: createStore({ list: [] }),
    oauthStore: createStore({ configs: [] }),
  }
})

vi.mock("@/stores/builder/datasources", () => ({
  datasources: mockStores.datasourceStore,
}))

vi.mock("@/stores/builder/queries", () => ({
  queries: mockStores.queryStore,
}))

vi.mock("@/stores/builder/oauth2", () => ({
  oauth2: mockStores.oauthStore,
}))

vi.mock("@/stores/builder/restTemplates", () => {
  const templates: Record<string, { id: string; name: string; icon: string }> =
    {
      bamboohr: { id: "bamboohr", name: "BambooHR", icon: "bamboohr.svg" },
      github: { id: "github", name: "GitHub", icon: "github.svg" },
    }

  return {
    restTemplates: {
      get: vi.fn((nameOrId?: string) => {
        if (!nameOrId) {
          return undefined
        }
        return (
          templates[nameOrId] ||
          Object.values(templates).find(t => t.name === nameOrId)
        )
      }),
    },
  }
})

const makeDatasource = (overrides: Partial<Datasource>): Datasource => ({
  _id: "datasource_1",
  _rev: "1",
  type: "datasource",
  name: "REST API",
  source: SourceName.REST,
  config: {},
  ...overrides,
})

import { WorkspaceConnectionStore } from "../workspaceConnection"

describe("WorkspaceConnectionStore", () => {
  beforeEach(() => {
    mockStores.datasourceStore.set({ list: [] })
  })

  it("preselects a connection when exactly one matches the requested REST template", () => {
    const workspaceConnections = new WorkspaceConnectionStore()

    mockStores.datasourceStore.set({
      list: [
        makeDatasource({
          _id: "bamboohr_ds",
          name: "BambooHR",
          restTemplateId: "bamboohr" as any,
        }),
        makeDatasource({
          _id: "github_ds",
          name: "GitHub",
          restTemplateId: "github" as any,
        }),
      ],
    })

    workspaceConnections.startDraft("github" as any)

    expect(get(workspaceConnections).draft?.query.datasourceId).toBe(
      "github_ds"
    )
  })

  it("does not preselect a connection when multiple match the requested REST template", () => {
    const workspaceConnections = new WorkspaceConnectionStore()

    mockStores.datasourceStore.set({
      list: [
        makeDatasource({
          _id: "github_ds",
          name: "GitHub",
          restTemplateId: "github" as any,
        }),
        makeDatasource({
          _id: "github_ds_2",
          name: "GitHub 2",
          restTemplateId: "github" as any,
        }),
      ],
    })

    workspaceConnections.startDraft("github" as any)

    expect(get(workspaceConnections).draft?.query.datasourceId).toBeUndefined()
  })

  it("exposes template ids on saved REST connections", () => {
    const workspaceConnections = new WorkspaceConnectionStore()

    mockStores.datasourceStore.set({
      list: [
        makeDatasource({
          _id: "github_ds",
          name: "GitHub",
          restTemplate: "GitHub" as any,
        }),
      ],
    })

    expect(get(workspaceConnections).list[0]).toMatchObject({
      sourceId: "github_ds",
      templateId: "github",
    })
  })
})
