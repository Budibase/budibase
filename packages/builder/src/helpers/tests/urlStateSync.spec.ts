import { beforeEach, describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"
import * as routify from "@roxi/routify"
import { syncURLToState } from "../urlStateSync"

type MockStore<T> = ReturnType<typeof writable<T>>

interface MockedRoutify {
  params: MockStore<Record<string, string>>
  page: MockStore<{ path: string }>
  isChangingPage: MockStore<boolean>
  goto: MockStore<(...args: unknown[]) => void>
  redirect: MockStore<(url: string) => void>
}

vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")

  return {
    goto: writable(vi.fn()),
    redirect: writable(vi.fn()),
    params: writable({}),
    page: writable({ path: "/builder/design/[screenId]/[componentId]" }),
    isChangingPage: writable(false),
  }
})

describe("syncURLToState", () => {
  const mockedRoutify = routify as typeof routify & MockedRoutify

  const buildStore = (selectedScreenId?: string) =>
    writable({
      selectedScreenId,
    })

  beforeEach(() => {
    mockedRoutify.params.set({
      screenId: "screen_1",
      componentId: "screen_1-screen",
    })
    mockedRoutify.page.set({ path: "/builder/design/[screenId]/[componentId]" })
    mockedRoutify.isChangingPage.set(false)
    mockedRoutify.goto.set(vi.fn())
    mockedRoutify.redirect.set(vi.fn())
  })

  it("redirects to the fallback when state is cleared and the URL still has a value", () => {
    const store = buildStore("screen_1")

    const stopSyncing = syncURLToState({
      urlParam: "screenId",
      stateKey: "selectedScreenId",
      fallbackUrl: "../new",
      validate: value => !!value,
      store,
      routify: mockedRoutify,
    })

    const goto = vi.fn()
    const redirect = vi.fn()

    mockedRoutify.goto.set(goto)
    mockedRoutify.redirect.set(redirect)

    store.set({ selectedScreenId: undefined })

    expect(redirect).toHaveBeenCalledWith("../new")
    expect(goto).not.toHaveBeenCalled()

    stopSyncing?.()
  })

  it("redirects to the fallback when both state and URL value are unset", () => {
    mockedRoutify.params.set({})

    const store = buildStore()

    const stopSyncing = syncURLToState({
      urlParam: "screenId",
      stateKey: "selectedScreenId",
      fallbackUrl: "../new",
      validate: value => !!value,
      store,
      routify: mockedRoutify,
    })

    const goto = vi.fn()
    const redirect = vi.fn()

    mockedRoutify.goto.set(goto)
    mockedRoutify.redirect.set(redirect)

    store.set({ selectedScreenId: undefined })

    expect(redirect).toHaveBeenCalledWith("../new")
    expect(goto).not.toHaveBeenCalled()

    stopSyncing?.()
  })
})
